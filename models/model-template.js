// ===================================================================
// CRASH PREDICTOR MODEL TEMPLATE
// All models must follow this exact structure
// ===================================================================

// ===================================================================
// SECTION 1: DATA ACCESS (FIXED - DO NOT MODIFY)
// ===================================================================

// gameData: Float32Array [gameNum, mult, gameNum, mult, ...]
// totalGames: number of games
// Access pattern: gameData[i*2] = gameNumber, gameData[i*2+1] = multiplier

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

// ===================================================================
// SECTION 2: ALGORITHM (MODIFY THIS FOR YOUR MODEL)
// ===================================================================

// ALGORITHM START
function analyzeData() {
  // YOUR ALGORITHM HERE
  // This is where you implement your prediction logic
  
  // Example: Simple average of last 100 games
  const lastGames = getLastNGames(100);
  const sum = lastGames.reduce((acc, game) => acc + game.multiplier, 0);
  const average = sum / lastGames.length;
  
  return average;
}
// ALGORITHM END

// ===================================================================
// SECTION 3: OUTPUT (FIXED - DO NOT MODIFY)
// ===================================================================

function predictNextMultiplier() {
  const prediction = analyzeData();
  
  // Clamp prediction between 1.00 and 1000.00
  return Math.max(1.00, Math.min(1000.00, prediction));
}

// This function is called by the worker - do not modify
// Return value must be a number between 1.00 and 1000.00