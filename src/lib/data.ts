export interface ProductData {
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  color: string;
  products: { name: string; desc: string; features?: string[] }[];
  benefits: string[];
  eligibility?: { label: string; desc: string }[];
  processSteps?: { title: string; desc: string }[];
  faqs?: { q: string; a: string }[];
  stats?: { label: string; value: string; suffix?: string }[];
  brochureFile: string;
}

export interface ServiceData {
  slug: string;
  title: string;
  headline: string;
  desc: string;
  icon: string;
  color: string;
  whatWeDo: string[];
  benefits: string[];
  processSteps?: { title: string; desc: string }[];
  faqs?: { q: string; a: string }[];
  stats?: { label: string; value: string; suffix?: string }[];
}

export const products: ProductData[] = [
  {
    slug: "msme-loans",
    title: "MSME Loans",
    shortDesc: "Flexible Funding for Business Growth",
    fullDesc: "MSME loans provide essential capital for micro, small, and medium enterprises in manufacturing, trading, and services. Whether you need working capital, equipment purchase, or expansion funds, we structure collateral-free and secured options under schemes like CGTMSE. With access to 70+ lenders, we match your profile to the right institution — ensuring competitive rates and faster approvals.",
    icon: "Building2",
    color: "#304AC0",
    products: [
      { name: "Unsecured Business Loans — Term Loans / Flexi OD", desc: "Collateral-free funding for expansion, working capital, and day-to-day operations. Flexible repayment with term loan or overdraft facility.", features: ["No collateral required", "Loan amount up to ₹40 Lakhs", "Tenure 1–5 years", "Flexi OD option available"] },
      { name: "Loan Against Property and LRD", desc: "Raise funds against immovable property or rental income (Lease Rental Discounting). Ideal for larger funding needs with property as security.", features: ["Loan against residential/commercial property", "Up to 70% of property value", "LRD for rental income monetization", "Tenure up to 15 years"] },
      { name: "Working Capital — CGTMSE Secured and Unsecured", desc: "Working capital under CGTMSE, offering both collateral-free and secured funding for MSMEs. Government-backed guarantee scheme for faster processing.", features: ["CGTMSE coverage up to ₹2 Crore", "Collateral-free option available", "Fund-based and non-fund based facilities", "Quick processing with guarantee cover"] },
      { name: "Machinery Finance", desc: "Loans to purchase new or used machinery to enhance production capacity. Structured repayment aligned with equipment cash flows.", features: ["New and used machinery", "Up to 90% financing", "Tenure aligned with machinery life", "Supplier tie-ups for better pricing"] },
      { name: "Solar Finance", desc: "Funding support for solar projects and renewable energy solutions. Capital for installation, equipment, and grid connectivity.", features: ["Rooftop and ground-mounted solar", "Capital subsidy assistance", "Long tenure up to 15 years", "Green energy incentives"] },
      { name: "Commercial Vehicle Finance", desc: "Funding solutions for acquiring commercial vehicles to support business operations. Covers trucks, tempos, and special-purpose vehicles.", features: ["New and used vehicles", "Up to 100% on-road price", "Top-up loans on existing vehicles", "Flexible EMI options"] },
      { name: "Professional Loans", desc: "Customized funding for doctors, CAs, lawyers, and other professionals. Tailored to professional income patterns and practice requirements.", features: ["For qualified professionals", "No collateral for established practices", "Clinic/office setup funding", "Equipment and technology upgrade"] },
    ],
    benefits: [
      "Faster processing and higher approval chances",
      "Competitive interest rates and flexible repayment terms",
      "Improved cash flow and business scalability",
      "Support for both new and existing businesses",
      "Access to government schemes like CGTMSE",
      "Single point of contact across 70+ lenders",
    ],
    eligibility: [
      { label: "Business Vintage", desc: "Minimum 1–3 years of business operation with consistent revenue. Startups may qualify under specific schemes." },
      { label: "Annual Turnover", desc: "Meeting MSME classification thresholds for micro (up to ₹5 Cr), small (up to ₹50 Cr), or medium (up to ₹250 Cr) enterprises." },
      { label: "Credit Profile", desc: "CIBIL score of 650+ with manageable existing obligations. Lower scores may qualify with additional security." },
      { label: "Business Type", desc: "Manufacturing, trading, or services entity with valid MSME/Udyam registration and proper GST compliance." },
    ],
    processSteps: [
      { title: "Profile Assessment", desc: "We evaluate your business financials, credit profile, and funding requirements" },
      { title: "Product Matching", desc: "Identify the best MSME loan product and suitable lenders for your profile" },
      { title: "Application Structuring", desc: "Prepare and structure your application for maximum approval chances" },
      { title: "Lender Submission", desc: "Submit to multiple lenders simultaneously with a single CIBIL enquiry" },
      { title: "Sanction & Disbursal", desc: "Compare offers, select the best terms, and manage the process until funds are in your account" },
    ],
    faqs: [
      { q: "What is the typical loan amount for MSME loans?", a: "MSME loans range from ₹5 Lakhs to ₹5 Crores depending on the product, your business profile, and the lender. CGTMSE-backed loans can go up to ₹2 Crores without collateral." },
      { q: "How long does the approval process take?", a: "Unsecured business loans typically take 7–14 days. Secured loans like Loan Against Property may take 15–30 days. We help expedite by ensuring your application is complete and properly structured." },
      { q: "Can a new business apply for MSME loans?", a: "Yes, certain products are available for businesses with as little as 1 year of operation. CGTMSE and government-backed schemes often have relaxed vintage requirements for new MSMEs." },
      { q: "What documents are required?", a: "Typically: Business registration (Udyam/GST), bank statements (12 months), ITR (2–3 years), financial statements, and KYC documents. Our team helps you prepare a complete documentation package." },
      { q: "Is collateral mandatory for all MSME loans?", a: "No. Several products like Unsecured Business Loans, CGTMSE-covered working capital, and Professional Loans do not require collateral. Secured options offer higher amounts and better rates." },
    ],
    stats: [
      { label: "Loan Amount Range", value: "₹5L", suffix: " – ₹5Cr" },
      { label: "Processing Time", value: "7", suffix: "–14 days" },
      { label: "Approval Rate", value: "85", suffix: "%" },
      { label: "Lender Options", value: "70", suffix: "+" },
    ],
    brochureFile: "msme-loans-brochure.pdf",
  },
  {
    slug: "supply-chain-finance",
    title: "Supply Chain Finance",
    shortDesc: "Unlock Working Capital Trapped in Your Business",
    fullDesc: "A significant portion of working capital in businesses is tied up in receivables and inventory. Our supply chain finance solutions help convert invoices into immediate cash and optimize payment cycles — without impacting your CIBIL score and Balance Sheet. With off-balance-sheet options available, you can unlock liquidity while keeping your financial ratios healthy.",
    icon: "Link2",
    color: "#13277E",
    products: [
      { name: "Invoice Discounting — Sales and Purchase", desc: "Convert outstanding invoices into immediate working capital. Get up to 90% of invoice value within 24–72 hours of submission.", features: ["Up to 90% advance", "24–72 hour disbursal", "Sales & purchase invoice support", "Off-balance-sheet option"] },
      { name: "Payable Finance", desc: "Manage and optimize your supplier payment cycles while preserving cash flow. Extend payment terms without straining supplier relationships.", features: ["Extended payment terms", "Supplier paid on time", "Preserved working capital", "Improved supplier relations"] },
      { name: "Vendor Finance", desc: "Enable vendors to receive early payments against their invoices. Strengthen your supply chain by supporting vendor liquidity.", features: ["Early vendor payments", "Strengthened supply chain", "Flexible discount rates", "Automated processing"] },
      { name: "Channel Finance", desc: "Funding support for inventory and stocks for channel partners. Enable distributors and dealers to maintain adequate stock levels.", features: ["Distributor/dealer funding", "Inventory-based limits", "Seasonal flexibility", "Multi-channel support"] },
      { name: "Inventory Finance", desc: "Funding against stock and purchase to maintain smooth operations. Monetize warehouse inventory without selling assets.", features: ["Against existing inventory", "Warehouse receipt financing", "Commodity-specific solutions", "Rotating credit facility"] },
      { name: "Working Capital Demand Loan", desc: "Short-term loans to meet immediate working capital requirements. Quick disbursal for urgent business needs.", features: ["Quick processing", "Short-term tenure", "Flexible utilization", "Top-up facility available"] },
    ],
    benefits: [
      "Faster access to liquidity without a heavy CIBIL impact",
      "Stronger supplier and buyer relationships",
      "Better working capital management",
      "Reduced dependency on traditional term loans",
      "Off-balance-sheet option available",
      "No additional collateral required for most products",
    ],
    eligibility: [
      { label: "Business Type", desc: "Manufacturing, trading, or services companies with regular invoicing to corporate or government buyers." },
      { label: "Invoice Value", desc: "Minimum invoice value of ₹10 Lakhs. Higher limits available for established businesses with strong buyer relationships." },
      { label: "Buyer Profile", desc: "Invoices to rated corporates, PSUs, or government entities qualify for better terms and higher advance rates." },
      { label: "Vintage", desc: "Minimum 2 years of business operation with consistent revenue and a track record of timely invoice settlements." },
    ],
    processSteps: [
      { title: "Invoice Submission", desc: "Submit your outstanding invoices along with buyer confirmation and delivery proof" },
      { title: "Verification", desc: "Our team verifies the invoice, buyer creditworthiness, and delivery documentation" },
      { title: "Funder Matching", desc: "Match your invoice to the best funder based on buyer rating, invoice amount, and tenure" },
      { title: "Advance Disbursal", desc: "Receive up to 90% of invoice value within 24–72 hours directly to your account" },
      { title: "Settlement", desc: "Buyer pays on due date; balance amount minus charges credited to your account" },
    ],
    faqs: [
      { q: "How quickly can I get funds against my invoices?", a: "Typically within 24–72 hours of invoice verification and buyer confirmation. First-time processing may take slightly longer due to setup requirements." },
      { q: "Does invoice discounting affect my balance sheet?", a: "No. Invoice discounting can be structured as an off-balance-sheet transaction, meaning it doesn't add to your debt or affect your leverage ratios." },
      { q: "What happens if the buyer delays payment?", a: "Depending on the structure, there may be a recourse option where you repurchase the invoice, or a non-recourse option where the funder bears the buyer default risk (subject to terms)." },
      { q: "What types of invoices are eligible?", a: "Invoices to rated corporates, PSUs, government departments, and approved buyers. Both sales invoices (receivables) and purchase invoices (payables) can be financed." },
      { q: "What is the cost of supply chain finance?", a: "Costs vary based on buyer rating, invoice tenure, and market conditions. Typically 1–3% per month. We ensure competitive pricing by presenting to multiple funders." },
    ],
    stats: [
      { label: "Advance Rate", value: "90", suffix: "%" },
      { label: "Disbursal Speed", value: "24", suffix: "–72 hrs" },
      { label: "Balance Sheet Impact", value: "Off", suffix: "-BS option" },
      { label: "Typical Amount", value: "₹10L", suffix: " – ₹50Cr" },
    ],
    brochureFile: "supply-chain-finance-brochure.pdf",
  },
  {
    slug: "cross-border-finance",
    title: "Cross Border Finance",
    shortDesc: "Finance for Exporters and Importers",
    fullDesc: "We provide specialized trade finance solutions for businesses involved in international trade — helping manage orders, production, receivables, and supplier payments efficiently across borders. Whether you're an exporter needing pre-shipment funding or an importer requiring payment financing, our network of trade finance specialists ensures smooth cross-border transactions.",
    icon: "Globe",
    color: "#1C1D62",
    products: [
      { name: "Export Finance", desc: "Comprehensive support for managing export orders, production costs, and receivables. End-to-end funding from order receipt to export realization.", features: ["Pre & post-shipment funding", "Letter of Credit backing", "Export receivables financing", "RBI compliance support"] },
      { name: "Pre-Shipment Finance", desc: "Funding based on purchase orders to manage production, packaging, and logistics costs before shipment. Ensures you never turn down an export order due to working capital constraints.", features: ["Against confirmed export orders/LC", "Fund production & packaging", "Up to 90% of order value", "Competitive FX rates"] },
      { name: "Post-Shipment Finance", desc: "Liquidity support after goods are shipped, until export payments are received. Bridge the gap between shipment and realization.", features: ["Against shipping documents", "Up to 90% of invoice value", "FCY & INR options available", "Competitive pricing"] },
      { name: "Import Finance", desc: "Financing to manage timely payments to overseas suppliers. Ensure your import supply chain runs smoothly without cash flow disruption.", features: ["LC issuance & discounting", "Buyer's credit facility", "Supplier payment management", "FX risk management"] },
    ],
    benefits: [
      "Improved liquidity throughout the trade cycle",
      "Risk mitigation in cross-border dealings",
      "Seamless management of orders and payments",
      "Support for both large and growing exporters and importers",
      "RBI and FEMA compliance guidance",
      "Competitive foreign exchange rates",
    ],
    eligibility: [
      { label: "Exporter/Importer", desc: "Businesses with active export/import operations and valid IEC (Import Export Code) registration." },
      { label: "Trade Volume", desc: "Minimum annual trade volume of ₹50 Lakhs. Higher limits for established international traders." },
      { label: "Documentation", desc: "Proper purchase orders, letters of credit, shipping bills, and customs documentation." },
      { label: "Compliance", desc: "RBI and FEMA compliance with proper repatriation of export proceeds and import payments." },
    ],
    processSteps: [
      { title: "Trade Assessment", desc: "Understand your trade cycle, buyer/supplier relationships, and financing gaps" },
      { title: "Structure Solution", desc: "Design the right trade finance structure — pre-shipment, post-shipment, or import finance" },
      { title: "Documentation", desc: "Prepare complete documentation including orders, LC, shipping bills, and compliance certificates" },
      { title: "Lender Matching", desc: "Present to trade finance specialists who understand your industry and trade corridors" },
      { title: "Funding & Monitoring", desc: "Secure funding and monitor through the entire trade cycle until realization" },
    ],
    faqs: [
      { q: "What is the difference between pre-shipment and post-shipment finance?", a: "Pre-shipment finance is provided before goods are shipped, based on confirmed export orders or LC, to fund production and logistics. Post-shipment finance is provided after shipment, against shipping documents, to bridge the gap until payment is received." },
      { q: "Can startups with new export orders qualify?", a: "Yes, businesses with confirmed export orders or LC from creditworthy buyers can qualify, even with limited export history. The buyer's creditworthiness is a key factor." },
      { q: "What documents are needed for cross-border finance?", a: "Key documents include: IEC registration, purchase orders/LC, commercial invoice, packing list, shipping bill, bill of lading/airway bill, and bank realization certificate (for post-shipment)." },
      { q: "How is foreign exchange risk managed?", a: "We work with lenders who offer forward contracts, options, and natural hedging strategies to protect against currency fluctuations during the trade cycle." },
      { q: "What is the typical funding amount for cross-border finance?", a: "Funding can range from ₹50 Lakhs to ₹100 Crores depending on your trade volume, buyer profile, and the type of finance required. Each transaction is structured based on the specific trade cycle." },
    ],
    stats: [
      { label: "Funding Range", value: "₹50L", suffix: " – ₹100Cr" },
      { label: "Processing Time", value: "3", suffix: "–10 days" },
      { label: "Advance Rate", value: "90", suffix: "%" },
      { label: "Trade Corridors", value: "Global", suffix: "" },
    ],
    brochureFile: "cross-border-finance-brochure.pdf",
  },
  {
    slug: "project-finance",
    title: "Project Finance",
    shortDesc: "Structured Funding for Large-Scale Projects",
    fullDesc: "Structured funding for property development, builder projects, land purchase, and inventory funding. We help developers and businesses secure long-term capital aligned with project cash flows and milestones. Our deep understanding of real estate and infrastructure sectors ensures your project gets funded on terms that match your development timeline.",
    icon: "HardHat",
    color: "#304AC0",
    products: [
      { name: "Real Estate Finance", desc: "Funding solutions for real estate investments, including land purchase and unsold plot funding. Structured for residential, commercial, and mixed-use developments.", features: ["Land acquisition funding", "Construction finance", "Unsold inventory funding", "RERA-compliant structuring"] },
      { name: "Builder Finance", desc: "Funding solutions for property development, construction projects, and land acquisition. Tailored for developers with projects at various stages.", features: ["Construction-linked disbursal", "Milestone-based funding", "Multiple project funding", "Extension & top-up options"] },
      { name: "Inventory Funding", desc: "Capital against unsold project inventory for builders and developers. Unlock cash from completed but unsold units.", features: ["Against unsold units", "Up to 60% of inventory value", "Bridge to sales cycle", "Flexible repayment from sales proceeds"] },
    ],
    benefits: [
      "Customized terms with moratorium options where applicable",
      "Support from planning stage through to project completion",
      "Focus on project viability and strong approval outcomes",
      "Aligned repayment structures based on project cash flows",
      "Milestone-based disbursal for better cash flow management",
      "Expert guidance on RERA compliance and documentation",
    ],
    eligibility: [
      { label: "Project Stage", desc: "Projects at planning, under-construction, or near-completion stages. RERA registration where applicable." },
      { label: "Developer Track Record", desc: "Demonstrated track record of completed projects with timely delivery. New developers may qualify with stronger collateral." },
      { label: "Project Viability", desc: "Feasible project with clear demand, proper approvals, and realistic financial projections." },
      { label: "Documentation", desc: "Complete project documentation including land titles, approvals, RERA registration, and financial projections." },
    ],
    processSteps: [
      { title: "Project Assessment", desc: "Evaluate project viability, financial projections, and development timeline" },
      { title: "Structuring", desc: "Design funding structure aligned with project milestones and cash flows" },
      { title: "Documentation", desc: "Prepare complete documentation — land titles, approvals, RERA, and projections" },
      { title: "Lender Matching", desc: "Present to lenders specializing in project and real estate finance" },
      { title: "Disbursal & Monitoring", desc: "Milestone-based disbursal with regular project monitoring until completion" },
    ],
    faqs: [
      { q: "What is the typical loan amount for project finance?", a: "Project finance ranges from ₹1 Crore to ₹200 Crores depending on project size, stage, and developer profile. Construction finance typically covers 60–75% of project cost." },
      { q: "What is moratorium period in project finance?", a: "A moratorium period allows you to defer principal repayment during the construction phase. Interest may be serviced or capitalized depending on the structure. Typically available for 12–36 months." },
      { q: "Can I get funding for a project that's already under construction?", a: "Yes, we structure funding for projects at various stages — including mid-construction. Additional due diligence may be required for partially completed projects." },
      { q: "How is project finance different from a regular business loan?", a: "Project finance is structured around the project's cash flows and milestones, not just your business financials. Repayment is typically linked to project revenue, with milestone-based disbursal and potential moratorium periods." },
      { q: "What security is required for project finance?", a: "Typically, the project land and assets serve as primary security. Additional collateral may be required based on lender assessment and project risk profile." },
    ],
    stats: [
      { label: "Funding Range", value: "₹1Cr", suffix: " – ₹200Cr" },
      { label: "Processing Time", value: "15", suffix: "–45 days" },
      { label: "Moratorium", value: "Up to 36", suffix: " months" },
      { label: "Tenure", value: "2", suffix: "–15 years" },
    ],
    brochureFile: "project-finance-brochure.pdf",
  },
  {
    slug: "specialized-finance",
    title: "Specialized Finance",
    shortDesc: "Niche Solutions for Complex Funding Requirements",
    fullDesc: "For unique or challenging requirements where standard products fall short. We provide customized, structured finance for specific industries and complex financial situations. Our team navigates the intricacies of each case to find funding solutions that others simply cannot.",
    icon: "Puzzle",
    color: "#87B73C",
    products: [
      { name: "Third Party Security Funding", desc: "Loans backed by collateral provided by a third party on behalf of the borrower. Ideal when the borrower doesn't have sufficient assets but a guarantor does.", features: ["Third-party property as collateral", "FD and securities backing", "Family/guarantor support", "Flexible structuring"] },
      { name: "Politically Exposed Customers (PEP)", desc: "Structured funding support for politically exposed persons who face additional compliance scrutiny from traditional lenders.", features: ["Enhanced due diligence navigation", "Specialized lender network", "Compliance-ready structuring", "Confidential processing"] },
      { name: "Short-Term Project Finance / Bridge Finance", desc: "Bridge funding for ongoing or near-completion projects that need interim capital before long-term financing is secured.", features: ["3–18 month tenure", "Flexible exit strategies", "Quick processing", "Refinancing options"] },
      { name: "Inventory Funding — Sector Specific", desc: "Sector-specific funding against stock for niche industries. Customized inventory finance for specialized business needs.", features: ["Industry-specific structures", "Commodity & specialty stock", "Rotating credit facility", "Market-linked pricing"] },
      { name: "Ship Purchase Finance", desc: "Financing for the acquisition of marine vessels. From commercial ships to offshore support vessels.", features: ["Maritime asset expertise", "Vessel age consideration", "Charter contract backing", "Classification society compliance"] },
      { name: "Film and Media Finance", desc: "Funding support for film production, media projects, and entertainment ventures with structured cash flows.", features: ["Pre-sales based funding", "Distribution agreement backing", "Completion guarantees", "Multi-stage disbursal"] },
      { name: "ARC and Stressed Asset Solutions", desc: "Specialized support for resolving stressed or non-performing financial assets through ARC processes.", features: ["ARC structuring", "Stressed asset resolution", "Valuation support", "Restructuring advisory"] },
      { name: "NCLT Purchase", desc: "Acquisition and resolution of assets under insolvency proceedings. Navigate the NCLT process with expert guidance.", features: ["NCLT process navigation", "Resolution plan structuring", "Bid preparation support", "Regulatory compliance"] },
      { name: "SMA and NPA Cases", desc: "Support for restructuring and resolving stressed and non-performing accounts. Get back on track with expert resolution support.", features: ["SMA/NPA classification review", "Restructuring options", "One-time settlement support", "Credit rehabilitation"] },
      { name: "Structured Finance", desc: "Customized solutions for complex financial situations that don't fit standard product categories.", features: ["Tailor-made structures", "Multi-layered funding", "Complex transaction support", "Creative financing solutions"] },
    ],
    benefits: [
      "Solutions for cases that standard lenders reject",
      "Expert navigation of complex compliance requirements",
      "Access to specialized lenders and investors",
      "Customized structuring for unique situations",
      "Confidential and professional handling",
      "End-to-end support from assessment to resolution",
    ],
    eligibility: [
      { label: "Case Complexity", desc: "Cases where standard lending products don't apply — due to unique collateral, compliance requirements, or financial situations." },
      { label: "Asset Backing", desc: "Some form of asset or revenue backing is typically required. The nature and type varies by case." },
      { label: "Documentation", desc: "Complete documentation of the specific situation — asset details, compliance records, financial statements." },
      { label: "Resolution Intent", desc: "Clear intent and viable path towards financial resolution or asset acquisition." },
    ],
    processSteps: [
      { title: "Case Assessment", desc: "Deep analysis of your specific situation, requirements, and constraints" },
      { title: "Solution Design", desc: "Create a customized financing structure that addresses your unique needs" },
      { title: "Lender Matching", desc: "Identify and approach specialized lenders who understand your case type" },
      { title: "Structured Presentation", desc: "Present your case professionally with all supporting documentation and rationale" },
      { title: "Closure & Monitoring", desc: "Secure funding and monitor through the resolution or project lifecycle" },
    ],
    faqs: [
      { q: "What types of cases does Specialized Finance cover?", a: "We handle cases that standard lenders typically reject — including third-party collateral, PEP clients, bridge finance, maritime assets, film & media, ARC/NCLT assets, SMA/NPA accounts, and other complex financial situations." },
      { q: "How is Specialized Finance different from regular loans?", a: "Specialized Finance involves customized structuring for unique situations that don't fit standard product categories. Each case is individually assessed and structured based on its specific merits and constraints." },
      { q: "Can I get funding if my account is classified as NPA?", a: "Yes, we work with specialized lenders and ARCs who handle NPA resolution. We can explore restructuring, one-time settlement, or asset reconstruction options depending on your situation." },
      { q: "What is the typical timeframe for specialized finance?", a: "Timeframes vary significantly by case complexity. Simple bridge finance may take 2–4 weeks, while NCLT acquisitions or ARC resolutions can take 3–6 months. We provide realistic timelines upfront." },
      { q: "Is the process confidential?", a: "Absolutely. We handle all cases with complete confidentiality. Our engagement with lenders is discreet, and your information is shared only with relevant parties on a need-to-know basis." },
    ],
    stats: [
      { label: "Case Types", value: "10", suffix: "+" },
      { label: "Success Rate", value: "78", suffix: "%" },
      { label: "Specialized Lenders", value: "15", suffix: "+" },
      { label: "Avg Resolution", value: "4", suffix: "–8 weeks" },
    ],
    brochureFile: "specialized-finance-brochure.pdf",
  },
];

