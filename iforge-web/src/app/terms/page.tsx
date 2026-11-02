import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content";
import LegalPage from "@/components/LegalPage";

export async function generateMetadata(): Promise<Metadata> {
  const { siteConfig } = await getContent();
  return {
    title: "Terms of Use",
    description: `The terms that apply when you use the ${siteConfig.name} website.`,
  };
}

export default async function TermsPage() {
  const { siteConfig } = await getContent();
  const email = siteConfig.contactEmail;
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Use"
      updated="22 October 2026"
      intro={
        <p>
          These terms apply to your use of this website, operated by {siteConfig.name} (&ldquo;iForge&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;). By using the site, you agree to them. If you don&apos;t agree,
          please don&apos;t use the site.
        </p>
      }
      sections={[
        {
          heading: "About this website",
          body: (
            <p>
              This site describes our IT services and lets you contact us. Its content is general information about
              what we do — it is not professional advice for your specific situation. Any advice or work we provide is
              governed by a separate written agreement.
            </p>
          ),
        },
        {
          heading: "Estimates and enquiries",
          body: (
            <p>
              Figures produced by the project estimator are indicative only and are not a quote or offer. Sending an
              enquiry or estimate request does not create a contract or oblige either of us to proceed. Pricing,
              timelines and scope are confirmed only in a signed proposal or agreement.
            </p>
          ),
        },
        {
          heading: "Using the site",
          body: (
            <>
              <p>You agree not to:</p>
              <ul>
                <li>use the site for anything unlawful, misleading or harmful;</li>
                <li>send spam, malicious code, or content you don&apos;t have the right to share;</li>
                <li>attempt to gain unauthorised access to the site, its admin area, or connected systems;</li>
                <li>interfere with the site&apos;s security or normal operation, including by automated scraping or flooding the forms.</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Intellectual property",
          body: (
            <p>
              The site&apos;s content, design and branding belong to iForge or its licensors. You may view and share
              pages for personal or internal business purposes, but you may not copy, modify or republish substantial
              parts of the site without our written permission.
            </p>
          ),
        },
        {
          heading: "Links to other sites",
          body: (
            <p>
              The site may link to third-party websites. We don&apos;t control them and aren&apos;t responsible for their
              content or practices.
            </p>
          ),
        },
        {
          heading: "No warranties",
          body: (
            <p>
              We work to keep the site accurate and available, but it is provided &ldquo;as is&rdquo;. We don&apos;t
              guarantee that it will be uninterrupted, error-free, or that its content is complete or current.
            </p>
          ),
        },
        {
          heading: "Limitation of liability",
          body: (
            <p>
              To the extent permitted by law, iForge is not liable for any indirect or consequential loss arising from
              your use of, or inability to use, this website. Nothing in these terms limits liability that cannot be
              limited by law.
            </p>
          ),
        },
        {
          heading: "Privacy",
          body: (
            <p>
              How we handle information you send us is explained in our <Link href="/privacy">Privacy Policy</Link>.
            </p>
          ),
        },
        {
          heading: "Governing law",
          body: (
            <p>
              These terms are governed by the laws of India. Disputes relating to them are subject to the courts of
              Noida, Uttar Pradesh.
            </p>
          ),
        },
        {
          heading: "Changes and contact",
          body: (
            <p>
              We may update these terms from time to time; the date at the top shows when they last changed. Questions:{" "}
              <a href={`mailto:${email}`}>{email}</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
