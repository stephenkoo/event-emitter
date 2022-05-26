## Notes & Assumptions

### The ability to add strict type constraints to event emitters is preferred at the expense of type complexity/readability

We would like the option to add strict type constraints on EventEmitters to be able to specify:

1. permissible event names;
2. the expected payload argument types for given event names.

If we would like to opt for simpler types and no type constraints, simply drop the relevant commits.

### Type constraints were tested

I tested typing constraints work correctly by running tsc on the commented code below.
If you'd like to see for yourself, you could copy the following code to the end of `eventEmitter.ts`
and run `tsc` or see if your IDE linter complains.

```ts
const eventEmitter = new EventEmitter<{
  mouseClick: [string, number];
  hover: [number];
}>();

// SHOULD PASS TYPESCRIPT LINTING
eventEmitter.register("mouseClick", (aString: string, aNumber: number) => {});
eventEmitter.emit("mouseClick", "hello", 3);

// SHOULD FAIL TYPESCRIPT LINTING - INVALID PAYLOAD TYPE
eventEmitter.register(
  "mouseClick",
  (aString: string, aNumber: number, aWhat: string) => {}
);
eventEmitter.emit("mouseClick", "hello", 3, "haha");

// SHOULD PASS TYPESCRIPT LINTING
eventEmitter.register("hover", () => {});
eventEmitter.register("hover", (aNumber: number) => {});
eventEmitter.emit("hover", 1);

// SHOULD FAIL TYPESCRIPT LINTING - INVALID PAYLOAD TYPE
eventEmitter.register("hover", (what: string) => {});
eventEmitter.emit("hover", "hello");

// SHOULD FAIL TYPESCRIPT LINTING - UNRECOGNISED EVENT NAME
eventEmitter.register("funny", () => {});
eventEmitter.emit("funny");
```

### Other notes

- I don't see the need for EventEmitter as a class, I would convert this to a function if given a choice. I've a preference for functional programming over OOP unless it makes practical sense.
- I think tests are good for a simple emitter, certainly considering the time-frame of the take-home, I would not DRY-it up at expense of clarity. Would be interesting to see your thoughts on how they could be better.
- I've left all the types in `src/eventEmitter.ts`, may need to extract them to a separate types file if more types are needed in the future.

## Future opportunity for improvement to EventEmitter

- Rename "register" to "on" to match node.js naming convention for consistency
- Add an "unregister/off" function
- Add "once" function which un-registers listener once called
