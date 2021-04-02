import httpException from './httpException';

class notFoundException extends httpException {
  constructor(message: string) {
    super(message || 'not found', 404);
  }
}

export default notFoundException;
