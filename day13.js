const fs = require("fs");
let input = fs.readFileSync("./inputs/day13.txt").toString().split("\n");
input = input.map((l) => l.trim());
const height = input.length;
const width = input[0].length;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

const machines = [];
const machines2 = [];

let currMachine = {};
let currMachine2 = {};

for (let [rs, line] of Object.entries(input)) {
  if (line === "") {
    machines.push(currMachine);
    currMachine = {};
    machines2.push(currMachine2);
    currMachine2 = {};
    continue;
  }
  let [label, content] = line.split(":");
  const [xString, yString] = content.split(",");
  const x = Number(xString.slice(3));
  const y = Number(yString.slice(3));
  if (label === "Button A") {
    currMachine.a = { x, y };
    currMachine2.a = { x, y };
  } else if (label === "Button B") {
    currMachine.b = { x, y };
    currMachine2.b = { x, y };
  } else if (label === "Prize") {
    currMachine.prize = { x, y };
    currMachine2.prize = { x: x + 10000000000000, y: y + 10000000000000 };
  } else {
    console.error("AAAAA!", label, content);
  }
}

machines.push(currMachine);
machines2.push(currMachine2);

const checkSolution = (as, bs, machine) => {
  const x = as * machine.a.x + bs * machine.b.x;
  const y = as * machine.a.y + bs * machine.b.y;
  if (x !== machine.prize.x) return false;
  if (y !== machine.prize.y) return false;
  return as * 3 + bs;
};

let successes1 = [];

let i = 0;
for (const machine of machines) {
  const xBs = Math.floor(machine.prize.x / machine.b.x);
  const yBs = Math.floor(machine.prize.y / machine.b.y);
  const maxBs = Math.min(xBs, yBs);
  for (let bs = maxBs; bs >= 0; bs--) {
    const remainderX = machine.prize.x - bs * machine.b.x;
    const remainderY = machine.prize.y - bs * machine.b.y;
    const xAs = Math.floor(remainderX / machine.a.x);
    const yAs = Math.floor(remainderY / machine.a.y);
    if (xAs !== yAs) continue;
    const sol = checkSolution(xAs, bs, machine);
    if (!sol) continue;
    out += sol;
    // console.log(xAs, bs);
    successes1.push(machine);
  }
  i++;
}

let successes2 = [];
i = 0;
for (const machine of machines2) {
  const xBs = Math.floor(machine.prize.x / machine.b.x);
  const yBs = Math.floor(machine.prize.y / machine.b.y);
  const maxBs = Math.min(xBs, yBs);
  const visited = new Set([]);
  let bs = maxBs;
  while (true) {
    const remainderX = machine.prize.x - bs * machine.b.x;
    const remainderY = machine.prize.y - bs * machine.b.y;

    const xAs = Math.floor(remainderX / machine.a.x);
    const yAs = Math.floor(remainderY / machine.a.y);

    if (xAs === yAs) {
      const sol = checkSolution(xAs, bs, machine);
      if (sol) {
        out2 += sol;
        successes2.push(machine);
        break;
      }
    }

    visited.add(bs);

    const maxAs = Math.min(xAs, yAs);
    const remainderX2 = remainderX - maxAs * machine.a.x;
    const remainderY2 = remainderY - maxAs * machine.a.y;

    const abdx = machine.a.x - machine.b.x;
    const abdy = machine.a.y - machine.b.y;
    const dxy = abdx - abdy;
    const dr = remainderX2 - remainderY2;
    let swaps = Math.floor(dr / dxy / 10);
    if (swaps === 0) swaps = 1;

    bs = Math.max(bs - swaps, 0);
    // console.log(remainderX2, remainderY2, swaps, bs);
    if (visited.has(bs)) {
      break;
    }
  }
  i++;
}

console.log(out);
console.log(out2);

// console.log(successes1[100]);
// console.log(successes2[100]);

// for (let i = 0; i < successes1.length; i++) {
//   const f = successes1[i].prize.y;
//   const g = successes2[i].prize.y;
//   if (f !== g) {
//     console.log(f);
//     break;
//   }
// }

//76783754467545 too low...
//77641963423992 too low...
