const fs = require("fs");
let input = fs.readFileSync("./inputs/day10.txt").toString().split("\n");
input = input.map((l) => l.trim());
const height = input.length;
const width = input[0].length;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

// let reachable = new Set([]);

const analyzeHead = (r, c, input) => {
  const reachable = new Set([]);
  let score2 = 0;
  let queue = [];
  let val = 0;
  let visited = new Set([]);
  if (r > 0) queue.push([r - 1, c, 0]);
  if (r < height - 1) queue.push([r + 1, c, 0]);
  if (c > 0) queue.push([r, c - 1, 0]);
  if (c < width - 1) queue.push([r, c + 1, 0]);
  while (queue.length > 0) {
    const curr = queue.shift();
    if (visited.has(`${curr[0]},${curr[1]}`)) continue;

    val = curr[2];

    // console.log(ca, "asdasdasdas");

    // console.log(curr);
    let currVal = Number(input[curr[0]][curr[1]]);
    // console.log(currVal);
    if (currVal !== val + 1) continue;

    visited.add(`${curr[0]},${curr[1]}`);
    if (currVal === 9) {
      reachable.add(`${curr[0]},${curr[1]}`);
      score2++;
      continue;
    }
    if (curr[0] > 0) queue.push([curr[0] - 1, curr[1], currVal]);
    if (curr[0] < height - 1) queue.push([curr[0] + 1, curr[1], currVal]);
    if (curr[1] > 0) queue.push([curr[0], curr[1] - 1, currVal]);
    if (curr[1] < width - 1) queue.push([curr[0], curr[1] + 1, currVal]);
  }
  return reachable.size;
};

const analyseHead2 = (r, c, input) => {
  const curr = Number(input[r][c]);
  if (curr === 9) return 1;
  let score = 0;
  if (r > 0) {
    let nextVal = Number(input[r - 1][c]);
    if (nextVal === curr + 1) {
      score += analyseHead2(r - 1, c, input);
    }
  }
  if (r < height - 1) {
    let nextVal = Number(input[r + 1][c]);
    if (nextVal === curr + 1) {
      score += analyseHead2(r + 1, c, input);
    }
  }
  if (c > 0) {
    let nextVal = Number(input[r][c - 1]);
    if (nextVal === curr + 1) {
      score += analyseHead2(r, c - 1, input);
    }
  }
  if (c < width - 1) {
    let nextVal = Number(input[r][c + 1]);
    if (nextVal === curr + 1) {
      score += analyseHead2(r, c + 1, input);
    }
  }
  return score;
};

for (let [rs, line] of Object.entries(input)) {
  const r = Number(rs);
  for (let [cs, ch] of Object.entries(line)) {
    let c = Number(cs);
    if (ch === "0") {
      let score1 = analyzeHead(r, c, input);
      out += score1;
      let score2 = analyseHead2(r, c, input);
      out2 += score2;
    }
  }
}

console.log(out);
console.log(out2);
