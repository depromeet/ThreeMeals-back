export const createErrorCode = (status: number, code: string, message: string) => ({ status, code, message });

export const ERROR_CODE = {
    INTERNAL_SERVER_ERROR: createErrorCode(500, 'E001', 'Internal Server Problem'),
    UNAUTHORIZED: createErrorCode(401, 'E002', 'Unauthorized'),
    NOT_FOUND: createErrorCode(404, 'E003', 'Not Found'),
    USER_NOT_FOUND: createErrorCode(400, 'E004', 'cannot find user'),
    INVALID_POST_TYPE: createErrorCode(400, 'E005', 'invalid post type'),
    INVALID_IMAGE_TYPE: createErrorCode(400, 'E005', 'invalid image type'),
    FORBIDDEN: createErrorCode(403, 'E006', 'Forbidden'),
    POST_NOT_FOUND: createErrorCode(400, 'E007', 'cannot find post'),
    UNAUTHORIZED_WRITE_COMMENT: createErrorCode(400, 'E008', 'unauthorized write comment'),
    INVALID_OX_COMMENT_CONTENT: createErrorCode(400, 'E009', 'invalid ox comment content'),
    ALREADY_COMMENT_SUBMITTED: createErrorCode(400, 'E010', 'already comment submitted'),
};
