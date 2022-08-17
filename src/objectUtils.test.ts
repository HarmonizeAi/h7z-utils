import { faker } from "@faker-js/faker";
import { ObjectUtils } from "./objectUtils";

interface TestObj {
  strValue: string;
  undefinedStrValue?: string | undefined;
  nullStrValue: string | null | undefined;
  emptyStrValue: string | undefined;

  emptyStrWhenTrimmedValue?: string;

  undefinedNumberValue: number | undefined;
  nullNumberValue: number | null | undefined;
  numberValue: number | undefined;

  objValue: { a: string; b: string } | undefined;
  undefinedObjValue: { a: string; b: string } | undefined;
  nullObjValue: { a: string; b: string } | null | undefined;
}

function createTestObj(): TestObj {
  const testObj: TestObj = {
    strValue: "hello",
    undefinedStrValue: undefined,
    nullStrValue: null,
    emptyStrValue: "",

    emptyStrWhenTrimmedValue: "   ",

    undefinedNumberValue: undefined,
    nullNumberValue: null,
    numberValue: 13,

    objValue: { a: "aValue", b: "bValue" },
    undefinedObjValue: undefined,
    nullObjValue: null,
  };
  return testObj;
}

describe("ObjectUtils", () => {
  describe("updateIfEmpty", () => {
    test("not update and exiting string value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      ObjectUtils.updateIfEmpty(testObjToUpdate, "strValue", "hi");

      expect(testObjToUpdate).toStrictEqual(testObj);
    });

    test("update an exiting undefined string value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValue = faker.lorem.words(3);
      ObjectUtils.updateIfEmpty(testObjToUpdate, "undefinedStrValue", fakeValue);

      expect(testObjToUpdate).toStrictEqual({ ...testObj, undefinedStrValue: fakeValue });
    });

    test("update an exiting null string value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValue = faker.lorem.words(3);
      ObjectUtils.updateIfEmpty(testObjToUpdate, "nullStrValue", fakeValue);

      expect(testObjToUpdate).toStrictEqual({ ...testObj, nullStrValue: fakeValue });
    });

    test("update an exiting empty string value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValue = faker.lorem.words(3);
      ObjectUtils.updateIfEmpty(testObjToUpdate, "emptyStrValue", fakeValue);

      expect(testObjToUpdate).toStrictEqual({ ...testObj, emptyStrValue: fakeValue });
    });

    test("update an exiting empty after trimmed string value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValue = faker.lorem.words(3);
      ObjectUtils.updateIfEmpty(testObjToUpdate, "emptyStrWhenTrimmedValue", fakeValue);

      expect(testObjToUpdate).toStrictEqual({ ...testObj, emptyStrWhenTrimmedValue: fakeValue });
    });

    test("update an undefined number value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValue = faker.datatype.number();
      ObjectUtils.updateIfEmpty(testObjToUpdate, "undefinedNumberValue", fakeValue);

      expect(testObjToUpdate).toStrictEqual({ ...testObj, undefinedNumberValue: fakeValue });
    });

    test("update an null number value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValue = faker.datatype.number();
      ObjectUtils.updateIfEmpty(testObjToUpdate, "nullNumberValue", fakeValue);

      expect(testObjToUpdate).toStrictEqual({ ...testObj, nullNumberValue: fakeValue });
    });

    test("do not update an existing number value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValue = faker.datatype.number();
      ObjectUtils.updateIfEmpty(testObjToUpdate, "numberValue", fakeValue);

      expect(testObjToUpdate).toStrictEqual(testObj);
    });

    test("update an existing undefined object value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValueA = faker.lorem.words(3);
      const fakeValueB = faker.lorem.words(3);
      const udpateObj = { a: fakeValueA, b: fakeValueB };
      ObjectUtils.updateIfEmpty(testObjToUpdate, "undefinedObjValue", udpateObj);

      expect(testObjToUpdate).toStrictEqual({ ...testObj, undefinedObjValue: udpateObj });
    });

    test("update an existing null object value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValueA = faker.lorem.words(3);
      const fakeValueB = faker.lorem.words(3);
      const udpateObj = { a: fakeValueA, b: fakeValueB };
      ObjectUtils.updateIfEmpty(testObjToUpdate, "nullObjValue", udpateObj);

      expect(testObjToUpdate).toStrictEqual({ ...testObj, nullObjValue: udpateObj });
    });

    test("do not update an existing object value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValueA = faker.lorem.words(3);
      const fakeValueB = faker.lorem.words(3);
      const udpateObj = { a: fakeValueA, b: fakeValueB };
      ObjectUtils.updateIfEmpty(testObjToUpdate, "objValue", udpateObj);

      expect(testObjToUpdate).toStrictEqual(testObj);
    });
  });
});
