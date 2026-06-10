import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import { Lead, leadSourceData, monthlyLeadsData, conversionRateData } from '../data/sampleData';

const COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: unknown[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b] border border-gray-700/50 rounded-lg p-3 shadow-xl">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        {payload.map((entry: unknown, index: number) => {
          const item = entry as { name?: string; value?: number; color?: string };
          return (
            <p key={index} className="text-sm" style={{ color: item.color || '#fff' }}>
              {item.name}: {item.value}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    fetchLeads();
  }, [user]);

  const fetchLeads = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLeads(data);
    }
  };

  const sourceStats = leadSourceData.map((source) => ({
    ...source,
    value: leads.filter((l) => l.lead_source === source.name).length || source.value,
  }));

  const statusStats = [
    { name: 'New', value: leads.filter((l) => l.status === 'New').length, color: '#3b82f6' },
    { name: 'Contacted', value: leads.filter((l) => l.status === 'Contacted').length, color: '#f59e0b' },
    { name: 'Qualified', value: leads.filter((l) => l.status === 'Qualified').length, color: '#8b5cf6' },
    { name: 'Converted', value: leads.filter((l) => l.status === 'Converted').length, color: '#22c55e' },
    { name: 'Lost', value: leads.filter((l) => l.status === 'Lost').length, color: '#ef4444' },
  ];

  const totalLeads = leads.length;
  const convertedLeads = leads.filter((l) => l.status === 'Converted').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';

  const summaryCards = [
    { title: 'Total Leads', value: totalLeads, icon: Users, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { title: 'Conversion Rate', value: `${conversionRate}%`, icon: Target, color: 'from-green-500 to-green-600', change: '+5.2%' },
    { title: 'Revenue Impact', value: '$24.5K', icon: DollarSign, color: 'from-purple-500 to-purple-600', change: '+18%' },
    { title: 'Growth Trend', value: '+23%', icon: TrendingUp, color: 'from-yellow-500 to-yellow-600', change: 'vs last month' },
  ];

  return (
    <div>
      <Navbar title="Analytics" />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {summaryCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-800/80 to-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 relative overflow-hidden group hover:border-gray-600 transition-all"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
              <card.icon className="w-8 h-8 text-gray-400 mb-3" />
              <p className="text-gray-400 text-sm">{card.title}</p>
              <p className="text-3xl font-bold text-white">{card.value}</p>
              <p className="text-green-400 text-sm mt-2">{card.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lead Sources Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Lead Sources Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sourceStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Lead Status Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text<think> mb-4">Lead Status Overview</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Monthly Leads Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text<think> mb-4">Monthly Leads & Conversions</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyLeadsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="converted" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Conversion Rate Line Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-[#1e293b]/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
          >
            <h3 className="text-lg font-semibold text<think> mb-4">Conversion Rate Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
