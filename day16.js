const fs = require("fs");
let input = fs.readFileSync("./inputs/day16.txt").toString().split("\n");
input = input.map((l) => l.trim());
const height = input.length;
const width = input[0].length;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

const states = {};

const goalPos = [];
let pos = [];
let dir = "E";

for (let [rs, line] of Object.entries(input)) {
  for (let [cs, ch] of Object.entries(line)) {
    if (ch === "E") {
      goalPos[0] = Number(rs);
      goalPos[1] = Number(cs);
    } else if (ch === "S") {
      pos[0] = Number(rs);
      pos[1] = Number(cs);
    }
  }
}

const getOptions = (pos, dir, points, hist) => {
  let out;
  if (dir === "E") {
    out = [
      [...pos, "N", points + 1000],
      [...pos, "S", points + 1000],
    ];
    const nextRow = pos[0];
    const nextCol = pos[1] + 1;
    if (nextCol >= 0 && nextCol < width && input[nextRow][nextCol] !== "#") {
      out.push([nextRow, nextCol, "E", points + 1]);
    }
  } else if (dir === "N") {
    out = [
      [...pos, "E", points + 1000],
      [...pos, "W", points + 1000],
    ];
    const nextRow = pos[0] - 1;
    const nextCol = pos[1];
    if (nextRow >= 0 && nextRow < height && input[nextRow][nextCol] !== "#") {
      out.push([nextRow, nextCol, "N", points + 1]);
    }
  } else if (dir === "S") {
    out = [
      [...pos, "E", points + 1000],
      [...pos, "W", points + 1000],
    ];
    const nextRow = pos[0] + 1;
    const nextCol = pos[1];
    if (nextRow >= 0 && nextRow < height && input[nextRow][nextCol] !== "#") {
      out.push([nextRow, nextCol, "S", points + 1]);
    }
  } else if (dir === "W") {
    out = [
      [...pos, "N", points + 1000],
      [...pos, "S", points + 1000],
    ];
    const nextRow = pos[0];
    const nextCol = pos[1] - 1;
    if (nextCol >= 0 && nextCol < width && input[nextRow][nextCol] !== "#") {
      out.push([nextRow, nextCol, "W", points + 1]);
    }
  }

  for (const k of out) {
    k.push([...hist, [...pos, dir]]);
  }
  return out;
};

let options = getOptions(pos, dir, 0, []);
let queue = [...options];
const winners = [];
const putAPinOnIt = {};
while (queue.length > 0) {
  const curr = queue.shift();

  const key = `${curr[0]},${curr[1]},${curr[2]}`;
  if (curr[0] == goalPos[0] && curr[1] == goalPos[1]) {
    winners.push([curr[3], curr[4]]);
  }
  if (key in states && states[key] === curr[3]) {
    if (key in putAPinOnIt) {
      const curr = putAPinOnIt[key];
      const n = putAPinOnIt[key].concat(curr[4]);
      putAPinOnIt[key] = n;
    } else {
      putAPinOnIt[key] = [...curr[4]];
    }
  }
  if (!(key in states) || states[key] > curr[3]) {
    if (key in putAPinOnIt) {
      delete putAPinOnIt[key];
    }
    states[key] = curr[3];
    const nextOptions = getOptions(
      [curr[0], curr[1]],
      curr[2],
      curr[3],
      curr[4]
    );
    if (curr[0] == goalPos[0] && curr[1] == goalPos[1]) {
      continue;
    }
    queue = queue.concat(nextOptions);
  }
}

const outKeys = [
  `${goalPos[0]},${goalPos[1]},N`,
  `${goalPos[0]},${goalPos[1]},E`,
  `${goalPos[0]},${goalPos[1]},S`,
  `${goalPos[0]},${goalPos[1]},W`,
];
out = Infinity;

for (const key of outKeys) {
  if (key in states && out > states[key]) {
    out = states[key];
  }
}

const goodTiles = new Set([]);

for (const [score, history] of winners) {
  if (score === out) {
    const tiles = [...history];
    for (const [r, c, d] of tiles) {
      const tilekey = `${r},${c}`;
      goodTiles.add(tilekey);
      const pinkey = `${r},${c},${d}`;
      if (pinkey in putAPinOnIt) {
        for (const o of putAPinOnIt[pinkey]) {
          tiles.push(o);
        }
        delete putAPinOnIt[pinkey];
      }
    }
  }
}

out2 = goodTiles.size + 1;

console.log(out);
console.log(out2);
