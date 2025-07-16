import { Interpreter } from "./interpreter";
import { LoxInstance } from "./LoxClass";

export type Value =
  | string
  | number
  | boolean
  | null
  | void
  | ILoxCallabel
  | LoxInstance;

export interface ILoxCallabel {
  call(interpreter: Interpreter, ...argArray: Value[]): any;
  arity(): number;
}

export abstract class LoxCallable implements ILoxCallabel {
  abstract call(interpreter: Interpreter, ...argArray: Value[]): any;
  abstract arity(): number;
}
