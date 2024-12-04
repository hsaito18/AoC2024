const fs = require("fs");
let input = fs.readFileSync("./inputs/day03.txt").toString().split("\n");
input = input.map((l) => l.trim());

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;
let enabled = true;

for (let line of input) {
  for (let i = 0; i < line.length - 6; i++) {
    if (i + 4 < line.length && line.substring(i, i + 4) === "do()") {
      enabled = true;
    } else if (i + 7 < line.length && line.substring(i, i + 7) === "don't()") {
      enabled = false;
    }
    // if (!enabled) continue;
    if (line.substring(i, i + 4) !== "mul(") continue;
    for (let j = 4; j < 12; j++) {
      if (i + j === line.length) break;
      if (line[i + j] === ")") {
        const analys = line.substring(i + 4, i + j);
        const nums = analys.split(",");
        if (nums.length !== 2) continue;
        if (isNumeric(nums[0]) && isNumeric(nums[1])) {
          const val = parseInt(nums[0]) * parseInt(nums[1]);
          out += val;
          if (enabled) out2 += val;
        }
      }
    }
  }
}

console.log(out);
console.log(out2);
