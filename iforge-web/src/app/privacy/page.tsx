import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import LegalPage from "@/components/LegalPage";

export async function generateMetadata(): Promise<Metadata> {
  const { siteConfig } = await getContent();
  return {
    title: "Privacy Policy",
    description: `How ${siteConfig.name} collects, uses and protects the information you share with us.`,
  };
}

export default async function PrivacyPage() {
  const { siteConfig } = await getContent();
  const email = siteConfig.contactEmail;
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="23 October 2026"
      intro={
        <p>
          This policy explains what information {siteConfig.name} (&ldquo;iForge&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;) collects through this website, why we collect it, and the choices you have. We
          collect only what we need to answer your enquiry and run this site.
        </p>
      }
      sections={[
        {
          heading: "Information you give us",
          body: (
            <>
              <p>When you use our contact form or project estimator, we collect what you choose to enter:</p>
              <ul>
                <li>your name, work email, and optionally your phone number and company;</li>
                <li>the service you&apos;re interested in, budget range, project scope and timeline;</li>
                <li>your message or project notes;</li>
                <li>the page of our site you sent the enquiry from.</li>
              </ul>
              <p>Please don&apos;t include passwords, payment details or other sensitive information in your message.</p>
            </>
          ),
        },
        {
          heading: "Information collected automatically",
          body: (
            <>
              <p>
                To protect our forms from spam, we briefly check the IP address a submission comes from. We use it only
                to limit repeated submissions and do not store it with your enquiry.
              </p>
              <p>
                Our hosting provider may keep standard server logs (such as IP address, browser type and the time of a
                request) for security and reliability.
              </p>
            </>
          ),
        },
        {
          heading: "How we use your information",
          body: (
            <ul>
              <li>to send you an automatic email confirming we received your enquiry;</li>
              <li>to read, respond to and follow up on your enquiry or quote request;</li>
              <li>to prepare proposals and manage any engagement that follows;</li>
              <li>to keep this website secure and prevent abuse.</li>
            </ul>
          ),
        },
        {
          heading: "AI-assisted handling of enquiries",
          body: (
            <p>
              We use an AI assistant to help us triage incoming enquiries — for example, to identify the relevant
              service area and to draft a first reply. A member of our team reviews every reply before anything is
              sent to you; the assistant does not contact you on its own. The assistant processes your enquiry using
              an AI model provider acting on our behalf.
            </p>
          ),
        },
        {
          heading: "Cookies and local storage",
          body: (
            <>
              <p>
                We do not use advertising or analytics cookies. The site stores your light/dark theme choice in your
                browser&apos;s local storage so it&apos;s remembered on your next visit. A login cookie is used only on
                our staff admin area.
              </p>
            </>
          ),
        },
        {
          heading: "Who we share it with",
          body: (
            <>
              <p>We don&apos;t sell your information. We share it only with service providers that help us run this site, under appropriate confidentiality and security obligations:</p>
              <ul>
                <li>our website hosting provider;</li>
                <li>our database provider, which stores enquiries;</li>
                <li>our email provider, which delivers your enquiry to our team, your confirmation email and our replies;</li>
                <li>the AI model provider used by our enquiry assistant.</li>
              </ul>
              <p>We may also disclose information where required by law.</p>
            </>
          ),
        },
        {
          heading: "How long we keep it",
          body: (
            <p>
              We keep enquiries for as long as needed to respond to you and manage any resulting engagement, and for
              no longer than 24 months after our last contact with you, unless the law requires us to keep it longer.
            </p>
          ),
        },
        {
          heading: "Your rights",
          body: (
            <>
              <p>
                Depending on where you live — including under India&apos;s Digital Personal Data Protection Act, 2023 —
                you may have the right to access the information we hold about you, have it corrected or erased,
                withdraw consent, and raise a grievance with us.
              </p>
              <p>
                To exercise any of these rights, email <a href={`mailto:${email}`}>{email}</a>. We&apos;ll respond
                within a reasonable time and in line with applicable law.
              </p>
            </>
          ),
        },
        {
          heading: "Security",
          body: (
            <p>
              We use reasonable technical and organisational measures to protect your information, including
              encrypted connections and restricted access to stored enquiries. No method of transmission or storage is
              completely secure, so we can&apos;t guarantee absolute security.
            </p>
          ),
        },
        {
          heading: "Children",
          body: <p>This website is intended for businesses and is not directed at anyone under 18.</p>,
        },
        {
          heading: "Changes and contact",
          body: (
            <>
              <p>
                We may update this policy from time to time; the date at the top shows when it last changed.
              </p>
              <p>
                Questions or grievances: <a href={`mailto:${email}`}>{email}</a>, or write to us at {siteConfig.address}.
                See also our <Link href="/terms">Terms of Use</Link>.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
