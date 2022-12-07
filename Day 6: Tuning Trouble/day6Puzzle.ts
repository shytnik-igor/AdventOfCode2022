import { readFileSync, promises as fsPromises } from 'fs';

console.log("Day 6: Tuning Trouble");

const filename = "day_6_puzzle_input.txt";

const result = readFileSync(filename, 'utf-8');

// Part 1 - Find the start of the packet: markerLength = 4 characters
// Part 2 - Find the start of the packet: markerLength = 14 characters
const markerLength = 14;

let charMap = new Map<string, number>();
let duplicatesCount = 0;
let startOfPacketIndex = 0;
for (let index = 0; index < result.length; index++) {
    const character = result[index];

    const charMapValue = charMap.get(character);
    if(charMapValue !== undefined) {
        charMap.set(character, charMapValue + 1);
        duplicatesCount += 1;
    } else {
        charMap.set(character, 1);
    }

    if(index > markerLength - 1) {
        const characterToBeRemoved = result[index - markerLength];
        const charMapValue = charMap.get(characterToBeRemoved);
        if(charMapValue !== undefined) {
            
            if(charMapValue > 1) {
                charMap.set(characterToBeRemoved, charMapValue - 1);
                duplicatesCount -= 1;
            } else {
                charMap.delete(characterToBeRemoved);
            }
        }
    }

    if(index > markerLength - 1 && duplicatesCount == 0) {
        startOfPacketIndex = index + 1;
        break;
    }
}
    
console.log("Start of packet: " + startOfPacketIndex);

