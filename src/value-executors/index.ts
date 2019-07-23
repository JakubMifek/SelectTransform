export * from './value-executor';

import { Template } from './template';
import { Include } from './include';
import { ValueExecutor } from './value-executor';
import { Ternary } from './ternary';

/**
 * Array of executors for values in templates.
 */
export const executors: ValueExecutor[] = [
  new Template(),
  new Include(),
  new Ternary(),
];
