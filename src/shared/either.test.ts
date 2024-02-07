import {
  Left,
  Right,
  isLeft,
  isRight,
  match,
  mapLeft,
  mapRight,
  getRight,
  getLeft,
  isEither,
  flatMapRight,
  flatMapLeft,
} from "./either";

describe("either", () => {
  describe("Left", () => {
    const leftValue = "leftValue";
    const leftObj = Left(leftValue);

    test("object values", () => {
      expect(leftObj.tag).toEqual("left");
      expect(leftObj.value).toEqual(leftValue);
    });

    test("isLeft", () => {
      expect(isLeft(leftObj)).toBe(true);
    });

    test("isRight", () => {
      expect(isRight(leftObj)).toBe(false);
    });

    test("getRight of left ", () => {
      expect(getRight(leftObj)).toBe(undefined);
    });

    test("getLeft of left ", () => {
      expect(getLeft(leftObj)).toBe(leftValue);
    });

    test("match", () => {
      const leftFn = jest.fn().mockReturnValue("l");
      const rightFn = jest.fn().mockReturnValue("r");

      const res = match(leftObj, leftFn, rightFn);
      expect(res).toEqual("l");

      expect(leftFn).toHaveBeenCalledTimes(1);
      expect(leftFn).toHaveBeenCalledWith(leftValue);

      expect(rightFn).toHaveBeenCalledTimes(0);
    });

    test("mapLeft on left value", () => {
      const newValue = "newLeft";
      const leftObj = Left(leftValue);

      const mapFn = jest.fn(() => newValue);
      const res = mapLeft(leftObj, mapFn);

      expect(mapFn).toHaveBeenCalledTimes(1);
      expect(mapFn).toHaveBeenCalledWith(leftObj.value);
      expect(isLeft(res)).toBe(true);
      expect(res.value).toEqual(newValue);
    });

    test("mapLeft on right value", () => {
      const oldValue = "right value";
      const rightObj = Right(oldValue);

      const newValue = 10;

      const mapFn = jest.fn(() => newValue);
      const res = mapLeft(rightObj, mapFn);
      expect(mapFn).toHaveBeenCalledTimes(0);

      expect(isRight(res)).toBe(true);
      expect(res.value).toEqual(oldValue);
    });

    test("mapRight on right value", () => {
      const oldValue = "old value";
      const rightObj = Right(oldValue);

      const newValue = 2;
      const mapFn = jest.fn(() => newValue);
      const res = mapRight(rightObj, mapFn);

      expect(mapFn).toHaveBeenCalledTimes(1);
      expect(mapFn).toHaveBeenCalledWith(oldValue);
      expect(isRight(res)).toBe(true);
      expect(res.value).toEqual(newValue);
    });

    test("mapRight on left value", () => {
      const oldValue = "old value";
      const leftObj = Left(oldValue);

      const newValue = 2;
      const mapFn = jest.fn(() => newValue);
      const res = mapRight(leftObj, mapFn);

      expect(mapFn).toHaveBeenCalledTimes(0);
      expect(isLeft(res)).toBe(true);
      expect(res.value).toEqual(oldValue);
    });
  });

  describe("Right", () => {
    const value = "rightValue";
    const obj = Right(value);

    test("object values", () => {
      expect(obj.tag).toEqual("right");
      expect(obj.value).toEqual(value);
    });

    test("isLeft", () => {
      expect(isLeft(obj)).toBe(false);
    });

    test("isRight", () => {
      expect(isRight(obj)).toBe(true);
    });

    test("getRight of right ", () => {
      expect(getRight(obj)).toBe(value);
    });

    test("getLeft of right ", () => {
      expect(getLeft(obj)).toBe(undefined);
    });

    test("match", () => {
      const leftFn = jest.fn().mockReturnValue("l");
      const rightFn = jest.fn().mockReturnValue("r");

      const res = match(obj, leftFn, rightFn);
      expect(res).toEqual("r");

      expect(rightFn).toHaveBeenCalledTimes(1);
      expect(rightFn).toHaveBeenCalledWith(value);

      expect(leftFn).toHaveBeenCalledTimes(0);
    });

    test("mapRight", () => {
      const newValue = "newRight";
      const oldValue = obj.value;

      const mapFn = jest.fn(() => newValue);
      const res = mapRight(obj, mapFn);

      expect(mapFn).toHaveBeenCalledWith(oldValue);
      expect(isRight(res)).toBe(true);
      expect(res.value).toEqual(newValue);
    });

    test("mapLeft", () => {
      const newValue = "newLeft";
      const oldValue = obj.value;

      const mapFn = jest.fn(() => newValue);
      const res = mapLeft(obj, mapFn);

      expect(mapFn).not.toHaveBeenCalled();
      expect(isRight(res)).toBe(true);
      expect(res.value).toEqual(oldValue);
    });

    test("flatMapRight change right", () => {
      const newValue = Right(1);
      const oldValue = obj.value;

      const mapFn = jest.fn(() => newValue);

      // should do nothing to left values
      const resLeftVal = flatMapRight(Left("something"), mapFn);
      expect(mapFn).toHaveBeenCalledTimes(0);
      expect(resLeftVal).toEqual(Left("something"));

      const res = flatMapRight(obj, mapFn);

      expect(mapFn).toHaveBeenCalledTimes(1);
      expect(mapFn).toHaveBeenCalledWith(oldValue);
      expect(isRight(res)).toBe(true);
      expect(res).toEqual(newValue);
    });

    test("flatMapRight make left", () => {
      const newValue = Left("problem");
      const oldValue = obj.value;

      const mapFn = jest.fn(() => newValue);
      const res = flatMapRight(obj, mapFn);

      expect(mapFn).toHaveBeenCalledWith(oldValue);
      expect(isLeft(res)).toBe(true);
      expect(res).toEqual(newValue);
    });

    test("flatMapLeft change left", () => {
      const obj = Left("left val");
      const newValue = Left(1);

      const mapFn = jest.fn(() => newValue);

      // should do nothing to right values
      const resRightVal = flatMapLeft(Right("right val"), mapFn);
      expect(mapFn).toHaveBeenCalledTimes(0);
      expect(resRightVal).toEqual(Right("right val"));

      const res = flatMapLeft(obj, mapFn);

      expect(mapFn).toHaveBeenCalledTimes(1);
      expect(mapFn).toHaveBeenCalledWith(obj.value);
      expect(isLeft(res)).toBe(true);
      expect(res).toEqual(newValue);
    });

    test("flatMapLeft make right", () => {
      const obj = Left("left val");
      const newValue = Right("fixed");

      const mapFn = jest.fn(() => newValue);
      const res = flatMapLeft(obj, mapFn);

      expect(mapFn).toHaveBeenCalledWith(obj.value);
      expect(isRight(res)).toBe(true);
      expect(res).toEqual(newValue);
    });
  });

  describe("isEither", () => {
    it("should fail on a string", () => {
      expect(isEither("poop")).toBe(false);
    });

    it("should fail on a String", () => {
      expect(isEither(new String("poop"))).toBe(false);
    });

    it("should fail on a number", () => {
      expect(isEither(12)).toBe(false);
    });

    it("should fail on an array", () => {
      expect(isEither([1, 2, 3])).toBe(false);
    });

    it("should fail on an set", () => {
      expect(isEither(new Set(["tag", "value"]))).toBe(false);
    });

    it("should fail on an Map", () => {
      const mapValue = new Map();
      mapValue.set("value", "a_value");
      mapValue.set("tag", "left");
      expect(isEither(mapValue)).toBe(false);
    });

    it("should fail on an object with a wrong tag", () => {
      const obj = { tag: "random", value: "stuff" };
      expect(isEither(obj)).toBe(false);
    });

    it("should succeed on an object", () => {
      const obj = { tag: "right", value: "stuff" };
      expect(isEither(obj)).toBe(true);
    });

    it("should succeed on a Left", () => {
      const obj = Left("error");
      expect(isEither(obj)).toBe(true);
    });

    it("should succeed on a Right", () => {
      const obj = Right("value");
      expect(isEither(obj)).toBe(true);
    });

    it("should type check correctly", () => {
      const obj = { tag: "right", value: "random" } as unknown; // force to be unknown
      expect(isEither(obj)).toBe(true);

      if (!isEither<string, string>(obj)) {
        throw new Error("should not get here");
      }
      expect(obj.value === "random").toBe(true);
    });
  });
});
