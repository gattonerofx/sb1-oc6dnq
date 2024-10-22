export class Pacman {
    constructor(ctx, x, y) {
        this.ctx = ctx;
        this.startX = x;
        this.startY = y;
        this.reset();
        
        this.radius = 14;
        this.speed = 2;
        this.direction = 'left';
        this.nextDirection = null;
        this.mouthOpen = 0;
        this.mouthSpeed = 0.1;
        this.moving = true;
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.direction = 'left';
        this.nextDirection = null;
        this.moving = true;
        this.mouthOpen = 0;
    }

    setDirection(direction) {
        this.nextDirection = direction;
    }

    update(maze) {
        // Try to change direction if requested
        if (this.nextDirection) {
            const canMove = this.canMove(this.nextDirection, maze);
            if (canMove) {
                this.direction = this.nextDirection;
                this.moving = true;
            }
        }

        // Move if possible
        if (this.moving && this.canMove(this.direction, maze)) {
            switch(this.direction) {
                case 'left':
                    this.x -= this.speed;
                    // Wrap around the screen
                    if (this.x < -this.radius) {
                        this.x = maze.grid[0].length * 16 + this.radius;
                    }
                    break;
                case 'right':
                    this.x += this.speed;
                    // Wrap around the screen
                    if (this.x > maze.grid[0].length * 16 + this.radius) {
                        this.x = -this.radius;
                    }
                    break;
                case 'up':
                    this.y -= this.speed;
                    break;
                case 'down':
                    this.y += this.speed;
                    break;
            }
        }

        // If can't move in current direction, stop
        if (!this.canMove(this.direction, maze)) {
            this.moving = false;
        }

        // Animate mouth only when moving
        if (this.moving) {
            this.mouthOpen += this.mouthSpeed;
            if (this.mouthOpen > 0.5 || this.mouthOpen < 0) {
                this.mouthSpeed = -this.mouthSpeed;
            }
        }
    }

    canMove(direction, maze) {
        const testX = this.x + (direction === 'left' ? -this.speed : direction === 'right' ? this.speed : 0);
        const testY = this.y + (direction === 'up' ? -this.speed : direction === 'down' ? this.speed : 0);
        
        // Allow movement through the tunnel
        if (testY >= 14 * 16 && testY <= 15 * 16) { // Tunnel Y position
            if (testX < 0 || testX > maze.grid[0].length * 16) {
                return true;
            }
        }
        
        return !maze.collidesWith(testX, testY, this.radius);
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        
        // Rotate based on direction
        const rotation = {
            'left': 0,
            'right': Math.PI,
            'up': -Math.PI/2,
            'down': Math.PI/2
        }[this.direction];
        
        this.ctx.rotate(rotation);

        // Draw Pac-Man
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius, 
            this.mouthOpen * Math.PI, 
            (2 - this.mouthOpen) * Math.PI);
        this.ctx.lineTo(0, 0);
        this.ctx.fillStyle = 'yellow';
        this.ctx.fill();
        
        this.ctx.restore();
    }

    collidesWith(entity) {
        const dx = this.x - entity.x;
        const dy = this.y - entity.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.radius + entity.radius;
    }
}