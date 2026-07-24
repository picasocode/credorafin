/**
 * Seed script — creates initial admin user, default job positions,
 * default hero slides, and default blog posts (idempotent).
 * Run with: bun run /home/z/my-project/scripts/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { blogPosts } from "../src/lib/blog-data";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── 1. Create default admin user ──
  const adminEmail = "admin@credora.in";
  const adminPassword = "credora@admin123";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const existing = await db.adminUser.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log(`  ✓ Admin user already exists: ${adminEmail}`);
  } else {
    await db.adminUser.create({
      data: { email: adminEmail, name: "Super Admin", role: "super_admin", passwordHash },
    });
    console.log(`  ✓ Created admin user: ${adminEmail} / ${adminPassword}`);
  }

  // ── 2. Seed default job positions ──
  const positions = [
    { title: "Credit Analyst", department: "Credit & Risk", location: "Chennai", type: "Full-time", experience: "1–3 years", salary: "₹4L – ₹7L PA", color: "#304AC0", description: "Evaluate creditworthiness of MSME borrowers by analysing financial statements, bank statements, CIBIL reports, and GST data. Prepare structured credit notes and present recommendations to the lending committee.", skills: JSON.stringify(["Financial Statement Analysis", "CIBIL / Credit Bureau", "MSME Lending", "Excel & MIS Reporting"]) },
    { title: "Relationship Manager — Business Loans", department: "Sales & Partnerships", location: "Chennai", type: "Full-time", experience: "2–5 years", salary: "₹5L – ₹9L PA", color: "#87B73C", description: "Manage end-to-end client relationships for MSME loan origination. From initial profiling and needs assessment to application structuring, lender coordination, and post-disbursal support. Drive disbursal targets while maintaining high client satisfaction.", skills: JSON.stringify(["B2B Sales", "Loan Origination", "Client Relationship Management", "Negotiation"]) },
    { title: "Loan Processing Executive", department: "Operations", location: "Chennai", type: "Full-time", experience: "0–2 years", salary: "₹3L – ₹5L PA", color: "#13277E", description: "Handle loan application processing including document collection, verification, data entry into lender portals, and coordination with banks and NBFCs for faster turnarounds. Ensure compliance and completeness of every file.", skills: JSON.stringify(["Loan Processing", "Documentation", "Banking Operations", "Attention to Detail"]) },
    { title: "Business Development Associate", department: "Sales & Partnerships", location: "Chennai / Remote", type: "Full-time", experience: "0–2 years", salary: "₹3L – ₹5L PA", color: "#304AC0", description: "Identify and onboard new referral partners including CAs, tax consultants, and business brokers. Build and nurture partnerships that generate a steady pipeline of qualified leads. Support marketing campaigns and events.", skills: JSON.stringify(["Lead Generation", "Partner Onboarding", "CRM Tools", "Communication"]) },
    { title: "Full-Stack Developer", department: "Technology", location: "Chennai / Remote", type: "Full-time", experience: "2–4 years", salary: "₹8L – ₹14L PA", color: "#1C1D62", description: "Build and maintain Credora's web platform and internal tools. Work with Next.js, React, TypeScript, and Node.js to create seamless digital experiences for clients and partners. Collaborate with the product team on new features.", skills: JSON.stringify(["Next.js / React", "TypeScript", "Node.js", "PostgreSQL / Prisma"]) },
    { title: "Digital Marketing Executive", department: "Marketing", location: "Chennai / Remote", type: "Full-time", experience: "1–3 years", salary: "₹4L – ₹6L PA", color: "#87B73C", description: "Plan and execute digital marketing campaigns across Google Ads, LinkedIn, and social media. Manage SEO, content marketing, and performance analytics. Drive qualified inbound leads and improve brand visibility in the fintech space.", skills: JSON.stringify(["Google Ads", "SEO / SEM", "Social Media Marketing", "Analytics & Reporting"]) },
  ];

  for (const p of positions) {
    const existingPos = await db.jobPosition.findFirst({ where: { title: p.title } });
    if (existingPos) {
      console.log(`  ✓ Position already exists: ${p.title}`);
    } else {
      await db.jobPosition.create({ data: p });
      console.log(`  ✓ Created position: ${p.title}`);
    }
  }

  // ── 3. Seed default hero slides (home page slider) ──
  // Hero slides are synced to this seed definition on every run
  // (delete + recreate) so the baseline content stays controlled.
  // Admin edits made via the dashboard will be reset by a re-seed.
  const heroSlides = [
    {
      badge: "Empowering Enterprises",
      headingWords: JSON.stringify(["Accelerate", "Your MSME", "Growth"]),
      subtitle: "Customized collateral-free funding solutions syndicated across 70+ banking partners globally.",
      cta1: "Build Finance", cta2: "Contact us",
      image: "/images/pages/hero-indian-team.png",
      fallbackImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80",
      hudLeftMetric: "+18%", hudLeftLabel: "Market Forecast", hudLeftStatus: "Optimal Condition",
      hudRightMetric: "9.5% p.a.", hudRightLabel: "Average Interest Rate", hudRightTrend: "Stable",
      hudGraphValue: "₹50 Crores", hudGraphLabel: "Max Liquidity Pool Available",
      tabLabel: "MSME Loan", tabIcon: "Building2", accent: "#1A2255", sortOrder: 0,
    },
    {
      badge: "Infrastructure & Scale",
      headingWords: JSON.stringify(["Raise", "Capital for", "Large Projects"]),
      subtitle: "Specialized debt structuring, liquidity sourcing, and structured corporate finance built for industrial expansion.",
      cta1: "Raise Capital", cta2: "Contact us",
      image: "/images/pages/office-india.png",
      fallbackImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
      hudLeftMetric: "Tier-1", hudLeftLabel: "Sourcing Channel", hudLeftStatus: "Priority Route",
      hudRightMetric: "₹100 Cr", hudRightLabel: "Maximum Allocation Cap", hudRightTrend: "High Demand",
      hudGraphValue: "Syndicated", hudGraphLabel: "Multi-Bank Framework Active",
      tabLabel: "Project Finance", tabIcon: "TrendingUp", accent: "#1A2255", sortOrder: 1,
    },
    {
      badge: "Working Capital Unlocked",
      headingWords: JSON.stringify(["Optimize", "Cash Flow with", "SCF Solutions"]),
      subtitle: "Vendor payment discounting and receivables financing that keep your supply chain liquid and resilient.",
      cta1: "Get SCF", cta2: "Contact us",
      image: "/images/pages/success-india.png",
      fallbackImage: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1600&q=80",
      hudLeftMetric: "90 Days", hudLeftLabel: "Payment Cycle", hudLeftStatus: "Discounted Early",
      hudRightMetric: "0 Collateral", hudRightLabel: "Asset-Light Facility", hudRightTrend: "Flexible",
      hudGraphValue: "₹25 Crores", hudGraphLabel: "Annual SCF Limit Available",
      tabLabel: "Supply Chain Finance", tabIcon: "Briefcase", accent: "#1A2255", sortOrder: 2,
    },
    {
      badge: "Partner & Earn",
      headingWords: JSON.stringify(["Grow", "Together as a", "Referral Partner"]),
      subtitle: "Refer MSME clients and earn attractive recurring commissions while helping businesses access faster funding.",
      cta1: "Become a Partner", cta2: "Contact us",
      image: "/images/pages/referral-india.png",
      fallbackImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
      hudLeftMetric: "Tier-1", hudLeftLabel: "Commission Slab", hudLeftStatus: "Recurring Payouts",
      hudRightMetric: "48 Hours", hudRightLabel: "Payout Cycle", hudRightTrend: "Transparent",
      hudGraphValue: "Unlimited", hudGraphLabel: "Referral Earning Potential",
      tabLabel: "Referral Partner", tabIcon: "Handshake", accent: "#1A2255", sortOrder: 3,
    },
    {
      badge: "Financial Reconstruction",
      headingWords: JSON.stringify(["Resolve", "Defaults &", "Repair Credit"]),
      subtitle: "Struggling with historical settlement records or complex CIBIL positions? Restore corporate leverage now.",
      cta1: "Fix Credit Score", cta2: "Contact us",
      image: "/images/pages/handshake-india.png",
      fallbackImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
      hudLeftMetric: "+150", hudLeftLabel: "CIBIL Score Shift", hudLeftStatus: "Engine Optimized",
      hudRightMetric: "Rapid", hudRightLabel: "Settlement Cycle Time", hudRightTrend: "Immediate Plan",
      hudGraphValue: "Restored", hudGraphLabel: "Removal of Legacy Default History",
      tabLabel: "Credit Repair Services", tabIcon: "ShieldCheck", accent: "#1A2255", sortOrder: 4,
    },
  ];

  // Sync hero slides to the seed definition (delete + recreate).
  await db.heroSlide.deleteMany({});
  for (const s of heroSlides) {
    await db.heroSlide.create({ data: s });
  }
  console.log(`  ✓ Synced ${heroSlides.length} hero slides`);

  // ── 4. Seed default blog posts ──
  let blogCreated = 0;
  for (const p of blogPosts) {
    const existingPost = await db.blogPost.findUnique({ where: { id: p.id } });
    if (existingPost) continue;
    await db.blogPost.create({
      data: {
        id: p.id,
        category: p.category,
        categoryIcon: p.categoryIcon,
        title: p.title,
        excerpt: p.excerpt,
        content: JSON.stringify(p.content),
        author: p.author,
        date: p.date,
        readTime: p.readTime,
        color: p.color,
        featured: !!p.featured,
        tags: JSON.stringify(p.tags),
        image: p.image,
        isActive: true,
      },
    });
    blogCreated++;
  }
  if (blogCreated > 0) {
    console.log(`  ✓ Created ${blogCreated} blog posts`);
  } else {
    console.log(`  ✓ Blog posts already seeded`);
  }

  console.log("\n✅ Seed complete!");
  console.log("   Admin login: admin@credora.in / credora@admin123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
