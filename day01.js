const fs = require("fs");
let input = fs.readFileSync("./inputs/day01.txt").toString().split("\n");
input = input.map((l) => l.trim());

let out = 0;
let ls1 = [];
let ls2 = [];
let ls2Counter = {};
for (let line of input) {
  let [n1, n2] = line.split("   ");
  ls1.push(n1);
  ls2.push(n2);
  if (n2 in ls2Counter) {
    ls2Counter[n2] += 1;
  } else ls2Counter[n2] = 1;
}

ls1.sort();
ls2.sort();

let out2 = 0;

for (let i = 0; i < ls1.length; i++) {
  out += Math.abs(ls1[i] - ls2[i]);
  let num = ls1[i];
  let numInLs2 = ls2Counter[num] ?? 0;
  out2 += numInLs2 * num;
}

console.log(out);
console.log(out2);
