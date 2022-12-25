import { readFileSync } from 'fs';

class Point3D {
    x: number;
    y: number;
    z: number;
    surfaceArea: number;
    coord: string;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.surfaceArea = 6;
        this.coord = `${x},${y},${z}`;
    }
    
    getDistance(other: Point3D): number {
        return Math.abs(this.x - other.x) + Math.abs(this.y - other.y) +  Math.abs(this.z - other.z);
    }

    isAdjacentTo(other: Point3D): boolean {
        return this.getDistance(other) == 1;
    }
}

const shifts = [
    new Point3D(1, 0, 0),
    new Point3D(-1, 0, 0),
    new Point3D(0, 1, 0),
    new Point3D(0, -1, 0),
    new Point3D(0, 0, 1),
    new Point3D(0, 0, -1)
];

console.log('Day 18: Boiling Boulders');

const filename = "day_18_puzzle_input.txt";
const input = readFileSync(filename, 'utf-8');

let minXPoint = new Point3D(-1, -1, -1);
// Parse input
let lines = input.split('\n');
let points = new Map<string, Point3D>();
lines.forEach(line => {
    let parts = line.split(',');
    points.set(line, new Point3D(Number(parts[0]), Number(parts[1]), Number(parts[2])));
    if (minXPoint.x == - 1 || minXPoint.x > Number(parts[0])) {
        minXPoint = new Point3D(Number(parts[0]), Number(parts[1]), Number(parts[2]));
    }
});

// Part 1: Find full surface area
// Find surface area
for (let i = 0; i < lines.length; i++) {
    const firstPoint = points.get(lines[i])!;
    for (let j = i + 1; j < lines.length; j++) {
        const secondPoint = points.get(lines[j])!;
        if (firstPoint.isAdjacentTo(secondPoint)) {
            firstPoint.surfaceArea--;
            secondPoint.surfaceArea--;
        }
    }
}

let totalSurfaceArea = 0;
points.forEach(point => {
    totalSurfaceArea += point.surfaceArea;
});

console.log('Total surface area: ', totalSurfaceArea);

// Part 2: Find surface area without inside air points
function updateOuterAirPoints(point: Point3D, points: Map<string, Point3D>, outAirPoints: Map<string, Point3D>) {
    shifts.forEach(shift => {
        let neighborPoint = new Point3D(point.x + shift.x, point.y + shift.y, point.z + shift.z);
        if (!points.has(neighborPoint.coord) && !outAirPoints.has(neighborPoint.coord)) {
            outAirPoints.set(neighborPoint.coord, neighborPoint);
        }
    });
}

let neighborAirPoints = new Map<string, Point3D>();
points.forEach(point => {
    shifts.forEach(shift => {
        let neighborPoint = new Point3D(point.x + shift.x, point.y + shift.y, point.z + shift.z);
        if (!points.has(neighborPoint.coord) && !neighborAirPoints.has(neighborPoint.coord)) {
            neighborAirPoints.set(neighborPoint.coord, neighborPoint);
        }
    });
});

let minXAirPoint = new Point3D(minXPoint.x - 1, minXPoint.y, minXPoint.z);
let outAirPoints = new Map<string, Point3D>();
updateOuterAirPoints(minXAirPoint, points, outAirPoints);
neighborAirPoints.delete(minXAirPoint.coord);

let continueSearch = false;
do {
    continueSearch = false;
    for(let neighborAirPoint of neighborAirPoints) {
        for(let outAirPoint of outAirPoints) {
            if (neighborAirPoint[1].isAdjacentTo(outAirPoint[1]) || neighborAirPoint[0] == outAirPoint[0]) {
                updateOuterAirPoints(neighborAirPoint[1], points, outAirPoints)
                neighborAirPoints.delete(neighborAirPoint[0]);
                continueSearch = true;
                break;
            }
        }
    }
} while (continueSearch);

points.forEach(point => {
    neighborAirPoints.forEach(neighborAirPoint => {
        if (point.isAdjacentTo(neighborAirPoint)) {
            point.surfaceArea--;
        }
    });
});

let outSurfaceArea = 0;
points.forEach(point => {
    outSurfaceArea += point.surfaceArea;
});

console.log('Out surface area: ', outSurfaceArea);