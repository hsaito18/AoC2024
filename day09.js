const fs = require("fs");
let input = fs.readFileSync("./inputs/day09.txt").toString().split("\n");
input = input.map((l) => l.trim());
const height = input.length;
const width = input[0].length;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

let fullFile = [];
let fullFile2 = [];
let empties = [];

let fileBlocks = [];
let emptyBlocks = [];

let numEntries = 0;

for (let [rs, line] of Object.entries(input)) {
  const r = Number(rs);
  let counter = 0;
  for (let [cs, ch] of Object.entries(line)) {
    let c = Number(cs);
    let num = Number(ch);
    if (c % 2 === 0) {
      for (let i = 0; i < num; i++) {
        fullFile.push(counter);
        fullFile2.push(counter);
        numEntries++;
      }
      fileBlocks.push([num, fullFile.length - num]);
      counter++;
    } else {
      for (let i = 0; i < num; i++) {
        fullFile.push(".");
        fullFile2.push(".");
        empties.push(fullFile.length - 1);
      }
      emptyBlocks.push([num, fullFile.length - num]);
    }
  }
}

let ri = fullFile.length - 1;
while (ri >= numEntries) {
  if (fullFile[ri] === ".") {
    ri--;
    continue;
  }
  const leftSpace = empties.shift();
  fullFile[leftSpace] = fullFile[ri];
  ri--;
}

for (let i = 0; i < numEntries; i++) {
  out += fullFile[i] * i;
}

for (let i = fileBlocks.length - 1; i >= 0; i--) {
  const [fileLength, fileIdx] = fileBlocks[i];
  for (let j = 0; j < emptyBlocks.length; j++) {
    const [emptyLength, emptyIdx] = emptyBlocks[j];
    if (emptyIdx > fileIdx) break;
    if (fileLength <= emptyLength) {
      for (let k = 0; k < fileLength; k++) {
        fullFile2[emptyIdx + k] = i;
        fullFile2[fileIdx + k] = ".";
      }
      emptyBlocks[j] = [emptyLength - fileLength, emptyIdx + fileLength];
      break;
    }
  }
}

for (let i = 0; i < fullFile2.length; i++) {
  if (fullFile2[i] !== ".") out2 += fullFile2[i] * i;
}

console.log(out);
console.log(out2);
