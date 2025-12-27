
import React, { useState } from 'react';

const OfflineSimulator: React.FC = () => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<{ text: string, type: 'user' | 'sms' }[]>([]);

  const processSMS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setHistory(prev => [...prev, { text: command, type: 'user' }]);

    const cmd = command.toLowerCase();
    let response = "SMS Health Service: Unknown command. Send 'HELP' for options.";

    if (cmd === 'help') {
      response = "Available Commands: 'SYMPTOMS [disease]', 'ALERTS', 'VACCINE', 'HELP'";
    } else if (cmd.includes('symptoms')) {
      const disease = cmd.split('symptoms ')[1] || 'dengue';
      response = `SMS Health Service (${disease.toUpperCase()}): Common symptoms include high fever, severe headache, and joint pain. See a doctor immediately.`;
    } else if (cmd === 'alerts') {
      response = "SMS Health Service: Alerts for Pune District. Dengue: HIGH RISK. Malaria: MEDIUM RISK. Reply ALERTS 1 for details.";
    } else if (cmd === 'vaccine') {
      response = "SMS Health Service: Next free Polio drive is on Sunday at Primary Health Center 2, Sadar Bazar.";
    }

    setTimeout(() => {
      setHistory(prev => [...prev, { text: response, type: 'sms' }]);
    }, 500);

    setCommand('');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800">SMS Interface Simulator</h2>
        <p className="text-slate-500 text-sm">Testing fallback logic for low-connectivity regions</p>
      </div>

      <div className="bg-slate-900 h-[500px] rounded-[3rem] p-4 relative border-[8px] border-slate-800 shadow-2xl flex flex-col">
        {/* Notch/Earpiece */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl"></div>
        
        {/* Screen */}
        <div className="flex-1 mt-8 mb-4 overflow-y-auto bg-slate-100 rounded-2xl p-4 flex flex-col space-y-3 font-mono text-xs">
          <div className="text-center text-slate-400 mb-2">Today, {new Date().toLocaleDateString()}</div>
          
          {history.map((h, i) => (
            <div key={i} className={`flex ${h.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-2 rounded-lg max-w-[80%] ${
                h.type === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-800'
              }`}>
                {h.text}
              </div>
            </div>
          ))}
          
          {history.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-slate-400 italic">
              Try sending "HELP" or "SYMPTOMS DENGUE"
            </div>
          )}
        </div>

        {/* Input area */}
        <form onSubmit={processSMS} className="p-2 flex space-x-2">
          <input
            type="text"
            value={command}
            onChange={e => setCommand(e.target.value)}
            placeholder="Type SMS command..."
            className="flex-1 bg-white rounded-full px-4 py-2 text-sm focus:outline-none"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-full">
            ➔
          </button>
        </form>
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-xl text-blue-800 text-sm">
        <h4 className="font-bold mb-1">💡 How it works:</h4>
        <p>In rural areas with poor 4G/5G, users interact via SMS (Short Message Service). This tool simulates how AI logic handles plain text commands to provide vital health information without an internet connection.</p>
      </div>
    </div>
  );
};

export default OfflineSimulator;
