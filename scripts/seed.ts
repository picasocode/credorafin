/**
 * Seed script — creates initial admin user and default job positions.
 * Run with: bun run /home/z/my-project/scripts/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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
      data: {
        email: adminEmail,
        name: "Super Admin",
        role: "super_admin",
        passwordHash,
      },
    });
    console.log(`  ✓ Created admin user: ${adminEmail} / ${adminPassword}`);
  }

  // ── 2. Seed default job positions ──
  const positions = [
    {
      title: "Credit Analyst",
      department: "Credit & Risk",
      location: "Chennai",
      type: "Full-time",
      experience: "1–3 years",
      salary: "₹4L – ₹7L PA",
      color: "#304AC0",
      description:
        "Evaluate creditworthiness of MSME borrowers by analysing financial statements, bank statements, CIBIL reports, and GST data. Prepare structured credit notes and present recommendations to the lending committee.",
      skills: JSON.stringify(["Financial Statement Analysis", "CIBIL / Credit Bureau", "MSME Lending", "Excel & MIS Reporting"]),
    },
    {
      title: "Relationship Manager — Business Loans",
      department: "Sales & Partnerships",
      location: "Chennai",
      type: "Full-time",
      experience: "2–5 years",
      salary: "₹5L – ₹9L PA",
      color: "#87B73C",
      description:
        "Manage end-to-end client relationships for MSME loan origination. From initial profiling and needs assessment to application structuring, lender coordination, and post-disbursal support. Drive disbursal targets while maintaining high client satisfaction.",
      skills: JSON.stringify(["B2B Sales", "Loan Origination", "Client Relationship Management", "Negotiation"]),
    },
    {
      title: "Loan Processing Executive",
      department: "Operations",
      location: "Chennai",
      type: "Full-time",
      experience: "0–2 years",
      salary: "₹3L – ₹5L PA",
      color: "#13277E",
      description:
        "Handle loan application processing including document collection, verification, data entry into lender portals, and coordination with banks and NBFCs for faster turnarounds. Ensure compliance and completeness of every file.",
      skills: JSON.stringify(["Loan Processing", "Documentation", "Banking Operations", "Attention to Detail"]),
    },
    {
      title: "Business Development Associate",
      department: "Sales & Partnerships",
      location: "Chennai / Remote",
      type: "Full-time",
      experience: "0–2 years",
      salary: "₹3L – ₹5L PA",
      color: "#304AC0",
      description:
        "Identify and onboard new referral partners including CAs, tax consultants, and business brokers. Build and nurture partnerships that generate a steady pipeline of qualified leads. Support marketing campaigns and events.",
      skills: JSON.stringify(["Lead Generation", "Partner Onboarding", "CRM Tools", "Communication"]),
    },
    {
      title: "Full-Stack Developer",
      department: "Technology",
      location: "Chennai / Remote",
      type: "Full-time",
      experience: "2–4 years",
      salary: "₹8L – ₹14L PA",
      color: "#1C1D62",
      description:
        "Build and maintain Credora's web platform and internal tools. Work with Next.js, React, TypeScript, and Node.js to create seamless digital experiences for clients and partners. Collaborate with the product team on new features.",
      skills: JSON.stringify(["Next.js / React", "TypeScript", "Node.js", "PostgreSQL / Prisma"]),
    },
    {
      title: "Digital Marketing Executive",
      department: "Marketing",
      location: "Chennai / Remote",
      type: "Full-time",
      experience: "1–3 years",
      salary: "₹4L – ₹6L PA",
      color: "#87B73C",
      description:
        "Plan and execute digital marketing campaigns across Google Ads, LinkedIn, and social media. Manage SEO, content marketing, and performance analytics. Drive qualified inbound leads and improve brand visibility in the fintech space.",
      skills: JSON.stringify(["Google Ads", "SEO / SEM", "Social Media Marketing", "Analytics & Reporting"]),
    },
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
