"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Users, Briefcase, FileText, Download, LogOut, ChevronRight, Eye,
  RefreshCw, Search, Trash2, FileDown, ChevronLeft, ChevronUp,
  ChevronDown, Edit3, X, Save, CheckSquare, Square, AlertTriangle,
  LayoutDashboard, Package, UserCog, Menu, ExternalLink,
  Activity, Check, Plus, Mail, EyeOff, Eye as EyeIcon,
  ArrowUpRight, CircleDot, UploadCloud, FileCheck
} from "lucide-react";

/* ─── Types ─── */
interface AdminUser { id: string; email: string; name: string; role: string; exp: number }
type Tab = "Overview" | "Contacts" | "Referrals" | "Applications" | "Brochure Leads" | "Products" | "Positions" | "Admin Users";

/* ─── Constants ─── */
const CONTACT_STATUSES    = ["new","contacted","in_progress","converted","closed"] as const;
const REFERRAL_STATUSES   = ["pending","approved","active","suspended","rejected"] as const;
const APPLICATION_STATUSES= ["new","screening","interview","offered","rejected","hired"] as const;
const USER_ROLES          = ["super_admin","admin","viewer"] as const;

const STATUSES: Record<string, string[]> = {
  Contacts:     [...CONTACT_STATUSES],
  Referrals:    [...REFERRAL_STATUSES],
  Applications: [...APPLICATION_STATUSES],
};

/* Pastel pill colours — light theme */
const SC: Record<string,{bg:string;text:string;dot:string}> = {
  new:         {bg:"#EFF6FF",text:"#1D4ED8",dot:"#3B82F6"},
  contacted:   {bg:"#F0FDF4",text:"#15803D",dot:"#22C55E"},
  in_progress: {bg:"#FFFBEB",text:"#B45309",dot:"#F59E0B"},
  converted:   {bg:"#F0FDF4",text:"#166534",dot:"#16A34A"},
  closed:      {bg:"#F9FAFB",text:"#6B7280",dot:"#9CA3AF"},
  pending:     {bg:"#FEF9C3",text:"#854D0E",dot:"#EAB308"},
  approved:    {bg:"#EEF2FF",text:"#4338CA",dot:"#6366F1"},
  active:      {bg:"#F0FDF4",text:"#166534",dot:"#16A34A"},
  suspended:   {bg:"#FFF1F2",text:"#BE123C",dot:"#F43F5E"},
  rejected:    {bg:"#FFF1F2",text:"#BE123C",dot:"#F43F5E"},
  screening:   {bg:"#F5F3FF",text:"#6D28D9",dot:"#8B5CF6"},
  interview:   {bg:"#E0F2FE",text:"#0369A1",dot:"#38BDF8"},
  offered:     {bg:"#F0FDF4",text:"#166534",dot:"#16A34A"},
  hired:       {bg:"#DCFCE7",text:"#14532D",dot:"#15803D"},
  unassigned:  {bg:"#F9FAFB",text:"#6B7280",dot:"#9CA3AF"},
  super_admin: {bg:"#EEF2FF",text:"#4338CA",dot:"#6366F1"},
  admin:       {bg:"#EFF6FF",text:"#1D4ED8",dot:"#3B82F6"},
  viewer:      {bg:"#F9FAFB",text:"#6B7280",dot:"#9CA3AF"},
};

const TAB_ROUTES: Record<string,string> = {
  Contacts:         "/api/admin/contacts",
  Referrals:        "/api/admin/referrals",
  Applications:     "/api/admin/applications",
  "Brochure Leads": "/api/admin/brochures",
  Products:         "/api/admin/products",
  Positions:        "/api/admin/positions",
  "Admin Users":    "/api/admin/users",
};

const NAV: {tab:Tab;icon:React.ReactNode;label:string;group:string}[] = [
  {tab:"Overview",       icon:<LayoutDashboard size={15}/>,label:"Overview",       group:"main"},
  {tab:"Contacts",       icon:<Mail size={15}/>,           label:"Contacts",       group:"crm"},
  {tab:"Referrals",      icon:<Briefcase size={15}/>,      label:"Referrals",      group:"crm"},
  {tab:"Applications",   icon:<FileText size={15}/>,       label:"Applications",   group:"crm"},
  {tab:"Brochure Leads", icon:<Download size={15}/>,       label:"Brochure Leads", group:"crm"},
  {tab:"Products",       icon:<Package size={15}/>,        label:"Products",       group:"content"},
  {tab:"Positions",      icon:<Briefcase size={15}/>,      label:"Job Positions",  group:"content"},
  {tab:"Admin Users",    icon:<UserCog size={15}/>,        label:"Admin Users",    group:"settings"},
];

/* ─── Brand colours ─── */
const B = { navy:"#1C1D62", blue:"#304AC0", green:"#87B73C" };

/* ─── Helpers ─── */
function parseCookie(): AdminUser|null {
  // fallback client-side read (works only when httpOnly=false)
  if (typeof document==="undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)credora_admin_session=([^;]*)/);
  if (!m) return null;
  try { const d=JSON.parse(atob(decodeURIComponent(m[1]))); if(d.exp&&d.exp<Date.now()) return null; return d; }
  catch { return null; }
}
async function fetchMe(): Promise<AdminUser|null> {
  try {
    const res = await fetch("/api/admin/me", { credentials: "include" });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}
async function apiFetch(path:string,opts?:RequestInit) {
  const res=await fetch(path,{credentials:"include",...opts});
  if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e.error||`HTTP ${res.status}`);}
  return res.json();
}
function fmt(d:unknown){
  if(!d)return"—";
  try{return new Date(String(d)).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});}
  catch{return String(d).slice(0,10);}
}
function toCSV(rows:Record<string,unknown>[],name:string){
  if(!rows.length)return;
  const skip=new Set(["id","ip_address","user_agent","password_hash"]);
  const h=Object.keys(rows[0]).filter(k=>!skip.has(k));
  const csv=[h.join(","),...rows.map(r=>h.map(c=>`"${String(r[c]??"").replace(/"/g,'""')}"`).join(","))].join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  a.download=`${name}.csv`;a.click();
}

/* ─── Pill / badge ─── */
function Pill({status}:{status:string}){
  const c=SC[status]??{bg:"#F9FAFB",text:"#6B7280",dot:"#9CA3AF"};
  return(
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{background:c.bg,color:c.text}}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:c.dot}}/>
      {status.replace(/_/g," ")}
    </span>
  );
}

/* ─── Status dropdown ─── */
function StatusSelect({value,statuses,onChange}:{value:string;statuses:string[];onChange:(v:string)=>void}){
  const c=SC[value]??{bg:"#F9FAFB",text:"#6B7280",dot:"#9CA3AF"};
  return(
    <select value={value} onChange={e=>onChange(e.target.value)}
      className="text-[11px] font-semibold rounded-full px-2.5 py-0.5 border-0 cursor-pointer outline-none appearance-none"
      style={{background:c.bg,color:c.text}}>
      {statuses.map(s=><option key={s} value={s}>{s.replace(/_/g," ")}</option>)}
    </select>
  );
}

/* ─── Skeleton loader ─── */
function Skeleton(){
  return(
    <div className="p-6 space-y-3 animate-pulse">
      {[72,56,88,48].map((w,i)=>(
        <div key={i} className="h-3 rounded-md bg-gray-100" style={{width:`${w}%`}}/>
      ))}
    </div>
  );
}

