# Inner Wheel Club of Dagupan East — Website

Static website for the Inner Wheel Club of Dagupan East, with an automated daily feed of the
club's Facebook Page posts.

## Purpose

A public site for the club — home page, officers, past presidents, and an activities feed —
published on GitHub Pages with no manual content-copying step for the activities feed.

## Features

- **Automated Facebook post sync** — a scheduled GitHub Actions workflow calls the Facebook Graph
  API daily, writes the results to `data/posts.json`, and commits the update directly to the repo
- **Static pages** — home, officers, past presidents, activities (plain HTML/CSS/JS, no
  framework or build step)
- **Automatic deployment** — a second GitHub Actions workflow deploys the site to GitHub Pages on
  every push to `main`
- **Sample content fallback** — `data/posts.json` ships with placeholder posts and a note
  explaining they're shown until the Facebook token is configured and the fetch workflow runs

## Tech Stack

- **Frontend:** Plain HTML/CSS/JS, no framework
- **Automation:** Python (Facebook Graph API fetch script), GitHub Actions (scheduled fetch +
  Pages deployment)
- **Hosting:** GitHub Pages

## Running Locally

No build step — open any `.html` file directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

To run the Facebook fetch script locally, set `FB_PAGE_ACCESS_TOKEN` (and optionally `FB_PAGE_ID`,
`FB_POSTS_LIMIT`, `FB_API_VERSION`) as environment variables, then:

```bash
python3 scripts/fetch_fb_posts.py
```

See `FACEBOOK_SETUP.md` for how to obtain a Page access token and configure it as a GitHub Actions
secret (`FB_PAGE_ACCESS_TOKEN`) — the token is never committed to the repo, only read from the
environment/secret at fetch time.

## Status

**Active.** Live on GitHub Pages with a working scheduled content-sync pipeline.

## License

No open-source license has currently been assigned.
