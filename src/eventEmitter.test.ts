import { EventEmitter } from "./eventEmitter";

/**
 * Unloan Event Emitter Coding Challenge
 * -------------------------------------
 * You're going to build a simple basic event emitter. What is an event emitter? Put it simply,
 * it allows calling clients to register handlers for specific events (eg a mouse click) such that
 * when an event is emitted, each callback is invoked with the payload.
 *
 * INSTRUCTIONS:
 *   1. Complete eventEmitter.ts - use the tests below to guide you as to what to implement. Naturally,
 *      the tests should probably pass!
 *   2. Add any additional tests that you think might be relevant to ensure the implementation is
 *      robust.
 *   3. Make ANY improvements you think are reasonable (rename, refactor, even restructure)
 *   4. Make this your AUDITION tape - we're looking for superstars!
 *   5. Remember to git commit any progress (as you might with any task or work item assigned to you)
 *   6. If you have any questions - feel free to make any reasonable assumptions (and document them
 *      and why).
 *
 * WHAT WE LOOK FOR:
 *   1. Understanding the problem and objective
 *   2. Coding communication style
 *   3. Skill with TypeScript
 *   4. Correctness and effectiveness
 *
 * EXPECTED COMPLETION TIME:
 *   30-45 minutes
 *
 * Good luck!
 */
describe("EventEmitter", () => {
  it("can be constructed", () => {
    const eventEmitter = new EventEmitter();
    expect(eventEmitter).toBeInstanceOf(EventEmitter);
  });

  it("can register a callback for a given event", () => {
    const eventEmitter = new EventEmitter<{
      mouseClick: [string, number, null, Record<string, string>];
    }>();
    const callback = jest.fn();
    const payload = ["hello", 5, null, { foo: "bar" }] as const;

    eventEmitter.register("mouseClick", callback);
    eventEmitter.emit("mouseClick", ...payload);
    expect(callback.mock.calls.length).toBe(1);

    const callbackArguments = callback.mock.calls[0];
    expect(callbackArguments).toEqual(payload);
  });

  it("throws an error when emitting an undefined listener", () => {
    const eventEmitter = new EventEmitter();
    const payload = {};

    expect(() => {
      eventEmitter.emit("unknownListener", payload);
    }).toThrow("unknownListener is not a registered listener");
  });

  it("can register different callbacks for a different events", () => {
    const eventEmitter = new EventEmitter<{
      mouseClick: [string, number, null, Record<string, string>];
      keyPress: [string, undefined, Record<string, string>];
    }>();
    const mouseClickCallback = jest.fn();
    const keyPressCallback = jest.fn();
    const mouseClickPayload = ["hello", 5, null, { foo: "bar" }] as const;
    const keyPressPayload = ["bye", undefined, {}] as const;

    eventEmitter.register("mouseClick", mouseClickCallback);
    eventEmitter.register("keyPress", keyPressCallback);

    eventEmitter.emit("mouseClick", ...mouseClickPayload);
    expect(mouseClickCallback.mock.calls.length).toBe(1);
    const mouseClickCallbackArguments = mouseClickCallback.mock.calls[0];
    expect(mouseClickCallbackArguments).toEqual(mouseClickPayload);

    eventEmitter.emit("keyPress", ...keyPressPayload);
    expect(keyPressCallback.mock.calls.length).toBe(1);
    const keyPressCallbackArguments = keyPressCallback.mock.calls[0];
    expect(keyPressCallbackArguments).toEqual(keyPressPayload);
  });

  it("can register multiple callbacks for a given event", () => {
    const eventEmitter = new EventEmitter<{
      mouseClick: [string];
    }>();
    const callbacks = [jest.fn(), jest.fn(), jest.fn()];
    const payload = "will code for food";

    callbacks.forEach((callback) => {
      eventEmitter.register("mouseClick", callback);
    });
    eventEmitter.emit("mouseClick", payload);

    callbacks.forEach((callback) => {
      expect(callback.mock.calls.length).toBe(1);
      const callbackArgument = callback.mock.calls[0][0];
      expect(callbackArgument).toEqual(payload);
    });
  });
});
