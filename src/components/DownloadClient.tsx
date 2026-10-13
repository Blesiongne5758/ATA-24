import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';

// ============================================================
// DOWNLOAD CLIENT COMPONENT
// Features: Multi-platform download, API key generation, activation
// ============================================================

type Platform = 'windows' | 'android' | 'ios';

interface DownloadInfo {
  platform: Platform;
  name: string;
  icon: string;
  version: string;
  size: string;
  requirements: string[];
  downloadUrl: string;
}

export default function DownloadClient() {
  const { addLog } = useTradingStore();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('windows');
  const [apiKey, setApiKey] = useState<string>('');
  const [apiKeyExpiry, setApiKeyExpiry] = useState<string>('');
  const [licenseDuration, setLicenseDuration] = useState<number>(30); // days
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  const platforms: DownloadInfo[] = [
    {
      platform: 'windows',
      name: 'Windows Desktop',
      icon: '🪟',
      version: 'v2.0.3',
      size: '145 MB',
      requirements: [
        'Windows 10/11 (64-bit)',
        '4 GB RAM minimum',
        '500 MB disk space',
        'Internet connection',
      ],
      downloadUrl: '/downloads/pjbot-windows-v2.0.3.exe',
    },
    {
      platform: 'android',
      name: 'Android Mobile',
      icon: '🤖',
      version: 'v2.0.3',
      size: '85 MB',
      requirements: [
        'Android 8.0+',
        '2 GB RAM minimum',
        '200 MB storage',
        'Internet connection',
      ],
      downloadUrl: '/downloads/pjbot-android-v2.0.3.apk',
    },
    {
      platform: 'ios',
      name: 'iOS Mobile',
      icon: '🍎',
      version: 'v2.0.3',
      size: '92 MB',
      requirements: [
        'iOS 14.0+',
        'iPhone 8 or newer',
        '200 MB storage',
        'Internet connection',
      ],
      downloadUrl: '/downloads/pjbot-ios-v2.0.3.ipa',
    },
  ];

  const handleGenerateApiKey = () => {
    setIsGenerating(true);
    
    // Simulate API key generation
    setTimeout(() => {
      const key = generateApiKey();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + licenseDuration);
      
      setApiKey(key);
      setApiKeyExpiry(expiryDate.toISOString());
      setIsGenerating(false);
      
      addLog({ 
        type: 'system', 
        message: `🔑 API Key generated for ${platforms.find(p => p.platform === selectedPlatform)?.name} - Expires in ${licenseDuration} days` 
      });
    }, 1500);
  };

  const generateApiKey = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = 5;
    const segmentLength = 5;
    const keyParts: string[] = [];
    
    for (let i = 0; i < segments; i++) {
      let segment = '';
      for (let j = 0; j < segmentLength; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      keyParts.push(segment);
    }
    
    return `PJBOT-${keyParts.join('-')}`;
  };

  const handleDownload = () => {
    if (!apiKey) {
      addLog({ type: 'warning', message: '⚠️ Please generate API key first before downloading' });
      return;
    }
    
    setDownloadStarted(true);
    addLog({ 
      type: 'info', 
      message: `📥 Download started for ${platforms.find(p => p.platform === selectedPlatform)?.name}` 
    });
    
    // Simulate download
    setTimeout(() => {
      setDownloadStarted(false);
      addLog({ 
        type: 'info', 
        message: `✅ Download complete! Use API key to activate the software` 
      });
    }, 2000);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    addLog({ type: 'info', message: '📋 API Key copied to clipboard' });
  };

  const selectedPlatformInfo = platforms.find(p => p.platform === selectedPlatform)!;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">📦</span>
          <h3 className="text-sm font-bold text-white">Download AI Trading Agent Client</h3>
        </div>
        <p className="text-[10px] text-gray-400">
          Install the desktop or mobile client to run the AI trading agent on your device
        </p>
      </div>

      {/* Platform Selection */}
      <div>
        <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 block">
          Select Platform
        </label>
        <div className="grid grid-cols-3 gap-2">
          {platforms.map((platform) => (
            <motion.button
              key={platform.platform}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedPlatform(platform.platform);
                setApiKey('');
                setApiKeyExpiry('');
              }}
              className={`p-3 rounded-lg border transition-all ${
                selectedPlatform === platform.platform
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                  : 'bg-gray-900/30 border-gray-800/50 text-gray-400 hover:bg-gray-900/50'
              }`}
            >
              <div className="text-2xl mb-1">{platform.icon}</div>
              <div className="text-[10px] font-medium">{platform.name}</div>
              <div className="text-[8px] opacity-60 mt-0.5">{platform.version}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Platform Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPlatform}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-3 rounded-lg bg-gray-900/30 border border-gray-800/50"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedPlatformInfo.icon}</span>
              <div>
                <div className="text-xs font-bold text-white">{selectedPlatformInfo.name}</div>
                <div className="text-[10px] text-gray-500">
                  Version {selectedPlatformInfo.version} • {selectedPlatformInfo.size}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-[9px] text-gray-500 uppercase tracking-wider">System Requirements</div>
            <ul className="space-y-0.5">
              {selectedPlatformInfo.requirements.map((req, idx) => (
                <li key={idx} className="text-[10px] text-gray-400 flex items-center gap-1.5">
                  <span className="text-green-400">✓</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* License Duration */}
      <div className="p-3 rounded-lg bg-gray-900/30 border border-gray-800/50">
        <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 block">
          License Duration
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[7, 30, 90, 365].map((days) => (
            <button
              key={days}
              onClick={() => setLicenseDuration(days)}
              className={`px-2 py-1.5 rounded text-[10px] font-medium transition-all ${
                licenseDuration === days
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-gray-800/30 text-gray-400 border border-gray-700/30 hover:bg-gray-800/50'
              }`}
            >
              {days === 7 ? '7 Days' : days === 30 ? '30 Days' : days === 90 ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
        <div className="mt-2 text-[9px] text-gray-500">
          💰 Pricing: {licenseDuration === 7 ? '$9.99' : licenseDuration === 30 ? '$29.99' : licenseDuration === 90 ? '$79.99' : '$249.99'}
        </div>
      </div>

      {/* Generate API Key */}
      <div className="p-3 rounded-lg bg-gray-900/30 border border-gray-800/50">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] text-gray-500 uppercase tracking-wider">
            API Key Activation
          </label>
          {apiKey && (
            <span className="text-[9px] text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Generated
            </span>
          )}
        </div>

        {!apiKey ? (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateApiKey}
            disabled={isGenerating}
            className="w-full px-3 py-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-medium hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Generating API Key...
              </span>
            ) : (
              '🔑 Generate API Key'
            )}
          </motion.button>
        ) : (
          <div className="space-y-2">
            <div className="p-2 rounded bg-gray-950/50 border border-gray-800/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] text-gray-500">API Key</span>
                <button
                  onClick={copyApiKey}
                  className="text-[9px] text-purple-400 hover:text-purple-300"
                >
                  📋 Copy
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  readOnly
                  className="flex-1 px-2 py-1 rounded bg-gray-900/50 border border-gray-700/50 text-[10px] text-gray-200 font-mono"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="px-2 py-1 rounded bg-gray-800/50 text-[9px] text-gray-400 hover:text-gray-200"
                >
                  {showApiKey ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[9px]">
              <div className="p-2 rounded bg-gray-950/50 border border-gray-800/50">
                <div className="text-gray-500 mb-0.5">Platform</div>
                <div className="text-gray-200 font-medium">{selectedPlatformInfo.name}</div>
              </div>
              <div className="p-2 rounded bg-gray-950/50 border border-gray-800/50">
                <div className="text-gray-500 mb-0.5">Expires</div>
                <div className="text-gray-200 font-medium">
                  {new Date(apiKeyExpiry).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
              <div className="text-[9px] text-yellow-400">
                ⚠️ Save this API key securely. You will need it to activate the software after installation.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Download Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleDownload}
        disabled={!apiKey || downloadStarted}
        className={`w-full px-4 py-3 rounded-lg font-bold text-sm transition-all ${
          apiKey
            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/20'
            : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
        }`}
      >
        {downloadStarted ? (
          <span className="flex items-center justify-center gap-2">
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            Downloading...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            📥 Download {selectedPlatformInfo.name} ({selectedPlatformInfo.size})
          </span>
        )}
      </motion.button>

      {/* Installation Instructions */}
      {apiKey && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
        >
          <div className="text-[10px] text-blue-400 font-bold mb-2">📋 Installation Instructions</div>
          <ol className="space-y-1 text-[9px] text-gray-300">
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold">1.</span>
              Download the installer file
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold">2.</span>
              Run the installer and follow the setup wizard
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold">3.</span>
              When prompted, enter your API key: <span className="font-mono text-blue-300">{apiKey}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold">4.</span>
              Complete the activation process
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400 font-bold">5.</span>
              Launch the application and configure your trading settings
            </li>
          </ol>
        </motion.div>
      )}

      {/* Support Info */}
      <div className="p-3 rounded-lg bg-gray-900/30 border border-gray-800/50">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
          Support & Resources
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="px-2 py-1.5 rounded bg-gray-800/30 border border-gray-700/30 text-[9px] text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 transition-all">
            📖 Documentation
          </button>
          <button className="px-2 py-1.5 rounded bg-gray-800/30 border border-gray-700/30 text-[9px] text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 transition-all">
            💬 Live Chat Support
          </button>
          <button className="px-2 py-1.5 rounded bg-gray-800/30 border border-gray-700/30 text-[9px] text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 transition-all">
            🎥 Video Tutorials
          </button>
          <button className="px-2 py-1.5 rounded bg-gray-800/30 border border-gray-700/30 text-[9px] text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 transition-all">
            🐛 Report Issue
          </button>
        </div>
      </div>
    </div>
  );
}
