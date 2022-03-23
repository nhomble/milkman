export const duplicates = function (arr: string[]) {
  let counts = new Map();
  return arr.filter((n) => {
    let count = counts.get(n);
    counts.set(n, count ? count + 1 : 1);
    return count === 1;
  });
};
