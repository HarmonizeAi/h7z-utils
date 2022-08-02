import { Left, Right, isLeft, isRight, match, mapLeft, mapRight } from "./either";

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

    test("match", () => {
      const leftFn = jest.fn().mockReturnValue("l");
      const rightFn = jest.fn().mockReturnValue("r");

      const res = match(leftObj, leftFn, rightFn);
      expect(res).toEqual("l");

      expect(leftFn).toHaveBeenCalledTimes(1);
      expect(leftFn).toHaveBeenCalledWith(leftValue);

      expect(rightFn).toHaveBeenCalledTimes(0);
    });

    test("mapLeft", () => {
      const newValue = "newLeft";

      const mapFn = jest.fn(() => newValue);
      const res = mapLeft(leftObj, mapFn);

      expect(mapFn).toHaveBeenCalledWith(leftObj.value);
      expect(isLeft(res)).toBe(true);
      expect(res.value).toEqual(newValue);
    });

    test("mapRight", () => {
      const oldLeftValue = leftObj.value;

      const newValue = "newRight";
      const mapFn = jest.fn(() => newValue);
      const res = mapRight(leftObj, mapFn);

      expect(mapFn).not.toHaveBeenCalled();
      expect(isLeft(res)).toBe(true);
      expect(res.value).toEqual(oldLeftValue);
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
  });
});
