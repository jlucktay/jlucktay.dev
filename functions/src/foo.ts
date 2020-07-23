// foo.ts
export const foo = {
  a: {
    b: {
      c: {
        hello: (name: string): string => `Hello, ${name}`,
      },
    },
  },
  name: (): string => "foo",
};
