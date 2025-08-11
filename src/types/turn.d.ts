// TypeScript declarations for turn.js
declare global {
  interface JQuery {
    turn(options?: TurnOptions): JQuery;
    turn(method: 'page'): number;
    turn(method: 'page', page: number): JQuery;
    turn(method: 'next'): JQuery;
    turn(method: 'previous'): JQuery;
    turn(method: 'size'): number;
    turn(method: 'destroy'): JQuery;
    turn(method: 'is'): boolean;
    turn(method: 'center'): JQuery;
    turn(method: 'resize'): JQuery;
    turn(method: 'disable', disable: boolean): JQuery;
    turn(method: string, ...args: any[]): any;
  }

  interface TurnOptions {
    width?: number;
    height?: number;
    elevation?: number;
    gradients?: boolean;
    autoCenter?: boolean;
    duration?: number;
    pages?: number;
    page?: number;
    when?: {
      turning?: (event: any, page: number, view: any) => void;
      turned?: (event: any, page: number, view: any) => void;
      start?: (event: any, page: number, view: any) => void;
      end?: (event: any, page: number, view: any) => void;
      missing?: (event: any, page: number) => void;
    };
  }

  const $: JQueryStatic;
  const jQuery: JQueryStatic;
}

export {};