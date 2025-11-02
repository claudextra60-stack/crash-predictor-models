// ========================================
// VOLATILITY-ADJUSTED PREDICTION MODEL
// ========================================
// 
// Adjusts predictions based on current market volatility.
// Higher volatility leads to more conservative predictions.
//
// Model Name: Volatility-Adjusted Predictor
// Description: Adapts predictions based on market volatility
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
  
  console.log(`📊 Volatility-Adjusted Model loaded ${totalGames.toLocaleString()} games`);
  
  // ===================================================================
  // SECTION 2: VOLATILITY-ADJUSTED ALGORITHM
  // ===================================================================
  
  function analyzeAndPredict(gamesArray) {
    // Use last 100 games
    const windowSize = Math.min(100, gamesArray.length);
    const recentGames = gamesArray.slice(-windowSize);
    
    // Calculate rolling volatility (standard deviation)
    const mean = recentGames.reduce((sum, g) => sum + g.multiplier, 0) / recentGames.length;
    const variance = recentGames.reduce((sum, g) => sum + Math.pow(g.multiplier - mean, 2), 0) / recentGames.length;
    const stdDev = Math.sqrt(variance);
    
    // Calculate coefficient of variation (relative volatility)
    const cv = stdDev / mean;
    
    // Get last game
    const lastGame = gamesArray[gamesArray.length - 1];
    
    // Volatility-adjusted prediction
    let prediction;
    let confidence;
    
    if (cv < 0.5) {
      // Low volatility - predict near last value
      prediction = (lastGame.multiplier * 0.7) + (mean * 0.3);
      confidence = 70;
    } else if (cv < 1.0) {
      // Medium volatility - predict toward mean
      prediction = (lastGame.multiplier * 0.5) + (mean * 0.5);
      confidence = 55;
    } else {
      // High volatility - conservative prediction (closer to mean)
      prediction = (lastGame.multiplier * 0.3) + (mean * 0.7);
      confidence = 40;
    }
    
    // Apply volatility band constraint
    const lowerBound = mean - stdDev;
    const upperBound = mean + stdDev;
    
    prediction = Math.max(lowerBound, Math.min(upperBound, prediction));
    prediction = Math.max(1.00, prediction); // Ensure minimum 1.00x
    
    console.log(`🔮 Volatility-Adjusted: CV=${cv.toFixed(3)}, Mean=${mean.toFixed(2)}x, StdDev=${stdDev.toFixed(2)}, Prediction=${prediction.toFixed(2)}x, Confidence=${confidence.toFixed(1)}%`);
    
    return {
      prediction: prediction,
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