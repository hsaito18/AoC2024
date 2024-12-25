const fs = require("fs");
let input = fs.readFileSync("./inputs/day24.txt").toString().split("\n");
input = input.map((l) => l.trim());
const height = input.length;
const width = input[0].length;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

const wires = {};
const gates = [];

let xString = "";
let yString = "";

let inMode = true;
for (let [rs, line] of Object.entries(input)) {
  if (inMode) {
    if (line === "") {
      inMode = false;
      continue;
    }
    const [wire, val] = line.split(": ");
    wires[wire] = Number(val);
    if (wire[0] === "x") {
      xString = String(val) + xString;
    } else if (wire[0] === "y") {
      yString = String(val) + yString;
    }
  } else {
    gates.push(line.split(" "));
  }
}

const run = (gates) => {
  const zWires = {};
  const wiresCopy = Object.assign({}, wires);
  let remainingGates = [...gates];
  let prevLength = remainingGates.length;
  while (true) {
    const nextGates = [];
    for (const gate of remainingGates) {
      const [in1, type, in2, _, output] = gate;
      if (in1 in wiresCopy && in2 in wiresCopy) {
        const a = Number(wiresCopy[in1]);
        const b = Number(wiresCopy[in2]);
        let out = 0;
        if (type === "AND") {
          out = a && b;
        } else if (type === "OR") {
          out = a || b;
        } else if (type === "XOR") {
          if ((a && b) || (!a && !b)) {
            out = 0;
          } else {
            out = 1;
          }
        } else {
          console.log("Invalid type of gate! ", gate);
        }
        if (!(output in wiresCopy)) wiresCopy[output] = out;
        if (output[0] === "z") {
          zWires[output] = out;
        }
      } else {
        nextGates.push(gate);
      }
    }
    if (nextGates.length === 0) break;
    if (nextGates.length === prevLength) {
      return ["", {}];
    }
    prevLength = nextGates.length;
    remainingGates = nextGates;
  }

  let finalNumStr = "";

  let i = 0;
  while (true) {
    const zs = i < 10 ? `z0${i}` : `z${i}`;
    if (!(zs in zWires)) break;
    const val = zWires[zs];
    finalNumStr = String(val) + finalNumStr;
    i++;
  }
  return [finalNumStr, wiresCopy];
};

const [finalNumStr, finalWires] = run(gates);

out = parseInt(finalNumStr, 2);

let prevCarry = "";
const visitedGates = new Set([]);

for (let i = 0; i < 45; i++) {
  const xKey = i < 10 ? `x0${i}` : `x${i}`;

  let intflagWire = null;
  let intresWire = null;
  for (const [i, gate] of Object.entries(gates)) {
    if (visitedGates.has(i)) continue;
    if (gate[0] === xKey || gate[2] === xKey) {
      visitedGates.add(i);
      if (gate[1] === "XOR") {
        intresWire = gate[4];
        if (intflagWire) break;
      } else if (gate[1] === "AND") {
        intflagWire = gate[4];
        if (intresWire) break;
      }
    }
  }
  if (!prevCarry) {
    prevCarry = intflagWire;
    continue;
  }

  let secondresWire = null;
  let secondflagWire = null;
  for (const [i, gate] of Object.entries(gates)) {
    if (visitedGates.has(i)) continue;
    if (gate[0] === intresWire || gate[2] === intresWire) {
      visitedGates.add(i);
      if (!(gate[0] === prevCarry) && !(gate[2] === prevCarry)) {
        console.log("E1", xKey, intresWire, prevCarry, gate[0], gate[2]);
        break;
      }

      if (gate[1] === "XOR") {
        secondresWire = gate[4];
        if (secondflagWire) break;
      } else if (gate[1] === "AND") {
        secondflagWire = gate[4];
        if (secondresWire) break;
      }
    }
  }

  for (const [i, gate] of Object.entries(gates)) {
    if (visitedGates.has(i)) continue;
    if (gate[0] === intflagWire || gate[2] === intflagWire) {
      visitedGates.add(i);
      if (!(gate[0] === secondflagWire) && !(gate[2] === secondflagWire)) {
        console.log("E2", xKey, intflagWire, secondflagWire, gate[0], gate[2]);
        break;
      }
      prevCarry = gate[4];
      break;
    }
  }
}

// Through a lot of inspection and trial of error...
const switchesRequired = [
  "z16",
  "hmk",
  "z20",
  "fhp",
  "tpc",
  "rvf",
  "fcd",
  "z33",
];
switchesRequired.sort();
out2 = switchesRequired.toString();

console.log(out);
console.log(out2);
