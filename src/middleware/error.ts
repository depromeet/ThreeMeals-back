import * as createHttpError from 'http-errors';
import * as express from 'express';

export const handle404Error: express.RequestHandler = (req, res, next) => {
    next(createHttpError(404));
};


export const handleError: express.ErrorRequestHandler = (err, req, res, next) => {
    if (err.status !== 404) {
        console.log(err);
    }
    res.status(err.status || 500);
    res.send({ err });
};
