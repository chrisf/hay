// Type definitions for liquid-node

declare module 'liquid-node' {
  namespace NodeLiquid {
    class Template {
      render(context: Object): Promise<string>;
    }

    class Engine {
      parse(template: string): Promise<Template>;
    }
  }

  export = NodeLiquid;
}
