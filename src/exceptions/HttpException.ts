class HttpException extends Error {
  message: string;
  status: number;
  constructor(message: string, status: number) {
      super();
      Error.captureStackTrace(this, this.constructor);

      this.message = message || 'server problem';
      this.status = status || 500;
  }
}

export default HttpException;

