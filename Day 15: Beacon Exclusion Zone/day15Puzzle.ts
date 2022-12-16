import { readFileSync } from 'fs';

class Point {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
}

class Pair {
    sensor: Point;
    beacon: Point;
    distance: number;

    constructor(sensor: Point, beacon: Point, distance: number) {
        this.sensor = sensor;
        this.beacon = beacon;
        this.distance = distance;
    }
}


console.log('Day 15: Beacon Exclusion Zone');

const filename = "day_15_puzzle_input.txt";
const result = readFileSync(filename, 'utf-8');
const lines = result.split('\n');

let minX = 0;
let maxX = 0;

let pairs = new Array<Pair>();
lines.forEach(line => {
    let lineParts = line.split('x=');
    let sensorX = parseInt(lineParts[1].split(',')[0]);
    let sensorY = parseInt(lineParts[1].split('y=')[1].split(':')[0]);
    let sensor = new Point(sensorX, sensorY);
    if (sensorX < minX || minX == 0) {
        minX = sensorX;
    }
    if (sensorX > maxX) {
        maxX = sensorX;
    }

    let beaconX = parseInt(lineParts[2].split(',')[0]);
    let beaconY = parseInt(lineParts[2].split('y=')[1]);
    let beacon = new Point(beaconX, beaconY);
    if (beaconX < minX || minX == 0) {
        minX = beaconX;
    }
    if (beaconX > maxX) {
        maxX = beaconX;
    }

    let distance = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
    let pair = new Pair(sensor, beacon, distance);
    pairs.push(pair);

});

// Find count of positions cannot contain a beacon in row y = 2000000
let count = 0;
let y = 10;
for (let x = minX; x <= maxX; x++) {
    let point = new Point(x, y);

    let isPossible = true;
    for (let index = 0; index < pairs.length; index++) {
        const pair = pairs[index];
        let distance = Math.abs(point.x - pair.sensor.x) + Math.abs(point.y - pair.sensor.y);
        if (point.x == pair.beacon.x && point.y == pair.beacon.y) {
            console.log("Equal position beacon: " , point);
            console.log("Pair: " , pair);
            continue;
        }
        if (distance <= pair.distance) {
            isPossible = false;
            break;
        }
    }
    
    if (isPossible) {
        //console.log("Possible position: " , point);
        count++;
    } 
}

console.log(maxX);
console.log(minX);

console.log("Count of imposible positions: " , maxX - minX + 1 - count);
