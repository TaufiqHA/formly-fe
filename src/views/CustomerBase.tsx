import React from 'react';
import { Search, Download, ChevronLeft, ChevronRight, Eye, Filter, User } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const customers = [
  { id: 'JD', name: 'Jane Doe', company: 'Acme Corp', orders: 142, lastDate: 'Oct 24, 2023', ltv: '$12,450.00', color: 'bg-primary' },
  { id: 'JS', name: 'John Smith', company: 'TechFlow Inc', orders: 87, lastDate: 'Oct 22, 2023', ltv: '$8,120.50', color: 'bg-secondary' },
  { id: 'AW', name: 'Alice Wong', company: 'Global Logistics', orders: 34, lastDate: 'Oct 15, 2023', ltv: '$3,400.00', color: 'bg-tertiary' },
  { id: 'BJ', name: 'Bob Johnson', company: 'Retail Solutions', orders: 12, lastDate: 'Sep 30, 2023', ltv: '$1,200.00', color: 'bg-primary-container' },
  { id: 'CD', name: 'Carol Davis', company: 'Design Studio X', orders: 3, lastDate: 'Aug 12, 2023', ltv: '$450.00', color: 'bg-outline' },
];

export default function CustomerBase() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-on-surface">Customer Base</h1>
          <p className="text-on-surface-variant mt-1">Manage and analyze your active clientele.</p>
        </div>
        <button className="bg-surface-container-lowest border border-outline-variant text-on-surface px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-surface-container-low transition-all shadow-sm">
          <Download size={18} />
          Export Data
        </button>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
          <input 
            type="text" 
            placeholder="Search customers by name or company..." 
            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <button className="whitespace-nowrap px-4 py-2 rounded-full bg-secondary-container text-primary text-xs font-bold ring-1 ring-primary/10">All Segments</button>
          <button className="whitespace-nowrap px-4 py-2 rounded-full bg-surface text-on-surface-variant text-xs font-bold border border-outline-variant hover:bg-surface-container-high transition-colors">New</button>
          <button className="whitespace-nowrap px-4 py-2 rounded-full bg-surface text-on-surface-variant text-xs font-bold border border-outline-variant hover:bg-surface-container-high transition-colors">Frequent</button>
          <button className="whitespace-nowrap px-4 py-2 rounded-full bg-surface text-on-surface-variant text-xs font-bold border border-outline-variant hover:bg-surface-container-high transition-colors">Inactive</button>
          <div className="w-px h-6 bg-outline-variant mx-2" />
          <button className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-lg overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="p-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Name</th>
                <th className="p-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Company</th>
                <th className="p-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Total Orders</th>
                <th className="p-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Last Order Date</th>
                <th className="p-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">LTV</th>
                <th className="p-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-on-surface">
              {customers.map((customer, idx) => (
                <tr key={idx} className="border-b border-outline-variant hover:bg-surface-bright transition-colors group">
                  <td className="p-6 flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-sm", customer.color)}>
                      {customer.id}
                    </div>
                    <span className="font-bold text-on-surface">{customer.name}</span>
                  </td>
                  <td className="p-6 text-on-surface-variant">{customer.company}</td>
                  <td className="p-6 text-right font-bold">{customer.orders}</td>
                  <td className="p-6 text-on-surface-variant">{customer.lastDate}</td>
                  <td className="p-6 text-right font-bold text-primary">{customer.ltv}</td>
                  <td className="p-6 text-center">
                    <button className="text-secondary hover:text-primary transition-all p-2 rounded-lg hover:bg-surface-container-high hover:scale-110 active:scale-95">
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-outline-variant p-6 bg-surface flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Showing 1 to 5 of 24 entries</span>
          <div className="flex gap-1">
            <button className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all" disabled>
              <ChevronLeft size={20} />
            </button>
            <button className="px-5 py-2 rounded-lg bg-primary text-white font-bold text-xs ring-2 ring-primary/20">1</button>
            <button className="px-5 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high font-bold text-xs">2</button>
            <button className="px-5 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high font-bold text-xs">3</button>
            <button className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden mt-8 h-44 relative group">
        <img 
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2000&auto=format&fit=crop" 
          alt="Banner" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent flex items-center p-12">
          <div className="text-white max-w-lg space-y-3">
            <div className="flex items-center gap-2">
              <User className="text-primary-container" size={24} fill="currentColor" />
              <h3 className="text-2xl font-bold leading-none">Customer Insights</h3>
            </div>
            <p className="text-sm opacity-90 leading-relaxed font-medium">
              Unlock deeper understanding of your customer base with our advanced analytics suite, available now for pro accounts.
            </p>
            <button className="bg-white text-primary px-6 py-2 rounded-full text-xs font-bold hover:bg-primary-container hover:text-white transition-all shadow-lg active:scale-95">
              Explore Analytics →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
