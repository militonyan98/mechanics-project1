"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Car = function Car() {
    _classCallCheck(this, Car);
};

var Intersection = function Intersection() {
    _classCallCheck(this, Intersection);
};

var calculateBehaviour = function calculateBehaviour(car, intersection, distanceFromIntersection) {
    /*let D = car.initialSpeed * car.initialSpeed + 2*car.accelaration*(distanceFromIntersection+intersection.width);
    let t = (-car.initialSpeed - Math.sqrt(D))/car.accelaration;
    console.log(t);*/
    var distanceAccelerating = calculateDistanceInT(car.initialSpeed, car.accelaration, intersection.yellowLightDuration);
    if (distanceAccelerating >= intersection.width + distanceFromIntersection) return 'We can pass';
    var stopTime = calculateStopTime(car.initialSpeed, car.decelaration);
    var distanceDecelerating = calculateDistanceInT(car.initialSpeed, -car.decelaration, stopTime);
    if (distanceDecelerating <= distanceFromIntersection) return 'We should probably stop';
    return 'It\'s gonna be a terrible crash';
};

var calculateBehaviourWithMaxSpeed = function calculateBehaviourWithMaxSpeed(car, intersection, distanceFromIntersection) {
    /*let D = car.initialSpeed * car.initialSpeed + 2*car.accelaration*(distanceFromIntersection+intersection.width);
    let t = (-car.initialSpeed - Math.sqrt(D))/car.accelaration;
    console.log(t);*/
    var distanceAccelerating = calculateDistanceInTWithMaxSpeed(car.initialSpeed, car.accelaration, car.maxSpeed, intersection.yellowLightDuration);
    if (distanceAccelerating >= intersection.width + distanceFromIntersection) return 'We can pass';
    var stopTime = calculateStopTime(car.initialSpeed, car.decelaration);
    console.log('Time needed for stopping: ' + stopTime);
    var distanceDecelerating = calculateDistanceInT(car.initialSpeed, -car.decelaration, stopTime);
    if (distanceDecelerating <= distanceFromIntersection) return 'We should probably stop';
    return 'It\'s gonna be a terrible crash';
};

var calculateDistanceInT = function calculateDistanceInT(initialSpeed, acceleration, t) {
    return (initialSpeed + acceleration * t / 2) * t;
};

var calculateTimeToPass = function calculateTimeToPass(initialSpeed, acceleration, distance) {
    var D = initialSpeed * initialSpeed + 2 * acceleration * distance;
    var t = (-initialSpeed + Math.sqrt(D)) / acceleration;
    return t;
};

var calculateDistanceInTWithMaxSpeed = function calculateDistanceInTWithMaxSpeed(initialSpeed, acceleration, vMax, t) {
    var tToReachMax = (vMax - initialSpeed) / acceleration;
    console.log(vMax - initialSpeed);
    console.log('To reach max ' + tToReachMax);
    if (tToReachMax >= t) return calculateDistanceInT(initialSpeed, acceleration, t);
    var tFirst = tToReachMax;
    var tLast = t - tToReachMax;
    console.log(tFirst + ' + ' + tLast + ' = ' + t);
    return calculateDistanceInT(initialSpeed, acceleration, tFirst) + vMax * tLast;
};

var calculateStopTime = function calculateStopTime(initialSpeed, deceleration) {
    return initialSpeed / deceleration;
};

