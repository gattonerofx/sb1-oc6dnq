export class Ghost {
    constructor(ctx, x, y, color) {
        this.ctx = ctx;
        this.startX = x;
        this.startY = y;
        this.reset();
        
        this.color = color;
        this.radius = 14;
        this.speed = 1.5;
        this.direction = 'left';
        this.isVulnerable = false;
        this.vulnerableTimer = 0;
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.direction = 'left';
        this.isVulnerable = false;
    }

    update(maze, pacman) {
        if (this.isVulnerable) {
            this.vulnerableTimer--;
            if (this.vulnerableTimer <= 0) {
                this.isVulnerable = false;
            }
        }

        // Simple AI: Try to move towards Pac-Man
        const directions = ['left', 'right', 'up', 'down'];
        const validDirections = directions.filter(dir => this.canMove(dir, maze));
        
        if (validDirections.length > 0) {
            if (!this.canMove(this.direction, maze) || Math.random() < 0.05) {
                this.direction = validDirections[Math.floor(Math.random() * validDirections.length)];
            }
            
            switch(this.direction) {
                case 'left':
                    this.x -= this.speed;
                    break;
                case 'right':
                    this.x += this.speed;
                    break;
                case 'up':
                    this.y -= this.speed;
                    break;
                case 'down':
                    this.y += this.speed;
                    break;
            }
        }
    }

    canMove(direction, maze) {
        const testX = this.x + (direction === 'left' ? -this.speed : direction === 'right' ? this.speed : 0);
        const testY = this.y + (direction === 'up' ? -this.speed : direction === 'down' ? this.speed : 0);
        return !maze.collidesWith(testX, testY, this.radius);
    }

    draw() {
        this.ctx.beginPath();
        
        // Draw body
        this.ctx.arc(this.x, this.y, this.radius, Math.PI, 0, false);
        this.ctx.lineTo(this.x + this.radius, this.y + this.radius);
        
        // Draw wavy bottom
        const waves = 4;
        const waveHeight = 4;
        for (let i = 0; i <= waves; i++) {
            const curve = Math.sin((i / waves) * Math.PI) * waveHeight;
            this.ctx.lineTo(
                this.x + this.radius - ((2 * this.radius / waves) * i),
                this.y + this.radius + curve
            );
        }
        
        this.ctx.fillStyle = this.isVulnerable ? '#2121ff' : this.color;
        this.ctx.fill();

        // Draw eyes
        const eyeOffset = 4;
        const eyeRadius = 3;
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(this.x - eyeOffset, this.y - 2, eyeRadius, 0, Math.PI * 2);
        this.ctx.arc(this.x + eyeOffset, this.y - 2, eyeRadius, 0, Math.PI * 2);
        this.ctx.fill();
    }
}