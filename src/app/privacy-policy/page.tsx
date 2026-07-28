"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Privacy Policy — single-page article.
 *
 * - Semantic HTML (<article>, <section>, <h1>–<h3>)
 * - Sticky table-of-contents sidebar on desktop with scroll-spy
 * - Mobile-first responsive layout (single column on small screens)
 * - Brand accents: #1C1D62 (deep indigo), #304AC0 (brand blue), #87B73C (logo green)
 */

type TocItem = { id: string; label: string };

const TOC: TocItem[] = [
  { id: "introduction", label: "1. Introduction" },
  { id: "information-we-collect", label: "2. Information We Collect" },
  { id: "how-we-use", label: "3. How We Use Your Information" },
  { id: "sharing-disclosure", label: "4. Information Sharing & Disclosure" },
  { id: "data-security", label: "5. Data Security" },
  { id: "data-retention", label: "6. Data Retention" },
  { id: "your-rights", label: "7. Your Rights" },
  { id: "cookies", label: "8. Cookies & Tracking Technologies" },
  { id: "third-party-links", label: "9. Third-Party Links" },
  { id: "childrens-privacy", label: "10. Children's Privacy" },
  { id: "changes", label: "11. Changes to This Policy" },
  { id: "contact", label: "12. Contact Us" },
];

const LAST_UPDATED = "24 June 2026";

