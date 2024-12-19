const fs = require("fs");
let input = fs.readFileSync("./inputs/day19.txt").toString().split("\n");
input = input.map((l) => l.trim());
const height = input.length;
const width = input[0].length;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

const towels = input[0].split(", ");

const saved = {};

const solve = (design) => {
  if (design.length === 0) return 1;
  if (design in saved) {
    return saved[design];
  }
  let ways = 0;
  for (const t of towels) {
    const tl = t.length;
    if (t === design.slice(0, tl)) {
      const res = solve(design.slice(tl));
      saved[design.slice(tl)] = res;
      ways += res;
    }
  }
  return ways;
};

for (let [rs, line] of Object.entries(input)) {
  const r = Number(rs);
  if (r < 2) continue;
  const res = solve(line);
  if (res) out++;
  out2 += res;
}

console.log(out);
console.log(out2);