export const services: ServiceData[] = [
  {
    slug: "credit-repair",
    title: "Credit Repair Services",
    headline: "Improve Your Credit Profile. Improve Your Chances.",
    desc: "A weak or inaccurate credit profile is often the single biggest barrier to getting funded. We analyze your credit report in detail, identify errors and negative entries, and coordinate corrections so your profile reflects your true financial standing. Don't let outdated or incorrect credit information cost you the funding your business needs.",
    icon: "CreditCard",
    color: "#304AC0",
    whatWeDo: [
      "Analyze your Credit report in detail",
      "Identify incorrect entries, disputes, or outdated negative records",
      "Coordinate with bureaus and lenders for corrections and updates",
      "Track resolution and confirm updated scores",
      "Monitoring and advisory for ongoing credit report up to 1 year",
    ],
    benefits: [
      "Improved credit score for better loan eligibility",
      "Higher loan approval chances across lenders",
      "Better interest rates and commercial terms",
      "Stronger overall credit rating and profile",
      "Faster loan processing with a clean credit report",
      "Long-term credit health management",
    ],
    processSteps: [
      { title: "Credit Report Analysis", desc: "Obtain and thoroughly analyse all types of Credit Bureau reports for errors and negative entries" },
      { title: "Issue Identification", desc: "Categorize all issues — incorrect info, duplicate accounts, outdated defaults, unauthorized enquiries" },
      { title: "Dispute Filing", desc: "File structured disputes with credit bureaus and coordinate corrections with lenders" },
      { title: "Follow-Up", desc: "Track dispute resolution with bureaus and lenders, ensuring timely corrections" },
      { title: "Score Update", desc: "Confirm updated scores and provide a clean credit report for loan applications" },
    ],
    faqs: [
      { q: "How long does credit repair take?", a: "Simple corrections (wrong personal info, duplicate accounts) may take 30–45 days. Complex cases (written-off status, multiple disputes) can take 60–90 days. We keep you informed at every step." },
      { q: "Can credit repair guarantee a specific score?", a: "No, we cannot guarantee a specific score. However, correcting errors and removing outdated negative entries consistently leads to score improvement. Most clients see 50–200 point improvements." },
      { q: "Is credit repair legal?", a: "Absolutely. You have the legal right to dispute inaccurate information on your credit report under the Credit Information Companies (Regulation) Act. We help you exercise this right effectively." },
      { q: "What if my credit issues are genuine?", a: "Even genuine negative entries may be reportable for a limited time. We help identify which entries are outdated, verify all details are accurate, and advise on strategies to rebuild your credit profile." },
      { q: "Do you work with all credit bureaus?", a: "Yes, we work with all major credit bureaus in India — CIBIL, Experian, Equifax, and CRIF High Mark. We analyze reports from all bureaus to ensure consistency." },
    ],
    stats: [
      { label: "Avg Score Improvement", value: "120", suffix: " points" },
      { label: "Issues Resolved", value: "95", suffix: "%" },
      { label: "Avg Resolution Time", value: "1", suffix: " Week" },
      { label: "Resolved Cases", value: "500", suffix: "+" },
    ],
  },
  {
    slug: "pre-underwriting-loan-structuring",
    title: "Pre-Underwriting & Loan Structuring",
    headline: "Get Application-Ready Before You Apply.",
    desc: "Most loan rejections happen because applications are submitted without adequate preparation. We evaluate your complete financial profile in advance — identifying the right lenders, fixing weak spots, and structuring your application for the strongest possible outcome. Don't apply blind — apply prepared.",
    icon: "FileCheck",
    color: "#13277E",
    whatWeDo: [
      "Review bank statements, financials, credit exposure, and fund utilization",
      "Assess eligibility across multiple lender criteria simultaneously",
      "Identify and resolve issues before the application is submitted",
      "Structure your loan proposal professionally and accurately",
      "Map to the most suitable banks or NBFCs for your profile",
    ],
    benefits: [
      "Faster loan processing with complete documentation",
      "Significantly higher approval chances up to 90%",
      "Better interest rates and commercial terms",
      "Less credit enquiries",
      "Professional application presentation that lenders trust",
      "Saves time and reduces frustration from multiple rejections",
    ],
    processSteps: [
      { title: "Document Collection", desc: "Gather bank statements, financials, ITR, business registration documents" },
      { title: "Financial Analysis", desc: "Review cash flows, existing obligations, and fund utilization patterns in detail" },
      { title: "Lender Matching", desc: "Identify banks and NBFCs whose criteria match your profile and requirements" },
      { title: "Gap Identification", desc: "Spot and resolve issues before the application is submitted to any lender" },
      { title: "Proposal Structuring", desc: "Create a professionally structured loan proposal for maximum approval impact" },
    ],
    faqs: [
      { q: "Why should I do pre-underwriting instead of applying directly?", a: "Direct applications have ~30% approval rate because most aren't prepared properly. Pre-underwriting increases this to ~85% by fixing issues before submission, identifying the right lenders, and structuring your application professionally." },
      { q: "How long does the pre-underwriting process take?", a: "Typically 3–7 business days depending on the complexity of your financial profile and the number of documents to review." },
      { q: "What issues do you typically find during pre-underwriting?", a: "Common issues include: fund utilization not matching business narrative, excessive credit enquiries, DTI ratio issues, incomplete documentation, and mismatch between profile and lender criteria." },
      { q: "Do you guarantee loan approval after pre-underwriting?", a: "While we significantly improve approval chances, no one can guarantee approval as the final decision rests with the lender. However, our pre-underwritten applications have an 95% approval rate and some other application factor may get delayed loan approvals." },
      { q: "Is pre-underwriting useful for loan renewal or top-up?", a: "Absolutely. Pre-underwriting for renewals and top-ups helps ensure you get the best available terms and that your current financial position is presented optimally." },
    ],
    stats: [
      { label: "Approval Rate", value: "85", suffix: "%" },
      { label: "Higher Approval Chances", value: "3", suffix: "x" },
      { label: "Avg Preparation", value: "5", suffix: " days" },
      { label: "Issues Prevented", value: "90", suffix: "%" },
    ],
  },
  {
    slug: "fund-raising",
    title: "Fund Raising",
    headline: "The Right Lender. The Right Terms. One Point of Contact.",
    desc: "We manage the entire fund-raising process from understanding your requirement to presenting your case to multiple lenders — so you get the best possible terms without the confusion of dealing with multiple institutions separately. Your application is structured once and presented to multiple lenders with a single Credit enquiry.",
    icon: "Banknote",
    color: "#1C1D62",
    whatWeDo: [
      "Understand your specific funding requirement and business context",
      "Suggest the best loan product and structure for your needs",
      "Present your case to multiple lenders simultaneously",
      "We manage the process and follow up with lenders until sanction and disbursal are complete",
      "Better Pricing and Hassle Free Experience",
    ],
    benefits: [
      "Multi-lender access without multiple Credit inquiries",
      "Better commercial terms through structured presentation",
      "Single point of contact across all institutions",
      "Controlled and minimal Credit enquiries",
      "Saves significant time and effort in lender coordination",
      "Expert comparison of offers to identify the best terms",
    ],
    processSteps: [
      { title: "Customer Requirement Analysis", desc: "Understand your specific funding need — amount, purpose, timeline, and business context" },
      { title: "Application Structuring", desc: "Prepare and structure your loan proposal professionally with all supporting documentation" },
      { title: "Multi-Lender Presentation", desc: "Present your case to multiple lenders simultaneously with a single Credit enquiry" },
      { title: "Offer Comparison", desc: "Compare offers from multiple lenders and identify the best pricing and terms for you" },
      { title: "Sanction & Disbursal", desc: "Continuous follow-ups until sanction and ensure timely disbursal of funds" },
    ],
    faqs: [
      { q: "How many lenders do you approach simultaneously?", a: "We typically approach 3–5 lenders simultaneously based on your profile and requirements. Our network includes 70+ lenders — PSU banks, private banks, NBFCs, and specialized lenders." },
      { q: "How long does the fund-raising process take?", a: "Unsecured loans: 3–7 days. Secured loans: 7–15 days. Complex cases: up to 30 days. We provide realistic timelines based on your specific situation." },
      { q: "What types of lenders are in your network?", a: "Our network includes PSU banks such as SBI, PNB and Bank of Baroda; private banks such as HDFC, ICICI and Axis; NBFCs such as Bajaj, Tata Capital and Mahindra; and specialized lenders for specific sectors." },
      { q: "Do you charge any fees from the borrower?", a: "Our service model and fee structure is discussed during the initial consultation. We are transparent about all costs upfront with no hidden charges." },
    ],
    stats: [
      { label: "Lender Network", value: "70", suffix: "+" },
      { label: "Single Point of Contact", value: "1", suffix: "" },
      { label: "Avg TAT", value: "3–14", suffix: " days" },
      { label: "Client Satisfaction", value: "98", suffix: "%" },
    ],
  },
  {
    slug: "end-to-end-support",
    title: "End-to-End Support Services",
    headline: "Our Support Doesn't End at Disbursal — It Continues Beyond.",
    desc: "Getting funded is just the beginning. We stay engaged through the entire loan lifecycle — from documentation and lender follow-ups to repayment tracking and closure, so your loan works for your business long after the money is in your account. Think of us as your loan management partner.",
    icon: "HeadphonesIcon",
    color: "#87B73C",
    whatWeDo: [
      "Loan repayment calendar and schedule management",
      "Principal outstanding tracking and updates",
      "Account swap assistance",
      "Credit updation and credit record management",
      "Loan consolidation advisory and support",
      "NOC collection upon loan closure",
      "Regular follow-ups with lenders at every stage",
    ],
    benefits: [
      "Smooth and hassle-free loan management experience",
      "Faster turnaround time for lender-related tasks",
      "Complete guidance at every step of the loan lifecycle",
      "No dropped balls between sanction and disbursal",
      "Proactive monitoring to prevent payment defaults",
      "Expert advisory for loan optimization and cost reduction",
    ],
    processSteps: [
      { title: "Onboarding", desc: "Capture all loan details — lender, amount, EMI, due dates, and key terms" },
      { title: "Schedule Setup", desc: "Create a comprehensive repayment calendar with reminders and tracking" },
      { title: "Active Monitoring", desc: "Regular tracking of outstanding, EMIs, and CIBIL updates" },
      { title: "Optimization", desc: "Identify opportunities for better rates, account swap, or consolidation" },
      { title: "Closure", desc: "Ensure proper NOC collection, CIBIL update, and clean account closure" },
    ],
    faqs: [
      { q: "What happens after my loan is disbursed?", a: "We set up a comprehensive tracking system for your loan — EMI calendar, outstanding monitoring, Credit Bureau tracking, and lender coordination. We stay engaged throughout the loan lifecycle." },
      { q: "Can you help if I want to switch to a different lender?", a: "Yes, we handle account swaps — identifying better-rate lenders, managing the transition process, and ensuring minimal cost and disruption. We also coordinate the closure of your existing loan." },
      { q: "What is loan consolidation?", a: "Loan consolidation involves combining multiple loans into a single facility with better terms — potentially lower interest rate, single EMI, and simplified management. We advise when consolidation makes sense and manage the entire process." },
      { q: "How do you help with Credit management?", a: "We monitor your Credit report regularly, ensure all payments are accurately reflected, verify that closed loans show as closed, and coordinate corrections for any discrepancies with bureaus and lenders." },
      { q: "Do you charge separately for end-to-end support?", a: "Our fee structure is discussed during the initial consultation. Some services are bundled with our fund-raising engagement, while others may have separate charges. We are always transparent about costs." },
    ],
    stats: [
      { label: "Loans Managed", value: "1000", suffix: "+" },
      { label: "Avg Response Time", value: "4", suffix: " hrs" },
      { label: "On Time Services", value: "99", suffix: "%" },
      { label: "Client Retention", value: "95", suffix: "%" },
    ],
  },
];

export interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
  isButton?: boolean;
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Products",
    href: "/products",
    children: products.map((p) => ({ label: p.title, href: `/products/${p.slug}` })),
  },
  {
    label: "Services",
    href: "/services",
    children: services.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
  },
  { label: "Blog", href: "/blog" },
  { label: "Referral Partner", href: "/referral-partner" },
  { label: "Contact", href: "/contact" },
  { label: "EMI Calculator", href: "/emi-calculator", isButton: true },
];
