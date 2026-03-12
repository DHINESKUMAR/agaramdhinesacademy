import React, { useState, useEffect } from "react";
import { Users, Briefcase, DollarSign, TrendingUp, Gift, MessageCircle, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { getStudents, getStaffs, getFees } from "../../lib/db";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function AdminHome() {
  const [stats, setStats] = useState({
    students: 0,
    employees: 0,
    revenue: 0,
    profit: 0
  });
  
  const [studentsPerClass, setStudentsPerClass] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const students = await getStudents();
      const staffs = await getStaffs();
      const fees = await getFees();
      
      const currentMonthStr = new Date().toISOString().slice(0, 7);
      const monthFees = fees.filter((f: any) => f.month === currentMonthStr);
      const totalRevenue = monthFees.reduce((sum: number, f: any) => sum + Number(f.amount), 0);
      
      setStats({
        students: students.length,
        employees: staffs.length,
        revenue: totalRevenue,
        profit: totalRevenue // Assuming profit = revenue for now
      });

      // Calculate students per class
      const classCounts: Record<string, number> = {};
      students.forEach((s: any) => {
        classCounts[s.grade] = (classCounts[s.grade] || 0) + 1;
      });
      
      const chartData = Object.keys(classCounts).map(grade => ({
        name: grade,
        Students: classCounts[grade]
      }));
      setStudentsPerClass(chartData);
    };
    loadData();
  }, []);

  const lineData = [
    { name: 'Oct 2025', Expenses: 0, Income: 0 },
    { name: 'Nov 2025', Expenses: 0, Income: 0 },
    { name: 'Dec 2025', Expenses: 0, Income: 0 },
    { name: 'Jan 2026', Expenses: 0, Income: 0 },
    { name: 'Feb 2026', Expenses: 0, Income: 0 },
    { name: 'Mar 2026', Expenses: 0, Income: stats.revenue }
  ];

  const pieData = [
    { name: 'Collections', value: stats.revenue, color: '#36c6a1' },
    { name: 'Remainings', value: 10000, color: '#e2e8f0' } // Dummy value for remainings
  ];

  return (
    <div className="space-y-6">
      {/* Promo Banner */}
      <div className="bg-[#eef2f9] rounded-xl p-4 flex items-center justify-between border border-blue-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <Gift size={24} />
          </div>
          <div>
            <h3 className="text-[#1e3a8a] font-bold text-lg">Cyber WEEK SALE</h3>
            <p className="text-sm text-gray-600">Save UPTO 60% on Agaram Desktop by grab it today.<br/>Offer is valid till <span className="font-bold">Friday!</span></p>
          </div>
        </div>
        <div className="hidden md:flex gap-2">
          <div className="bg-[#6b5b95] text-white text-center px-3 py-1 rounded">
            <div className="text-lg font-bold leading-none">01</div>
            <div className="text-[10px]">Days</div>
          </div>
          <div className="bg-[#6b5b95] text-white text-center px-3 py-1 rounded">
            <div className="text-lg font-bold leading-none">00</div>
            <div className="text-[10px]">Hours</div>
          </div>
          <div className="bg-[#6b5b95] text-white text-center px-3 py-1 rounded">
            <div className="text-lg font-bold leading-none">13</div>
            <div className="text-[10px]">Mins</div>
          </div>
          <div className="bg-[#6b5b95] text-white text-center px-3 py-1 rounded">
            <div className="text-lg font-bold leading-none">53</div>
            <div className="text-[10px]">Sec</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-[#6b5b95] rounded-xl p-5 text-white shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-white/80 mb-1">Total Students</p>
              <Users size={20} className="text-white/60" />
            </div>
            <h3 className="text-4xl font-bold">{stats.students}</h3>
          </div>
          <div className="flex justify-between items-end text-xs text-white/70">
            <span>This Month</span>
            <span>0</span>
          </div>
        </div>

        {/* Total Employees */}
        <div className="bg-[#9b89b3] rounded-xl p-5 text-white shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-white/80 mb-1">Total Employees</p>
              <Briefcase size={20} className="text-white/60" />
            </div>
            <h3 className="text-4xl font-bold">{stats.employees}</h3>
          </div>
          <div className="flex justify-between items-end text-xs text-white/70">
            <span>This Month</span>
            <span>0</span>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-[#ff8a8a] rounded-xl p-5 text-white shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-white/80 mb-1">Revenue</p>
              <span className="text-xl font-bold">Rs</span>
            </div>
            <h3 className="text-4xl font-bold">{stats.revenue.toLocaleString()}</h3>
          </div>
          <div className="flex justify-between items-end text-xs text-white/70">
            <span>This Month</span>
            <span>Rs 0</span>
          </div>
        </div>

        {/* Total Profit */}
        <div className="bg-[#5c8aeb] rounded-xl p-5 text-white shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-white/80 mb-1">Total Profit</p>
              <span className="text-xl font-bold">Rs</span>
            </div>
            <h3 className="text-4xl font-bold">{stats.profit.toLocaleString()}</h3>
          </div>
          <div className="flex justify-between items-end text-xs text-white/70">
            <span>This Month</span>
            <span>Rs 0</span>
          </div>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#ffeaea] rounded-xl p-6 flex items-center justify-between border border-red-100">
          <div>
            <h3 className="text-[#ff6b6b] font-medium mb-1">Welcome to Admin Dashboard</h3>
            <p className="text-gray-600 text-sm mb-1">Your Account is Verified! 👍</p>
            <p className="text-gray-500 text-xs">Enjoy World's No.1 Education Software.</p>
          </div>
          <div className="hidden md:block">
            <img src="https://picsum.photos/seed/admin-welcome/150/100" alt="Welcome" className="h-20 object-contain rounded-lg" />
          </div>
        </div>
        <div className="bg-[#eef2f9] rounded-xl p-6 flex items-center justify-between border border-blue-100">
          <div>
            <div className="flex text-[#36c6a1] mb-1">★★★★★</div>
            <h3 className="text-[#1e3a8a] font-bold">Review & earn</h3>
            <p className="text-xs text-gray-600">Receive <span className="font-bold">$10</span> as a reward plus<br/>Chance to <span className="font-bold">win</span> a Desktop plan.</p>
          </div>
          <Gift size={40} className="text-[#5c8aeb]" />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistics Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[#5c6e7d] font-medium text-sm">Statistics</h3>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#ff8a8a] rounded-sm"></span> Expenses</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#5c8aeb] rounded-sm"></span> Income</span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#8a9fb0'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#8a9fb0'}} />
                <Tooltip />
                <Line type="monotone" dataKey="Expenses" stroke="#ff8a8a" strokeWidth={2} dot={{r: 4, fill: '#ff8a8a'}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="Income" stroke="#5c8aeb" strokeWidth={2} dot={{r: 4, fill: '#5c8aeb'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estimated Fee Donut Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[#5c6e7d] font-medium text-sm">Estimated Fee This Month</h3>
            <span className="text-xs text-blue-500 cursor-pointer">Show 👁</span>
          </div>
          <div className="h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-gray-400">Estimation</span>
              <span className="text-sm font-bold text-gray-300">Hidden</span>
            </div>
          </div>
          <div className="flex justify-between mt-6 text-xs">
            <div className="text-center">
              <p className="text-gray-400 mb-1">Hidden</p>
              <p className="text-[#36c6a1] font-medium flex items-center gap-1"><span className="w-2 h-2 bg-[#36c6a1] rounded-full"></span> Collections</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 mb-1">Hidden</p>
              <p className="text-[#e2e8f0] font-medium flex items-center gap-1"><span className="w-2 h-2 bg-[#e2e8f0] rounded-full"></span> Remainings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart & Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students per class Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[#5c6e7d] font-medium text-sm">Statistics</h3>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-[#5c8aeb] rounded-sm"></span> Students</span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsPerClass} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#8a9fb0'}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#8a9fb0'}} width={100} />
                <Tooltip cursor={{fill: '#f5f5f5'}} />
                <Bar dataKey="Students" fill="#5c8aeb" barSize={40} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: SMS Banner & Calendar */}
        <div className="space-y-6">
          {/* SMS Banner */}
          <div className="bg-[#5c5c9a] rounded-xl p-5 text-white flex justify-between items-center relative overflow-hidden">
            <div className="z-10">
              <h3 className="font-bold text-sm mb-1">Free SMS Gateway</h3>
              <p className="text-xs text-white/70">Send Unlimited Free SMS<br/>on Mobile Numbers.</p>
            </div>
            <div className="z-10">
              <MessageCircle size={32} className="text-white/20" />
            </div>
            <div className="absolute right-0 bottom-0 opacity-50">
              <img src="https://picsum.photos/seed/sms/100/100" alt="SMS" className="w-24 h-24 object-cover rounded-tl-full" />
            </div>
          </div>

          {/* Progress Bars */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Today Present Students</span>
                <span className="text-blue-500 font-medium">0%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Today Present Employees</span>
                <span className="text-red-500 font-medium">0%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">This Month Fee Collection</span>
                <span className="text-green-500 font-medium">0%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-center mb-4">
              <button className="p-1 text-gray-400 hover:bg-gray-100 rounded-full"><ChevronLeft size={16} /></button>
              <div className="text-center">
                <h3 className="text-[#ff6b6b] font-bold text-sm uppercase">March, 2026</h3>
                <p className="text-xs text-gray-500">Thu Mar 12 2026</p>
              </div>
              <button className="p-1 text-gray-400 hover:bg-gray-100 rounded-full"><ChevronRight size={16} /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} className="text-gray-400 font-medium py-1">{day}</div>
              ))}
              {Array.from({length: 31}, (_, i) => i + 1).map(date => (
                <div key={date} className={`py-1.5 rounded-md ${date === 12 ? 'border border-[#ff6b6b] text-[#ff6b6b] font-bold' : 'text-blue-500 hover:bg-blue-50 cursor-pointer'}`}>
                  {date}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
