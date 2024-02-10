import { myHandler } from "../index";

// import { Response } from "express";
// import { Request } from "firebase-functions";

type HandlerTestCase = {
  name: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Need to figure out how to use the proper type.
  req: any;
  // req: Request;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Need to figure out how to use the proper type.
  resp: any;
  // resp: Response;
};

const expectTruthy: readonly HandlerTestCase[] = [
  { name: "hello", req: null, resp: null },
];

// Stop skipping this table test once the above is all figured out.
test.skip.each(expectTruthy)("myHandler: $name", ({ req, resp }) => {
  expect(myHandler(req, resp)).toBeTruthy();
});
