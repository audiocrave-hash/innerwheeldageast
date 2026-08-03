# Facebook Graph API setup

The site is ready. You only need a **Page access token** once Facebook lets you log in on this device.

## When you can log in to Facebook

### 1. Get a Page access token

1. Open [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your Meta app (create one at [developers.facebook.com](https://developers.facebook.com/) if needed)
3. Permissions to add:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_read_user_content` (if offered)
4. Generate token → **Get Token** as a user who **manages the club Page**
5. Call:
   ```
   GET /me/accounts
   ```
6. In the response, find **Inner Wheel Club of Dagupan East** and copy:
   - `access_token` → this is the **Page access token**
   - `id` → should be `61591944000616`

Use a **long-lived** Page token if possible (exchange a short-lived user token first — see Meta docs).

### 2. Add GitHub secrets

Repo: https://github.com/audiocrave-hash/innerwheeldageast  
**Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Required? | Value |
|-------------|-----------|--------|
| `FB_PAGE_ACCESS_TOKEN` | **Yes** | Page access token from step 1 |
| `FB_PAGE_ID` | No | Defaults to `61591944000616` if omitted |

### 3. Run the fetch

1. **Actions → Fetch Facebook Posts → Run workflow**
2. On success, `data/posts.json` updates and the site redeploys
3. Open: https://audiocrave-hash.github.io/innerwheeldageast/activities.html

Daily auto-fetch runs at 06:00 UTC.

### Quick API test (optional)

```bash
curl "https://graph.facebook.com/v21.0/61591944000616/posts?fields=id,message,created_time,full_picture&limit=3&access_token=YOUR_PAGE_TOKEN"
```

## Security

- Never commit the token into files or chat
- Only store it as a GitHub Actions secret
- If it leaks, revoke it in Meta and create a new one
