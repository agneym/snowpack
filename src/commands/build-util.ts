export function wrapEsmProxyResponse(url: string, code: string, ext: string, hasHmr = false) {
  if (ext === '.json') {
    return `
let json = ${JSON.stringify(JSON.parse(code))};
export default json;
${
  hasHmr
    ? `
import {apply} from '/web_modules/@snowpack/hmr.js';
apply(${JSON.stringify(url)}, ({code}) => {
  json = JSON.parse(JSON.stringify(JSON.parse(code)));
});
`
    : ''
}`;
  }

  if (ext === '.css') {
    return `
const styleEl = document.createElement("style");
styleEl.type = 'text/css';
styleEl.appendChild(document.createTextNode(${JSON.stringify(code)}));
document.head.appendChild(styleEl);
${
  hasHmr
    ? `
import {apply} from '/web_modules/@snowpack/hmr.js';
apply(${JSON.stringify(url)}, ({code}) => {
  styleEl.innerHtml = '';
  styleEl.appendChild(document.createTextNode(code));
});
`
    : ''
}`;
  }

  return `export default ${JSON.stringify(url)};`;
}
