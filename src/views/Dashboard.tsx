import React, { useEffect, useState } from 'react';
import { ClipboardList, Layers, TrendingUp, MoreVertical, ArrowRight, Loader2, PieChart as PieChartIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { ViewType } from '../components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { analyticsService } from '../services/analyticsService';
import { submissionService } from '../services/submissionService';
import { AnalyticsSummary, AnalyticsTrend, AnalyticsStatusDistribution } from '../types/analytics';

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

interface DashboardProps {
  onViewChange: (view: ViewType) => void;
}

export default function Dashboard({ onViewChange }: DashboardProps) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [trendData, setTrendData] = useState<AnalyticsTrend[]>([]);
  const [statusData, setStatusData] = useState<AnalyticsStatusDistribution[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [summaryRes, trendRes, statusRes, submissionRes] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getTrend(),
          analyticsService.getStatusDistribution(),
          submissionService.getSubmissions({ limit: 5 })
        ]);

        if (summaryRes.success) setSummary(summaryRes.data);
        if (trendRes.success) setTrendData(trendRes.data);
        if (statusRes.success) setStatusData(statusRes.data);
        if (submissionRes.success) setRecentSubmissions(submissionRes.data.items || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const stats = [
    { 
      label: 'Total Respon', 
      value: summary?.total_responses.toLocaleString() || '0', 
      change: '+12% dari bulan lalu', 
      icon: ClipboardList, 
      color: 'text-primary', 
      bg: 'bg-secondary-container' 
    },
    { 
      label: 'Formulir Aktif', 
      value: summary?.active_forms.toString() || '0', 
      change: '2 draf tersimpan', 
      icon: Layers, 
      color: 'text-tertiary', 
      bg: 'bg-surface-container-highest' 
    },
    { 
      label: 'Rata-rata Konversi', 
      value: `${summary?.average_conversion}%` || '0%', 
      change: '+0.5% dari bulan lalu', 
      icon: TrendingUp, 
      color: 'text-primary', 
      bg: 'bg-secondary-container' 
    },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-20"
    >
      <div>
        <h1 className="text-2xl sm:text-4xl font-bold text-on-surface">Ringkasan Dashboard</h1>
        <p className="text-sm sm:text-base text-on-surface-variant mt-1">Pantau performa formulir dan respon yang masuk hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
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
              <h3 className="text-2xl sm:text-3xl font-bold text-on-surface">{stat.value}</h3>
              <p className="text-xs sm:text-sm text-tertiary mt-2 flex items-center gap-1">
                <TrendingUp size={16} />
                {stat.change}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tren Respon Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-on-surface">Tren Respon</h2>
            <select className="bg-surface-container border border-outline-variant rounded-md py-1.5 px-3 text-sm text-on-surface-variant focus:ring-primary focus:border-primary outline-none">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
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
                  {trendData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === trendData.length - 1 ? '#003c90' : '#d0e1fb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div variants={itemVariants} className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <PieChartIcon size={20} />
            </div>
            <h2 className="text-xl font-bold text-on-surface">Status Respon</h2>
          </div>
          <div className="space-y-6">
            {statusData.map((item, idx) => {
              const maxCount = Math.max(...statusData.map(s => s.count));
              const percentage = (item.count / maxCount) * 100;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-on-surface capitalize">{item.status}</span>
                    <span className="text-on-surface-variant">{item.count}</span>
                  </div>
                  <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              );
            })}
            {statusData.length === 0 && (
              <p className="text-center text-on-surface-variant py-10">Belum ada data status.</p>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
          <h2 className="text-xl font-bold text-on-surface">Respon Terbaru</h2>
          <button 
            onClick={() => onViewChange('orders')}
            className="text-primary font-semibold text-sm hover:underline flex items-center gap-1"
          >
            Lihat Semua
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">ID Respon</th>
                <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Pengirim</th>
                <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Tanggal</th>
                <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Nama Form</th>
                <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
                <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-on-surface">
              {recentSubmissions.map((submission, idx) => (
                <tr key={idx} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                  <td className="p-4 text-primary font-bold">{submission.id}</td>
                  <td className="p-4">{submission.customer_name}</td>
                  <td className="p-4 text-on-surface-variant">{new Date(submission.created_at).toLocaleString()}</td>
                  <td className="p-4">{submission.form_name}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      submission.status === 'baru' ? 'bg-secondary-container text-on-secondary-container' :
                      submission.status === 'dibaca' ? 'bg-process-bg text-process-text' :
                      'bg-success-bg text-success-text'
                    }`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1 text-on-surface-variant hover:text-primary transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {recentSubmissions.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-on-surface-variant">Belum ada respon masuk.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
