import { readFileSync } from 'fs';

class Point {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
}

console.log('Day 13: Distress Signal: Part 1');

const filename = "day_14_puzzle_input.txt";
const result = readFileSync(filename, 'utf-8');
const lines = result.split('\n');

let minRight = 0;
let maxRight = 0;
let maxDown = 0;

let pathes = new Array<Array<Point>>();
lines.forEach(line => {
    let row = new Array<Point>();
    line.split('->').forEach(path => {
        let pathParts = path.trim().split(',');
        let x = parseInt(pathParts[0]);
        let y = parseInt(pathParts[1]);
        if (x < minRight || minRight == 0) {
            minRight = x;
        }
        if (x > maxRight) {
            maxRight = x;
        }
        if (y > maxDown) {
            maxDown = y;
        }
        let point = new Point(x, y);
        row.push(point);
    });
    pathes.push(row);
});

// Draw map
let map = new Array<Array<string>>();
for (let y = 0; y <= maxDown; y++) {
    let row = new Array<string>();
    for (let x = 0; x <= maxRight - minRight; x++) {
        row.push('.');
    }
    map.push(row);
}

pathes.forEach(path => {
    for (let index = 1; index < path.length; index++) {
        let previousPoint = path[index - 1];
        let currentPoint = path[index];

        // Draw line
        if (previousPoint.x == currentPoint.x) {
            // Vertical line
            let x = currentPoint.x - minRight;
            let yMin = Math.min(previousPoint.y, currentPoint.y);
            let yMax = Math.max(previousPoint.y, currentPoint.y);
            for (let y = yMin; y <= yMax; y++) {
                map[y][x] = '#';
            }
        } else {
            // Horizontal line
            let y = currentPoint.y;
            let xMin = Math.min(previousPoint.x, currentPoint.x);
            let xMax = Math.max(previousPoint.x, currentPoint.x);
            for (let x = xMin; x <= xMax; x++) {
                map[y][x - minRight] = '#';
            }
        }
    }
});


let sandCount = 0;
let sandFall = false;
do {
    // Start x & y
    let x = 500 - minRight;
    let y = 0;

    while (y < map.length) {
        let nextY = y + 1;
        if (nextY >= map.length) {
            sandFall = true;
            break;
        }
        if (map[nextY][x] == '.') {
            y = nextY;
        } else if (map[nextY][x] == '#' || map[nextY][x] == 'o') {
            if(x - 1 < 0) {
                sandFall = true;
                break;
            } else if (map[nextY][x - 1] == '.') {
                y = nextY;
                x--;
            } else if(x + 1 >= map[y].length) {
                sandFall = true;
                break;
            } else if (map[nextY][x + 1] == '.') {
                y = nextY;
                x++;
            } else { 
                sandCount++;
                map[y][x] = 'o';
                break;
            }
        }
    }
} while (!sandFall);

console.log('Sand count: ' + sandCount);