import { readFileSync, promises as fsPromises } from 'fs';

console.log("Day 3: Rucksack Reorganization");

const filename = "day_3_puzzle_input.txt";

const result = readFileSync(filename, 'utf-8');
const lines = result.split('\n');

var totalScore: number = 0;
var totalBadgesScore: number = 0;
var badges = new Map<number, number>();
for (let index = 0; index < lines.length; index++) {

    const line = lines[index];
    let characters = new Set<number>();

    let halfLength = line.length / 2;
    for (let i = 0; i < line.length; i++) {
        let character = line.charAt(i);
        let score = getCharacterScore(character);
        if(i < halfLength) {
            characters.add(score);
        } else { 
            if (characters.has(score)) {
                totalScore += score;
                break;
            }
        }
    }

    let reminder = index % 3;
    for (let i = 0; i < line.length; i++) {
        let character = line.charAt(i);
        let score = getCharacterScore(character);

        let badgeScore = badges.get(score) as number;
        if (reminder == 0) {
            badges.set(score, 1);
        } else if (reminder == 1) {
            if(badgeScore) {
                let maxBadgeScore = Math.min(badgeScore + 1, reminder + 1);
                badges.set(score, maxBadgeScore);
            }
        } else if (reminder == 2) {
            if(badgeScore && badgeScore == 2) {
                totalBadgesScore += score;
                badges = new Map<number, number>();
                break;
            }
        }
    }
}

console.log("Total score first part: " + totalScore);
console.log("Total badges score second part: " + totalBadgesScore);


function getCharacterScore(character: string): number {
    let code = character.charCodeAt(0);
    if (code >= 97) {
        return code - 96;
    } else {
        return code - 38;
    }
}