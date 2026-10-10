"""
============================================================
AI TRADING AGENT - MULTI-ROUTING ARCHITECTURE
Backend Skeleton (Python / FastAPI)
============================================================

This module defines the core AI architecture for the trading agent.
It implements a Multi-Routing system where multiple sub-agents
analyze different data sources, and a Meta-Agent (Orchestrator)
combines their outputs to make final trading decisions.

Architecture:
┌─────────────────────────────────────────────────┐
│              META-AGENT (Orchestrator)           │
│  Combines signals → Final Decision (Buy/Sell)   │
├─────────┬──────────────┬────────────────────────┤
│ Sub-1   │   Sub-2      │      Sub-3             │
│Technical│  Sentiment   │    On-Chain            │
│ Analysis│  Analysis    │    Analysis            │
├─────────┼──────────────┼────────────────────────┤
│ Chart   │ Twitter/News │  DEX Volume            │
│ RSI/MACD│ LLM/BERT    │  Whale Tracking         │
│ Pattern │ Fear/Greed   │  Order Flow            │
└─────────┴──────────────┴────────────────────────┘
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import List, Dict, Optional, Tuple
import asyncio
import numpy as np
from abc import ABC, abstractmethod


# ============================================================
# DATA MODELS
# ============================================================

class Signal(Enum):
    """Trading signal types"""
    STRONG_BUY = 2
    BUY = 1
    HOLD = 0
    SELL = -1
    STRONG_SELL = -2


class DataSource(Enum):
    """Data source types for multi-routing"""
    TECHNICAL = "technical"
    SENTIMENT = "sentiment"
    ONCHAIN = "onchain"


@dataclass
class SubAgentSignal:
    """Output from a sub-agent"""
    source: DataSource
    signal: Signal
    confidence: float  # 0.0 to 1.0
    reasoning: str
    metadata: Dict = field(default_factory=dict)


@dataclass
class TradingDecision:
    """Final decision from the Meta-Agent"""
    action: Signal
    confidence: float
    position_size: float
    stop_loss: float
    take_profit: float
    sub_signals: List[SubAgentSignal]
    reasoning: str


@dataclass
class MarketData:
    """Unified market data structure"""
    symbol: str
    timestamp: float
    price: float
    volume: float
    ohlcv: List[List[float]]  # [[open, high, low, close, volume], ...]
    orderbook: Optional[Dict] = None
    sentiment_data: Optional[Dict] = None
    onchain_data: Optional[Dict] = None


# ============================================================
# BASE SUB-AGENT CLASS
# ============================================================

class BaseSubAgent(ABC):
    """
    Abstract base class for all sub-agents.
    Each sub-agent specializes in analyzing one data source.
    """
    
    def __init__(self, name: str, weight: float = 0.33):
        self.name = name
        self.weight = weight  # Routing weight (0.0 to 1.0)
        self.is_active = True
    
    @abstractmethod
    async def analyze(self, market_data: MarketData) -> SubAgentSignal:
        """
        Analyze market data and return a trading signal.
        Must be implemented by each sub-agent.
        """
        pass
    
    @abstractmethod
    async def train(self, historical_data: List[MarketData]) -> float:
        """
        Train/update the sub-agent model.
        Returns training loss/metric.
        """
        pass
    
    def deactivate(self):
        """Deactivate this sub-agent (e.g., if data source unavailable)"""
        self.is_active = False
    
    def activate(self):
        """Reactivate this sub-agent"""
        self.is_active = True


# ============================================================
# SUB-AGENT 1: TECHNICAL ANALYSIS
# ============================================================

class TechnicalAnalysisAgent(BaseSubAgent):
    """
    Sub-Agent 1: Technical Analysis
    Analyzes price action, indicators, and chart patterns.
    
    Indicators:
    - RSI (Relative Strength Index)
    - MACD (Moving Average Convergence Divergence)
    - EMA (Exponential Moving Averages)
    - Bollinger Bands
    - Ichimoku Cloud
    - AI Pattern Recognition (CNN-based)
    - Volume Profile Analysis
    """
    
    def __init__(self, config: Dict):
        super().__init__("Technical Analysis", weight=config.get("weight", 0.40))
        self.config = config
        self.rsi_period = config.get("rsi_period", 14)
        self.macd_fast = config.get("macd_fast", 12)
        self.macd_slow = config.get("macd_slow", 26)
        self.ema_periods = config.get("ema_periods", [9, 21, 50, 200])
        self.bb_period = config.get("bb_period", 20)
        self.bb_std = config.get("bb_std", 2.0)
        
        # AI Pattern Recognition Model (placeholder)
        self.pattern_model = None  # Would load a trained CNN model
        
    async def analyze(self, market_data: MarketData) -> SubAgentSignal:
        """Run all technical indicators and combine into a signal"""
        
        # Calculate individual indicators
        rsi_signal = self._calculate_rsi(market_data.ohlcv)
        macd_signal = self._calculate_macd(market_data.ohlcv)
        ema_signal = self._calculate_ema_cross(market_data.ohlcv)
        bb_signal = self._calculate_bollinger(market_data.ohlcv)
        pattern_signal = await self._detect_patterns(market_data.ohlcv)
        
        # Combine signals with weighted average
        signals = [rsi_signal, macd_signal, ema_signal, bb_signal, pattern_signal]
        weights = [0.2, 0.2, 0.2, 0.15, 0.25]
        
        combined_score = sum(s * w for s, w in zip(signals, weights))
        
        # Determine final signal
        if combined_score > 0.6:
            signal = Signal.STRONG_BUY
        elif combined_score > 0.2:
            signal = Signal.BUY
        elif combined_score < -0.6:
            signal = Signal.STRONG_SELL
        elif combined_score < -0.2:
            signal = Signal.SELL
        else:
            signal = Signal.HOLD
        
        confidence = abs(combined_score)
        
        return SubAgentSignal(
            source=DataSource.TECHNICAL,
            signal=signal,
            confidence=min(confidence, 1.0),
            reasoning=f"Technical score: {combined_score:.3f} | RSI:{rsi_signal:.2f} MACD:{macd_signal:.2f} EMA:{ema_signal:.2f}",
            metadata={
                "rsi": rsi_signal,
                "macd": macd_signal,
                "ema_cross": ema_signal,
                "bollinger": bb_signal,
                "patterns": pattern_signal,
            }
        )
    
    def _calculate_rsi(self, ohlcv: List[List[float]]) -> float:
        """Calculate RSI and return normalized signal (-1 to 1)"""
        closes = [candle[3] for candle in ohlcv[-(self.rsi_period + 1):]]
        if len(closes) < 2:
            return 0.0
        
        deltas = np.diff(closes)
        gains = np.where(deltas > 0, deltas, 0)
        losses = np.where(deltas < 0, -deltas, 0)
        
        avg_gain = np.mean(gains) if len(gains) > 0 else 0
        avg_loss = np.mean(losses) if len(losses) > 0 else 0.001
        
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        
        # Normalize to signal: oversold = bullish (+), overbought = bearish (-)
        overbought = self.config.get("rsi_overbought", 70)
        oversold = self.config.get("rsi_oversold", 30)
        
        if rsi > overbought:
            return -(rsi - overbought) / (100 - overbought)  # Bearish
        elif rsi < oversold:
            return (oversold - rsi) / oversold  # Bullish
        else:
            return 0.0
    
    def _calculate_macd(self, ohlcv: List[List[float]]) -> float:
        """Calculate MACD signal"""
        closes = [candle[3] for candle in ohlcv]
        if len(closes) < self.macd_slow:
            return 0.0
        
        # Simplified MACD calculation
        fast_ema = self._ema(closes, self.macd_fast)
        slow_ema = self._ema(closes, self.macd_slow)
        macd_line = fast_ema - slow_ema
        
        # Normalize
        return np.clip(macd_line / (closes[-1] * 0.01), -1, 1)
    
    def _calculate_ema_cross(self, ohlcv: List[List[float]]) -> float:
        """Detect EMA crossovers"""
        closes = [candle[3] for candle in ohlcv]
        if len(closes) < max(self.ema_periods):
            return 0.0
        
        ema_9 = self._ema(closes, self.ema_periods[0])
        ema_21 = self._ema(closes, self.ema_periods[1])
        
        # Golden cross (bullish) or death cross (bearish)
        diff = (ema_9 - ema_21) / closes[-1]
        return np.clip(diff * 50, -1, 1)
    
    def _calculate_bollinger(self, ohlcv: List[List[float]]) -> float:
        """Calculate Bollinger Bands signal"""
        closes = [candle[3] for candle in ohlcv[-self.bb_period:]]
        if len(closes) < self.bb_period:
            return 0.0
        
        mean = np.mean(closes)
        std = np.std(closes)
        upper = mean + self.bb_std * std
        lower = mean - self.bb_std * std
        
        current_price = closes[-1]
        
        # Position within bands: -1 (at lower) to +1 (at upper)
        band_width = upper - lower
        if band_width == 0:
            return 0.0
        
        position = (current_price - lower) / band_width
        
        # Mean reversion: buy at lower, sell at upper
        return -(position - 0.5) * 2
    
    async def _detect_patterns(self, ohlcv: List[List[float]]) -> float:
        """AI-based pattern recognition (placeholder for CNN model)"""
        # In production, this would use a trained neural network
        # to detect patterns like Head & Shoulders, Double Top, etc.
        return 0.0  # Placeholder
    
    def _ema(self, data: List[float], period: int) -> float:
        """Calculate Exponential Moving Average"""
        multiplier = 2 / (period + 1)
        ema = data[0]
        for price in data[1:]:
            ema = (price - ema) * multiplier + ema
        return ema
    
    async def train(self, historical_data: List[MarketData]) -> float:
        """Train pattern recognition model on historical data"""
        # Placeholder for model training
        return 0.0


# ============================================================
# SUB-AGENT 2: SENTIMENT ANALYSIS
# ============================================================

class SentimentAnalysisAgent(BaseSubAgent):
    """
    Sub-Agent 2: Sentiment Analysis
    Analyzes social media, news, and market sentiment.
    
    Sources:
    - Twitter/X crypto sentiment
    - Reddit (r/cryptocurrency, r/bitcoin)
    - News headlines (NLP)
    - Fear & Greed Index
    - LLM-based analysis (GPT-4 / Fine-tuned BERT)
    """
    
    def __init__(self, config: Dict):
        super().__init__("Sentiment Analysis", weight=config.get("weight", 0.35))
        self.config = config
        self.llm_model = None  # Would load GPT-4 or fine-tuned BERT
        self.sentiment_history: List[float] = []
        
    async def analyze(self, market_data: MarketData) -> SubAgentSignal:
        """Analyze sentiment from multiple sources"""
        
        if market_data.sentiment_data is None:
            return SubAgentSignal(
                source=DataSource.SENTIMENT,
                signal=Signal.HOLD,
                confidence=0.0,
                reasoning="No sentiment data available"
            )
        
        # Analyze different sentiment sources
        twitter_score = self._analyze_twitter(market_data.sentiment_data)
        news_score = self._analyze_news(market_data.sentiment_data)
        fear_greed = self._analyze_fear_greed(market_data.sentiment_data)
        llm_score = await self._llm_analysis(market_data.sentiment_data)
        
        # Combine sentiment scores
        weights = [0.3, 0.25, 0.15, 0.3]  # Twitter, News, F&G, LLM
        scores = [twitter_score, news_score, fear_greed, llm_score]
        combined = sum(s * w for s, w in zip(scores, weights))
        
        # Determine signal
        if combined > 0.5:
            signal = Signal.STRONG_BUY
        elif combined > 0.15:
            signal = Signal.BUY
        elif combined < -0.5:
            signal = Signal.STRONG_SELL
        elif combined < -0.15:
            signal = Signal.SELL
        else:
            signal = Signal.HOLD
        
        self.sentiment_history.append(combined)
        
        return SubAgentSignal(
            source=DataSource.SENTIMENT,
            signal=signal,
            confidence=abs(combined),
            reasoning=f"Sentiment score: {combined:.3f} | Twitter:{twitter_score:.2f} News:{news_score:.2f} LLM:{llm_score:.2f}",
            metadata={
                "twitter": twitter_score,
                "news": news_score,
                "fear_greed": fear_greed,
                "llm_sentiment": llm_score,
            }
        )
    
    def _analyze_twitter(self, data: Dict) -> float:
        """Analyze Twitter/X sentiment"""
        # Placeholder: would use Twitter API + NLP model
        return data.get("twitter_score", 0.0)
    
    def _analyze_news(self, data: Dict) -> float:
        """Analyze news sentiment"""
        # Placeholder: would use news API + NLP model
        return data.get("news_score", 0.0)
    
    def _analyze_fear_greed(self, data: Dict) -> float:
        """Analyze Fear & Greed Index"""
        fg_index = data.get("fear_greed_index", 50)
        # Normalize: 0 (extreme fear = contrarian buy) to 100 (extreme greed = contrarian sell)
        return (fg_index - 50) / 50  # -1 to 1
    
    async def _llm_analysis(self, data: Dict) -> float:
        """Use LLM for deep sentiment analysis"""
        # Placeholder: would call GPT-4 API or local model
        return data.get("llm_score", 0.0)
    
    async def train(self, historical_data: List[MarketData]) -> float:
        """Fine-tune sentiment model"""
        return 0.0


# ============================================================
# SUB-AGENT 3: ON-CHAIN ANALYSIS
# ============================================================

class OnChainAnalysisAgent(BaseSubAgent):
    """
    Sub-Agent 3: On-Chain Analysis
    Analyzes blockchain data and DeFi metrics.
    
    Metrics:
    - DEX volume & liquidity
    - Whale wallet tracking
    - Order book imbalance
    - Funding rates (perpetual futures)
    - Token inflows/outflows
    - Network activity (active addresses, tx volume)
    """
    
    def __init__(self, config: Dict):
        super().__init__("On-Chain Analysis", weight=config.get("weight", 0.25))
        self.config = config
        
    async def analyze(self, market_data: MarketData) -> SubAgentSignal:
        """Analyze on-chain data"""
        
        if market_data.onchain_data is None:
            return SubAgentSignal(
                source=DataSource.ONCHAIN,
                signal=Signal.HOLD,
                confidence=0.0,
                reasoning="No on-chain data available"
            )
        
        # Analyze different on-chain metrics
        whale_score = self._analyze_whale_activity(market_data.onchain_data)
        dex_score = self._analyze_dex_volume(market_data.onchain_data)
        funding_score = self._analyze_funding_rates(market_data.onchain_data)
        flow_score = self._analyze_token_flows(market_data.onchain_data)
        ob_imbalance = self._analyze_orderbook(market_data.onchain_data)
        
        # Combine on-chain scores
        weights = [0.25, 0.2, 0.2, 0.15, 0.2]
        scores = [whale_score, dex_score, funding_score, flow_score, ob_imbalance]
        combined = sum(s * w for s, w in zip(scores, weights))
        
        # Determine signal
        if combined > 0.5:
            signal = Signal.STRONG_BUY
        elif combined > 0.15:
            signal = Signal.BUY
        elif combined < -0.5:
            signal = Signal.STRONG_SELL
        elif combined < -0.15:
            signal = Signal.SELL
        else:
            signal = Signal.HOLD
        
        return SubAgentSignal(
            source=DataSource.ONCHAIN,
            signal=signal,
            confidence=abs(combined),
            reasoning=f"On-chain score: {combined:.3f} | Whales:{whale_score:.2f} DEX:{dex_score:.2f} Funding:{funding_score:.2f}",
            metadata={
                "whale_activity": whale_score,
                "dex_volume": dex_score,
                "funding_rate": funding_score,
                "token_flows": flow_score,
                "orderbook_imbalance": ob_imbalance,
            }
        )
    
    def _analyze_whale_activity(self, data: Dict) -> float:
        """Track whale wallet movements"""
        # Positive = accumulation, Negative = distribution
        return data.get("whale_score", 0.0)
    
    def _analyze_dex_volume(self, data: Dict) -> float:
        """Analyze DEX volume changes"""
        volume_change = data.get("dex_volume_change", 0.0)
        return np.clip(volume_change / 100, -1, 1)
    
    def _analyze_funding_rates(self, data: Dict) -> float:
        """Analyze perpetual futures funding rates"""
        funding = data.get("funding_rate", 0.0)
        # High positive funding = overleveraged long = contrarian bearish
        return np.clip(-funding * 100, -1, 1)
    
    def _analyze_token_flows(self, data: Dict) -> float:
        """Analyze exchange inflows/outflows"""
        net_flow = data.get("net_exchange_flow", 0.0)
        # Positive outflow from exchanges = bullish (holding)
        return np.clip(net_flow, -1, 1)
    
    def _analyze_orderbook(self, data: Dict) -> float:
        """Analyze order book imbalance"""
        imbalance = data.get("orderbook_imbalance", 0.0)
        return np.clip(imbalance, -1, 1)
    
    async def train(self, historical_data: List[MarketData]) -> float:
        """Update on-chain analysis models"""
        return 0.0


# ============================================================
# META-AGENT (ORCHESTRATOR)
# ============================================================

class MultiRoutingAIAgent:
    """
    Meta-Agent / Orchestrator
    
    This is the "brain" that coordinates all sub-agents and makes
    the final trading decision. It implements the Multi-Routing
    Architecture where:
    
    1. Market data is routed to all active sub-agents in parallel
    2. Each sub-agent returns a signal with confidence score
    3. The orchestrator combines signals using routing weights
    4. Final decision is made only if combined confidence > threshold
    5. Position sizing is calculated based on risk management rules
    
    The routing weights determine how much each sub-agent's opinion
    influences the final decision. These can be dynamically adjusted
    based on each sub-agent's historical accuracy.
    """
    
    def __init__(self, config: Dict):
        self.config = config
        self.confidence_threshold = config.get("confidence_threshold", 0.85)
        
        # Initialize sub-agents
        self.sub_agents: List[BaseSubAgent] = [
            TechnicalAnalysisAgent(config.get("technical", {})),
            SentimentAnalysisAgent(config.get("sentiment", {})),
            OnChainAnalysisAgent(config.get("onchain", {})),
        ]
        
        # Performance tracking for dynamic weight adjustment
        self.agent_performance: Dict[str, List[float]] = {
            agent.name: [] for agent in self.sub_agents
        }
        
        # Risk management
        self.max_position_size = config.get("max_position_size", 0.02)  # 2% of portfolio
        self.max_daily_drawdown = config.get("max_daily_drawdown", 0.05)  # 5%
        self.max_open_positions = config.get("max_open_positions", 3)
        self.current_positions = 0
        self.daily_pnl = 0.0
        
    async def process(self, market_data: MarketData) -> Optional[TradingDecision]:
        """
        Main processing pipeline:
        1. Route data to all sub-agents (parallel)
        2. Collect signals
        3. Combine using weighted routing
        4. Apply risk management filters
        5. Return final decision or None (no trade)
        """
        
        # Check if trading is allowed
        if not self._can_trade():
            return None
        
        # Step 1: Route to all active sub-agents in parallel
        active_agents = [agent for agent in self.sub_agents if agent.is_active]
        
        if not active_agents:
            return None
        
        # Execute all sub-agents concurrently
        tasks = [agent.analyze(market_data) for agent in active_agents]
        signals: List[SubAgentSignal] = await asyncio.gather(*tasks)
        
        # Step 2: Combine signals using routing weights
        combined_signal, confidence = self._combine_signals(signals, active_agents)
        
        # Step 3: Check confidence threshold
        if confidence < self.confidence_threshold:
            return None  # Not confident enough to trade
        
        # Step 4: Determine action
        if combined_signal > 0.3:
            action = Signal.BUY if combined_signal < 0.7 else Signal.STRONG_BUY
        elif combined_signal < -0.3:
            action = Signal.SELL if combined_signal > -0.7 else Signal.STRONG_SELL
        else:
            return None  # HOLD - no clear direction
        
        # Step 5: Calculate position sizing
        position_size = self._calculate_position_size(confidence, market_data)
        
        # Step 6: Calculate stop loss and take profit
        stop_loss, take_profit = self._calculate_sl_tp(market_data, action)
        
        # Step 7: Build final decision
        decision = TradingDecision(
            action=action,
            confidence=confidence,
            position_size=position_size,
            stop_loss=stop_loss,
            take_profit=take_profit,
            sub_signals=signals,
            reasoning=self._generate_reasoning(signals, combined_signal, confidence)
        )
        
        return decision
    
    def _combine_signals(self, signals: List[SubAgentSignal], 
                         agents: List[BaseSubAgent]) -> Tuple[float, float]:
        """
        Combine sub-agent signals using weighted routing.
        
        The routing weights can be:
        - Static: Pre-defined in config
        - Dynamic: Adjusted based on historical performance
        
        Returns: (combined_signal_score, confidence)
        """
        if not signals:
            return 0.0, 0.0
        
        # Normalize weights
        total_weight = sum(agent.weight for agent in agents)
        normalized_weights = [agent.weight / total_weight for agent in agents]
        
        # Calculate weighted signal
        signal_values = []
        confidences = []
        
        for signal, weight in zip(signals, normalized_weights):
            # Convert signal enum to numeric value
            signal_value = signal.signal.value / 2.0  # Normalize to -1 to 1
            signal_values.append(signal_value * weight * signal.confidence)
            confidences.append(signal.confidence * weight)
        
        combined_signal = sum(signal_values)
        combined_confidence = sum(confidences)
        
        return combined_signal, combined_confidence
    
    def _calculate_position_size(self, confidence: float, market_data: MarketData) -> float:
        """
        Calculate position size based on:
        - Confidence level
        - Risk management method (Fixed, Kelly, Volatility-based)
        - Current portfolio state
        """
        method = self.config.get("position_sizing_method", "kelly")
        
        if method == "fixed":
            return self.config.get("fixed_percent", 0.02)
        
        elif method == "kelly":
            # Kelly Criterion: f* = (bp - q) / b
            # Where b = odds, p = win probability, q = loss probability
            win_rate = confidence  # Using confidence as proxy for win rate
            kelly_fraction = self.config.get("kelly_fraction", 0.5)
            kelly = (win_rate - (1 - win_rate)) / 1.0  # Assuming 1:1 odds
            return max(0, kelly * kelly_fraction * self.max_position_size)
        
        elif method == "volatility":
            # Volatility-based: reduce size when volatility is high
            closes = [candle[3] for candle in market_data.ohlcv[-20:]]
            if len(closes) > 1:
                returns = np.diff(np.log(closes))
                volatility = np.std(returns)
                vol_multiplier = self.config.get("volatility_multiplier", 1.0)
                size = self.max_position_size * vol_multiplier / (volatility * 100 + 0.01)
                return min(size, self.max_position_size)
        
        return self.max_position_size
    
    def _calculate_sl_tp(self, market_data: MarketData, action: Signal) -> Tuple[float, float]:
        """Calculate Stop Loss and Take Profit levels"""
        current_price = market_data.price
        sl_method = self.config.get("stop_loss_method", "atr")
        tp_percent = self.config.get("take_profit_percent", 0.05)
        
        if sl_method == "fixed":
            sl_percent = self.config.get("fixed_sl_percent", 0.02)
        elif sl_method == "atr":
            # Calculate ATR
            atr = self._calculate_atr(market_data.ohlcv)
            atr_multiplier = self.config.get("atr_multiplier", 1.5)
            sl_percent = (atr * atr_multiplier) / current_price
        elif sl_method == "trailing":
            sl_percent = self.config.get("trailing_percent", 0.03)
        else:
            sl_percent = 0.02
        
        if action.value > 0:  # BUY
            stop_loss = current_price * (1 - sl_percent)
            take_profit = current_price * (1 + tp_percent)
        else:  # SELL
            stop_loss = current_price * (1 + sl_percent)
            take_profit = current_price * (1 - tp_percent)
        
        return stop_loss, take_profit
    
    def _calculate_atr(self, ohlcv: List[List[float]], period: int = 14) -> float:
        """Calculate Average True Range"""
        if len(ohlcv) < period + 1:
            return 0.0
        
        true_ranges = []
        for i in range(1, len(ohlcv)):
            high = ohlcv[i][1]
            low = ohlcv[i][2]
            prev_close = ohlcv[i-1][3]
            tr = max(high - low, abs(high - prev_close), abs(low - prev_close))
            true_ranges.append(tr)
        
        return np.mean(true_ranges[-period:])
    
    def _can_trade(self) -> bool:
        """Check if trading is allowed based on risk limits"""
        if self.current_positions >= self.max_open_positions:
            return False
        if abs(self.daily_pnl) >= self.max_daily_drawdown:
            return False
        return True
    
    def _generate_reasoning(self, signals: List[SubAgentSignal], 
                           combined: float, confidence: float) -> str:
        """Generate human-readable reasoning for the decision"""
        parts = [f"Combined signal: {combined:.3f} | Confidence: {confidence:.1%}"]
        for signal in signals:
            parts.append(f"  [{signal.source.value}] {signal.signal.name} ({signal.confidence:.1%})")
        return "\n".join(parts)
    
    async def update_weights(self):
        """
        Dynamically adjust routing weights based on sub-agent performance.
        Agents with better historical accuracy get higher weights.
        """
        for agent in self.sub_agents:
            perf = self.agent_performance.get(agent.name, [])
            if len(perf) >= 10:  # Need enough data points
                recent_accuracy = np.mean(perf[-10:])
                # Adjust weight: higher accuracy = higher weight
                agent.weight = np.clip(recent_accuracy * 0.5 + 0.1, 0.1, 0.6)
        
        # Normalize weights to sum to 1.0
        total = sum(a.weight for a in self.sub_agents)
        for agent in self.sub_agents:
            agent.weight /= total


# ============================================================
# FASTAPI SERVER (Entry Point)
# ============================================================

"""
# To run the server:
# pip install fastapi uvicorn websockets

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Trading Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the AI Agent
agent = MultiRoutingAIAgent(config={
    "confidence_threshold": 0.85,
    "technical": {"weight": 0.40},
    "sentiment": {"weight": 0.35},
    "onchain": {"weight": 0.25},
    "position_sizing_method": "kelly",
    "kelly_fraction": 0.5,
    "stop_loss_method": "atr",
    "atr_multiplier": 1.5,
    "take_profit_percent": 0.05,
    "max_daily_drawdown": 0.05,
    "max_open_positions": 3,
})

