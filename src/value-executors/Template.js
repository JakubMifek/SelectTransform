import { Helper } from "../Common";

export class Template {
  constructor() {}

  fits(template) {
    return (
      typeof template === "string" &&
      /^\s*\{\{\s*#template\s+[^\s]+\s*\}\}\s*$/g.test(template)
    );
  }

  execute(template, data, ts) {
    const fun = Helper.tokenize(template);
    // insert one of stored templates
    const ptemplate = ts.st.templates[fun.expression];
    return ts.run(ptemplate, data);
  }

  static _instance = new Include();
  static getInstance() { return _instance; }
}
