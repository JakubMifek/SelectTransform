export * from './array-executor';

import { Conditional } from './conditional';
import { ArrayExecutor } from './array-executor';

/**
 * Array of executors for arrays in templates.
 */
export const executors: ArrayExecutor[] = [new Conditional()];
