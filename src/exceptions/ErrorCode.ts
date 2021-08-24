export const createErrorCode = (status: number, code: string, message: string) => ({ status, code, message });

export const ERROR_CODE = {
    INTERNAL_SERVER_ERROR: createErrorCode(500, 'E001', 'Internal Server Problem'),
    UNAUTHORIZED: createErrorCode(401, 'E002', 'Unauthorized'),
    NOT_FOUND: createErrorCode(404, 'E003', 'Not Found'),
    USER_NOT_FOUND: createErrorCode(400, 'E004', 'cannot find user'),
    INVALID_IMAGE_TYPE: createErrorCode(400, 'E005', 'invalid image type'),
    FORBIDDEN: createErrorCode(403, 'E006', 'Forbidden'),
    POST_NOT_FOUND: createErrorCode(400, 'E007', 'cannot find post'),
    UNAUTHORIZED_WRITE_COMMENT: createErrorCode(401, 'E008', 'unauthorized write comment'),
    INVALID_OX_COMMENT_CONTENT: createErrorCode(400, 'E009', 'invalid ox comment content'),
    ALREADY_COMMENT_SUBMITTED: createErrorCode(400, 'E010', 'already comment submitted'),
    COMMENT_NOT_FOUND: createErrorCode(404, 'E011', 'Not Found comment'),
    COMMENT_NOT_PARENT: createErrorCode(400, 'E012', 'cannot use parent comment'),
    INVALID_MATCH_COMMENT_POST: createErrorCode(400, 'E013', 'invalid match comment & post'),
    INVALID_POST_TYPE: createErrorCode(400, 'E014', 'invalid post type'),
    INVALID_POST_STATE: createErrorCode(400, 'E015', 'invalid post state'),
    UNAUTHORIZED_LIKE_POST: createErrorCode(401, 'E016', 'Unauthorized to create like'),
    ALREADY_COMMENT_LIKE: createErrorCode(401, 'E017', 'already comment like'),
    JWT_SIGN_ERROR: createErrorCode(400, 'E018', 'failed to create access token'),
};
