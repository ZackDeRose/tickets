export function computeTriples(set: number[], threshold: number) {
  const setsOfThree: (number[])[] = [];
  for (let i = 0; i < set.length; i++) {
    for (let j = i + 1; j < set.length; j++) {
      for (let k = j + 1; k < set.length; k++) {
        setsOfThree.push([set[i], set[j], set[k]]);
      }
    }
  }

  let passingSets = 0;
  for (const foo of setsOfThree) {
    const sum = foo.reduce((a, b) => a + b, 0);
    if (sum <= threshold) {
      passingSets++;
    }
  }

  return passingSets;
}




main.ts
async function onClick() {
  (await import('./a')).a();
}


async function onClick2() {
  (await import('./b')).b();
}




a.ts
async function a() {
  (await import('./c')).c();
}



b.ts
async function b() {
  (await import('./c')).c();
}



c.ts
function c() {}