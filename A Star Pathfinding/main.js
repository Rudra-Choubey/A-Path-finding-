/** @format */

const cvs = document.querySelector("canvas");
const ctx = cvs.getContext("2d");

cvs.width = 700;
cvs.height = 700;

const grid = [];
let start = null;
let end = null;
let current;
const dimensions = {
  x: 100,
  y: 100,
};
let closedSet = [];
let openSet = [];
const gridSize = {
  w: cvs.width / dimensions.x,
  h: cvs.height / dimensions.y,
};
function distance(x, y, x2, y2) {
  return Math.abs(x2 - x) + Math.abs(y2 - y);
}
class Cell {
  constructor(x, y, i, j) {
    this.x = x;
    this.y = y;
    this.i = i;
    this.j = j;
    this.h = 0;
    this.g = 0;
    this.f = 0;
    this.previous = null;
    this.color = "#ccc";
    this.isObstacle = false;
    if (Math.random() < 0.3) {
      this.isObstacle = true;
    }
  }
  show(gridSize) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, gridSize.w, gridSize.h);
  }
  findNeighbors(dimensions) {
    const i = this.i;
    const j = this.j;
    const cells = [];
    // Up Cell
    if (i > 0) cells.push(grid[i - 1][j]);
    // left cell
    if (j > 0) {
      cells.push(grid[i][j - 1]);
    }
    // right cell
    if (j < dimensions.x - 1) cells.push(grid[i][j + 1]);
    // down cell
    if (i < dimensions.y - 1) cells.push(grid[i + 1][j]);
    // up left
    if (i > 0 && j > 0) cells.push(grid[i - 1][j - 1]);
    // down right
    if (i < dimensions.y - 1 && j < dimensions.x - 1)
      cells.push(grid[i + 1][j + 1]);
    // down left
    if (i < dimensions.y - 1 && j > 0) cells.push(grid[i + 1][j - 1]);
    // up right
    if (i > 0 && j < dimensions.x - 1) cells.push(grid[i - 1][j + 1]);
    return cells;
  }
}
function drawGrid(dimensions, gridSize) {
  for (let i = 0; i < dimensions.y; i++) {
    grid[i] = [];
    let x = gridSize.w * i;
    for (let j = 0; j < dimensions.x; j++) {
      let y = gridSize.h * j;

      grid[i][j] = new Cell(x, y, i, j);
    }
  }

  start = grid[0][0];
  end = grid[dimensions.y - 1][dimensions.x - 1];
  start.f = distance(start.j, start.i, end.j, end.i);
  start.isObstacle = false;
  end.isObstacle = false;
  end.color = "orange";
  openSet.push(start);
}
drawGrid(dimensions, gridSize);
function findLowestFScore(array) {
  let lowest = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i].f < array[lowest].f) lowest = i;
  }
  return lowest;
}
let traced = [];
openSet.push(start);
for (let i = 0; i < dimensions.y; i++) {
  for (let j = 0; j < dimensions.x; j++) {
    if (grid[i][j].isObstacle) {
      grid[i][j].color = "black";
    }
    grid[i][j].show(gridSize);
  }
}
function update() {
  if (openSet.length > 0 && current != end) {
    let lowestFScore = findLowestFScore(openSet);
    current = openSet[lowestFScore];

    current.color = "white";
    current.show(gridSize);
    openSet.splice(lowestFScore, 1);
    closedSet.push(current);

    let neighbors = current.findNeighbors(dimensions);
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];
      if (!closedSet.includes(neighbor) && !neighbor.isObstacle) {
        let gscore = current.g + 1;
        if (openSet.includes(neighbor)) {
          if (gscore > neighbor.g) neighbor.g = gscore;
        } else {
          neighbor.g = gscore;
          neighbor.h = distance(end.j, end.i, neighbor.j, neighbor.i);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
          neighbor.color = "yellow";
          neighbor.show(gridSize);
          openSet.push(neighbor);
        }
      }
    }
  }
  if (current == end) {
    let temp = current;
    traced.push(temp);
    while (temp.previous) {
      temp = temp.previous;
      traced.push(temp);
    }
  }
  for (let i = 0; i < traced.length; i++) {
    let cell = traced[i];
    cell.color = "blue";
    cell.show(gridSize);
  }
  requestAnimationFrame(update);
}
const button = document.querySelector("#start");
button.onclick = update;
