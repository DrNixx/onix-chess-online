import { JSDOM } from "jsdom";

const { window } = new JSDOM('<!doctype html><html><body></body></html>', {
    url: "http://localhost"
  });

const globalAny: any = global;
globalAny.window = window;
