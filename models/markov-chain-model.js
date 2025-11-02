// ===================================================================
// MARKOV CHAIN PREDICTION MODEL
// Analyzes state transitions based on multiplier ranges
// ===================================================================

// SECTION 1: DATA ACCESS (FIXED)
function getGameNumber(index) {
  return gameData[index * 2];
}

function getMultiplier(index) {
  return gameData[index * 2 + 1];
}

function getLastNGames(n) {
  const games = [];
  const start = Math.max(0, totalGames - n);
  for (let i = start; i < totalGames; i++) {
    games.push({
      gameNumber: getGameNumber(i),
      multiplier: getMultiplier(i)
    });
  }
  return games;
}

// SECTION 2: ALGORITHM
// ALGORITHM START

function analyzeData() {
  // Define multiplier states
  const states = [
    { name: 'LOW', min: 1.00, max: 1.50, midpoint: 1.25 },
    { name: 'MED', min: 1.50, max: 2.50, midpoint: 2.00 },
    { name: 'HIGH', min: 2.50, max: 5.00, midpoint: 3.75 },
    { name: 'EXTREME', min: 5.00, max: 1000.00, midpoint: 10.00 }
  ];
  
  function classifyMultiplier(mult) {
    for (const state of states) {
      if (mult >= state.min && mult < state.max) {
        return state;
      }
    }
    return states[states.length - 1]; // EXTREME
  }
  
  // Build transition matrix
  const transitionCounts = {};
  
  for (const state of states) {
    transitionCounts[state.name] = {};
    for (const nextState of states) {
      transitionCounts[state.name][nextState.name] = 0;
    }
  }
  
  // Count transitions from last 10000 games (or all if less)
  const analysisWindow = Math.min(10000, totalGames - 1);
  const startIndex = totalGames - analysisWindow - 1;
  
  for (let i = startIndex; i < totalGames - 1; i++) {
    const currentMult = getMultiplier(i);
    const nextMult = getMultiplier(i + 1);
    
    const currentState = classifyMultiplier(currentMult);
    const nextState = classifyMultiplier(nextMult);
    
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
    } else {
      // Uniform distribution if no data
      for (const toState of states) {
        transitionProbs[fromState.name][toState.name] = 0.25;
      }
    }
  }
  
  // Get current state (last game)
  const lastMult = getMultiplier(totalGames - 1);
  const currentState = classifyMultiplier(lastMult);
  
  // Predict next state based on highest probability
  let maxProb = 0;
  let predictedState = states[0];
  
  for (const state of states) {
    const prob = transitionProbs[currentState.name][state.name];
    if (prob > maxProb) {
      maxProb = prob;
      predictedState = state;
    }
  }
  
  // Adjust prediction based on recent trend
  const last20 = getLastNGames(20);
  const recentAvg = last20.reduce((sum, g) => sum + g.multiplier, 0) / last20.length;
  
  // Weighted prediction: 70% state midpoint, 30% recent average
  const prediction = (predictedState.midpoint * 0.7) + (recentAvg * 0.3);
  
  return prediction;
}

// ALGORITHM END

// SECTION 3: OUTPUT (FIXED)
function predictNextMultiplier() {
  const prediction = analyzeData();
  return Math.max(1.00, Math.min(1000.00, prediction));
}