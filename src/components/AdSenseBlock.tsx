import { useState } from 'react';
import { Sparkles, DollarSign, HelpCircle, Code } from 'lucide-react';
import { TranslationDict } from '../types';

interface AdSenseBlockProps {
  t: TranslationDict;
}

export default function AdSenseBlock({ t }: AdSenseBlockProps) {
  const [pubId, setPubId] = useState('ca-pub-9982468137351602');
  const [slotId, setSlotId] = useState('4829104859');
  const [simulatedRevenue, setSimulatedRevenue] = useState(1.42);
  const [showConfig, setShowConfig] = useState(false);

  // Auto increment simulated revenue when hovering or randomly to show how engaging is Google AdSense!
  const simulateClick = () => {
    setSimulatedRevenue((prev) => parseFloat((prev + Math.random() * 0.45 + 0.15).toFixed(2)));
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full filter blur-xl" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-display font-medium text-lg tracking-tight text-amber-200">
              {t.adsTitle}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t.adsSub}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* AdSense Simulation counter */}
          <button
            onClick={simulateClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all cursor-pointer"
            title="Simulate user clicking an AdSense match to see real earning potential!"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Est. RPM: ${simulatedRevenue} USD</span>
          </button>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Configure real AdSense details"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showConfig && (
        <div className="mb-4 p-4 rounded-xl bg-slate-950/60 border border-white/5 font-mono text-xs text-slate-300 space-y-3">
          <p className="text-amber-300 font-medium flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Configure Google AdSense Production Variables:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Publisher ID (client)</label>
              <input
                type="text"
                value={pubId}
                onChange={(e) => setPubId(e.target.value)}
                className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Ad Slot ID</label>
              <input
                type="text"
                value={slotId}
                onChange={(e) => setSlotId(e.target.value)}
                className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed pt-1">
            Production Setup: In your static HTML layout, we load <code className="text-slate-300">&lt;script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"&gt;&lt;/script&gt;</code>. Below is the active ad slot which runs live matches if deployed live.
          </p>
        </div>
      )}

      {/* Actual HTML structure of AdSense Container block */}
      <div className="relative rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-5 h-[110px] flex flex-col items-center justify-center text-center">
        {/* Transparent script tag simulation structure */}
        <div className="absolute top-2 left-3 font-mono text-[9px] text-slate-500">
          google_ad_client = "{pubId}"
        </div>
        <div className="absolute top-2 right-3 font-mono text-[9px] text-slate-500">
          google_ad_slot = "{slotId}"
        </div>

        <span className="text-xs text-slate-300 font-medium tracking-wide flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          {t.adsPlaceholder}
        </span>
        <span className="text-[10px] text-slate-500 mt-2 font-sans">
          Recommended placement: Leaderboard responsive frame (auto-scaled for desktop, tablet, and mobile)
        </span>
      </div>
    </div>
  );
}
