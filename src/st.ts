import { Select } from './internal';

export type Templates = { [index: string]: object };

/**
 * Select-Transform class
 */
export class SelectTransform {
  private templates: Templates = {};

  /**
   *
   * @param {boolean} keepTemplate Whether to keep templates instead of firing errors
   */
  constructor(public readonly keepTemplate = false) {}

  /**
   * Adds subtemplates that should be used into the class.
   * If a template with same name is already present, it will be overriden by this method.
   *
   * @param {object} subtemplates Provided subtemplates
   */
  addTemplates(subtemplates: Templates): SelectTransform {
    Object.assign(this.templates, subtemplates);

    return this;
  }

  /**
   * Clears template library.
   */
  clearTemplates(): SelectTransform {
    this.templates = {};

    return this;
  }

  getTemplate(name: string): object {
    return this.templates[name];
  }

  transformSync(template: object, data: object, serialized: boolean): any {
    // no need for separate template resolution step
    // select the template with selector and transform data
    const res = new Select(this, true)
      .select(template, undefined, serialized)
      .transformSync(data, serialized)
      .root();

    if (serialized) {
      // needs to return stringified version
      return JSON.stringify(res);
    }

    return res;
  }

  async transform(
    template: object,
    data: object,
    serialized: boolean,
  ): Promise<any> {
    // no need for separate template resolution step
    // select the template with selector and transform data
    const res = (
      await new Select(this, true)
        .select(template, undefined, serialized)
        .transform(data, serialized)
    ).root();

    if (serialized) {
      // needs to return stringified version
      return JSON.stringify(res);
    }

    return res;
  }

  selectSync(
    template: object,
    selector?: Function,
    serialized: boolean = false,
  ): Select | string {
    const res = new Select(this, true).select(template, selector, serialized);

    if (serialized) {
      // needs to return stringified version
      return JSON.stringify(res.root());
    }

    return res;
  }

  async select(
    template: object,
    selector?: Function,
    serialized: boolean = false,
  ): Promise<Select | string> {
    return this.selectSync(template, selector, serialized);
  }
}
