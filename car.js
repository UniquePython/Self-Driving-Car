class Car {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.reverseAcceleration = -0.1;
        this.maxSpeed = 2;
        this.maxReverseSpeed = -1;
        this.friction = 0.01;
        this.angle = 0;

        this.controls = new Controls();
    }

    update() {
        this.#move();
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

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        ctx.fill();

        ctx.restore();
    }
}