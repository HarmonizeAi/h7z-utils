import { Transform, TransformCallback, TransformOptions } from "stream";

export class BatchTransformStream extends Transform {
  private batchSize: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private batched: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private lastEnc: any = null;

  constructor(opts?: TransformOptions & { batchSize: number }) {
    super(opts);

    this.batchSize = opts?.batchSize || 100;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _transform(chunk: any, encoding: BufferEncoding, done: TransformCallback) {
    this.lastEnc = encoding;
    this.batched.push(chunk);

    if (this.batched.length >= this.batchSize) {
      const currentBatch = this.batched;
      this.push(currentBatch, this.lastEnc);

      this.batched = [];
    }

    done();
  }

  _flush(done: TransformCallback) {
    if (this.batched.length > 0) {
      const currentBatch = this.batched;
      this.push(currentBatch, this.lastEnc);

      this.batched = [];
    }

    done();
  }
}
