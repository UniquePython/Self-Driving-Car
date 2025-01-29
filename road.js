class Road {
    constructor(x, width, laneCount = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width / 2;
        this.right = x + width / 2;

        const inf = 1e10;

        this.top = -inf;
        this.bottom = inf;
    }

    getLaneCenter(laneIndex){
        const laneWidth = this.width / this.laneCount;
        return this.left+laneWidth/2 + Math.min(laneIndex, this.laneCount-1)*laneWidth;
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
        for(let i = 1; i < this.laneCount; i++){
            const x = linearInterpolate(this.left, this.right, i / this.laneCount);

            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }
    }
}