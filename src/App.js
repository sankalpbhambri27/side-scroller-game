import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function Game() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [jumping, setJumping] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Game constants
    const GRAVITY = 0.5;
    const JUMP_FORCE = -10;
    const GROUND = canvas.height - 20;
    
    // Game state
    let player = {
      x: 50,
      y: GROUND,
      velocity: 0,
      width: 30,
      height: 30
    };
    
    let obstacles = [];
    let gameLoop;
    let scoreInterval;
    
    // Game functions
    function createObstacle() {
      obstacles.push({
        x: canvas.width,
        y: GROUND - 20,
        width: 30,
        height: 30
      });
    }
    
    function update() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw ground
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(0, GROUND, canvas.width, 10);
      
      // Update player
      player.velocity += GRAVITY;
      player.y += player.velocity;
      
      // Check ground collision
      if (player.y > GROUND) {
        player.y = GROUND;
        player.velocity = 0;
      }
      
      // Draw player
      ctx.fillStyle = '#FF9800';
      ctx.fillRect(player.x, player.y, player.width, player.height);
      
      // Update obstacles
      obstacles.forEach((obstacle, index) => {
        obstacle.x -= 5;
        
        // Draw obstacle
        ctx.fillStyle = '#F44336';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Check collision
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
          gameOverHandler();
        }
        
        // Remove off-screen obstacles
        if (obstacle.x + obstacle.width < 0) {
          obstacles.splice(index, 1);
          setScore(prev => prev + 1);
        }
      });
      
      // Create new obstacles
      if (Math.random() < 0.02) {
        createObstacle();
      }
      
      // Update high score
      if (score > highScore) {
        setHighScore(score);
      }
    }
    
    function gameOverHandler() {
      setGameOver(true);
      clearInterval(gameLoop);
      clearInterval(scoreInterval);
    }
    
    function jump() {
      if (!jumping && player.y === GROUND) {
        player.velocity = JUMP_FORCE;
        setJumping(true);
        setTimeout(() => setJumping(false), 500);
      }
    }
    
    // Start game loop
    gameLoop = setInterval(update, 1000/60);
    scoreInterval = setInterval(() => setScore(prev => prev + 1), 1000);
    
    // Event listeners
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !gameOver) {
        jump();
      }
    });
    
    // Cleanup
    return () => {
      clearInterval(gameLoop);
      clearInterval(scoreInterval);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Llama Scroller</h1>
        <div className="game-container">
          <canvas ref={canvasRef} width="400" height="200" />
          <div className="game-info">
            <p>Score: {score}</p>
            <p>High Score: {highScore}</p>
            <p>Use SPACEBAR to jump</p>
          </div>
        </div>
      </header>
    </div>
  );
}

function App() {
  return <Game />;
}

export default App;
