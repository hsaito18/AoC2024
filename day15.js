const fs = require("fs");
let input = fs.readFileSync("./inputs/day15.txt").toString().split("\n");
input = input.map((l) => l.trim());
const height = input.length;
const width = input[0].length;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

const walls = new Set([]);
const boxes = new Set([]);

const walls2 = new Set([]);
const leftBoxes = new Set([]);
const rightBoxes = new Set([]);

let pos = [0, 0];
let pos2 = [0, 0];

const moves = [];

let inputMap = true;
for (let [rs, line] of Object.entries(input)) {
  if (inputMap) {
    if (line == "") {
      inputMap = false;
    } else {
      for (let [cs, ch] of Object.entries(line)) {
        const key = `${rs},${cs}`;
        const c2 = Number(cs) * 2;
        const leftKey = `${rs},${c2}`;
        const rightKey = `${rs},${c2 + 1}`;
        if (ch === "#") {
          walls.add(key);
          walls2.add(leftKey);
          walls2.add(rightKey);
        } else if (ch === "O") {
          boxes.add(key);
          leftBoxes.add(leftKey);
          rightBoxes.add(rightKey);
        } else if (ch === "@") {
          pos = [Number(rs), Number(cs)];
          pos2 = [Number(rs), c2];
        }
      }
    }
  } else {
    for (let ch of line) {
      moves.push(ch);
    }
  }
}

const DIRMAP = {
  ">": [0, 1],
  "<": [0, -1],
  "^": [-1, 0],
  v: [1, 0],
};

const move = (dir, pos, walls, boxes) => {
  const direction = DIRMAP[dir];
  const newPos = [pos[0] + direction[0], pos[1] + direction[1]];
  const newKey = `${newPos[0]},${newPos[1]}`;
  if (walls.has(newKey)) {
    return pos;
  } else if (boxes.has(newKey)) {
    let nextSpot = [newPos[0] + direction[0], newPos[1] + direction[1]];
    let nextKey = `${nextSpot[0]},${nextSpot[1]}`;
    while (true) {
      if (walls.has(nextKey)) {
        return pos;
      }
      if (boxes.has(nextKey)) {
        nextSpot = [nextSpot[0] + direction[0], nextSpot[1] + direction[1]];
        nextKey = `${nextSpot[0]},${nextSpot[1]}`;
        continue;
      }
      boxes.delete(newKey);
      boxes.add(nextKey);
      return newPos;
    }
  }
  return newPos;
};

