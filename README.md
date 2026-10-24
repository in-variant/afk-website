# runs-website

Marketing site for Runs, at https://tryruns.com. Everyone on a team gets a capy, a calm helper
that remembers their work and answers teammates for them. The capybara is the mascot.

## Layout
- `public/index.html`: the whole site, one static page (inline CSS, Google Fonts Newsreader + Inter)
- `public/capy.svg`: the capybara mark, also the favicon
- `public/CNAME`: custom domain for GitHub Pages

## Local preview
    python3 -m http.server -d public 8000

## Deploy
Push to `main`. `.github/workflows/pages.yml` publishes `public/` to GitHub Pages.

## Domain
tryruns.com is registered at Squarespace Domains. DNS there points at GitHub Pages:
- `A @` to 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
- `CNAME www` to `in-variant.github.io`
