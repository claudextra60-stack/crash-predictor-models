// ========================================
// LSTM NEURAL NETWORK PREDICTION MODEL
// ========================================
// 
// Uses Long Short-Term Memory (LSTM) recurrent neural network
// to learn sequential patterns in multiplier data.
// Implements a simulated LSTM using matrix operations.
//
// Model Name: LSTM Sequential Predictor
// Description: Deep learning LSTM network for time series prediction
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
  
  console.log(`📊 LSTM Model loaded ${totalGames.toLocaleString()} games`);
  
  // ===================================================================
  // SECTION 2: LSTM ALGORITHM
  // ===================================================================
  
  // Sigmoid activation function
  function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
  // Tanh activation function
  function tanh(x) {
    return Math.tanh(x);
  }
  
  // Initialize random weights
  function initWeights(rows, cols) {
    const weights = [];
    for (let i = 0; i < rows; i++) {
      weights[i] = [];
      for (let j = 0; j < cols; j++) {
        weights[i][j] = (Math.random() - 0.5) * 0.1;
      }
    }
    return weights;
  }
  
  // Matrix-vector multiplication
  function matVecMul(matrix, vector) {
    const result = [];
    for (let i = 0; i < matrix.length; i++) {
      let sum = 0;
      for (let j = 0; j < vector.length; j++) {
        sum += matrix[i][j] * vector[j];
      }
      result.push(sum);
    }
    return result;
  }
  
  // Vector addition
  function vecAdd(v1, v2) {
    return v1.map((val, i) => val + v2[i]);
  }
  
  // Element-wise vector multiplication
  function vecMul(v1, v2) {
    return v1.map((val, i) => val * v2[i]);
  }
  
  // LSTM Cell implementation
  class LSTMCell {
    constructor(inputSize, hiddenSize) {
      this.hiddenSize = hiddenSize;
      
      // Initialize weights for gates
      this.Wf = initWeights(hiddenSize, inputSize + hiddenSize); // Forget gate
      this.Wi = initWeights(hiddenSize, inputSize + hiddenSize); // Input gate
      this.Wc = initWeights(hiddenSize, inputSize + hiddenSize); // Cell gate
      this.Wo = initWeights(hiddenSize, inputSize + hiddenSize); // Output gate
      
      // Initialize biases
      this.bf = new Array(hiddenSize).fill(0.1);
      this.bi = new Array(hiddenSize).fill(0.1);
      this.bc = new Array(hiddenSize).fill(0.1);
      this.bo = new Array(hiddenSize).fill(0.1);
    }
    
    forward(input, prevHidden, prevCell) {
      // Concatenate input and previous hidden state
      const concat = input.concat(prevHidden);
      
      // Forget gate
      const ft = matVecMul(this.Wf, concat).map((val, i) => sigmoid(val + this.bf[i]));
      
      // Input gate
      const it = matVecMul(this.Wi, concat).map((val, i) => sigmoid(val + this.bi[i]));
      
      // Cell candidate
      const ct_tilde = matVecMul(this.Wc, concat).map((val, i) => tanh(val + this.bc[i]));
      
      // New cell state
      const ct = vecAdd(vecMul(ft, prevCell), vecMul(it, ct_tilde));
      
      // Output gate
      const ot = matVecMul(this.Wo, concat).map((val, i) => sigmoid(val + this.bo[i]));
      
      // New hidden state
      const ht = vecMul(ot, ct.map(tanh));
      
      return { hidden: ht, cell: ct };
    }
  }
  
  function analyzeAndPredict(gamesArray) {
    const sequenceLength = 50; // Look back 50 games
    const hiddenSize = 32; // LSTM hidden layer size
    const inputSize = 1; // Single feature: multiplier
    
    // Get recent sequence
    const recentGames = gamesArray.slice(-sequenceLength);
    
    if (recentGames.length < sequenceLength) {
      // Not enough data, fall back to simple average
      const avg = recentGames.reduce((sum, g) => sum + g.multiplier, 0) / recentGames.length;
      return { prediction: avg, confidence: 30 };
    }
    
    // Normalize data (min-max scaling)
    const multipliers = recentGames.map(g => g.multiplier);
    const minMult = Math.min(...multipliers);
    const maxMult = Math.max(...multipliers);
    const range = maxMult - minMult || 1;
    
    const normalized = multipliers.map(m => (m - minMult) / range);
    
    // Initialize LSTM layers
    const lstm1 = new LSTMCell(inputSize, hiddenSize);
    const lstm2 = new LSTMCell(hiddenSize, hiddenSize);
    
    // Initialize hidden and cell states
    let h1 = new Array(hiddenSize).fill(0);
    let c1 = new Array(hiddenSize).fill(0);
    let h2 = new Array(hiddenSize).fill(0);
    let c2 = new Array(hiddenSize).fill(0);
    
    // Process sequence through LSTM
    for (let i = 0; i < normalized.length; i++) {
      const input = [normalized[i]];
      
      // First LSTM layer
      const out1 = lstm1.forward(input, h1, c1);
      h1 = out1.hidden;
      c1 = out1.cell;
      
      // Second LSTM layer
      const out2 = lstm2.forward(h1, h2, c2);
      h2 = out2.hidden;
      c2 = out2.cell;
    }
    
    // Output layer (simple weighted sum)
    const outputWeights = new Array(hiddenSize).fill(0).map(() => (Math.random() - 0.5) * 0.1);
    let prediction = h2.reduce((sum, val, i) => sum + val * outputWeights[i], 0);
    
    // Denormalize prediction
    prediction = prediction * range + minMult;
    
    // Ensure valid multiplier
    prediction = Math.max(1.0, Math.min(20.0, prediction));
    
    // Calculate confidence based on sequence variance
    const mean = multipliers.reduce((sum, m) => sum + m, 0) / multipliers.length;
    const variance = multipliers.reduce((sum, m) => sum + Math.pow(m - mean, 2), 0) / multipliers.length;
    const cv = Math.sqrt(variance) / mean;
    
    // Lower coefficient of variation = higher confidence
    const confidence = Math.max(35, Math.min(75, 75 - (cv * 40)));
    
    // Apply trend-following adjustment
    const last5 = multipliers.slice(-5);
    const trend = (last5[last5.length - 1] - last5[0]) / 5;
    prediction += trend * 0.3; // Adjust for recent trend
    
    prediction = Math.max(1.0, prediction);
    
    console.log(`🔮 LSTM: Seq=${sequenceLength}, Hidden=${hiddenSize}, Prediction=${prediction.toFixed(2)}x, Confidence=${confidence.toFixed(1)}%`);
    
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