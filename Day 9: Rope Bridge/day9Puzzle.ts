import { readFileSync, promises as fsPromises } from 'fs';

class Point {
    constructor(public x: number, public y: number) { }
}

function getDistanceBetweenPositions(point1: Point, point2: Point): number {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

function getStepByDirection(direction: string): Point {
    switch (direction) {
        case 'U':
            return new Point(0, 1);
        case 'D':
            return new Point(0, -1);
        case 'R':
            return new Point(1, 0);
        case 'L':
            return new Point(-1, 0);
    }
    return new Point(0, 0);
}

console.log("Day 9: Rope Bridge");

const filename = "day_9_puzzle_input.txt";
const result = readFileSync(filename, 'utf-8');
const lines = result.split('\n');

// Part 1: 2 knots
// Part 2: 10 knots
const numberOfKnots = 10;

let knotsPositions = new Array<Point>();

for (let index = 0; index < numberOfKnots; index++) {
    knotsPositions[index] = new Point(0, 0);
}

let lastKnotPositions = new Set<string>();
lastKnotPositions.add(knotsPositions[numberOfKnots - 1].x + "," + knotsPositions[numberOfKnots - 1].y);

lines.forEach(line => {
    let command = line.split(' ');
    let step = getStepByDirection(command[0]);
    for (let stepIndex = 0; stepIndex < parseInt(command[1]); stepIndex++) {

        // Move head
        knotsPositions[0].x += step.x;
        knotsPositions[0].y += step.y;
        
        // Move knots
        for (let knotIndex = 1; knotIndex < numberOfKnots; knotIndex++) {
            let distance = getDistanceBetweenPositions(knotsPositions[knotIndex], knotsPositions[knotIndex - 1]);

            if (distance >= 2) {
                let diffX = knotsPositions[knotIndex - 1].x - knotsPositions[knotIndex].x;
                let diffY = knotsPositions[knotIndex - 1].y - knotsPositions[knotIndex].y;
    
                if(diffX > 0) {
                    knotsPositions[knotIndex].x += 1;
                } else if(diffX < 0) {
                    knotsPositions[knotIndex].x -= 1;
                }
    
                if(diffY > 0) {
                    knotsPositions[knotIndex].y += 1;
                } else if(diffY < 0) {
                    knotsPositions[knotIndex].y -= 1;
                }
            }
        }
        lastKnotPositions.add(knotsPositions[numberOfKnots - 1].x + "," + knotsPositions[numberOfKnots - 1].y);
    }
});

console.log("Tail visited " + lastKnotPositions.size + " positions.");