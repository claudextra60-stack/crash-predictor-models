// ========================================
// PATTERN RECOGNITION MODEL
// ========================================
// 
// Identifies recurring patterns in multiplier sequences and predicts
// based on pattern completion likelihood.
//
// Model Name: Pattern Recognition
// Description: Detects and matches historical patterns
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
  
  console.log(`📊 Pattern Recognition Model loaded ${totalGames.toLocaleString()} games`);
  
  // ===================================================================
  // SECTION 2: PATTERN RECOGNITION ALGORITHM
  // ===================================================================
  
  function analyzeAndPredict(gamesArray) {
    const patternLength = 5; // Look for 5-game patterns
    const searchDepth = Math.min(500, gamesArray.length - patternLength - 1);
    
    // Get current pattern (last 5 games)
    const currentPattern = gamesArray.slice(-patternLength).map(g => g.multiplier);
    
    // Find similar patterns in history
    const matches = [];
    
    for (let i = gamesArray.length - searchDepth; i < gamesArray.length - patternLength - 1; i++) {
      const historicalPattern = gamesArray.slice(i, i + patternLength).map(g => g.multiplier);
      
      // Calculate pattern similarity (using normalized distance)
      let totalDistance = 0;
      for (let j = 0; j < patternLength; j++) {
        totalDistance += Math.abs(currentPattern[j] - historicalPattern[j]) / currentPattern[j];
      }
      
      const avgDistance = totalDistance / patternLength;
      
      // If patterns are similar (avg distance < 30%)
      if (avgDistance < 0.3) {
        const nextMultiplier = gamesArray[i + patternLength].multiplier;
        matches.push({
          nextValue: nextMultiplier,
          similarity: 1 - avgDistance
        });
      }
    }
    
    // Predict based on matches
    let prediction;
    let confidence;
    
    if (matches.length > 0) {
      // Weighted average of matches (weight by similarity)
      let weightedSum = 0;
      let totalWeight = 0;
      
      for (const match of matches) {
        weightedSum += match.nextValue * match.similarity;
        totalWeight += match.similarity;
      }
      
      prediction = weightedSum / totalWeight;
      
      // More matches = higher confidence
      confidence = Math.min(70, 40 + matches.length * 3);
    } else {
      // No pattern match - use simple average
      const recentAvg = gamesArray.slice(-20).reduce((sum, g) => sum + g.multiplier, 0) / 20;
      prediction = recentAvg;
      confidence = 35;
    }
    
    console.log(`🔮 Pattern Recognition: ${matches.length} matches found, Prediction=${prediction.toFixed(2)}x, Confidence=${confidence.toFixed(1)}%`);
    
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