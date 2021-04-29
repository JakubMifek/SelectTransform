import {
  arrayExecutors,
  Helper,
  keyExecutors,
  Select,
  SelectTransform,
  ST_ERRORS,
  valueExecutors,
} from './internal';

export type DataObject = string | Array<any> | object;
export type AnyObject = { [index: string]: any };

export class Transform {
  public memory: AnyObject;

  constructor(
    public select: Select,
    public st: SelectTransform,
    public sync: boolean = false,
  ) {
    this.memory = {};
  }

  copy(): Transform {
    const cp = new Transform(this.select, this.st, this.sync);

    // TODO: Something more efficient?
    cp.memory = JSON.parse(JSON.stringify(this.memory));

    return cp;
  }

  runSync(template: DataObject, data: DataObject): DataObject {
    let result;

    try {
      if (typeof template === 'string') {
        if (!Helper.isTemplate(template)) return template;

        for (const executor of valueExecutors) {
          if (executor.fits(template)) {
            // tslint:disable-next-line: no-console
            console.debug(
              `${JSON.stringify(
                template,
                null,
                2,
              )} fits executor ${executor.getName()}`,
            );
            return executor.executeSync(template, data, this);
          }
        }

        try {
          return Helper.fillout(template, data, false, this.st.keepTemplate);
        } catch (error) {
          error.message += ` -- ${template}`;
          throw error;
        }
      }
    } catch (error) {
      if (!this.st.keepTemplate) throw error;
      return template;
    }

    if (Helper.isArray(template)) {
      for (const executor of arrayExecutors) {
        if (executor.fits(template as Array<any>)) {
          // tslint:disable-next-line: no-console
          console.debug(
            `${JSON.stringify(
              template,
              null,
              2,
            )} fits executor ${executor.getName()}`,
          );
          try {
            return executor.executeSync(template as Array<any>, data, this);
          } catch (error) {
            if (!this.st.keepTemplate) throw error;
            return template;
          }
        }
      }

      return (template as Array<any>).map((item) => this.runSync(item, data));
    }

    if (Object.prototype.toString.call(template) === '[object Object]') {
      // template is an object
      result = {};

      // tslint:disable-next-line: forin
      for (const key in template) {
        try {
          if (!Helper.isTemplate(key)) {
            result[key] = this.runSync(template[key], data);
            continue;
          }
          let executed = false;
          for (const executor of keyExecutors) {
            if (executor.fits(key)) {
              // tslint:disable-next-line: no-console
              console.debug(
                `${JSON.stringify(
                  key,
                  null,
                  2,
                )} fits executor ${executor.getName()}`,
              );
              result = executor.executeSync(template, data, this, key, result);
              executed = true;
              break;
            }
          }

          if (!executed) {
            try {
              const newKey = Helper.fillout(key, data, false, this.st.keepTemplate);
              const newValue = this.runSync(template[key], data);
              if (newKey in (result as Object)) {
                throwDuplicateKeyError(newKey);
              }
              result[newKey] = newValue;
            } catch (error) {
              error.message += ` -- ${key}`;
              throw error;
            }
          }
        } catch (error) {
          if (!this.st.keepTemplate) throw error;
          result[key] = template[key];
        }
      }
    } else {
      // hardcoded string
      return template;
    }
    return result;
  }

  async run(template: DataObject, data: DataObject): Promise<DataObject> {
    let result: DataObject;

    try {
      if (typeof template === 'string') {
        if (!Helper.isTemplate(template)) return template;

        for (const executor of valueExecutors) {
          if (executor.fits(template)) {
            // tslint:disable-next-line: no-console
            console.debug(
              `${JSON.stringify(
                template,
                null,
                2,
              )} fits executor ${executor.getName()}`,
            );
            return await executor.execute(template, data, this);
          }
        }

        try {
          return Helper.fillout(template, data, false, this.st.keepTemplate);
        } catch (error) {
          error.message += ` -- ${template}`;
          throw error;
        }
      }
    } catch (error) {
      if (!this.st.keepTemplate) throw error;
      return template;
    }

    if (Helper.isArray(template)) {
      for (const executor of arrayExecutors) {
        if (executor.fits(template as Array<any>)) {
          // tslint:disable-next-line: no-console
          console.debug(
            `${JSON.stringify(
              template,
              null,
              2,
            )} fits executor ${executor.getName()}`,
          );
          try {
            return await executor.execute(template as Array<any>, data, this);
          } catch (error) {
            if (!this.st.keepTemplate) throw error;
            return template;
          }
        }
      }

      return await Promise.all(
        (template as Array<any>).map(
          async (item) => await this.run(item, data),
        ),
      );
    }

    if (Object.prototype.toString.call(template) === '[object Object]') {
      // template is an object
      result = {};

      const promises = [];
      for (const key in template) {
        if (typeof template[key] === 'function') {
          continue;
        }

        promises.push(
          // tslint:disable-next-line: ter-arrow-parens
          new Promise<void>(async (res) => {
            try {
              if (!Helper.isTemplate(key)) {
                result[key] = await this.run(template[key], data);
                res();
                return;
              }

              for (const executor of keyExecutors) {
                if (executor.fits(key)) {
                  // tslint:disable-next-line: no-console
                  console.debug(
                    `${JSON.stringify(
                      key,
                      null,
                      2,
                    )} fits executor ${executor.getName()}`,
                  );
                  result = await executor.execute(
                    template,
                    data,
                    this,
                    key,
                    result,
                  );
                  res();
                  return;
                }
              }

              try {
                const newKey = Helper.fillout(key, data, false, this.st.keepTemplate);
                const newValue = await this.run(template[key], data);
                if (newKey in (result as Object)) {
                  throwDuplicateKeyError(newKey);
                }
                result[newKey] = newValue;
                res();
                return;
              } catch (error) {
                error.message += ` -- ${key}`;
                throw error;
              }
            } catch (error) {
              if (!this.st.keepTemplate) throw error;
              result[key] = template[key];
            }
          }),
        );
      }

      await Promise.all(promises);
    } else {
      // hardcoded string
      return template;
    }
    return result;
  }
}

function throwDuplicateKeyError(newKey: string) {
  throw new Error(`While replacing a templated key in object, found that `+
    `the target key already exists. -- resolved key: ${newKey}`);
}