export default function PrivacyPolicyPage() {
  const [activeId, setActiveId] = useState<string>("introduction");

  // Scroll-spy: highlight the section currently in view.
  useEffect(() => {
    const ids = TOC.map((t) => t.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Trigger when section heading reaches ~25% from the top of the viewport.
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0,
      }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-[#F0F4FF] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1C1D62] to-[#13277E] text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/20 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#87B73C]" aria-hidden="true" />
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-white/70 text-sm sm:text-base">
            Last updated:{" "}
            <time dateTime="2026-06-24" className="font-medium text-white/90">
              {LAST_UPDATED}
            </time>
          </p>
        </div>
      </section>

      {/* Content + TOC */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-8 lg:gap-12">
          {/* Table of Contents — desktop sticky sidebar */}
          <aside className="hidden lg:block" aria-label="Table of contents">
            <nav className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#1C1D62] mb-3">
                On this page
              </h2>
              <ul className="space-y-1 border-l border-[#E8ECF0]">
                {TOC.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`block border-l-2 -ml-[1px] py-1.5 pl-4 text-sm transition-colors ${
                          isActive
                            ? "border-[#87B73C] text-[#1C1D62] font-semibold bg-[#87B73C]/5"
                            : "border-transparent text-[#4A5568] hover:text-[#304AC0] hover:border-[#304AC0]/40"
                        }`}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Article body */}
          <article className="bg-white rounded-2xl shadow-sm border border-[#E8ECF0] p-6 sm:p-10 md:p-14">
            {/* Intro */}
            <div className="text-[#2D3748] space-y-4">
              <p className="text-lg leading-relaxed">
                Welcome to{" "}
                <strong className="text-[#1C1D62]">Credora Fintech Pvt Ltd</strong>{" "}
                (&ldquo;Credora&rdquo;, the &ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;,
                or &ldquo;our&rdquo;). The domain{" "}
                <strong className="text-[#1C1D62]">www.credorafin.com</strong> (the{" "}
                &ldquo;Website&rdquo;) is owned and operated by Credora, a company incorporated under
                the Companies Act, 2013 (CIN: U66190TN2025PTC181555; GST: 33AAMCC8358C1ZM), having
                its registered office at 1157, 17th Street, Anna Nagar West Extension, Padi,
                Chennai, Tamil Nadu 600050.
              </p>
              <p className="leading-relaxed">
                Credora Fintech is a loan structuring and financial advisory firm that helps
                businesses, traders, exporters, and professionals access funding by connecting them
                with a curated network of 70+ banks and Non-Banking Financial Companies (NBFCs).
                Credora is an advisory and placement intermediary; it is not a bank, NBFC, or direct
                lender, and does not itself sanction or disburse loans.
              </p>
              <p className="leading-relaxed">
                We respect the privacy of everyone who visits or uses the Website, our Contact Us and
                Referral Partner forms, and our customer/partner login portal (together, the{" "}
                &ldquo;Credora Platforms&rdquo;), and are committed to protecting personal
                information shared with us in accordance with the Digital Personal Data Protection
                Act, 2023 (&ldquo;DPDP Act&rdquo;) and other applicable Indian laws.
              </p>
              <p className="text-sm text-[#718096] italic">
                Your use of the Credora Platforms signifies your acknowledgment and consent to this
                Privacy Policy. If you object to your information being collected, used, or shared as
                described herein, please do not submit your information through the Credora
                Platforms.
              </p>
            </div>

            <hr className="my-10 border-[#E8ECF0]" />

            {/* Sections */}
            <div className="space-y-12 text-[#2D3748]">
              {/* 1. Introduction */}
              <Section id="introduction" number="1" title="Introduction">
                <p>
                  This Privacy Policy explains who we are, what personal information we collect, how
                  we use it, with whom we share it, how long we keep it, and the rights you have over
                  it. It applies to all visitors, inquirers, referral partners, and clients of the
                  Credora Platforms, regardless of whether you proceed to engage our advisory
                  services.
                </p>
                <p>
                  Credora is a financial advisory and loan-structuring intermediary. We do not
                  sanction or disburse loans ourselves; we assess your funding requirement, structure
                  your application, and present it to suitable banks and NBFCs in our network. This
                  Policy describes how we handle your information across that journey.
                </p>
                <p>
                  This Privacy Policy does not create any contractual or other legal rights in favour
                  of any visitor or user of the Credora Platforms beyond what is expressly stated
                  herein. Capitalised terms used but not defined here have the meaning given to them
                  in our Terms &amp; Conditions.
                </p>
              </Section>

              {/* 2. Information We Collect */}
              <Section id="information-we-collect" number="2" title="Information We Collect">
                <p>
                  We collect information in the following ways. The type of information depends on
                  how you interact with the Credora Platforms and whether you choose to proceed with
                  our advisory services.
                </p>

                <H3>2.1 Information You Provide Directly</H3>
                <p>
                  Through our Contact Us / Inquiry form, you may provide your full name, business
                  name, business type / industry, funding requirement (in ₹), phone number, email
                  address, and a message describing your funding requirement. Through our Referral
                  Partner registration, you may additionally provide your professional/business
                  background and details of the business or individual you are referring. In our
                  login portal, you may also provide account credentials and profile information.
                </p>

                <H3>2.2 Information Collected During an Advisory Engagement</H3>
                <p>
                  We do not collect financial documents, bank statements, KYC documents, PAN,
                  Aadhaar, or other sensitive personal data through the Website&apos;s public forms.
                  Such information is requested only after an enquiry call, through secure offline
                  or direct channels, and only once you choose to proceed with our advisory services.
                  This may include:
                </p>
                <List
                  items={[
                    "Identification information — name, address, contact details, PAN, signature, photograph",
                    "Bank statements, financial statements, GST returns, and other documents relevant to assessing eligibility",
                    "Credit bureau / CIBIL information, where you authorise us to review it",
                    "Any other detail reasonably required to structure and present your funding requirement to lenders",
                  ]}
                />

                <H3>2.3 Information We Collect Automatically (Usage Data)</H3>
                <p>When you browse the Website, certain non-identifying technical information is automatically recorded, including:</p>
                <List
                  items={[
                    "IP address and approximate location (derived from IP, not precise device GPS)",
                    "Browser type, operating system, and device type",
                    "Pages visited, time spent on each page, and the date/time of your visit",
                    "Referring website or campaign source (e.g. a Meta or Google advertisement)",
                  ]}
                />
                <p>
                  This usage data helps us understand how visitors use the Website, improve its
                  design, content, and performance, and measure our marketing campaigns. It does
                  not, on its own, identify you personally.
                </p>

                <H3>2.4 Information We Receive From Referral Partners</H3>
                <p>
                  If you have been referred to Credora by one of our Referral Partners (such as a
                  chartered accountant, business consultant, or real estate agent), we may receive
                  your name and contact details from that partner in order to reach out to you and
                  assess your funding requirement. This information is then handled in the same
                  manner as information you provide to us directly.
                </p>

                <H3>2.5 Information from Third-Party Tools</H3>
                <p>
                  We may use, or in future integrate, third-party tools on the Website, including
                  Google Analytics (usage analytics), Meta/Facebook Pixel (advertising and campaign
                  measurement), WhatsApp Business API (customer communication), and Zoho CRM (lead
                  and relationship management). These tools may independently collect information
                  such as browsing behaviour, device identifiers, and interactions with our
                  advertisements, subject to their own privacy policies.
                </p>
              </Section>

              {/* 3. How We Use Your Information */}
              <Section id="how-we-use" number="3" title="How We Use Your Information">
                <p>We collect, retain, and use information only where we reasonably believe it helps us administer our business or provide our services to you. This includes:</p>
                <List
                  items={[
                    "Responding to enquiries submitted through our forms and assessing your financial profile and funding requirement",
                    "Processing and structuring your loan application, and presenting it to suitable banks/NBFCs in our network",
                    "Operating and improving the customer/partner login portal and administering the Referral Partner program",
                    "Communicating with you about service updates, application status, and (where permitted) promotional information about our services",
                    "Investigating and resolving complaints, queries, or disputes",
                    "Conducting research and analytics to improve our services, website, and marketing",
                    "Complying with applicable law, regulation, or directions from a court, regulator, or government authority, including the Reserve Bank of India (RBI)",
                  ]}
                />
                <p>
                  We do not use your personal information for any purpose that is incompatible with
                  the purposes for which it was originally collected, without your consent.
                </p>
              </Section>

              {/* 4. Information Sharing & Disclosure */}
              <Section id="sharing-disclosure" number="4" title="Information Sharing & Disclosure">
                <p>
                  We do not sell your personal information. We may disclose information you provide
                  to us to the following categories of recipients, only for the purposes described in
                  this Policy:
                </p>
                <List
                  items={[
                    "Banks and NBFCs within our network of 70+ institutions, solely for the purpose of assessing and processing your funding requirement",
                    "Service providers who support our operations — such as CRM platforms (e.g. Zoho CRM), analytics providers (e.g. Google Analytics), and communication platforms (e.g. WhatsApp Business API) — under appropriate confidentiality obligations",
                    "The Referral Partner who referred you to us, limited to confirmation of engagement status and disbursal (for the purpose of calculating their referral reward), and not your detailed financial information",
                    "Auditors, legal advisors, and professional consultants, where necessary for legitimate business or compliance purposes",
                    "Judicial, statutory, or regulatory authorities, including the Reserve Bank of India (RBI), where required by law, court order, or regulatory direction",
                    "Law enforcement or government bodies, where legally required",
                    "A successor entity, in connection with a merger, acquisition, or business restructuring, subject to confidentiality obligations",
                  ]}
                />
                <p>
                  We will not publish or further disclose any sensitive personal information for any
                  purpose other than as stated in this Policy, without your explicit consent, except
                  where required by law.
                </p>
              </Section>

              {/* 5. Data Security */}
              <Section id="data-security" number="5" title="Data Security">
                <p>
                  We use commercially reasonable physical, managerial, and technical safeguards to
                  protect your personal information, consistent with our information security
                  practices. These safeguards are designed to guard against unauthorised access,
                  alteration, disclosure, or destruction of your information.
                </p>
                <H3>5.1 Technical Safeguards</H3>
                <List
                  items={[
                    "Encryption of data in transit over public networks using HTTPS / TLS",
                    "Role-based access controls — only authorised personnel with a legitimate business need can access personal information",
                    "Secure, password-protected storage of enquiry and partner data in a local database with restricted access",
                    "Regular internal reviews of our data handling practices",
                  ]}
                />
                <H3>5.2 Organisational Safeguards</H3>
                <List
                  items={[
                    "Internal access reviews and confidentiality obligations for staff and service providers",
                    "Documented procedures for handling and disposing of personal information once it is no longer required",
                    "Awareness training for personnel involved in processing personal data",
                  ]}
                />
                <p>
                  While we take reasonable steps to protect your information, no method of
                  transmission over the internet or electronic storage is completely secure. We
                  cannot guarantee absolute security, and any transmission of information to us is at
                  your own risk. If a data breach occurs that is likely to cause you harm, we will
                  notify you and the Data Protection Board in accordance with the DPDP Act, 2023.
                </p>
              </Section>

              {/* 6. Data Retention */}
              <Section id="data-retention" number="6" title="Data Retention">
                <p>
                  We retain personal information only for as long as necessary to fulfil the purposes
                  described in this Policy, or as required to meet applicable legal, regulatory,
                  accounting, or audit obligations — including any retention periods prescribed under
                  RBI or other applicable regulatory guidelines.
                </p>
                <List
                  items={[
                    "Website enquiry data: retained for the duration of the advisory engagement and a reasonable period thereafter for record-keeping",
                    "Engagement / loan-application data: retained as required by applicable law and lender requirements, typically for the tenure of the loan plus a defined post-closure period",
                    "Usage data: retained in aggregated, de-identified form for analytics, with raw logs retained only as long as needed for the purpose collected",
                    "Referral partner data: retained for the duration of the partnership and a reasonable period thereafter for accounting and reward verification",
                  ]}
                />
                <p>
                  Once the retention period expires, information is securely disposed of in
                  accordance with our data-disposal procedures.
                </p>
              </Section>

              {/* 7. Your Rights */}
              <Section id="your-rights" number="7" title="Your Rights">
                <p>
                  Under the Digital Personal Data Protection Act, 2023, you have certain rights with
                  respect to your personal data. To exercise any of these rights, please contact us
                  using the details in Section 12. We will respond to verified requests within a
                  reasonable period, not exceeding the timelines prescribed under the DPDP Act.
                </p>
                <List
                  items={[
                    "Access — request a summary of the personal information we hold about you and the purposes for which it is processed",
                    "Correction & Updating — request correction of inaccurate, incomplete, or outdated personal information",
                    "Erasure — request deletion of your personal information, subject to legal or regulatory retention obligations",
                    "Grievance Redressal — raise a complaint about how your personal data is processed, and receive a response within the prescribed timeframe",
                    "Opt-out of Marketing — unsubscribe from promotional communications at any time; service-related communications necessary to process an ongoing enquiry or application may continue",
                    "Withdrawal of Consent — withdraw any consent previously given for processing your personal data, where processing is based on consent",
                  ]}
                />
                <p>
                  Please note that certain rights may be limited where compliance would conflict with
                  applicable law, regulatory requirements, or the establishment, exercise, or defence
                  of legal claims.
                </p>
              </Section>

              {/* 8. Cookies & Tracking Technologies */}
              <Section id="cookies" number="8" title="Cookies & Tracking Technologies">
                <H3>8.1 What Are Cookies?</H3>
                <p>
                  Cookies are small pieces of text sent to your browser by a website you visit,
                  stored on your device to help recognise you and improve your next visit. Cookies
                  may be &ldquo;persistent&rdquo; (remaining after you close your browser) or
                  &ldquo;session&rdquo; cookies (deleted once you close your browser). We may also
                  use similar technologies such as web beacons and pixel tags.
                </p>
                <H3>8.2 How We Use Cookies</H3>
                <p>By using the Website, you consent to our use of cookies. We use, or may in future use, cookies and similar technologies to:</p>
                <List
                  items={[
                    "Enable certain functions of the Website and remember your preferences",
                    "Improve your browsing experience and measure site performance",
                    "Measure the performance of our Meta (Facebook/Instagram) advertising campaigns and, where integrated, Google Analytics",
                  ]}
                />
                <H3>8.3 Your Choices Regarding Cookies</H3>
                <p>
                  You can manage or delete cookies through your browser settings. Disabling cookies
                  may prevent some Website features from functioning properly, and certain pages may
                  not display as intended. Guidance is generally available on your browser
                  provider&apos;s support pages (for example, the Google Chrome or Microsoft Edge
                  help pages). We are not responsible for cookies placed on your device by any other
                  website.
                </p>
              </Section>

              {/* 9. Third-Party Links */}
              <Section id="third-party-links" number="9" title="Third-Party Links">
                <p>
                  The Website may contain links to third-party websites, including social media
                  pages, partner platforms, and lender websites. This Privacy Policy does not extend
                  to such third-party websites, and Credora is not responsible for their content or
                  privacy practices. We encourage you to review the privacy policy of any linked
                  website before sharing information with it.
                </p>
              </Section>

              {/* 10. Children's Privacy */}
              <Section id="childrens-privacy" number="10" title="Children's Privacy">
                <p>
                  The Credora Platforms and our services are intended only for individuals who are
                  18 years of age or older. We do not knowingly collect personal information from
                  individuals under 18. If you believe a minor has provided personal information to
                  us, please contact us using the details in Section 12 so that we can take
                  appropriate action to delete such information.
                </p>
              </Section>

              {/* 11. Changes to This Policy */}
              <Section id="changes" number="11" title="Changes to This Policy">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our
                  practices, technology, legal requirements (including amendments to the DPDP Act),
                  or business operations. The updated Policy will be posted on this page with a
                  revised &ldquo;Last updated&rdquo; date. Your continued use of the Credora
                  Platforms after such changes constitutes your acceptance of the revised Policy. We
                  encourage you to review this Policy periodically.
                </p>
                <p>
                  Where we make material changes that affect your rights, we will provide a more
                  prominent notice — such as on the Website homepage or via email, where we hold a
                  valid email address — for a reasonable period before the changes take effect.
                </p>
              </Section>

              {/* 12. Contact Us */}
              <Section id="contact" number="12" title="Contact Us">
                <p>
                  If you have any questions, concerns, or requests regarding this Privacy Policy or
                  the way we handle your personal information, please contact our Data Protection
                  Officer / Grievance Officer using the details below:
                </p>
                <div className="rounded-xl border border-[#E8ECF0] bg-[#F8FAFC] p-5 sm:p-6 mt-2">
                  <p className="font-semibold text-[#1C1D62]">Credora Fintech Pvt Ltd</p>
                  <p className="mt-2 text-[#4A5568]">
                    Email:{" "}
                    <a
                      href="mailto:admin@credora.in"
                      className="text-[#304AC0] underline hover:text-[#13277E] transition-colors"
                    >
                      admin@credora.in
                    </a>
                  </p>
                  <p className="text-[#4A5568]">
                    Phone:{" "}
                    <a
                      href="tel:+919344899971"
                      className="text-[#304AC0] underline hover:text-[#13277E] transition-colors"
                    >
                      +91 93448 99971
                    </a>
                  </p>
                  <p className="mt-2 text-[#4A5568]">
                    Registered Office: 1157, 17th Street, Anna Nagar West Extension, Padi, Chennai,
                    Tamil Nadu 600050, India.
                  </p>
                  <p className="mt-3 text-sm text-[#718096]">
                    You can also reach out through our{" "}
                    <Link
                      href="/contact"
                      className="text-[#304AC0] underline hover:text-[#13277E] transition-colors"
                    >
                      contact page
                    </Link>
                    . We will endeavour to acknowledge and resolve any grievance within 30 days of
                    receipt.
                  </p>
                </div>
              </Section>
            </div>

            {/* Back link */}
            <div className="mt-12 pt-8 border-t border-[#E8ECF0] text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#304AC0] hover:text-[#13277E] font-medium transition-colors"
              >
                &larr; Back to Home
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

/* ────────────────────────────────────────────
   Small presentational helpers (semantic, brand-aligned)
   ──────────────────────────────────────────── */

function Section({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="group flex items-center gap-3 text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#87B73C] text-white text-sm font-bold">
          {number}
        </span>
        <span>{title}</span>
      </h2>
      <div className="space-y-4 leading-relaxed text-[#2D3748]">{children}</div>
    </section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold text-[#304AC0] mt-6 mb-2">{children}</h3>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-outside space-y-2 pl-5 text-[#4A5568] marker:text-[#87B73C]">
      {items.map((item, i) => (
        <li key={i} className="leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  );
}
