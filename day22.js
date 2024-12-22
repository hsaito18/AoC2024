const fs = require("fs");
let input = fs.readFileSync("./inputs/day22.txt").toString().split("\n");
input = input.map((l) => l.trim());
const height = input.length;
const width = input[0].length;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = BigInt(0);
let out2 = 0;

const monkeyMaps = [];

const getOnes = (num) => {
  const s = String(num);
  return Number(s[s.length - 1]);
};

for (let [rs, line] of Object.entries(input)) {
  const mmap = [];
  const startNum = Number(line);
  let num = BigInt(startNum);
  let prev = getOnes(num);
  for (let i = 0; i < 2000; i++) {
    let a = num << BigInt(6);
    num = a ^ num;
    num = num % BigInt(16777216);
    a = num >> BigInt(5);
    num = a ^ num;
    num = num % BigInt(16777216);
    a = num << BigInt(11);
    num = a ^ num;
    num = num % BigInt(16777216);
    const ten = getOnes(num);
    mmap.push([ten - prev, ten]);
    prev = ten;
  }
  out += num;
  monkeyMaps.push(mmap);
}

let maxPrice = 0;
const sequencesMap = [];

for (const monkeyMap of monkeyMaps) {
  const seqMap = {};
  let seq = monkeyMap.slice(0, 4).map((x) => x[0]);
  seqMap[seq.toString()] = monkeyMap[3][1];
  for (let i = 4; i < monkeyMap.length; i++) {
    seq.shift();
    seq.push(monkeyMap[i][0]);
    const k = seq.toString();
    if (!(k in seqMap)) {
      seqMap[k] = monkeyMap[i][1];
    }
  }
  sequencesMap.push(seqMap);
}

for (let a = -9; a < 10; a++) {
  for (let b = -9; b < 10; b++) {
    for (let c = -9; c < 10; c++) {
      for (let d = -9; d < 10; d++) {
        const seq = `${a},${b},${c},${d}`;
        let bananas = 0;
        for (const seqMap of sequencesMap) {
          if (seq in seqMap) {
            bananas += seqMap[seq];
          }
        }
        if (bananas > maxPrice) {
          maxPrice = bananas;
        }
      }
    }
  }
}

out2 = maxPrice;

console.log(out);
console.log(out2);
