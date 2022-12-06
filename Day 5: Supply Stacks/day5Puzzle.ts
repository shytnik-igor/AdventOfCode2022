import { readFileSync, promises as fsPromises } from 'fs';

console.log("Day 5: Supply Stacks");

const filename = "day_5_puzzle_input.txt";

const result = readFileSync(filename, 'utf-8');
const lines = result.split('\n');

const stacksCrateMover9000 : string[][] = [];
var stacksCrateMover9001 : string[][] = [];

var stacksCount = (lines[0].length + 1) / 4;
var stopInitStacks = false;
lines.forEach((line) => {
    // Check if we have to stop initializing stacks
    if(!stopInitStacks && line.length != 0) {
        // Check if second symbol is number
        if(!isNaN(parseInt(line[1]))) {
            stopInitStacks = true;
        // If not, add new stack
        } else {
            for(var i = 0; i < stacksCount; i++) {
                if(stacksCrateMover9000[i] == undefined) {
                    stacksCrateMover9000[i] = [];
                    stacksCrateMover9001[i] = [];
                }
                const item = line[i * 4 + 1];
                if(item !== " ") {
                    stacksCrateMover9000[i].push(item);
                    stacksCrateMover9001[i].push(item);
                }
            }
        }
    } else if(line.length != 0) {
        // If we have to stop initializing stacks, we can start processing commands
        
        // Split command into parts
        var command = line.split(' ');
        const count = parseInt(command[1]);
        const from = parseInt(command[3]) - 1;
        const to = parseInt(command[5]) - 1;

        // Move items from one stack to another with reversed order
        const movedWithCrateMover9000 = stacksCrateMover9000[from].splice(0, count);
        const movedReversed = movedWithCrateMover9000.reverse();
        stacksCrateMover9000[to] = movedReversed.concat(stacksCrateMover9000[to]);

        // Move items from one stack to another without reversed order
        const movedWithCrateMover9001 = stacksCrateMover9001[from].splice(0, count);
        stacksCrateMover9001[to] = movedWithCrateMover9001.concat(stacksCrateMover9001[to]);
    }
});

var messageCrateMover9000 = "";
var messageCrateMover9001 = "";

for (let index = 0; index < stacksCount; index++) {
    // Take first elemnt from each stack after processing commands Crate Mover 9000
    messageCrateMover9000 += stacksCrateMover9000[index][0];
    // Take first elemnt from each stack after processing commands Crate Mover 9001
    messageCrateMover9001 += stacksCrateMover9001[index][0];
}

// Print messages
console.log("First part of puzzle: " + messageCrateMover9000);
console.log("Second part of puzzle: " + messageCrateMover9001);