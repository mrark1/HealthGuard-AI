
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleGenAI } from "@google/genai";
import { UserProfile } from '../types';

const UserDashboard: React.FC = () => {
  const { user, updateProfile, toggle2FA } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(user?.profile || {
    age: 25,
    gender: 'Other',
    bloodGroup: 'Unknown',
    weight: 60,
    height: 170,
    chronicConditions: []
  });
  const [aiInsight, setAiInsight] = useState('');
  const [wellnessPlan, setWellnessPlan] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setProfile(user.profile);
    }
  }, [user]);

  const generateHealthInsight = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Given this user health profile: Age: ${profile.age}, Gender: ${profile.gender}, Weight: ${profile.weight}kg, Height: ${profile.height}cm, Chronic Conditions: ${profile.chronicConditions.join(', ') || 'None'}. Provide 3 quick, actionable health tips for them. Keep it brief and friendly. Mention they should consult a doctor for clinical advice.`,
      });
      setAiInsight(response.text || 'Keep staying active and hydrated!');
    } catch (err) {
      setAiInsight('Unable to generate AI insights at this time.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateWeeklyPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a simple 7-day preventive health routine for a ${profile.age}-year-old with ${profile.weight}kg weight and height ${profile.height}cm. Chronic conditions: ${profile.chronicConditions.join(', ') || 'None'}. Include 1 specific physical activity goal and 1 nutrition focus per day. Output in a friendly, bulleted list format.`,
      });
      setWellnessPlan(response.text || 'Plan generation failed.');
    } catch (err) {
      setWellnessPlan('Plan generation failed. Please check your internet.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleSave = () => {
    updateProfile(profile);
    setIsEditing(false);
  };

  if (!user) return <div className="text-center p-20">Please sign in to view your dashboard.</div>;

  const bmi = (profile.weight / (Math.pow(profile.height / 100, 2))).toFixed(1);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome, {user.name}!</h1>
          <p className="text-slate-500">Manage your health profile and get personalized AI insights.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-3">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Account Active Since</p>
            <p className="text-sm font-semibold text-emerald-600">{new Date(user.joinedAt).toLocaleDateString()}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl">
            👤
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col h-fit">
            <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center"><span className="mr-2">📝</span> My Health Profile</h3>
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm font-bold transition-colors"
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age</label>
                  {isEditing ? (
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={profile.age} onChange={e => setProfile({...profile, age: +e.target.value})} />
                  ) : (
                    <p className="text-lg font-bold text-slate-700">{profile.age} <span className="text-xs font-normal text-slate-400">Years</span></p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Blood Group</label>
                  {isEditing ? (
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={profile.bloodGroup} onChange={e => setProfile({...profile, bloodGroup: e.target.value})}>
                      <option value="A+">A+</option><option value="A-">A-</option>
                      <option value="B+">B+</option><option value="B-">B-</option>
                      <option value="O+">O+</option><option value="O-">O-</option>
                      <option value="AB+">AB+</option><option value="AB-">AB-</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  ) : (
                    <p className="text-lg font-bold text-slate-700">{profile.bloodGroup}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weight (kg)</label>
                  {isEditing ? (
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={profile.weight} onChange={e => setProfile({...profile, weight: +e.target.value})} />
                  ) : (
                    <p className="text-lg font-bold text-slate-700">{profile.weight} <span className="text-xs font-normal text-slate-400">kg</span></p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Height (cm)</label>
                  {isEditing ? (
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={profile.height} onChange={e => setProfile({...profile, height: +e.target.value})} />
                  ) : (
                    <p className="text-lg font-bold text-slate-700">{profile.height} <span className="text-xs font-normal text-slate-400">cm</span></p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chronic Conditions</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    placeholder="e.g. Diabetes, Asthma (comma separated)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" 
                    value={profile.chronicConditions.join(', ')} 
                    onChange={e => setProfile({...profile, chronicConditions: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})} 
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.chronicConditions.length > 0 ? (
                      profile.chronicConditions.map((c, i) => (
                        <span key={i} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold border border-slate-200">{c}</span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs italic">No chronic conditions listed</span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-wider">Calculated BMI Index</label>
                <div className="bg-emerald-50 rounded-2xl p-4 flex items-center justify-between border border-emerald-100">
                  <div>
                    <span className="text-2xl font-black text-emerald-600">{bmi}</span>
                    <p className="text-[10px] text-emerald-800 font-bold uppercase mt-1">
                      {+bmi < 18.5 ? 'Underweight' : +bmi < 25 ? 'Normal' : +bmi < 30 ? 'Overweight' : 'Obese'}
                    </p>
                  </div>
                  <div className="text-4xl">⚖️</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-800 px-6 py-4 text-white">
              <h3 className="font-bold flex items-center text-sm uppercase tracking-widest"><span className="mr-2">🔒</span> Security Settings</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-700">Two-Factor Auth (2FA)</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Extra layer of protection for login</p>
                </div>
                <button
                  onClick={() => toggle2FA(!user.twoFactorEnabled)}
                  className={`w-12 h-6 rounded-full transition-all relative ${user.twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${user.twoFactorEnabled ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Health & Activity Logs Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Wellness Insights Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold flex items-center">
                    <span className="mr-3">✨</span> AI Wellness Insights
                  </h3>
                  <p className="text-emerald-100/80 text-sm mt-1">AI-driven guidance specifically for your health profile.</p>
                </div>
                {!aiInsight && !isGenerating && (
                   <button 
                    onClick={generateHealthInsight}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-white/10 backdrop-blur-sm"
                  >
                    Generate Insights
                  </button>
                )}
              </div>
              
              {isGenerating ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              ) : aiInsight ? (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-inner group">
                  <div className="text-sm leading-relaxed prose prose-invert max-w-none">
                    {aiInsight.split('\n').map((line, i) => <p key={i} className="mb-2 last:mb-0">{line}</p>)}
                  </div>
                  <button 
                    onClick={() => setAiInsight('')} 
                    className="mt-4 text-[10px] font-bold text-white/50 hover:text-white transition-colors flex items-center"
                  >
                    <span className="mr-1">🔄</span> Generate New Insights
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-800/20 rounded-2xl border border-dashed border-emerald-400/30 p-10 text-center">
                  <p className="text-emerald-100/60 text-sm">Click "Generate Insights" to see personalized health tips based on your profile.</p>
                </div>
              )}
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Weekly Wellness Planner */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <h4 className="font-bold text-slate-800 text-lg flex items-center">
                  <span className="mr-2">📅</span> AI Routine
                </h4>
                <button 
                  onClick={generateWeeklyPlan}
                  disabled={isGeneratingPlan}
                  className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-50 disabled:opacity-50"
                >
                  {isGeneratingPlan ? '...' : 'Create'}
                </button>
              </div>
              
              {wellnessPlan ? (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 overflow-y-auto h-64 text-sm text-slate-700 whitespace-pre-wrap font-medium">
                  {wellnessPlan}
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-100 rounded-3xl p-8 text-center flex-1 flex flex-col justify-center">
                  <p className="text-slate-400 text-xs">No active plan generated.</p>
                </div>
              )}
            </div>

            {/* User Activity Log */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Activity Log</h4>
              </div>
              <div className="p-0 overflow-y-auto h-72">
                {user.activityLog && user.activityLog.length > 0 ? (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 sticky top-0 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-2">Action</th>
                        <th className="px-6 py-2">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {user.activityLog.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-3 font-semibold text-slate-700">{log.action}</td>
                          <td className="px-6 py-3 text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-300 italic text-xs">No recent activity.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
