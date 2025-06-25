export function keyGenerator(): number {
  let key = 0;

  for (let i = 0; i < 6; ++i) {
    const digit = Math.floor(Math.random() * 9) + 1; 
    key = key * 10 + digit;
  }

  return key;
}