// ========================================
// MOVING AVERAGE PREDICTION MODEL
// ========================================

(function() {
  'use strict';
  
  // SECTION 1: DATA READING (FIXED)
  const games = [];
  for (let i = 0; i < totalGames; i++) {
    games.push({
      gameNumber: gameData[i * 2],
      multiplier: gameData[i * 2 + 1]
    });
  }
  
  console.log(`📊 Moving Average Model loaded ${totalGames.toLocaleString()} games`);
  
  // SECTION 2: ALGORITHM
  function analyzeAndPredict(gamesArray) {
    const windowSize = 50; // Analyze last 50 games
    const recentGames = gamesArray.slice(-windowSize);
    
    // Calculate weighted moving average (more weight to recent games)
    let weightedSum = 0;
    let totalWeight = 0;
    
    for (let i = 0; i < recentGames.length; i++) {
      const weight = i + 1; // Linear weight increase
      weightedSum += recentGames[i].multiplier * weight;
      totalWeight += weight;
    }
    
    const prediction = weightedSum / totalWeight;
    
    // Calculate volatility for confidence
    const mean = recentGames.reduce((sum, g) => sum + g.multiplier, 0) / recentGames.length;
    const variance = recentGames.reduce((sum, g) => sum + Math.pow(g.multiplier - mean, 2), 0) / recentGames.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower volatility = higher confidence
    const confidence = Math.max(30, Math.min(90, 100 - (stdDev * 10)));
    
    console.log(`🔮 Moving Average: Prediction = ${prediction.toFixed(2)}x, Confidence = ${confidence.toFixed(1)}%`);
    
    return {
      prediction: prediction,
      confidence: confidence
    };
  }
  
  const result = analyzeAndPredict(games);
  
  // SECTION 3: OUTPUT (FIXED)
  return {
    prediction: result.prediction,
    confidence: result.confidence
  };
  
})();