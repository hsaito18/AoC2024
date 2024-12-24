const fs = require("fs");
let input = fs.readFileSync("./inputs/day23.txt").toString().split("\n");
input = input.map((l) => l.trim());
const height = input.length;
const width = input[0].length;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

const pairs = {};
const networks = { 1: new Set([]), 2: new Set([]) };

for (let [rs, line] of Object.entries(input)) {
  const [c1, c2] = line.split("-");
  networks[1].add(c1);
  networks[1].add(c2);
  if (!(c1 in pairs)) {
    pairs[c1] = new Set([]);
  }
  if (!(c2 in pairs)) {
    pairs[c2] = new Set([]);
  }
  pairs[c1].add(c2);
  pairs[c2].add(c1);
  const sorted = [c1, c2].sort().toString();
  networks[2].add(sorted);
}

for (let [rs, line] of Object.entries(input)) {
  const [c1, c2] = line.split("-");
  let isT = c1[0] === "t" || c2[0] === "t";
  for (const oc of pairs[c1]) {
    if (pairs[c2].has(oc)) {
      if (isT) {
        out++;
      } else {
        if (oc[0] === "t") out++;
      }
    }
  }
}

out /= 3;

let max = 0;
for (let i = 3; i < 15; i++) {
  const nextSet = new Set([]);
  const prev = networks[i - 1];
  for (const net of prev) {
    const comps = net.split(",");
    const firstComp = comps[0];
    const firstCompConnections = pairs[firstComp];
    for (const other of firstCompConnections) {
      if (comps.includes(other)) continue;
      let isGood = true;
      for (const notFirstComp of comps) {
        if (notFirstComp === firstComp) continue;
        if (!pairs[notFirstComp].has(other)) {
          isGood = false;
          break;
        }
      }
      if (isGood) {
        const next = [...comps, other].sort().toString();
        nextSet.add(next);
      }
    }
  }
  if (nextSet.size === 0) {
    max = i - 1;
    break;
  }
  networks[i] = nextSet;
}

for (const x of networks[max]) {
  out2 = x;
  break;
}

console.log(out);
console.log(out2);
