import { readFileSync, promises as fsPromises } from 'fs';

class Position {
    height: number;
    steps: number;
    visited: boolean;
    symbol: string;
    row: number;
    column: number;

    constructor(height: number = 0, steps: number = 0, visited: boolean = false, row: number = 0, column: number = 0, symbol: string = ' ') {
        this.height = height;
        this.steps = steps;
        this.visited = visited;
        this.row = row;
        this.column = column;
        this.symbol = symbol;
    }
}

function getNeighbours(vertex: Position, graph: Array<Array<Position>>): Array<Position> {
    let neighbours: Array<Position> = new Array<Position>();
    if(vertex.column > 0) {
        neighbours.push(graph[vertex.row][vertex.column - 1]);
    }
    if(vertex.column < graph[1].length - 1) {
        neighbours.push(graph[vertex.row][vertex.column + 1]);
    }
    if(vertex.row > 0) {
        neighbours.push(graph[vertex.row - 1][vertex.column]);
    }
    if(vertex.row < graph.length - 1) {
        neighbours.push(graph[vertex.row + 1][vertex.column]);
    }

    return neighbours;
}

function DijkstraPart1(startPoint: Array<number>, targetPoint: Array<number>, graph: Array<Array<Position>>): number {
    let queue: Array<Position> = new Array<Position>();
    let startPosition = graph[startPoint[1]][startPoint[0]];
    startPosition.steps = 0;
    queue.push(startPosition);
    while(queue.length > 0) {
        let vertex = queue.shift()!;
        vertex.visited = true;
        let currentHeight = vertex.height;

        let neighbours = getNeighbours(vertex, graph);
        for(let i = 0; i < neighbours.length; i++) {
            let nextVertex = neighbours[i];
            if(!nextVertex.visited && (currentHeight + 1) >= nextVertex.height && nextVertex.steps > vertex.steps + 1) {
                nextVertex.steps = vertex.steps + 1;
                queue.push(nextVertex);
            }
        }
    }

    return graph[targetPoint[1]][targetPoint[0]].steps;
}

function DijkstraPart2(startPoint: Array<number>, targetSymbol: string, graph: Array<Array<Position>>): number {
    let queue: Array<Position> = new Array<Position>();
    let startPosition = graph[startPoint[1]][startPoint[0]];
    startPosition.steps = 0;
    queue.push(startPosition);
    while(queue.length > 0) {
        let vertex = queue.shift()!;
        vertex.visited = true;
        let currentHeight = vertex.height;

        let neighbours = getNeighbours(vertex, graph);
        for(let i = 0; i < neighbours.length; i++) {
            let nextVertex = neighbours[i];
            if(!nextVertex.visited && (currentHeight - 1) <= nextVertex.height && nextVertex.steps > vertex.steps + 1) {
                nextVertex.steps = vertex.steps + 1;
                if(nextVertex.symbol == targetSymbol) {
                    return nextVertex.steps;
                }
                queue.push(nextVertex);
            }
        }
    }

    return graph[targetPoint[1]][targetPoint[0]].steps;
}

console.log('Day 12: Hill Climbing Algorithm');

const filename = "day_12_puzzle_input.txt";
const result = readFileSync(filename, 'utf-8');
const lines = result.split('\n');

let heightmap: Array<Array<number>> = new Array<Array<number>>();

// Start point value code S = 83
// Target point value code E = 69
let startPoint: Array<number> = new Array<number>();
let targetPoint: Array<number> = new Array<number>();

let graph: Array<Array<Position>> = new Array<Array<Position>>();
for (let rowIndex = 0; rowIndex < lines.length; rowIndex++) {
    const line = lines[rowIndex];
    let row = new Array<Position>();
    for (let columnIndex = 0; columnIndex < line.length; columnIndex++) {
        let valueCode = line[columnIndex].charCodeAt(0);
        if(valueCode == 83) {
            valueCode = 'a'.charCodeAt(0);
            startPoint = [columnIndex, rowIndex];
        } else if(valueCode == 69) {
            valueCode = 'z'.charCodeAt(0);
            targetPoint = [columnIndex, rowIndex];
        }
        let position = new Position(
            valueCode,
            Number.MAX_SAFE_INTEGER,
            false,
            rowIndex,
            columnIndex,
            line[columnIndex]
        );
        row.push(position);
    }
    graph.push(row);
}

//let steps = DijkstraPart1(startPoint, targetPoint, graph);
//console.log(`Part 1: ${steps}`);

let targetSymbol = 'a';
let steps = DijkstraPart2(targetPoint, targetSymbol, graph);
console.log(`Part 2: ${steps}`);