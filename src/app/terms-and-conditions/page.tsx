"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Terms & Conditions — single-page article.
 *
 * - Semantic HTML (<article>, <section>, <h1>–<h3>)
 * - Sticky table-of-contents sidebar on desktop with scroll-spy
 * - Mobile-first responsive layout
 * - Brand accents: #1C1D62, #304AC0, #87B73C
 * - Governing law: India. Dispute resolution: arbitration in Chennai.
 */

type TocItem = { id: string; label: string };

const TOC: TocItem[] = [
  { id: "acceptance", label: "1. Acceptance of Terms" },
  { id: "services", label: "2. Description of Services" },
  { id: "engagement", label: "3. Engagement Process" },
  { id: "no-guarantee", label: "4. No Guarantee of Loan Approval" },
  { id: "fees", label: "5. Fees & Charges" },
  { id: "client-obligations", label: "6. Client Obligations" },
  { id: "referral-partner", label: "7. Referral Partner Program" },
  { id: "website-use", label: "8. Website & Account Use" },
  { id: "ip", label: "9. Intellectual Property" },
  { id: "third-party", label: "10. Third-Party Tools & Links" },
  { id: "disclaimers", label: "11. Disclaimers" },
  { id: "liability", label: "12. Limitation of Liability" },
  { id: "indemnification", label: "13. Indemnification" },
  { id: "termination", label: "14. Termination" },
  { id: "governing-law", label: "15. Governing Law & Disputes" },
  { id: "changes", label: "16. Changes to These Terms" },
  { id: "contact", label: "17. Contact Us" },
];

const LAST_UPDATED = "24 June 2026";

