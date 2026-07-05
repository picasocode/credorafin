import {
  ShieldCheck,
  CreditCard,
  Building2,
  IndianRupee,
  FileText,
  TrendingUp,
} from "lucide-react";

/* ────────────────────────────────────────────
   BLOG DATA — Shared across blog pages
   ──────────────────────────────────────────── */

export interface BlogPost {
  id: string;
  category: string;
  categoryIcon: React.ElementType;
  title: string;
  excerpt: string;
  content: string[];
  author: string;
  date: string;
  readTime: string;
  color: string;
  featured?: boolean;
  tags: string[];
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "credit-profile-vs-cibil",
    category: "Credit Health",
    categoryIcon: ShieldCheck,
    title: "Why Your Credit Profile Matters More Than Your CIBIL Score",
    excerpt:
      "Lenders look beyond just your score. Learn how a well-structured credit profile can significantly improve your loan approval chances and get you better interest rates.",
    content: [
      "When most business owners think about getting a loan, the first thing they check is their CIBIL score. While your credit score is undoubtedly important, it is only one piece of the puzzle. Lenders evaluate your entire credit profile — a comprehensive picture that includes your repayment history, credit utilisation ratio, mix of secured and unsecured credit, and the depth of your financial documentation.",
      "A strong credit profile tells a story. It shows lenders that you are not just a number, but a well-organised business with disciplined financial habits. At Credora Fintech, we have seen clients with scores above 750 get rejected because their profile had gaps — missing documentation, inconsistent financial statements, or too many unexplained credit enquiries.",
      "On the other hand, businesses with scores in the 650–700 range have secured loans at competitive rates because their profiles were well-structured and pre-underwritten. The key is preparation: reviewing your credit bureau reports, correcting errors, reducing unnecessary enquiries, and aligning your financial documents with what lenders actually look for.",
      "Our credit repair and pre-underwriting services are designed to bridge this gap. We do not just help you improve your score — we prepare your entire profile for the scrutiny of a lender's underwriting process.",
    ],
    author: "Credora Advisory Team",
    date: "2025-01-15",
    readTime: "5 min read",
    color: "#304AC0",
    featured: true,
    tags: ["Credit Profile", "CIBIL", "Loan Approval"],
    image: "/images/blog/credit-profile.png",
  },
  {
    id: "pre-underwriting-secret",
    category: "Loan Structuring",
    categoryIcon: FileText,
    title: "Pre-Underwriting: The Secret to 95% Loan Approval Rates",
    excerpt:
      "Most businesses apply directly and get rejected. Discover how disciplined pre-underwriting can transform your approval rate from 30% to 95%.",
    content: [
      "The difference between a loan application that gets approved and one that gets rejected often comes down to one thing: preparation. Most businesses approach lenders directly, submitting applications without understanding the lender's specific criteria, documentation requirements, or risk assessment framework. This approach leads to rejection rates as high as 70%.",
      "Pre-underwriting flips this model on its head. Instead of applying and hoping for the best, you prepare your application as if the lender's underwriter were already reviewing it. This means thoroughly analysing your financials, identifying potential red flags, structuring your loan proposal to highlight strengths, and matching your profile to lenders whose criteria you actually meet.",
      "At Credora, our pre-underwritten applications have a 95% approval rate — compared to roughly 30% for direct applications. The process involves deep financial analysis, gap identification, strategic documentation, and precise lender matching. We do not just prepare your application; we engineer it for approval.",
      "Whether you are seeking an MSME loan, working capital facility, or project finance, pre-underwriting ensures that when your application reaches a lender's desk, it stands out for all the right reasons.",
    ],
    author: "Credora Advisory Team",
    date: "2025-01-10",
    readTime: "6 min read",
    color: "#13277E",
    featured: true,
    tags: ["Pre-Underwriting", "Loan Approval", "Structured Funding"],
    image: "/images/blog/pre-underwriting.png",
  },
  {
    id: "msme-loan-mistakes",
    category: "MSME Funding",
    categoryIcon: Building2,
    title: "5 Common Mistakes MSMEs Make When Applying for Business Loans",
    excerpt:
      "From incomplete documentation to choosing the wrong lender, avoid these common pitfalls that delay or derail your funding journey.",
    content: [
      "MSMEs are the backbone of the Indian economy, yet many struggle to secure the funding they need to grow. Through our work with over 1,200 businesses, we have identified five critical mistakes that consistently derail loan applications.",
      "Mistake 1: Applying without preparing financial documents. Lenders need at least 2 years of ITR, bank statements, and financial statements. Many MSMEs apply with incomplete documentation, leading to instant rejection.",
      "Mistake 2: Not understanding lender criteria. Each bank and NBFC has different eligibility requirements. Applying to a lender whose criteria you do not meet wastes time and adds negative enquiries to your credit profile.",
      "Mistake 3: Multiple simultaneous applications. Every loan application triggers a credit enquiry. Too many enquiries in a short period signals desperation to lenders and lowers your score.",
      "Mistake 4: Ignoring credit profile issues. Errors in your credit report, outstanding disputes, or high credit utilisation can kill an otherwise strong application. Review your credit profile before applying.",
      "Mistake 5: Choosing the first offer. Different lenders offer vastly different terms for the same profile. Without comparing offers across multiple institutions, you may end up with higher interest rates and unfavourable terms.",
    ],
    author: "Credora Advisory Team",
    date: "2025-01-05",
    readTime: "7 min read",
    color: "#87B73C",
    tags: ["MSME Loans", "Business Funding", "Loan Mistakes"],
    image: "/images/blog/msme-loan-mistakes.png",
  },
  {
    id: "understanding-emi-structure",
    category: "Financial Literacy",
    categoryIcon: IndianRupee,
    title: "Understanding EMI: How Principal and Interest Work in Your Loan",
    excerpt:
      "Ever wondered why your EMI stays the same but the interest portion keeps changing? Learn the mechanics behind EMI calculation and amortization schedules.",
    content: [
      "When you take a business loan, your repayment is structured as Equated Monthly Instalments (EMI). While the EMI amount remains constant throughout the tenure, the composition of each EMI — how much goes toward principal and how much toward interest — changes every month.",
      "In the early months of your loan, a larger portion of your EMI goes toward interest payment. As you progress through the tenure, the interest component gradually decreases while the principal component increases. This is because interest is calculated on the outstanding balance, which reduces with each payment.",
      "For example, on a ₹20 lakh business loan at 17% per annum for 18 months, your EMI would be approximately ₹1,26,660. In the first month, about ₹98,327 goes toward principal and ₹28,333 toward interest. By the last month, nearly the entire EMI — ₹1,24,893 — goes toward principal, with only ₹1,769 as interest.",
      "Understanding this structure is crucial for financial planning. It helps you evaluate whether a loan is affordable, compare different loan offers, and make informed decisions about prepayment or restructuring. Use our EMI calculator to see the detailed amortization schedule for your specific loan parameters.",
    ],
    author: "Credora Advisory Team",
    date: "2024-12-28",
    readTime: "5 min read",
    color: "#304AC0",
    tags: ["EMI", "Loan Repayment", "Financial Literacy"],
    image: "/images/blog/emi-structure.png",
  },
  {
    id: "credit-repair-timeline",
    category: "Credit Repair",
    categoryIcon: CreditCard,
    title: "How Long Does Credit Repair Take? A Realistic Timeline",
    excerpt:
      "Credit repair is not overnight. Understand the realistic timeline for resolving errors, updating bureau records, and improving your credit profile for loan eligibility.",
    content: [
      "One of the most common questions we receive is: how long does credit repair take? The honest answer is that it depends on the nature and complexity of the issues in your credit report. However, having worked on hundreds of credit repair cases, we can provide a realistic framework.",
      "Simple corrections — such as updating personal information, removing duplicate accounts, or correcting payment statuses — can often be resolved within 1 to 2 weeks. These are straightforward disputes where the evidence is clear and the bureau or lender responds promptly.",
      "Moderate issues — such as settling outstanding defaults, negotiating with lenders for written-off status removal, or addressing multiple credit enquiries — typically take 2 to 6 weeks. These require coordination between multiple parties and may involve documentation and follow-up.",
      "Complex cases — such as resolving identity theft, addressing fraud accounts, or rebuilding a severely damaged credit profile — can take 2 to 3 months. These require persistent follow-up, legal documentation, and sometimes regulatory intervention.",
      "At Credora, our average resolution time is 1 week for standard cases, thanks to our established relationships with credit bureaus and lenders. We also provide ongoing monitoring and advisory for up to 1 year to ensure your credit profile remains strong.",
    ],
    author: "Credora Advisory Team",
    date: "2024-12-20",
    readTime: "6 min read",
    color: "#13277E",
    tags: ["Credit Repair", "Credit Bureau", "Timeline"],
    image: "/images/blog/credit-repair.png",
  },
  {
    id: "choosing-right-lender",
    category: "Fund Raising",
    categoryIcon: TrendingUp,
    title: "PSU Bank vs Private Bank vs NBFC: Which Lender Is Right for Your Business?",
    excerpt:
      "Not all lenders are created equal. Learn the key differences between PSU banks, private banks, and NBFCs, and how to choose the right one for your funding needs.",
    content: [
      "India's lending landscape offers three broad categories of institutional lenders: PSU banks, private banks, and NBFCs. Each has distinct characteristics that make them suitable for different types of borrowers and loan requirements.",
      "PSU Banks (like SBI, PNB, Bank of Baroda) typically offer the lowest interest rates, especially for secured loans and government-backed schemes. They have strong regulatory oversight and are ideal for long-term loans, project finance, and businesses with strong collateral. However, their processing times are longer and documentation requirements are more stringent.",
      "Private Banks (like HDFC, ICICI, Axis) offer a balance of competitive rates and faster processing. They are more flexible with documentation and often have specialised products for MSMEs and professionals. Their digital platforms make application and tracking easier. They work well for businesses that need quicker disbursals with reasonable rates.",
      "NBFCs (like Bajaj Finserv, Tata Capital, Mahindra) are the most flexible in terms of eligibility criteria and documentation. They process applications fastest and often approve loans that banks might reject. However, their interest rates tend to be higher. NBFCs are ideal for businesses with unique profiles or those needing very fast funding.",
      "The right choice depends on your specific situation: your credit profile, urgency, loan amount, collateral availability, and the purpose of funding. At Credora, we map your profile to the best-fit lenders across all three categories, ensuring you get optimal terms without unnecessary enquiries.",
    ],
    author: "Credora Advisory Team",
    date: "2024-12-15",
    readTime: "8 min read",
    color: "#87B73C",
    tags: ["Lender Selection", "PSU Bank", "NBFC", "Private Bank"],
    image: "/images/blog/choosing-lender.png",
  },
];

export const categories = [
  { label: "All Posts", value: "all" },
  { label: "Credit Health", value: "Credit Health" },
  { label: "Loan Structuring", value: "Loan Structuring" },
  { label: "MSME Funding", value: "MSME Funding" },
  { label: "Financial Literacy", value: "Financial Literacy" },
  { label: "Credit Repair", value: "Credit Repair" },
  { label: "Fund Raising", value: "Fund Raising" },
];
