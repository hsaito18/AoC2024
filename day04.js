const fs = require("fs");
let input = fs.readFileSync("./inputs/day04.txt").toString().split("\n");
input = input.map((l) => l.trim());

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

for (let [rs, line] of Object.entries(input)) {
  let r = Number(rs);
  for (let [cs, ch] of Object.entries(line)) {
    let c = Number(cs);
    if (ch !== "X") continue;
    for (let nr = r - 1; nr < r + 2; nr++) {
      if (nr < 0 || nr === input.length) continue;
      for (let nc = c - 1; nc < c + 2; nc++) {
        if (nc < 0 || nc === line.length || (nc === c && nr === r)) continue;

        if (input[nr][nc] === "M") {
          const dir = [nr - r, nc - c];

          let nextRow = nr + dir[0];
          let nextCol = nc + dir[1];
          if (
            nextRow < 0 ||
            nextRow === input.length ||
            nextCol < 0 ||
            nextCol === line.length
          )
            continue;

          if (input[nextRow][nextCol] === "A") {
            nextRow += dir[0];
            nextCol += dir[1];
            if (
              nextRow < 0 ||
              nextRow === input.length ||
              nextCol < 0 ||
              nextCol === line.length
            )
              continue;
            if (input[nextRow][nextCol] === "S") {
              out++;
            }
          }
        }
      }
    }
  }
}

for (let [rs, line] of Object.entries(input)) {
  let r = Number(rs);
  for (let [cs, ch] of Object.entries(line)) {
    let c = Number(cs);
    if (ch !== "A") continue;
    const corners = [
      [
        [r - 1, c - 1],
        [r + 1, c + 1],
      ],
      [
        [r - 1, c + 1],
        [r + 1, c - 1],
      ],
    ];
    let isValid = true;
    for (const cornerpair of corners) {
      let isGood = true;
      for (const [nr, nc] of cornerpair) {
        if (nr < 0 || nr === input.length || nc < 0 || nc === line.length) {
          isGood = false;
          break;
        }
      }
      if (!isGood) {
        isValid = false;
        break;
      }
      const firstCornerCh = input[cornerpair[0][0]][cornerpair[0][1]];
      const secondCornerCh = input[cornerpair[1][0]][cornerpair[1][1]];
      if (
        !(
          (firstCornerCh === "M" && secondCornerCh === "S") ||
          (firstCornerCh === "S" && secondCornerCh === "M")
        )
      ) {
        isValid = false;
        break;
      }
    }
    if (isValid) out2++;
  }
}

console.log(out);
console.log(out2);
