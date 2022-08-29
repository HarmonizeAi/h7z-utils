import { Readable, Writable, pipeline } from "stream";
import { streams } from "./index";

describe("BatchTransformStream", () => {
  it("should batch a stream", async () => {
    const writeElementMock = jest.fn();

    const readableStream = new Readable({ objectMode: true });
    const batcher = new streams.BatchTransformStream({ batchSize: 3, objectMode: true });
    const testWriter = new Writable({
      objectMode: true,
      write: async function (elements: string[], encoding, next) {
        writeElementMock(elements);
        next();
      },
    });

    const pipelingPromise = new Promise<void>((resolve, reject) => {
      pipeline(readableStream, batcher, testWriter, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    for (let idx = 0; idx < 10; idx += 1) {
      readableStream.push(`${idx} value`);
    }
    readableStream.push(null);

    await pipelingPromise;

    expect(writeElementMock).toHaveBeenCalledTimes(4);
    expect(writeElementMock).toHaveBeenNthCalledWith(1, ["0 value", "1 value", "2 value"]);
    expect(writeElementMock).toHaveBeenNthCalledWith(2, ["3 value", "4 value", "5 value"]);
    expect(writeElementMock).toHaveBeenNthCalledWith(3, ["6 value", "7 value", "8 value"]);
    expect(writeElementMock).toHaveBeenNthCalledWith(4, ["9 value"]);
  });
});