export default function TermsAndConditionsPage() {
  const [activeId, setActiveId] = useState<string>("acceptance");

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
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-white/70 text-sm sm:text-base mb-1">
            Website Use &amp; Advisory Services
          </p>
          <p className="text-white/50 text-xs">
            Last updated:{" "}
            <time dateTime="2026-06-24" className="font-medium text-white/70">
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
                These Terms and Conditions (&ldquo;Terms&rdquo;) govern access to and use of the
                website <strong className="text-[#1C1D62]">www.credorafin.com</strong> (the{" "}
                &ldquo;Website&rdquo;), our Contact Us and Referral Partner forms, our
                customer/partner login portal, and the advisory services offered by{" "}
                <strong className="text-[#1C1D62]">Credora Fintech Pvt Ltd</strong> (&ldquo;Credora&rdquo;,
                &ldquo;the Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;),
                a company incorporated under the Companies Act, 2013 (CIN: U66190TN2025PTC181555;
                GST: 33AAMCC8358C1ZM), Registered Office: 1157, 17th Street, Anna Nagar West
                Extension, Padi, Chennai, Tamil Nadu 600050.
              </p>
              <p className="text-sm text-[#718096] italic">
                Reference to the masculine gender includes the feminine and neuter genders and vice
                versa. Where there is more than one Client (such as co-applicants for a funding
                requirement), references to &ldquo;Client&rdquo; shall be read as plural, and
                obligations shall apply to each of them jointly and severally.
              </p>
            </div>

            <hr className="my-10 border-[#E8ECF0]" />

            {/* Sections */}
            <div className="space-y-12 text-[#2D3748]">
              {/* 1. Acceptance */}
              <Section id="acceptance" number="1" title="Acceptance of Terms">
                <p>
                  By accessing the Website, submitting an enquiry, registering as a referral partner,
                  or otherwise engaging with our services, you (the &ldquo;Client&rdquo;,
                  &ldquo;User&rdquo;, or &ldquo;You&rdquo;) confirm that you: (i) are at least 18
                  years of age and competent to contract under the Indian Contract Act, 1872; (ii)
                  have read and understood these Terms; and (iii) agree to be bound by them. If you
                  do not agree, please do not use the Website or our services.
                </p>
              </Section>

              {/* 2. Services */}
              <Section id="services" number="2" title="Description of Services">
                <List
                  items={[
                    "Credora Fintech is a loan structuring and financial advisory firm operating as an intermediary between businesses/professionals seeking funding and a network of 70+ banks and NBFCs.",
                    "Credora Fintech is not a bank, NBFC, or direct lender. We do not sanction, fund, underwrite, or disburse any loan, and these Terms do not constitute a loan agreement.",
                    "Our services include pre-underwriting and loan structuring, fund-raising support, cash flow analysis, credit repair services, and end-to-end documentation and coordination support, as described on the Website.",
                  ]}
                />
              </Section>

              {/* 3. Engagement */}
              <Section id="engagement" number="3" title="Engagement Process">
                <List
                  items={[
                    "Pursuant to an enquiry made by you through our Contact Us / Inquiry form (capturing your full name, business name, business type/industry, funding requirement in ₹, phone number, email address, and a description of your requirement), phone, or any other channel, Credora will seek to understand your funding requirement and financial profile.",
                    "Financial documents, KYC details, or bank statements are requested only after an enquiry call and through secure channels, not through the Website's general forms.",
                    "Based on the information and documents provided, Credora will assess your eligibility, identify suitable lenders, and structure your application for submission.",
                    "Credora may, at its discretion, decline to take on an engagement, including where the funding requirement does not align with our network's lending criteria.",
                    "Submission of an enquiry does not create any obligation on Credora or any lender to engage with, approve, or fund your request.",
                  ]}
                />
              </Section>

              {/* 4. No Guarantee */}
              <Section id="no-guarantee" number="4" title="No Guarantee of Loan Approval">
                <p>You acknowledge and agree that:</p>
                <List
                  items={[
                    "Credora does not guarantee approval, sanction, disbursal, or specific terms (interest rate, tenure, or amount) for any loan or funding application.",
                    "All lending decisions are made solely at the discretion of the relevant bank or NBFC, based on their own credit policies, underwriting standards, and assessment of your application.",
                    "Credora's role is limited to assessment, structuring, and presentation of your application; we do not control, influence, or guarantee the lender's final decision.",
                    "Approval timelines, interest rates, and terms communicated by Credora during the advisory process are indicative only and subject to final confirmation by the lender.",
                  ]}
                />
              </Section>

              {/* 5. Fees */}
              <Section id="fees" number="5" title="Fees & Charges">
                <List
                  items={[
                    "Credora does not charge clients any advisory or service fee for facilitating introductions to lending partners; our revenue is earned through arrangements with the banks and NBFCs in our network.",
                    "Credora does not collect any upfront payment, processing fee, or \"guarantee\" fee from Clients in exchange for loan approval, sanction, or disbursal.",
                    "Please exercise caution regarding any individual or third party claiming to represent Credora and demanding upfront payment for loan approval. You may verify the authenticity of any such communication by contacting us directly using the details in Section 17.",
                  ]}
                />
              </Section>

              {/* 6. Client Obligations */}
              <Section id="client-obligations" number="6" title="Client Obligations">
                <p>
                  By engaging with Credora, you represent and warrant, on a continuing basis, that:
                </p>
                <List
                  items={[
                    "You are competent to contract and all information provided by you is true, accurate, current, and complete, and no material information has been suppressed or withheld.",
                    "There is no legal impediment preventing you from entering into or performing your obligations in connection with the services sought.",
                    "You will promptly inform Credora of any change in your contact details, business circumstances, or information previously provided that may affect your funding application.",
                    "You will use any funds obtained through lenders introduced by Credora only for lawful purposes, and not for speculative, illegal, or anti-social activities, or any purpose restricted by the RBI from time to time.",
                    "You will provide complete and accurate financial information and documents as reasonably requested, and authorise Credora to share relevant information with banks/NBFCs in our network for processing your funding requirement.",
                    "You will promptly notify Credora of any change in circumstances — including litigation, default with any other lender, or change in business status — that may be relevant to your application.",
                  ]}
                />
                <p>
                  Credora will handle information shared by you in accordance with our{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-[#304AC0] underline hover:text-[#13277E] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  , available on the Website.
                </p>
              </Section>

              {/* 7. Referral Partner */}
              <Section id="referral-partner" number="7" title="Referral Partner Program">
                <p>
                  Credora&apos;s Referral Partner Program (&ldquo;Refer, Earn, Grow Together&rdquo;)
                  allows individuals such as chartered accountants, financial advisors, business
                  consultants, relationship managers, real estate agents, builders, and other
                  professionals with a network of business owners to refer prospective clients to
                  Credora.
                </p>
                <p>By registering through our Referral Partner form, you agree to:</p>
                <List
                  items={[
                    "Provide accurate information at the time of registration and onboarding",
                    "Comply with any additional terms, the applicable reward structure, and conduct guidelines communicated by Credora at the time of onboarding",
                    "Refrain from making any representation, promise, or guarantee on Credora's behalf, including any promise of loan approval, beyond what is expressly authorised",
                    "Not collect or demand any upfront payment from a referred client in Credora's name; any such conduct is a serious breach of these Terms",
                  ]}
                />
                <p>
                  <strong>How it works:</strong> (i) you refer a business or individual with a
                  funding requirement; (ii) Credora&apos;s team reaches out, assesses the
                  requirement, and takes the engagement forward; (iii) once a loan is sanctioned and
                  disbursed through a lender in our network, you become eligible for a referral
                  reward.
                </p>
                <p>
                  Referral rewards are payable only upon successful disbursal of a loan to the
                  referred client, are calculated as per the structure communicated to you at the
                  time of onboarding (which may be revised by Credora from time to time, with prior
                  notice), and are at Credora&apos;s sole discretion to determine, verify, and
                  process. No reward is payable where a referral does not result in disbursal, or
                  where it is later discovered that the referred client provided false information or
                  the disbursal is reversed/cancelled.
                </p>
              </Section>

              {/* 8. Website Use */}
              <Section id="website-use" number="8" title="Website & Account Use">
                <p>
                  You agree to use the Website and the customer/partner login portal only for lawful
                  purposes and in a manner consistent with these Terms. Where account registration is
                  required:
                </p>
                <List
                  items={[
                    "You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account",
                    "You must notify Credora immediately of any unauthorised use of your account or any breach of security",
                    "Credora reserves the right to suspend or terminate access where information provided is false, misleading, or where these Terms are breached",
                  ]}
                />
              </Section>

              {/* 9. IP */}
              <Section id="ip" number="9" title="Intellectual Property">
                <p>
                  All content on the Website, including text, graphics, logos, the Credora name, and
                  brand marks, is the property of Credora Fintech Pvt Ltd or its licensors and is
                  protected under applicable intellectual property laws. You may not reproduce, copy,
                  distribute, or create derivative works from any part of the Website without our
                  prior written consent.
                </p>
              </Section>

              {/* 10. Third Party */}
              <Section id="third-party" number="10" title="Third-Party Tools & Links">
                <p>
                  The Website may use or link to third-party tools, including Google Analytics,
                  Meta/Facebook advertising tools, WhatsApp Business API, and Zoho CRM, for
                  analytics, communication, and relationship management. Credora is not responsible
                  for the practices, content, or availability of such third-party tools or linked
                  websites, which are governed by their own terms and privacy policies.
                </p>
              </Section>

              {/* 11. Disclaimers */}
              <Section id="disclaimers" number="11" title="Disclaimers">
                <List
                  items={[
                    "Credora is an advisory intermediary and not a lender. All lending decisions rest solely with the bank or NBFC concerned.",
                    "Information provided on the Website is for general informational purposes only and does not constitute financial, legal, tax, or investment advice. You should consult a qualified professional before making any financial decision.",
                    "Interest rates, eligibility criteria, processing fees, and other terms displayed on the Website are indicative and subject to change at the lender's discretion.",
                    "Credora does not warrant that the Website will be uninterrupted, error-free, or free of viruses or other harmful components.",
                  ]}
                />
              </Section>

              {/* 12. Liability */}
              <Section id="liability" number="12" title="Limitation of Liability">
                <p>
                  To the maximum extent permitted by applicable law, Credora, its directors,
                  employees, and representatives shall not be liable for:
                </p>
                <List
                  items={[
                    "Any rejection, delay, or modification of loan terms by a bank or NBFC",
                    "Any indirect, incidental, special, or consequential loss or damage arising from your use of the Website or our services",
                    "Any loss arising from inaccurate or incomplete information provided by you",
                    "Any interruption, error, or unavailability of the Website or login portal",
                  ]}
                />
                <p>
                  Our total liability, where it arises, shall not exceed the amount, if any, paid by
                  you directly to Credora for the specific service giving rise to the claim. Nothing
                  in these Terms limits liability that cannot be limited under applicable Indian law.
                </p>
              </Section>

              {/* 13. Indemnification */}
              <Section id="indemnification" number="13" title="Indemnification">
                <p>
                  You agree to indemnify and hold harmless Credora and its directors, employees, and
                  representatives from any claims, damages, liabilities, costs, or expenses
                  (including reasonable legal fees) arising from your breach of these Terms, misuse
                  of the Website, or provision of false or misleading information.
                </p>
              </Section>

              {/* 14. Termination */}
              <Section id="termination" number="14" title="Termination">
                <p>
                  These Terms remain in effect for as long as you use the Website or our services.
                  Credora reserves the right to suspend or terminate your access to the Website,
                  login portal, or our advisory services, without prior notice, where we reasonably
                  believe you have violated these Terms, provided false information, or engaged in
                  fraudulent or unlawful conduct. Termination shall not affect any rights or
                  obligations that have already accrued.
                </p>
              </Section>

              {/* 15. Governing Law */}
              <Section id="governing-law" number="15" title="Governing Law & Dispute Resolution">
                <List
                  items={[
                    "These Terms shall be governed by and construed in accordance with the laws of India.",
                    "Any dispute, controversy, or claim arising out of or relating to these Terms or the services provided by Credora shall first be attempted to be resolved amicably through good-faith discussions between the parties. If not resolved amicably within 30 days, the dispute shall be referred to and finally resolved by arbitration under the Arbitration and Conciliation Act, 1996, conducted by a sole arbitrator mutually appointed by the parties. The seat and venue of arbitration shall be Chennai, Tamil Nadu, and the language of arbitration shall be English. The costs of arbitration shall be borne as determined in the arbitration award.",
                    "Subject to the above, the courts at Chennai, Tamil Nadu, shall have exclusive jurisdiction over matters not subject to, or arising from, the arbitration proceedings.",
                  ]}
                />
              </Section>

              {/* 16. Changes */}
              <Section id="changes" number="16" title="Changes to These Terms">
                <p>
                  We may revise these Terms from time to time to reflect changes in our services,
                  business practices, or legal requirements. The updated Terms will be posted on this
                  page with a revised &ldquo;Last updated&rdquo; date. Your continued use of the
                  Website or our services after such changes constitutes your acceptance of the
                  revised Terms.
                </p>
              </Section>

              {/* 17. Contact */}
              <Section id="contact" number="17" title="Contact Us">
                <p>
                  For any questions, grievances, or notices under these Terms, please contact us:
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
   Small presentational helpers
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
