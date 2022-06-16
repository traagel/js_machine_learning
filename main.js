const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
carCanvas.width=200;



const ctx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2,carCanvas.width*0.9);

//const car = new Car(road.getLaneCenter(1),100,30,50,"AI");
const N = 500;
const cars = generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!==0){
            NeuralNetwork.mutate(cars[i].brain,0.2);
        }
    }
}
const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2.5),
    new Car(road.getLaneCenter(2),-100,30,50,"DUMMY",1.2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",1.5),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",3),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",3.1),
    new Car(road.getLaneCenter(0),-800,30,50,"DUMMY",1.3),
    new Car(road.getLaneCenter(1),-1100,30,50,"DUMMY",2.2),
    new Car(road.getLaneCenter(2),-1300,30,50,"DUMMY",2.1),
    new Car(road.getLaneCenter(0),-1500,30,50,"DUMMY",2.6)
];

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }

    for (let i =0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y===Math.min(...cars.map(c=>c.y)
        ));

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    ctx.save();
    ctx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(ctx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(ctx, "red");
    }
    ctx.globalAlpha=0.2;
    for (let i =0;i<cars.length;i++){
        cars[i].draw(ctx, "blue");
    }
    ctx.globalAlpha=1;
    bestCar.draw(ctx,"blue",true);

    ctx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}

