import { readFileSync } from 'fs';

enum OrderDecision {
    Right,
    Wrong,
    None
}

class Packet {
    isValue: boolean;
    value: string;
    array: Array<Packet>;
    line: string;

    constructor() {
        this.isValue = false;
        this.value = '';
        this.array = new Array<Packet>();
        this.line = '';
    }
}

function getPacket(line: string): Packet {
    let packet = new Packet();
    packet.line = line;
    const symbol = line[0];
    if(symbol == '[') {
        // Split the line into a list of integers and a list of lists.
        // Divider is a comma.
        let bracketCount = 0;
        let subLine = '';
        for (let subIndex = 1; subIndex < line.length; subIndex++) {
            const subSymbol = line[subIndex];
            if(subSymbol == '[') {
                bracketCount++;
            } else if(subSymbol == ']' && bracketCount != 0) {
                bracketCount--;
            } else if(subSymbol == ',' && bracketCount == 0) {
                packet.array.push(getPacket(subLine));
                subLine = '';
                continue;
            } else if(subSymbol == ']' && bracketCount == 0) {
                packet.array.push(getPacket(subLine));
                subLine = '';
                break;
            }
            subLine += subSymbol;
        }
    } else {
        // Split the line into a list of integers and a list of lists.
        // Divider is a comma.
        packet.value = line;
        packet.isValue = true;
    }
    return packet;
}

function comparePackets(left: Packet, right: Packet): OrderDecision {
    // If both values are integers, the lower integer should come first.
    if(left.isValue && right.isValue) {
        if(left.value == right.value) {
            return OrderDecision.None;
        } 
        if(left.value == '') {
            return OrderDecision.Right;
        }
        if(parseInt(left.value) < parseInt(right.value)){
            return OrderDecision.Right;
        } else {
            return OrderDecision.Wrong;
        }
    // If exactly one value is an integer, convert the integer to a list 
    // which contains that integer as its only value, then retry the comparison.
    } else if(left.isValue || right.isValue) {
        if(left.isValue) {
            if(left.value == '') {
                return OrderDecision.Right;
            }
            left = getPacket('[' + left.value + ']');
        } else {
            if(right.value == '') {
                return OrderDecision.Wrong;
            }
            right = getPacket('[' + right.value + ']');
        }
        return comparePackets(left, right);
    
    } else {
    // If both values are lists, compare the first value of each list
    // If the left list runs out of items first, the inputs are in the right order.
        let index = 0
        for (; index < left.array.length && index < right.array.length ; index++) {
            let result = comparePackets(left.array[index], right.array[index]);
            if(result != OrderDecision.None) {
                return result;
            }
        }
        if(index == left.array.length) {
            if(index == left.array.length && index == right.array.length) {
                return OrderDecision.None;
            }
            return OrderDecision.Right;
        }
        return OrderDecision.Wrong;
    }
}

console.log('Day 13: Distress Signal');

const filename = "day_13_puzzle_input.txt";
const result = readFileSync(filename, 'utf-8');
const lines = result.split('\n');

let correct = 0;

let packets = new Array<Packet>();
for (let index = 0; index < lines.length; index += 3) {    
    packets.push(getPacket(lines[index]));
    packets.push(getPacket(lines[index + 1]));
}

for (let index = 0; index < packets.length; index += 2) {
    const firstPacket = packets[index];
    const secondPacket = packets[index + 1];

    let result = comparePackets(firstPacket, secondPacket);
    if(result == OrderDecision.Right) {
        correct += index/2 + 1;
    }
}

// Part 1
// Find right pairs
console.log('Sum of right pairs: ' + correct);


// Part 2
// Add [[2]]
let line2 = '[[2]]'
packets.push(getPacket(line2));
// Add [[6]]
let line6 = '[[6]]'
packets.push(getPacket(line6));

// Sort packets by comparePackets in reverse order
packets = packets.sort((left, right) => {
    let result = comparePackets(left, right);
    if(result == OrderDecision.Right) {
        return -1;
    } else if(result == OrderDecision.Wrong) {
        return 1;
    }
    return 0;
});

// Find sum of line2 and line6 indecies
let line2Index = packets.findIndex(packet => packet.line == line2) + 1;
let line6Index = packets.findIndex(packet => packet.line == line6) + 1;
console.log('Product of [[2]] and [[6]] indecies: ' + (line2Index * line6Index));

