import { readFileSync, promises as fsPromises } from 'fs';

function getSignalStrength(xValue: number, cycle: number): number {
    if (cycle == 20 || cycle == 60 || cycle == 100 || cycle == 140 || cycle == 180 || cycle == 220) { 
        return xValue * cycle;
    }
    return 0;
}

function getPixelDraw(xValue: number, position: number): string {
    let linePosition = position;
    while (linePosition >= 40) {
        linePosition -= 40
    }
    if (xValue === linePosition || (xValue + 1) === linePosition || (xValue - 1) === linePosition) {
        return "#";
    }
    return ".";
}

console.log('Day 10: Cathode-Ray Tube');

const filename = "day_10_puzzle_input.txt";
const result = readFileSync(filename, 'utf-8');
const lines = result.split('\n');

let sumSignalStrength = 0;
let xValue = 1;
let cycle = 0;

let output = "";
lines.forEach(line => {
    if (line == 'noop') {
        output += getPixelDraw(xValue, cycle);
        cycle += 1; 
        sumSignalStrength += getSignalStrength(xValue, cycle + 1);
    } else {
        // First cycle  
        output += getPixelDraw(xValue, cycle);
        cycle += 1;
        sumSignalStrength += getSignalStrength(xValue, cycle + 1);
        // Second cycle
        output += getPixelDraw(xValue, cycle);
        const addXValue = line.split(' ')[1];
        xValue += parseInt(addXValue);
        cycle += 1;
        sumSignalStrength += getSignalStrength(xValue, cycle + 1);
    }
});

// Part 1
console.log('Sum of signal strength: ' + sumSignalStrength);

// Part 2
let outputLine = output[0];
for (let index = 1; index < output.length; index++) {
    outputLine += output[index];
    if ((index + 1) % 40 == 0) { 
        console.log(outputLine);
        outputLine = "";
    }
}