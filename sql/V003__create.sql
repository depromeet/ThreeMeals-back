CREATE TABLE favorite
(
    `id`                BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `account_id`        BIGINT(20) UNSIGNED NOT NULL COMMENT '즐겨찾기를 신청한 유저',
    `favorite_account_id`  BIGINT(20) UNSIGNED NOT NULL COMMENT '즐겨찾기 당한 유저',
    `created_at`        TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`        TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '즐겨찾기';
