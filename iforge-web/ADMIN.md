# Admin panel, enquiry inbox & Hermes

Everything editable on the site — content, the team, and enquiries from the
website — is managed at **`/admin`**, with no code changes.

| Section | What it does |
| --- | --- |
| **Inbox** | Every contact-form and quote-wizard submission, live. Change status, assign to Hermes or yourself, keep notes, draft a reply, and see an activity log of everything that happened. |
| **Team** | The people on the public `/team` page: photo upload, name, role, bio, links, order. Turn on **Core member** to list someone in the Core team section; everyone else appears under Our team. Photos are optional. |
| **Content** | Site & contact info (also used by the nav, footer, page titles and emails), the services, About (values + timeline), Community. |

## 1. Sign in

In `iforge-web/.env.local`:

```
ADMIN_PASSWORD=choose-a-strong-password
```

Restart the dev server and sign in at `/admin`.

## 2. Where data is saved

- **Without Supabase (development):** edits, enquiries and team photos are
  saved to local files — `.data/` and `public/uploads/` (both gitignored). The
  sidebar shows **Local files (dev)**. Fine on your machine or a server with a
  persistent disk (Docker: the `iforge_data` volume), but serverless hosts such
  as Vercel don't keep files — there the admin refuses to save and shows a
  warning until Supabase is connected.
- **With Supabase (production):**
  1. Create a free project at <https://supabase.com>.
  2. In the **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql)
     once. It creates the `site_content` and `inquiries` tables and the public
     `media` bucket for team photos.
  3. From **Project Settings → API**, add to `.env.local`:

     ```
     NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...        # "anon" / public key
     SUPABASE_SERVICE_ROLE_KEY=eyJ...            # "service_role" key — server only
     ```

  4. Restart. The sidebar shows **Supabase**.

> The `service_role` key bypasses row-level security. Keep it on the server only.

## 3. Notifications

While any admin page is open, it checks for new enquiries every 10 seconds
(and whenever you come back to the tab). A new one raises:

- a toast in the corner (click it to open the enquiry),
- a red count on **Inbox** and in the browser tab title,
- a desktop notification — click **Enable desktop alerts** in the Inbox once.

## 4. Hermes — your agent triages every enquiry

Hermes (Nous Research Hermes Agent, running on your VPS) is connected two ways:

- **Webhook (site → Hermes):** each new enquiry is POSTed to a Hermes webhook
  route, signed in Hermes's V2 format.
- **MCP (Hermes → site):** Hermes reads and updates enquiries through the
  site's MCP endpoint, `https://<your-site>/api/mcp`.

When an enquiry arrives, Hermes reads it, sets it to **In progress**, writes
triage notes (area, priority, fit, what's missing, next step) and drafts a
reply. Everything appears in the Inbox, credited to Hermes. It then sends you
a short **WhatsApp alert** (ticket, contact details, priority, summary and a
link to open it in the Inbox) — set `chat_id` under `deliver_extra` in the
route to your own WhatsApp chat. **Replies are
drafts** — Hermes never emails the customer. You review the draft, edit it,
and press **Send reply** (see Email below).

### Email

Mail is sent over SMTP from your own mailbox — Google Workspace/Gmail,
Microsoft 365, Zoho, or any domain mail host. Set it up in **Admin → Email**
(no environment variables or redeploy needed):

- **Mail provider:** pick a preset or enter the SMTP server, port, security,
  username and password. Google needs an **App Password**; Microsoft 365 needs
  "Authenticated SMTP" turned on for the mailbox.
- **Sender:** the From name and address (usually the mailbox itself).
  Customers' replies come back to it.
- **Send new enquiries to:** up to 5 addresses. Each gets every contact-form
  and quote request; replying to that email answers the customer.
- **Confirmation:** optionally send the customer an automatic "we got it"
  email with their ticket number.
- **Send test email** checks the saved settings and shows the server's error
  if something's wrong.

Each enquiry in the Inbox also gets a **Send reply** button that emails the
reply after you confirm. Every email sent, or failed, shows in the enquiry's
Activity.

The settings live in the private `app_settings` table (only the server can
read it; the password is never sent back to the browser). Run the latest
`supabase/schema.sql` once to create it.

### Files

| File | Where it goes |
| --- | --- |
| [`hermes/config.snippet.yaml`](hermes/config.snippet.yaml) | Merge into `~/.hermes/config.yaml` on the VPS (webhook route + MCP server) |
| `hermes/hermes.env` *(gitignored, generated with your keys)* | Copy its lines into `~/.hermes/.env` on the VPS |
| [`hermes/hermes.env.example`](hermes/hermes.env.example) | Blank version, documenting each value |

The site's matching keys are already in `.env.local`: `AGENT_API_KEY` (equals
Hermes's `IFORGE_AGENT_KEY`) and `HERMES_WEBHOOK_SECRET` (equals Hermes's
`WEBHOOK_SECRET`).

