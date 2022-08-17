const updateIfEmpty = <T extends object, K extends keyof T>(obj: T, key: K, newValue: T[K]) => {
  const currentValue = obj[key];

  if (currentValue == null) {
    // value is null or undefined update
    obj[key] = newValue;
    return;
  }

  if (!isString(currentValue)) {
    // value is not a string, no not update
    // since the value is not null
    return;
  }

  // value is a string, check if empty
  const currentValueTrimmed = currentValue.trim();
  if (currentValueTrimmed.length <= 0) {
    obj[key] = newValue;
    return;
  }

  // values is not null and not empty
  return;
};

const isString = (value: unknown): value is string => {
  return typeof value === "string" || value instanceof String;
};

export const ObjectUtils = {
  updateIfEmpty,
};
