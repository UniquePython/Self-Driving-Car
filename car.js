class Car {
    constructor(x, y, width, height, controlType, maxSpeed = 2, acceleration = 0.2) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = acceleration;
        this.reverseAcceleration = -0.3;
        this.maxSpeed = maxSpeed;
        this.maxReverseSpeed = -1;
        this.friction = 0.08;
        this.angle = 0;

        this.isDamaged = false;

        if( controlType!="DUMMY"){
            this.sensor = new Sensor(this);
        }
        this.controls = new Controls(controlType);
    }

    update(roadBorders) {
        if (!this.isDamaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.isDamaged = this.#assessDamage(roadBorders);
        }
        if(this.sensor){
            this.sensor.update(roadBorders);
        }
    }

    #createPolygon() {
        const points = [];
        const radius = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
    
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * radius,
            y: this.y - Math.cos(this.angle - alpha) * radius
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * radius,
            y: this.y - Math.cos(this.angle + alpha) * radius
        });
        points.push({
            x: this.x + Math.sin(this.angle - alpha) * radius,
            y: this.y + Math.cos(this.angle - alpha) * radius
        });
        points.push({
            x: this.x + Math.sin(this.angle + alpha) * radius,
            y: this.y + Math.cos(this.angle + alpha) * radius
        });
    
        return points;
    }

    #move() {
        this.#adjustSpeed();
        this.#applyFriction();
        this.#adjustPosition();
        this.#adjustAngle();
    }

    #adjustSpeed() {
        if (this.controls.forward) this.speed += this.acceleration;
        if (this.controls.reverse) this.speed += this.reverseAcceleration;

        this.speed = Math.min(Math.max(this.speed, this.maxReverseSpeed), this.maxSpeed);
    }

    #applyFriction() {
        if (this.speed > 0) {
            this.speed -= this.friction;
        } else if (this.speed < 0) {
            this.speed += this.friction;
        }

        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }
    }

    #adjustPosition() {
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    #adjustAngle() {
        if (this.speed !== 0) {
            const flip = this.speed > 0 ? 1 : -1; // 1 if going forward, -1 if going reverse
            const radius = this.speed > 0 ? 0.03 : 0.02; // 0.03 if going forward, 0.02 if going reverse

            if (this.controls.left) {
                this.angle += radius * flip;
            }
            if (this.controls.right) {
                this.angle -= radius * flip;
            }
        }
    }

    #assessDamage(roadBorders) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        return false;
    }

    draw(ctx) {
        if(this.isDamaged){
            ctx.fillStyle = "red";
        }
        else{
            ctx.fillStyle = "green";
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

        for(let i = 0; i < this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

        if(this.sensor){
            this.sensor.draw(ctx);
        }
    }
}