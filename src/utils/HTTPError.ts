export default class HTTPError extends Error {
  code: number;
  constructor(message: string, code: number, cause?: Error) {
    super(message, {
      cause: cause,
    });
    this.code = code;
  }
}
