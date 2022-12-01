import { readFileSync, promises as fsPromises } from 'fs';

console.log("Day 1: Calorie Counting");

const filename = "day_1_puzzle_input.txt";
const numberOfTopEntries = 3;

const result = readFileSync(filename, 'utf-8');
const lines = result.split('\n');

var totalCalories: number[] = [];
var calories = 0;
lines.forEach(element => {
	if (element.length > 0) {
		calories += parseInt(element);
	} else {
		totalCalories.push(calories);
		calories = 0;
	}
});

totalCalories.push(calories);
const sorted = totalCalories.sort((a, b) => b - a);
  let sum = 0;
  for (let i = 0; i < numberOfTopEntries; i++) {
	sum += sorted[i];
  }
console.log(totalCalories);
console.log("Max Calories: " + totalCalories[0]);
console.log("Sum of top %s calories: " + sum, numberOfTopEntries);
