const fs = require("fs");
let input = fs.readFileSync("./inputs/day08.txt").toString().split("\n");
input = input.map((l) => l.trim());

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

const antennas = {};

const height = input.length;
const width = input[0].length;

const antinodes = new Set([]);

for (let [rs, line] of Object.entries(input)) {
  const r = Number(rs);
  for (let [cs, ch] of Object.entries(line)) {
    let c = Number(cs);
    if (ch !== ".") {
      if (!(ch in antennas)) {
        antennas[ch] = [[r, c]];
      } else {
        for (const [or, oc] of antennas[ch]) {
          const dir = [or - r, oc - c];
          const far = [or + dir[0], oc + dir[1]];
          if (
            !(far[0] >= height || far[0] < 0 || far[1] >= width || far[1] < 0)
          ) {
            const antinodeStr = `${far[0]},${far[1]}`;
            antinodes.add(antinodeStr);
          }

          const near = [r - dir[0], c - dir[1]];
          if (
            !(
              near[0] >= height ||
              near[0] < 0 ||
              near[1] >= width ||
              near[1] < 0
            )
          ) {
            const antinodeStr = `${near[0]},${near[1]}`;
            antinodes.add(antinodeStr);
          }
        }
        antennas[ch].push([r, c]);
      }
    }
  }
}

const antinodes2 = new Set([]);
const antennas2 = {};

for (let [rs, line] of Object.entries(input)) {
  const r = Number(rs);
  for (let [cs, ch] of Object.entries(line)) {
    let c = Number(cs);
    if (ch !== ".") {
      if (!(ch in antennas2)) {
        antennas2[ch] = [[r, c]];
      } else {
        for (const [or, oc] of antennas2[ch]) {
          const dir = [or - r, oc - c];
          let done = false;
          let nextPt = [r + dir[0], c + dir[1]];
          while (!done) {
            if (
              nextPt[0] >= height ||
              nextPt[0] < 0 ||
              nextPt[1] >= width ||
              nextPt[1] < 0
            ) {
              done = true;
            } else {
              const antinodeStr = `${nextPt[0]},${nextPt[1]}`;
              antinodes2.add(antinodeStr);
              nextPt = [nextPt[0] + dir[0], nextPt[1] + dir[1]];
            }
          }

          done = false;
          nextPt = [or - dir[0], oc - dir[1]];
          while (!done) {
            if (
              nextPt[0] >= height ||
              nextPt[0] < 0 ||
              nextPt[1] >= width ||
              nextPt[1] < 0
            ) {
              done = true;
            } else {
              const antinodeStr = `${nextPt[0]},${nextPt[1]}`;
              antinodes2.add(antinodeStr);
              nextPt = [nextPt[0] - dir[0], nextPt[1] - dir[1]];
            }
          }
        }
        antennas2[ch].push([r, c]);
      }
    }
  }
}

out = antinodes.size;
out2 = antinodes2.size;

console.log(out);
console.log(out2);
