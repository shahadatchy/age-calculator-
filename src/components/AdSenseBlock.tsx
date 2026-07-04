import { TranslationDict } from '../types';

interface AdSenseBlockProps {
  t: TranslationDict;
  isDark?: boolean;
}

export default function AdSenseBlock({ t, isDark = false }: AdSenseBlockProps) {
  // We'll use an iframe with srcDoc to isolate the Adsterra ad element and script.
  // This allows multiple identical ad units to co-exist on the same page without ID conflicts.
  const iframeSrcDoc = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        #container-400e9e88c764e4885312db4cd2fbf091 {
          width: 100%;
          min-height: 250px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      </style>
    </head>
    <body>
      <div id="container-400e9e88c764e4885312db4cd2fbf091"></div>
      <script async="async" data-cfasync="false" src="https://pl30207166.effectivecpmnetwork.com/400e9e88c764e4885312db4cd2fbf091/invoke.js"></script>
    </body>
    </html>
  `;

  return (
    <div className={`rounded-[32px] p-4 border transition-all duration-300 relative overflow-hidden ${
      isDark 
        ? 'bg-zinc-950/60 border-zinc-900/60 shadow-[0_12px_40px_rgba(0,0,0,0.5)]' 
        : 'glass-container-liquid border-white/60 shadow-lg shadow-slate-100/40'
    }`}>
      {/* Background subtle light radial flare */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full filter blur-xl ${
        isDark ? 'bg-purple-500/5' : 'bg-indigo-500/5'
      }`} />

      <div className="flex justify-between items-center mb-2.5 relative z-10 px-1">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
          Sponsored Link
        </span>
        <span className="text-[9px] font-medium text-slate-350 dark:text-zinc-600">
          Ads by Adsterra
        </span>
      </div>

      {/* Adsterra Native Ad Isolated Container via Iframe */}
      <div className="relative z-10">
        <div className="rounded-2xl min-h-[250px] flex flex-col justify-center items-center text-center transition-all overflow-hidden bg-white/30 dark:bg-zinc-950/20 border border-slate-100/50 dark:border-zinc-900/30 shadow-sm">
          <iframe
            srcDoc={iframeSrcDoc}
            title="Sponsored Ad"
            className="w-full h-[250px] border-none overflow-hidden"
            scrolling="no"
          />
        </div>
      </div>
    </div>
  );
}
