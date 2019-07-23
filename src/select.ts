import { Helper } from './common';
import { Transform, DataObject, AnyObject } from './transform';
import { SelectTransform } from './st';

export type SelectItem = {
  path: string;
  value: DataObject;
  key: string | number;
  object: DataObject;
  index: number;
};

export class Select {
  private $injected: DataObject;
  private $progress: boolean | null;
  private $selectedRoot: DataObject;
  private $templateRoot: DataObject;
  private $selected: SelectItem[];
  private $val: DataObject;

  constructor(private st: SelectTransform, private sync: boolean = false) {}

  root(): DataObject {
    this.$progress = null;
    return this.$selectedRoot;
  }

  values(): DataObject[] {
    this.$progress = null;
    if (this.$selected) {
      return this.$selected.map(item => item.value);
    }
    return Object.values(this.$selectedRoot);
  }

  paths(): string[] {
    this.$progress = null;

    if (this.$selected) {
      return this.$selected.map(item => item.path);
    }

    if (Array.isArray(this.$selectedRoot)) {
      return Object.keys(this.$selectedRoot).map(
        item =>
          // key is integer
          `[${item}]`,
      );
    }

    return Object.keys(this.$selectedRoot).map(
      item =>
        // key is string
        `[${item}]`,
    );
  }

  keys(): (string | number)[] {
    this.$progress = null;
    if (this.$selected) {
      return this.$selected.map(item => item.key);
    }

    if (Array.isArray(this.$selectedRoot)) {
      return Object.keys(this.$selectedRoot).map(key => parseInt(key, 0));
    }

    return Object.keys(this.$selectedRoot);
  }

  objects(): DataObject[] {
    this.$progress = null;
    if (this.$selected) {
      return this.$selected.map(item => item.object);
    }
    return [this.$selectedRoot as object];
  }

  transformSync(obj: DataObject | string, serialized: boolean): Select {
    this.$progress = null;

    /*
          'selected' is an array that contains items that looks like this:
              {
                key: The selected key,
                path: The path leading down to the selected key,
                object: The entire object that contains the currently selected key/val pair
                value: The selected value
              }
        */
    let data: DataObject;
    try {
      if (serialized) data = JSON.parse(obj as string);
      else data = obj;
    } catch (error) {
      data = obj;
    }

    // since we're assuming that the template has been already selected,
    // the $template_root is $selected_root
    this.$templateRoot = this.$selectedRoot;

    (String.prototype as AnyObject).$root = data;
    (Number.prototype as AnyObject).$root = data;
    (Function.prototype as AnyObject).$root = data;
    (Array.prototype as AnyObject).$root = data;
    (Boolean.prototype as AnyObject).$root = data;

    if (typeof data === 'object') {
      (data as AnyObject).$root = data;
    }

    (String.prototype as AnyObject).$this = data;
    (Number.prototype as AnyObject).$this = data;
    (Function.prototype as AnyObject).$this = data;
    (Array.prototype as AnyObject).$this = data;
    (Boolean.prototype as AnyObject).$this = data;

    if (typeof data === 'object') {
      (data as AnyObject).$this = data;
    }

    if (this.$selected && this.$selected.length > 0) {
      this.$selected
        .sort(
          (a, b) =>
            // sort by path length, so that deeper level items will be replaced
            // first
            // TODO: may need to look into edge cases
            b.path.length - a.path.length,
        )
        .forEach(selection => this.transformSelectedItem(selection, data));
      this.$selected.sort((a, b) => a.index - b.index);
    } else {
      const parsedObject = new Transform(this, this.st, this.sync).runSync(
        this.$selectedRoot,
        data,
      );
      // apply the result to root
      this.$templateRoot = Helper.resolve(this.$templateRoot, '', parsedObject);
      this.$selectedRoot = this.$templateRoot;
    }

    if (typeof data === 'object') {
      (data as AnyObject).$root = undefined;
    }

    delete (String.prototype as AnyObject).$root;
    delete (Number.prototype as AnyObject).$root;
    delete (Function.prototype as AnyObject).$root;
    delete (Array.prototype as AnyObject).$root;
    delete (Boolean.prototype as AnyObject).$root;

    if (typeof data === 'object') {
      (data as AnyObject).$this = undefined;
    }

    delete (String.prototype as AnyObject).$this;
    delete (Number.prototype as AnyObject).$this;
    delete (Function.prototype as AnyObject).$this;
    delete (Array.prototype as AnyObject).$this;
    delete (Boolean.prototype as AnyObject).$this;

    return this;
  }

