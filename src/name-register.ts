const names: Array<string> = [];

export const registerName = (name: string) => {
  let n = name ? name : 'Log';
  if (names.indexOf(n) !== -1) {
    n = n + (new Date()).getTime().toString();
  }

  names.push(n);
  return n;
};
