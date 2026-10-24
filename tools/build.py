"""Assemble public/ pages from src/layout.html and src/pages/*.html.

Each page file starts with a front-matter block:
<!-- title: ... | desc: ... -->
"""
import hashlib, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
layout = (ROOT / "src/layout.html").read_text()
# content hashes bust browser and CDN caches whenever the shared CSS or JS changes
for asset in ("site.css", "site.js"):
    digest = hashlib.sha1((ROOT / "public/assets" / asset).read_bytes()).hexdigest()[:10]
    layout = layout.replace(f"/assets/{asset}\"", f"/assets/{asset}?v={digest}\"")

for page in sorted((ROOT / "src/pages").glob("*.html")):
    src = page.read_text()
    meta = dict(re.findall(r"(\w+):\s*([^|]+?)\s*(?:\||-->)", src.split("\n", 1)[0]))
    body = src.split("\n", 1)[1] if src.startswith("<!--") else src
    slug = page.stem
    html = (layout.replace("{{title}}", meta.get("title", "AFK"))
                  .replace("{{desc}}", meta.get("desc", "The teammate who knows what you're working on."))
                  .replace("{{slug}}", slug)
                  .replace("{{body}}", body.strip()))
    html = html.replace(f'data-nav="{slug}"', f'data-nav="{slug}" class="on"')
    # page-relative asset paths become absolute
    html = re.sub(r'(src|href)="(img|icons|logos|kit)/', r'\1="/\2/', html)
    out = ROOT / "public" / ("index.html" if slug == "index" else f"{slug}/index.html")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html)
    print("built", out.relative_to(ROOT))
