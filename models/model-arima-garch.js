// ========================================
// ARIMA-GARCH INSPIRED PREDICTION MODEL
// ========================================
// 
// Inspired by ARIMA-GARCH time series models used in financial forecasting.
// Combines autoregressive mean prediction with conditional variance modeling
// to adapt predictions based on volatility clustering patterns.
//
// Model Name: ARIMA-GARCH Predictor
// Description: Autoregressive model with GARCH-style volatility adjustment
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
  
  console.log(`📊 ARIMA-GARCH Model loaded ${totalGames.toLocaleString()} games`);
  
  // ===================================================================
  // SECTION 2: ARIMA-GARCH ALGORITHM
  // ===================================================================
  
  function analyzeAndPredict(gamesArray) {
    // Use last 150 games for analysis
    const windowSize = Math.min(150, gamesArray.length);
    const recentGames = gamesArray.slice(-windowSize);
    
    // ==== PART 1: ARIMA-style Autoregressive Mean Prediction ====
    
    // Calculate weights for autoregressive terms (exponentially decaying)
    const arLags = 5; // Use last 5 values
    const arWeights = [];
    let weightSum = 0;
    
    for (let i = 0; i < arLags; i++) {
      const weight = Math.exp(-0.3 * i); // Exponential decay
      arWeights.push(weight);
      weightSum += weight;
    }
    
    // Normalize weights
    for (let i = 0; i < arWeights.length; i++) {
      arWeights[i] /= weightSum;
    }
    
    // Calculate AR prediction
    let arPrediction = 0;
    for (let i = 0; i < arLags && i < recentGames.length; i++) {
      const idx = recentGames.length - 1 - i;
      arPrediction += recentGames[idx].multiplier * arWeights[i];
    }
    
    // Calculate overall mean for mean reversion component
    const overallMean = recentGames.reduce((sum, g) => sum + g.multiplier, 0) / recentGames.length;
    
    // Combine AR prediction with mean reversion (70% AR, 30% mean)
    const meanPrediction = arPrediction * 0.7 + overallMean * 0.3;
    
    // ==== PART 2: GARCH-style Conditional Variance Modeling ====
    
    // Calculate residuals (errors from mean)
    const residuals = recentGames.map(g => g.multiplier - overallMean);
    
    // Calculate squared residuals for GARCH modeling
    const squaredResiduals = residuals.map(r => r * r);
    
    // GARCH(1,1) parameters - estimate conditional variance
    const alpha = 0.1; // Weight on recent squared error (ARCH effect)
    const beta = 0.85;  // Weight on previous variance (GARCH effect)
    const omega = 0.05; // Long-run variance constant
    
    // Initialize variance with sample variance
    let conditionalVariance = squaredResiduals.reduce((sum, sr) => sum + sr, 0) / squaredResiduals.length;
    
    // Update conditional variance using GARCH recursion
    for (let i = Math.max(0, squaredResiduals.length - 20); i < squaredResiduals.length; i++) {
      conditionalVariance = omega + 
                           alpha * squaredResiduals[i] + 
                           beta * conditionalVariance;
    }
    
    const conditionalStdDev = Math.sqrt(conditionalVariance);
    
    // ==== PART 3: Volatility Clustering Detection ====
    
    // Calculate recent volatility (last 10 games)
    const recentVolatility = [];
    for (let i = Math.max(0, recentGames.length - 11); i < recentGames.length - 1; i++) {
      const diff = Math.abs(recentGames[i + 1].multiplier - recentGames[i].multiplier);
      recentVolatility.push(diff);
    }
    
    const avgRecentVolatility = recentVolatility.reduce((sum, v) => sum + v, 0) / recentVolatility.length;
    
    // Detect volatility clustering
    const volatilityRatio = avgRecentVolatility / conditionalStdDev;
    
    // ==== PART 4: Adjust Prediction Based on Volatility ====
    
    let finalPrediction;
    let confidence;
    
    if (volatilityRatio > 1.5) {
      // High volatility cluster - be more conservative
      finalPrediction = meanPrediction * 0.4 + overallMean * 0.6;
      confidence = 35;
      console.log('📈 High volatility clustering detected');
    } else if (volatilityRatio > 1.0) {
      // Moderate volatility
      finalPrediction = meanPrediction * 0.6 + overallMean * 0.4;
      confidence = 50;
      console.log('📊 Moderate volatility detected');
    } else {
      // Low volatility - trust AR prediction more
      finalPrediction = meanPrediction * 0.8 + overallMean * 0.2;
      confidence = 65;
      console.log('📉 Low volatility period');
    }
    
    // Apply variance bounds (±1.5 standard deviations)
    const lowerBound = overallMean - 1.5 * conditionalStdDev;
    const upperBound = overallMean + 1.5 * conditionalStdDev;
    
    finalPrediction = Math.max(lowerBound, Math.min(upperBound, finalPrediction));
    finalPrediction = Math.max(1.00, finalPrediction); // Minimum 1.00x
    
    console.log(`🔮 ARIMA-GARCH: Mean=${overallMean.toFixed(2)}x, CondVar=${conditionalVariance.toFixed(3)}, VolRatio=${volatilityRatio.toFixed(2)}, Prediction=${finalPrediction.toFixed(2)}x, Confidence=${confidence}%`);
    
    return {
      prediction: finalPrediction,
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