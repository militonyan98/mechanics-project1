class Car {
    initialSpeed: number;
    accelaration: number;
    decelaration: number;
    maxSpeed : number;
}

class Intersection {
    width: number;
    yellowLightDuration: number;
}

let calculateBehaviour = function(car: Car, intersection: Intersection, distanceFromIntersection: number) {
    /*let D = car.initialSpeed * car.initialSpeed + 2*car.accelaration*(distanceFromIntersection+intersection.width);
    let t = (-car.initialSpeed - Math.sqrt(D))/car.accelaration;
    console.log(t);*/
    let distanceAccelerating = calculateDistanceInT(car.initialSpeed, car.accelaration, intersection.yellowLightDuration);
  

    if(distanceAccelerating>=intersection.width+distanceFromIntersection)
        return 'We can pass';

    let stopTime = calculateStopTime(car.initialSpeed,car.decelaration);
    let distanceDecelerating = calculateDistanceInT(car.initialSpeed, -car.decelaration, stopTime);

    if(distanceDecelerating<=distanceFromIntersection)
        return 'We should probably stop';
    
    return 'It\'s gonna be a terrible crash';
}


let calculateBehaviourWithMaxSpeed = function(car: Car, intersection: Intersection, distanceFromIntersection: number) {
    /*let D = car.initialSpeed * car.initialSpeed + 2*car.accelaration*(distanceFromIntersection+intersection.width);
    let t = (-car.initialSpeed - Math.sqrt(D))/car.accelaration;
    console.log(t);*/
     let distanceAccelerating = calculateDistanceInTWithMaxSpeed(car.initialSpeed, car.accelaration,car.maxSpeed, intersection.yellowLightDuration);
  

    if(distanceAccelerating>=intersection.width+distanceFromIntersection)
        return 'We can pass';

    let stopTime = calculateStopTime(car.initialSpeed,car.decelaration);
    console.log('Time needed for stopping: '+stopTime);
    let distanceDecelerating = calculateDistanceInT(car.initialSpeed, -car.decelaration, stopTime);
    
    if(distanceDecelerating<=distanceFromIntersection)
        return 'We should probably stop';
    
    return 'It\'s gonna be a terrible crash';
}

let calculateDistanceInT = function (initialSpeed: number, acceleration: number, t:number){
    return (initialSpeed + acceleration*t/2)*t;
}

let calculateTimeToPass = function(initialSpeed:number, acceleration:number, distance:number){
    let D = initialSpeed * initialSpeed + 2*acceleration*(distance);
    let t = (-initialSpeed + Math.sqrt(D))/acceleration;
    return t;
}

let calculateDistanceInTWithMaxSpeed = function (initialSpeed: number, acceleration: number, vMax : number, t:number){
    let tToReachMax = (vMax - initialSpeed)/acceleration;
    console.log(vMax - initialSpeed);
    console.log('To reach max ' + tToReachMax);
    if(tToReachMax>=t)
        return calculateDistanceInT(initialSpeed, acceleration, t);
    let tFirst = tToReachMax;
    let tLast = t - tToReachMax;
    console.log(tFirst + ' + ' + tLast + ' = ' + t);
    return calculateDistanceInT(initialSpeed, acceleration, tFirst) + vMax*tLast;
}

let calculateStopTime = function(initialSpeed:number, deceleration:number){
    return initialSpeed/deceleration;
};

