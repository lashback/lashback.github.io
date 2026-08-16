# Portfolio

Single-page portfolio built with [Eleventy](https://www.11ty.dev/).

## Run locally

```bash
npm install
npm start        # live-reload dev server at http://localhost:8080
npm run build    # outputs the static site to _site/
```

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which builds with
   Eleventy and publishes `_site/`.
