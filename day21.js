const fs = require("fs");
let input = fs.readFileSync("./inputs/day21.txt").toString().split("\n");
input = input.map((l) => l.trim());
const height = input.length;
const width = input[0].length;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

const NUMPAD_MAP = {
  A: [3, 2],
  0: [3, 1],
  1: [2, 0],
  2: [2, 1],
  3: [2, 2],
  4: [1, 0],
  5: [1, 1],
  6: [1, 2],
  7: [0, 0],
  8: [0, 1],
  9: [0, 2],
};

const ARROW_MAP = {
  A: [0, 2],
  "^": [0, 1],
  "<": [1, 0],
  v: [1, 1],
  ">": [1, 2],
};

const solveNumPad = () => {
  const sols = {};
  for (const key of Object.keys(NUMPAD_MAP)) {
    sols[key] = {};
    for (const goalKey of Object.keys(NUMPAD_MAP)) {
      if (goalKey === key) continue;
      let pos = [...NUMPAD_MAP[key]];

      let goalPos = [...NUMPAD_MAP[goalKey]];
      const dr = goalPos[0] - pos[0];
      const dc = goalPos[1] - pos[1];
      sols[key][goalKey] = { steps: Math.abs(dr) + Math.abs(dc), ways: [] };
      if (dr === 0) {
        let sol = [];
        for (let j = 0; j < Math.abs(dc); j++) {
          if (dc > 0) {
            sol.push(">");
          } else {
            sol.push("<");
          }
        }
        sols[key][goalKey].ways = [sol];
        continue;
      }

      if (dc === 0) {
        let sol = [];
        for (let j = 0; j < Math.abs(dr); j++) {
          if (dr > 0) {
            sol.push("v");
          } else {
            sol.push("^");
          }
        }
        sols[key][goalKey].ways = [sol];
        continue;
      }
      if (pos[1] !== 0 || (pos[0] !== 3 && goalPos[0] !== 3)) {
        let sol = [];
        for (let i = 0; i < Math.abs(dr); i++) {
          if (dr > 0) {
            sol.push("v");
          } else {
            sol.push("^");
          }
        }
        for (let j = 0; j < Math.abs(dc); j++) {
          if (dc > 0) {
            sol.push(">");
          } else {
            sol.push("<");
          }
        }
        sols[key][goalKey].ways.push(sol);
      }

      if (pos[0] !== 3 || (pos[1] !== 0 && goalPos[1] !== 0)) {
        let sol = [];
        for (let j = 0; j < Math.abs(dc); j++) {
          if (dc > 0) {
            sol.push(">");
          } else {
            sol.push("<");
          }
        }
        for (let i = 0; i < Math.abs(dr); i++) {
          if (dr > 0) {
            sol.push("v");
          } else {
            sol.push("^");
          }
        }
        sols[key][goalKey].ways.push(sol);
      }
    }
  }
  return sols;
};

const solveArrowPad = () => {
  const sols = {};
  for (const key of Object.keys(ARROW_MAP)) {
    sols[key] = {};
    for (const goalKey of Object.keys(ARROW_MAP)) {
      if (goalKey === key) continue;
      let pos = [...ARROW_MAP[key]];

      let goalPos = [...ARROW_MAP[goalKey]];
      const dr = goalPos[0] - pos[0];
      const dc = goalPos[1] - pos[1];
      sols[key][goalKey] = { steps: Math.abs(dr) + Math.abs(dc), ways: [] };
      if (dr === 0) {
        let sol = [];
        for (let j = 0; j < Math.abs(dc); j++) {
          if (dc > 0) {
            sol.push(">");
          } else {
            sol.push("<");
          }
        }
        sols[key][goalKey].ways = [sol];
        continue;
      }

      if (dc === 0) {
        let sol = [];
        for (let j = 0; j < Math.abs(dr); j++) {
          if (dr > 0) {
            sol.push("v");
          } else {
            sol.push("^");
          }
        }
        sols[key][goalKey].ways = [sol];
        continue;
      }
      if (pos[1] !== 0) {
        let sol = [];
        for (let i = 0; i < Math.abs(dr); i++) {
          if (dr > 0) {
            sol.push("v");
          } else {
            sol.push("^");
          }
        }
        for (let j = 0; j < Math.abs(dc); j++) {
          if (dc > 0) {
            sol.push(">");
          } else {
            sol.push("<");
          }
        }
        sols[key][goalKey].ways.push(sol);
      }

      if (pos[0] !== 0 || (pos[1] !== 0 && goalPos[1] !== 0)) {
        let sol = [];
        for (let j = 0; j < Math.abs(dc); j++) {
          if (dc > 0) {
            sol.push(">");
          } else {
            sol.push("<");
          }
        }
        for (let i = 0; i < Math.abs(dr); i++) {
          if (dr > 0) {
            sol.push("v");
          } else {
            sol.push("^");
          }
        }
        sols[key][goalKey].ways.push(sol);
      }
    }
  }
  return sols;
};

const numPadOptimal = solveNumPad();
const arrowOptimal = solveArrowPad();

const numPadSolutions = {};
for (let [rs, line] of Object.entries(input)) {
  let pos = "A";
  let solutions = [];
  for (let ch of line) {
    let nextSolutions = [];
    const ways = numPadOptimal[pos][ch]?.ways ?? [[]];
    if (solutions.length === 0) {
      for (const w of ways) {
        const a = [...w, "A"];
        nextSolutions.push(a);
      }
    } else {
      for (const sol of solutions) {
        for (const w of ways) {
          const currentSolution = sol.concat(w).concat("A");
          nextSolutions.push(currentSolution);
        }
      }
    }

    pos = ch;
    solutions = nextSolutions;
  }
  numPadSolutions[line] = solutions;
}

const recurse = (arrowCode, deep, depth, memoization) => {
  if (deep === depth) return arrowCode.length;
  const key = `${arrowCode.toString()},${deep}`;
  if (key in memoization) {
    return memoization[key];
  }
  let sum = 0;
  for (const [i, c] of Object.entries(arrowCode)) {
    const idx = Number(i);
    const pastKey = idx > 0 ? arrowCode[idx - 1] : "A";
    if (pastKey === c) {
      sum += recurse(["A"], deep + 1, depth, memoization);
      continue;
    }
    const options = arrowOptimal[pastKey][c].ways;
    let min = Infinity;
    for (const o of options) {
      const next = [...o, "A"];
      const val = recurse(next, deep + 1, depth, memoization);
      if (val < min) min = val;
    }
    sum += min;
  }
  memoization[key] = sum;
  return sum;
};

const memo1 = {};
const memo2 = {};

for (const [code, solutions] of Object.entries(numPadSolutions)) {
  const num = Number(code.slice(0, 3));
  let min = Infinity;
  let min2 = Infinity;
  for (const sol of solutions) {
    let steps = recurse(sol, 0, 2, memo1);
    let steps2 = recurse(sol, 0, 25, memo2);
    if (steps < min) min = steps;
    if (steps2 < min2) min2 = steps2;
  }
  out += min * num;
  out2 += min2 * num;
}

console.log(out);
console.log(out2);
