import { UAParser } from 'ua-parser-js';
import { NextFunction, Request, Response } from 'express';

export const handleUserAgent = (req: Request, res: Response, next: NextFunction): void => {
    let ip = req.ip;
    if (ip.substr(0, 7) == '::ffff:') {
        ip = ip.substr(7);
    }
    req.userAgent = {
        ip,
        os: 'unknown',
        browser: 'unknown',
    };

    // browser & os 가 있는지 확인한다.
    const ua = new UAParser(req.headers['user-agent']);
    if (ua.getBrowser().name) {
        const browser = ua.getBrowser();
        const browserVersion = browser.version ? browser.version.split('.')[0] : '';
        req.userAgent.browser = `${ua.getBrowser().name || 'unknown'} ${browserVersion}`;
    }

    if (ua.getOS().name) {
        const os = ua.getOS();
        const osVersion = os.version;
        req.userAgent.os = `${ua.getOS().name || 'unknown'} ${osVersion}`;
    }

    return next();
};