  async transform(
    obj: DataObject | string,
    serialized: boolean,
  ): Promise<Select> {
    this.$progress = null;
    /*
          'selected' is an array that contains items that looks like this:
              {
                key: The selected key,
                path: The path leading down to the selected key,
                object: The entire object that contains the currently selected key/val pair
                value: The selected value
              }
        */
    let data: DataObject;
    try {
      if (serialized) data = JSON.parse(obj as string);
      else data = obj;
    } catch (error) {
      data = obj;
    }

    // since we're assuming that the template has been already selected,
    // the $templateRoot is $selectedRoot
    this.$templateRoot = this.$selectedRoot;

    if (typeof data === 'object') {
      (data as AnyObject).$root = data;
    }

    (String.prototype as AnyObject).$root = data;
    (Number.prototype as AnyObject).$root = data;
    (Function.prototype as AnyObject).$root = data;
    (Array.prototype as AnyObject).$root = data;
    (Boolean.prototype as AnyObject).$root = data;

    if (typeof data === 'object') {
      (data as AnyObject).$this = data;
    }

    (String.prototype as AnyObject).$this = data;
    (Number.prototype as AnyObject).$this = data;
    (Function.prototype as AnyObject).$this = data;
    (Array.prototype as AnyObject).$this = data;
    (Boolean.prototype as AnyObject).$this = data;

    if (this.$selected && this.$selected.length > 0) {
      const sorted = this.$selected.sort(
        (a, b) =>
          // sort by path length, so that deeper level items will be replaced first
          // TODO: may need to look into edge cases
          b.path.length - a.path.length,
      );

      const promises = [];
      for (const selection of sorted) {
        promises.push(
          new Promise(async () => {
            // parse selected
            const parsedObject = await new Transform(this, this.st).run(
              selection.object,
              data,
            );
            // apply the result to root
            this.$templateRoot = Helper.resolve(
              this.$templateRoot,
              selection.path,
              parsedObject,
            );
            this.$selectedRoot = this.$templateRoot;

            // update selected object with the parsed result
            selection.object = parsedObject;
          }),
        );
      }

      await Promise.all(promises);

      this.$selected.sort((a, b) => a.index - b.index);
    } else {
      const parsedObject = await new Transform(this, this.st, this.sync).run(
        this.$selectedRoot,
        data,
      );
      // apply the result to root
      this.$templateRoot = Helper.resolve(this.$templateRoot, '', parsedObject);
      this.$selectedRoot = this.$templateRoot;
    }

    if (typeof data === 'object') {
      (data as AnyObject).$root = undefined;
    }

    delete (String.prototype as AnyObject).$root;
    delete (Number.prototype as AnyObject).$root;
    delete (Function.prototype as AnyObject).$root;
    delete (Array.prototype as AnyObject).$root;
    delete (Boolean.prototype as AnyObject).$root;

    if (typeof data === 'object') {
      (data as AnyObject).$this = undefined;
    }

    delete (String.prototype as AnyObject).$this;
    delete (Number.prototype as AnyObject).$this;
    delete (Function.prototype as AnyObject).$this;
    delete (Array.prototype as AnyObject).$this;
    delete (Boolean.prototype as AnyObject).$this;

    return this;
  }

