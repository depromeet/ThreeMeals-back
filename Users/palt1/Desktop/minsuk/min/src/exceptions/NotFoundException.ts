import HttpException from './HttpException';

class NotFoundException extends HttpException {
    constructor(message: string) {
        super(message || 'not found', 404);
    }
}

export default NotFoundException;

