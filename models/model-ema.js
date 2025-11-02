// ========================================
// EXPONENTIAL MOVING AVERAGE MODEL
// ========================================
// 
// Uses exponentially weighted moving average to give more weight
// to recent games while maintaining long-term trend awareness.
//
// Model Name: Exponential Moving Average
// Description: EMA with adaptive smoothing factor based on volatility
// Author: AI Assistant
// Version: 1.0
// ========================================

(function() {
  'use strict';
  
  // ===================================================================
  // SECTION 1: DATA READING (FIXED - DO NOT MODIFY)
  // ===================================================================
  
  const games = [];
  
  for (let i = 0; i < totalGames; i++) {
    games.push({
      gameNumber: gameData[i * 2],
      multiplier: gameData[i * 2 + 1]
    });
  }
  
  console.log(`📊 EMA Model loaded ${totalGames.toLocaleString()} games`);
  
  // ===================================================================
  // SECTION 2: EMA ALGORITHM
  // ===================================================================
  
  function analyzeAndPredict(gamesArray) {
    // Use last 200 games for analysis
    const windowSize = Math.min(200, gamesArray.length);
    const recentGames = gamesArray.slice(-windowSize);
    
    // Calculate volatility to determine smoothing factor
    const volatilities = [];
    for (let i = 1; i < recentGames.length; i++) {
      volatilities.push(Math.abs(recentGames[i].multiplier - recentGames[i-1].multiplier));
    }
    const avgVolatility = volatilities.reduce((sum, v) => sum + v, 0) / volatilities.length;
    
    // Adaptive smoothing: higher volatility = more weight to recent games
    // Alpha ranges from 0.1 (stable) to 0.3 (volatile)
    const alpha = Math.min(0.3, Math.max(0.1, avgVolatility / 2));
    
    // Calculate EMA
    let ema = recentGames[0].multiplier;
    
    for (let i = 1; i < recentGames.length; i++) {
      ema = alpha * recentGames[i].multiplier + (1 - alpha) * ema;
    }
    
    // Calculate confidence based on trend consistency
    let trendChanges = 0;
    let lastDirection = 0;
    
    for (let i = 1; i < Math.min(50, recentGames.length); i++) {
      const direction = Math.sign(recentGames[i].multiplier - recentGames[i-1].multiplier);
      if (lastDirection !== 0 && direction !== lastDirection && direction !== 0) {
        trendChanges++;
      }
      if (direction !== 0) lastDirection = direction;
    }
    
    // Fewer trend changes = higher confidence
    const confidence = Math.max(40, Math.min(85, 85 - (trendChanges * 2)));
    
    console.log(`🔮 EMA: Prediction = ${ema.toFixed(2)}x, Alpha = ${alpha.toFixed(3)}, Confidence = ${confidence.toFixed(1)}%`);
    
    return {
      prediction: ema,
      confidence: confidence
    };
  }
  
  const result = analyzeAndPredict(games);
  
  // ===================================================================
  // SECTION 3: OUTPUT (FIXED - DO NOT MODIFY)
  // ===================================================================
  
  return {
    prediction: result.prediction,
    confidence: result.confidence
  };
  
})();