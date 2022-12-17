import { readFileSync } from 'fs';

class Point {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
}

class SensorBeaconPair {
    sensor: Point;
    beacon: Point;
    distance: number;

    constructor(sensor: Point, beacon: Point) {
        this.sensor = sensor;
        this.beacon = beacon;
        this.distance = Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y);
    }
}


console.log('Day 15: Beacon Exclusion Zone part 2');

const filename = "day_15_puzzle_input.txt";
const result = readFileSync(filename, 'utf-8');
const lines = result.split('\n');

let minX = 0;
let maxX = 0;


let pairs = new Array<SensorBeaconPair>();
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

    let pair = new SensorBeaconPair(sensor, beacon);
    pairs.push(pair);

});

let hideBeaconX: [number, number] = [0, 0];
for (let y = 0; y < 4000000; y++) {
    let intervals = new Array<[number, number]>(); // [start, end]
    pairs.forEach(pair => {
        if (Math.abs(pair.sensor.y - y) <= pair.distance) {
            let first = pair.sensor.x + pair.distance - Math.abs(pair.sensor.y - y);
            let second = pair.sensor.x - pair.distance + Math.abs(pair.sensor.y - y);
            if (first < first) {
                intervals.push([first, second]);
            } else {
                intervals.push([second, first]);
            }

        }
    });

    intervals.sort((a, b) => {
        return a[0] - b[0] ? a[0] - b[0] : a[1] - b[1];
    });

    // Exclude overlapping intervals
    let i = 0;
    while (i < intervals.length - 1) {
        let current = intervals[i];
        let next = intervals[i + 1];
        if (current[1] >= next[0]) {
            if (current[1] >= next[1]) {
                intervals.splice(i + 1, 1);
            } else {
                current[1] = next[1];
                intervals.splice(i + 1, 1);
            }
        } else {
            i++;
        }
    }

    if(intervals.length > 1) {
        hideBeaconX = [intervals[0][1] + 1, y];
        break;
    }
}

console.log('Tuning frequency: ', hideBeaconX[0] * 4000000 + hideBeaconX[1]);
