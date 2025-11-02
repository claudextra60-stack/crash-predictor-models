// ALGORITHM START
// Weighted Moving Average Predictor
// Uses exponential moving average with recent game emphasis

function predictNextMultiplier() {
  if (!gameData || totalGames < 50) {
    return 2.00; // Default fallback
  }
  
  // Use last 50 games for moving average
  const windowSize = Math.min(50, totalGames);
  let sum = 0;
  let weightSum = 0;
  
  // Exponential weights (recent games weighted more)
  for (let i = 0; i < windowSize; i++) {
    const index = (totalGames - windowSize + i) * 2 + 1;
    const multiplier = gameData[index];
    const weight = Math.exp(i / windowSize); // Exponential weight
    
    sum += multiplier * weight;
    weightSum += weight;
  }
  
  const weightedAverage = sum / weightSum;
  
  // Apply smoothing and bounds
  const prediction = Math.max(1.01, Math.min(10.0, weightedAverage));
  
  return Math.floor(prediction * 100) / 100;
}
// ALGORITHM END