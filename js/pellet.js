export class Pellet {
    constructor(ctx, x, y, isPower = false) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.isPower = isPower;
        this.radius = isPower ? 6 : 2;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffb8ae';
        this.ctx.fill();
    }
}