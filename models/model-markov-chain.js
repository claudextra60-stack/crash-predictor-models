// ========================================
// MARKOV CHAIN PREDICTION MODEL
// ========================================
// 
// Uses first-order Markov chains to predict next multiplier
// based on transition probabilities from historical data.
//
// Model Name: Markov Chain Predictor
// Description: Analyzes state transitions between multiplier ranges
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
  
  console.log(`📊 Markov Chain Model loaded ${totalGames.toLocaleString()} games`);
  
  // ===================================================================
  // SECTION 2: MARKOV CHAIN ALGORITHM
  // ===================================================================
  
  function analyzeAndPredict(gamesArray) {
    // Define multiplier states (ranges)
    const states = [
      { name: '1.00-1.50', min: 1.00, max: 1.50, midpoint: 1.25 },
      { name: '1.50-2.00', min: 1.50, max: 2.00, midpoint: 1.75 },
      { name: '2.00-3.00', min: 2.00, max: 3.00, midpoint: 2.50 },
      { name: '3.00-5.00', min: 3.00, max: 5.00, midpoint: 4.00 },
      { name: '5.00-10.00', min: 5.00, max: 10.00, midpoint: 7.50 },
      { name: '10.00+', min: 10.00, max: Infinity, midpoint: 15.00 }
    ];
    
    // Classify multiplier into state
    function getState(multiplier) {
      for (const state of states) {
        if (multiplier >= state.min && multiplier < state.max) {
          return state;
        }
      }
      return states[states.length - 1]; // High multipliers
    }
    
    // Build transition matrix
    const transitionCounts = {};
    
    // Initialize matrix
    for (const fromState of states) {
      transitionCounts[fromState.name] = {};
      for (const toState of states) {
        transitionCounts[fromState.name][toState.name] = 0;
      }
    }
    
    // Count transitions
    for (let i = 0; i < gamesArray.length - 1; i++) {
      const currentState = getState(gamesArray[i].multiplier);
      const nextState = getState(gamesArray[i + 1].multiplier);
      
      transitionCounts[currentState.name][nextState.name]++;
    }
    
    // Convert counts to probabilities
    const transitionProbs = {};
    
    for (const fromState of states) {
      transitionProbs[fromState.name] = {};
      
      const totalTransitions = Object.values(transitionCounts[fromState.name])
        .reduce((sum, count) => sum + count, 0);
      
      if (totalTransitions > 0) {
        for (const toState of states) {
          transitionProbs[fromState.name][toState.name] = 
            transitionCounts[fromState.name][toState.name] / totalTransitions;
        }
      }
    }
    
    // Get last game state
    const lastGame = gamesArray[gamesArray.length - 1];
    const lastState = getState(lastGame.multiplier);
    
    // Find most likely next state
    let maxProb = 0;
    let predictedState = states[0];
    
    for (const state of states) {
      const prob = transitionProbs[lastState.name][state.name] || 0;
      if (prob > maxProb) {
        maxProb = prob;
        predictedState = state;
      }
    }
    
    // Calculate confidence based on how dominant the prediction is
    const totalProb = Object.values(transitionProbs[lastState.name] || {})
      .reduce((sum, p) => sum + p, 0);
    
    const confidence = totalProb > 0 ? (maxProb / totalProb) * 100 : 50;
    
    console.log(`🔮 Markov Chain: Last state = ${lastState.name}, Predicted = ${predictedState.name}, Confidence = ${confidence.toFixed(1)}%`);
    
    return {
      prediction: predictedState.midpoint,
      confidence: Math.min(95, confidence) // Cap at 95%
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