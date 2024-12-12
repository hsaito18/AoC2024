const fs = require("fs");
let input = fs.readFileSync("./inputs/day12.txt").toString().split("\n");
input = input.map((l) => l.trim());
const height = input.length;
const width = input[0].length;

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

let out = 0;
let out2 = 0;

const regions = {};
const visited = new Set([]);

const flood = (r, c, w, h, regionIdx, input, regions, visited) => {
  const key = `${r},${c}`;
  const ch = input[r][c];
  visited.add(key);
  if (regionIdx in regions) {
    regions[regionIdx].area = regions[regionIdx].area + 1;
  } else {
    regions[regionIdx] = { perimeter: 0, area: 1, fences: [], sides: 0 };
  }
  const queue = [];
  if (r > 0) {
    queue.push([r - 1, c, false, "u"]);
  } else {
    queue.push([r - 1, c, true, "u"]);
  }

  if (r < h - 1) {
    queue.push([r + 1, c, false, "d"]);
  } else {
    queue.push([r + 1, c, true, "d"]);
  }

  if (c > 0) {
    queue.push([r, c - 1, false, "l"]);
  } else {
    queue.push([r, c - 1, true, "l"]);
  }

  if (c < w - 1) {
    queue.push([r, c + 1, false, "r"]);
  } else {
    queue.push([r, c + 1, true, "r"]);
  }

  for ([nr, nc, flag, d] of queue) {
    if (flag) {
      regions[regionIdx].perimeter += 1;
      regions[regionIdx].fences.push([nr, nc, d]);
      continue;
    }
    if (input[nr][nc] === ch) {
      let nextkey = `${nr},${nc}`;
      if (!visited.has(nextkey))
        flood(nr, nc, w, h, regionIdx, input, regions, visited);
    } else {
      // add fence
      regions[regionIdx].perimeter = regions[regionIdx].perimeter + 1;
      regions[regionIdx].fences.push([nr, nc, d]);
    }
  }
};

let regIdx = 0;

for (let [rs, line] of Object.entries(input)) {
  const r = Number(rs);
  for (let [cs, ch] of Object.entries(line)) {
    const c = Number(cs);
    const key = `${r},${c}`;
    if (!visited.has(key)) {
      flood(r, c, width, height, regIdx, input, regions, visited);
      regIdx++;
    }
  }
}

for (const data of Object.values(regions)) {
  out += data.perimeter * data.area;
  const fenceSet = new Set([]);
  let sidesOffset = 0;
  for (const [fr, fc, fd] of data.fences) {
    let queue = [];
    if (fd === "d" || fd === "u") {
      queue = [
        [fr, fc - 1, fd],
        [fr, fc + 1, fd],
      ];
    } else {
      queue = [
        [fr - 1, fc, fd],
        [fr + 1, fc, fd],
      ];
    }
    for (const [nfr, nfc, nd] of queue) {
      const key = `${nfr},${nfc},${nd}`;
      if (fenceSet.has(key)) {
        sidesOffset--;
      }
    }
    fenceSet.add(`${fr},${fc},${fd}`);
  }
  out2 += (data.perimeter + sidesOffset) * data.area;
}

console.log(out);
console.log(out2);
