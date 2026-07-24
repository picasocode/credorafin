import Link from "next/link";

export default function TermsAndConditionsPage() {
  return (
    <main className="bg-[#F0F4FF] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1C1D62] to-[#13277E] text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            Terms and Conditions
          </h1>
          <p className="text-white/70 text-sm sm:text-base">
            Website Use &amp; Advisory Services
          </p>
          <p className="text-white/50 text-xs mt-2">
            Effective Date: 24 June 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-[#E8ECF0] p-6 sm:p-10 md:p-14">
            {/* Intro */}
            <div className="text-[#2D3748]">
              <p className="text-lg leading-relaxed mb-4">
                These Terms and Conditions (&ldquo;Terms&rdquo;) govern access to and use of the website{" "}
                <strong>www.credorafin.com</strong> (the &ldquo;Website&rdquo;), our Contact Us and Referral Partner forms, our customer/partner login portal, and the advisory services offered by{" "}
                <strong>Credora Fintech Pvt Ltd</strong> (&ldquo;Credora&rdquo;, &ldquo;the Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), a company incorporated under the Companies Act, 2013 (CIN: U66190TN2025PTC181555; GST: 33AAMCC8358C1ZM), Registered Office: 1157, 17th St, Anna Nagar West Extension, Padi, Chennai, Tamil Nadu 600050.
              </p>
              <p className="leading-relaxed mb-4">
                By accessing the Website, submitting an enquiry, registering as a referral partner, or otherwise engaging with our services, you (the &ldquo;Client&rdquo;, &ldquo;User&rdquo;, or &ldquo;You&rdquo;) confirm that you: (i) are at least 18 years of age and competent to contract under the Indian Contract Act, 1872; (ii) have read and understood these Terms; and (iii) agree to be bound by them. If you do not agree, please do not use the Website or our services.
              </p>
              <p className="leading-relaxed mb-8 text-sm text-[#718096] italic">
                Reference to the masculine gender includes the feminine and neuter genders and vice versa. Where there is more than one Client (such as co-applicants for a funding requirement), references to &ldquo;Client&rdquo; shall be read as plural, and obligations shall apply to each of them jointly and severally.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-10 text-[#2D3748]">
              {/* 1. Nature of Services */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  1. Nature of Our Services
                </h2>
                <ul className="space-y-3 text-[#4A5568]">
                  <li className="leading-relaxed">
                    Credora Fintech is a loan structuring and financial advisory firm operating as an intermediary between businesses/professionals seeking funding and a network of 70+ banks and NBFCs.
                  </li>
                  <li className="leading-relaxed">
                    Credora Fintech is not a bank, NBFC, or direct lender. We do not sanction, fund, underwrite, or disburse any loan, and these Terms do not constitute a loan agreement.
                  </li>
                  <li className="leading-relaxed">
                    Our services include pre-underwriting and loan structuring, fund-raising support, cash flow analysis, credit repair services, and end-to-end documentation and coordination support, as described on the Website.
                  </li>
                </ul>
              </div>

              {/* 2. Engagement Process */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  2. Engagement Process
                </h2>
                <ul className="list-disc list-inside space-y-3 ml-4 text-[#4A5568]">
                  <li className="leading-relaxed">
                    Pursuant to an enquiry made by you through our Contact Us / Inquiry form (capturing your full name, business name, business type/industry, funding requirement in ₹, phone number, email address, and a description of your requirement), phone, or any other channel, Credora will seek to understand your funding requirement and financial profile.
                  </li>
                  <li className="leading-relaxed">
                    Financial documents, KYC details, or bank statements are requested only after an enquiry call and through secure channels, not through the Website&apos;s general forms.
                  </li>
                  <li className="leading-relaxed">
                    Based on the information and documents provided, Credora will assess your eligibility, identify suitable lenders, and structure your application for submission.
                  </li>
                  <li className="leading-relaxed">
                    Credora may, at its discretion, decline to take on an engagement, including where the funding requirement does not align with our network&apos;s lending criteria.
                  </li>
                  <li className="leading-relaxed">
                    Submission of an enquiry does not create any obligation on Credora or any lender to engage with, approve, or fund your request.
                  </li>
                </ul>
              </div>

              {/* 3. No Guarantee */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  3. No Guarantee of Loan Approval
                </h2>
                <p className="leading-relaxed mb-3">You acknowledge and agree that:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-[#4A5568]">
                  <li>Credora does not guarantee approval, sanction, disbursal, or specific terms (interest rate, tenure, or amount) for any loan or funding application.</li>
                  <li>All lending decisions are made solely at the discretion of the relevant bank or NBFC, based on their own credit policies, underwriting standards, and assessment of your application.</li>
                  <li>Credora&apos;s role is limited to assessment, structuring, and presentation of your application; we do not control, influence, or guarantee the lender&apos;s final decision.</li>
                  <li>Approval timelines, interest rates, and terms communicated by Credora during the advisory process are indicative only and subject to final confirmation by the lender.</li>
                </ul>
              </div>

              {/* 4. Fees */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  4. Fees and Charges
                </h2>
                <ul className="list-disc list-inside space-y-2 ml-4 text-[#4A5568]">
                  <li className="leading-relaxed">
                    Credora does not charge clients any advisory or service fee for facilitating introductions to lending partners; our revenue is earned through arrangements with the banks and NBFCs in our network.
                  </li>
                  <li className="leading-relaxed">
                    Credora does not collect any upfront payment, processing fee, or &ldquo;guarantee&rdquo; fee from Clients in exchange for loan approval, sanction, or disbursal.
                  </li>
                  <li className="leading-relaxed">
                    Please exercise caution regarding any individual or third party claiming to represent Credora and demanding upfront payment for loan approval. You may verify the authenticity of any such communication by contacting us directly using the details in Section 16.
                  </li>
                </ul>
              </div>

              {/* 5. Client Representations */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  5. Client Representations and Warranties
                </h2>
                <p className="leading-relaxed mb-3">By engaging with Credora, you represent and warrant, on a continuing basis, that:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-[#4A5568]">
                  <li>You are competent to contract and all information provided by you is true, accurate, current, and complete, and no material information has been suppressed or withheld</li>
                  <li>There is no legal impediment preventing you from entering into or performing your obligations in connection with the services sought</li>
                  <li>You will promptly inform Credora of any change in your contact details, business circumstances, or information previously provided that may affect your funding application</li>
                  <li>You will use any funds obtained through lenders introduced by Credora only for lawful purposes, and not for speculative, illegal, or anti-social activities, or any purpose restricted by the RBI from time to time</li>
                  <li>You will not hold Credora responsible for any consequence arising from inaccurate or incomplete information provided by you</li>
                </ul>
              </div>

              {/* 6. Info Covenant */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  6. Information and Documentation Covenant
                </h2>
                <p className="leading-relaxed mb-3">You agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-[#4A5568]">
                  <li>Provide complete and accurate financial information and documents as reasonably requested for assessment and structuring of your application</li>
                  <li>Authorise Credora to share relevant information with banks/NBFCs in our network, and with service providers supporting our operations, for the purpose of processing your funding requirement</li>
                  <li>Promptly notify Credora of any change in circumstances, including litigation, default with any other lender, or change in business status, that may be relevant to your application</li>
                </ul>
                <p className="leading-relaxed mt-3 text-[#4A5568]">
                  Credora will handle information shared by you in accordance with our{" "}
                  <Link href="/privacy-policy" className="text-[#304AC0] underline hover:text-[#13277E] transition-colors">
                    Privacy Policy
                  </Link>, available on the Website.
                </p>
              </div>

              {/* 7. Referral Partner */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  7. Referral Partner Program
                </h2>
                <p className="leading-relaxed mb-3 text-[#4A5568]">
                  Credora&apos;s Referral Partner Program (&ldquo;Refer, Earn, Grow Together&rdquo;) allows individuals such as chartered accountants, financial advisors, business consultants, relationship managers, real estate agents, builders, and other professionals with a network of business owners, to refer prospective clients to Credora.
                </p>
                <p className="leading-relaxed mb-3 text-[#4A5568]">By registering through our Referral Partner form, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-[#4A5568]">
                  <li>Provide accurate information at the time of registration and onboarding</li>
                  <li>Comply with any additional terms, the applicable reward structure, and conduct guidelines communicated by Credora at the time of onboarding</li>
                  <li>Refrain from making any representation, promise, or guarantee on Credora&apos;s behalf, including any promise of loan approval, beyond what is expressly authorised</li>
                  <li>Not collect or demand any upfront payment from a referred client in Credora&apos;s name; any such conduct is a serious breach of these Terms</li>
                </ul>
                <p className="leading-relaxed mt-4 text-[#4A5568]">
                  <strong>How it works:</strong> (i) you refer a business or individual with a funding requirement; (ii) Credora&apos;s team reaches out, assesses the requirement, and takes the engagement forward; (iii) once a loan is sanctioned and disbursed through a lender in our network, you become eligible for a referral reward.
                </p>
                <p className="leading-relaxed mt-3 text-[#4A5568]">
                  Referral rewards are payable only upon successful disbursal of a loan to the referred client, are calculated as per the structure communicated to you at the time of onboarding (which may be revised by Credora from time to time, with prior notice), and are at Credora&apos;s sole discretion to determine, verify, and process. No reward is payable where a referral does not result in disbursal, or where it is later discovered that the referred client provided false information or the disbursal is reversed/cancelled.
                </p>
                <p className="leading-relaxed mt-3 text-[#4A5568]">
                  Credora reserves the right, at its sole discretion, to determine eligibility, set or revise the reward structure, and suspend or terminate any referral partnership, including for breach of these Terms or applicable law.
                </p>
              </div>

              {/* 8. Website Use */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  8. Use of the Website and Login Portal
                </h2>
                <p className="leading-relaxed mb-3 text-[#4A5568]">
                  You agree to use the Website and the customer/partner login portal only for lawful purposes and in a manner consistent with these Terms. Where account registration is required:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-[#4A5568]">
                  <li>You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account</li>
                  <li>You must notify Credora immediately of any unauthorised use of your account or any breach of security</li>
                  <li>Credora reserves the right to suspend or terminate access where information provided is false, misleading, or where these Terms are breached</li>
                </ul>
              </div>

              {/* 9. IP */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  9. Intellectual Property
                </h2>
                <p className="leading-relaxed text-[#4A5568]">
                  All content on the Website, including text, graphics, logos, the Credora name, and brand marks, is the property of Credora Fintech Pvt Ltd or its licensors and is protected under applicable intellectual property laws. You may not reproduce, copy, distribute, or create derivative works from any part of the Website without our prior written consent.
                </p>
              </div>

              {/* 10. Third Party */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  10. Third-Party Tools and Links
                </h2>
                <p className="leading-relaxed text-[#4A5568]">
                  The Website may use or link to third-party tools, including Google Analytics, Meta/Facebook advertising tools, WhatsApp Business API, and Zoho CRM, for analytics, communication, and relationship management. Credora is not responsible for the practices, content, or availability of such third-party tools or linked websites, which are governed by their own terms and privacy policies.
                </p>
              </div>

              {/* 11. Confidentiality */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  11. Confidentiality
                </h2>
                <p className="leading-relaxed text-[#4A5568]">
                  Each party agrees to keep confidential any non-public business, financial, or personal information disclosed by the other in the course of the engagement, and to use it solely for the purposes contemplated by these Terms, except where disclosure is required by law, regulation, or a competent authority.
                </p>
              </div>

              {/* 12. Limitation of Liability */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  12. Limitation of Liability
                </h2>
                <p className="leading-relaxed mb-3 text-[#4A5568]">
                  To the maximum extent permitted by applicable law, Credora, its directors, employees, and representatives shall not be liable for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-[#4A5568]">
                  <li>Any rejection, delay, or modification of loan terms by a bank or NBFC</li>
                  <li>Any indirect, incidental, special, or consequential loss or damage arising from your use of the Website or our services</li>
                  <li>Any loss arising from inaccurate or incomplete information provided by you</li>
                  <li>Any interruption, error, or unavailability of the Website or login portal</li>
                </ul>
                <p className="leading-relaxed mt-3 text-[#4A5568]">
                  Our total liability, where it arises, shall not exceed the amount, if any, paid by you directly to Credora for the specific service giving rise to the claim.
                </p>
              </div>

              {/* 13. Indemnification */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  13. Indemnification
                </h2>
                <p className="leading-relaxed text-[#4A5568]">
                  You agree to indemnify and hold harmless Credora and its directors, employees, and representatives from any claims, damages, liabilities, costs, or expenses (including reasonable legal fees) arising from your breach of these Terms, misuse of the Website, or provision of false or misleading information.
                </p>
              </div>

              {/* 14. Term and Termination */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  14. Term, Suspension and Termination
                </h2>
                <p className="leading-relaxed text-[#4A5568]">
                  These Terms remain in effect for as long as you use the Website or our services. Credora reserves the right to suspend or terminate your access to the Website, login portal, or our advisory services, without prior notice, where we reasonably believe you have violated these Terms, provided false information, or engaged in fraudulent or unlawful conduct. Termination shall not affect any rights or obligations that have already accrued.
                </p>
              </div>

              {/* 15. Notices */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  15. Notices
                </h2>
                <p className="leading-relaxed text-[#4A5568]">
                  Any notice or communication under these Terms shall be deemed duly given if sent by email, SMS, WhatsApp, courier, or registered post to the contact details provided by you, and shall be deemed received: at the time of sending, for email/SMS/WhatsApp; or on the third working day following posting, for courier/registered post. You agree to keep Credora informed in writing of any change in your contact details.
                </p>
              </div>

              {/* 16. Grievance */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  16. Grievance Redressal Mechanism
                </h2>
                <p className="leading-relaxed mb-3 text-[#4A5568]">
                  In case of any grievance, including concerns about staff conduct, service quality, or how your application or referral was handled, we welcome you to reach out to us through our{" "}
                  <Link href="/contact" className="text-[#304AC0] underline hover:text-[#13277E] transition-colors">
                    contact page
                  </Link>.
                </p>
                <p className="leading-relaxed text-[#4A5568]">
                  We will endeavour to acknowledge and resolve any grievance within 30 days of receipt. As Credora is an advisory intermediary and not an RBI-regulated lender, the RBI Ombudsman Scheme does not apply to us directly; however, if your grievance relates to a specific bank/NBFC&apos;s lending decision or conduct, that institution&apos;s own grievance redressal and Ombudsman channels would apply, and we will assist in directing you appropriately.
                </p>
              </div>

              {/* 17. Governing Law */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  17. Governing Law, Jurisdiction and Arbitration
                </h2>
                <ul className="space-y-3 text-[#4A5568]">
                  <li className="leading-relaxed">
                    These Terms shall be governed by and construed in accordance with the laws of India.
                  </li>
                  <li className="leading-relaxed">
                    Any dispute, controversy, or claim arising out of or relating to these Terms or the services provided by Credora shall first be attempted to be resolved amicably through good-faith discussions between the parties. If not resolved amicably within 30 days, the dispute shall be referred to and finally resolved by arbitration under the Arbitration and Conciliation Act, 1996, conducted by a sole arbitrator mutually appointed by the parties. The seat and venue of arbitration shall be Chennai, Tamil Nadu, and the language of arbitration shall be English. The costs of arbitration shall be borne as determined in the arbitration award.
                  </li>
                  <li className="leading-relaxed">
                    Subject to the above, the courts at Chennai, Tamil Nadu, shall have exclusive jurisdiction over matters not subject to, or arising from, the arbitration proceedings.
                  </li>
                </ul>
              </div>

              {/* 18. Severability */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  18. Severability and Waiver
                </h2>
                <p className="leading-relaxed text-[#4A5568]">
                  If any provision of these Terms is held by a court or tribunal of competent jurisdiction to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. No failure or delay by Credora in exercising any right under these Terms shall operate as a waiver of that right, and any waiver must be in writing and specifically made.
                </p>
              </div>

              {/* 19. Amendments */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  19. Amendments to These Terms
                </h2>
                <p className="leading-relaxed text-[#4A5568]">
                  We may revise these Terms from time to time to reflect changes in our services, business practices, or legal requirements. The updated Terms will be posted on this page with a revised &ldquo;Effective Date.&rdquo; Your continued use of the Website or our services after such changes constitutes your acceptance of the revised Terms.
                </p>
              </div>

              {/* 20. Contact */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  20. Contact Us
                </h2>
                <p className="leading-relaxed text-[#4A5568]">
                  In case you may want to share your concern, we welcome you to easily reach out to us on our{" "}
                  <Link href="/contact" className="text-[#304AC0] underline hover:text-[#13277E] transition-colors">
                    contact page
                  </Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#304AC0] hover:text-[#13277E] font-medium transition-colors"
            >
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}