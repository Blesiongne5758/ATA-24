import { useState, useEffect, useRef } from 'react';

interface CaptchaProps {
  onVerify: (success: boolean) => void;
}

export default function Captcha({ onVerify }: CaptchaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  // Generate random captcha image using canvas
  const generateCaptchaImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas dimensions
    const width = canvas.width;
    const height = canvas.height;

    // Generate random text (6 characters)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let text = '';
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaAnswer(text);

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add noise dots
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      ctx.fillRect(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 2,
        Math.random() * 2
      );
    }

    // Add random lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // Draw captcha text with distortion
    const fontSize = 32;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const charWidth = width / (text.length + 1);
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const x = charWidth * (i + 1);
      const y = height / 2 + (Math.random() - 0.5) * 10;
      
      // Random rotation
      const rotation = (Math.random() - 0.5) * 0.4;
      
      // Random color (purple/blue theme)
      const colors = ['#a855f7', '#3b82f6', '#06b6d4', '#8b5cf6', '#6366f1'];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      
      // Save context, apply rotation, draw text, restore
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }

    // Add more noise on top
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
      ctx.fillRect(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 3,
        Math.random() * 3
      );
    }

    // Reset input
    setUserInput('');
    setError('');
    setIsVerified(false);
  };

  useEffect(() => {
    generateCaptchaImage();
  }, []);

  const handleVerify = () => {
    if (userInput.toUpperCase() === captchaAnswer) {
      setIsVerified(true);
      setError('');
      onVerify(true);
    } else {
      setError('Captcha tidak valid. Silakan coba lagi.');
      onVerify(false);
      generateCaptchaImage();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <canvas
            ref={canvasRef}
            width={200}
            height={60}
            className="w-full h-[60px] rounded-lg border border-gray-700/50"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        <button
          type="button"
          onClick={generateCaptchaImage}
          className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-purple-300 hover:border-purple-500/50 transition-all"
          title="Refresh Captcha"
          disabled={isVerified}
        >
          🔄
        </button>
      </div>
      
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Masukkan kode captcha"
        className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700/50 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
        disabled={isVerified}
      />
      
      {!isVerified && (
        <button
          type="button"
          onClick={handleVerify}
          disabled={!userInput}
          className="w-full px-3 py-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-sm font-medium hover:bg-purple-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Verifikasi Captcha
        </button>
      )}
      
      {isVerified && (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <span>✅</span>
          <span>Captcha terverifikasi</span>
        </div>
      )}
      
      {error && (
        <div className="text-red-400 text-xs">{error}</div>
      )}
    </div>
  );
}
