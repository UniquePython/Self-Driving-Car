const canvas = document.getElementById('myCanvas');
canvas.width = 200;

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width*0.925);

const N = 1000;
const cars = generateCars(N);
let bestCar = cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0; i < cars.length; i++){
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
        if (i!=0) {
            NeuralNetwork.mutate(cars[i].brain, 0.2);
        }
    }
}


const traffic = [];
let lastTrafficY = 100;

function generateTraffic() {
    if (traffic.length === 0 || bestCar.y < lastTrafficY + 300) { 
        const lanePositions = [0, 1, 2]; // Possible lanes
        const newTrafficY = lastTrafficY - 300; // Ensures at least 100 units apart

        // Shuffle lane positions randomly to create diverse traffic patterns
        lanePositions.sort(() => Math.random() - 0.5);
        
        // Decide how many cars to place in this batch (1 to 2 cars per row)
        const carsInRow = Math.floor(Math.random() * 2) + 1;

        for (let i = 0; i < carsInRow; i++) {
            traffic.push(new Car(road.getLaneCenter(lanePositions[i]), newTrafficY, 30, 50, "DUMMY", 2));
        }

        lastTrafficY = newTrafficY; // Update the last generated traffic position
    }
}


animate();

function save(){
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars = [];
    for(let i = 1; i <= N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
} 


function animate(){
    generateTraffic();

    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    while (traffic.length > 0 && traffic[0].y > bestCar.y + 500) {
        traffic.shift();
    }

    for(let i = 0; i < cars.length; i++){
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find(c=>c.y==Math.min(...cars.map(c=>c.y)));

    canvas.height = window.innerHeight;

    ctx.save();

    ctx.translate(0, -bestCar.y+canvas.height*0.7);

    road.draw(ctx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx, "blue");
    }
    
    ctx.globalAlpha = 0.2;
    for(let i = 0; i < cars.length; i++){
        cars[i].draw(ctx, "green");
    }
    ctx.globalAlpha = 1;
    bestCar.draw(ctx, "green", true);

    ctx.restore();
    requestAnimationFrame(animate);
}