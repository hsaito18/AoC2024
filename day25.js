const fs = require("fs");
let input = fs.readFileSync("./inputs/day25.txt").toString().split("\n");
input = input.map((l) => l.trim());
const height = input.length;
const width = input[0].length;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

const keys = [];
const locks = [];

let currThing = [];

const analyzeThing = (lines) => {
  const heights = [];
  if (lines[0][0] === "#") {
    for (let col = 0; col < lines[0].length; col++) {
      for (let row = lines.length - 1; row >= 0; row--) {
        if (lines[row][col] === "#") {
          heights.push(row);
          break;
        }
      }
    }
    locks.push(heights);
  } else {
    for (let col = 0; col < lines[0].length; col++) {
      for (let row = 0; row < lines.length; row++) {
        if (lines[row][col] === "#") {
          heights.push(6 - row);
          break;
        }
      }
    }
    keys.push(heights);
  }
};
for (let [rs, line] of Object.entries(input)) {
  if (line === "") {
    analyzeThing(currThing);
    currThing = [];
  } else {
    currThing.push(line);
  }
}
if (currThing.length > 0) analyzeThing(currThing);

const willFit = (key, lock) => {
  for (let i = 0; i < key.length; i++) {
    if (key[i] + lock[i] > 5) return false;
  }
  return true;
};

for (const key of keys) {
  for (const lock of locks) if (willFit(key, lock)) out++;
}

console.log(out);
console.log(out2);
