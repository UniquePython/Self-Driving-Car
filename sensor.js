class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount = 3;
        this.raySpread = Math.PI/4;

        this.rays=[];
        this.readings = [];
    }

    update(roadBorders){
        this.#castRays();

        this.readings = [];
        for(let i=0; i<this.rays.length; i++){
            this.readings.push(this.#getReading(this.rays[i], roadBorders));
        }
    }

    #castRays(){
        this.rays=[];
        
        for(let i=0; i<this.rayCount; i++){
            const rayAngle = linearInterpolate(this.raySpread/2,
                                                -this.raySpread/2,
                                                this.rayCount==1 ? 0.5:i/(this.rayCount-1))
                                                + this.car.angle;

            let rayLength
            if (i === 0 || i === 2) {
                rayLength = 130;
            } else {
                rayLength = 190;
            }

            const start = {x : this.car.x, y : this.car.y};
            const end = {x : this.car.x - Math.sin(rayAngle)*rayLength, y : this.car.y - Math.cos(rayAngle)*rayLength};

            this.rays.push([start, end]);
        }
    }

    #getReading(ray, roadBorders) {
        let touches = [];

        for(let i = 0; i < roadBorders.length; i++){
            const touch = getIntersection(ray[0], ray[1], roadBorders[i][0], roadBorders[i][1]);

            if(touch){
                touches.push(touch);
            }
        }

        if(touches.length === 0){
            return null;
        }
        else{
            const offsets = touches.map(e=>e.offset);
            return touches.find(f=>f.offset == Math.min(...offsets));
        }
    }

    draw(ctx){
        for(let i=0; i<this.rayCount; i++){
            let end = this.rays[i][1];
            if(this.readings[i]){
                end = this.readings[i];
            }

            // Draw where the ray ends
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = "lightgreen";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // Draw where the ray would have continued if it didn't hit anything
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = "red";
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    }
}