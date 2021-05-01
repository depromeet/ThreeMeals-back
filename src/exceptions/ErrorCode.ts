export const createErrorCode = (status: number, code: string, message: string) => ({ status, code, message });

export const ERROR_CODE = {
    INTERNAL_SERVER_ERROR: createErrorCode(500, 'E01', 'Internal Server Problem'),

    // unauthorized
    UNAUTHORIZED: createErrorCode(401, 'E02', 'Unauthorized'),

    // not found
    NOT_FOUND: createErrorCode(404, 'E03', 'Not Found'),

    USER_NOT_FOUND: createErrorCode(400, 'E04', 'cannot find user'),
    INVALID_POST_TYPE: createErrorCode(400, 'E05', 'invalid post type'),

    FORBIDDEN: createErrorCode(403, 'E06', 'Forbidden'),
};
