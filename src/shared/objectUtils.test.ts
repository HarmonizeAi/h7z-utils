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
  describe("inplaceUpdateIfEmpty", () => {
    test("not update and exiting string value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      ObjectUtils.inplaceUpdateIfEmpty(testObjToUpdate, "strValue", "hi");

      expect(testObjToUpdate).toStrictEqual(testObj);
    });

    test("update an exiting undefined string value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValue = faker.lorem.words(3);
      ObjectUtils.inplaceUpdateIfEmpty(testObjToUpdate, "undefinedStrValue", fakeValue);

      expect(testObjToUpdate).toStrictEqual({ ...testObj, undefinedStrValue: fakeValue });
    });

    test("update an exiting null string value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValue = faker.lorem.words(3);
      ObjectUtils.inplaceUpdateIfEmpty(testObjToUpdate, "nullStrValue", fakeValue);

      expect(testObjToUpdate).toStrictEqual({ ...testObj, nullStrValue: fakeValue });
    });

    test("update an exiting empty string value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValue = faker.lorem.words(3);
      ObjectUtils.inplaceUpdateIfEmpty(testObjToUpdate, "emptyStrValue", fakeValue);

      expect(testObjToUpdate).toStrictEqual({ ...testObj, emptyStrValue: fakeValue });
    });

    test("update an exiting empty after trimmed string value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValue = faker.lorem.words(3);
      ObjectUtils.inplaceUpdateIfEmpty(testObjToUpdate, "emptyStrWhenTrimmedValue", fakeValue);

      expect(testObjToUpdate).toStrictEqual({ ...testObj, emptyStrWhenTrimmedValue: fakeValue });
    });

    test("update an undefined number value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValue = faker.number.int();
      ObjectUtils.inplaceUpdateIfEmpty(testObjToUpdate, "undefinedNumberValue", fakeValue);

      expect(testObjToUpdate).toStrictEqual({ ...testObj, undefinedNumberValue: fakeValue });
    });

    test("update an null number value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValue = faker.number.int();
      ObjectUtils.inplaceUpdateIfEmpty(testObjToUpdate, "nullNumberValue", fakeValue);

      expect(testObjToUpdate).toStrictEqual({ ...testObj, nullNumberValue: fakeValue });
    });

    test("do not update an existing number value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValue = faker.number.int();
      ObjectUtils.inplaceUpdateIfEmpty(testObjToUpdate, "numberValue", fakeValue);

      expect(testObjToUpdate).toStrictEqual(testObj);
    });

    test("update an existing undefined object value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValueA = faker.lorem.words(3);
      const fakeValueB = faker.lorem.words(3);
      const udpateObj = { a: fakeValueA, b: fakeValueB };
      ObjectUtils.inplaceUpdateIfEmpty(testObjToUpdate, "undefinedObjValue", udpateObj);

      expect(testObjToUpdate).toStrictEqual({ ...testObj, undefinedObjValue: udpateObj });
    });

    test("update an existing null object value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValueA = faker.lorem.words(3);
      const fakeValueB = faker.lorem.words(3);
      const udpateObj = { a: fakeValueA, b: fakeValueB };
      ObjectUtils.inplaceUpdateIfEmpty(testObjToUpdate, "nullObjValue", udpateObj);

      expect(testObjToUpdate).toStrictEqual({ ...testObj, nullObjValue: udpateObj });
    });

    test("do not update an existing object value", () => {
      const testObj = createTestObj();
      const testObjToUpdate = Object.assign({}, testObj);

      const fakeValueA = faker.lorem.words(3);
      const fakeValueB = faker.lorem.words(3);
      const udpateObj = { a: fakeValueA, b: fakeValueB };
      ObjectUtils.inplaceUpdateIfEmpty(testObjToUpdate, "objValue", udpateObj);

      expect(testObjToUpdate).toStrictEqual(testObj);
    });
  });

  describe("setUpdateObjectIfEmpty", () => {
    test("not update and exiting string value", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      ObjectUtils.setUpdateObjectIfEmpty(testObj, "strValue", "hi", updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);

      expect(updateObj).toStrictEqual({});
    });

    test("update an exiting undefined string value", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      const fakeValue = faker.lorem.words(3);
      ObjectUtils.setUpdateObjectIfEmpty(testObj, "undefinedStrValue", fakeValue, updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);

      expect(updateObj).toStrictEqual({ undefinedStrValue: fakeValue });
    });

    test("update an exiting undefined string and trim the value", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      const fakeValue = faker.lorem.words(3);
      const fakeValueWSpaces = "   " + fakeValue + "  ";
      ObjectUtils.setUpdateObjectIfEmpty(testObj, "undefinedStrValue", fakeValueWSpaces, updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);

      expect(updateObj).toStrictEqual({ undefinedStrValue: fakeValue });
    });

    test("not update an exiting undefined string value when new value is empty", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      const fakeValue = "";
      ObjectUtils.setUpdateObjectIfEmpty(testObj, "undefinedStrValue", fakeValue, updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);
      expect(updateObj).toStrictEqual({});
    });

    test("not update an exiting undefined string value when new value is trimmed empty", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      const fakeValue = "   ";
      ObjectUtils.setUpdateObjectIfEmpty(testObj, "undefinedStrValue", fakeValue, updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);
      expect(updateObj).toStrictEqual({});
    });

    test("update an exiting null string value", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      const fakeValue = faker.lorem.words(3);
      ObjectUtils.setUpdateObjectIfEmpty(testObj, "nullStrValue", fakeValue, updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);

      expect(updateObj).toStrictEqual({ nullStrValue: fakeValue });
    });

    test("update an exiting null string and trim the value", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      const fakeValue = faker.lorem.words(3);
      const fakeValueWSpaces = "   " + fakeValue + "  ";
      ObjectUtils.setUpdateObjectIfEmpty(testObj, "nullStrValue", fakeValueWSpaces, updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);

      expect(updateObj).toStrictEqual({ nullStrValue: fakeValue });
    });

    test("not update an exiting null string value when new value is empty", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      const fakeValue = "";
      ObjectUtils.setUpdateObjectIfEmpty(testObj, "nullStrValue", fakeValue, updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);
      expect(updateObj).toStrictEqual({});
    });

    test("not update an exiting null string value when new value is trimmed empty", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      const fakeValue = "   ";
      ObjectUtils.setUpdateObjectIfEmpty(testObj, "nullStrValue", fakeValue, updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);
      expect(updateObj).toStrictEqual({});
    });

    test("update an exiting empty string value", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      const fakeValue = faker.lorem.words(3);
      ObjectUtils.setUpdateObjectIfEmpty(testObj, "emptyStrValue", fakeValue, updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);

      expect(updateObj).toStrictEqual({ emptyStrValue: fakeValue });
    });

    test("update an exiting empty string and trim the value", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      const fakeValue = faker.lorem.words(3);
      const fakeValueWSpaces = "   " + fakeValue + "  ";
      ObjectUtils.setUpdateObjectIfEmpty(testObj, "emptyStrValue", fakeValueWSpaces, updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);

      expect(updateObj).toStrictEqual({ emptyStrValue: fakeValue });
    });

    test("update an exiting empty after trimmed string value", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      const fakeValue = faker.lorem.words(3);
      ObjectUtils.setUpdateObjectIfEmpty(testObj, "emptyStrWhenTrimmedValue", fakeValue, updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);

      expect(updateObj).toStrictEqual({ emptyStrWhenTrimmedValue: fakeValue });
    });

    test("update an exiting empty after trimmed string and trim the value", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      const fakeValue = faker.lorem.words(3);
      const fakeValueWSpaces = "   " + fakeValue + "  ";
      ObjectUtils.setUpdateObjectIfEmpty(testObj, "emptyStrWhenTrimmedValue", fakeValueWSpaces, updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);

      expect(updateObj).toStrictEqual({ emptyStrWhenTrimmedValue: fakeValue });
    });

    test("update an undefined number value", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      const fakeValue = faker.number.int();
      ObjectUtils.setUpdateObjectIfEmpty(testObj, "undefinedNumberValue", fakeValue, updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);

      expect(updateObj).toStrictEqual({ undefinedNumberValue: fakeValue });
    });

    test("update an null number value", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      const fakeValue = faker.number.int();
      ObjectUtils.setUpdateObjectIfEmpty(testObj, "nullNumberValue", fakeValue, updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);

      expect(updateObj).toStrictEqual({ nullNumberValue: fakeValue });
    });

    test("do not update an existing number value", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      const fakeValue = faker.number.int();
      ObjectUtils.setUpdateObjectIfEmpty(testObj, "numberValue", fakeValue, updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);

      expect(updateObj).toStrictEqual({});
    });

    test("update an existing undefined object value", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      const fakeValueA = faker.lorem.words(3);
      const fakeValueB = faker.lorem.words(3);
      const udpateObj = { a: fakeValueA, b: fakeValueB };
      ObjectUtils.setUpdateObjectIfEmpty(testObj, "undefinedObjValue", udpateObj, updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);

      expect(updateObj).toStrictEqual({ undefinedObjValue: udpateObj });
    });

    test("update an existing null object value", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      const fakeValueA = faker.lorem.words(3);
      const fakeValueB = faker.lorem.words(3);
      const udpateObj = { a: fakeValueA, b: fakeValueB };
      ObjectUtils.setUpdateObjectIfEmpty(testObj, "nullObjValue", udpateObj, updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);

      expect(updateObj).toStrictEqual({ nullObjValue: udpateObj });
    });

    test("do not update an existing object value", () => {
      const testObj = createTestObj();
      const testObjCopy = Object.assign({}, testObj);
      const updateObj: Partial<TestObj> = {};

      const fakeValueA = faker.lorem.words(3);
      const fakeValueB = faker.lorem.words(3);
      const udpateObj = { a: fakeValueA, b: fakeValueB };
      ObjectUtils.setUpdateObjectIfEmpty(testObj, "objValue", udpateObj, updateObj);

      // test object should not have changed
      expect(testObj).toStrictEqual(testObjCopy);

      expect(updateObj).toStrictEqual({});
    });
  });
});
