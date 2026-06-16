"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  IndianRupee,
  Percent,
  Calendar,
  TrendingDown,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  FileText,
  BarChart3,
  PieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ────────────────────────────────────────────
   EMI CALCULATION LOGIC
   ──────────────────────────────────────────── */

interface AmortizationRow {
  month: number;
  dueDate: string; // DD-MMM-YY format
  openingPrincipal: number;
  emi: number;
  principal: number;
  interest: number;
  closingPrincipal: number;
}

function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) return 0;
  const monthlyRate = annualRate / 12 / 100;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return emi;
}

function formatDueDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const monthShort = date
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();
  const yearShort = String(date.getFullYear()).slice(-2);
  return `${day}-${monthShort}-${yearShort}`;
}

function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  startDate: string
): AmortizationRow[] {
  if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) return [];
  const monthlyRate = annualRate / 12 / 100;
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const schedule: AmortizationRow[] = [];
  let balance = principal;

  const start = startDate ? new Date(startDate) : new Date();

  for (let month = 1; month <= tenureMonths; month++) {
    const interest = balance * monthlyRate;
    const principalPart = emi - interest;
    const closing = balance - principalPart;

    // Due date = start date + month offset
    const dueDate = new Date(start);
    dueDate.setMonth(dueDate.getMonth() + month);

    schedule.push({
      month,
      dueDate: formatDueDate(dueDate),
      openingPrincipal: Math.round(balance * 100) / 100,
      emi: Math.round(emi * 100) / 100,
      principal: Math.round(principalPart * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      closingPrincipal: Math.round(Math.max(0, closing) * 100) / 100,
    });

    balance = Math.max(0, closing);
  }

  return schedule;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/* ────────────────────────────────────────────
   MINI PIE CHART (CSS-based, no library)
   ──────────────────────────────────────────── */
function MiniPieChart({
  principalPercent,
  interestPercent,
  principalColor = "#304AC0",
  interestColor = "#87B73C",
}: {
  principalPercent: number;
  interestPercent: number;
  principalColor?: string;
  interestColor?: string;
}) {
  const principalDeg = (principalPercent / 100) * 360;
  const interestDeg = (interestPercent / 100) * 360;

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={principalColor}
          strokeWidth="18"
          pathLength="360"
          strokeDasharray={`${principalDeg} ${360 - principalDeg}`}
          strokeDashoffset="0"
          className="transition-all duration-700"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={interestColor}
          strokeWidth="18"
          pathLength="360"
          strokeDasharray={`${interestDeg} ${360 - interestDeg}`}
          strokeDashoffset={`-${principalDeg}`}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold text-[#1C1D62]">EMI</div>
          <div className="text-xs text-[#718096]">Breakup</div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   MAIN EMI CALCULATOR COMPONENT
   ──────────────────────────────────────────── */

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(2000000);
  const [interestRate, setInterestRate] = useState(17);
  const [tenure, setTenure] = useState(18);
  const [tenureType, setTenureType] = useState<"months" | "years">("months");
  const [startDate, setStartDate] = useState(getTodayString);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  const tenureMonths = useMemo(
    () => (tenureType === "years" ? tenure * 12 : tenure),
    [tenure, tenureType]
  );

  const emi = useMemo(
    () => calculateEMI(loanAmount, interestRate, tenureMonths),
    [loanAmount, interestRate, tenureMonths]
  );

  const schedule = useMemo(
    () =>
      generateAmortizationSchedule(
        loanAmount,
        interestRate,
        tenureMonths,
        startDate
      ),
    [loanAmount, interestRate, tenureMonths, startDate]
  );

  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - loanAmount;
  const principalPercent =
    totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 0;
  const interestPercent =
    totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  const handleLoanAmountChange = useCallback(
    (value: number[]) => setLoanAmount(value[0]),
    []
  );
  const handleInterestRateChange = useCallback(
    (value: number[]) => setInterestRate(value[0]),
    []
  );
  const handleTenureChange = useCallback(
    (value: number[]) => setTenure(value[0]),
    []
  );

  /* ─── Excel Export ─── */
  const downloadExcel = useCallback(() => {
    if (schedule.length === 0) return;

    const wb = XLSX.utils.book_new();

    // Summary rows at top
    const summaryData = [
      ["Loan Amortization Schedule"],
      [],
      ["Loan Amount (INR)", loanAmount],
      ["Interest Rate (p.a.)", `${interestRate}%`],
      ["Tenure", `${tenure} ${tenureType}`],
      ["Monthly EMI (INR)", Math.round(emi * 100) / 100],
      ["Total Interest (INR)", Math.round(totalInterest * 100) / 100],
      ["Total Payment (INR)", Math.round(totalPayment * 100) / 100],
      [],
      [],
    ];

    // Table headers
    const headers = [
      "Serial No.",
      "Due Date",
      "Opening Principal INR",
      "Installment Amount INR",
      "Principal Amount INR",
      "Interest Amount INR",
      "Closing Principal INR",
    ];

    // Table rows
    const rows = schedule.map((row) => [
      row.month,
      row.dueDate,
      row.openingPrincipal,
      row.emi,
      row.principal,
      row.interest,
      row.closingPrincipal,
    ]);

    // Total row
    const totalRow = [
      "",
      "TOTAL",
      "",
      schedule.reduce((s, r) => s + r.emi, 0),
      schedule.reduce((s, r) => s + r.principal, 0),
      schedule.reduce((s, r) => s + r.interest, 0),
      0,
    ];

    const endRow = ["***END OF REPORT***"];

    const allData = [...summaryData, headers, ...rows, totalRow, [], endRow];
    const ws = XLSX.utils.aoa_to_sheet(allData);

    // Column widths
    ws["!cols"] = [
      { wch: 12 }, // Serial No.
      { wch: 14 }, // Due Date
      { wch: 24 }, // Opening Principal INR
      { wch: 24 }, // Installment Amount INR
      { wch: 22 }, // Principal Amount INR
      { wch: 22 }, // Interest Amount INR
      { wch: 24 }, // Closing Principal INR
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Amortization Schedule");
    XLSX.writeFile(wb, "amortization-schedule.xlsx");
  }, [schedule, loanAmount, interestRate, tenure, tenureType, emi, totalInterest, totalPayment]);

  /* ─── PDF Export ─── */
  const downloadPDF = useCallback(() => {
    if (schedule.length === 0) return;

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Loan Amortization Schedule", 148.5, 15, { align: "center" });

    // Summary section
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const summaryY = 22;
    const summaryItems = [
      `Loan Amount: INR ${formatNumber(loanAmount)}`,
      `Interest Rate: ${interestRate}% p.a.`,
      `Tenure: ${tenure} ${tenureType}`,
      `Monthly EMI: INR ${formatNumber(emi)}`,
      `Total Interest: INR ${formatNumber(totalInterest)}`,
      `Total Payment: INR ${formatNumber(totalPayment)}`,
    ];

    summaryItems.forEach((item, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      doc.text(item, 14 + col * 95, summaryY + row * 6);
    });

    // Table
    const tableHeaders = [
      "Serial No.",
      "Due Date",
      "Opening Principal INR",
      "Installment Amount INR",
      "Principal Amount INR",
      "Interest Amount INR",
      "Closing Principal INR",
    ];

    const tableRows = schedule.map((row) => [
      String(row.month),
      row.dueDate,
      formatNumber(row.openingPrincipal),
      formatNumber(row.emi),
      formatNumber(row.principal),
      formatNumber(row.interest),
      formatNumber(row.closingPrincipal),
    ]);

    // Total row
    tableRows.push([
      "",
      "TOTAL",
      "",
      formatNumber(schedule.reduce((s, r) => s + r.emi, 0)),
      formatNumber(schedule.reduce((s, r) => s + r.principal, 0)),
      formatNumber(schedule.reduce((s, r) => s + r.interest, 0)),
      "0.00",
    ]);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableRows,
      startY: summaryY + 16,
      styles: {
        fontSize: 7,
        cellPadding: 2,
        halign: "right",
      },
      headStyles: {
        fillColor: [28, 29, 98], // #1C1D62
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
        fontSize: 7,
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 18 },
        1: { halign: "center", cellWidth: 24 },
        2: { halign: "right", cellWidth: 34 },
        3: { halign: "right", cellWidth: 36 },
        4: { halign: "right", cellWidth: 32 },
        5: { halign: "right", cellWidth: 32 },
        6: { halign: "right", cellWidth: 34 },
      },
      alternateRowStyles: {
        fillColor: [247, 249, 252], // #F7F9FC
      },
      // Style the total row
      didParseCell: (data) => {
        if (data.row.index === tableRows.length - 1) {
          data.cell.styles.fillColor = [28, 29, 98];
          data.cell.styles.textColor = [255, 255, 255];
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    // ***END OF REPORT***
    const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 200;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("***END OF REPORT***", 148.5, finalY + 10, { align: "center" });

    doc.save("amortization-schedule.pdf");
  }, [schedule, loanAmount, interestRate, tenure, tenureType, emi, totalInterest, totalPayment]);

  return (
    <section id="emi-calculator" className="py-16 md:py-24 bg-[#F7F9FC] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#304AC0]/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#87B73C]/[0.03] rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 bg-[#304AC0]/10 text-[#304AC0] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            <Calculator className="w-3.5 h-3.5" />
            EMI Calculator
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1D62] leading-tight">
            Calculate Your EMI
          </h2>
          <p className="mt-4 text-lg text-[#718096] leading-relaxed">
            Plan your loan repayment with our EMI calculator. View a detailed
            amortization schedule to understand your principal and interest
            breakup.
          </p>
        </motion.div>

        {/* Calculator Card */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl border border-[#E8ECF0] overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Left — Input Controls */}
            <div className="lg:col-span-2 p-6 md:p-8 bg-gradient-to-br from-[#1C1D62] to-[#13277E] text-white">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#87B73C]" />
                Loan Parameters
              </h3>

              {/* Loan Amount */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5" />
                    Loan Amount
                  </label>
                  <div className="bg-white/10 rounded-lg px-3 py-1.5">
                    <Input
                      type="text"
                      value={formatCurrency(loanAmount)}
                      onChange={(e) => {
                        const val = parseFloat(
                          e.target.value.replace(/[^0-9.-]+/g, "")
                        );
                        if (!isNaN(val) && val >= 0 && val <= 100000000)
                          setLoanAmount(val);
                      }}
                      className="bg-transparent border-0 text-right text-white font-semibold text-sm p-0 h-auto focus:ring-0 focus:outline-none w-32"
                    />
                  </div>
                </div>
                <Slider
                  value={[loanAmount]}
                  onValueChange={handleLoanAmountChange}
                  min={50000}
                  max={50000000}
                  step={50000}
                  className="[&_[role=slider]]:bg-[#87B73C] [&_[role=slider]]:border-0 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_.relative]:bg-white/20 [&_.relative]:h-2"
                />
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>₹50K</span>
                  <span>₹5Cr</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5" />
                    Interest Rate (p.a.)
                  </label>
                  <div className="bg-white/10 rounded-lg px-3 py-1.5 flex items-center gap-1">
                    <Input
                      type="number"
                      value={interestRate}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val >= 0.5 && val <= 36)
                          setInterestRate(val);
                      }}
                      step={0.1}
                      min={0.5}
                      max={36}
                      className="bg-transparent border-0 text-right text-white font-semibold text-sm p-0 h-auto focus:ring-0 focus:outline-none w-16"
                    />
                    <span className="text-white/60 text-xs">%</span>
                  </div>
                </div>
                <Slider
                  value={[interestRate]}
                  onValueChange={handleInterestRateChange}
                  min={0.5}
                  max={36}
                  step={0.1}
                  className="[&_[role=slider]]:bg-[#87B73C] [&_[role=slider]]:border-0 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_.relative]:bg-white/20 [&_.relative]:h-2"
                />
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>0.5%</span>
                  <span>36%</span>
                </div>
              </div>

              {/* Tenure */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Loan Tenure
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/10 rounded-lg px-3 py-1.5">
                      <Input
                        type="number"
                        value={tenure}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val >= 1)
                            setTenure(
                              Math.min(
                                val,
                                tenureType === "years" ? 30 : 360
                              )
                            );
                        }}
                        min={1}
                        max={tenureType === "years" ? 30 : 360}
                        className="bg-transparent border-0 text-right text-white font-semibold text-sm p-0 h-auto focus:ring-0 focus:outline-none w-12"
                      />
                    </div>
                    <Select
                      value={tenureType}
                      onValueChange={(val: "months" | "years") =>
                        setTenureType(val)
                      }
                    >
                      <SelectTrigger className="bg-white/10 border-0 text-white text-xs h-8 w-24 rounded-lg focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="months">Months</SelectItem>
                        <SelectItem value="years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Slider
                  value={[tenure]}
                  onValueChange={handleTenureChange}
                  min={1}
                  max={tenureType === "years" ? 30 : 360}
                  step={1}
                  className="[&_[role=slider]]:bg-[#87B73C] [&_[role=slider]]:border-0 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_.relative]:bg-white/20 [&_.relative]:h-2"
                />
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>1 {tenureType === "years" ? "Yr" : "Mo"}</span>
                  <span>
                    {tenureType === "years" ? "30 Yrs" : "360 Mo"}
                  </span>
                </div>
              </div>

              {/* Loan Start Date */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-white/80 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Loan Start Date
                  </label>
                  <div className="bg-white/10 rounded-lg px-3 py-1.5">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-transparent border-0 text-right text-white font-semibold text-sm p-0 h-auto focus:ring-0 focus:outline-none w-36 [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-white/50 mb-3">Quick Presets</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "₹10L / 12Mo / 12%", amt: 1000000, rate: 12, ten: 12, type: "months" as const },
                    { label: "₹20L / 18Mo / 17%", amt: 2000000, rate: 17, ten: 18, type: "months" as const },
                    { label: "₹50L / 5Yr / 14%", amt: 5000000, rate: 14, ten: 5, type: "years" as const },
                    { label: "₹1Cr / 10Yr / 11%", amt: 10000000, rate: 11, ten: 10, type: "years" as const },
                  ].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setLoanAmount(preset.amt);
                        setInterestRate(preset.rate);
                        setTenure(preset.ten);
                        setTenureType(preset.type);
                      }}
                      className="text-xs bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg px-3 py-2 text-white/80 hover:text-white transition-all duration-200 text-left"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Results */}
            <div className="lg:col-span-3 p-6 md:p-8">
              {/* EMI Result Highlight */}
              <motion.div
                className="bg-gradient-to-r from-[#F0F4FF] to-[#F5F8EC] rounded-2xl p-6 mb-6"
                key={emi}
                initial={{ scale: 0.98, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Monthly EMI */}
                  <div className="text-center sm:text-left">
                    <p className="text-xs font-medium text-[#718096] uppercase tracking-wider mb-1">
                      Monthly EMI
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#304AC0]">
                      {formatCurrency(Math.round(emi))}
                    </p>
                  </div>
                  {/* Total Interest */}
                  <div className="text-center sm:text-left">
                    <p className="text-xs font-medium text-[#718096] uppercase tracking-wider mb-1">
                      Total Interest
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#87B73C]">
                      {formatCurrency(Math.round(totalInterest))}
                    </p>
                  </div>
                  {/* Total Payment */}
                  <div className="text-center sm:text-left">
                    <p className="text-xs font-medium text-[#718096] uppercase tracking-wider mb-1">
                      Total Payment
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#1C1D62]">
                      {formatCurrency(Math.round(totalPayment))}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Visual Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {/* Pie Chart */}
                <div className="bg-[#F7F9FC] rounded-xl p-4">
                  <MiniPieChart
                    principalPercent={principalPercent}
                    interestPercent={interestPercent}
                  />
                  <div className="flex justify-center gap-6 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#304AC0]" />
                      <span className="text-xs text-[#718096]">
                        Principal ({principalPercent.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#87B73C]" />
                      <span className="text-xs text-[#718096]">
                        Interest ({interestPercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Info */}
                <div className="space-y-3">
                  <div className="bg-[#F0F4FF] rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#304AC0]/10 flex items-center justify-center">
                      <IndianRupee className="w-5 h-5 text-[#304AC0]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#718096]">Principal Amount</p>
                      <p className="text-sm font-semibold text-[#1C1D62]">
                        {formatCurrency(loanAmount)}
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#F5F8EC] rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#87B73C]/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-[#87B73C]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#718096]">Total Interest Payable</p>
                      <p className="text-sm font-semibold text-[#1C1D62]">
                        {formatCurrency(Math.round(totalInterest))}
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#EEF0FA] rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#13277E]/10 flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-[#13277E]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#718096]">
                        Interest-to-Principal Ratio
                      </p>
                      <p className="text-sm font-semibold text-[#1C1D62]">
                        {(totalInterest / loanAmount).toFixed(2)}x
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Yearly Summary Bar Chart (CSS-based) */}
              {schedule.length > 0 && (
                <div className="bg-[#F7F9FC] rounded-xl p-4 mb-6">
                  <h4 className="text-sm font-semibold text-[#1C1D62] mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#304AC0]" />
                    Yearly Principal vs Interest
                  </h4>
                  <YearlyChart schedule={schedule} />
                </div>
              )}

              {/* Download Buttons */}
              <div className="flex justify-end gap-3 mb-4">
                <Button
                  onClick={downloadExcel}
                  variant="outline"
                  className="border-[#304AC0] text-[#304AC0] hover:bg-[#304AC0] hover:text-white text-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
                  Download Excel
                </Button>
                <Button
                  onClick={downloadPDF}
                  variant="outline"
                  className="border-[#87B73C] text-[#87B73C] hover:bg-[#87B73C] hover:text-white text-xs"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  Download PDF
                </Button>
              </div>

              {/* Amortization Schedule Table */}
              {schedule.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-[#1C1D62] flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-[#87B73C]" />
                      Amortization Schedule
                    </h4>
                    <button
                      onClick={() => setShowFullSchedule(!showFullSchedule)}
                      className="text-xs text-[#304AC0] hover:text-[#13277E] font-medium flex items-center gap-1 transition-colors"
                    >
                      {showFullSchedule ? "Show Less" : "Show All Months"}
                      {showFullSchedule ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  <div className="border border-[#E8ECF0] rounded-xl overflow-hidden">
                    <div className="max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-[#F0F4FF] hover:bg-[#F0F4FF]">
                            <TableHead className="text-xs font-semibold text-[#1C1D62]">
                              Serial No.
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-[#1C1D62]">
                              Due Date
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-[#1C1D62] text-right">
                              Opening Principal INR
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-[#1C1D62] text-right">
                              Installment Amount INR
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-[#304AC0] text-right">
                              Principal Amount INR
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-[#87B73C] text-right">
                              Interest Amount INR
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-[#1C1D62] text-right">
                              Closing Principal INR
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(showFullSchedule
                            ? schedule
                            : schedule.slice(0, 6)
                          ).map((row, i) => (
                            <TableRow
                              key={row.month}
                              className={
                                i % 2 === 0 ? "bg-white" : "bg-[#FAFBFD]"
                              }
                            >
                              <TableCell className="text-xs font-medium text-[#1C1D62]">
                                {row.month}
                              </TableCell>
                              <TableCell className="text-xs font-medium text-[#1C1D62]">
                                {row.dueDate}
                              </TableCell>
                              <TableCell className="text-xs text-[#718096] text-right">
                                {formatNumber(row.openingPrincipal)}
                              </TableCell>
                              <TableCell className="text-xs font-medium text-[#1C1D62] text-right">
                                {formatNumber(row.emi)}
                              </TableCell>
                              <TableCell className="text-xs font-medium text-[#304AC0] text-right">
                                {formatNumber(row.principal)}
                              </TableCell>
                              <TableCell className="text-xs font-medium text-[#87B73C] text-right">
                                {formatNumber(row.interest)}
                              </TableCell>
                              <TableCell className="text-xs text-[#718096] text-right">
                                {formatNumber(row.closingPrincipal)}
                              </TableCell>
                            </TableRow>
                          ))}
                          {!showFullSchedule && schedule.length > 6 && (
                            <TableRow>
                              <TableCell
                                colSpan={7}
                                className="text-center text-xs text-[#718096] py-3"
                              >
                                + {schedule.length - 6} more months — Click &quot;
                                Show All Months&quot; to view full schedule
                              </TableCell>
                            </TableRow>
                          )}
                          {/* Totals Row */}
                          {showFullSchedule && (
                            <>
                              <TableRow className="bg-[#1C1D62] hover:bg-[#1C1D62]">
                                <TableCell className="text-xs font-bold text-white">
                                  Total
                                </TableCell>
                                <TableCell className="text-xs text-white/50">
                                  —
                                </TableCell>
                                <TableCell className="text-xs text-white/50 text-right">
                                  —
                                </TableCell>
                                <TableCell className="text-xs font-bold text-white text-right">
                                  {formatNumber(
                                    schedule.reduce((s, r) => s + r.emi, 0)
                                  )}
                                </TableCell>
                                <TableCell className="text-xs font-bold text-[#87B73C] text-right">
                                  {formatNumber(
                                    schedule.reduce((s, r) => s + r.principal, 0)
                                  )}
                                </TableCell>
                                <TableCell className="text-xs font-bold text-[#87B73C] text-right">
                                  {formatNumber(
                                    schedule.reduce((s, r) => s + r.interest, 0)
                                  )}
                                </TableCell>
                                <TableCell className="text-xs text-white/50 text-right">
                                  0.00
                                </TableCell>
                              </TableRow>
                              {/* END OF REPORT */}
                              <TableRow>
                                <TableCell
                                  colSpan={7}
                                  className="text-center text-xs font-bold text-[#1C1D62] py-3 tracking-wider"
                                >
                                  ***END OF REPORT***
                                </TableCell>
                              </TableRow>
                            </>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-[#718096] mt-6 max-w-2xl mx-auto">
          This EMI calculator provides indicative figures for planning purposes
          only. Actual EMI, interest rates, and repayment schedules may vary
          based on the lender&apos;s terms, your credit profile, and prevailing
          market conditions. Please consult with our advisors for personalized
          loan structuring.
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────
   YEARLY CHART (CSS-based, no external library)
   ──────────────────────────────────────────── */

function YearlyChart({ schedule }: { schedule: AmortizationRow[] }) {
  const yearlyData = useMemo(() => {
    const years: { year: number; principal: number; interest: number }[] = [];
    let currentYear = 1;
    let yearPrincipal = 0;
    let yearInterest = 0;

    schedule.forEach((row, i) => {
      yearPrincipal += row.principal;
      yearInterest += row.interest;
      if ((i + 1) % 12 === 0 || i === schedule.length - 1) {
        years.push({
          year: currentYear,
          principal: yearPrincipal,
          interest: yearInterest,
        });
        currentYear++;
        yearPrincipal = 0;
        yearInterest = 0;
      }
    });

    return years;
  }, [schedule]);

  const maxTotal = Math.max(
    ...yearlyData.map((d) => d.principal + d.interest)
  );

  return (
    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
      {yearlyData.map((data) => (
        <div key={data.year} className="flex items-center gap-3">
          <span className="text-xs text-[#718096] w-12 text-right flex-shrink-0">
            Yr {data.year}
          </span>
          <div className="flex-1 flex h-5 rounded-full overflow-hidden bg-[#E8ECF0]">
            <motion.div
              className="bg-[#304AC0] h-full"
              initial={{ width: 0 }}
              whileInView={{
                width: `${(data.principal / maxTotal) * 100}%`,
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            />
            <motion.div
              className="bg-[#87B73C] h-full"
              initial={{ width: 0 }}
              whileInView={{
                width: `${(data.interest / maxTotal) * 100}%`,
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </div>
          <span className="text-xs text-[#718096] w-24 flex-shrink-0">
            {formatCurrency(Math.round(data.principal + data.interest))}
          </span>
        </div>
      ))}
    </div>
  );
}
