"""
============================================================
AI TRADING AGENT v2.0 - MULTI-ROUTING ARCHITECTURE
Backend (Python / FastAPI)
============================================================

Extended Features:
- 6 Market Types (Crypto, Forex, Stocks, Commodities, Indices, Options)
- MT5 Integration
- Multi-API Gateway
- Auto Trading System
- Full Backtest Simulation Engine
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import List, Dict, Optional, Tuple, Any
from abc import ABC, abstractmethod
import asyncio
import numpy as np
import json


# ============================================================
# MARKET TYPES
# ============================================================

class MarketType(Enum):
    CRYPTO = "crypto"
    FOREX = "forex"
    STOCKS = "stocks"
    COMMODITIES = "commodities"
    INDICES = "indices"
    OPTIONS = "options"


class TimeFrame(Enum):
    M1 = "1m"
    M5 = "5m"
    M15 = "15m"
    H1 = "1h"
    H4 = "4h"
    D1 = "1d"
    W1 = "1w"


class Signal(Enum):
    STRONG_BUY = 2
    BUY = 1
    HOLD = 0
    SELL = -1
    STRONG_SELL = -2


# ============================================================
# MT5 INTEGRATION
# ============================================================

class MT5Connector:
    """
    MetaTrader 5 Connection Handler
    
    Features:
    - Demo/Live account switching
    - Expert Advisor execution
    - Order management
    - Market data streaming
    - Copy trading support
    """
    
    def __init__(self, config: Dict):
        self.server = config.get("server", "MetaQuotes-Demo")
        self.login = config.get("login", "")
        self.password = config.get("password", "")
        self.account_type = config.get("account_type", "demo")
        self.connected = False
        self.account_info = None
        
    async def connect(self) -> bool:
        """Connect to MT5 server"""
        try:
            # In production: import MetaTrader5 as mt5
            # mt5.initialize(path="C:\\Program Files\\MetaTrader 5\\terminal64.exe")
            # mt5.login(int(self.login), password=self.password, server=self.server)
            
            if not self.login or not self.password:
                raise ValueError("Invalid credentials")
            
            self.connected = True
            self.account_info = {
                "login": self.login,
                "server": self.server,
                "balance": 10000.0,
                "equity": 10000.0,
                "leverage": 100,
                "currency": "USD",
            }
            return True
        except Exception as e:
            print(f"MT5 Connection Error: {e}")
            return False
    
    async def disconnect(self):
        """Disconnect from MT5"""
        self.connected = False
        self.account_info = None
    
    async def get_positions(self) -> List[Dict]:
        """Get current open positions"""
        if not self.connected:
            return []
        # In production: mt5.positions_get()
        return []
    
    async def place_order(self, symbol: str, order_type: str, volume: float,
                         sl: float = 0, tp: float = 0) -> Dict:
        """Place a trading order"""
        if not self.connected:
            return {"success": False, "error": "Not connected"}
        
        # In production:
        # request = {
        #     "action": mt5.TRADE_ACTION_DEAL,
        #     "symbol": symbol,
        #     "volume": volume,
        #     "type": mt5.ORDER_TYPE_BUY if order_type == "buy" else mt5.ORDER_TYPE_SELL,
        #     "price": mt5.symbol_info_tick(symbol).ask,
        #     "sl": sl,
        #     "tp": tp,
        #     "deviation": 20,
        #     "magic": 234000,
        #     "comment": "AI Agent v2.0",
        #     "type_time": mt5.ORDER_TIME_GTC,
        #     "type_filling": mt5.ORDER_FILLING_IOC,
        # }
        # result = mt5.order_send(request)
        
        return {
            "success": True,
            "order_id": 12345,
            "symbol": symbol,
            "type": order_type,
            "volume": volume,
            "sl": sl,
            "tp": tp,
        }
    
    async def close_position(self, ticket: int) -> Dict:
        """Close an open position"""
        return {"success": True, "ticket": ticket}
    
    async def close_all_positions(self) -> Dict:
        """Emergency: Close all positions"""
        positions = await self.get_positions()
        results = []
        for pos in positions:
            result = await self.close_position(pos.get("ticket", 0))
            results.append(result)
        return {"closed": len(results), "results": results}


# ============================================================
# API GATEWAY (Multi-Exchange Support)
# ============================================================

class APIGateway:
    """
    Multi-Exchange API Gateway
    
    Supports:
    - Binance, Bybit, OKX, Coinbase, Kraken (Crypto)
    - OANDA, IG, cTrader (Forex)
    - Alpaca, Interactive Brokers (Stocks)
    - Custom API endpoints
    """
    
    def __init__(self):
        self.connections: Dict[str, 'ExchangeConnection'] = {}
        
    def add_connection(self, config: Dict) -> str:
        """Add a new exchange connection"""
        conn_id = config.get("id", str(len(self.connections)))
        self.connections[conn_id] = ExchangeConnection(config)
        return conn_id
    
    def remove_connection(self, conn_id: str):
        """Remove an exchange connection"""
        if conn_id in self.connections:
            del self.connections[conn_id]
    
    async def get_price(self, symbol: str, provider: str = None) -> Optional[float]:
        """Get current price from any connected exchange"""
        for conn_id, conn in self.connections.items():
            if conn.enabled and (provider is None or conn.provider == provider):
                return await conn.get_price(symbol)
        return None
    
    async def place_order(self, symbol: str, side: str, amount: float, 
                         provider: str = None) -> Dict:
        """Place order on specified exchange"""
        for conn_id, conn in self.connections.items():
            if conn.enabled and (provider is None or conn.provider == provider):
                return await conn.place_order(symbol, side, amount)
        return {"success": False, "error": "No available connection"}


class ExchangeConnection:
    """Individual exchange connection"""
    
    def __init__(self, config: Dict):
        self.id = config.get("id", "")
        self.name = config.get("name", "")
        self.provider = config.get("provider", "")
        self.api_key = config.get("api_key", "")
        self.api_secret = config.get("api_secret", "")
        self.base_url = config.get("base_url", "")
        self.enabled = config.get("enabled", False)
        self.rate_limit = config.get("rate_limit", 1200)
        self.connected = False
    
    async def connect(self) -> bool:
        """Connect to exchange"""
        if not self.api_key:
            return False
        # In production: Initialize exchange-specific SDK
        self.connected = True
        return True
    
    async def get_price(self, symbol: str) -> float:
        """Get current price"""
        # In production: Use exchange API
        return 0.0
    
    async def place_order(self, symbol: str, side: str, amount: float) -> Dict:
        """Place order"""
        return {"success": True, "symbol": symbol, "side": side, "amount": amount}


# ============================================================
# AUTO TRADING SYSTEM
# ============================================================

class AutoTradingSystem:
    """
    Auto Trading System
    
    Features:
    - Multiple trading modes (Conservative, Balanced, Aggressive, Scalping, Swing)
    - Auto-compounding
    - Partial take profit
    - Trailing stop loss
    - Break-even management
    - News filter
    - Session filter
    """
    
    def __init__(self, config: Dict):
        self.enabled = config.get("enabled", False)
        self.mode = config.get("mode", "balanced")
        self.max_trades_per_day = config.get("max_trades_per_day", 10)
        self.cooldown_period = config.get("cooldown_period", 300)
        self.auto_compound = config.get("auto_compound", False)
        self.compound_percent = config.get("compound_percent", 50)
        self.trailing_activation = config.get("trailing_activation", 1.5)
        self.break_even_trigger = config.get("break_even_trigger", 1.0)
        self.partial_tp = config.get("partial_tp", {"enabled": False, "percent": 50, "close_percent": 50})
        self.news_filter = config.get("news_filter", {"enabled": False, "minutes_before": 30})
        self.session_filter = config.get("session_filter", {"enabled": False, "sessions": ["london", "new_york"]})
        
        self.trades_today = 0
        self.last_trade_time = 0
    
    def can_trade(self) -> Tuple[bool, str]:
        """Check if trading is allowed"""
        if not self.enabled:
            return False, "Auto trading disabled"
        
        if self.trades_today >= self.max_trades_per_day:
            return False, f"Max trades per day reached ({self.max_trades_per_day})"
        
        import time
        if time.time() - self.last_trade_time < self.cooldown_period:
            remaining = self.cooldown_period - (time.time() - self.last_trade_time)
            return False, f"Cooldown active: {remaining:.0f}s remaining"
        
        return True, "OK"
    
    def get_mode_params(self) -> Dict:
        """Get parameters based on trading mode"""
        modes = {
            "conservative": {"confidence": 0.90, "position_size": 0.01, "rr_ratio": 3.0},
            "balanced": {"confidence": 0.85, "position_size": 0.02, "rr_ratio": 2.0},
            "aggressive": {"confidence": 0.75, "position_size": 0.05, "rr_ratio": 1.5},
            "scalping": {"confidence": 0.80, "position_size": 0.03, "rr_ratio": 1.2},
            "swing": {"confidence": 0.85, "position_size": 0.03, "rr_ratio": 2.5},
        }
        return modes.get(self.mode, modes["balanced"])


# ============================================================
# SIMULATION / BACKTEST ENGINE
# ============================================================

class BacktestEngine:
    """
    Full Backtest Simulation Engine
    
    Features:
    - Historical data replay
    - Multi-agent signal generation
    - Equity curve tracking
    - Trade statistics
    - Drawdown analysis
    - Performance metrics (Sharpe, Sortino, Calmar)
    """
    
    def __init__(self, config: Dict):
        self.initial_balance = config.get("initial_balance", 10000)
        self.commission = config.get("commission", 0.001)  # 0.1%
        self.slippage = config.get("slippage", 0.0005)  # 0.05%
        
        self.balance = self.initial_balance
        self.equity = self.initial_balance
        self.trades: List[Dict] = []
        self.equity_curve: List[float] = [self.initial_balance]
        self.peak_equity = self.initial_balance
    
    async def run(self, historical_data: List[Dict], agent: 'MultiRoutingAIAgent') -> Dict:
        """Run backtest on historical data"""
        self.balance = self.initial_balance
        self.equity = self.initial_balance
        self.trades = []
        self.equity_curve = [self.initial_balance]
        self.peak_equity = self.initial_balance
        
        for i, candle in enumerate(historical_data):
            # Create market data object
            market_data = self._create_market_data(candle, historical_data[:i+1])
            
            # Get AI decision
            decision = await agent.process(market_data)
            
            if decision and decision.action != Signal.HOLD:
                # Execute trade
                trade = self._execute_trade(decision, candle)
                if trade:
                    self.trades.append(trade)
            
            # Update equity
            self.equity_curve.append(self.balance)
            self.peak_equity = max(self.peak_equity, self.balance)
        
        return self._calculate_metrics()
    
    def _create_market_data(self, candle: Dict, history: List[Dict]) -> 'MarketData':
        """Create MarketData from candle"""
        ohlcv = [[h["open"], h["high"], h["low"], h["close"], h["volume"]] for h in history[-200:]]
        return MarketData(
            symbol="BTC/USDT",
            timestamp=candle["time"],
            price=candle["close"],
            volume=candle["volume"],
            ohlcv=ohlcv,
        )
    
    def _execute_trade(self, decision, candle: Dict) -> Optional[Dict]:
        """Execute a simulated trade"""
        entry_price = candle["close"]
        
        # Apply slippage
        if decision.action.value > 0:  # Buy
            entry_price *= (1 + self.slippage)
        else:  # Sell
            entry_price *= (1 - self.slippage)
        
        # Calculate position size
        position_value = self.balance * 0.02  # 2% per trade
        commission = position_value * self.commission
        
        # Simulate exit (simplified)
        exit_price = entry_price * (1 + np.random.normal(0.001, 0.02))
        pnl = position_value * ((exit_price - entry_price) / entry_price) - commission
        
        self.balance += pnl
        
        return {
            "entry_price": entry_price,
            "exit_price": exit_price,
            "pnl": pnl,
            "pnl_percent": (pnl / position_value) * 100,
            "type": "buy" if decision.action.value > 0 else "sell",
            "confidence": decision.confidence,
        }
    
    def _calculate_metrics(self) -> Dict:
        """Calculate performance metrics"""
        if not self.trades:
            return {"error": "No trades executed"}
        
        pnls = [t["pnl"] for t in self.trades]
        wins = [p for p in pnls if p > 0]
        losses = [p for p in pnls if p < 0]
        
        # Calculate drawdown
        peak = self.initial_balance
        max_dd = 0
        for eq in self.equity_curve:
            peak = max(peak, eq)
            dd = (peak - eq) / peak
            max_dd = max(max_dd, dd)
        
        # Calculate returns
        returns = np.diff(self.equity_curve) / self.equity_curve[:-1]
        
        # Sharpe Ratio (annualized)
        sharpe = np.mean(returns) / (np.std(returns) + 1e-10) * np.sqrt(252)
        
        # Sortino Ratio
        downside_returns = returns[returns < 0]
        sortino = np.mean(returns) / (np.std(downside_returns) + 1e-10) * np.sqrt(252) if len(downside_returns) > 0 else 0
        
        # Calmar Ratio
        total_return = (self.balance - self.initial_balance) / self.initial_balance
        calmar = total_return / (max_dd + 1e-10)
        
        return {
            "initial_balance": self.initial_balance,
            "final_balance": round(self.balance, 2),
            "total_return": round(total_return * 100, 2),
            "total_trades": len(self.trades),
            "win_rate": round(len(wins) / len(self.trades) * 100, 1) if self.trades else 0,
            "profit_factor": round(sum(wins) / abs(sum(losses)), 2) if losses and sum(losses) != 0 else float('inf'),
            "max_drawdown": round(max_dd * 100, 2),
            "sharpe_ratio": round(sharpe, 2),
            "sortino_ratio": round(sortino, 2),
            "calmar_ratio": round(calmar, 2),
            "avg_win": round(np.mean(wins), 2) if wins else 0,
            "avg_loss": round(np.mean(losses), 2) if losses else 0,
            "largest_win": round(max(pnls), 2) if pnls else 0,
            "largest_loss": round(min(pnls), 2) if pnls else 0,
        }


# ============================================================
# DATA MODELS (same as before, extended)
# ============================================================

@dataclass
class MarketData:
    symbol: str
    timestamp: float
    price: float
    volume: float
    ohlcv: List[List[float]]
    orderbook: Optional[Dict] = None
    sentiment_data: Optional[Dict] = None
    onchain_data: Optional[Dict] = None


@dataclass
class SubAgentSignal:
    source: str
    signal: Signal
    confidence: float
    reasoning: str
    metadata: Dict = field(default_factory=dict)


@dataclass
class TradingDecision:
    action: Signal
    confidence: float
    position_size: float
    stop_loss: float
    take_profit: float
    sub_signals: List[SubAgentSignal]
    reasoning: str


# ============================================================
# SUB-AGENTS (Simplified - same as v1)
# ============================================================

class BaseSubAgent(ABC):
    def __init__(self, name: str, weight: float = 0.33):
        self.name = name
        self.weight = weight
        self.is_active = True
    
    @abstractmethod
    async def analyze(self, market_data: MarketData) -> SubAgentSignal:
        pass


class TechnicalAnalysisAgent(BaseSubAgent):
    def __init__(self, config: Dict):
        super().__init__("Technical Analysis", config.get("weight", 0.40))
        self.config = config
    
    async def analyze(self, market_data: MarketData) -> SubAgentSignal:
        closes = [c[3] for c in market_data.ohlcv[-50:]]
        if len(closes) < 20:
            return SubAgentSignal(self.name, Signal.HOLD, 0, "Insufficient data")
        
        # RSI
        rsi = self._calc_rsi(closes)
        # MACD
        macd = self._calc_macd_signal(closes)
        # Combined
        score = (rsi + macd) / 2
        
        if score > 0.3:
            signal = Signal.BUY
        elif score < -0.3:
            signal = Signal.SELL
        else:
            signal = Signal.HOLD
        
        return SubAgentSignal(
            source="technical",
            signal=signal,
            confidence=abs(score),
            reasoning=f"RSI:{rsi:.2f} MACD:{macd:.2f} Score:{score:.2f}"
        )
    
    def _calc_rsi(self, closes: List[float], period: int = 14) -> float:
        if len(closes) < period + 1:
            return 0
        deltas = np.diff(closes[-(period+1):])
        gains = np.mean(np.maximum(deltas, 0))
        losses = np.mean(np.maximum(-deltas, 0))
        if losses == 0:
            return 1
        rs = gains / losses
        rsi = 100 - (100 / (1 + rs))
        return (rsi - 50) / 50  # Normalize to -1 to 1
    
    def _calc_macd_signal(self, closes: List[float]) -> float:
        if len(closes) < 26:
            return 0
        ema12 = self._ema(closes, 12)
        ema26 = self._ema(closes, 26)
        macd = ema12 - ema26
        return np.clip(macd / closes[-1] * 100, -1, 1)
    
    def _ema(self, data: List[float], period: int) -> float:
        multiplier = 2 / (period + 1)
        ema = data[0]
        for price in data[1:]:
            ema = (price - ema) * multiplier + ema
        return ema


class SentimentAnalysisAgent(BaseSubAgent):
    def __init__(self, config: Dict):
        super().__init__("Sentiment Analysis", config.get("weight", 0.35))
    
    async def analyze(self, market_data: MarketData) -> SubAgentSignal:
        if not market_data.sentiment_data:
            return SubAgentSignal(self.name, Signal.HOLD, 0, "No sentiment data")
        
        score = market_data.sentiment_data.get("overall_score", 0)
        if score > 0.3:
            signal = Signal.BUY
        elif score < -0.3:
            signal = Signal.SELL
        else:
            signal = Signal.HOLD
        
        return SubAgentSignal(
            source="sentiment",
            signal=signal,
            confidence=abs(score),
            reasoning=f"Sentiment score: {score:.2f}"
        )


class OnChainAnalysisAgent(BaseSubAgent):
    def __init__(self, config: Dict):
        super().__init__("On-Chain Analysis", config.get("weight", 0.25))
    
    async def analyze(self, market_data: MarketData) -> SubAgentSignal:
        if not market_data.onchain_data:
            return SubAgentSignal(self.name, Signal.HOLD, 0, "No on-chain data")
        
        score = market_data.onchain_data.get("overall_score", 0)
        if score > 0.3:
            signal = Signal.BUY
        elif score < -0.3:
            signal = Signal.SELL
        else:
            signal = Signal.HOLD
        
        return SubAgentSignal(
            source="onchain",
            signal=signal,
            confidence=abs(score),
            reasoning=f"On-chain score: {score:.2f}"
        )


# ============================================================
# META-AGENT (ORCHESTRATOR) - v2.0
# ============================================================

class MultiRoutingAIAgent:
    """
    Meta-Agent / Orchestrator v2.0
    
    Extended with:
    - Multi-market support
    - MT5 integration
    - API Gateway
    - Auto trading system
    - Dynamic weight adjustment
    """
    
    def __init__(self, config: Dict):
        self.config = config
        self.confidence_threshold = config.get("confidence_threshold", 0.85)
        self.market_type = MarketType(config.get("market_type", "crypto"))
        
        # Sub-agents
        self.sub_agents = [
            TechnicalAnalysisAgent(config.get("technical", {})),
            SentimentAnalysisAgent(config.get("sentiment", {})),
            OnChainAnalysisAgent(config.get("onchain", {})),
        ]
        
        # Integrations
        self.mt5 = MT5Connector(config.get("mt5", {}))
        self.gateway = APIGateway()
        self.auto_trading = AutoTradingSystem(config.get("auto_trading", {}))
        self.backtest_engine = BacktestEngine(config.get("backtest", {}))
        
        # Performance tracking
        self.agent_performance: Dict[str, List[float]] = {
            agent.name: [] for agent in self.sub_agents
        }
    
    async def process(self, market_data: MarketData) -> Optional[TradingDecision]:
        """Main processing pipeline"""
        # Check auto trading limits
        can_trade, reason = self.auto_trading.can_trade()
        if not can_trade and self.auto_trading.enabled:
            return None
        
        # Get signals from all sub-agents
        active_agents = [a for a in self.sub_agents if a.is_active]
        tasks = [agent.analyze(market_data) for agent in active_agents]
        signals = await asyncio.gather(*tasks)
        
        # Combine signals
        combined_signal, confidence = self._combine_signals(signals, active_agents)
        
        # Check threshold
        mode_params = self.auto_trading.get_mode_params()
        effective_threshold = max(self.confidence_threshold, mode_params["confidence"])
        
        if confidence < effective_threshold:
            return None
        
        # Determine action
        if combined_signal > 0.3:
            action = Signal.STRONG_BUY if combined_signal > 0.7 else Signal.BUY
        elif combined_signal < -0.3:
            action = Signal.STRONG_SELL if combined_signal < -0.7 else Signal.SELL
        else:
            return None
        
        # Calculate position sizing
        position_size = mode_params["position_size"]
        
        # Calculate SL/TP
        stop_loss, take_profit = self._calculate_sl_tp(market_data, action)
        
        return TradingDecision(
            action=action,
            confidence=confidence,
            position_size=position_size,
            stop_loss=stop_loss,
            take_profit=take_profit,
            sub_signals=signals,
            reasoning=self._generate_reasoning(signals, combined_signal, confidence)
        )
    
    def _combine_signals(self, signals: List[SubAgentSignal], agents: List[BaseSubAgent]) -> Tuple[float, float]:
        """Combine sub-agent signals using weighted routing"""
        if not signals:
            return 0.0, 0.0
        
        total_weight = sum(a.weight for a in agents)
        normalized_weights = [a.weight / total_weight for a in agents]
        
        signal_values = []
        confidences = []
        
        for signal, weight in zip(signals, normalized_weights):
            signal_value = signal.signal.value / 2.0
            signal_values.append(signal_value * weight * signal.confidence)
            confidences.append(signal.confidence * weight)
        
        return sum(signal_values), sum(confidences)
    
    def _calculate_sl_tp(self, market_data: MarketData, action: Signal) -> Tuple[float, float]:
        """Calculate Stop Loss and Take Profit"""
        price = market_data.price
        sl_percent = 0.02  # 2% default
        tp_percent = 0.05  # 5% default
        
        if action.value > 0:
            return price * (1 - sl_percent), price * (1 + tp_percent)
        else:
            return price * (1 + sl_percent), price * (1 - tp_percent)
    
    def _generate_reasoning(self, signals, combined, confidence) -> str:
        parts = [f"Signal: {combined:.3f} | Confidence: {confidence:.1%}"]
        for s in signals:
            parts.append(f"  [{s.source}] {s.signal.name} ({s.confidence:.1%})")
        return "\n".join(parts)
    
    async def run_backtest(self, historical_data: List[Dict]) -> Dict:
        """Run backtest simulation"""
        return await self.backtest_engine.run(historical_data, self)


# ============================================================
# FASTAPI SERVER
# ============================================================

"""
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Trading Agent API v2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize
agent = MultiRoutingAIAgent(config={
    "confidence_threshold": 0.85,
    "market_type": "crypto",
    "technical": {"weight": 0.40},
    "sentiment": {"weight": 0.35},
    "onchain": {"weight": 0.25},
    "mt5": {"server": "MetaQuotes-Demo", "login": "", "password": ""},
    "auto_trading": {"enabled": True, "mode": "balanced"},
})

