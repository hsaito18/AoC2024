const fs = require("fs");
let input = fs.readFileSync("./inputs/day05.txt").toString().split("\n");
input = input.map((l) => l.trim());

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

const rules = {};
const bads = [];

let firstSection = true;
for (let [rs, line] of Object.entries(input)) {
  if (line === "") {
    firstSection = false;
    continue;
  }
  if (firstSection) {
    const [before, after] = line.split("|");
    if (!(before in rules)) rules[before] = new Set([]);
    rules[before].add(after);
  } else {
    const nums = line.split(",");
    const seenBefore = new Set([]);
    let isGood = true;
    for (const num of nums) {
      if (num in rules) {
        const intersection = new Set(
          [...seenBefore].filter((i) => rules[num].has(i))
        );
        if (intersection.size > 0) {
          isGood = false;
          break;
        }
      }
      seenBefore.add(num);
    }
    if (isGood) {
      const middle = Number(nums[Math.floor(nums.length / 2)]);
      out += middle;
    } else {
      bads.push(nums);
    }
  }
}

for (const bad of bads) {
  let good = false;
  let seenBefore = new Set([]);
  let idxMap = {};
  let attempt = bad;
  while (!good) {
    good = true;
    for (const [i, num] of Object.entries(attempt)) {
      if (num in rules) {
        const intersection = new Set(
          [...seenBefore].filter((i) => rules[num].has(i))
        );
        if (intersection.size > 0) {
          let err = [...intersection][0];
          let errIdx = idxMap[err];
          attempt[errIdx] = num;
          attempt[Number(i)] = err;
          idxMap[num] = errIdx;
          idxMap[err] = Number(i);
          seenBefore = new Set([]);
          idxMap = {};
          good = false;
          break;
        }
      }
      seenBefore.add(num);
      idxMap[num] = Number(i);
    }
  }
  const middle = Number(attempt[Math.floor(attempt.length / 2)]);
  out2 += middle;
}

console.log(out);
console.log(out2);
