
import {Remarkable} from 'https://cdn.skypack.dev/remarkable';
const remarkableRenderer = new Remarkable()
export const md = (strings, ...expr) => {
  let str = '';
  strings.forEach((string, i) => {
      str += string + (expr[i] || '');
  });
  return remarkableRenderer.render(str);
}