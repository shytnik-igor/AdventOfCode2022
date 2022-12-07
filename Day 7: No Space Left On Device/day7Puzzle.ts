import { readFileSync, promises as fsPromises } from 'fs';

class Directory {
    name: string;
    size: number;
    children: Directory[];
    parent?: Directory;

    constructor(name: string = "/", parent?: Directory) {
        this.name = name;
        this.size = 0;
        this.children = [];
        this.parent = parent;
    }

    addSize(fileSize: number) {
        this.size += fileSize;
        if(this.parent !== undefined) {
            this.parent.addSize(fileSize);
        }
    }
}

// Get directories sizes less than maxSize
function getSumOfDirectoriesSizeLessThan(directory: Directory, maxSize: number): number {
    let directoriesSum: number = 0;
    if(directory.size < maxSize) {
        directoriesSum += directory.size;    
    }
    directory.children.forEach(child => {
        directoriesSum += getSumOfDirectoriesSizeLessThan(child, maxSize);
    });
    return directoriesSum;
}

// Get smallest directory size greater than maxSize
function getSmallestDirectorySizeGreaterThan(directory: Directory, maxSize: number, currentSize: number): number {
    let smallestDirectorySize: number = currentSize;
    if(directory.size > maxSize && directory.size <= currentSize) {
        smallestDirectorySize = directory.size;
    }
    directory.children.forEach(child => {
        const childSmallestDirectorySize = getSmallestDirectorySizeGreaterThan(child, maxSize, smallestDirectorySize);
        if(childSmallestDirectorySize < smallestDirectorySize) {
            smallestDirectorySize = childSmallestDirectorySize;
        }
    });
    return smallestDirectorySize;
}

console.log("Day 7: No Space Left On Device");

const filename = "day_7_puzzle_input.txt";
const result = readFileSync(filename, 'utf-8');
const lines = result.split('\n');

const rootDirectory = new Directory();
let currentDirectory: Directory;
lines.forEach(line => {
    const commandLine = line.split(' ')

    // Check if line is start '$'
    if(commandLine[0] === '$') {
        if(commandLine[1] === 'cd') {
            if(commandLine[2] === '/') {
                currentDirectory = rootDirectory;
            } else if(commandLine[2] === '..') {
                currentDirectory = currentDirectory.parent!;
            } else {
                const child = currentDirectory.children.find(child => child.name === commandLine[2])
                if(child !== undefined) {
                    currentDirectory = child;
                }
            }
        }
    } else if(commandLine[0] === 'dir') {
        const child = currentDirectory.children.find(child => child.name === commandLine[1])
        if(child === undefined) {
            currentDirectory.children.push(new Directory(commandLine[1], currentDirectory));
        }
    } else if(!isNaN(parseInt(commandLine[0]))) {
        currentDirectory.addSize(parseInt(commandLine[0]));
    }
});

// Part 1
// Get sum of directories sizes less than 100000
const directoriesSum = getSumOfDirectoriesSizeLessThan(rootDirectory, 100000);
console.log(directoriesSum);

 // Part 2
const diskSpace = 70000000;
const neededSpace = 30000000;
const freeSpace = diskSpace - rootDirectory.size;
const neededSpaceForUpdate = neededSpace - freeSpace;
// Get smallest directory size greater than neededSpaceForUpdate
const smallestDirectorySize = getSmallestDirectorySizeGreaterThan(rootDirectory, neededSpaceForUpdate, rootDirectory.size);
console.log(smallestDirectorySize);