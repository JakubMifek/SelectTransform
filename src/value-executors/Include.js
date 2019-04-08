import { Helper } from "../Common";

export class Include {
  constructor() {}

  fits(template) {
    return (
      typeof template === "string" &&
      /\{\{([ ]*#include)[ ]*([^ ]*)\}\}/g.test(template)
    );
  }

  execute(template, data, ts) {
    const fun = Helper.tokenize(template);
    if (fun.expression)
      // if #include has arguments, evaluate it before attaching
      return Helper.fillout(`{{${fun.expression}}`, data, true);

    // shouldn't happen =>
    // {'wrapper': '{{#include}}'}
    return template;
  }

  static _instance = new Include();
  static getInstance() { return _instance; }
}
