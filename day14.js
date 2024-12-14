const fs = require("fs");
let input = fs.readFileSync("./inputs/day14.txt").toString().split("\n");
input = input.map((l) => l.trim());
// const height = input.length;
// const width = input[0].length;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

const WIDTH = 101;
const HEIGHT = 103;
// const HEIGHT = 7;
// const WIDTH = 11;
const TOTALTIME = 103 * 103;
const PART1TIME = 100;
const PART2TIME = 101 * 103;

const robots = [];

for (let [rs, line] of Object.entries(input)) {
  const [posdata, veldata] = line.split(" ");
  const posnums = posdata.slice(2);
  const velnums = veldata.slice(2);
  const startPos = posnums.split(",").map((x) => Number(x));
  const vel = velnums.split(",").map((x) => Number(x));

  // console.log(startPos, vel);
  let x = startPos[0];
  let y = startPos[1];
  const positions = [];
  const visited = new Set([]);
  let mod = 0;
  for (let i = 0; i < TOTALTIME; i++) {
    x = x + vel[0];
    y = y + vel[1];
    // console.log(x, y);
    if (x < 0) {
      x = WIDTH + x;
    } else if (x >= WIDTH) {
      x = x - WIDTH;
    }
    if (y < 0) {
      y = HEIGHT + y;
    } else if (y >= HEIGHT) {
      y = y - HEIGHT;
    }
    // console.log(x, y);
    positions.push([x, y]);
    const key = `${x},${y}`;
    if (visited.has(key)) {
      mod = i + 1;
      break;
    } else {
      visited.add(key);
    }
  }
  const obj = {
    positions,
    mod,
  };
  robots.push(obj);
}

const midCol = Math.floor(HEIGHT / 2);
const midRow = Math.floor(WIDTH / 2);
let topleft = 0;
let topright = 0;
let botleft = 0;
let botright = 0;

for (const robot of robots) {
  let finalPos = robot.positions[PART1TIME - 1];
  if (robot.mod !== 0 && PART1TIME > robot.mod) {
    console.log(robot.mod);
    let idx = ((PART1TIME + 1) % robot.mod) - 1;
    if (idx === -1) idx = robot.mod - 1;
    console.log(idx, PART1TIME);
    finalPos = robot.positions[idx];
  }

  if (finalPos[0] > midRow) {
    if (finalPos[1] > midCol) {
      botright++;
    } else if (finalPos[1] < midCol) {
      botleft++;
    }
  } else if (finalPos[0] < midRow) {
    if (finalPos[1] > midCol) {
      topright++;
    } else if (finalPos[1] < midCol) {
      topleft++;
    }
  }
}

out = topleft * topright * botleft * botright;

let minsize = 300;
const getSafetyFactor = (i, robots) => {
  let topleft = 0;
  let topright = 0;
  let botleft = 0;
  let botright = 0;

  for (const robot of robots) {
    let finalPos = robot.positions[i - 1];
    if (robot.mod !== 0) {
      let idx = ((i + 1) % robot.mod) - 1;
      if (idx === -1) idx = robot.mod - 1;
      finalPos = robot.positions[idx];
    }

    if (finalPos[0] > midRow) {
      if (finalPos[1] > midCol) {
        botright++;
      } else if (finalPos[1] < midCol) {
        botleft++;
      }
    } else if (finalPos[0] < midRow) {
      if (finalPos[1] > midCol) {
        topright++;
      } else if (finalPos[1] < midCol) {
        topleft++;
      }
    }
  }

  return topleft * topright * botleft * botright;
};

let minSF = 1000000000000;
let minSFIdx = 0;
for (let i = 0; i < PART2TIME; i++) {
  const res = getSafetyFactor(i, robots);
  if (res < minSF) {
    minSF = res;
    minSFIdx = i + 1;
  }
}

out2 = minSFIdx;
console.log(out);
console.log(out2);

//218021760
//220958166
//232577730
//235579920
//233709840
