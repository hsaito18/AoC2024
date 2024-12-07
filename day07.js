const fs = require("fs");
let input = fs.readFileSync("./inputs/day07.txt").toString().split("\n");
input = input.map((l) => l.trim());

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

function dec2bin(dec) {
  return (dec >>> 0).toString(2);
}

function dec2tri(dec) {
  return dec.toString(3);
}

const testOperators = (nums, operators) => {
  let out = nums[0];
  for (let i = 0; i < operators.length; i++) {
    let nextNum = nums[i + 1];
    let currOp = operators[i];
    if (currOp === "0") {
      out += nextNum;
    } else {
      out *= nextNum;
    }
  }
  // console.log(out, operators);
  return out;
};

const testOperators2 = (nums, operators) => {
  let out = nums[0];
  for (let i = 0; i < operators.length; i++) {
    let nextNum = nums[i + 1];
    let currOp = operators[i];
    if (currOp === "0") {
      out += nextNum;
    } else if (currOp === "1") {
      out *= nextNum;
    } else {
      const sl = String(out);
      const sr = String(nextNum);
      out = Number(sl.concat(sr));
    }
  }
  // console.log(out, operators);
  return out;
};

let out = 0;
let out2 = 0;
for (let [rs, line] of Object.entries(input)) {
  const lineVals = line.split(" ");
  const target = Number(lineVals[0].slice(0, -1));
  const numbers = lineVals.slice(1).map((x) => Number(x));
  const opSpots = numbers.length - 1;
  const max = opSpots;

  for (let i = 0; i < 2 ** max; i++) {
    const bin = dec2bin(i).padStart(max, "0");
    let o = testOperators(numbers, bin);
    if (o === target) {
      out += target;
      break;
    }
  }

  for (let i = 0; i < 3 ** max; i++) {
    const bin = dec2tri(i).padStart(max, "0");
    let o = testOperators2(numbers, bin);
    if (o === target) {
      out2 += target;
      break;
    }
  }
}

console.log(out);
console.log(out2);
