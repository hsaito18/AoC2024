const fs = require("fs");
let input = fs.readFileSync("./inputs/day11.txt").toString().split("\n");
input = input.map((l) => l.trim());
const height = input.length;
const width = input[0].length;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

const handleStone = (num) => {
  if (isNaN(num)) console.log(num);
  if (num === 0) return [1];
  const string = String(num);
  if (string.length % 2 == 0) {
    const half = string.length / 2;
    const firstHalf = string.slice(0, half);
    const secondHalf = string.slice(half);
    return [Number(firstHalf), Number(secondHalf)];
  }
  return [num * 2024];
};

let uniques = {};

for (let [rs, line] of Object.entries(input)) {
  const r = Number(rs);
  let stones = line.split(" ").map((x) => Number(x));
  let stone1 = [stones[0]];
  for (const stone of stones) {
    if (stone in uniques) {
      uniques[stone] = uniques[stone] + 1;
    } else {
      uniques[stone] = 1;
    }
  }

  for (let i = 0; i < 75; i++) {
    let nextUniques = Object.assign({}, uniques);
    for (const [k, v] of Object.entries(uniques)) {
      const out = handleStone(Number(k));
      for (const o of out) {
        if (o in nextUniques) {
          nextUniques[o] = nextUniques[o] + v;
        } else {
          nextUniques[o] = v;
        }
      }
      nextUniques[k] = nextUniques[k] - v;
      if (nextUniques[k] === 0) delete nextUniques[k];
    }
    uniques = nextUniques;
  }
}

for (const [k, v] of Object.entries(uniques)) {
  out += v;
}

console.log(out);
console.log(out2);
