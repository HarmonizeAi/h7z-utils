import { faker } from "@faker-js/faker";
import { TTLMap } from "./ttlMap";

describe("TTLMap", () => {
  it("should set value and check has", () => {
    const map = new TTLMap<string, string>(10 * 1000);

    const toTest = [
      { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
      { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
      { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
      { key: faker.random.alphaNumeric(5), value: undefined /* do not insert in test */ },
      { key: faker.random.alphaNumeric(5), value: undefined /* do not insert in test */ },
      { key: faker.random.alphaNumeric(5), value: undefined /* do not insert in test */ },
    ];

    toTest.forEach((data) => {
      if (data.value != null) {
        map.set(data.key, data.value);
      }
    });

    toTest.forEach((data) => {
      const has = map.has(data.key);
      expect(has).toEqual(data.value != null);
    });

    // clean up so tests do not hang
    map.stopCleanTimer();
  });

  it("should set value and check get", () => {
    const map = new TTLMap<string, string>(10 * 1000);

    const toTest = [
      { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
      { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
      { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
      { key: faker.random.alphaNumeric(5), value: undefined /* do not insert in test */ },
      { key: faker.random.alphaNumeric(5), value: undefined /* do not insert in test */ },
      { key: faker.random.alphaNumeric(5), value: undefined /* do not insert in test */ },
    ];

    toTest.forEach((data) => {
      if (data.value != null) {
        map.set(data.key, data.value);
      }
    });

    toTest.forEach((data) => {
      const got = map.get(data.key);

      if (data.value == null) {
        expect(got).toBeUndefined();
      } else {
        expect(got).toEqual(data.value);
      }
    });

    // clean up so tests do not hang
    map.stopCleanTimer();
  });

  describe("timeouts", () => {
    it("has should consider expiration", () => {
      const map = new TTLMap<string, string>(10 * 1000);

      const now = Date.now();

      const toTest = [
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
        { key: "expire1", value: faker.random.alphaNumeric(10), expireOn: now - 1000 },
        { key: "expire2", value: faker.random.alphaNumeric(10), expireOn: now - 1 },
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
      ];

      toTest.forEach((data) => {
        if (data.expireOn != null) {
          map.setRaw(data.key, data.value, data.expireOn);
        } else {
          map.set(data.key, data.value);
        }
      });

      for (const testVal of toTest) {
        const has = map.has(testVal.key);
        expect(has).toEqual(testVal.expireOn == null);
      }

      // clean up so tests do not hang
      map.stopCleanTimer();
    });

    it("get should consider expiration", () => {
      const map = new TTLMap<string, string>(10 * 1000);

      const now = Date.now();

      const toTest = [
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
        { key: "expire1", value: faker.random.alphaNumeric(10), expireOn: now - 1000 },
        { key: "expire2", value: faker.random.alphaNumeric(10), expireOn: now - 1 },
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
      ];

      toTest.forEach((data) => {
        if (data.expireOn != null) {
          map.setRaw(data.key, data.value, data.expireOn);
        } else {
          map.set(data.key, data.value);
        }
      });

      for (const testVal of toTest) {
        const got = map.get(testVal.key);

        if (testVal.expireOn != null) {
          expect(got).toBeUndefined();
        } else {
          expect(got).toEqual(testVal.value);
        }
      }

      // clean up so tests do not hang
      map.stopCleanTimer();
    });
  });

  describe("entries", () => {
    it("should get entries", () => {
      const map = new TTLMap<string, string>(10 * 1000);

      const toTest = [
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
      ];

      toTest.forEach((data) => {
        if (data.value != null) {
          map.set(data.key, data.value);
        }
      });

      const entries = Array.from(map.entries());
      const expected = toTest.map((v) => [v.key, v.value]);

      let idx = 0;
      for (const e of entries) {
        expect(e).toEqual(expected[idx]);
        idx += 1;
      }

      // clean up so tests do not hang
      map.stopCleanTimer();
    });

    it("should consider timeout when get entries", () => {
      const map = new TTLMap<string, string>(10 * 1000);

      const now = Date.now();

      const toTest = [
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
        { key: "expire1", value: faker.random.alphaNumeric(10), expireOn: now - 1000 },
        { key: "expire2", value: faker.random.alphaNumeric(10), expireOn: now - 1 },
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
      ];

      toTest.forEach((data) => {
        if (data.expireOn != null) {
          map.setRaw(data.key, data.value, data.expireOn);
        } else {
          map.set(data.key, data.value);
        }
      });

      const entries = Array.from(map.entries());
      const expectedArr = toTest.filter((v) => v.expireOn == null).map((v) => [v.key, v.value]);

      let idx = 0;
      for (const e of entries) {
        const expected = expectedArr[idx];
        expect(e).toEqual(expected);
        idx += 1;
      }

      // clean up so tests do not hang
      map.stopCleanTimer();
    });
  });

  describe("values", () => {
    it("should get values", () => {
      const map = new TTLMap<string, string>(10 * 1000);

      const toTest = [
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
      ];

      toTest.forEach((data) => {
        if (data.value != null) {
          map.set(data.key, data.value);
        }
      });

      const entries = Array.from(map.values());
      const expected = toTest.map((v) => v.value);

      let idx = 0;
      for (const e of entries) {
        expect(e).toEqual(expected[idx]);
        idx += 1;
      }

      // clean up so tests do not hang
      map.stopCleanTimer();
    });

    it("should consider timeout when get values", () => {
      const map = new TTLMap<string, string>(10 * 1000);

      const now = Date.now();

      const toTest = [
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
        { key: "expire1", value: faker.random.alphaNumeric(10), expireOn: now - 1000 },
        { key: "expire2", value: faker.random.alphaNumeric(10), expireOn: now - 1 },
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
      ];

      toTest.forEach((data) => {
        if (data.expireOn != null) {
          map.setRaw(data.key, data.value, data.expireOn);
        } else {
          map.set(data.key, data.value);
        }
      });

      const values = Array.from(map.values());
      const expectedArr = toTest.filter((v) => v.expireOn == null).map((v) => v.value);

      let idx = 0;
      for (const v of values) {
        const expected = expectedArr[idx];
        expect(v).toEqual(expected);
        idx += 1;
      }

      // clean up so tests do not hang
      map.stopCleanTimer();
    });
  });

  describe("keys", () => {
    it("should get keys", () => {
      const map = new TTLMap<string, string>(10 * 1000);

      const toTest = [
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
      ];

      toTest.forEach((data) => {
        if (data.value != null) {
          map.set(data.key, data.value);
        }
      });

      const entries = Array.from(map.keys());
      const expected = toTest.map((v) => v.key);

      let idx = 0;
      for (const e of entries) {
        expect(e).toEqual(expected[idx]);
        idx += 1;
      }

      // clean up so tests do not hang
      map.stopCleanTimer();
    });

    it("should consider timeout when get keys", () => {
      const map = new TTLMap<string, string>(10 * 1000);

      const now = Date.now();

      const toTest = [
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
        { key: "expire1", value: faker.random.alphaNumeric(10), expireOn: now - 1000 },
        { key: "expire2", value: faker.random.alphaNumeric(10), expireOn: now - 1 },
        { key: faker.random.alphaNumeric(5), value: faker.random.alphaNumeric(10) },
      ];

      toTest.forEach((data) => {
        if (data.expireOn != null) {
          map.setRaw(data.key, data.value, data.expireOn);
        } else {
          map.set(data.key, data.value);
        }
      });

      const entries = Array.from(map.keys());
      const expectedArr = toTest.filter((v) => v.expireOn == null).map((v) => v.key);

      let idx = 0;
      for (const e of entries) {
        const expected = expectedArr[idx];
        expect(e).toEqual(expected);
        idx += 1;
      }

      // clean up so tests do not hang
      map.stopCleanTimer();
    });
  });
});
