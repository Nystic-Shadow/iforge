import "server-only";
import nodemailer from "nodemailer";
import { SITE_URL } from "@/data/siteData";
import { getContent } from "@/lib/content";
import { logEvent, type Inquiry } from "@/lib/inquiries";
import { getMailSettings, isMailReady, type MailSettings } from "@/lib/settings";

/**
 * Outgoing email over SMTP, using the mailbox set in Admin → Email (Google
 * Workspace, Microsoft 365, Zoho, or any domain mail server). Sends:
 *  - a copy of each new enquiry to up to 5 team addresses,
 *  - an optional confirmation to the person who sent it,
 *  - the reply you approve in the inbox.
 * The company name comes from the admin-edited site content.
 */

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Plain text → simple HTML paragraphs, matching the text version exactly. */
function toHtml(text: string): string {
  const paras = text
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:#111;max-width:600px">${paras}</div>`;
}

const companyName = async () => (await getContent()).siteConfig.name;

interface Message {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
}

async function send(s: MailSettings, msg: Message): Promise<void> {
  const transport = nodemailer.createTransport({
    host: s.host,
    port: s.port,
    secure: s.secure,
    auth: { user: s.user, pass: s.pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  try {
    await transport.sendMail({
      from: { name: s.fromName || (await companyName()), address: s.fromEmail },
      to: msg.to,
      replyTo: msg.replyTo,
      subject: msg.subject,
      text: msg.text,
      html: toHtml(msg.text),
    });
  } finally {
    transport.close();
  }
}

const reason = (e: unknown) => (e instanceof Error ? e.message : "send failed");

async function readySettings(): Promise<MailSettings | null> {
  try {
    const s = await getMailSettings();
    return isMailReady(s) ? s : null;
  } catch {
    return null;
  }
}

/** Whether a mailbox is set up, for the admin panel's status. */
export async function isEmailReady(): Promise<boolean> {
  return Boolean(await readySettings());
}

const firstName = (name: string) => name.trim().split(/\s+/)[0] || "there";

function detailLines(inq: Inquiry): string {
  return [
    ["Service", inq.service],
    ["Budget", inq.budget],
    ["Scope", inq.scope],
    ["Timeline", inq.timeline],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

/**
 * On a new enquiry: email the team, then (if enabled) confirm to the sender.
 * Each outcome is logged on the enquiry; failures never throw.
 */
export async function emailNewInquiry(inq: Inquiry): Promise<void> {
  const s = await readySettings();
  if (!s) return;
  const name = await companyName().catch(() => "");

  if (s.recipients.length) {
    const contact = [
      `Name: ${inq.name}`,
      inq.company ? `Company: ${inq.company}` : "",
      `Email: ${inq.email}`,
      inq.phone ? `Phone: ${inq.phone}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const text = [
      `New ${inq.source === "quote" ? "quote request" : "enquiry"} on the website — ${inq.ticket}`,
      contact,
      detailLines(inq),
      inq.message ? `Message:\n${inq.message}` : "",
      `Open in the inbox: ${SITE_URL}/admin?open=${inq.id}`,
      "Reply to this email to answer the customer directly.",
    ]
      .filter(Boolean)
      .join("\n\n");
    try {
      await send(s, {
        to: s.recipients,
        replyTo: inq.email,
        subject: `New enquiry ${inq.ticket} — ${inq.name}${inq.service ? ` (${inq.service})` : ""}`,
        text,
      });
      await logEvent(inq.id, "email.notify", `to ${s.recipients.join(", ")}`);
    } catch (e) {
      await logEvent(inq.id, "email.failed", `team copy: ${reason(e)}`);
    }
  }

  if (s.confirmToCustomer) {
    const text = [
      `Hi ${firstName(inq.name)},`,
      `Thanks for contacting ${name || "us"}. We've received your ${
        inq.source === "quote" ? "project estimate request" : "message"
      } — your reference is ${inq.ticket}.`,
      "A member of our team will reply to you personally. If you need to add anything, just reply to this email.",
      detailLines(inq),
      inq.message ? `Your message:\n${inq.message}` : "",
      name ? `— ${name}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
    try {
      await send(s, { to: inq.email, subject: `We've received your enquiry (${inq.ticket})`, text });
      await logEvent(inq.id, "email.confirmation", `to ${inq.email}`);
    } catch (e) {
      await logEvent(inq.id, "email.failed", `confirmation: ${reason(e)}`);
    }
  }
}

/** Email the enquiry's approved reply to the customer. Throws if it fails. */
export async function sendReply(inq: Inquiry): Promise<void> {
  const reply = inq.reply?.trim();
  if (!reply) throw new Error("Write a reply first.");
  const s = await readySettings();
  if (!s) throw new Error("Email isn't set up — add your mailbox in Admin → Email.");
  try {
    await send(s, { to: inq.email, subject: `Re: your enquiry (${inq.ticket}) — ${await companyName()}`, text: reply });
  } catch (e) {
    await logEvent(inq.id, "email.failed", `reply: ${reason(e)}`);
    throw new Error(reason(e));
  }
  await logEvent(inq.id, "email.reply", `to ${inq.email}`);
}

/** Send a test message with the saved settings. Throws with the SMTP error. */
export async function sendTestEmail(): Promise<string[]> {
  const s = await getMailSettings();
  if (!isMailReady(s)) throw new Error("Fill in the server, username, password and From address, then save.");
  const to = s.recipients.length ? s.recipients : [s.fromEmail];
  await send(s, {
    to,
    subject: `Test email from the ${await companyName()} website`,
    text: `This is a test from your website's admin panel.\n\nIf you're reading this, new enquiries will be emailed to: ${
      s.recipients.join(", ") || "(no team addresses added yet)"
    }.`,
  });
  return to;
}
