// ========================================
// MOMENTUM-BASED PREDICTION MODEL
// ========================================
// 
// Analyzes recent momentum (trend direction and strength) to predict
// whether the next multiplier will continue the trend or reverse.
//
// Model Name: Momentum Predictor
// Description: Tracks short-term momentum and trend strength
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
  
  console.log(`📊 Momentum Model loaded ${totalGames.toLocaleString()} games`);
  
  // ===================================================================
  // SECTION 2: MOMENTUM ALGORITHM
  // ===================================================================
  
  function analyzeAndPredict(gamesArray) {
    // Use last 30 games for momentum analysis
    const momentumWindow = Math.min(30, gamesArray.length);
    const recentGames = gamesArray.slice(-momentumWindow);
    
    // Calculate momentum indicators
    let upMoves = 0;
    let downMoves = 0;
    let totalChange = 0;
    
    for (let i = 1; i < recentGames.length; i++) {
      const change = recentGames[i].multiplier - recentGames[i-1].multiplier;
      totalChange += change;
      
      if (change > 0) upMoves++;
      else if (change < 0) downMoves++;
    }
    
    // Calculate momentum score (-1 to +1)
    const momentumScore = totalChange / recentGames.length;
    const trendStrength = Math.abs(upMoves - downMoves) / (recentGames.length - 1);
    
    // Get recent average
    const recentAvg = recentGames.reduce((sum, g) => sum + g.multiplier, 0) / recentGames.length;
    const lastGame = gamesArray[gamesArray.length - 1];
    
    // Prediction logic
    let prediction;
    let confidence;
    
    if (trendStrength > 0.6) {
      // Strong trend - likely to continue
      if (momentumScore > 0) {
        // Uptrend
        prediction = lastGame.multiplier + (momentumScore * 0.5);
        confidence = Math.min(75, 60 + trendStrength * 20);
      } else {
        // Downtrend
        prediction = lastGame.multiplier + (momentumScore * 0.5);
        confidence = Math.min(75, 60 + trendStrength * 20);
      }
    } else {
      // Weak trend - predict toward recent average
      prediction = (lastGame.multiplier + recentAvg) / 2;
      confidence = 45;
    }
    
    // Ensure reasonable bounds
    prediction = Math.max(1.00, Math.min(prediction, recentAvg * 2));
    
    console.log(`🔮 Momentum: Score=${momentumScore.toFixed(3)}, Strength=${trendStrength.toFixed(2)}, Prediction=${prediction.toFixed(2)}x, Confidence=${confidence.toFixed(1)}%`);
    
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