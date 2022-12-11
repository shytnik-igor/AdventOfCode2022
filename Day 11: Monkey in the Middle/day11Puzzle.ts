import { readFileSync, promises as fsPromises } from 'fs';

console.log('Day 11: Monkey in the Middle');

// Part 1 - divider = 3
// Part 2 - divider = 1
const divider = 3;

// Part 1 - rounds = 20
// Part 2 - rounds = 10_000
const rounds = 20;

class Monkey {
    name: string;
    divider: number;
    operator: string;
    operationValue: string;

    testTrue: number;
    testFalse: number;
    items: Array<number>;

    inpectedItemsCount: number = 0;

    constructor(monkeyDescription: string[]) {
        this.name = monkeyDescription[0].split(' ')[1].split(':')[0];

        this.items = new Array<number>();
        let itemsLine = monkeyDescription[1].split(':');
        itemsLine[itemsLine.length - 1].split(',').forEach(item => {
            this.items.push(parseInt(item.trim()));
        });

        let operationLine = monkeyDescription[2].split(' ');
        this.operator = operationLine[operationLine.length - 2];
        this.operationValue = operationLine[operationLine.length - 1];

        let testLine = monkeyDescription[3].split(' ');
        this.divider = parseInt(testLine[testLine.length - 1]);

        let testTrue = monkeyDescription[4].split(' ');
        this.testTrue = parseInt(testTrue[testTrue.length - 1]);

        let testFalse = monkeyDescription[5].split(' ');
        this.testFalse = parseInt(testFalse[testFalse.length - 1]);
    }

    getWorryLevel(value: number): number {
        this.inpectedItemsCount++;

        let operationValue = 0;
        if(this.operationValue.startsWith('old')) {
            operationValue = value;
        } else {
            operationValue = parseInt(this.operationValue);
        }

        let worryLevel = 0;
        switch(this.operator) {
            case '+':
                worryLevel = value + operationValue;
                break;
            case '-':
                worryLevel = value - operationValue;
                break;
            case '*':
                worryLevel = value * operationValue;
                break;
            case '/':
                worryLevel = value / operationValue;
                break;
        }

        // Worry level to be divided and rounded down to the nearest integer
        worryLevel = Math.floor(worryLevel / divider);

        return worryLevel;
    }

    getNextMonkey(worryLevel: number): number {
        if(worryLevel % this.divider == 0) {
            return this.testTrue;
        } else {
            return this.testFalse;
        }
    }
}

const filename = "day_11_puzzle_input.txt";
const result = readFileSync(filename, 'utf-8');
const lines = result.split('\n');

// Parse the input
const monkeys: Array<Monkey> = new Array<Monkey>();

for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if(line.startsWith('Monkey')) {
        let monkeyDescription = lines.slice(index, index + 7);
        let monkey = new Monkey(monkeyDescription);
        monkeys.push(monkey);
        index += 6;
    }
}

let superMod = 1;
monkeys.forEach(monkey => {
    superMod *= monkey.divider;
});

for (let round = 0; round < rounds; round++) {
    monkeys.forEach(monkey => {
        while(monkey.items.length > 0) {
            let item = monkey.items.shift();
            let reducedItem = item! % superMod;
            let worryLevel = monkey.getWorryLevel(reducedItem);
            let nextMonkey = monkey.getNextMonkey(worryLevel);
            monkeys[nextMonkey].items.push(worryLevel);
        }
    });
}

let firstMaxInpectedItemsCount = 0;
let secondMaxInpectedItemsCount = 0;
monkeys.forEach(monkey => {
    if(monkey.inpectedItemsCount > firstMaxInpectedItemsCount) {
        secondMaxInpectedItemsCount = firstMaxInpectedItemsCount;
        firstMaxInpectedItemsCount = monkey.inpectedItemsCount;
    } else if(monkey.inpectedItemsCount > secondMaxInpectedItemsCount) {
        secondMaxInpectedItemsCount = monkey.inpectedItemsCount;
    }
});

console.log("Level of monkey business: ", firstMaxInpectedItemsCount * secondMaxInpectedItemsCount);
