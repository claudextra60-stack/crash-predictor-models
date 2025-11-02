// ========================================
// MEAN REVERSION PREDICTION MODEL
// ========================================
// 
// Based on the theory that extreme multipliers tend to be followed
// by values closer to the mean. Uses statistical analysis to predict
// reversion to average.
//
// Model Name: Mean Reversion Predictor
// Description: Predicts return to mean after extreme values
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
  
  console.log(`📊 Mean Reversion Model loaded ${totalGames.toLocaleString()} games`);
  
  // ===================================================================
  // SECTION 2: MEAN REVERSION ALGORITHM
  // ===================================================================
  
  function analyzeAndPredict(gamesArray) {
    // Use last 300 games for historical mean
    const windowSize = Math.min(300, gamesArray.length);
    const recentGames = gamesArray.slice(-windowSize);
    
    // Calculate mean and standard deviation
    const mean = recentGames.reduce((sum, g) => sum + g.multiplier, 0) / recentGames.length;
    const variance = recentGames.reduce((sum, g) => sum + Math.pow(g.multiplier - mean, 2), 0) / recentGames.length;
    const stdDev = Math.sqrt(variance);
    
    // Get last game
    const lastGame = gamesArray[gamesArray.length - 1];
    const deviation = (lastGame.multiplier - mean) / stdDev; // Z-score
    
    // Mean reversion logic:
    // If last game was extreme (|z-score| > 1), predict toward mean
    // Otherwise, predict near the mean
    let prediction;
    let confidence;
    
    if (Math.abs(deviation) > 1.5) {
      // Strong reversion expected
      const reversionStrength = 0.6; // 60% toward mean
      prediction = lastGame.multiplier + reversionStrength * (mean - lastGame.multiplier);
      confidence = Math.min(80, 60 + Math.abs(deviation) * 10);
    } else if (Math.abs(deviation) > 0.5) {
      // Moderate reversion
      const reversionStrength = 0.3;
      prediction = lastGame.multiplier + reversionStrength * (mean - lastGame.multiplier);
      confidence = 55;
    } else {
      // Near mean already, predict mean
      prediction = mean;
      confidence = 50;
    }
    
    // Ensure prediction is within reasonable bounds
    prediction = Math.max(1.00, Math.min(prediction, mean + 2 * stdDev));
    
    console.log(`🔮 Mean Reversion: Last=${lastGame.multiplier.toFixed(2)}x, Mean=${mean.toFixed(2)}x, Z=${deviation.toFixed(2)}, Prediction=${prediction.toFixed(2)}x, Confidence=${confidence.toFixed(1)}%`);
    
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