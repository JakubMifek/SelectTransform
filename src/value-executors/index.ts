export * from './value-executor';

import { Template } from './template';
import { Include } from './include';
import { ValueExecutor } from './value-executor';

/**
 * Array of executors for values in templates.
 */
export const executors: ValueExecutor[] = [new Template(), new Include()];
