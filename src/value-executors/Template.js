import { Helper } from "../Common";

var _instance;

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

  static getInstance() { return _instance; }
}

_instance = new Template();