  transformWithSync(obj: DataObject, serialized: boolean): Select {
    this.$progress = null;
    /*
     *  'selected' is an array that contains items that looks like this:
     *  {
     *    key: The selected key,
     *    path: The path leading down to the selected key,
     *    object: The entire object that contains the currently selected key/val pair
     *    value: The selected value
     *  }
     */
    let template: DataObject;
    try {
      if (serialized) template = JSON.parse(obj as string);
      else template = obj;
    } catch (error) {
      template = obj;
    }

    // Setting $root
    this.$templateRoot = template;

    if (typeof template === 'object') {
      (template as AnyObject).$root = this.$templateRoot;
    }

    (String.prototype as AnyObject).$root = this.$templateRoot;
    (Number.prototype as AnyObject).$root = this.$templateRoot;
    (Function.prototype as AnyObject).$root = this.$templateRoot;
    (Array.prototype as AnyObject).$root = this.$templateRoot;
    (Boolean.prototype as AnyObject).$root = this.$templateRoot;

    if (typeof template === 'object') {
      (template as AnyObject).$this = this.$templateRoot;
    }

    (String.prototype as AnyObject).$this = this.$templateRoot;
    (Number.prototype as AnyObject).$this = this.$templateRoot;
    (Function.prototype as AnyObject).$this = this.$templateRoot;
    (Array.prototype as AnyObject).$this = this.$templateRoot;
    (Boolean.prototype as AnyObject).$this = this.$templateRoot;

    // generate new $selected_root
    if (this.$selected && this.$selected.length > 0) {
      this.$selected
        .sort(
          (a, b) =>
            // sort by path length, so that deeper level items will be replaced first
            // TODO: may need to look into edge cases
            b.path.length - a.path.length,
        )
        .forEach(selection =>
          this.transformSelectedItemWith(selection, template),
        );
      this.$selected.sort((a, b) => a.index - b.index);
    } else {
      const parsedObject = new Transform(this, this.st, this.sync).runSync(
        template,
        this.$selectedRoot,
      );
      // apply the result to root
      this.$selectedRoot = Helper.resolve(this.$selectedRoot, '', parsedObject);
    }

    if (typeof template === 'object') {
      (template as AnyObject).$root = undefined;
    }

    delete (String.prototype as AnyObject).$root;
    delete (Number.prototype as AnyObject).$root;
    delete (Function.prototype as AnyObject).$root;
    delete (Array.prototype as AnyObject).$root;
    delete (Boolean.prototype as AnyObject).$root;

    if (typeof template === 'object') {
      (template as AnyObject).$this = undefined;
    }

    delete (String.prototype as AnyObject).$this;
    delete (Number.prototype as AnyObject).$this;
    delete (Function.prototype as AnyObject).$this;
    delete (Array.prototype as AnyObject).$this;
    delete (Boolean.prototype as AnyObject).$this;

    return this;
  }

  async transformWith(obj: DataObject, serialized: boolean): Promise<Select> {
    this.$progress = null;
    /*
     *  'selected' is an array that contains items that looks like this:
     *  {
     *    key: The selected key,
     *    path: The path leading down to the selected key,
     *    object: The entire object that contains the currently selected key/val pair
     *    value: The selected value
     *  }
     */
    let template: DataObject;
    try {
      if (serialized) template = JSON.parse(obj as string);
      else template = obj;
    } catch (error) {
      template = obj;
    }

    // Setting $root
    this.$templateRoot = template;

    // generate new $selected_root
    if (this.$selected && this.$selected.length > 0) {
      const sorted = this.$selected.sort(
        (a, b) =>
          // sort by path length, so that deeper level items will be replaced first
          // TODO: may need to look into edge cases
          b.path.length - a.path.length,
      );

      const promises = [];
      for (const selection of sorted) {
        promises.push(
          new Promise(async () => {
            // parse selected
            const parsedObject = await new Transform(
              this,
              this.st,
              this.sync,
            ).run(template, selection.object);

            // apply the result to root
            this.$selectedRoot = Helper.resolve(
              this.$selectedRoot,
              selection.path,
              parsedObject,
            );

            // update selected object with the parsed result
            selection.object = parsedObject;
          }),
        );
      }

      await Promise.all(promises);

      this.$selected.sort((a, b) => a.index - b.index);
    } else {
      const parsedObject = await new Transform(this, this.st, this.sync).run(
        template,
        this.$selectedRoot,
      );

      // apply the result to root
      this.$selectedRoot = Helper.resolve(this.$selectedRoot, '', parsedObject);
    }

    return this;
  }

