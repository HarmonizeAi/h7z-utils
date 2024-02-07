// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Left<T = any> {
  tag: "left";
  value: T;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Right<T = any> {
  tag: "right";
  value: T;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Either<L = any, R = any> = Left<L> | Right<R>;

export const match = <T, L, R>(input: Either<L, R>, left: (left: L) => T, right: (right: R) => T) => {
  switch (input.tag) {
    case "left":
      return left(input.value);
    case "right":
      return right(input.value);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapRight = <E extends Either, T>(
  input: E,
  fn: (r: Extract<E, Right>["value"]) => T,
): Extract<E, Left> | (Extract<E, Right> extends never ? never : Right<T>) => {
  if (isRight(input)) {
    const newValue = fn(input.value);
    return Right(newValue) as Extract<E, Right> extends never ? never : Right<T>;
  }
  return input as Extract<E, Left>;
};

export const mapLeft = <E extends Either, T>(
  input: E,
  fn: (r: Extract<E, Left>["value"]) => T,
): Extract<E, Right> | (Extract<E, Left> extends never ? never : Left<T>) => {
  if (isLeft(input)) {
    const newValue = fn(input.value);
    return Left(newValue) as Extract<E, Left> extends never ? never : Left<T>;
  }
  return input as Extract<E, Right>;
};

export const flatMapRight = <L, R, NewL, NewR, Ret extends Right<NewR> | Left<NewL>>(
  input: Either<L, R>,
  fn: (r: R) => Ret,
): Ret | Left<L> => {
  if (isRight(input)) {
    const newValue = fn(input.value);
    return newValue;
  } else {
    return input;
  }
};

export const flatMapLeft = <L, R, NewL, NewR, Ret extends Right<NewR> | Left<NewL>>(
  input: Either<L, R>,
  fn: (r: L) => Ret,
): Ret | Right<R> => {
  if (isLeft(input)) {
    const newValue = fn(input.value);
    return newValue;
  } else {
    return input;
  }
};

export const isRight = <L, R>(input: Either<L, R>): input is Right<R> => {
  return input.tag === "right";
};

export const isLeft = <L, R>(input: Either<L, R>): input is Left<L> => {
  return input.tag === "left";
};

export const isEither = <T, V>(input: unknown): input is Either<T, V> => {
  if (input == null || typeof input != "object") {
    return false;
  }
  const inputRecord = input as Record<string, unknown>;

  if (!("tag" in inputRecord)) {
    return false;
  }

  if (!(inputRecord.tag == "left" || inputRecord.tag == "right")) {
    return false;
  }

  if (!("value" in input)) {
    return false;
  }

  return true;
};

export const getLeft = <L, R>(input?: Either<L, R>): L | undefined => {
  if (input && isLeft(input)) {
    return input.value;
  } else {
    return undefined;
  }
};
export const getRight = <L, R>(input?: Either<L, R>): R | undefined => {
  if (input && isRight(input)) {
    return input.value;
  } else {
    return undefined;
  }
};

export const Right = <T>(value: T): Right<T> => {
  return {
    tag: "right",
    value,
  };
};

export const Left = <T>(value: T): Left<T> => {
  return {
    tag: "left",
    value,
  };
};
