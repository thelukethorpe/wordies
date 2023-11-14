export interface IsMappable {
  getUniqueKey: string;
}

class Entry<Key, Value> {
  public key: Key;
  public value: Value;

  constructor(key: Key, value: Value) {
    this.key = key;
    this.value = value;
  }
}

export class WordiesMap<Key extends IsMappable, Value> {
  constructor(entries?: IterableIterator<[Key, Value]>) {
    Array.from(entries ?? []).forEach(([key, value]) => this.set(key, value));
  }

  private readonly _map: Map<string, Entry<Key, Value>> = new Map();

  private find(key: Key): Entry<Key, Value> {
    if (key) {
      return this._map.get(key.getUniqueKey);
    }
    return undefined;
  }

  public get(key: Key): Value | undefined {
    const entry = this.find(key);
    if (entry) {
      return entry.value;
    }
    return undefined;
  }

  public set(key: Key, value: Value): WordiesMap<Key, Value> {
    const entry = this.find(key);
    if (entry) {
      entry.value = value;
    } else {
      this._map.set(key.getUniqueKey, new Entry<Key, Value>(key, value));
    }
    return this;
  }

  public has(key: Key): boolean {
    return this.find(key) !== undefined;
  }

  public delete(key: Key): boolean {
    return this._map.delete(key.getUniqueKey);
  }

  public clear(): void {
    this._map.clear();
  }

  public entries(): IterableIterator<[Key, Value]> {
    return Array.from(this._map.values())
      .map((entry): [Key, Value] => [entry.key, entry.value])
      .values();
  }

  public keys(): IterableIterator<Key> {
    return Array.from(this._map.values())
      .map((entry): Key => entry.key)
      .values();
  }

  public values(): IterableIterator<Value> {
    return Array.from(this._map.values())
      .map((entry): Value => entry.value)
      .values();
  }

  public [Symbol.iterator](): IterableIterator<[Key, Value]> {
    return this.entries();
  }
}