var calculateForTwoCars = function calculateForTwoCars(car1, car2, intersection, distanceBetween, distanceToIntersection) {
    var t1Accelerating = calculateTimeToPass(car1.initialSpeed, car1.accelaration, intersection.width + distanceToIntersection);
    var t2Accelerating = calculateTimeToPass(car2.initialSpeed, car2.accelaration, intersection.width + distanceToIntersection + distanceBetween);

    if (t1Accelerating > t2Accelerating) {
        if (t2Accelerating > intersection.yellowLightDuration) {
            return 'Both cars accelerate to pass';
        } else {
            if (t1Accelerating > intersection.yellowLightDuration) {
                var stopTime = calculateStopTime(car2.initialSpeed, car2.decelaration);
                console.log('Time needed for stopping: ' + stopTime);
                var distanceDecelerating = calculateDistanceInT(car2.initialSpeed, -car2.decelaration, stopTime);

                if (distanceDecelerating < distanceToIntersection + distanceBetween) {
                    return 'Car1 accelerate, Car2 stop';
                }
            } else {
                var stopDistance1 = calculateStopDistance(car1);
                var stopDistance2 = calculateStopDistance(car2);
                if (stopDistance2 > stopDistance1 + distanceBetween) return 'Cars gonna crash';
                if (stopDistance1 < distanceToIntersection && stopDistance2 < distanceToIntersection + distanceBetween) return 'Cars stop';
            }
        }
    } else {
        var distance = calculateDistanceInT(car2.initialSpeed, car2.initialSpeed, t1Accelerating);

        if (t1Accelerating < intersection.yellowLightDuration) {
            if (distance >= intersection.width + distanceToIntersection + distanceBetween) {
                return 'Both cars accelerate to pass';
            } else {
                var _stopDistance = calculateStopDistance(car2);

                if (_stopDistance < distanceToIntersection + distanceBetween) {
                    return 'Car1 accelerate, Car2 stop';
                } else return 'Car1 accelerate, Car2 crash';
            }
        } else {
            var _stopDistance2 = calculateStopDistance(car1);

            var _stopDistance3 = calculateStopDistance(car2);

            if (_stopDistance3 > _stopDistance2 + distanceBetween) return 'Cars gonna crash';
            if (_stopDistance2 < distanceToIntersection && _stopDistance3 < distanceToIntersection + distanceBetween) return 'Cars stop';
        }
    }

    return 'Very bad scenario that I did not think of';
};

var calculateStopDistance = function calculateStopDistance(car) {
    var stopTime = calculateStopTime(car.initialSpeed, car.decelaration);
    console.log('Time needed for stopping: ' + stopTime);
    var distanceDecelerating = calculateDistanceInT(car.initialSpeed, -car.decelaration, stopTime);
    return distanceDecelerating;
};

var findSolution = function findSolution(initialSpeed, acceleration, decelaration, maxSpeed, width, yellowLightDuration, distanceFromIntersection, considerMax) {
    var car = new Car();
    car.initialSpeed = initialSpeed * 1000 / 3600;;
    car.accelaration = acceleration;
    car.decelaration = decelaration;
    car.maxSpeed = maxSpeed * 1000 / 3600;;
    var intersection = new Intersection();
    intersection.width = width;
    intersection.yellowLightDuration = yellowLightDuration;
    let result = '';
    if (!considerMax) result = calculateBehaviour(car, intersection, distanceFromIntersection);
    else result = calculateBehaviourWithMaxSpeed(car, intersection, distanceFromIntersection);
    $('#Result').text(result);
    return result;
};

var findSolution2Cars = function findSolution2Cars(initialSpeed1, acceleration1, decelaration1, initialSpeed2, acceleration2, decelaration2, width, yellowLightDuration, distanceFromIntersection, distanceBetween) {
    var car1 = new Car();
    car1.initialSpeed = initialSpeed1 * 1000 / 3600;;
    car1.accelaration = acceleration1;
    car1.decelaration = decelaration1;
    var car2 = new Car();
    car2.initialSpeed = initialSpeed2 * 1000 / 3600;;
    car2.accelaration = acceleration2;
    car2.decelaration = decelaration2;
    var intersection = new Intersection();
    intersection.width = width;
    intersection.yellowLightDuration = yellowLightDuration;
    let result = calculateForTwoCars(car1, car2, intersection, distanceBetween, distanceFromIntersection);
    $('#Result').text(result);
    return result;
};

window.onload = function() {
    //$('Result').val(findSolution(70, 2, 2, 70, 50, 3, 50, true));
};