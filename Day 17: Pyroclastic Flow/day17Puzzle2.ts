import { readFileSync } from 'fs';

console.log('Day 17: Pyroclastic Flow - Part 2');

class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

// Rock
class Rock {
    height: number;
    width: number;
    points: Point[];

    constructor(height: number, width: number, shapePoints: Point[]) {
        this.height = height;
        this.width = width;
        this.points = shapePoints;
    }
}

function hasCollision(rock: Rock,surfaceMap: Array<Set<number>>, left: number, bottom: number): boolean {
    for (let element of rock.points) {
        if(surfaceMap[left + element.x].has(bottom + rock.height - element.y - 1)) {
            return true;
        }
    }         
    return false;
}

let rocks: Rock[] = new Array<Rock>();
// Add rock with shape 
// '####'
rocks.push(new Rock(1, 4, [new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(3, 0)]));
// Add rock with shape
// '.#.'
// '###'
// '.#.'
rocks.push(new Rock(3, 3, [new Point(0, 1), new Point(1, 0), new Point(1, 1), new Point(1, 2), new Point(2, 1)]));
// Add rock with shape
// '..#'
// '..#'
// '###'
rocks.push(new Rock(3, 3, [new Point(2, 0), new Point(2, 1), new Point(0, 2), new Point(1, 2), new Point(2, 2)]));
// Add rock with shape
// '#'
// '#'
// '#'
// '#'
rocks.push(new Rock(4, 1, [new Point(0, 0), new Point(0, 1), new Point(0, 2), new Point(0, 3)]));
// Add rock with shape
// '##'
// '##'
rocks.push(new Rock(2, 2, [new Point(0, 0), new Point(0, 1), new Point(1, 0), new Point(1, 1)]));

const filename = "day_17_puzzle_input.txt";
const pushes = readFileSync(filename, 'utf-8');

// Simulate the rock falling
let chamberWidth = 7;
let bottomIndecies: number[] = new Array<number>(chamberWidth);
let surfaceMap = new Array<Set<number>>();
for (let index = 0; index < chamberWidth; index++) {
    let set = new Set<number>();
    set.add(0);
    surfaceMap.push(set);

    bottomIndecies[index] = 0;
}

let pushesIndex = 0;
let bottomMax = 0;

let horizontalShift = 2;
let verticalShift = 4;

let maxLength = pushes.length * rocks.length;
let maxSize = maxLength * 2 + 1;
let maxHights = new Array<number>(maxSize);

for (let index = 0; index < maxSize; index++) {
    let rock = rocks[index % rocks.length];
    let left = horizontalShift;
    let bottom = bottomMax + verticalShift;
    
    let stopFall = false;
    let fallIndex = 0;
    do {
        pushesIndex = pushesIndex % pushes.length;
        const push = pushes[pushesIndex];
        if(push === '<' && left > 0) {
            let haveCollision = hasCollision(rock, surfaceMap, left - 1, bottom);
            if(!haveCollision) {
                left--;
            }
        } else if(push === '>' && left < chamberWidth - rock.width) {
            let haveCollision = hasCollision(rock, surfaceMap, left + 1, bottom);
            if(!haveCollision) {
                left++;
            }
        }
        pushesIndex++;
        if(fallIndex > 2) {
            stopFall = hasCollision(rock, surfaceMap, left, bottom - 1);
            if(stopFall) {
                // Add rock to surface map
                rock.points.forEach(element => {
                    let rockPart = bottom + rock.height - element.y - 1;
                    surfaceMap[left + element.x].add(rockPart);
                    if(rockPart > bottomMax) {
                        bottomMax = rockPart;
                    }
                });
                // Fill maxHights
                maxHights[index] = bottomMax;
                break;
            }
        }   
        bottom--;
        fallIndex++;
    } while(!stopFall);
}

// Find period in maxHights
let period = -1;
let startIndex = -1;
for(let index = 0; index < maxLength; index++) {
    let isPeriod = true;
    for(let offset = 1; offset < maxLength; offset++) {
        let diff = maxHights[index + offset] - maxHights[index];
        isPeriod = true;

        for(let periodIndex = index + 1; periodIndex + offset < maxSize; periodIndex++) {
            let currentDiff = maxHights[periodIndex + offset] - maxHights[periodIndex];
            if(diff !== currentDiff) {
                isPeriod = false;
                break;
            }
        }
        if(isPeriod) {
            period = offset;
            startIndex = index;
            break;
        }
    }
    if(isPeriod) {
        break;
    }
}

let totalRocks = 1_000_000_000_000;
let periodHeight = maxHights[startIndex + period] - maxHights[startIndex];
let quotient = Math.floor(totalRocks/period);
let outOfCycleRocks = totalRocks % period;
let height = maxHights[outOfCycleRocks - 1] + periodHeight * quotient;

console.log('Units tall: ', height);