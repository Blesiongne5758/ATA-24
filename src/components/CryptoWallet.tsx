import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';

// ============================================================
// CRYPTO BLOCKCHAIN WALLET
// Features: Send, receive, distribute crypto, transaction history
// ============================================================

export default function CryptoWallet() {
  const { cryptoWallet, sendCrypto, distributeCrypto, refreshWallet, addLog } = useTradingStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'send' | 'distribute' | 'history'>('overview');
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [distributeRecipients, setDistributeRecipients] = useState<Array<{ address: string; amount: string }>>([
    { address: '', amount: '' },
  ]);

  const handleSend = () => {
    if (!sendAddress || !sendAmount) {
      addLog({ type: 'error', message: '❌ Please fill all fields' });
      return;
    }
    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      addLog({ type: 'error', message: '❌ Invalid amount' });
      return;
    }
    sendCrypto(sendAddress, amount);
    setSendAddress('');
    setSendAmount('');
  };

  const handleDistribute = () => {
    const recipients = distributeRecipients
      .filter(r => r.address && r.amount)
      .map(r => ({ address: r.address, amount: parseFloat(r.amount) }));
    
    if (recipients.length === 0) {
      addLog({ type: 'error', message: '❌ Please add at least one recipient' });
      return;
    }
    
    distributeCrypto(recipients);
    setDistributeRecipients([{ address: '', amount: '' }]);
  };

  const addRecipient = () => {
    setDistributeRecipients([...distributeRecipients, { address: '', amount: '' }]);
  };

  const removeRecipient = (index: number) => {
    setDistributeRecipients(distributeRecipients.filter((_, i) => i !== index));
  };

  const updateRecipient = (index: number, field: 'address' | 'amount', value: string) => {
    const updated = [...distributeRecipients];
    updated[index][field] = value;
    setDistributeRecipients(updated);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>💎</span> Crypto Wallet
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Blockchain wallet for crypto distribution & transactions
          </p>
        </div>
        <button
          onClick={refreshWallet}
          className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-medium hover:bg-purple-500/30"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Wallet Overview Card */}
      <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Wallet Address</div>
            <div className="text-xs font-mono text-white mt-1">{cryptoWallet.address}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Network</div>
            <div className="text-xs text-white mt-1">{cryptoWallet.network}</div>
          </div>
        </div>
        <div className="pt-3 border-t border-purple-500/20">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">Balance</div>
          <div className="text-3xl font-bold text-white mt-1">
            {cryptoWallet.balance.toFixed(4)} <span className="text-lg text-purple-300">{cryptoWallet.currency}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            ≈ ${(cryptoWallet.balance * 3500).toFixed(2)} USD
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-900/50 rounded-lg border border-gray-800/50">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
            activeTab === 'overview'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab('send')}
          className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
            activeTab === 'send'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          💸 Send
        </button>
        <button
          onClick={() => setActiveTab('distribute')}
          className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
            activeTab === 'distribute'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          📤 Distribute
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
            activeTab === 'history'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          📜 History
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-800/50">
              <div className="text-[10px] text-gray-500">Total Sent</div>
              <div className="text-sm font-bold text-red-400">
                {cryptoWallet.transactions.filter(t => t.type === 'send').reduce((sum, t) => sum + t.amount, 0).toFixed(4)} {cryptoWallet.currency}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-800/50">
              <div className="text-[10px] text-gray-500">Total Received</div>
              <div className="text-sm font-bold text-green-400">
                {cryptoWallet.transactions.filter(t => t.type === 'receive').reduce((sum, t) => sum + t.amount, 0).toFixed(4)} {cryptoWallet.currency}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-800/50">
              <div className="text-[10px] text-gray-500">Transactions</div>
              <div className="text-sm font-bold text-purple-400">{cryptoWallet.transactions.length}</div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Recent Transactions
            </div>
            {cryptoWallet.transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                No transactions yet
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {cryptoWallet.transactions.slice(0, 10).map((tx) => (
                  <div key={tx.id} className="p-2 rounded-lg bg-gray-800/30 border border-gray-700/30">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {tx.type === 'send' ? '💸' : tx.type === 'receive' ? '💰' : '📤'}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white capitalize">{tx.type}</div>
                          <div className="text-[9px] text-gray-400 font-mono">{tx.hash.substring(0, 16)}...</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-bold ${
                          tx.type === 'receive' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {tx.type === 'receive' ? '+' : '-'}{tx.amount.toFixed(4)} {cryptoWallet.currency}
                        </div>
                        <div className="text-[9px] text-gray-500">
                          {tx.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-[9px] text-gray-500">
                      {tx.type === 'receive' ? `From: ${tx.from.substring(0, 20)}...` : `To: ${tx.to.substring(0, 20)}...`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {activeTab === 'send' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 space-y-3"
        >
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Send {cryptoWallet.currency}
          </div>

          <div>
            <label className="text-[10px] text-gray-500 block mb-1">Recipient Address</label>
            <input
              type="text"
              value={sendAddress}
              onChange={(e) => setSendAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-xs text-gray-200 font-mono placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div>
            <label className="text-[10px] text-gray-500 block mb-1">Amount ({cryptoWallet.currency})</label>
            <input
              type="number"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              placeholder="0.00"
              step="0.0001"
              className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-xs text-gray-200 font-mono placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Network Fee</span>
              <span>~0.001 {cryptoWallet.currency}</span>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Available Balance</span>
              <span>{cryptoWallet.balance.toFixed(4)} {cryptoWallet.currency}</span>
            </div>
            {sendAmount && (
              <div className="flex justify-between text-xs text-white pt-1 border-t border-gray-700/30 mt-1">
                <span>Total</span>
                <span>{(parseFloat(sendAmount || '0') + 0.001).toFixed(4)} {cryptoWallet.currency}</span>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSend}
            disabled={!sendAddress || !sendAmount}
            className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💸 Send {cryptoWallet.currency}
          </motion.button>
        </motion.div>
      )}

      {activeTab === 'distribute' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Distribute to Multiple Recipients
            </div>
            <button
              onClick={addRecipient}
              className="px-2 py-1 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] hover:bg-purple-500/30"
            >
              + Add Recipient
            </button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
            {distributeRecipients.map((recipient, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-500">Recipient #{index + 1}</span>
                  {distributeRecipients.length > 1 && (
                    <button
                      onClick={() => removeRecipient(index)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={recipient.address}
                  onChange={(e) => updateRecipient(index, 'address', e.target.value)}
                  placeholder="0x..."
                  className="w-full px-2 py-1.5 rounded bg-gray-900/50 border border-gray-700/50 text-[10px] text-gray-200 font-mono placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
                />
                <input
                  type="number"
                  value={recipient.amount}
                  onChange={(e) => updateRecipient(index, 'amount', e.target.value)}
                  placeholder="Amount"
                  step="0.0001"
                  className="w-full px-2 py-1.5 rounded bg-gray-900/50 border border-gray-700/50 text-[10px] text-gray-200 font-mono placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Total Recipients</span>
              <span>{distributeRecipients.filter(r => r.address && r.amount).length}</span>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>Total Amount</span>
              <span>
                {distributeRecipients
                  .filter(r => r.address && r.amount)
                  .reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0)
                  .toFixed(4)} {cryptoWallet.currency}
              </span>
            </div>
            <div className="flex justify-between text-xs text-white pt-1 border-t border-gray-700/30 mt-1">
              <span>Total with Fees</span>
              <span>
                {(distributeRecipients
                  .filter(r => r.address && r.amount)
                  .reduce((sum, r) => sum + parseFloat(r.amount || '0'), 0) + 
                  distributeRecipients.filter(r => r.address && r.amount).length * 0.001
                ).toFixed(4)} {cryptoWallet.currency}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDistribute}
            disabled={distributeRecipients.filter(r => r.address && r.amount).length === 0}
            className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📤 Distribute {cryptoWallet.currency}
          </motion.button>
        </motion.div>
      )}

      {activeTab === 'history' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4"
        >
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Transaction History
          </div>
          {cryptoWallet.transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-xs">
              <div className="text-4xl mb-2">📜</div>
              <div>No transactions yet</div>
              <div className="text-[10px] text-gray-600 mt-1">Your transaction history will appear here</div>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
              {cryptoWallet.transactions.map((tx) => (
                <div key={tx.id} className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {tx.type === 'send' ? '💸' : tx.type === 'receive' ? '💰' : '📤'}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-white capitalize">{tx.type}</div>
                        <div className="text-[9px] text-gray-400">
                          {tx.timestamp.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${
                        tx.type === 'receive' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {tx.type === 'receive' ? '+' : '-'}{tx.amount.toFixed(4)} {cryptoWallet.currency}
                      </div>
                      <div className="text-[9px] text-gray-500">
                        Fee: {tx.fee.toFixed(4)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 text-[9px]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">From:</span>
                      <span className="text-gray-300 font-mono">{tx.from.substring(0, 20)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">To:</span>
                      <span className="text-gray-300 font-mono">{tx.to.substring(0, 20)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Hash:</span>
                      <span className="text-purple-400 font-mono">{tx.hash.substring(0, 16)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`font-bold ${
                        tx.status === 'completed' ? 'text-green-400' :
                        tx.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {tx.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
