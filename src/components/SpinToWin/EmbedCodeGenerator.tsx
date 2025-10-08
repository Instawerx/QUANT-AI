'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Code, ExternalLink } from 'lucide-react';

interface EmbedCodeGeneratorProps {
  baseUrl?: string;
}

export default function EmbedCodeGenerator({ baseUrl }: EmbedCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(800);

  const url = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://quantai.com');
  const embedUrl = `${url}/spin/embed`;

  const iframeCode = `<!-- QuantAI Spin to Win Widget -->
<iframe
  src="${embedUrl}"
  width="${width}"
  height="${height}"
  frameborder="0"
  allow="wallet-connection; web3"
  style="border: none; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);"
  title="QuantAI Spin to Win"
></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(iframeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 shadow-2xl max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <Code className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">Embed Spin to Win</h3>
          <p className="text-sm text-slate-400">Add this widget to your website</p>
        </div>
      </div>

      {/* Size Controls */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-slate-300 mb-3 block">Widget Size</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Width (px)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={400}
              max={1200}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Height (px)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min={600}
              max={1200}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Preset Sizes */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => { setWidth(600); setHeight(800); }}
            className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
          >
            Mobile (600x800)
          </button>
          <button
            onClick={() => { setWidth(800); setHeight(900); }}
            className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
          >
            Desktop (800x900)
          </button>
          <button
            onClick={() => { setWidth(500); setHeight(700); }}
            className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
          >
            Compact (500x700)
          </button>
        </div>
      </div>

      {/* Embed Code */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-300">Embed Code</label>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Code
              </>
            )}
          </button>
        </div>
        <div className="relative">
          <pre className="bg-slate-950 border border-slate-700 rounded-xl p-4 overflow-x-auto">
            <code className="text-sm text-slate-300 font-mono">{iframeCode}</code>
          </pre>
        </div>
      </div>

      {/* Preview */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-slate-300 mb-3 block">Live Preview</label>
        <div className="bg-slate-950 border border-slate-700 rounded-xl p-6 flex items-center justify-center overflow-auto">
          <iframe
            src={embedUrl}
            width={Math.min(width, 600)}
            height={Math.min(height, 600)}
            style={{
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}
            title="QuantAI Spin to Win Preview"
          />
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Preview limited to 600x600 for display
        </p>
      </div>

      {/* Features */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6">
        <h4 className="text-sm font-semibold text-blue-300 mb-3">Widget Features</h4>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Wallet connection (MetaMask, WalletConnect)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>QuantMissionAI contract approval flow</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Full spin mechanics with prizes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Sound effects & animations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Double-up bonus challenge</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>Referral system integration</span>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <motion.a
          href={embedUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-semibold rounded-xl transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Open Full Widget
        </motion.a>
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg"
        >
          {copied ? 'Code Copied!' : 'Copy Embed Code'}
        </motion.button>
      </div>

      {/* Implementation Notes */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <h4 className="text-sm font-semibold text-slate-300 mb-3">Implementation Notes</h4>
        <ul className="space-y-2 text-xs text-slate-400">
          <li className="flex items-start gap-2">
            <span className="text-amber-400">•</span>
            <span>Users must have a Web3 wallet (MetaMask or compatible)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400">•</span>
            <span>Contract approval requires 0.01 MATIC (Polygon) or BNB (BSC)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400">•</span>
            <span>Widget automatically detects user's network and uses deployed contract</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400">•</span>
            <span>Responsive design works on mobile and desktop</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