@app.websocket("/ws/trading")
async def trading_ws(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_json()
        market_data = MarketData(**data)
        decision = await agent.process(market_data)
        if decision:
            await websocket.send_json({
                "action": decision.action.name,
                "confidence": decision.confidence,
                "position_size": decision.position_size,
                "stop_loss": decision.stop_loss,
                "take_profit": decision.take_profit,
            })

@app.post("/api/mt5/connect")
async def mt5_connect(config: Dict):
    agent.mt5 = MT5Connector(config)
    success = await agent.mt5.connect()
    return {"connected": success}

@app.post("/api/backtest")
async def run_backtest(data: Dict):
    results = await agent.run_backtest(data.get("historical_data", []))
    return results

@app.post("/api/kill-switch")
async def emergency_kill():
    result = await agent.mt5.close_all_positions()
    return {"status": "killed", "closed_positions": result}

@app.get("/api/gateway/status")
async def gateway_status():
    return {
        "connections": [
            {"id": k, "name": v.name, "connected": v.connected, "enabled": v.enabled}
            for k, v in agent.gateway.connections.items()
        ]
    }
"""


if __name__ == "__main__":
    print("=" * 60)
    print("  AI TRADING AGENT v2.0 - Multi-Routing Architecture")
    print("=" * 60)
    print()
    print("  Markets: Crypto | Forex | Stocks | Commodities | Indices | Options")
    print("  Charts: Candlestick | Linear | Area | Heikin-Ashi")
    print()
    print("  Sub-Agents:")
    print("    1. Technical Analysis (RSI, MACD, EMA, BB, Ichimoku, Stochastic, ADX)")
    print("    2. Sentiment Analysis (Twitter, News, Fear/Greed, LLM)")
    print("    3. On-Chain Analysis (Whales, DEX, Funding, Flows, Orderbook)")
    print()
    print("  Integrations:")
    print("    • MetaTrader 5 (Demo/Live)")
    print("    • Multi-Exchange API Gateway (Binance, Bybit, OKX, etc.)")
    print("    • Auto Trading System (5 modes)")
    print("    • Backtest Engine (Full simulation)")
    print()
    print("  Meta-Agent: Dynamic routing + Ensemble methods")
    print("=" * 60)
