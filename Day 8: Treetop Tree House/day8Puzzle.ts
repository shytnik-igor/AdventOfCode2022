import { readFileSync, promises as fsPromises } from 'fs';


console.log("Day 8: Treetop Tree House");

const filename = "day_8_puzzle_input.txt";
const result = readFileSync(filename, 'utf-8');
const lines = result.split('\n');

let rowsCount = lines.length;
let lineLength = lines[0].length;

let countOfVisibleTrees = 0;
let maxScenicScore = 0;

for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
    const line = lines[rowIndex];

    for (let columnIndex = 0; columnIndex < lineLength; columnIndex++) {
        const height = parseInt(line[columnIndex]);

        if(rowIndex == 0 || rowIndex == rowsCount - 1 ||
            columnIndex == 0 || columnIndex == line.length - 1 ) {
                countOfVisibleTrees +=1;
        } else {
            let treeVisible = false;
            // Check left
            let leftScenicScore = 0;
            for (let leftIndex = columnIndex - 1; leftIndex >= 0; leftIndex--) {
                let currentHeight = parseInt(line[leftIndex]);
                if (currentHeight >= height) {
                    leftScenicScore += 1;
                    break;
                }
                if(leftIndex == 0) {
                    treeVisible = true;
                }
                leftScenicScore += 1;
            }
            // Check right
            let rightScenicScore = 0;
            for (let rightIndex = columnIndex + 1; rightIndex < lineLength; rightIndex++) {
                let currentHeight = parseInt(line[rightIndex]);
                if (currentHeight >= height) {
                    rightScenicScore += 1;
                    break;
                }
                if(rightIndex == lineLength - 1) {
                    treeVisible = true;
                }
                rightScenicScore += 1;
            }
            // Check top
            let topScenicScore = 0;
            for (let topIndex = rowIndex - 1; topIndex >= 0; topIndex--) {
                let currentHeight = parseInt(lines[topIndex][columnIndex]);
                if (currentHeight >= height) {
                    topScenicScore += 1;
                    break;
                }
                if(topIndex == 0) {
                    treeVisible = true;
                }
                topScenicScore += 1;
            }
            // Check bottom
            let bottomScenicScore = 0;
            for (let bottomIndex = rowIndex + 1; bottomIndex < rowsCount; bottomIndex++) {
                let currentHeight = parseInt(lines[bottomIndex][columnIndex]);
                if (currentHeight >= height) {
                    bottomScenicScore += 1;
                    break;
                }
                if(bottomIndex == rowsCount - 1) {
                    treeVisible = true;
                }
                bottomScenicScore += 1;
            }
            if(treeVisible) {
                countOfVisibleTrees += 1;
            }
            let currentScenicScore = leftScenicScore * rightScenicScore * topScenicScore * bottomScenicScore;
            if(currentScenicScore > maxScenicScore) {
                maxScenicScore = currentScenicScore;
            }
        }
    }
}
 
console.log("Count of visible trees: ", countOfVisibleTrees);
console.log("Max scenic score: ", maxScenicScore);