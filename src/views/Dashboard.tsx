import React from 'react';
import { ShoppingCart, Calendar, TrendingUp, DollarSign, MoreVertical, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Sen', value: 30 },
  { name: 'Sel', value: 55 },
  { name: 'Rab', value: 85 },
  { name: 'Kam', value: 45 },
  { name: 'Jum', value: 65 },
  { name: 'Sab', value: 95 },
  { name: 'Min', value: 60 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Dashboard() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold text-on-surface">Ringkasan Dashboard</h1>
        <p className="text-on-surface-variant mt-1">Pantau performa pesanan dan pendapatan hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Pesanan', value: '1,248', change: '+12% dari bulan lalu', icon: ShoppingCart, color: 'text-primary', bg: 'bg-secondary-container' },
          { label: 'Pesanan Hari Ini', value: '42', change: '+5% dari kemarin', icon: Calendar, color: 'text-tertiary', bg: 'bg-surface-container-highest' },
          { label: 'Pendapatan (Bulan Ini)', value: 'Rp 45.2M', change: '+8% dari bulan lalu', icon: DollarSign, color: 'text-primary', bg: 'bg-secondary-container' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant flex flex-col hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">{stat.label}</span>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="mt-auto">
              <h3 className="text-3xl font-bold text-on-surface">{stat.value}</h3>
              <p className="text-sm text-tertiary mt-2 flex items-center gap-1">
                <TrendingUp size={16} />
                {stat.change}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <motion.div variants={itemVariants} className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-on-surface">Tren Pesanan</h2>
            <select className="bg-surface-container border border-outline-variant rounded-md py-1.5 px-3 text-sm text-on-surface-variant focus:ring-primary focus:border-primary outline-none">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e3e5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#737784', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#737784', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }} 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 2 ? '#003c90' : '#d0e1fb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
          <h2 className="text-xl font-bold text-on-surface">Pesanan Terbaru</h2>
          <button className="text-primary font-semibold text-sm hover:underline flex items-center gap-1">
            Lihat Semua
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">ID Pesanan</th>
                <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Pelanggan</th>
                <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Tanggal</th>
                <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total</th>
                <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-on-surface">
              {[
                { id: '#ORD-001', name: 'Budi Santoso', date: '24 Okt 2023, 10:30', total: 'Rp 450.000', status: 'Baru', statusColor: 'bg-secondary-container text-on-secondary-container' },
                { id: '#ORD-002', name: 'Siti Aminah', date: '24 Okt 2023, 09:15', total: 'Rp 1.200.000', status: 'Diproses', statusColor: 'bg-process-bg text-process-text' },
                { id: '#ORD-003', name: 'Andi Wijaya', date: '23 Okt 2023, 16:45', total: 'Rp 350.000', status: 'Selesai', statusColor: 'bg-success-bg text-success-text' },
                { id: '#ORD-004', name: 'Dewi Lestari', date: '23 Okt 2023, 14:20', total: 'Rp 850.000', status: 'Baru', statusColor: 'bg-secondary-container text-on-secondary-container' },
              ].map((order, idx) => (
                <tr key={idx} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                  <td className="p-4 text-primary font-bold">{order.id}</td>
                  <td className="p-4">{order.name}</td>
                  <td className="p-4 text-on-surface-variant">{order.date}</td>
                  <td className="p-4">{order.total}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1 text-on-surface-variant hover:text-primary transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
