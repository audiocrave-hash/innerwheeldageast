#!/usr/bin/env python3
"""Fetch public Page posts from Facebook Graph API and write data/posts.json."""

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

API_VERSION = os.environ.get("FB_API_VERSION", "v21.0")
PAGE_ID = os.environ.get("FB_PAGE_ID", "").strip()
TOKEN = os.environ.get("FB_PAGE_ACCESS_TOKEN", "").strip()
LIMIT = int(os.environ.get("FB_POSTS_LIMIT", "10"))

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "posts.json"

FIELDS = (
    "id,message,created_time,permalink_url,full_picture,"
    "attachments{media_type,media,url,title,description,subattachments}"
)


def die(msg: str, code: int = 1) -> None:
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(code)


def graph_get(path: str, params: dict) -> dict:
    qs = urllib.parse.urlencode(params)
    url = f"https://graph.facebook.com/{API_VERSION}/{path}?{qs}"
    req = urllib.request.Request(url, headers={"User-Agent": "iwcde-site-fetcher/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        die(f"Graph API HTTP {e.code}: {body}")
    except Exception as e:
        die(f"Request failed: {e}")


def extract_images(post: dict) -> list:
    images = []
    if post.get("full_picture"):
        images.append(post["full_picture"])

    atts = (post.get("attachments") or {}).get("data") or []
    for att in atts:
        media = att.get("media") or {}
        image = media.get("image") or {}
        src = image.get("src")
        if src and src not in images:
            images.append(src)
        for sub in (att.get("subattachments") or {}).get("data") or []:
            sm = (sub.get("media") or {}).get("image") or {}
            ssrc = sm.get("src")
            if ssrc and ssrc not in images:
                images.append(ssrc)
    return images


def normalize(post: dict) -> dict:
    return {
        "id": post.get("id"),
        "message": post.get("message") or "",
        "created_time": post.get("created_time") or "",
        "permalink_url": post.get("permalink_url") or "",
        "images": extract_images(post),
    }


def main() -> None:
    if not PAGE_ID or not TOKEN:
        die(
            "Set FB_PAGE_ID and FB_PAGE_ACCESS_TOKEN environment variables "
            "(GitHub repo secrets)."
        )

    data = graph_get(
        f"{PAGE_ID}/posts",
        {
            "fields": FIELDS,
            "limit": str(LIMIT),
            "access_token": TOKEN,
        },
    )

    posts = [normalize(p) for p in data.get("data") or []]
    payload = {
        "source": "facebook_graph_api",
        "page_id": PAGE_ID,
        "count": len(posts),
        "posts": posts,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(posts)} posts to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
