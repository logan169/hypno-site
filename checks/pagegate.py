#!/usr/bin/env python3
"""
pagegate.py — per-page quality gate for the Marion site.

Fails (RED, exit 1) on:
  1. CSS coverage — every class token referenced in a page must appear as
     `.token` in at least one CSS file.  Compound selectors (.a.b) count.
  2. H1 — exactly one <h1> per page (except 404.html).
  3. EN/FR invariant — EN_HOME array length >= index.html data-i18n node count,
     EN_SUBPAGE array length >= max data-i18n node count on any sub-page
     (this mirrors the main.js rule `EN_LIST = (count > 50) ? EN_HOME : EN_SUBPAGE`).

Usage:
  pagegate.py local <_site_dir>
  pagegate.py live  <base_url>
"""
import sys, re
from pathlib import Path
from urllib.request import urlopen
from urllib.error import URLError


def token_styled(tok, css_blob):
    """Return True if `tok` appears as `.tok` in css_blob (compound ok)."""
    return bool(re.search(r'\.' + re.escape(tok) + r'(?![a-zA-Z0-9-])', css_blob))


def css_blob_local(sitedir):
    out = ''
    for f in sorted(Path(sitedir).glob('assets/css/*.css')):
        try:
            out += f.read_text() + '\n'
        except Exception as e:
            print(f"  warn: could not read {f}: {e}")
    return out


def css_blob_live(baseurl):
    out = ''
    for name in ('marion.css', 'revue.css'):
        try:
            out += urlopen(baseurl + '/assets/css/' + name, timeout=30).read().decode('utf-8', 'replace') + '\n'
        except Exception as e:
            print(f"  warn: could not fetch {name}: {e}")
    return out


def count_en_strings(js, name):
    """Count top-level string elements in `var NAME = [...]` (handles both quote styles)."""
    m = re.search(r'var\s+' + name + r'\s*=\s*\[', js)
    if not m:
        return None
    i = m.end() - 1
    depth = 0
    in_str = False
    esc = False
    j = i
    close = -1
    while j < len(js):
        ch = js[j]
        if not in_str:
            if ch == '"' or ch == "'":
                in_str = True
                in_str_char = ch
            elif ch == '[':
                depth += 1
            elif ch == ']':
                depth -= 1
                if depth == 0:
                    close = j
                    break
        else:
            if esc:
                esc = False
            elif ch == '\\':
                esc = True
            elif ch == in_str_char:
                in_str = False
        j += 1
    if close < 0:
        return None
    seg = js[i:close + 1]
    # Count top-level strings: split by commas outside strings and count tokens starting with a quote
    count = 0
    j = 1  # skip the '['
    in_str = False
    esc = False
    while j < len(seg):
        ch = seg[j]
        if not in_str:
            if ch == '"' or ch == "'":
                if count == 0 or True:
                    # start a new string — count at top level
                    count += 1
                    in_str_char = ch
                in_str = True
            elif ch == ',':
                pass
        else:
            if esc:
                esc = False
            elif ch == '\\':
                esc = True
            elif ch == in_str_char:
                in_str = False
        j += 1
    return count


def data_i18n_count(html):
    # Exact attribute name `data-i18n` — must NOT match `data-i18n-attr`.
    # Matches the CSS selector used by main.js: querySelectorAll('[data-i18n]')
    return len(re.findall(r'(?<![\w-])data-i18n(?![\w-])', html))


def check_page(html, css_blob):
    refs = set()
    for attrs in re.findall(r'class="([^"]+)"', html):
        for tok in attrs.split():
            tok = tok.strip('.')
            if tok:
                refs.add(tok)
    return [t for t in refs if not token_styled(t, css_blob)]


def run_local(sitedir):
    sitedir = Path(sitedir)
    pages = sorted(set(sitedir.glob('**/index.html')) | {p for p in sitedir.glob('*.html')})
    css_blob = css_blob_local(sitedir)
    red = []
    for p in pages:
        rel = p.relative_to(sitedir)
        html = p.read_text()
        m = check_page(html, css_blob)
        if m:
            red.append(('css', str(rel), sorted(m)))
        if p.name != '404.html':
            h1s = len(re.findall(r'<h1[\s>]', html))
            if h1s != 1:
                red.append(('h1', str(rel), f'{h1s} h1 tags'))
    mainjs = sitedir / 'assets' / 'js' / 'main.js'
    if mainjs.exists():
        js = mainjs.read_text()
        en_home = count_en_strings(js, 'EN_HOME')
        en_sub = count_en_strings(js, 'EN_SUBPAGE')
        idx_file = sitedir / 'index.html'
        idx = data_i18n_count(idx_file.read_text()) if idx_file.exists() else 0
        if en_home is not None and en_home < idx:
            red.append(('en_home', 'index', {'EN_HOME': en_home, 'index data-i18n': idx}))
        subs = [p for p in set(sitedir.glob('**/index.html')) if p.parent != sitedir]
        sub_max = 0
        for p in subs:
            try:
                sub_max = max(sub_max, data_i18n_count(p.read_text()))
            except Exception:
                pass
        if en_sub is not None and en_sub < sub_max:
            red.append(('en_sub', 'max subpage', {'EN_SUBPAGE': en_sub, 'max': sub_max}))
    return pages, red


def run_live(baseurl):
    baseurl = baseurl.rstrip('/')
    css_blob = css_blob_live(baseurl)
    pages = [f"{baseurl}/{s}/" for s in (
        '.', 'parcours', 'ecrits',
        'revue/perimena', 'revue/hypnoscience', 'revue/stress-snc',
        'revue/douleur', 'revue/integratif', 'revue/sommeil-hormones',
    )]
    red = []
    for pu in pages:
        try:
            html = urlopen(pu, timeout=30).read().decode('utf-8', 'replace')
        except URLError as e:
            red.append(('http', pu, str(e)))
            continue
        m = check_page(html, css_blob)
        if m:
            red.append(('css', pu, sorted(m)))
    return pages, red


def report(mode, pages, red):
    print(f"=== pagegate: {mode} ===")
    print(f"pages scanned: {len(pages)}")
    if red:
        print(f"RED: {len(red)} issue(s)")
        for kind, where, detail in red:
            print(f"  [{kind}] {where}: {detail}")
        sys.exit(1)
    else:
        print("GREEN: no issues")
        sys.exit(0)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(2)
    mode, target = sys.argv[1], sys.argv[2]
    if mode == "local":
        pages, red = run_local(target)
    elif mode == "live":
        pages, red = run_live(target)
    else:
        print("mode must be 'local' or 'live'")
        sys.exit(2)
    report(mode, pages, red)
