const fs = require("fs");
let input = fs.readFileSync("./inputs/day02.txt").toString().split("\n");
input = input.map((l) => l.trim());

function checkReport(numsstr, canRemove) {
  if (numsstr.length <= 2) console.log(numsstr);
  let nums = numsstr.map((x) => Number(x));
  let sign = undefined;
  for (let i = 1; i < nums.length; i++) {
    let diff = nums[i] - nums[i - 1];
    if (sign && Math.sign(diff) !== sign) {
      if (canRemove) {
        let test = [];
        for (let j = 0; j < nums.length; j++) {
          let newNums;
          if (j === 0) newNums = nums.slice(1);
          else if (j === nums.length - 1) newNums = nums.slice(0, nums.length - 1);
          else {
            newNums = nums.slice(0, j).concat(nums.slice(j + 1));
          }
          test.push(newNums);
        }
        let good = true;
        for (const t of test) {
          if (checkReport(t, false)) {
            return true;
          }
        }
        return false;
      } else {
        return false;
      }
    }
    if (!sign) sign = Math.sign(diff);
    if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
      if (canRemove) {
        let test = [];
        for (let j = 0; j < nums.length; j++) {
          let newNums;
          if (j === 0) newNums = nums.slice(1);
          else if (j === nums.length - 1) newNums = nums.slice(0, nums.length - 1);
          else {
            newNums = nums.slice(0, j).concat(nums.slice(j + 1));
          }
          test.push(newNums);
        }
        let good = true;
        for (const t of test) {
          if (checkReport(t, false)) {
            return true;
          }
        }
        return false;
      } else {
        return false;
      }
    }
  }
  return true;
}
let out = 0;
let out2 = 0;
for (let line of input) {
  let nums = line.split(" ");
  let good1 = checkReport(nums, false);
  if (good1) out += 1;
  let good2 = checkReport(nums, true);
  if (good2) out2 += 1;
}

console.log(out);
console.log(out2);
