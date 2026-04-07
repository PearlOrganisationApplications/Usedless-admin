import React, { useState } from 'react';
import {
  CreditCard, Tag, Zap, RefreshCcw, Plus, BarChart3, Globe2,
  CheckCircle, Clock, XCircle, AlertCircle, ArrowDownRight, 
  Trash2, Edit3, Gift, Percent, Save, Search, Filter, Megaphone
} from 'lucide-react';
import { cn } from '@/utils';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';

type Tab = 'PLANS' | 'COUPONS' | 'CAMPAIGNS' | 'PAYMENT_LOGS' | 'REFUNDS';

/* ─── Plan Builder ─── */
const PlansTab = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [newPlan, setNewPlan] = useState({ 
    name: '', price: '', billing: 'MONTHLY', region: 'ALL',
    dynamicPricing: false, pricingRule: 'TIME_BASED', modifier: '0' 
  });

  const plans = [
    { id: 'P1', name: 'Free Trial', price: '₹0', billing: 'N/A', region: 'ALL', subscribers: 12840, status: 'ACTIVE' },
    { id: 'P2', name: 'Standard', price: '₹299', billing: 'Monthly', region: 'IN', subscribers: 8420, status: 'ACTIVE' },
    { id: 'P3', name: 'Premium', price: '₹699', billing: 'Monthly', region: 'IN', subscribers: 4102, status: 'ACTIVE' },
    { id: 'P4', name: 'Premium Plus', price: '₹1,499', billing: 'Monthly', region: 'IN', subscribers: 1238, status: 'ACTIVE' },
    { id: 'P5', name: 'Annual Pro', price: '₹5,999', billing: 'Yearly', region: 'ALL', subscribers: 642, status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex gap-6 flex-wrap">
        {[
          { label: 'Total Subscribed', value: '27.2K', color: 'text-primary', icon: CreditCard },
          { label: 'MRR', value: '₹42.5L', color: 'text-emerald-600', icon: BarChart3 },
          { label: 'Active Plans', value: '5', color: 'text-slate-900', icon: Zap },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-6 flex-1 min-w-[180px] flex items-center gap-5 shadow-sm">
            <div className="p-4 bg-slate-50 rounded-2xl text-primary"><stat.icon size={24} /></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
              <h4 className={cn("text-2xl font-black tracking-tighter mt-1", stat.color)}>{stat.value}</h4>
            </div>
          </div>
        ))}
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-6 py-4 bg-primary text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center gap-2 h-fit self-center"
        >
          <Plus size={18} /> New Plan
        </button>
      </div>

      {showCreate && (
        <div className="bg-white border border-primary/20 rounded-[2.5rem] p-8 shadow-xl shadow-primary/5 animate-in fade-in slide-in-from-top-4 duration-300 space-y-6">
          <div className="flex justify-between items-center">
             <h3 className="font-black text-slate-900 flex items-center gap-2"><Zap size={18} className="text-primary" /> Create New Plan</h3>
             <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dynamic Pricing</span>
                <button 
                  onClick={() => setNewPlan({ ...newPlan, dynamicPricing: !newPlan.dynamicPricing })}
                  className={cn(
                    "w-10 h-5 rounded-full transition-colors relative",
                    newPlan.dynamicPricing ? "bg-primary" : "bg-slate-300"
                  )}
                >
                  <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", newPlan.dynamicPricing ? "left-6" : "left-1")} />
                </button>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Plan Name', key: 'name', type: 'text', placeholder: 'e.g. Premium Plus' },
              { label: 'Price (₹)', key: 'price', type: 'number', placeholder: '999' },
            ].map((field) => (
              <div key={field.key} className="col-span-1 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={(newPlan as any)[field.key]}
                  onChange={(e) => setNewPlan({ ...newPlan, [field.key]: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none"
                />
              </div>
            ))}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Billing Cycle</label>
              <select
                value={newPlan.billing}
                onChange={(e) => setNewPlan({ ...newPlan, billing: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none"
              >
                {['MONTHLY', 'YEARLY', 'CUSTOM'].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Globe2 size={10} /> Region</label>
              <select
                value={newPlan.region}
                onChange={(e) => setNewPlan({ ...newPlan, region: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none"
              >
                {['ALL', 'IN', 'US', 'UK', 'AE'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {newPlan.dynamicPricing && (
            <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/20 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in-95 duration-300">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest">Pricing Strategy</label>
                  <select 
                    value={newPlan.pricingRule}
                    onChange={(e) => setNewPlan({ ...newPlan, pricingRule: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-primary/10 rounded-xl text-sm font-bold outline-none shadow-sm"
                  >
                    <option value="TIME_BASED">Time-based (Peak Hours)</option>
                    <option value="DEMAND_BASED">Demand-based (High Traffic)</option>
                    <option value="REGION_SPECIFIC">Regional Surge</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest">Modifier Percentage (%)</label>
                  <input 
                    type="number"
                    placeholder="e.g. +10 or -5"
                    value={newPlan.modifier}
                    onChange={(e) => setNewPlan({ ...newPlan, modifier: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-primary/10 rounded-xl text-sm font-bold outline-none shadow-sm focus:ring-4 focus:ring-primary/10"
                  />
                </div>
            </div>
          )}

          <div className="flex gap-3">
            <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
              <Save size={14} /> Save Plan
            </button>
            <button onClick={() => setShowCreate(false)} className="px-8 py-3 bg-slate-50 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center gap-8 hover:shadow-lg hover:shadow-slate-100 transition-all group">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black text-sm">{plan.id}</div>
            <div className="flex-1">
              <p className="font-black text-slate-900 text-lg">{plan.name}</p>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-[10px] font-black text-slate-400 uppercase">{plan.billing}</span>
                <span className="text-[10px] font-black text-slate-300">•</span>
                <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><Globe2 size={10} /> {plan.region}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-2xl text-slate-900">{plan.price}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">{plan.subscribers.toLocaleString()} subscribers</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-3 bg-slate-50 text-primary rounded-xl hover:bg-primary/10"><Edit3 size={16} /></button>
              <button className="p-3 bg-slate-50 text-red-500 rounded-xl hover:bg-red-50"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Coupon Engine ─── */
const CouponsTab = () => {
  const [showCreate, setShowCreate] = useState(false);

  const coupons = [
    { code: 'WELCOME50', type: 'PERCENT', value: '50%', plan: 'All Plans', uses: 1240, limit: 5000, expiry: '2026-12-31', status: 'ACTIVE' },
    { code: 'DIWALI99', type: 'FLAT', value: '₹99', plan: 'Premium', uses: 840, limit: 1000, expiry: '2026-11-01', status: 'EXPIRED' },
    { code: 'REFER200', type: 'FLAT', value: '₹200', plan: 'All Plans', uses: 3820, limit: null, expiry: 'No Expiry', status: 'ACTIVE' },
    { code: 'SUMMER30', type: 'PERCENT', value: '30%', plan: 'Annual Pro', uses: 142, limit: 500, expiry: '2026-06-30', status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <p className="text-sm font-bold text-slate-500">{coupons.filter(c => c.status === 'ACTIVE').length} active coupons</p>
        <button onClick={() => setShowCreate(!showCreate)} className="px-6 py-3 bg-primary text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center gap-2">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {showCreate && (
        <div className="bg-white border border-primary/20 rounded-[2.5rem] p-8 shadow-xl shadow-primary/5 animate-in fade-in slide-in-from-top-4 duration-300 space-y-6">
          <h3 className="font-black text-slate-900 flex items-center gap-2"><Tag size={18} className="text-primary" /> New Coupon</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Coupon Code</label>
              <input placeholder="SUMMER30" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-mono font-black uppercase outline-none focus:ring-4 focus:ring-primary/10" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Discount Type</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none">
                <option>PERCENT</option>
                <option>FLAT</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Value</label>
              <input type="number" placeholder="30" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Applicable Plan</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none">
                <option>All Plans</option>
                <option>Premium</option>
                <option>Annual Pro</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Usage Limit</label>
              <input type="number" placeholder="1000 (leave blank for unlimited)" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Expiry Date</label>
              <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10" />
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
              <Gift size={14} /> Generate Coupon
            </button>
            <button onClick={() => setShowCreate(false)} className="px-8 py-3 bg-slate-50 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {coupons.map((c) => (
          <div key={c.code} className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center gap-8 hover:shadow-lg transition-all group">
            <div className="px-4 py-2 bg-slate-900 text-white rounded-xl font-mono font-black tracking-widest text-sm">{c.code}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-black", c.type === 'PERCENT' ? 'bg-primary/10 text-primary' : 'bg-emerald-50 text-emerald-600')}>
                  {c.type}
                </span>
                <span className="font-black text-slate-900 text-xl">{c.value} off</span>
                <span className="text-[10px] text-slate-400 font-bold">on {c.plan}</span>
              </div>
              <div className="flex gap-4 mt-2">
                <span className="text-[10px] font-bold text-slate-400">Used: {c.uses.toLocaleString()}{c.limit ? ` / ${c.limit.toLocaleString()}` : ''}</span>
                <span className="text-[10px] font-bold text-slate-400">Expires: {c.expiry}</span>
              </div>
            </div>
            <span className={cn("px-3 py-1 rounded-xl text-[10px] font-black uppercase", c.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-400')}>
              {c.status}
            </span>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Discount Campaign Engine ─── */
const CampaignsTab = () => {
  const [showCreate, setShowCreate] = useState(false);
  
  const campaigns = [
    { id: 'C1', name: 'Holi Dhamaka 2026', discount: '25%', status: 'ACTIVE', spend: '₹4.2L', roi: '18.4x', reach: '124K users', end: '31 Mar' },
    { id: 'C2', name: 'Spring Semester Sale', discount: 'Fixed ₹500', status: 'SCHEDULED', spend: '₹0', roi: '-', reach: 'Planned', end: '15 Apr' },
    { id: 'C3', name: 'Flash 48h Sale', discount: '40%', status: 'EXPIRED', spend: '₹1.1L', roi: '12.2x', reach: '48K users', end: '25 Mar' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Campaigns', value: '2', icon: Megaphone, color: 'text-primary' },
          { label: 'Campaign Reach', value: '172K', icon: Globe2, color: 'text-emerald-600' },
          { label: 'Avg. ROI', value: '15.3x', icon: BarChart3, color: 'text-slate-900' },
          { label: 'Growth Lift', value: '+42%', icon: Zap, color: 'text-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-6 flex flex-col shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <stat.icon size={16} className={stat.color} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
            </div>
            <h4 className={cn("text-2xl font-black tracking-tighter", stat.color)}>{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <h3 className="font-black text-slate-900 text-xl tracking-tight">Active & Recent Campaigns</h3>
        <button onClick={() => setShowCreate(true)} className="px-6 py-3 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg">
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {showCreate && (
        <div className="bg-white border border-primary/20 rounded-[2.5rem] p-8 shadow-xl shadow-primary/5 animate-in fade-in slide-in-from-top-4 duration-300 space-y-6">
          <h3 className="font-black text-slate-900 flex items-center gap-2 text-lg"><Megaphone size={20} className="text-primary" /> Setup Marketing Campaign</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Name</label>
              <input placeholder="e.g. Summer Vacation Pro" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auto-Apply Discount</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none">
                <option>None (Banner Only)</option>
                <option>SUMMER30 (30% Off)</option>
                <option>WELCOME50 (50% Off)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Banner Message</label>
              <input placeholder="FLASH SALE: 30% OFF ON ALL PRO PLANS!" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Region</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none">
                <option>Global (All)</option>
                <option>India Only</option>
                <option>North America</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End Date</label>
              <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget Cap (₹)</label>
              <input type="number" placeholder="50,000" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" />
            </div>
          </div>
          <div className="flex gap-4 pt-4 border-t border-slate-50">
            <button className="px-10 py-3 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">Launch Campaign</button>
            <button onClick={() => setShowCreate(false)} className="px-8 py-3 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {campaigns.map((camp) => (
          <div key={camp.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-6 flex items-center gap-8 group hover:shadow-xl hover:shadow-slate-100 transition-all">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center font-black",
              camp.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600" :
              camp.status === 'SCHEDULED' ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400"
            )}>
              <Megaphone size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h4 className="font-black text-slate-900 text-lg">{camp.name}</h4>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  camp.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600" :
                  camp.status === 'SCHEDULED' ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-400"
                )}>
                  {camp.status}
                </span>
              </div>
              <div className="flex items-center gap-6 mt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discount</span>
                  <span className="text-sm font-bold text-slate-900">{camp.discount}</span>
                </div>
                <div className="flex flex-col border-l border-slate-100 pl-6">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reach</span>
                  <span className="text-sm font-bold text-slate-900">{camp.reach}</span>
                </div>
                <div className="flex flex-col border-l border-slate-100 pl-6">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ends</span>
                  <span className="text-sm font-bold text-slate-900">{camp.end}</span>
                </div>
              </div>
            </div>
            <div className="text-right flex flex-col gap-1 pr-4">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ROI</span>
                <span className="text-xl font-black text-slate-900">{camp.roi}</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400">Spent: {camp.spend}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <button className="p-3 bg-slate-50 text-slate-900 rounded-xl hover:bg-slate-100"><Edit3 size={16} /></button>
              <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Payment Logs Tab ─── */
const PaymentLogsTab = () => {
  const logs = [
    { id: 'TXN#829110', user: 'Rahul Malhotra', plan: 'Premium Plus', amount: '₹1,499', gateway: 'Razorpay', status: 'SUCCESS', date: '30 Mar, 12:04' },
    { id: 'TXN#829108', user: 'Ishani Patel', plan: 'Standard', amount: '₹299', gateway: 'Stripe', status: 'FAILED', date: '30 Mar, 11:58' },
    { id: 'TXN#829105', user: 'Aryan Khan', plan: 'Annual Pro', amount: '₹5,999', gateway: 'Razorpay', status: 'SUCCESS', date: '30 Mar, 11:41' },
    { id: 'TXN#829102', user: 'Sanya Mirza', plan: 'Premium', amount: '₹699', gateway: 'PayU', status: 'RETRYING', date: '30 Mar, 11:20' },
    { id: 'TXN#829099', user: 'Vikram Malhotra', plan: 'Standard', amount: '₹299', gateway: 'Stripe', status: 'FAILED', date: '30 Mar, 10:58' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'Successful Today', value: '₹2,18,400', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Failed Transactions', value: '14', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Retrying', value: '3', icon: RefreshCcw, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center gap-4 shadow-sm">
            <div className={cn("p-4 rounded-2xl", s.bg, s.color)}><s.icon size={24} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              <h4 className={cn("text-2xl font-black tracking-tighter mt-1", s.color)}>{s.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input placeholder="Search transactions…" className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10" />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-black text-slate-500">
            <Filter size={14} /> Filter
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center gap-6 p-5 hover:bg-slate-50/50 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                {log.status === 'SUCCESS' ? <CheckCircle size={18} className="text-emerald-500" /> :
                 log.status === 'FAILED' ? <XCircle size={18} className="text-red-500" /> :
                 <RefreshCcw size={18} className="text-amber-500 animate-spin" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <p className="font-black text-slate-900 text-sm">{log.user}</p>
                  <span className="text-[10px] font-mono font-bold text-slate-400">{log.id}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{log.plan} • {log.gateway}</p>
              </div>
              <p className="font-black text-slate-900 text-lg">{log.amount}</p>
              <p className="text-[10px] font-bold text-slate-400 w-32 text-right">{log.date}</p>
              {log.status === 'FAILED' && (
                <button className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 flex items-center gap-1">
                  <RefreshCcw size={12} /> Retry
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Refund Management Tab ─── */
const RefundsTab = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const refunds = [
    { id: 'REF#441', user: 'Ishani Patel', plan: 'Premium', amount: '₹699', type: 'FULL', reason: 'Teacher no-show', status: 'PENDING', date: '29 Mar 2026' },
    { id: 'REF#440', user: 'Rahul Malhotra', plan: 'Premium Plus', amount: '₹750', type: 'PARTIAL', reason: 'Service degradation', status: 'APPROVED', date: '28 Mar 2026' },
    { id: 'REF#438', user: 'Aryan Khan', plan: 'Standard', amount: '₹299', type: 'FULL', reason: 'Duplicate charge', status: 'PROCESSED', date: '27 Mar 2026' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex gap-6">
        {[
          { label: 'Pending Refunds', value: '1', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Refunded Today', value: '₹750', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total This Month', value: '₹12,240', color: 'text-slate-900', bg: 'bg-slate-100' },
        ].map((s, i) => (
          <div key={i} className={cn("flex-1 rounded-[2rem] p-6 flex flex-col", s.bg)}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            <h4 className={cn("text-3xl font-black tracking-tighter mt-2", s.color)}>{s.value}</h4>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {refunds.map((r) => (
          <div key={r.id} className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center gap-6 hover:shadow-lg transition-all group">
            <div className={cn("px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex-shrink-0", r.type === 'FULL' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500')}>
              {r.type}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="font-black text-slate-900">{r.user}</p>
                <span className="text-[10px] font-mono font-bold text-slate-400">{r.id}</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">{r.plan} • {r.reason}</p>
            </div>
            <p className="font-black text-xl text-slate-900">{r.amount}</p>
            <p className="text-xs text-slate-400 font-bold w-24 text-right">{r.date}</p>
            <span className={cn("px-3 py-1 rounded-xl text-[10px] font-black uppercase flex-shrink-0",
              r.status === 'PENDING' ? 'bg-amber-50 text-amber-600 animate-pulse' :
              r.status === 'APPROVED' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600')}>
              {r.status}
            </span>
            {r.status === 'PENDING' && (
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => { setSelected(r); setIsConfirmOpen(true); }}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Approve
                </button>
                <button className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all">
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => setIsConfirmOpen(false)}
        title="Approve Refund?"
        message={`Approve a ${selected?.type} refund of ${selected?.amount} for ${selected?.user}? This will initiate an automatic bank transfer.`}
      />
    </div>
  );
};

/* ─── Main Page ─── */
export const SubscriptionPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('PLANS');

  const tabs = [
    { id: 'PLANS', label: 'Plans & Pricing', icon: CreditCard },
    { id: 'COUPONS', label: 'Coupons & Discounts', icon: Tag },
    { id: 'CAMPAIGNS', label: 'Marketing Campaigns', icon: Megaphone },
    { id: 'PAYMENT_LOGS', label: 'Payment Logs', icon: BarChart3 },
    { id: 'REFUNDS', label: 'Refunds', icon: ArrowDownRight },
  ] as const;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Payment & Subscriptions</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Manage plans, coupons, gateway logs, and refunds.</p>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 px-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-6 text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                activeTab === tab.id ? "text-primary" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
            </button>
          ))}
        </div>

        <div className="p-8">
          {activeTab === 'PLANS' && <PlansTab />}
          {activeTab === 'COUPONS' && <CouponsTab />}
          {activeTab === 'CAMPAIGNS' && <CampaignsTab />}
          {activeTab === 'PAYMENT_LOGS' && <PaymentLogsTab />}
          {activeTab === 'REFUNDS' && <RefundsTab />}
        </div>
      </div>
    </div>
  );
};
