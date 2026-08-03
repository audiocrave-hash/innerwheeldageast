# Facebook Graph API setup (Recent Activities)

This site uses a **Page access token** and a GitHub Action to pull posts (text + photos) into `data/posts.json`. The Activities page reads that file.

You (or a club Page admin) must complete these steps once.

## 1. Create a Meta app

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. **My Apps → Create App**
3. Choose type suitable for business / manage a Page (e.g. Business)
4. Note your **App ID** and **App Secret** (App settings → Basic)

## 2. Add permissions (Development mode is fine for testing)

In the app, request / use these permissions when generating a token:

- `pages_show_list`
- `pages_read_engagement`
- `pages_read_user_content` (if required for your app)

For a **live** public app, these usually need **App Review**. While the app is in **Development**, tokens work for users who have a role on the app (admin/developer/tester) and who can manage the Page.

## 3. Get a Page access token

1. Open [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Generate a **User** token with the permissions above
4. Call `GET /me/accounts`
5. Copy the **access_token** for **Inner Wheel Club of Dagupan East** (Page token)
6. Page ID is typically `61591944000616` (confirm in the same response as `id`)

### Long-lived token (recommended)

Short-lived tokens expire in hours. Exchange for a long-lived user token, then get a long-lived Page token:

```text
GET https://graph.facebook.com/v21.0/oauth/access_token
  ?grant_type=fb_exchange_token
  &client_id={app-id}
  &client_secret={app-secret}
  &fb_exchange_token={short-lived-user-token}
```

Then:

```text
GET https://graph.facebook.com/v21.0/me/accounts?access_token={long-lived-user-token}
```

Use the Page `access_token` from that response. Page tokens from a long-lived user token often do not expire while the user remains admin and the app is valid—still re-check if the Action starts failing.

## 4. Add GitHub secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret name | Value |
|-------------|--------|
| `FB_PAGE_ID` | e.g. `61591944000616` |
| `FB_PAGE_ACCESS_TOKEN` | the **Page** access token |

Never commit the token to the repo.

## 5. Run the fetch workflow

1. Repo → **Actions → Fetch Facebook Posts → Run workflow**
2. On success, `data/posts.json` is updated and committed
3. **Deploy to GitHub Pages** runs on push and publishes the site

The workflow also runs **daily** on a schedule.

## 6. Test the API manually (optional)

```bash
curl "https://graph.facebook.com/v21.0/61591944000616/posts?fields=id,message,created_time,permalink_url,full_picture&limit=5&access_token=YOUR_PAGE_TOKEN"
```

You should see JSON with `data` posts.

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| `(#10) pages_read_engagement` | Token missing permission; or use a Page token from an admin, not an App token |
| Empty `data` | Page has no published posts visible to the token, or wrong Page ID |
| Token expired | Generate a new long-lived Page token and update the secret |
| Workflow fails on push | Ensure Actions has permission to write (workflow uses `contents: write`) |

## Security

- Only store the token in **GitHub Actions secrets**
- Limit who can manage the repo and Meta app
- If the token leaks, remove it in Meta and rotate the secret immediately
