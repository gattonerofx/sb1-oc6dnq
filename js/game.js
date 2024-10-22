import { Pacman } from './pacman.js';
import { Ghost } from './ghost.js';
import { Maze } from './maze.js';
import { Pellet } from './pellet.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 448;
        this.canvas.height = 496;
        
        this.score = 0;
        this.highScore = 0;
        this.lives = 2;
        this.level = 1;
        this.bonus = 0;
        this.gameActive = false;
        
        this.maze = new Maze(this.ctx);
        // Position Pac-Man at the correct starting position (23rd row, 14th column)
        this.pacman = new Pacman(this.ctx, 14 * 16 + 8, 23 * 16 + 8);
        this.ghosts = [
            new Ghost(this.ctx, 13 * 16 + 8, 11 * 16 + 8, 'red'),    // Center of ghost house
            new Ghost(this.ctx, 14 * 16 + 8, 11 * 16 + 8, 'pink'),
            new Ghost(this.ctx, 13 * 16 + 8, 12 * 16 + 8, 'cyan'),
            new Ghost(this.ctx, 14 * 16 + 8, 12 * 16 + 8, 'orange')
        ];
        
        this.pellets = [];
        this.initPellets();
        this.bindEvents();
        this.startButton = document.getElementById('startButton');
        this.startButton.addEventListener('click', () => this.startGame());
        
        // Initial draw
        this.draw();
    }

    startGame() {
        this.gameActive = true;
        this.startButton.style.display = 'none';
        this.score = 0;
        this.lives = 2;
        this.level = 1;
        this.bonus = 0;
        this.initPellets();
        this.resetLevel();
        this.gameLoop();
    }

    initPellets() {
        const pelletPositions = this.maze.getPelletPositions();
        this.pellets = pelletPositions.map(pos => 
            new Pellet(this.ctx, pos.x, pos.y, pos.isPower)
        );
    }

    bindEvents() {
        window.addEventListener('keydown', (e) => {
            if (!this.gameActive) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.pacman.setDirection('left');
                    break;
                case 'ArrowRight':
                    this.pacman.setDirection('right');
                    break;
                case 'ArrowUp':
                    this.pacman.setDirection('up');
                    break;
                case 'ArrowDown':
                    this.pacman.setDirection('down');
                    break;
            }
        });
    }

    update() {
        if (!this.gameActive) return;
        
        this.pacman.update(this.maze);
        this.ghosts.forEach(ghost => ghost.update(this.maze, this.pacman));
        this.checkCollisions();
        this.updateScore();
    }

    checkCollisions() {
        // Check pellet collisions
        this.pellets = this.pellets.filter(pellet => {
            if (this.pacman.collidesWith(pellet)) {
                if (pellet.isPower) {
                    this.score += 50;
                    this.ghosts.forEach(ghost => {
                        ghost.isVulnerable = true;
                        ghost.vulnerableTimer = 300;
                    });
                } else {
                    this.score += 10;
                }
                return false;
            }
            return true;
        });

        // Check ghost collisions
        this.ghosts.forEach(ghost => {
            if (this.pacman.collidesWith(ghost)) {
                if (ghost.isVulnerable) {
                    this.score += 200;
                    ghost.reset();
                } else {
                    this.lives--;
                    if (this.lives < 0) {
                        this.gameOver();
                    } else {
                        this.resetLevel();
                    }
                }
            }
        });

        // Check if all pellets are collected
        if (this.pellets.length === 0) {
            this.level++;
            this.initPellets();
            this.resetLevel();
        }
    }

    updateScore() {
        document.getElementById('score').textContent = 
            this.score.toString().padStart(8, '0');
        document.getElementById('highScore').textContent = 
            Math.max(this.score, this.highScore).toString().padStart(8, '0');
        document.getElementById('lives').textContent = 
            this.lives.toString().padStart(2, '0');
        document.getElementById('level').textContent = 
            this.level.toString().padStart(2, '0');
        document.getElementById('bonus').textContent = 
            this.bonus.toString().padStart(4, '0');
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.maze.draw();
        this.pellets.forEach(pellet => pellet.draw());
        this.ghosts.forEach(ghost => ghost.draw());
        this.pacman.draw();
    }

    gameLoop() {
        if (!this.gameActive) return;
        
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    resetLevel() {
        this.pacman.reset();
        this.ghosts.forEach(ghost => ghost.reset());
    }

    gameOver() {
        this.gameActive = false;
        this.highScore = Math.max(this.score, this.highScore);
        this.startButton.style.display = 'block';
        this.startButton.textContent = 'Game Over - Play Again';
    }
}

new Game();