let calculateForTwoCars = function(car1:Car, car2:Car, intersection:Intersection,distanceBetween:number, distanceToIntersection:number)
{
    var t1Accelerating = calculateTimeToPass(car1.initialSpeed, car1.accelaration, intersection.width + distanceToIntersection);
    var t2Accelerating = calculateTimeToPass(car2.initialSpeed, car2.accelaration, intersection.width+distanceToIntersection+distanceBetween);

    if(t1Accelerating>t2Accelerating){
        if(t2Accelerating>intersection.yellowLightDuration){
            return 'Both cars accelerate to pass';
        }
        else
        {
            if(t1Accelerating>intersection.yellowLightDuration)
            {
                
                let stopTime = calculateStopTime(car2.initialSpeed,car2.decelaration);
                console.log('Time needed for stopping: '+stopTime);
                let distanceDecelerating = calculateDistanceInT(car2.initialSpeed, -car2.decelaration, stopTime);
                if(distanceDecelerating<distanceToIntersection+distanceBetween)
                {
                    return 'Car1 accelerate, Car2 stop';
                }
            }
            else
            {
                let stopDistance1 = calculateStopDistance(car1);
                let stopDistance2 = calculateStopDistance(car2);
                if(stopDistance2>stopDistance1+distanceBetween)
                    return 'Cars gonna crash';
                if(stopDistance1<distanceToIntersection && stopDistance2<distanceToIntersection+distanceBetween)
                    return 'Cars stop';
            }
        }
    }
    else{
        let distance = calculateDistanceInT(car2.initialSpeed,car2.initialSpeed,t1Accelerating);
        if(t1Accelerating<intersection.yellowLightDuration){
            if(distance>=intersection.width+distanceToIntersection+distanceBetween){
                return 'Both cars accelerate to pass';
            }
            else
            {
                let stopDistance2 = calculateStopDistance(car2);
                if(stopDistance2<distanceToIntersection+distanceBetween){
                    return 'Car1 accelerate, Car2 stop';
                }
                else
                    return 'Car1 accelerate, Car2 crash';
            }
        }
        else {
            let stopDistance1 = calculateStopDistance(car1);
            let stopDistance2 = calculateStopDistance(car2);
            if(stopDistance2>stopDistance1+distanceBetween)
                return 'Cars gonna crash';
            if(stopDistance1<distanceToIntersection && stopDistance2<distanceToIntersection+distanceBetween)
                return 'Cars stop';
        }
    }
    return 'Very bad scenario that I did not think of';
}

let calculateStopDistance = function(car:Car){
    let stopTime = calculateStopTime(car.initialSpeed,car.decelaration);
    console.log('Time needed for stopping: '+stopTime);
    let distanceDecelerating = calculateDistanceInT(car.initialSpeed, -car.decelaration, stopTime);
    return distanceDecelerating;
}

let findSolution = function(initialSpeed: number, acceleration: number, decelaration: number, maxSpeed:number, width:number, yellowLightDuration: number, distanceFromIntersection: number, considerMax : boolean){
    let car= new Car();
    car.initialSpeed = initialSpeed * 1000 / 3600;;
    car.accelaration = acceleration;
    car.decelaration = decelaration;
    car.maxSpeed = maxSpeed  * 1000 / 3600;;
    let intersection = new Intersection();
    intersection.width = width;
    intersection.yellowLightDuration = yellowLightDuration;
    if(!considerMax)
        return calculateBehaviour(car, intersection, distanceFromIntersection);
    else
        return calculateBehaviourWithMaxSpeed(car, intersection, distanceFromIntersection);
}

let findSolution2Cars = function(initialSpeed1: number, acceleration1: number, decelaration1: number, initialSpeed2: number, acceleration2: number, decelaration2: number,  width:number, yellowLightDuration: number, distanceFromIntersection: number, distanceBetween : number){
    let car1= new Car();
    car1.initialSpeed = initialSpeed1 * 1000 / 3600;;
    car1.accelaration = acceleration1;
    car1.decelaration = decelaration1;
    let car2 = new Car();
    car2.initialSpeed = initialSpeed2 * 1000 / 3600;;
    car2.accelaration = acceleration2;
    car2.decelaration = decelaration2;
    let intersection = new Intersection();
    intersection.width = width;
    intersection.yellowLightDuration = yellowLightDuration;
    return calculateForTwoCars(car1,car2,intersection,distanceBetween,distanceFromIntersection);
}

window.onload = ()=>{
    console.log(findSolution(70, 2, 2, 70, 50, 3, 50, true));
};