const move2 = (dir, pos, walls, leftBoxes, rightBoxes) => {
  const direction = DIRMAP[dir];
  const newPos = [pos[0] + direction[0], pos[1] + direction[1]];
  const newKey = `${newPos[0]},${newPos[1]}`;
  if (dir === `^` || dir === "v") {
    if (walls.has(newKey)) {
      return pos;
    } else if (leftBoxes.has(newKey)) {
      let nextSpot = [newPos[0] + direction[0], newPos[1] + direction[1]];
      let nextKeyLeft = `${nextSpot[0]},${nextSpot[1]}`;
      let nextKeyRight = `${nextSpot[0]},${nextSpot[1] + 1}`;
      const lkeys = [newKey];
      const rkeys = [`${newPos[0]},${newPos[1] + 1}`];
      let checking = [nextKeyLeft, nextKeyRight];
      while (true) {
        let nextChecking = [];
        for (const key of checking) {
          if (walls.has(key)) return pos;
          if (leftBoxes.has(key)) {
            const [nr, nc] = key.split(`,`).map((x) => Number(x));
            const nextLeftSpot = [nr + direction[0], nc + direction[1]];
            const nextRightSpot = [nr + direction[0], nc + direction[1] + 1];
            const nextLeftKey = `${nextLeftSpot[0]},${nextLeftSpot[1]}`;
            const nextRightKey = `${nextRightSpot[0]},${nextRightSpot[1]}`;
            nextChecking.push(nextLeftKey);
            nextChecking.push(nextRightKey);
            lkeys.push(key);
            rkeys.push(`${nr},${nc + 1}`);
          } else if (rightBoxes.has(key)) {
            const [nr, nc] = key.split(`,`).map((x) => Number(x));
            const nextLeftSpot = [nr + direction[0], nc + direction[1] - 1];
            const nextRightSpot = [nr + direction[0], nc + direction[1]];
            const nextLeftKey = `${nextLeftSpot[0]},${nextLeftSpot[1]}`;
            const nextRightKey = `${nextRightSpot[0]},${nextRightSpot[1]}`;
            nextChecking.push(nextLeftKey);
            nextChecking.push(nextRightKey);
            rkeys.push(key);
            lkeys.push(`${nr},${nc - 1}`);
          }
        }
        if (nextChecking.length === 0) {
          const outLeftSet = new Set([]);
          for (const key of lkeys) {
            const [r, c] = key.split(",").map((x) => Number(x));
            const nr = r + direction[0];
            const nc = c + direction[1];
            const outKey = `${nr},${nc}`;
            outLeftSet.add(outKey);
            leftBoxes.delete(key);
          }

          const outRightSet = new Set([]);
          for (const key of rkeys) {
            const [r, c] = key.split(",").map((x) => Number(x));
            const nr = r + direction[0];
            const nc = c + direction[1];
            const outKey = `${nr},${nc}`;
            outRightSet.add(outKey);
            rightBoxes.delete(key);
          }

          for (const key of outLeftSet) {
            leftBoxes.add(key);
          }
          for (const key of outRightSet) {
            rightBoxes.add(key);
          }

          return newPos;
        }

        checking = nextChecking;
      }
    } else if (rightBoxes.has(newKey)) {
      let nextSpot = [newPos[0] + direction[0], newPos[1] + direction[1]];
      let nextKeyRight = `${nextSpot[0]},${nextSpot[1]}`;
      let nextKeyLeft = `${nextSpot[0]},${nextSpot[1] - 1}`;
      const rkeys = [newKey];
      const lkeys = [`${newPos[0]},${newPos[1] - 1}`];
      let checking = [nextKeyLeft, nextKeyRight];
      while (true) {
        let nextChecking = [];
        for (const key of checking) {
          if (walls.has(key)) return pos;
          if (leftBoxes.has(key)) {
            const [nr, nc] = key.split(`,`).map((x) => Number(x));
            const nextLeftSpot = [nr + direction[0], nc + direction[1]];
            const nextRightSpot = [nr + direction[0], nc + direction[1] + 1];
            const nextLeftKey = `${nextLeftSpot[0]},${nextLeftSpot[1]}`;
            const nextRightKey = `${nextRightSpot[0]},${nextRightSpot[1]}`;
            nextChecking.push(nextLeftKey);
            nextChecking.push(nextRightKey);
            lkeys.push(key);
            rkeys.push(`${nr},${nc + 1}`);
          } else if (rightBoxes.has(key)) {
            const [nr, nc] = key.split(`,`).map((x) => Number(x));
            const nextLeftSpot = [nr + direction[0], nc + direction[1] - 1];
            const nextRightSpot = [nr + direction[0], nc + direction[1]];
            const nextLeftKey = `${nextLeftSpot[0]},${nextLeftSpot[1]}`;
            const nextRightKey = `${nextRightSpot[0]},${nextRightSpot[1]}`;
            nextChecking.push(nextLeftKey);
            nextChecking.push(nextRightKey);
            rkeys.push(key);
            lkeys.push(`${nr},${nc - 1}`);
          }
        }
        if (nextChecking.length === 0) {
          const outLeftSet = new Set([]);
          for (const key of lkeys) {
            const [r, c] = key.split(",").map((x) => Number(x));
            const nr = r + direction[0];
            const nc = c + direction[1];
            const outKey = `${nr},${nc}`;
            outLeftSet.add(outKey);
            leftBoxes.delete(key);
          }

          const outRightSet = new Set([]);
          for (const key of rkeys) {
            const [r, c] = key.split(",").map((x) => Number(x));
            const nr = r + direction[0];
            const nc = c + direction[1];
            const outKey = `${nr},${nc}`;
            outRightSet.add(outKey);
            rightBoxes.delete(key);
          }

          for (const key of outLeftSet) {
            leftBoxes.add(key);
          }
          for (const key of outRightSet) {
            rightBoxes.add(key);
          }

          return newPos;
        }

        checking = nextChecking;
      }
    }
    return newPos;
  } else if (dir === ">") {
    if (walls.has(newKey)) {
      return pos;
    } else if (leftBoxes.has(newKey)) {
      let leftBoxesToMove = [newKey];
      let nextSpot = [newPos[0], newPos[1] + 2];
      let nextKey = `${nextSpot[0]},${nextSpot[1]}`;
      while (true) {
        if (walls.has(nextKey)) {
          return pos;
        }
        if (leftBoxes.has(nextKey)) {
          leftBoxesToMove.push(nextKey);
          nextSpot = [nextSpot[0], nextSpot[1] + 2];
          nextKey = `${nextSpot[0]},${nextSpot[1]}`;
          continue;
        }
        // console.log(`del:${newKey} add:${nextSpot[0]},${nextSpot[1]}`);
        for (const keybox of leftBoxesToMove) {
          const [r, c] = keybox.split(",").map((x) => Number(x));
          const rightKey = `${r},${c + 1}`;
          const nextRightKey = `${r},${c + 2}`;
          leftBoxes.delete(keybox);
          rightBoxes.delete(rightKey);
          leftBoxes.add(rightKey);
          rightBoxes.add(nextRightKey);
        }

        return newPos;
      }
    }
    return newPos;
  } else {
    if (walls.has(newKey)) {
      return pos;
    } else if (rightBoxes.has(newKey)) {
      let rightBoxesToMove = [newKey];
      let nextSpot = [newPos[0], newPos[1] - 2];
      let nextKey = `${nextSpot[0]},${nextSpot[1]}`;
      while (true) {
        if (walls.has(nextKey)) {
          return pos;
        }
        if (rightBoxes.has(nextKey)) {
          rightBoxesToMove.push(nextKey);
          nextSpot = [nextSpot[0], nextSpot[1] - 2];
          nextKey = `${nextSpot[0]},${nextSpot[1]}`;
          continue;
        }
        for (const keybox of rightBoxesToMove) {
          const [r, c] = keybox.split(",").map((x) => Number(x));
          const leftKey = `${r},${c - 1}`;
          const nextLeftKey = `${r},${c - 2}`;
          rightBoxes.delete(keybox);
          leftBoxes.delete(leftKey);
          rightBoxes.add(leftKey);
          leftBoxes.add(nextLeftKey);
        }

        return newPos;
      }
    }
    return newPos;
  }
};

for (const dir of moves) {
  const nextPos = move(dir, pos, walls, boxes);
  pos = nextPos;
  const nextPos2 = move2(dir, pos2, walls2, leftBoxes, rightBoxes);
  pos2 = nextPos2;
}

for (const box of boxes) {
  const [br, bc] = box.split(`,`).map((x) => Number(x));
  out += 100 * br + bc;
}

for (const box of leftBoxes) {
  const [br, bc] = box.split(`,`).map((x) => Number(x));
  out2 += 100 * br + bc;
}

console.log(out);
console.log(out2);