  inject(obj: DataObject | string, serialized: boolean): Select {
    try {
      if (serialized) this.$injected = JSON.parse(obj as string);
      else this.$injected = obj;
    } catch (error) {
      this.$injected = obj;
    }

    if (Object.keys(this.$injected).length > 0) {
      this.select(this.$injected, undefined, undefined);
    }
    return this;
  }

  exec(current: DataObject, path: string, filter: Function): void {
    // if current matches the pattern, put it in the selected array
    if (typeof current === 'string') {
      // leaf node should be ignored
      // we're lookin for keys only
      return;
    }

    if (Helper.isArray(current)) {
      for (let i = 0; i < (current as Array<any>).length; i++) {
        this.exec(current[i], `${path}[${i}]`, filter);
      }
      return;
    }

    // object
    for (const key in current) {
      // '$root' is a special key that links to the root node
      // so shouldn't be used to iterate
      if (key !== '$root') {
        if (filter(key, current[key])) {
          const index = this.$selected.length;
          this.$selected.push({
            index,
            key,
            path,
            object: current,
            value: current[key],
          });
        }
        this.exec(current[key], `${path}["${key}"]`, filter);
      }
    }
  }

  select(obj: DataObject, filter: Function | undefined, serialized: boolean) {
    // iterate '$selected'
    //
    /*
            SELECT.$selected = [{
                value {
                    '{{#include}}': {
                        '{{#each items}}': {
                            'type': 'label',
                            'text': '{{name}}'
                        }
                    }
                },
                path: '$jason.head.actions.$load'
                ...
            }]
        */
    let json: DataObject;
    try {
      if (serialized) json = JSON.parse(obj as string);
      else json = obj;
    } catch (error) {
      json = obj;
    }

    if (filter) {
      this.$selected = [];
      this.exec(json, '', filter);
    } else {
      this.$selected = null;
    }

    if (json && (Helper.isArray(json) || typeof json === 'object')) {
      if (!this.$progress) {
        // initialize
        if (Helper.isArray(json)) {
          this.$val = [];
          this.$selectedRoot = [];
        } else {
          this.$val = {};
          this.$selectedRoot = {};
        }
      }
      // tslint:disable-next-line: forin
      for (const key in json as AnyObject) {
        this.$val[key] = json[key];
        this.$selectedRoot[key] = json[key];
      }
    } else {
      this.$val = json;
      this.$selectedRoot = json;
    }
    this.$progress = true; // set the 'in progress' flag

    return this;
  }

  transformSelectedItemWith(selection: SelectItem, template: DataObject): void {
    // parse selected
    const parsedObject = new Transform(this, this.st, this.sync).runSync(
      template,
      selection.object,
    );

    // apply the result to root
    this.$selectedRoot = Helper.resolve(
      this.$selectedRoot,
      selection.path,
      parsedObject,
    );

    // update selected object with the parsed result
    selection.object = parsedObject;
  }

  transformSelectedItem(selection: SelectItem, data: DataObject): void {
    // parse selected
    const parsedObject = new Transform(this, this.st).runSync(
      selection.object,
      data,
    );
    // apply the result to root
    this.$templateRoot = Helper.resolve(
      this.$templateRoot,
      selection.path,
      parsedObject,
    );
    this.$selectedRoot = this.$templateRoot;

    // update selected object with the parsed result
    selection.object = parsedObject;
  }
}