### Setup on the VPS

1. Copy the lines from `hermes/hermes.env` into `~/.hermes/.env`, and set
   `IFORGE_SITE_URL` to your site's public address (e.g. `https://iforge.in`).
2. Merge `hermes/config.snippet.yaml` into `~/.hermes/config.yaml`.
3. Restart the Hermes gateway (`hermes gateway run` shows logs in the
   foreground), then run `/reload-mcp`.
4. Check the webhook receiver: `curl http://localhost:8644/health` on the VPS
   should return `{"status": "ok", "platform": "webhook"}`.

### Networking

- **Site → Hermes:** the site must reach the VPS's webhook route. Put Hermes's
  port `8644` behind HTTPS (e.g. a Caddy or Nginx reverse proxy for
  `/webhooks/`), then set on the site:

  ```
  HERMES_WEBHOOK_URL=https://<your-vps-domain>/webhooks/iforge-enquiries
  ```

- **Hermes → site:** the VPS must reach `https://<your-site>/api/mcp`, so the
  site needs a public address. While the site only runs on your PC, expose it
  with a tunnel (e.g. `cloudflared tunnel --url http://localhost:3000`) and use
  that URL as `IFORGE_SITE_URL`.
- On your host (e.g. Vercel), set `AGENT_API_KEY`, `HERMES_WEBHOOK_SECRET` and
  `HERMES_WEBHOOK_URL` in the environment settings.

### What the site sends

```http
POST /webhooks/iforge-enquiries
Content-Type: application/json
X-Webhook-Timestamp: <unix seconds>
X-Webhook-Signature-V2: <hex HMAC-SHA256 of "<timestamp>.<body>", keyed with the shared secret>

{ "event_type": "inquiry.created", "sentAt": "…", "inquiry": { …the full enquiry… } }
```

Delivery (or the reason it failed) is recorded in the enquiry's activity log,
so the Inbox shows whether Hermes received it.

### MCP tools Hermes gets

| Tool (as Hermes sees it) | Does |
| --- | --- |
| `mcp__iforge__list_inquiries` | List enquiries, filter by `status` / `since` (read-only) |
| `mcp__iforge__get_inquiry` | Read one enquiry in full (read-only) |
| `mcp__iforge__update_inquiry` | Set `status`, `notes`, draft `reply`, `assignee` |

Requests need `Authorization: Bearer <AGENT_API_KEY>`. Updating an unassigned
enquiry assigns it to Hermes; every change is logged as a Hermes action. The
same operations are also available as plain REST at `/api/agent/inquiries`
(`GET`) and `/api/agent/inquiries/<id>` (`GET`, `PATCH`).

### Safety

Enquiry text comes from the public. The route's prompt only templates fields
every enquiry has (ticket, name, id) and tells Hermes to treat the enquiry as
untrusted data. Leave the route's `toolsets` unset: webhook runs then keep
Hermes's restricted default (web search and reading, no terminal or file
access).

### If Hermes says it can't see the iforge tools

The Hermes docs don't state whether MCP tools are available to webhook runs
under the restricted default. If a run reports that `mcp__iforge__*` tools are
missing, add the MCP toolset to the route's `toolsets` — check `hermes`'s
config validation output for the exact toolset name, and add only that.

## 5. GitHub skyline (Community page)

Set `GITHUB_USERNAME` and a `GITHUB_TOKEN` (classic token, `read:user` scope),
or set the username in **Content → Community**. Without a token the skyline
shows a "Connect GitHub" empty state — never demo data.

## Deploying

Add the same variables in your host's environment settings (e.g. Vercel →
Project → Settings → Environment Variables), connect Supabase, and never
commit secrets to the repo.
