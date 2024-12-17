const fs = require("fs");
const { register } = require("module");
let input = fs.readFileSync("./inputs/day17.txt").toString().split("\n");
input = input.map((l) => l.trim());
const height = input.length;
const width = input[0].length;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

let startA1 = Number(input[0].slice(12));

const getComboOperand = (rawOp, registerA, registerB, registerC) => {
  if (rawOp <= 3) return rawOp;
  if (rawOp === 4) return registerA;
  if (rawOp === 5) return registerB;
  if (rawOp === 6) return registerC;
  console.error("ERROR! INVALID COMBO OPERAND: ", rawOp);
};

const runProgram = (program, startA) => {
  let registerA = startA;
  let registerB = 0;
  let registerC = 0;

  let pointer = 0;

  const output = [];

  while (true) {
    if (registerA === -1) break;
    if (pointer >= program.length) break;
    const opCode = program[pointer];
    const operand = program[pointer + 1];
    switch (opCode) {
      case 0:
        registerA = registerA >> getComboOperand(operand, registerA, registerB, registerC);
        pointer += 2;
        break;
      case 1:
        registerB = registerB ^ operand;
        pointer += 2;
        break;
      case 2:
        registerB = getComboOperand(operand, registerA, registerB, registerC) & 7;
        pointer += 2;
        break;
      case 3:
        if (registerA === 0) {
          pointer += 2;
        } else {
          pointer = operand;
        }
        break;
      case 4:
        registerB = registerB ^ registerC;
        pointer += 2;
        break;
      case 5:
        const out = getComboOperand(operand, registerA, registerB, registerC) & 7;
        output.push(out);
        pointer += 2;
        break;
      case 6:
        registerB = registerA >> getComboOperand(operand, registerA, registerB, registerC);
        pointer += 2;
        break;
      case 7:
        registerC = registerA >> getComboOperand(operand, registerA, registerB, registerC);
        pointer += 2;
        break;
      default:
        console.error(`invalid op code: ${opCode}`);
    }
  }
  out = output.join(",");
  return out;
};

const runProgram2 = (program, startA) => {
  let registerA = startA;
  let registerB = BigInt(0);
  let registerC = BigInt(0);

  let pointer = 0;

  const output = [];

  while (true) {
    if (pointer >= program.length) break;
    const opCode = program[pointer];
    const operand = program[pointer + 1];
    switch (opCode) {
      case 0:
        registerA = registerA >> BigInt(getComboOperand(operand, registerA, registerB, registerC));
        pointer += 2;
        break;
      case 1:
        registerB = registerB ^ BigInt(operand);
        pointer += 2;
        break;
      case 2:
        registerB = BigInt(getComboOperand(operand, registerA, registerB, registerC)) & BigInt(7);
        pointer += 2;
        break;
      case 3:
        if (registerA === BigInt(0)) {
          pointer += 2;
        } else {
          pointer = operand;
        }
        break;
      case 4:
        registerB = registerB ^ registerC;
        pointer += 2;
        break;
      case 5:
        const out = BigInt(getComboOperand(operand, registerA, registerB, registerC)) & BigInt(7);
        output.push(out);
        pointer += 2;
        break;
      case 6:
        registerB = registerA >> BigInt(getComboOperand(operand, registerA, registerB, registerC));
        pointer += 2;
        break;
      case 7:
        registerC = registerA >> BigInt(getComboOperand(operand, registerA, registerB, registerC));
        pointer += 2;
        break;
      default:
        console.error(`invalid op code: ${opCode}`);
    }
  }

  return output.join(",");
};

const program = input[4]
  .slice(9)
  .split(",")
  .map((x) => Number(x));

out = runProgram(program, startA1);
const goalOut = program.join(",");
// let startA2 = 30018400000000n;
// let startA2 = 266932595500000n;
let startA2 = 266932600395650n;
// let startA2 = 266932601666600n;

while (true) {
  const currOut = runProgram2(program, startA2);
  // console.log(currOut, currOut.length, startA2);
  if (currOut == goalOut) {
    out2 = startA2;
    break;
  }
  // startA2 += 50n;
  startA2++;
}

console.log(out);
console.log(out2);