@app.websocket("/ws/trading")
async def trading_websocket(websocket: WebSocket):
    await websocket.accept()
    
    while True:
        # Receive market data
        data = await websocket.receive_json()
        market_data = MarketData(**data)
        
        # Process through AI agent
        decision = await agent.process(market_data)
        
        if decision:
            await websocket.send_json({
                "action": decision.action.name,
                "confidence": decision.confidence,
                "position_size": decision.position_size,
                "stop_loss": decision.stop_loss,
                "take_profit": decision.take_profit,
                "reasoning": decision.reasoning,
            })
        else:
            await websocket.send_json({"action": "HOLD", "reason": "Below confidence threshold"})

@app.post("/api/backtest")
async def run_backtest(config: Dict):
    # Run backtest simulation
    pass

@app.post("/api/kill-switch")
async def emergency_kill():
    # Emergency stop all positions
    pass
"""


# ============================================================
# USAGE EXAMPLE
# ============================================================

if __name__ == "__main__":
    """
    Example usage of the Multi-Routing AI Agent:
    
    import asyncio
    
    async def main():
        # Initialize agent
        agent = MultiRoutingAIAgent(config={
            "confidence_threshold": 0.85,
            "technical": {"weight": 0.40},
            "sentiment": {"weight": 0.35},
            "onchain": {"weight": 0.25},
        })
        
        # Create sample market data
        market_data = MarketData(
            symbol="BTC/USDT",
            timestamp=1234567890,
            price=67000.0,
            volume=1500000000,
            ohlcv=[[66000, 67500, 65500, 67000, 1000] for _ in range(200)],
            sentiment_data={"twitter_score": 0.6, "news_score": 0.3, "fear_greed_index": 65},
            onchain_data={"whale_score": 0.4, "dex_volume_change": 50, "funding_rate": 0.001},
        )
        
        # Process and get decision
        decision = await agent.process(market_data)
        
        if decision:
            print(f"Action: {decision.action.name}")
            print(f"Confidence: {decision.confidence:.1%}")
            print(f"Position Size: {decision.position_size:.2%}")
            print(f"Stop Loss: ${decision.stop_loss:,.2f}")
            print(f"Take Profit: ${decision.take_profit:,.2f}")
            print(f"Reasoning:\\n{decision.reasoning}")
        else:
            print("No trade signal - confidence below threshold")
    
    asyncio.run(main())
    """
    print("AI Trading Agent - Multi-Routing Architecture")
    print("=" * 50)
    print("Sub-Agents:")
    print("  1. Technical Analysis (RSI, MACD, EMA, BB, Ichimoku, AI Patterns)")
    print("  2. Sentiment Analysis (Twitter, News, Fear/Greed, LLM)")
    print("  3. On-Chain Analysis (Whales, DEX, Funding, Flows)")
    print("")
    print("Meta-Agent: Combines all signals → Final Decision")
    print("Routing: Dynamic weight adjustment based on performance")
    print("=" * 50)
