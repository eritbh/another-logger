/** Whether we're running under Node.js. If not, we're running in a browser. */
export declare const isNode: boolean;
/** Any falsy value, other than NaN (which doesn't have a type literal). */
export declare type Falsy = false | 0 | '' | null | undefined;
/** A single value or an array of values of a given type. */
export declare type MaybeArray<T> = T | T[];
/** If the input value is not an array, converts it to an array. */
export declare function makeArray<T>(val: MaybeArray<T>): T[];
