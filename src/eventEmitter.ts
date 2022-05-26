/**
 * @todo
 * - Handle multiple listeners assigned to the same eventType
 * - Improve type safety (acceptable payload arguments) via generics
 * - Refactor/add to tests
 * - Add an "unregister/off" function
 * - Rename "register" to "on" to match node.js naming convention?
 * - Add "once" function which un-registers listener once called (quality of life)
 */

type EventListener = (...payload: unknown[]) => void;

/**
 * EventEmitter is used to create event emitters that invoke callback functions (listeners) when a
 * specified event is triggered.
 */
export class EventEmitter {
  private listeners: {
    [eventName: string]: EventListener;
  } = {};

  /**
   * Add callback function to fire when event is triggered.
   * @param eventName Name of the event
   * @param listener Callback function
   */
  register(eventName: string, listener: EventListener) {
    this.listeners[eventName] = listener;
  }

  /**
   * Synchronously calls listeners in the order they were registered.
   * @param eventName Name of the event for the listeners being invoked.
   * @param payload Arguments passed to each listener
   */
  emit(eventName: string, ...payload: Parameters<EventListener>) {
    if (!this.listeners.hasOwnProperty(eventName)) {
      throw new Error(`${eventName} is not a registered listener`);
    }

    this.listeners[eventName](...payload);
  }
}
