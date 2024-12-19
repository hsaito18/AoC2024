const fs = require("fs");
const { register } = require("module");
let input = fs.readFileSync("./inputs/day18.txt").toString().split("\n");
input = input.map((l) => l.trim());
const height = input.length;
const width = input[0].length;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

const HEIGHT = 71;
const WIDTH = 71;
const goalPos = [WIDTH - 1, HEIGHT - 1];
const PART1LIMIT = 1024;

const runBytes = (corrupted) => {
  const visited = new Set([]);

  let steps = 1;

  let queue = [];

  if (!corrupted.has("1,0")) {
    queue.push([1, 0, steps]);
  }

  if (!corrupted.has("0,1")) {
    queue.push([0, 1, steps]);
  }

  while (queue.length > 0) {
    const [currX, currY, currSteps] = queue.shift();
    if (currX > 0) {
      const next = [currX - 1, currY, currSteps + 1];
      const nextKey = `${next[0]},${next[1]}`;
      if (!visited.has(nextKey) && !corrupted.has(nextKey)) {
        visited.add(nextKey);
        queue.push(next);
      }
    }
    if (currY > 0) {
      const next = [currX, currY - 1, currSteps + 1];
      const nextKey = `${next[0]},${next[1]}`;
      if (!visited.has(nextKey) && !corrupted.has(nextKey)) {
        visited.add(nextKey);
        queue.push(next);
      }
    }
    if (currX < WIDTH - 1) {
      if (currX + 1 === goalPos[0] && currY === goalPos[1]) {
        return currSteps + 1;
      }
      const next = [currX + 1, currY, currSteps + 1];
      const nextKey = `${next[0]},${next[1]}`;
      if (!visited.has(nextKey) && !corrupted.has(nextKey)) {
        visited.add(nextKey);
        queue.push(next);
      }
    }
    if (currY < HEIGHT - 1) {
      if (currX === goalPos[0] && currY + 1 === goalPos[1]) {
        return currSteps + 1;
      }
      const next = [currX, currY + 1, currSteps + 1];
      const nextKey = `${next[0]},${next[1]}`;
      if (!visited.has(nextKey) && !corrupted.has(nextKey)) {
        visited.add(nextKey);
        queue.push(next);
      }
    }
  }
  return false;
};

const corrupted = new Set([]);

for (let [rs, line] of Object.entries(input)) {
  if (Number(rs) === PART1LIMIT) {
    out = runBytes(corrupted);
  }
  const [x, y] = line.split(",").map((x) => Number(x));
  const key = `${x},${y}`;
  corrupted.add(key);
  if (Number(rs) > PART1LIMIT) {
    const res = runBytes(corrupted);
    if (!res) {
      out2 = line;
      break;
    }
  }
}

console.log(out);
console.log(out2);
