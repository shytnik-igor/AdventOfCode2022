import { readFileSync, promises as fsPromises } from 'fs';

console.log("Day 2: Rock Paper Scissors");

const filename = "day_2_puzzle_input.txt";

let opponentShapes = new Map<string, number>([
    ["A", 1],
    ["B", 2],
    ["C", 3]
]);

let playerShapes = new Map<string, number>([
    ["X", 1],
    ["Y", 2],
    ["Z", 3]
]);

let gameResults = new Map<string, number>([
    ["X", 0],
    ["Y", 3],
    ["Z", 6]
]);

const result = readFileSync(filename, 'utf-8');
const lines = result.split('\n');

var totalScore: number = 0;
var totalRightScore: number = 0;
lines.forEach(line => {

    const shapes = line.split(' ')
    let opponentShape: number = opponentShapes.get(shapes[0])as number;
    let playerShape: number = playerShapes.get(shapes[1]) as number;
    let result: number = gameResults.get(shapes[1]) as number;

    totalScore += getResult(opponentShape, playerShape);
    totalRightScore += getRightrResult(opponentShape, result);
});

console.log("Total Score first part: " + totalScore);
console.log("Total Score second part: " + totalRightScore);

// Shape 1 = Rock
// Shape 2 = Paper
// Shape 3 = Scissors
function getResult(opponent: number, player: number) {
    var result = player;

    if (opponent === 1 && player === 2) {
        result += 6;
    } else if (opponent === 1 && player === 3) {
        result += 0;
    } else if (opponent === 2 && player === 1) {
        result += 0;
    } else if (opponent === 2 && player === 3) {
        result += 6;
    } else if (opponent === 3 && player === 1) {
        result += 6;
    } else if (opponent === 3 && player === 2) {
        result += 0;
    } else {
        result += 3;
    }
    return result;
}

// Opponent 1 = Rock
// Opponent 2 = Paper
// Opponent 3 = Scissors
// Result 0 = Tie
// Result 3 = Draw
// Result 6 = Opponent wins
function getRightrResult(opponent: number, result: number) {
    var rightResult = result;

    if( result === 3) {
        rightResult += opponent;
    } else if (result === 6) {
        if (opponent === 1) {
            rightResult += 2;
        } else if (opponent === 2) {
            rightResult += 3;
        } else if (opponent === 3) {
            rightResult += 1;
        }
    } else if (result === 0) {
        if (opponent === 1) {
            rightResult += 3;
        } else if (opponent === 2) {
            rightResult += 1;
        } else if (opponent === 3) {
            rightResult += 2;
        }
    }
    return rightResult;
}