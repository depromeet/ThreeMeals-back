import createHttpError from 'http-errors';
import express from 'express';

export const notFound: express.RequestHandler = (req, res, next) => {
    next(createHttpError(404));
};


export const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
    if (err.status !== 404) {
        console.log(err);
    }
    res.status(err.status || 500);
    res.send({err});
};
