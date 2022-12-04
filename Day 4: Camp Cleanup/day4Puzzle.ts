import { readFileSync, promises as fsPromises } from 'fs';

console.log("Day 4: Camp Cleanup");

const filename = "day_4_puzzle_input.txt";

const result = readFileSync(filename, 'utf-8');
const lines = result.split('\n');

var fullyContainsPairs : number = 0;
var overlappingPairs : number = 0;
lines.forEach(line => {
    const firstAssignment = line.split(',')[0];
    const secondAssignment = line.split(',')[1];

    const leftFirst = parseInt(firstAssignment.split('-')[0]);
    const rightFirst = parseInt(firstAssignment.split('-')[1]);

    const leftSecond = parseInt(secondAssignment.split('-')[0]);
    const rightSecond = parseInt(secondAssignment.split('-')[1]);

    if((leftFirst <= leftSecond && rightFirst >= rightSecond) || 
    (leftFirst >= leftSecond && rightFirst <= rightSecond)) {
        fullyContainsPairs++;
    }

    if((leftFirst >= leftSecond && leftFirst <= rightSecond) ||
     (rightFirst >= leftSecond && rightFirst <= rightSecond) ||
     (leftSecond  >= leftFirst && leftSecond <= rightFirst) ||
     (rightSecond >= leftFirst && rightSecond <= rightFirst)) {
        overlappingPairs++;
    } 
});

console.log("Fully contains pairs: " + fullyContainsPairs);
console.log("Overlapping pairs: " + overlappingPairs);
