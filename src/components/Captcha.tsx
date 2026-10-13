import { useState, useEffect } from 'react';

interface CaptchaProps {
  onVerify: (success: boolean) => void;
}

export default function Captcha({ onVerify }: CaptchaProps) {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  // Generate random captcha (math or text)
  const generateCaptcha = () => {
    const type = Math.random() > 0.5 ? 'math' : 'text';
    
    if (type === 'math') {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      const operators = ['+', '-', '×'];
      const operator = operators[Math.floor(Math.random() * operators.length)];
      
      let answer: number;
      switch (operator) {
        case '+':
          answer = num1 + num2;
          break;
        case '-':
          answer = num1 - num2;
          break;
        case '×':
          answer = num1 * num2;
          break;
        default:
          answer = num1 + num2;
      }
      
      setCaptchaText(`${num1} ${operator} ${num2} = ?`);
      (window as any).captchaAnswer = answer.toString();
    } else {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let text = '';
      for (let i = 0; i < 6; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setCaptchaText(text);
      (window as any).captchaAnswer = text;
    }
    
    setUserInput('');
    setError('');
    setIsVerified(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleVerify = () => {
    if (userInput.toUpperCase() === (window as any).captchaAnswer) {
      setIsVerified(true);
      setError('');
      onVerify(true);
    } else {
      setError('Captcha tidak valid. Silakan coba lagi.');
      onVerify(false);
      generateCaptcha();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2">
          <div className="text-sm font-mono text-purple-300 tracking-wider select-none" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(147, 51, 234, 0.05) 5px, rgba(147, 51, 234, 0.05) 10px)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '0.2em'
          }}>
            {captchaText}
          </div>
        </div>
        <button
          type="button"
          onClick={generateCaptcha}
          className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-purple-300 hover:border-purple-500/50 transition-all"
          title="Refresh Captcha"
        >
          🔄
        </button>
      </div>
      
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Masukkan jawaban captcha"
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