/* ─── Toast ─── */
function Toast({msg}:{msg:string}){
  return(
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-xl"
      style={{background:B.navy,boxShadow:`0 8px 32px rgba(28,29,98,0.25)`}}>
      <Check size={15} className="shrink-0"/>{msg}
    </div>
  );
}

/* ─── Confirm delete modal ─── */
function ConfirmDelete({count,onCancel,onConfirm}:{count:number;onCancel:()=>void;onConfirm:()=>void}){
  return(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={e=>e.stopPropagation()}>
        <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={20} className="text-red-500"/>
        </div>
        <h3 className="text-[15px] font-bold text-gray-900 mb-1">{count>1?`Delete ${count} records`:"Delete record"}?</h3>
        <p className="text-sm text-gray-400 mb-6">This is permanent and cannot be undone.</p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Record detail modal ─── */
function RecordModal({record,tab,onClose,onStatusChange,onSaveNotes,onDelete}:{
  record:Record<string,unknown>;tab:Tab;
  onClose:()=>void;
  onStatusChange:(id:string,status:string)=>Promise<void>;
  onSaveNotes:(id:string,notes:string)=>Promise<void>;
  onDelete:(ids:string[])=>void;
}){
  const [editNotes,setEditNotes]=useState(String(record.notes??""));
  const [editingNotes,setEditingNotes]=useState(false);
  const statuses=STATUSES[tab]??[];
  const skip=new Set(["id","ip_address","user_agent","password_hash"]);
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[88vh] flex flex-col" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-[13px] font-bold text-gray-900">Record detail</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{tab}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X size={15} className="text-gray-400"/></button>
        </div>
        <div className="px-6 py-5 overflow-y-auto flex-1 space-y-4">
          {Object.entries(record).filter(([k])=>!skip.has(k)).map(([key,val])=>(
            <div key={key}>
              <dt className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{key.replace(/_/g," ")}</dt>
              {key==="status"?(
                <dd><StatusSelect value={String(val)} statuses={statuses} onChange={v=>onStatusChange(String(record.id),v)}/></dd>
              ):key==="notes"?(
                <dd>
                  {editingNotes?(
                    <div className="space-y-2">
                      <textarea value={editNotes} onChange={e=>setEditNotes(e.target.value)} rows={3}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all resize-none"/>
                      <div className="flex gap-2">
                        <button onClick={async()=>{await onSaveNotes(String(record.id),editNotes);setEditingNotes(false);}}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white transition-colors"
                          style={{background:B.blue}}><Save size={11}/>Save</button>
                        <button onClick={()=>{setEditingNotes(false);setEditNotes(String(record.notes??""));}}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                      </div>
                    </div>
                  ):(
                    <div className="flex items-start gap-2 group">
                      <p className="text-sm text-gray-700 flex-1">{val?String(val):<span className="italic text-gray-300">No notes yet</span>}</p>
                      <button onClick={()=>setEditingNotes(true)} className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all">
                        <Edit3 size={12} className="text-gray-400"/>
                      </button>
                    </div>
                  )}
                </dd>
              ):(
                <dd className="text-sm text-gray-800 break-words">{val==null?"—":String(val).length>300?String(val).slice(0,300)+"…":String(val)}</dd>
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 shrink-0">
          <button onClick={()=>onDelete([String(record.id)])}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-100 text-red-600 text-[12px] font-semibold hover:bg-red-50 transition-colors">
            <Trash2 size={13}/>Delete this record
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Product edit modal ─── */
function ProductEditModal({product,onClose,onSave}:{
  product:Record<string,unknown>;onClose:()=>void;
  onSave:(slug:string,data:Record<string,unknown>)=>Promise<void>;
}){
  const [form,setForm]=useState({
    title:String(product.title??""),short_desc:String(product.short_desc??""),
    brochure_file:String(product.brochure_file??""),brochure_url:String(product.brochure_url??""),
    is_active:product.is_active!==false,
  });
  const [saving,setSaving]=useState(false);
  async function handleSave(){setSaving(true);await onSave(String(product.slug),form);setSaving(false);onClose();}
  const Field=({label,children}:{label:string;children:React.ReactNode})=>(
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{label}</label>
      {children}
    </div>
  );
  const inputCls="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-gray-900 placeholder:text-gray-300";
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-[13px] font-bold text-gray-900">Edit product</p>
            <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{String(product.slug)}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X size={15} className="text-gray-400"/></button>
        </div>
        <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[70vh]">
          <Field label="Title"><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className={inputCls}/></Field>
          <Field label="Short description"><input value={form.short_desc} onChange={e=>setForm(f=>({...f,short_desc:e.target.value}))} className={inputCls}/></Field>
          <Field label="Brochure filename (in /public/brochures/)">
            <input value={form.brochure_file} onChange={e=>setForm(f=>({...f,brochure_file:e.target.value}))}
              placeholder="msme-loans-brochure.pdf" className={inputCls+" font-mono"}/>
          </Field>
          <Field label="Brochure external URL (overrides filename)">
            <input value={form.brochure_url} onChange={e=>setForm(f=>({...f,brochure_url:e.target.value}))}
              placeholder="https://…" className={inputCls}/>
          </Field>
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div>
              <p className="text-sm font-semibold text-gray-700">Active on website</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Show this product to visitors</p>
            </div>
            <button onClick={()=>setForm(f=>({...f,is_active:!f.is_active}))}
              className="relative w-10 h-5.5 rounded-full transition-colors shrink-0"
              style={{width:40,height:22,background:form.is_active?B.blue:"#D1D5DB"}}>
              <span className="absolute top-0.5 bg-white rounded-full shadow transition-transform"
                style={{width:18,height:18,left:2,transform:form.is_active?"translateX(18px)":"translateX(0)"}}/>
            </button>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-2.5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            style={{background:B.navy}}>
            {saving?<><RefreshCw size={13} className="animate-spin"/>Saving…</>:<><Save size={13}/>Save changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── User form modal ─── */
function UserFormModal({user,onClose,onSave}:{
  user:Record<string,unknown>|null;onClose:()=>void;
  onSave:(data:Record<string,unknown>)=>Promise<void>;
}){
  const isEdit=!!user;
  const [form,setForm]=useState({name:String(user?.name??""),email:String(user?.email??""),role:String(user?.role??"viewer"),password:""});
  const [showPw,setShowPw]=useState(false);
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");
  const inputCls="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-gray-900 placeholder:text-gray-300 bg-white";
  async function handleSave(){
    if(!form.name||!form.email){setErr("Name and email are required.");return;}
    if(!isEdit&&!form.password){setErr("Password is required for new users.");return;}
    setSaving(true);setErr("");
    try{
      const p:Record<string,unknown>={name:form.name,email:form.email,role:form.role};
      if(isEdit)p.id=user!.id; if(form.password)p.password=form.password;
      await onSave(p);onClose();
    }catch(e:unknown){setErr((e as Error).message||"Failed to save.");}
    setSaving(false);
  }
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-[13px] font-bold text-gray-900">{isEdit?"Edit user":"Add user"}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{isEdit?"Update details & permissions":"Create a new admin account"}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X size={15} className="text-gray-400"/></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full name</label>
              <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Jane Doe" className={inputCls}/>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Role</label>
              <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} className={inputCls}>
                {USER_ROLES.map(r=><option key={r} value={r}>{r.replace(/_/g," ")}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="user@credora.in" className={inputCls}/>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              {isEdit?"New password (blank = keep current)":"Password"}
            </label>
            <div className="relative">
              <input type={showPw?"text":"password"} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}
                placeholder={isEdit?"Leave blank to keep current":"Min 8 characters"} className={inputCls+" pr-10"}/>
              <button type="button" onClick={()=>setShowPw(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw?<EyeOff size={14}/>:<EyeIcon size={14}/>}
              </button>
            </div>
          </div>
          {err&&<div className="flex items-center gap-2 text-red-600 text-[12px] bg-red-50 px-3 py-2.5 rounded-lg border border-red-100"><AlertTriangle size={13}/>{err}</div>}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-2.5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            style={{background:B.navy}}>
            {saving?<><RefreshCw size={13} className="animate-spin"/>{isEdit?"Saving…":"Creating…"}</>:<><Check size={13}/>{isEdit?"Save changes":"Create user"}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Overview panel ─── */
function OverviewPanel({stats,onNavigate}:{stats:Record<string,unknown>|null;onNavigate:(t:Tab)=>void}){
  if(!stats)return<Skeleton/>;
  const recent=(stats.recent as Record<string,unknown>[]|undefined)??[];
  const typeDot:Record<string,string>={Contact:B.blue,Referral:B.green,Application:B.navy,Brochure:"#F59E0B"};
  const cards=[
    {key:"contacts",   label:"Contacts",          tab:"Contacts"        as Tab,icon:<Users size={18}/>,     color:B.blue},
    {key:"referrals",  label:"Referral partners",  tab:"Referrals"       as Tab,icon:<Briefcase size={18}/>, color:B.green},
    {key:"applications",label:"Applications",      tab:"Applications"    as Tab,icon:<FileText size={18}/>,  color:B.navy},
    {key:"brochures",  label:"Brochure downloads", tab:"Brochure Leads"  as Tab,icon:<Download size={18}/>,  color:"#F59E0B"},
  ];
  return(
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(c=>(
          <button key={c.key} onClick={()=>onNavigate(c.tab)}
            className="group bg-white rounded-xl p-5 border border-gray-100 text-left hover:border-gray-200 hover:shadow-sm transition-all relative overflow-hidden"
            style={{borderLeft:`3px solid ${c.color}`}}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{background:`${c.color}10`,color:c.color}}>
                {c.icon}
              </div>
              <ArrowUpRight size={14} className="text-gray-200 group-hover:text-gray-400 transition-colors mt-0.5"/>
            </div>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{Number(stats[c.key]??0)}</p>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">{c.label}</p>
          </button>
        ))}
      </div>

      {/* Status breakdowns */}
      <div className="grid sm:grid-cols-3 gap-4">
        {(["contacts","referrals","applications"]as const).map(key=>{
          const tabKey=key==="contacts"?"Contacts":key==="referrals"?"Referrals":"Applications";
          const stts=STATUSES[tabKey];
          const total=Number(stats[key]??0);
          const color=key==="contacts"?B.blue:key==="referrals"?B.green:B.navy;
          if(total===0)return null;
          return(
            <div key={key} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{key}</p>
                <span className="text-base font-bold" style={{color}}>{total}</span>
              </div>
              <div className="space-y-2.5">
                {stts.map(s=>{
                  const c=Number(stats[`${key}_${s}`]??0);
                  if(c===0)return null;
                  const pct=total>0?Math.round((c/total)*100):0;
                  return(
                    <div key={s}>
                      <div className="flex items-center justify-between mb-1.5">
                        <Pill status={s}/>
                        <span className="text-[11px] font-semibold text-gray-500 tabular-nums">{c}</span>
                      </div>
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{width:`${pct}%`,background:color,transition:"width .7s ease"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent activity */}
      {recent.length>0&&(
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Activity size={12}/>Recent activity
            </p>
            <span className="text-[11px] text-gray-300">{recent.length} entries</span>
          </div>
          <div className="divide-y divide-gray-50">
            {recent.map((r,i)=>(
              <div key={String(r.id??i)} className="flex items-center gap-3.5 px-5 py-3">
                <span className="w-2 h-2 rounded-full shrink-0" style={{background:typeDot[String(r.type)]??"#9CA3AF"}}/>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-800 truncate">{String(r.name??r.email??"")}</p>
                  <p className="text-[11px] text-gray-400">{String(r.type)}{r.position?` · ${r.position}`:""}{r.status?` · ${String(r.status).replace(/_/g," ")}`:""}</p>
                </div>
                <span className="text-[11px] text-gray-300 shrink-0 tabular-nums">{fmt(r.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Products panel ─── */
function ProductsPanel({user}:{user:AdminUser}){
  const [products,setProducts]=useState<Record<string,unknown>[]>([]);
  const [loading,setLoading]=useState(true);
  const [editProd,setEditProd]=useState<Record<string,unknown>|null>(null);
  const [toast,setToast]=useState("");
  const [errToast,setErrToast]=useState("");
  const canEdit=["super_admin","admin"].includes(user.role);

  const load=useCallback(async()=>{
    setLoading(true);
    try{const d=await apiFetch("/api/admin/products");setProducts(d.data??[]);}
    catch{setProducts([]);}
    setLoading(false);
  },[]);
  useEffect(()=>{load();},[load]);

  function showToast(m:string){setToast(m);setTimeout(()=>setToast(""),3000);}
  function showErr(m:string){setErrToast(m);setTimeout(()=>setErrToast(""),4000);}

  async function handleSave(slug:string,data:Record<string,unknown>){
    await apiFetch("/api/admin/products",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug,...data})});
    showToast("Product updated");load();
  }

  async function deleteBrochure(slug:string){
    if(!confirm("Remove the uploaded brochure for this product?"))return;
    try{
      await apiFetch(`/api/admin/brochures/upload?slug=${slug}`,{method:"DELETE"});
      showToast("Brochure removed");load();
    }catch(e:unknown){showErr((e as Error).message||"Failed to remove brochure");}
  }

  if(loading)return<Skeleton/>;
  return(
    <div className="space-y-4">
      {toast&&<Toast msg={toast}/>}
      {errToast&&<div className="flex items-center gap-2 text-red-600 text-[12px] bg-red-50 px-3 py-2.5 rounded-lg border border-red-100"><AlertTriangle size={13}/>{errToast}</div>}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-gray-900">Products</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Manage brochures and visibility for each product</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw size={13}/>Refresh
        </button>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map(p=>{
          const uploaded=p.brochure_uploaded===true;
          return(
          <div key={String(p.slug)} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all"
            style={{borderTop:`3px solid ${String(p.color??B.blue)}`}}>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-[13px] font-bold text-gray-900 leading-snug">{String(p.title??"")}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{String(p.slug??"")}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={{background:p.is_active!==false?"#F0FDF4":"#FFF1F2",color:p.is_active!==false?"#15803D":"#BE123C"}}>
                  {p.is_active!==false?"Active":"Hidden"}
                </span>
              </div>
              <p className="text-[12px] text-gray-500 line-clamp-2 mb-4 leading-relaxed">{String(p.short_desc??"")}</p>
              <div className="space-y-1.5 mb-4 pb-4 border-b border-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">Sub-products</span>
                  <span className="text-[12px] font-semibold text-gray-700">{String(p.sub_product_count??0)}</span>
                </div>
                {/* Brochure upload status */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">Brochure PDF</span>
                  {uploaded?(
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{color:B.green}}>
                      <FileCheck size={11}/>Uploaded
                      <span className="text-gray-400 font-normal ml-1 truncate max-w-[100px]" title={String(p.brochure_original_name??"")}>
                        {String(p.brochure_original_name??"")}
                      </span>
                    </span>
                  ):(
                    <span className="text-[11px] text-gray-400">Not uploaded</span>
                  )}
                </div>
                {p.brochure_url&&(
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">External URL</span>
                    <a href={String(p.brochure_url)} target="_blank" rel="noopener noreferrer"
                      className="text-[11px] flex items-center gap-1 hover:underline" style={{color:B.blue}}>
                      Open<ExternalLink size={10}/>
                    </a>
                  </div>
                )}
                {p.updated_at&&(
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">Last updated</span>
                    <span className="text-[11px] text-gray-500">{fmt(p.updated_at)}</span>
                  </div>
                )}
              </div>
              {canEdit&&(
                <div className="flex items-center gap-1.5">
                  <button onClick={()=>setEditProd(p)}
                    className="flex-1 py-2 rounded-lg border border-gray-200 text-[12px] font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5">
                    <Edit3 size={12}/>Edit
                  </button>
                  <BrochureUploadWidget
                    slug={String(p.slug)}
                    onUploaded={()=>{showToast("Brochure uploaded");load();}}
                    onError={showErr}
                  />
                  {uploaded&&(
                    <button onClick={()=>deleteBrochure(String(p.slug))}
                      className="p-2 rounded-lg border border-gray-200 text-gray-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all"
                      title="Remove uploaded brochure">
                      <Trash2 size={12}/>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          );
        })}
      </div>
      {editProd&&<ProductEditModal product={editProd} onClose={()=>setEditProd(null)} onSave={handleSave}/>}
    </div>
  );
}

/* ─── Admin users panel ─── */
function AdminUsersPanel({currentUser}:{currentUser:AdminUser}){
  const [users,setUsers]=useState<Record<string,unknown>[]>([]);
  const [total,setTotal]=useState(0);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState("");
  const [page,setPage]=useState(1);
  const [form,setForm]=useState<Record<string,unknown>|null|"new">(null);
  const [selected,setSelected]=useState<Set<string>>(new Set());
  const [confirmDel,setConfirmDel]=useState(false);
  const [toast,setToast]=useState("");
  const limit=20;
  const totalPages=Math.max(1,Math.ceil(total/limit));
  const isSA=currentUser.role==="super_admin";

  const load=useCallback(async()=>{
    setLoading(true);
    try{
      const p=new URLSearchParams({search,page:String(page),limit:String(limit)});
      const d=await apiFetch(`/api/admin/users?${p}`);
      setUsers(d.data??[]);setTotal(d.total??0);
    }catch{setUsers([]);}
    setLoading(false);
  },[search,page]);
  useEffect(()=>{load();},[load]);
  useEffect(()=>{setPage(1);setSelected(new Set());},[search]);

  function showToast(m:string){setToast(m);setTimeout(()=>setToast(""),3000);}
  async function handleSave(data:Record<string,unknown>){
    await apiFetch("/api/admin/users",{method:data.id?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
    showToast(data.id?"User updated":"User created");load();
  }
  async function handleDelete(ids:string[]){
    await apiFetch("/api/admin/users",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({ids})});
    setSelected(new Set());setConfirmDel(false);showToast(`${ids.length} user(s) deleted`);load();
  }
  const tog=(id:string)=>setSelected(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});
  const togAll=()=>setSelected(selected.size===users.length?new Set():new Set(users.map(u=>String(u.id))));

  return(
    <div className="space-y-4">
      {toast&&<Toast msg={toast}/>}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-[15px] font-bold text-gray-900">Admin users</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Manage dashboard access and permissions</p>
        </div>
        {isSA&&(
          <button onClick={()=>setForm("new")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all hover:opacity-90"
            style={{background:B.navy}}>
            <Plus size={14}/>Add user
          </button>
        )}
      </div>
      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-100 p-3 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users…"
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"/>
        </div>
        <button onClick={load} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw size={12} className={loading?"animate-spin":""}/>Refresh
        </button>
        {selected.size>0&&isSA&&(
          <>
            <span className="text-[12px] text-gray-400 font-medium">{selected.size} selected</span>
            <button onClick={()=>setConfirmDel(true)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-red-600 text-[12px] font-semibold hover:bg-red-100 transition-colors">
              <Trash2 size={12}/>Delete
            </button>
          </>
        )}
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {isSA&&<th className="px-4 py-3 w-10"><button onClick={togAll}>{selected.size===users.length&&users.length>0?<CheckSquare size={14} style={{color:B.blue}}/>:<Square size={14} className="text-gray-300"/>}</button></th>}
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last login</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Created</th>
                {isSA&&<th className="px-4 py-3 w-20"/>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading?<tr><td colSpan={6}><Skeleton/></td></tr>
              :users.length===0?<tr><td colSpan={6} className="text-center py-14 text-gray-300 text-sm">No users found</td></tr>
              :users.map(u=>(
                <tr key={String(u.id)} className={`transition-colors ${selected.has(String(u.id))?"bg-blue-50/30":"hover:bg-gray-50/50"}`}>
                  {isSA&&<td className="px-4 py-3.5"><button onClick={()=>tog(String(u.id))}>{selected.has(String(u.id))?<CheckSquare size={14} style={{color:B.blue}}/>:<Square size={14} className="text-gray-300"/>}</button></td>}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                        style={{background:B.navy}}>{String(u.name??"?")[0].toUpperCase()}</div>
                      <div>
                        <p className="text-[13px] font-semibold text-gray-800">{String(u.name??"")}</p>
                        <p className="text-[11px] text-gray-400">{String(u.email??"")}</p>
                      </div>
                      {String(u.id)===currentUser.id&&<span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">You</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><Pill status={String(u.role??"viewer")}/></td>
                  <td className="px-4 py-3.5 text-[12px] text-gray-400">{u.last_login?fmt(u.last_login):"Never"}</td>
                  <td className="px-4 py-3.5 text-[12px] text-gray-400">{fmt(u.created_at)}</td>
                  {isSA&&<td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={()=>setForm(u)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><Edit3 size={13} className="text-gray-400"/></button>
                      {String(u.id)!==currentUser.id&&<button onClick={()=>{setSelected(new Set([String(u.id)]));setConfirmDel(true);}} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={13} className="text-gray-300 hover:text-red-500"/></button>}
                    </div>
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages>1&&(
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-50 text-[11px]">
            <span className="text-gray-400">{page}/{totalPages} · {total} total</span>
            <div className="flex items-center gap-1">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-md border border-gray-200 disabled:opacity-30 hover:bg-gray-50"><ChevronLeft size={12}/></button>
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded-md border border-gray-200 disabled:opacity-30 hover:bg-gray-50"><ChevronRight size={12}/></button>
            </div>
          </div>
        )}
      </div>
      {form!==null&&<UserFormModal user={form==="new"?null:form as Record<string,unknown>} onClose={()=>setForm(null)} onSave={handleSave}/>}
      {confirmDel&&<ConfirmDelete count={selected.size} onCancel={()=>setConfirmDel(false)} onConfirm={()=>handleDelete([...selected])}/>}
    </div>
  );
}

/* ─── Job Positions panel ─── */
function PositionsPanel({user}:{user:AdminUser}){
  const [positions,setPositions]=useState<Record<string,unknown>[]>([]);
  const [loading,setLoading]=useState(true);
  const [form,setForm]=useState<Record<string,unknown>|null|"new">(null);
  const [confirmDel,setConfirmDel]=useState<Set<string>|null>(null);
  const [toast,setToast]=useState("");
  const canEdit=["super_admin","admin"].includes(user.role);

  const load=useCallback(async()=>{
    setLoading(true);
    try{const d=await apiFetch("/api/admin/positions?limit=100");setPositions(d.data??[]);}
    catch{setPositions([]);}
    setLoading(false);
  },[]);
  useEffect(()=>{load();},[load]);

  function showToast(m:string){setToast(m);setTimeout(()=>setToast(""),3000);}
  async function handleSave(data:Record<string,unknown>){
    await apiFetch("/api/admin/positions",{method:data.id?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
    showToast(data.id?"Position updated":"Position created");load();
  }
  async function handleDelete(ids:string[]){
    await apiFetch("/api/admin/positions",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({ids})});
    setConfirmDel(null);showToast(`${ids.length} position(s) deleted`);load();
  }
  async function toggleActive(p:Record<string,unknown>){
    await apiFetch("/api/admin/positions",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:p.id,is_active:!(p.is_active!==false)})});
    load();
  }

  if(loading)return<Skeleton/>;
  return(
    <div className="space-y-4">
      {toast&&<Toast msg={toast}/>}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-[15px] font-bold text-gray-900">Job Positions</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Manage open positions shown on the careers page</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <RefreshCw size={12}/>Refresh
          </button>
          {canEdit&&(
            <button onClick={()=>setForm("new")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all hover:opacity-90"
              style={{background:B.navy}}>
              <Plus size={14}/>Add position
            </button>
          )}
        </div>
      </div>

      {positions.length===0?(
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <Briefcase size={32} className="mx-auto text-gray-200 mb-3"/>
          <p className="text-sm font-semibold text-gray-700">No positions yet</p>
          <p className="text-[12px] text-gray-400 mt-1">Create your first job position to display it on the careers page.</p>
        </div>
      ):(
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {positions.map(p=>{
            const skills=Array.isArray(p.skills)?p.skills:[];
            const active=p.is_active!==false;
            return(
              <div key={String(p.id)} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all"
                style={{borderTop:`3px solid ${String(p.color??B.blue)}`}}>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-[13px] font-bold text-gray-900 leading-snug">{String(p.title??"")}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{String(p.department??"")} · {String(p.location??"")}</p>
                    </div>
                    <button onClick={()=>toggleActive(p)} className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 transition-colors"
                      style={{background:active?"#F0FDF4":"#FFF1F2",color:active?"#15803D":"#BE123C"}}>
                      {active?"Active":"Hidden"}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 font-medium">{String(p.type??"Full-time")}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 font-medium">{String(p.experience??"")}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 font-medium">{String(p.salary??"")}</span>
                  </div>
                  <p className="text-[12px] text-gray-500 line-clamp-2 mb-3 leading-relaxed">{String(p.description??"")}</p>
                  {skills.length>0&&(
                    <div className="flex flex-wrap gap-1 mb-4 pb-4 border-b border-gray-50">
                      {skills.slice(0,4).map((s:string,i:number)=>(
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">{s}</span>
                      ))}
                      {skills.length>4&&<span className="text-[10px] px-1.5 py-0.5 text-gray-400">+{skills.length-4}</span>}
                    </div>
                  )}
                  {canEdit&&(
                    <div className="flex items-center gap-1.5">
                      <button onClick={()=>setForm(p)}
                        className="flex-1 py-2 rounded-lg border border-gray-200 text-[12px] font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5">
                        <Edit3 size={12}/>Edit
                      </button>
                      <button onClick={()=>setConfirmDel(new Set([String(p.id)]))}
                        className="p-2 rounded-lg border border-gray-200 text-gray-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all">
                        <Trash2 size={12}/>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {form!==null&&<PositionFormModal position={form==="new"?null:form as Record<string,unknown>} onClose={()=>setForm(null)} onSave={handleSave}/>}
      {confirmDel&&<ConfirmDelete count={confirmDel.size} onCancel={()=>setConfirmDel(null)} onConfirm={()=>handleDelete([...confirmDel])}/>}
    </div>
  );
}

/* ─── Position form modal ─── */
function PositionFormModal({position,onClose,onSave}:{
  position:Record<string,unknown>|null;onClose:()=>void;
  onSave:(data:Record<string,unknown>)=>Promise<void>;
}){
  const isEdit=!!position;
  const [form,setForm]=useState({
    title:String(position?.title??""),
    department:String(position?.department??""),
    location:String(position?.location??"Chennai"),
    type:String(position?.type??"Full-time"),
    experience:String(position?.experience??""),
    salary:String(position?.salary??""),
    color:String(position?.color??B.blue),
    description:String(position?.description??""),
    skillsText:Array.isArray(position?.skills)?(position!.skills as string[]).join(", "):"",
    is_active:position?.is_active!==false,
  });
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");
  const inputCls="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all text-gray-900 placeholder:text-gray-300 bg-white";
  async function handleSave(){
    if(!form.title||!form.department||!form.location){setErr("Title, department, and location are required.");return;}
    setSaving(true);setErr("");
    try{
      const p:Record<string,unknown>={
        title:form.title,department:form.department,location:form.location,
        type:form.type,experience:form.experience,salary:form.salary,color:form.color,
        description:form.description,
        skills:form.skillsText.split(",").map(s=>s.trim()).filter(Boolean),
        is_active:form.is_active,
      };
      if(isEdit)p.id=position!.id;
      await onSave(p);onClose();
    }catch(e:unknown){setErr((e as Error).message||"Failed to save.");}
    setSaving(false);
  }
  const Field=({label,children}:{label:string;children:React.ReactNode})=>(
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{label}</label>
      {children}
    </div>
  );
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-[13px] font-bold text-gray-900">{isEdit?"Edit position":"Add position"}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{isEdit?"Update job posting details":"Create a new job opening"}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X size={15} className="text-gray-400"/></button>
        </div>
        <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[70vh]">
          <Field label="Job title"><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Credit Analyst" className={inputCls}/></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Department"><input value={form.department} onChange={e=>setForm(f=>({...f,department:e.target.value}))} placeholder="Credit & Risk" className={inputCls}/></Field>
            <Field label="Location"><input value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} placeholder="Chennai" className={inputCls}/></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Type">
              <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} className={inputCls}>
                <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
              </select>
            </Field>
            <Field label="Experience"><input value={form.experience} onChange={e=>setForm(f=>({...f,experience:e.target.value}))} placeholder="1–3 years" className={inputCls}/></Field>
            <Field label="Salary"><input value={form.salary} onChange={e=>setForm(f=>({...f,salary:e.target.value}))} placeholder="₹4L – ₹7L PA" className={inputCls}/></Field>
          </div>
          <Field label="Description">
            <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={4} placeholder="Describe the role and responsibilities…" className={inputCls+" resize-none"}/>
          </Field>
          <Field label="Skills (comma-separated)">
            <input value={form.skillsText} onChange={e=>setForm(f=>({...f,skillsText:e.target.value}))} placeholder="Excel, Financial Analysis, …" className={inputCls}/>
          </Field>
          <div className="grid grid-cols-2 gap-3 items-end">
            <Field label="Accent colour">
              <div className="flex items-center gap-2">
                <input type="color" value={form.color} onChange={e=>setForm(f=>({...f,color:e.target.value}))} className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"/>
                <input value={form.color} onChange={e=>setForm(f=>({...f,color:e.target.value}))} className={inputCls+" font-mono"}/>
              </div>
            </Field>
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
              <div>
                <p className="text-[12px] font-semibold text-gray-700">Active</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Show on careers page</p>
              </div>
              <button onClick={()=>setForm(f=>({...f,is_active:!f.is_active}))}
                className="relative rounded-full transition-colors shrink-0"
                style={{width:40,height:22,background:form.is_active?B.blue:"#D1D5DB"}}>
                <span className="absolute top-0.5 bg-white rounded-full shadow transition-transform"
                  style={{width:18,height:18,left:2,transform:form.is_active?"translateX(18px)":"translateX(0)"}}/>
              </button>
            </div>
          </div>
          {err&&<div className="flex items-center gap-2 text-red-600 text-[12px] bg-red-50 px-3 py-2.5 rounded-lg border border-red-100"><AlertTriangle size={13}/>{err}</div>}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-2.5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            style={{background:B.navy}}>
            {saving?<><RefreshCw size={13} className="animate-spin"/>Saving…</>:<><Save size={13}/>{isEdit?"Save changes":"Create position"}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Brochure upload widget ─── */
function BrochureUploadWidget({slug,onUploaded,onError,disabled}:{slug:string;onUploaded:()=>void;onError:(msg:string)=>void;disabled?:boolean}){
  const [uploading,setUploading]=useState(false);
  const inputRef=useRef<HTMLInputElement>(null);

  async function handleFile(file:File){
    if(file.type!=="application/pdf"){onError("Please select a PDF file.");return;}
    if(file.size>25*1024*1024){onError("File too large. Max 25 MB.");return;}
    setUploading(true);
    try{
      const fd=new FormData();
      fd.append("slug",slug);
      fd.append("file",file);
      const res=await fetch("/api/admin/brochures/upload",{method:"POST",body:fd,credentials:"include"});
      const d=await res.json();
      if(!res.ok)throw new Error(d.error||"Upload failed");
      onUploaded();
    }catch(e:unknown){
      onError((e as Error).message||"Upload failed");
    }
    setUploading(false);
  }

  return(
    <>
      <input ref={inputRef} type="file" accept="application/pdf" className="hidden"
        onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f);e.target.value="";}}/>
      <button type="button" disabled={uploading||disabled} onClick={()=>inputRef.current?.click()}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
        {uploading?<><RefreshCw size={12} className="animate-spin"/>Uploading…</>:<><UploadCloud size={12}/>Upload PDF</>}
      </button>
    </>
  );
}

/* ─── Data table panel ─── */
function DataTablePanel({tab,user}:{tab:Tab;user:AdminUser}){
  const [rows,setRows]=useState<Record<string,unknown>[]>([]);
  const [total,setTotal]=useState(0);
  const [loading,setLoading]=useState(false);
  const [search,setSearch]=useState("");
  const [statusFilter,setStatusFilter]=useState("all");
  const [sortCol,setSortCol]=useState("created_at");
  const [sortDir,setSortDir]=useState<"asc"|"desc">("desc");
  const [page,setPage]=useState(1);
  const [modal,setModal]=useState<Record<string,unknown>|null>(null);
  const [selected,setSelected]=useState<Set<string>>(new Set());
  const [confirmDel,setConfirmDel]=useState<string[]|null>(null);
  const [toast,setToast]=useState("");
  const limit=15;
  const totalPages=Math.max(1,Math.ceil(total/limit));
  const statuses=STATUSES[tab]??[];
  const canWrite=["super_admin","admin"].includes(user.role);

  useEffect(()=>{setSearch("");setStatusFilter("all");setPage(1);setSelected(new Set());setSortCol("created_at");setSortDir("desc");},[tab]);

  const load=useCallback(async()=>{
    setLoading(true);
    try{
      const p=new URLSearchParams({status:statusFilter,search,sort:sortCol,order:sortDir,page:String(page),limit:String(limit)});
      const d=await apiFetch(`${TAB_ROUTES[tab]}?${p}`);
      setRows(Array.isArray(d)?d:d.data??[]);
      setTotal(typeof d.total==="number"?d.total:0);
    }catch{setRows([]);}
    setLoading(false);
  },[tab,statusFilter,search,sortCol,sortDir,page]);
  useEffect(()=>{load();},[load]);

  function showToast(m:string){setToast(m);setTimeout(()=>setToast(""),3000);}
  const statusChange=useCallback(async(id:string,status:string)=>{
    try{await apiFetch(TAB_ROUTES[tab],{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,status})});load();}
    catch(e){console.error(e);}
  },[tab,load]);
  const saveNotes=useCallback(async(id:string,notes:string)=>{
    await apiFetch(TAB_ROUTES[tab],{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,notes})});load();
  },[tab,load]);
  const doDelete=useCallback(async(ids:string[])=>{
    await apiFetch(TAB_ROUTES[tab],{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({ids})});
    setConfirmDel(null);setModal(null);setSelected(new Set());
    showToast(`${ids.length} record(s) deleted`);
    if(rows.length-ids.length===0&&page>1)setPage(page-1);else load();
  },[tab,load,rows.length,page]);
  const bulkStatus=useCallback(async(status:string)=>{
    await Promise.all([...selected].map(id=>apiFetch(TAB_ROUTES[tab],{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,status})})));
    setSelected(new Set());load();
  },[selected,tab,load]);
  const handleSort=(col:string)=>{if(sortCol===col)setSortDir(d=>d==="asc"?"desc":"asc");else{setSortCol(col);setSortDir("asc");}setPage(1);};
  const tog=(id:string)=>setSelected(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});
  const togAll=()=>setSelected(selected.size===rows.length?new Set():new Set(rows.map(r=>String(r.id))));

  type Col={key:string;label:string;sortable?:boolean;render?:(r:Record<string,unknown>)=>React.ReactNode};
  const cols:Col[]=tab==="Contacts"?[
    {key:"name",label:"Name",sortable:true,render:r=><span className="font-semibold text-gray-800 text-[13px]">{String(r.name??"")}</span>},
    {key:"email",label:"Email",sortable:true,render:r=><span className="text-[12px] text-gray-500">{String(r.email??"")}</span>},
    {key:"phone",label:"Phone",render:r=><span className="text-[12px] text-gray-500">{String(r.phone??"—")}</span>},
    {key:"business_name",label:"Business",sortable:true,render:r=><span className="text-[12px] text-gray-600">{String(r.business_name??"—")}</span>},
    {key:"city",label:"City",sortable:true,render:r=><span className="text-[12px] text-gray-500">{String(r.city??"—")}</span>},
    {key:"status",label:"Status",render:r=><StatusSelect value={String(r.status??"new")} statuses={[...CONTACT_STATUSES]} onChange={v=>statusChange(String(r.id),v)}/>},
    {key:"created_at",label:"Date",sortable:true,render:r=><span className="text-[11px] text-gray-400">{fmt(r.created_at)}</span>},
  ]:tab==="Referrals"?[
    {key:"name",label:"Name",sortable:true,render:r=><span className="font-semibold text-gray-800 text-[13px]">{String(r.name??"")}</span>},
    {key:"email",label:"Email",sortable:true,render:r=><span className="text-[12px] text-gray-500">{String(r.email??"")}</span>},
    {key:"phone",label:"Phone",render:r=><span className="text-[12px] text-gray-500">{String(r.phone??"—")}</span>},
    {key:"company_name",label:"Company",sortable:true,render:r=><span className="text-[12px] text-gray-600">{String(r.company_name??"—")}</span>},
    {key:"city",label:"City",sortable:true,render:r=><span className="text-[12px] text-gray-500">{String(r.city??"—")}</span>},
    {key:"status",label:"Status",render:r=><StatusSelect value={String(r.status??"pending")} statuses={[...REFERRAL_STATUSES]} onChange={v=>statusChange(String(r.id),v)}/>},
    {key:"created_at",label:"Date",sortable:true,render:r=><span className="text-[11px] text-gray-400">{fmt(r.created_at)}</span>},
  ]:tab==="Applications"?[
    {key:"full_name",label:"Name",sortable:true,render:r=><span className="font-semibold text-gray-800 text-[13px]">{String(r.full_name??"")}</span>},
    {key:"email",label:"Email",sortable:true,render:r=><span className="text-[12px] text-gray-500">{String(r.email??"")}</span>},
    {key:"position",label:"Position",sortable:true,render:r=><span className="text-[12px] text-gray-600">{String(r.position??"—")}</span>},
    {key:"experience",label:"Exp.",render:r=><span className="text-[12px] text-gray-500">{String(r.experience??"—")}</span>},
    {key:"status",label:"Status",render:r=><StatusSelect value={String(r.status??"new")} statuses={[...APPLICATION_STATUSES]} onChange={v=>statusChange(String(r.id),v)}/>},
    {key:"created_at",label:"Date",sortable:true,render:r=><span className="text-[11px] text-gray-400">{fmt(r.created_at)}</span>},
  ]:[
    {key:"email",label:"Email",sortable:true,render:r=><span className="font-semibold text-gray-800 text-[13px]">{String(r.email??"")}</span>},
    {key:"product",label:"Product",sortable:true,render:r=><span className="text-[12px] text-gray-600">{String(r.product??"—")}</span>},
    {key:"brochure_file",label:"File",render:r=><span className="text-[11px] font-mono text-gray-500">{String(r.brochure_file??"—")}</span>},
    {key:"created_at",label:"Downloaded",sortable:true,render:r=><span className="text-[11px] text-gray-400">{fmt(r.created_at)}</span>},
  ];

  return(
    <div className="space-y-4">
      {toast&&<Toast msg={toast}/>}
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-[15px] font-bold text-gray-900">{tab}</h2>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">{total} records</span>
      </div>
      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-100 p-3 space-y-2">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"/>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search…"
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"/>
          </div>
          {statuses.length>0&&(
            <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setPage(1);}}
              className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none min-w-[130px] bg-white focus:ring-2 focus:ring-blue-100">
              <option value="all">All statuses</option>
              {statuses.map(s=><option key={s} value={s}>{s.replace(/_/g," ")}</option>)}
            </select>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={load} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <RefreshCw size={12} className={loading?"animate-spin":""}/>Refresh
          </button>
          <button onClick={()=>toCSV(rows,`${tab.toLowerCase().replace(/\s/g,"_")}_${new Date().toISOString().slice(0,10)}`)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <FileDown size={12}/>Export CSV
          </button>
          {selected.size>0&&canWrite&&(
            <>
              <div className="w-px h-4 bg-gray-200"/>
              <span className="text-[12px] text-gray-400 font-medium">{selected.size} selected</span>
              {statuses.length>0&&(
                <select defaultValue="" onChange={e=>{if(e.target.value)bulkStatus(e.target.value);e.target.value="";}}
                  className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-[12px] bg-white">
                  <option value="" disabled>Bulk status…</option>
                  {statuses.map(s=><option key={s} value={s}>{s.replace(/_/g," ")}</option>)}
                </select>
              )}
              <button onClick={()=>setConfirmDel([...selected])} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 border border-red-100 text-red-600 text-[12px] font-semibold hover:bg-red-100 transition-colors">
                <Trash2 size={12}/>Delete
              </button>
            </>
          )}
        </div>
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-4 py-3 w-10">
                  <button onClick={togAll}>{selected.size===rows.length&&rows.length>0?<CheckSquare size={14} style={{color:B.blue}}/>:<Square size={14} className="text-gray-300"/>}</button>
                </th>
                {cols.map(c=>(
                  <th key={c.key} className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    {c.sortable?(
                      <button onClick={()=>handleSort(c.key)} className="inline-flex items-center gap-1 hover:text-gray-600 transition-colors">
                        {c.label}{sortCol===c.key?sortDir==="asc"?<ChevronUp size={11}/>:<ChevronDown size={11}/>:<span className="w-2.5"/>}
                      </button>
                    ):c.label}
                  </th>
                ))}
                <th className="px-4 py-3 w-16"/>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading?<tr><td colSpan={cols.length+2}><Skeleton/></td></tr>
              :rows.length===0?<tr><td colSpan={cols.length+2} className="text-center py-14 text-gray-300">
                <Search size={26} className="mx-auto mb-2"/><p className="text-sm">No records found</p>
              </td></tr>
              :rows.map((r,i)=>(
                <tr key={String(r.id??i)} className={`transition-colors ${selected.has(String(r.id))?"bg-blue-50/30":"hover:bg-gray-50/50"}`}>
                  <td className="px-4 py-3.5">
                    <button onClick={()=>tog(String(r.id))}>{selected.has(String(r.id))?<CheckSquare size={14} style={{color:B.blue}}/>:<Square size={14} className="text-gray-300"/>}</button>
                  </td>
                  {cols.map(c=>(
                    <td key={c.key} className="px-4 py-3.5 whitespace-nowrap">{c.render?c.render(r):<span className="text-[12px] text-gray-600">{String(r[c.key]??"—")}</span>}</td>
                  ))}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-0.5">
                      <button onClick={()=>setModal(r)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><Eye size={13} className="text-gray-400"/></button>
                      {canWrite&&<button onClick={()=>setConfirmDel([String(r.id)])} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 size={13} className="text-gray-300 hover:text-red-500"/></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages>1&&(
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-50 text-[11px]">
            <span className="text-gray-400">{page}/{totalPages} · {total} total</span>
            <div className="flex items-center gap-1">
              <button onClick={()=>setPage(1)} disabled={page===1} className="px-2 py-1 rounded-md border border-gray-200 text-[10px] disabled:opacity-30 hover:bg-gray-50 transition-colors">First</button>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="p-1.5 rounded-md border border-gray-200 disabled:opacity-30 hover:bg-gray-50"><ChevronLeft size={12}/></button>
              {Array.from({length:Math.min(5,totalPages)},(_,i)=>{
                let pn=page<=3?i+1:page>=totalPages-2?totalPages-4+i:page-2+i;
                if(totalPages<=5)pn=i+1;
                return<button key={pn} onClick={()=>setPage(pn)} className="w-7 h-7 rounded-md text-[11px] font-semibold transition-colors"
                  style={page===pn?{background:B.navy,color:"#fff"}:{color:"#6B7280"}}>{pn}</button>;
              })}
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-1.5 rounded-md border border-gray-200 disabled:opacity-30 hover:bg-gray-50"><ChevronRight size={12}/></button>
              <button onClick={()=>setPage(totalPages)} disabled={page===totalPages} className="px-2 py-1 rounded-md border border-gray-200 text-[10px] disabled:opacity-30 hover:bg-gray-50 transition-colors">Last</button>
            </div>
          </div>
        )}
      </div>
      {modal&&<RecordModal record={modal} tab={tab} onClose={()=>setModal(null)} onStatusChange={statusChange} onSaveNotes={saveNotes} onDelete={ids=>{setConfirmDel(ids);setModal(null);}}/>}
      {confirmDel&&<ConfirmDelete count={confirmDel.length} onCancel={()=>setConfirmDel(null)} onConfirm={()=>doDelete(confirmDel)}/>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT DASHBOARD SHELL
═══════════════════════════════════════════════════════ */
export default function AdminDashboard(){
  const router=useRouter();
  const [user,setUser]=useState<AdminUser|null>(null);
  const [tab,setTab]=useState<Tab>("Overview");
  const [stats,setStats]=useState<Record<string,unknown>|null>(null);
  const [mobileNav,setMobileNav]=useState(false);
  const [mounted,setMounted]=useState(false);
  const drawerRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    setMounted(true);
    fetchMe().then(u => {
      if(!u){ router.replace("/admin/login"); return; }
      setUser(u);
    });
  },[router]);

  useEffect(()=>{
    if(!user)return;
    apiFetch("/api/admin/stats").then(d=>setStats(d.error?null:d)).catch(()=>setStats(null));
  },[user]);

  /* Close mobile drawer on outside click */
  useEffect(()=>{
    function h(e:MouseEvent){if(mobileNav&&drawerRef.current&&!drawerRef.current.contains(e.target as Node))setMobileNav(false);}
    document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);
  },[mobileNav]);

  const logout=useCallback(async()=>{
    await fetch("/api/admin/login",{method:"DELETE",credentials:"include"});
    router.push("/admin/login");
    router.refresh();
  },[router]);

  if(!mounted||!user){
    return(
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin" style={{borderColor:B.blue,borderTopColor:"transparent"}}/>
          <p className="text-[13px] text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  const statCounts:Record<string,number>={
    Contacts:Number(stats?.contacts??0),Referrals:Number(stats?.referrals??0),
    Applications:Number(stats?.applications??0),"Brochure Leads":Number(stats?.brochures??0),
  };

  /* Sidebar nav content — shared between desktop and mobile drawer */
  function SidebarNav({onSelect}:{onSelect?:()=>void}){
    const groups=[
      {id:"main",label:null},
      {id:"crm",label:"CRM"},
      {id:"content",label:"Content"},
      {id:"settings",label:"Settings"},
    ];
    return(
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {groups.map(g=>{
          const items=NAV.filter(n=>n.group===g.id);
          if(!items.length)return null;
          return(
            <div key={g.id} className={g.label?"pt-4 first:pt-0":""}>
              {g.label&&<p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.18em] px-3 mb-1.5">{g.label}</p>}
              {items.map(item=>{
                const active=tab===item.tab;
                const cnt=statCounts[item.tab]??0;
                return(
                  <button key={item.tab}
                    onClick={()=>{setTab(item.tab);onSelect?.();}}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                      active?"text-white":"text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                    style={active?{background:B.navy}:undefined}>
                    <span className={active?"text-white/70":"text-gray-400"}>{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {cnt>0&&(
                      <span className={`text-[10px] font-bold min-w-[18px] text-center px-1.5 py-0.5 rounded-md ${
                        active?"bg-white/20 text-white":"bg-gray-100 text-gray-400"
                      }`}>{cnt}</span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>
    );
  }

  return(
    <div className="min-h-screen flex" style={{background:"#F9FAFB",fontFamily:"'Inter','DM Sans',system-ui,sans-serif"}}>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-white border-r border-gray-100 h-screen sticky top-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100">
          <Image src="/images/credora-logo.png" alt="" width={28} height={28} className="object-contain shrink-0"/>
          <div>
            <p className="text-[13px] font-bold text-gray-900" style={{letterSpacing:"-0.02em"}}>Credora</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em]">Admin</p>
          </div>
        </div>
        <SidebarNav/>
        {/* User footer */}
        <div className="p-3 border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
              style={{background:B.navy}}>{(user.name??"A")[0].toUpperCase()}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-gray-700 truncate">{user.name}</p>
              <p className="text-[10px] text-gray-400 capitalize">{user.role.replace(/_/g," ")}</p>
            </div>
            <button onClick={logout} className="p-1.5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors" title="Sign out">
              <LogOut size={14}/>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile drawer ── */}
      {mobileNav&&(
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" onClick={()=>setMobileNav(false)}/>
          <aside ref={drawerRef} className="absolute left-0 top-0 bottom-0 w-60 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <Image src="/images/credora-logo.png" alt="" width={26} height={26} className="object-contain"/>
                <p className="text-[13px] font-bold text-gray-900">Credora Admin</p>
              </div>
              <button onClick={()=>setMobileNav(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X size={15} className="text-gray-400"/></button>
            </div>
            <SidebarNav onSelect={()=>setMobileNav(false)}/>
            <div className="p-3 border-t border-gray-100">
              <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors">
                <LogOut size={14}/>Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Topbar ── */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={()=>setMobileNav(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Menu size={17} className="text-gray-600"/>
            </button>
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2">
              <Image src="/images/credora-logo.png" alt="" width={22} height={22} className="object-contain"/>
              <span className="text-[13px] font-bold text-gray-900">Credora</span>
            </div>
            {/* Desktop breadcrumb */}
            <div className="hidden lg:block">
              <p className="text-[13px] font-semibold text-gray-900">{tab}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-500 hover:bg-gray-50 transition-colors">
              <ExternalLink size={12}/>View site
            </a>
            <div className="hidden sm:block h-5 w-px bg-gray-200"/>
            <div className="hidden sm:block text-right">
              <p className="text-[12px] font-semibold text-gray-700">{user.name}</p>
              <p className="text-[10px] text-gray-400 capitalize">{user.role.replace(/_/g," ")}</p>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
              style={{background:B.navy}}>{(user.name??"A")[0].toUpperCase()}</div>
            <button onClick={logout} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Sign out">
              <LogOut size={15}/>
            </button>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto">
            {tab==="Overview"                    &&<OverviewPanel stats={stats} onNavigate={t=>setTab(t)}/>}
            {tab==="Products"                    &&<ProductsPanel user={user}/>}
            {tab==="Positions"                   &&<PositionsPanel user={user}/>}
            {tab==="Admin Users"                 &&<AdminUsersPanel currentUser={user}/>}
            {(tab==="Contacts"||tab==="Referrals"||tab==="Applications"||tab==="Brochure Leads")&&<DataTablePanel tab={tab} user={user}/>}
          </div>
        </main>

        {/* ── Mobile bottom nav ── */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 flex">
          {[
            {tab:"Overview" as Tab,icon:<LayoutDashboard size={18}/>,label:"Overview"},
            {tab:"Contacts" as Tab,icon:<Users size={18}/>,label:"Contacts"},
            {tab:"Applications" as Tab,icon:<FileText size={18}/>,label:"Apply"},
            {tab:"Products" as Tab,icon:<Package size={18}/>,label:"Products"},
            {tab:"Admin Users" as Tab,icon:<UserCog size={18}/>,label:"Users"},
          ].map(item=>(
            <button key={item.tab} onClick={()=>setTab(item.tab)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
                tab===item.tab?"":"text-gray-400"
              }`}
              style={tab===item.tab?{color:B.navy}:undefined}>
              {item.icon}<span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
