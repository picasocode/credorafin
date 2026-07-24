import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#F0F4FF] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1C1D62] to-[#13277E] text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/70 text-sm sm:text-base">
            Effective Date: 24 June 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-[#E8ECF0] p-6 sm:p-10 md:p-14">
            {/* Intro */}
            <div className="prose prose-lg max-w-none text-[#2D3748]">
              <p className="text-lg leading-relaxed mb-4">
                Welcome to <strong>Credora Fintech Pvt Ltd</strong> (&ldquo;Credora&rdquo;, the &ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). The domain{" "}
                <strong>www.credorafin.com</strong> (the &ldquo;Website&rdquo;) is owned and operated by Credora, a company incorporated under the Companies Act, 2013 (CIN: U66190TN2025PTC181555; GST Registration: 33AAMCC8358C1ZM), having its registered office at 1157, 17th St, Anna Nagar West Extension, Padi, Chennai, Tamil Nadu 600050.
              </p>
              <p className="mb-4">
                Credora Fintech is a loan structuring and financial advisory firm that helps businesses, traders, exporters, and professionals access funding by connecting them with a curated network of 70+ banks and Non-Banking Financial Companies (NBFCs). Credora is an advisory and placement intermediary; it is not a bank, NBFC, or direct lender, and does not itself sanction or disburse loans.
              </p>
              <p className="mb-8">
                We respect the privacy of everyone who visits or uses the Website, our Contact Us and Referral Partner forms, and our customer/partner login portal (together, the &ldquo;Credora Platforms&rdquo;), and are committed to protecting personal information shared with us.
              </p>

              <p className="text-sm text-[#718096] mb-8 italic">
                Your use of the Credora Platforms signifies your acknowledgment and consent to this Privacy Policy. If you object to your information being collected, used, or shared as described herein, please do not submit your information through the Credora Platforms. This Privacy Policy does not create any contractual or other legal rights in favour of any visitor or user of the Credora Platforms beyond what is expressly stated herein.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-10 text-[#2D3748]">
              {/* 1. Definitions */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  1. Definitions
                </h2>
                <p className="leading-relaxed">
                  For the purpose of this Privacy Policy, &ldquo;You&rdquo;, &ldquo;Your&rdquo;, or &ldquo;User&rdquo; means any natural or legal person visiting the Website, submitting an enquiry, registering as a referral partner, or using the Credora Platforms. &ldquo;We&rdquo;, &ldquo;Us&rdquo;, or &ldquo;Our&rdquo; means Credora Fintech Pvt Ltd.
                </p>
              </div>

              {/* 2. Information We Collect */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  2. Information We Collect
                </h2>

                <h3 className="text-lg font-semibold text-[#304AC0] mt-6 mb-3">2.1 Information Collected Automatically</h3>
                <p className="leading-relaxed mb-3">
                  When you browse the Website, certain non-identifying technical information is automatically recorded, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-[#4A5568]">
                  <li>The type of browser and operating system you are using</li>
                  <li>Your approximate location, derived from your IP address (not precise device GPS location)</li>
                  <li>The date and time of your visit, pages viewed, and time spent on each page</li>
                  <li>Referring website or campaign source (e.g. a Meta/Google advertisement)</li>
                </ul>
                <p className="leading-relaxed mt-3 text-[#4A5568]">
                  This information helps us understand how visitors use the Website and improve its design, content, and performance, and to measure our marketing campaigns. It does not, on its own, identify you personally.
                </p>

                <h3 className="text-lg font-semibold text-[#304AC0] mt-6 mb-3">2.2 Information You Provide Directly</h3>
                <p className="leading-relaxed mb-3">Through our Contact Us / Inquiry form, you may provide:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-[#4A5568]">
                  <li>Full name</li>
                  <li>Business name</li>
                  <li>Business type / industry</li>
                  <li>Funding requirement (in ₹)</li>
                  <li>Phone number</li>
                  <li>Email address</li>
                  <li>A message describing your funding requirement</li>
                </ul>
                <p className="leading-relaxed mt-3 text-[#4A5568]">
                  Through our Referral Partner registration, you may additionally provide professional/business background relevant to the referral program, and details of the business or individual you are referring. In our login portal, you may also provide account credentials and profile information.
                </p>

                <h3 className="text-lg font-semibold text-[#304AC0] mt-6 mb-3">2.3 Information We Receive From Referral Partners</h3>
                <p className="leading-relaxed text-[#4A5568]">
                  If you have been referred to Credora by one of our Referral Partners (such as a chartered accountant, business consultant, or real estate agent), we may receive your name and contact details from that partner in order to reach out to you and assess your funding requirement. This information is then handled in the same manner as information you provide to us directly.
                </p>

                <h3 className="text-lg font-semibold text-[#304AC0] mt-6 mb-3">2.4 Information Collected During an Advisory Engagement</h3>
                <p className="leading-relaxed mb-3 text-[#4A5568]">
                  We do not collect financial documents, bank statements, KYC documents, PAN, Aadhaar, or other sensitive personal documents through the Website. Such information and documents are requested only after an enquiry call, through secure offline or direct channels, and only once you choose to proceed with our advisory services. This may include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-[#4A5568]">
                  <li>Identification information (name, address, contact details, PAN, signature, photograph)</li>
                  <li>Bank statements, financial statements, GST returns, and other documents relevant to assessing your eligibility</li>
                  <li>Credit bureau/CIBIL information, where you authorise us to review it</li>
                  <li>Any other detail reasonably required to structure and present your funding requirement to lenders</li>
                </ul>

                <h3 className="text-lg font-semibold text-[#304AC0] mt-6 mb-3">2.5 Information from Third-Party Tools</h3>
                <p className="leading-relaxed text-[#4A5568]">
                  We may use, or in future integrate, third-party tools on the Website, including Google Analytics (usage analytics), Meta/Facebook Pixel (advertising and campaign measurement), WhatsApp Business API (customer communication), and Zoho CRM (lead and relationship management). These tools may independently collect information such as browsing behaviour, device identifiers, and interactions with our advertisements, subject to their own privacy policies.
                </p>
              </div>

              {/* 3. Purpose */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  3. Purpose of Collection and Use of Information
                </h2>
                <p className="leading-relaxed mb-3">
                  We collect, retain, and use information only where we reasonably believe it helps us administer our business or provide our services to you. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-[#4A5568]">
                  <li>Responding to enquiries submitted through our forms</li>
                  <li>Assessing your financial profile and funding requirement</li>
                  <li>Structuring your application and presenting it to suitable banks/NBFCs in our network</li>
                  <li>Operating and improving the customer/partner login portal</li>
                  <li>Administering the Referral Partner program</li>
                  <li>Communicating service updates, application status, and (where permitted) promotional information</li>
                  <li>Investigating and resolving complaints, queries, or disputes</li>
                  <li>Conducting research and analytics to improve our services and marketing</li>
                  <li>Complying with applicable law, regulation, or directions from a court, regulator, or government authority</li>
                </ul>
              </div>

              {/* 4. Disclosure */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  4. Disclosure of Information
                </h2>
                <p className="leading-relaxed mb-3">
                  We do not sell your personal information. We may disclose information you provide to us to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-[#4A5568]">
                  <li>Banks and NBFCs within our network of 70+ institutions, solely for the purpose of assessing and processing your funding requirement</li>
                  <li>Service providers who support our operations, such as CRM platforms (e.g. Zoho CRM), analytics providers (e.g. Google Analytics), and communication platforms (e.g. WhatsApp Business API)</li>
                  <li>The Referral Partner who referred you to us, limited to confirmation of engagement status and disbursal (for the purpose of calculating their referral reward), and not your detailed financial information</li>
                  <li>Auditors, legal advisors, and professional consultants, where necessary</li>
                  <li>Any judicial, statutory, or regulatory authority, including the Reserve Bank of India (RBI), where required by law, court order, or regulatory direction</li>
                  <li>Law enforcement or government bodies, where legally required</li>
                  <li>A successor entity, in connection with a merger, acquisition, or business restructuring, subject to confidentiality obligations</li>
                </ul>
                <p className="leading-relaxed mt-3 text-[#4A5568]">
                  We will not publish or further disclose any sensitive personal information for any purpose other than as stated in this Policy, without your explicit consent, except where required by law.
                </p>
              </div>

              {/* 5. Retention */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  5. Retention of Information
                </h2>
                <p className="leading-relaxed text-[#4A5568]">
                  We retain personal information only for as long as necessary to fulfil the purposes described in this Policy, or as required to meet applicable legal, regulatory, accounting, or audit obligations, including any retention periods prescribed under RBI or other applicable regulatory guidelines. Information is securely disposed of once it is no longer required.
                </p>
              </div>

              {/* 6. Communications */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  6. Communications and Notifications
                </h2>
                <p className="leading-relaxed text-[#4A5568]">
                  By using the Credora Platforms or submitting your contact details to us, you agree and understand that you are communicating with us electronically and consent to receive communications from us, including by email, SMS, phone call, or WhatsApp, relating to your enquiry, application, or our services. You may opt out of promotional communications at any time by contacting us using the details in Section 12, though you may continue to receive service-related communications necessary to process an ongoing enquiry or application.
                </p>
              </div>

              {/* 7. Updating */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  7. Updating or Reviewing Your Information
                </h2>
                <p className="leading-relaxed text-[#4A5568]">
                  You may, upon written request to us, review the personal information you have provided to us. Where any information is found to be inaccurate, incomplete, or outdated, you may request that it be corrected or updated, and we will make reasonable efforts to do so.
                </p>
              </div>

              {/* 8. Security */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  8. Reasonable Security Practices
                </h2>
                <p className="leading-relaxed mb-3 text-[#4A5568]">
                  We use commercially reasonable physical, managerial, and technical safeguards to protect your personal information, consistent with our ISO/IEC 27001:2022 information security practices. These include access controls, internal review of our data handling practices, and reasonable measures to guard against unauthorised access to systems where personal information is stored.
                </p>
                <p className="leading-relaxed text-[#4A5568]">
                  While we take reasonable steps to protect your information, no method of transmission over the internet or electronic storage is completely secure. We cannot guarantee absolute security, and any transmission of information to us is at your own risk.
                </p>
              </div>

              {/* 9. No Liability */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  9. No Liability
                </h2>
                <p className="leading-relaxed text-[#4A5568]">
                  To the extent permitted by applicable law, Credora shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the Credora Platforms, loss of data, security breaches, or unauthorised access to your personal information, except where such loss arises directly from our gross negligence or wilful default.
                </p>
              </div>

              {/* 10. Children */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  10. Children&apos;s Privacy
                </h2>
                <p className="leading-relaxed text-[#4A5568]">
                  The Credora Platforms and our services are intended only for individuals who are 18 years of age or older. We do not knowingly collect personal information from individuals under 18. If you believe a minor has provided personal information to us, please contact us so that we can take appropriate action.
                </p>
              </div>

              {/* 11. Links */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  11. Links to Other Websites
                </h2>
                <p className="leading-relaxed text-[#4A5568]">
                  The Website may contain links to third-party websites, including social media pages and partner platforms. This Privacy Policy does not extend to such third-party websites, and Credora is not responsible for their content or privacy practices. We encourage you to review the privacy policy of any linked website before sharing information with it.
                </p>
              </div>

              {/* 12. Grievance */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  12. Grievance Redressal
                </h2>
                <p className="leading-relaxed mb-3 text-[#4A5568]">
                  In case you wish to raise any discrepancy or grievance relating to the processing or use of your personal information, we welcome you to reach out to us through our{" "}
                  <Link href="/contact" className="text-[#304AC0] underline hover:text-[#13277E] transition-colors">
                    contact page
                  </Link>.
                </p>
                <p className="leading-relaxed text-[#4A5568]">
                  We will endeavour to acknowledge and resolve any grievance within 30 days of receipt. If you are not satisfied with the resolution, you may escalate your grievance through the consumer grievance mechanisms available under applicable Indian law, including the Consumer Protection Act, 2019, or raise it with the Data Protection Board once constituted under the Digital Personal Data Protection Act, 2023.
                </p>
              </div>

              {/* 13. Cookie Policy */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  13. Cookie Policy
                </h2>

                <h3 className="text-lg font-semibold text-[#304AC0] mt-4 mb-3">13.1 What Are Cookies?</h3>
                <p className="leading-relaxed text-[#4A5568]">
                  Cookies are small pieces of text sent by your web browser by a website you visit, stored in your browser to help recognise you and improve your next visit. Cookies may be &ldquo;persistent&rdquo; (remaining after you close your browser) or &ldquo;session&rdquo; cookies (deleted once you close your browser).
                </p>

                <h3 className="text-lg font-semibold text-[#304AC0] mt-6 mb-3">13.2 How We Use Cookies</h3>
                <p className="leading-relaxed mb-3 text-[#4A5568]">
                  By using the Website, you consent to our use of cookies. We use, or may in future use, cookies and similar technologies to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-[#4A5568]">
                  <li>Enable certain functions of the Website</li>
                  <li>Improve your browsing experience and remember your preferences</li>
                  <li>Measure the performance of our Meta (Facebook/Instagram) advertising campaigns and, where integrated, Google Analytics</li>
                </ul>
                <p className="leading-relaxed mt-3 text-[#4A5568]">
                  We are not responsible for cookies placed on your device by any other website, or the information such third-party websites collect.
                </p>

                <h3 className="text-lg font-semibold text-[#304AC0] mt-6 mb-3">13.3 Your Choices Regarding Cookies</h3>
                <p className="leading-relaxed text-[#4A5568]">
                  You can manage or delete cookies through your browser settings. Please note that disabling cookies may prevent some Website features from functioning properly, and certain pages may not display as intended. Guidance is generally available on your browser provider&apos;s support pages (for example, Google Chrome or Microsoft Edge help pages).
                </p>
              </div>

              {/* 14. Changes */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  14. Changes to This Privacy Policy
                </h2>
                <p className="leading-relaxed text-[#4A5568]">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or business operations. The updated Policy will be posted on this page with a revised &ldquo;Effective Date.&rdquo; Your continued use of the Credora Platforms after such changes constitutes your acceptance of the revised Policy. We encourage you to review this Policy periodically.
                </p>
              </div>

              {/* 15. Contact */}
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1C1D62] mb-4 pb-2 border-b border-[#E8ECF0]">
                  15. Contact Us
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