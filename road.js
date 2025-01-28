class Road {
    constructor(x, width, lane = 4) {
        this.x = x;
        this.width = width;
        this.lane = lane;

        this.left = x - width / 2;
        this.right = x + width / 2;

        const inf = 1e10;

        this.top = -inf;
        this.bottom = inf;
    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'yellow';

        ctx.beginPath();
        ctx.moveTo(this.left, this.bottom);
        ctx.lineTo(this.left, this.top);
        ctx.moveTo(this.right, this.top);
        ctx.lineTo(this.right, this.bottom);
        ctx.stroke();

        ctx.strokeStyle = 'white';
        for(let i = 1; i < this.lane; i++){
            const x = linearInterpolate(this.left, this.right, i / this.lane);

            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }
    }
}