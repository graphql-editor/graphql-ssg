import { Parser, TreeToTS } from 'graphql-zeus';
// @ts-ignore
import { Remarkable } from 'remarkable';
import fetch from 'node-fetch';
export interface DryadFunctionProps {
  schema: string;
  url: string;
  js: string;
}

export interface DryadFunctionResult {
  body: string;
  script?: string;
  globals: Record<string, any>;
}
export interface DryadFunctionFunction {
  (
    remarkableRenderer: (markdownString: string) => string,
    f: typeof fetch,
  ): Promise<DryadFunctionResult>;
}

export const DryadDeclarations = `
// Define custom element by passing its class to this function. It will be available in your static site. Remember to make everything used from outside element useDynamic
declare const useCustomElement: <T>(classDefinition:T) => void
// Declare variables/functions/objects that will be available dynamically in your static site
declare const useDynamic: <T extends string>(functions:Record<T, T extends keyof typeof window ? 'Value is reserved!' : any>) => void;
// Declare function to be called immediately after dom render
declare const useAfterRender: <T>(fn:Function) => void;
declare var html: (strings: TemplateStringsArray, ...expr: string[]) => string
declare var css: (strings: TemplateStringsArray, ...expr: string[]) => string
declare var md: (strings: TemplateStringsArray, ...expr: string[]) => string
`;
export const DryadFunction = async ({
  schema,
  url,
  js,
}: DryadFunctionProps): Promise<DryadFunctionResult> => {
  const graphqlTree = Parser.parse(schema);
  const jsSplit = TreeToTS.javascriptSplit(graphqlTree, 'browser', url);
  const jsString = jsSplit.const.concat('\n').concat(jsSplit.index);
  const functions = jsString.replace(/export /gm, '');
  const isMatching = js.match(/return/);
  if (!isMatching) {
    throw new Error('Cannot find return');
  }
  const addonFunctions = `
  var html = typeof html === "undefined" ? (strings, ...expr) => {
    let str = '';
    strings.forEach((string, i) => {
        str += string + (expr[i] || '');
    });
    return str;
  } : html
  var css = typeof css === "undefined" ? (strings, ...expr) => {
    let str = '';
    strings.forEach((string, i) => {
        str += string + (expr[i] || '');
    });
    return str;
  } : css
  `;
  const functionBody = [functions, addonFunctions, js].join('\n');
  const useFunctionCodeBuild = `
    const classesAdded = []
    let dynamicsO = {}
    let afterRenderO = null
    var md = typeof md === "undefined" ? (strings, ...expr) => {
      let str = '';
      strings.forEach((string, i) => {
          str += string + (expr[i] || '');
      });
      return remarkableRenderer.render(str);
    } : md
    const upperCamelCaseToSnakeCase = (value) => {
      return (
        value
          .replace(/^([A-Z])/, ($1) => $1.toLowerCase())
          .replace(/([A-Z])/g, ($1) => '-' + $1.toLowerCase())
      );
    };
    const useDynamic = (e) => {
      dynamicsO = {...dynamicsO,...e}
    }
    const useAfterRender = (e) => {
      afterRenderO = e
    }
    const useCustomElement = (elementClass) => {
      classesAdded.push(elementClass)
    }`;

  const r = new Function(
    'remarkableRenderer',
    'fetch',
    `return new Promise(async (resolve) => {
        ${useFunctionCodeBuild}
      const dryadFunction = async () => {
        ${functionBody}
      }
      dryadFunction().then(b => {
        let script = ""
        let newBody = b
        ${`
            if(classesAdded.length > 0){
              script = classesAdded.map(c => c.toString()).join("\\n")
              classesAdded.forEach(c => {
                const componentName = upperCamelCaseToSnakeCase(c.name)
                script += "\\n"
                script += \`\\customElements.define("\${componentName}",\${c.name})\`
              })
            }
            const strfns = JSON.parse(JSON.stringify(dynamicsO, function(key, val) {
              if (typeof val === 'function') {
                return  val + '';
              }
              return val
            }))
            Object.keys(strfns).forEach( s => {
              script += "\\n"
              const value = typeof strfns[s] === 'string' ? strfns[s] : JSON.stringify(strfns[s])
              script += "const "+s+" = "+value
            })
            if(afterRenderO){
              script += "\\n"
              script += 'const afterRender = ' + afterRenderO + ';';
              script += "\\n"
              script += 'afterRender();'
            }
            `}
        resolve({
          body:newBody,
          script,
        })
      })
    })`,
  ) as DryadFunctionFunction;
  const remarkableRenderer = new Remarkable();
  const result = await r(remarkableRenderer, fetch);
  if (typeof result.body !== 'string') {
    throw new Error(
      '.js file should end with return function returning string HTML',
    );
  }
  return {
    ...result,
    script: [functions, addonFunctions, result.script].join('\n'),
  };
};
