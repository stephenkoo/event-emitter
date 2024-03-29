type EventListener<T extends unknown[]> = (...payload: T) => void;

type EventPayloadMap = Record<string, unknown[]>;

/**
 * EventEmitter is used to create event emitters that invoke callback functions (listeners) when a
 * specified event is triggered.
 *
 * ```ts
 * const eventEmitter = new EventEmitter<{
 *   event1: [string, number];
 *   event2: [Record<string, string>];
 * }>();
 *
 * const event1Payload = ["hello", 5] as const;
 * const event1Listener = (aString: string, aNumber: number) => {};
 * eventEmitter.register("event1", event1Listener);
 * eventEmitter.emit("event1", ...event1Payload);
 *
 * const event2Payload = [{ stephen: "I can TS & so can you"}] as const;
 * const event2Listener = (aRecord: Record<string, string>) => {};
 * eventEmitter.register("event2", event2Listener);
 * eventEmitter.emit("event2", ...event2Payload);
 * ```
 *
 * You can also use EventEmitter without specifying payload type-constraints
 * ```ts
 * const eventEmitter = new EventEmitter();
 *
 * const eventPayload = ["hello", 5];
 * const eventListener = (aString: string, aNumber: number) => {};
 * eventEmitter.register("event", event1Listener);
 * eventEmitter.emit("event", ...event1Payload);
 * ```
 */
export class EventEmitter<T extends EventPayloadMap> {
  private listenersByEventName: {
    [K in keyof T]?: EventListener<T[K]>[];
  } = {};

  /**
   * Add callback function to fire when event is triggered.
   * @param eventName Name of the event
   * @param listener Callback function
   */
  register<K extends keyof T>(eventName: K, listener: EventListener<T[K]>) {
    const listeners: EventListener<T[K]>[] =
      this.listenersByEventName[eventName] ?? [];
    this.listenersByEventName[eventName] = listeners.concat(listener);
  }

  /**
   * Synchronously calls listeners in the order they were registered.
   * @param eventName Name of the event for the listeners being invoked.
   * @param payload Arguments passed to each listener
   */
  emit<K extends keyof T>(
    eventName: K,
    ...payload: Parameters<EventListener<T[K]>>
  ) {
    if (!this.listenersByEventName.hasOwnProperty(eventName)) {
      throw new Error(`${eventName} is not a registered listener`);
    }

    this.listenersByEventName[eventName]?.forEach((listener) => {
      listener(...payload);
    });
  }
}
