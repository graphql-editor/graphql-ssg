
  export const html =  (strings, ...expr) => {
    let str = '';
    strings.forEach((string, i) => {
        str += string + (expr[i] || '');
    });
    return str;
  }
  export const css =  (strings, ...expr) => {
    let str = '';
    strings.forEach((string, i) => {
        str += string + (expr[i] || '');
    });
    return str;
  }
