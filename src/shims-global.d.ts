/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />

declare interface Window {
    __PREFETCHED_STATE__: any
  }

  interface ImportMetaEnv {
    readonly VITE_SERVER_URL: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }


declare type Nullable<T> = T | null
declare type NonNullable<T> = T extends null | undefined ? never : T
declare type UnfAble<T> = T | undefined
declare type Obj = Record<string, any>
declare type ObjT<T> = Record<string, T>
declare type AnyFn = (...args: any[]) => any;
declare type PromiseFn = (...args: any[]) => Promise<void>;
