import { readFileSync } from 'fs';

class Point {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
}

console.log('Day 13: Distress Signal: Part 2');

const filename = "day_14_puzzle_input.txt";
const result = readFileSync(filename, 'utf-8');
const lines = result.split('\n');

let maxDown = 0;

let pathes = new Array<Array<Point>>();
lines.forEach(line => {
    let row = new Array<Point>();
    line.split('->').forEach(path => {
        let pathParts = path.trim().split(',');
        let x = parseInt(pathParts[0]);
        let y = parseInt(pathParts[1]);
        if (y > maxDown) {
            maxDown = y;
        }
        let point = new Point(x, y);
        row.push(point);
    });
    pathes.push(row);
});

maxDown += 2;

let map = new Set<string>();
pathes.forEach(path => {
    for (let index = 1; index < path.length; index++) {
        let previousPoint = path[index - 1];
        let currentPoint = path[index];

        // Draw line
        if (previousPoint.x == currentPoint.x) {
            // Vertical line
            let yMin = Math.min(previousPoint.y, currentPoint.y);
            let yMax = Math.max(previousPoint.y, currentPoint.y);
            for (let y = yMin; y <= yMax; y++) {
                map.add(currentPoint.x  + ',' + y);
            }
        } else {
            // Horizontal line
            let y = currentPoint.y;
            let xMin = Math.min(previousPoint.x, currentPoint.x);
            let xMax = Math.max(previousPoint.x, currentPoint.x);
            for (let x = xMin; x <= xMax; x++) {
                map.add(x  + ',' + currentPoint.y);
            }
        }
    }
});

let sandCount = 0;
let sandFull = false;
do {
    // Start x & y
    let x = 500;
    let y = 0;

    while (y < maxDown) {
        let nextY = y + 1;
        if(!map.has(x + ',' + nextY) && nextY != maxDown) {
            y = nextY;
        } else {
            if (!map.has((x - 1) + ',' + nextY) && nextY != maxDown) {
                y = nextY;
                x--;
            } else if (!map.has((x + 1) + ',' + nextY) && nextY != maxDown) {
                y = nextY;
                x++;
            } else { 
                sandCount++;
                map.add(x + ',' + y);
                if(y == 0) {
                    sandFull = true;
                }
                break;
            }
        }
    }

} while (!sandFull);

console.log('Sand count: ' + sandCount);