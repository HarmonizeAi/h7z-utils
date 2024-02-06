const inplaceUpdateIfEmpty = <T extends object, K extends keyof T>(obj: T, key: K, newValue: T[K]) => {
  return setUpdateObjectIfEmpty(obj, key, newValue, obj);
};

const insertStrIntoObject = <T extends object, K extends keyof T>(obj: T, key: K, newValue: T[K]) => {
  if (newValue != null && isString(newValue)) {
    const trimmedNewValue = newValue.trim();
    if (trimmedNewValue.length > 0) {
      obj[key] = trimmedNewValue as unknown as T[K];
    }
  }
};

const setUpdateObjectIfEmpty = <T extends object, K extends keyof T>(
  obj: T,
  key: K,
  newValue: T[K],
  updateObj: Partial<T>,
) => {
  const currentValue = obj[key];

  if (currentValue == null) {
    if (newValue == null) {
      return;
    }

    if (isString(newValue)) {
      // value is a string insters it specially
      insertStrIntoObject(updateObj, key, newValue);
    } else {
      // value is null or undefined update
      updateObj[key] = newValue;
    }
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
    // current value is an empty string, replace it
    insertStrIntoObject(updateObj, key, newValue);
    return;
  }

  // values is not null and not empty
  return;
};

const isString = (value: unknown): value is string => {
  return typeof value === "string" || value instanceof String;
};

export const ObjectUtils = {
  setUpdateObjectIfEmpty,
  inplaceUpdateIfEmpty,
};
