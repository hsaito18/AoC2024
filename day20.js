const fs = require("fs");
let input = fs.readFileSync("./inputs/day20.txt").toString().split("\n");
input = input.map((l) => l.trim());
const height = input.length;
const width = input[0].length;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

let goalPos = [];
let startPos = [];

const fullWalls = new Set([]);

for (let [rs, line] of Object.entries(input)) {
  const r = Number(rs);
  for (let [cs, ch] of Object.entries(line)) {
    const c = Number(cs);
    if (ch === "E") {
      goalPos = [r, c];
    } else if (ch === "S") {
      startPos = [r, c];
    } else if (ch === "#") {
      fullWalls.add(`${r},${c}`);
    }
  }
}

const getOptions = (row, col, cheated, steps) => {
  let options = [];
  if (row > 0) {
    const ch = input[row - 1][col];
    if (ch !== "#") {
      if (cheated && cheated.length === 1) {
        const nextCheated = [...cheated, [row - 1, col]];
        options.push([row - 1, col, nextCheated, steps + 1]);
      } else {
        options.push([row - 1, col, cheated, steps + 1]);
      }
    } else if (!cheated) {
      options.push([row - 1, col, [[row, col]], steps + 1]);
    }
  }
  if (row < height - 1) {
    const ch = input[row + 1][col];
    if (ch !== "#") {
      if (cheated && cheated.length === 1) {
        const nextCheated = [...cheated, [row + 1, col]];
        options.push([row + 1, col, nextCheated, steps + 1]);
      } else {
        options.push([row + 1, col, cheated, steps + 1]);
      }
    } else if (!cheated) {
      options.push([row + 1, col, [[row, col]], steps + 1]);
    }
  }
  if (col > 0) {
    const ch = input[row][col - 1];
    if (ch !== "#") {
      if (cheated && cheated.length === 1) {
        const nextCheated = [...cheated, [row, col - 1]];
        options.push([row, col - 1, nextCheated, steps + 1]);
      } else {
        options.push([row, col - 1, cheated, steps + 1]);
      }
    } else if (!cheated) {
      options.push([row, col - 1, [[row, col]], steps + 1]);
    }
  }
  if (col < width - 1) {
    const ch = input[row][col + 1];
    if (ch !== "#") {
      if (cheated && cheated.length === 1) {
        const nextCheated = [...cheated, [row, col + 1]];
        options.push([row, col + 1, nextCheated, steps + 1]);
      } else {
        options.push([row, col + 1, cheated, steps + 1]);
      }
    } else if (!cheated) {
      options.push([row, col + 1, [[row, col]], steps + 1]);
    }
  }
  return options;
};

let visited = new Set([]);
const memo = {};

const appendQueue = (options, queue, doMemo) => {
  for (const op of options) {
    let key = "";
    if (op[2] && op[2].length === 1) {
      key = `${op[0]},${op[1]},${false}`;
    } else {
      key = `${op[0]},${op[1]},${op[2]}`;
    }
    if (!visited.has(key)) {
      queue.push(op);
      visited.add(key);
      if (doMemo) memo[`${op[0]},${op[1]}`] = op[3];
    }
  }
};

const cheatedToStr = (cheated) => {
  if (!cheated) return "false";
  if (cheated.length === 1) return `${cheated[0][0]},${cheated[0][1]}`;
  return `${cheated[0][0]},${cheated[0][1]},${cheated[1][0]},${cheated[1][1]}`;
};

let options = getOptions(goalPos[0], goalPos[1], ["a", "b"], 0);
let queue = [];
appendQueue(options, queue, true);

while (queue.length > 0) {
  const [currRow, currCol, currCheated, currSteps] = queue.shift();
  const options = getOptions(currRow, currCol, currCheated, currSteps);
  appendQueue(options, queue, true);
}

const results = {};

options = getOptions(startPos[0], startPos[1], false, 0);
queue = [];
appendQueue(options, queue, false);
while (queue.length > 0) {
  const [currRow, currCol, currCheated, currSteps] = queue.shift();
  if (currRow === goalPos[0] && currCol === goalPos[1]) {
    results[cheatedToStr(currCheated)] = currSteps;
  } else {
    if (currCheated.length === 2) {
      const key = `${currRow},${currCol}`;
      if (key in memo) {
        results[cheatedToStr(currCheated)] =
          currSteps + memo[`${currRow},${currCol}`];
        continue;
      }
    }
    const options = getOptions(currRow, currCol, currCheated, currSteps);
    appendQueue(options, queue, false);
  }
}

for (const [key, v] of Object.entries(results)) {
  if (v <= 9428 - 100) {
    out++;
  }
}

const getOptions2 = (row, col, cheated, steps) => {
  if (cheated) {
    return getOptions(row, col, cheated, steps);
  }
  const options = [];
  for (let nr = row - 20; nr <= row + 20; nr++) {
    if (nr >= height) break;
    if (nr < 0) continue;
    for (let nc = col - 20; nc <= col + 20; nc++) {
      if (nc >= width) break;
      if (nc < 0) continue;
      const distance = Math.abs(nr - row) + Math.abs(nc - col);
      if (distance > 20) continue;
      if (input[nr][nc] === "#") continue;
      if (distance === 1) {
        options.push([nr, nc, false, distance + steps]);
      } else {
        options.push([
          nr,
          nc,
          [
            [row, col],
            [nr, nc],
          ],
          distance + steps,
        ]);
      }
    }
  }
  return options;
};

const appendQueue2 = (options, queue) => {
  for (const op of options) {
    let key = "";
    if (op[2] && op[2].length === 1) {
      key = `${op[0]},${op[1]},${false}`;
    } else {
      key = `${op[0]},${op[1]},${op[2]}`;
    }
    if (!(key in visited2) || visited2[key] > op[3]) {
      queue.push(op);
      visited2[key] = op[3];
    }
  }
};

const visited2 = {};
const results2 = {};
options = getOptions2(startPos[0], startPos[1], false, 0);
queue = [];
appendQueue2(options, queue, false);
while (queue.length > 0) {
  const [currRow, currCol, currCheated, currSteps] = queue.shift();
  if (currRow === goalPos[0] && currCol === goalPos[1]) {
    const key = cheatedToStr(currCheated);
    if (!(key in results2) || results2[key] > currSteps)
      results2[key] = currSteps;
  } else {
    if (currCheated.length === 2) {
      const key = `${currRow},${currCol}`;
      if (key in memo) {
        const key = cheatedToStr(currCheated);
        const fullSteps = currSteps + memo[`${currRow},${currCol}`];
        if (!(key in results2) || results2[key] > fullSteps)
          results2[key] = fullSteps;
        continue;
      } else {
        continue;
      }
    }
    const options = getOptions2(currRow, currCol, currCheated, currSteps);
    appendQueue2(options, queue, false);
  }
}

for (const [key, v] of Object.entries(results2)) {
  if (v <= 9428 - 100) {
    out2++;
  }
}
console.log(out);
console.log(out2);
