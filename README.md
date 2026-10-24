# runs-website

Marketing site for Runs, at https://tryruns.com. Everyone on a team gets a capy, a calm helper
that remembers their work and answers teammates for them. The capybara is the mascot.

## Layout
- `public/index.html`: the whole site, one static page, inline CSS and JS
- `public/kit/fonts`: Invariant brand faces (D-DIN, Geist, Geist Mono, JetBrains Mono) from the web-ui kit
- `public/img`: capybara mascot and painted scenes, generated with Gemini (`tools/gen_image.py`)
- `public/logos`, `public/icons`: customer logos (Wikimedia Commons) and integration icons (simple-icons, CC0)
- `public/CNAME`: custom domain for GitHub Pages

## Build and preview
Pages live in `src/pages/*.html` (body only, title and description in the first-line comment) and share `src/layout.html` (head, nav, footer), `public/assets/site.css` and `public/assets/site.js`.

    python3 tools/build.py              # writes public/index.html and public/<page>/index.html
    python3 -m http.server -d public 8765

Art is generated with `tools/gen_image.py` (Gemini, key from GEMINI_API_KEY or ~/.hermes/.env); the shared art direction is in `tools/prompts.txt`. `tools/cutout.py` makes the capybara cut-outs transparent (needs Pillow, NumPy, SciPy).

## Deploy
Push to `main`. `.github/workflows/pages.yml` publishes `public/` to GitHub Pages.

## Domain
tryruns.com is registered at Squarespace Domains. DNS there points at GitHub Pages:
- `A @` to 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
- `CNAME www` to `in-variant.github.io`
