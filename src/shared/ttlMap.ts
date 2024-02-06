export type WithTTL<V> = [V, number];

const CLEAN_INTERVAL_MS = 5 * 60 * 1000; // clean every 5 minutes

type IntervalTimer = ReturnType<typeof setInterval>;

export class TTLMap<K, V> {
  // value: [ data, expiration date in millis ]
  private map: Map<K, WithTTL<V>>;

  private cleanIntervalId: IntervalTimer | undefined = undefined;

  constructor(private expirationMillis: number) {
    this.map = new Map();
  }

  _startCleanTimer() {
    if (this.cleanIntervalId != null) {
      clearInterval(this.cleanIntervalId);
    }

    this.cleanIntervalId = setInterval(() => this.clean(), CLEAN_INTERVAL_MS);
  }

  stopCleanTimer() {
    if (this.cleanIntervalId == null) {
      return;
    }

    clearInterval(this.cleanIntervalId);
  }

  clean() {
    const now = Date.now();
    for (const entry of this.map.entries()) {
      const [key, value] = entry;
      this._considerTTL(value, now, key);
    }

    if (this.map.size <= 0) {
      // map is empty, stop clean timer
      this.stopCleanTimer();
    }
  }

  clear() {
    this.map.clear();
    this.stopCleanTimer();
  }

  delete(key: K): boolean {
    const wasRemoved = this.map.delete(key);
    if (this.map.size <= 0) {
      // map is empty, stop clean timer
      this.stopCleanTimer();
    }

    return wasRemoved;
  }

  _considerTTL(data: WithTTL<V>, nowMillis: number, cleanUpKey: K | undefined = undefined) {
    const [value, expireOn] = data;
    if (nowMillis > expireOn) {
      // value expired
      if (cleanUpKey != null) {
        this.map.delete(cleanUpKey);
      }

      return undefined;
    }
    return value;
  }

  /**
   * Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
   * @returns Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.
   */
  get(key: K): V | undefined {
    const found = this.map.get(key);
    if (found == null) {
      return undefined;
    }
    return this._considerTTL(found, Date.now(), key);
  }
  /**
   * @returns boolean indicating whether an element with the specified key exists or not.
   */
  has(key: K): boolean {
    const hasValue = this.map.has(key);
    if (hasValue == false) {
      return false;
    }

    // have to check ttl, get element first
    const found = this.map.get(key);
    if (found == null) {
      return false;
    }

    const foundValue = this._considerTTL(found, Date.now(), key);
    return foundValue != null;
  }
  /**
   * Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.
   */
  set(key: K, value: V): this {
    const expireOn = this.expirationMillis + Date.now();
    this.map.set(key, [value, expireOn]);

    // value added, start clean timer
    this._startCleanTimer();

    return this;
  }

  setRaw(key: K, value: V, expireOn: number): this {
    this.map.set(key, [value, expireOn]);

    // value added, start clean timer
    this._startCleanTimer();

    return this;
  }

  entries() {
    const mapEntries = this.map.entries();

    const it = new TransformIterator(mapEntries, (v) => {
      const [key, valueWTTL] = v;
      const value = this._considerTTL(valueWTTL, Date.now(), key);
      if (value == null) {
        return undefined;
      }

      return [key, value];
    });

    return it;
  }
  entriesRaw() {
    return this.map.entries();
  }

  values() {
    const mapValues = this.map.values();

    const it = new TransformIterator(mapValues, (valueWTTL) => {
      const value = this._considerTTL(valueWTTL, Date.now());
      return value;
    });

    return it;
  }

  keys() {
    const mapEntries = this.map.entries();

    const it = new TransformIterator(mapEntries, (v) => {
      const [key, valueWTTL] = v;
      const value = this._considerTTL(valueWTTL, Date.now(), key);

      if (value == null) {
        return undefined;
      } else {
        return key;
      }
    });

    return it;
  }
}

class TransformIterator<Input, T> implements IterableIterator<T> {
  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  constructor(
    private iterator: IterableIterator<Input>,
    private transformFn: (v: Input) => T | undefined,
  ) {}

  next(): IteratorResult<T, T | undefined> {
    return this._next();
  }

  private _next(): IteratorResult<T, T | undefined> {
    const currentNext = this.iterator.next();
    if (currentNext.done == true) {
      return { done: true, value: undefined };
    }

    const value = currentNext.value;
    const transformed = this.transformFn(value);
    if (transformed != null) {
      return { done: false, value: transformed };
    }

    return this._next();
  }
}
