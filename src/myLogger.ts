import chalk from "chalk";

const LogLevels = ["log", "error", "warn", "debug", "verbose"] as const;
export type LogLevel = typeof LogLevels[number];

export const enabledLogLevels: Set<LogLevel> = new Set<LogLevel>(["log", "error", "warn", "debug", "verbose"]);
function isLogLevelEnabled(level: LogLevel): boolean {
  return enabledLogLevels.has(level);
}

export class MyLogger {
  private _lastTimestamp: number | undefined = undefined;
  set lastTimestamp(v: number | undefined) {
    this._lastTimestamp = v;
  }
  get lastTimestamp(): number | undefined {
    return this._lastTimestamp;
  }

  constructor(public context: string, public readonly isTimestampEnabled = false) {}

  error(
    message: string,
    trace = "",
    extras?: Record<string, unknown>,
    user?: { uid: string; email?: string },
    skipRemoteCapture?: boolean
  ) {
    if (!isLogLevelEnabled("error")) {
      return;
    }

    const doRemoteCapture = skipRemoteCapture != true;
    printMessage(this, message, chalk.red, true, extras, "stderr", doRemoteCapture);
    this.printStackTrace(trace);

    // if (doRemoteCapture) {
    //   this.captureSentryMessage(message, context, Sentry.Severity.Error, trace, extras, user);
    // }
  }

  log(message: string, extras?: Record<string, unknown>) {
    if (!isLogLevelEnabled("log")) {
      return;
    }
    printMessage(this, message, chalk.green, true, extras, "stdout", false);
  }

  warn(message: string, extras?: Record<string, unknown>, user?: { uid: string; email?: string }) {
    if (!isLogLevelEnabled("warn")) {
      return;
    }

    printMessage(this, message, chalk.yellow, true, extras, "stdout", true);
    // this.captureSentryMessage(message, context, Sentry.Severity.Warning, undefined, extras, user);
  }

  debug(message: string, extras?: Record<string, unknown>) {
    if (!isLogLevelEnabled("debug")) {
      return;
    }
    printMessage(this, message, chalk.magentaBright, true, extras, "stdout", false);
  }

  verbose(message: string, extras?: Record<string, unknown>) {
    if (!isLogLevelEnabled("verbose")) {
      return;
    }
    printMessage(this, message, chalk.cyanBright, true, extras, "stdout", false);
  }

  private printStackTrace(trace: string) {
    if (!trace) {
      return;
    }
    process.stderr.write(`${trace}\n`);
  }
}

function updateAndGetTimestampDiff(myLogger: MyLogger, isTimeDiffEnabled?: boolean): string {
  const includeTimestamp = myLogger.lastTimestamp && isTimeDiffEnabled;
  const result = includeTimestamp ? chalk.yellow(` +${Date.now() - (myLogger.lastTimestamp || 0)}ms`) : "";
  myLogger.lastTimestamp = Date.now();
  return result;
}

function printMessage(
  logger: MyLogger,
  message: string,
  color: (message: string) => string,
  isTimeDiffEnabled?: boolean,
  extras?: Record<string, unknown>,
  writeStreamType?: "stdout" | "stderr",
  didRemoteCapture?: boolean
) {
  const output = isPlainObject(message) ? `${color("Object:")}\n${JSON.stringify(message, null, 2)}\n` : color(message);

  const remoteCaptureMsg = didRemoteCapture == true ? "[☁️ ⤴ ] " : "";

  const extrasText = extras != null ? " " + color(JSON.stringify(extras)) : "";

  const pidMessage = color(`${process.pid}   - `);
  const contextMessage = chalk.yellow(`[${logger.context}] `);
  const timestampDiff = updateAndGetTimestampDiff(logger, isTimeDiffEnabled);
  const timestamp = getTimestamp();
  const computedMessage = `${pidMessage}${timestamp}   ${contextMessage}${remoteCaptureMsg}${output}${extrasText}${timestampDiff}\n`;

  process[writeStreamType ?? "stdout"].write(computedMessage);
}

function getTimestamp() {
  const localeStringOptions = {
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    day: "2-digit",
    month: "2-digit",
  };
  return new Date(Date.now()).toLocaleString(undefined, localeStringOptions as Intl.DateTimeFormatOptions);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUndefined = (obj: any): obj is undefined => typeof obj === "undefined";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNil = (val: any): val is null | undefined => isUndefined(val) || val === null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isObject = (fn: any): fn is object => !isNil(fn) && typeof fn === "object";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isPlainObject = (fn: any): fn is object => {
  if (!isObject(fn)) {
    return false;
  }
  const proto = Object.getPrototypeOf(fn);
  if (proto === null) {
    return true;
  }
  const ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return (
    typeof ctor === "function" &&
    ctor instanceof ctor &&
    Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object)
  );
};
