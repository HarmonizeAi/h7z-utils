export type Left<T> = { tag: "left"; value: T };
export type Right<T> = { tag: "right"; value: T };
export type Either<L, R> = Left<L> | Right<R>;

export const match = <T, L, R>(input: Either<L, R>, left: (left: L) => T, right: (right: R) => T) => {
  switch (input.tag) {
    case "left":
      return left(input.value);
    case "right":
      return right(input.value);
  }
};

export const mapRight = <L, R, T>(input: Either<L, R>, fn: (r: R) => T): Either<L, T> => {
  if (isRight(input)) {
    const newValue = fn(input.value);
    return Right(newValue);
  } else {
    return input;
  }
};

export const mapLeft = <L, R, T>(input: Either<L, R>, fn: (r: L) => T): Either<T, R> => {
  if (isLeft(input)) {
    const newValue = fn(input.value);
    return Left(newValue);
  } else {
    return input;
  }
};

export const flatMapRight = <L, R, NewL, NewR>(
  input: Either<L, R>,
  fn: (r: R) => Right<NewR> | Left<NewL>
): Either<L | NewL, NewR> => {
  if (isRight(input)) {
    const newValue = fn(input.value);
    return newValue;
  } else {
    return input;
  }
};

export const flatMapLeft = <L, R, NewL, NewR>(
  input: Either<L, R>,
  fn: (r: L) => Right<NewR> | Left<NewL>
): Either<NewL, R | NewR> => {
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
