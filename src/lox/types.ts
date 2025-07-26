import { Interpreter } from "./interpreter";
import { LoxInstance, LoxClass } from "./LoxClass";

export type Value =
  | string
  | number
  | boolean
  | null
  | void
  | ILoxCallabel
  | LoxClass
  | LoxInstance;

export interface ILoxCallabel {
  call(interpreter: Interpreter, ...argArray: Value[]): any;
  arity(): number;
}

export abstract class LoxCallable implements ILoxCallabel {
  abstract call(interpreter: Interpreter, ...argArray: Value[]): any;
  abstract arity(): number;
}
