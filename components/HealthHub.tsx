
import React, { useState } from 'react';
import { MOCK_OUTBREAKS, MOCK_HELPLINES } from '../constants';
import { Reminder } from '../types';
import { useAuth } from '../context/AuthContext';

const HealthHub: React.FC = () => {
  const { user } = useAuth();
  const currentUserId = user?.id || 'mock-user-id';

  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', userId: currentUserId, type: 'Vaccination', title: 'Polio Dose 2', date: '2024-06-15', time: '10:00 AM', isCompleted: false },
    { id: '2', userId: currentUserId, type: 'Medicine', title: 'Vitamin C', date: 'Everyday', time: '09:00 AM', isCompleted: true },
  ]);

  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderDate, setNewReminderDate] = useState('');

  const addReminder = () => {
    if (!newReminderTitle || !newReminderDate) return;
    const reminder: Reminder = {
      id: Date.now().toString(),
      userId: currentUserId,
      type: 'Checkup',
      title: newReminderTitle,
      date: newReminderDate,
      time: '08:00 AM',
      isCompleted: false
    };
    setReminders([...reminders, reminder]);
    setNewReminderTitle('');
    setNewReminderDate('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Outbreaks & Helplines */}
      <div className="lg:col-span-2 space-y-8">
        {/* Outbreaks Section */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">🚨</span>
            <h2 className="text-xl font-bold text-slate-800">Local Disease Outbreak Alerts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_OUTBREAKS.map((outbreak) => (
              <div key={outbreak.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-emerald-700">{outbreak.disease} Alert</h3>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                    outbreak.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {outbreak.severity} Risk
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3">{outbreak.district}, {outbreak.state}</p>
                <div className="space-y-1 mb-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Precautions</p>
                  <ul className="text-xs text-slate-600 list-disc list-inside">
                    {outbreak.precautions.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
                <p className="text-[10px] text-slate-400">Last updated: {outbreak.lastUpdated}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Helplines Section */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl">☎️</span>
            <h2 className="text-xl font-bold text-slate-800">Emergency & Helplines</h2>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {MOCK_HELPLINES.map((helpline, i) => (
              <div key={i} className={`p-4 flex justify-between items-center ${i !== MOCK_HELPLINES.length - 1 ? 'border-b border-slate-100' : ''}`}>
                <div>
                  <h4 className="font-bold text-slate-700">{helpline.name}</h4>
                  <p className="text-lg text-emerald-600 font-mono font-bold tracking-wider">{helpline.number}</p>
                </div>
                <button className="bg-emerald-100 text-emerald-700 p-3 rounded-full hover:bg-emerald-200 transition-colors">
                  📞
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Column: Reminders */}
      <div className="space-y-8">
        <section className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 sticky top-24">
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-2xl">⏰</span>
            <h2 className="text-xl font-bold text-slate-800">Health Reminders</h2>
          </div>

          <div className="space-y-4 mb-8">
            {reminders.map((rem) => (
              <div key={rem.id} className={`flex items-center space-x-3 p-3 rounded-xl border transition-all ${rem.isCompleted ? 'bg-slate-50 border-slate-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <input 
                  type="checkbox" 
                  checked={rem.isCompleted} 
                  onChange={() => {
                    setReminders(reminders.map(r => r.id === rem.id ? { ...r, isCompleted: !r.isCompleted } : r));
                  }}
                  className="w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <h4 className={`text-sm font-bold ${rem.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{rem.title}</h4>
                  <p className="text-[10px] text-slate-500">{rem.date} • {rem.time}</p>
                </div>
                <span className="text-xs bg-white px-2 py-1 rounded-md text-slate-400 shadow-sm border border-slate-100">
                  {rem.type}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Add New Reminder</h3>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Title (e.g., Flu Shot)"
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={newReminderTitle}
                onChange={e => setNewReminderTitle(e.target.value)}
              />
              <input 
                type="date" 
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                value={newReminderDate}
                onChange={e => setNewReminderDate(e.target.value)}
              />
              <button 
                onClick={addReminder}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
              >
                Schedule Task
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HealthHub;
