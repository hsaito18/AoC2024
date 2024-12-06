const fs = require("fs");
let input = fs.readFileSync("./inputs/day06.txt").toString().split("\n");
input = input.map((l) => l.trim());

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;
let startPos = [0, 0];
let visited = new Set([]);
let obstacles = new Set([]);
for (let [rs, line] of Object.entries(input)) {
  let r = Number(rs);
  for (let [cs, ch] of Object.entries(line)) {
    let c = Number(cs);
    if (ch === "^") {
      startPos = [r, c];
      visited.add(`${r},${c}`);
    }
    if (ch === "#") {
      obstacles.add(`${r},${c}`);
    }
  }
}

let direction = [-1, 0];

const rotate = (dir) => {
  if (dir[0] === -1) {
    return [0, 1];
  }
  if (dir[0] === 1) {
    return [0, -1];
  }
  if (dir[1] === 1) {
    return [1, 0];
  }
  return [-1, 0];
};

const move = (pos, direction, obstacles, visited) => {
  let nextCoords = `${pos[0] + direction[0]},${pos[1] + direction[1]}`;
  let newDir = [...direction];
  while (obstacles.has(nextCoords)) {
    newDir = rotate(newDir);
    if (newDir[0] === direction[0] && newDir[1] === direction[1])
      console.log("AAAAAAAAAAAAAAAAAA");
    nextCoords = `${pos[0] + newDir[0]},${pos[1] + newDir[1]}`;
  }
  const asd = nextCoords.split(",");
  const nextCoordsProper = [Number(asd[0]), Number(asd[1])];
  if (
    nextCoordsProper[0] < 0 ||
    nextCoordsProper[0] >= input.length ||
    nextCoordsProper[1] < 0 ||
    nextCoordsProper[1] >= input[0].length
  ) {
    return false;
  }
  visited.add(nextCoords);
  return [nextCoordsProper, newDir];
};

const move2 = (pos, direction, obstacles, visited) => {
  let nextCoords = `${pos[0] + direction[0]},${pos[1] + direction[1]}`;
  let newDir = [...direction];
  while (obstacles.has(nextCoords)) {
    newDir = rotate(newDir);
    if (newDir[0] === direction[0] && newDir[1] === direction[1]) return true;
    nextCoords = `${pos[0] + newDir[0]},${pos[1] + newDir[1]}`;
  }
  const asd = nextCoords.split(",");
  const nextCoordsProper = [Number(asd[0]), Number(asd[1])];
  if (
    nextCoordsProper[0] < 0 ||
    nextCoordsProper[0] >= input.length ||
    nextCoordsProper[1] < 0 ||
    nextCoordsProper[1] >= input[0].length
  ) {
    return false;
  }
  const state = `${nextCoordsProper[0]},${nextCoordsProper[1]},${newDir[0]},${newDir[1]}`;
  if (visited.has(state)) {
    return true;
  }
  visited.add(state);
  return [nextCoordsProper, newDir];
};

let pos = startPos;

while (true) {
  let res = move(pos, direction, obstacles, visited);
  if (res === false) {
    out = visited.size;
    break;
  }
  pos = res[0];
  direction = res[1];
}

const endsInLoop = (obstacles) => {
  let currPos = startPos;
  let currDirection = [-1, 0];
  let currVisited = new Set([]);

  while (true) {
    let res = move2(currPos, currDirection, obstacles, currVisited);
    if (res === false) {
      return false;
    }
    if (res === true) {
      return true;
    }
    currPos = res[0];
    currDirection = res[1];
  }
};

for (const ogVisited of visited) {
  let copyObst = new Set([...obstacles]);
  copyObst.add(ogVisited);
  if (endsInLoop(copyObst)) {
    out2++;
  }
}

console.log(out);
console.log(out2);
