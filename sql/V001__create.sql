CREATE TABLE account
(
  `id`          BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nickname`    VARCHAR(100)        NOT NULL COMMENT '유저 닉네임',
  `provider`    VARCHAR(50)         NOT NULL COMMENT '소셜 로그인 종류 enum타입',
  `provider_id` VARCHAR(100)        NOT NULL COMMENT '소셜 로그인에서 가져오는 고유 Id',
  `status`      VARCHAR(30)         NOT NULL COMMENT '상태',
  `image`       VARCHAR(255)        NULL COMMENT '프로필 이미지',
  `content`     VARCHAR(255)        NULL COMMENT '자기소개 글',
  `instagram_url`  VARCHAR(255)        NULL COMMENT '인스타그램 url',
  `created_at`  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '유저 정보';

CREATE TABLE post
(
  `id`              BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `content`         text                NOT NULL COMMENT '댓글 내용',
  `post_type`       VARCHAR(30)         NOT NULL COMMENT '물어봐 / 답해줘 / OX 퀴즈 enum 타입',
  `post_state`      VARCHAR(30)         NOT NULL COMMENT 'Post 상태',
  `color`           VARCHAR(20)         NOT NULL COMMENT '배경 IsHexColor color 여부',
  `secret_type`     VARCHAR(30)         NOT NULL COMMENT '익명 여부 enum 타입',
  `comments_count`  INT                 NOT NULL DEFAULT 0,
  `from_account_id` BIGINT(20) UNSIGNED NOT NULL COMMENT '나에게 글 쓴 유저 Id',
  `to_account_id`   BIGINT(20) UNSIGNED NOT NULL COMMENT '내가 글 쓴 유저 Id',
  `created_at`      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '게시글';

CREATE TABLE like_post
(
  `id`         BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `account_id` BIGINT(20) UNSIGNED NOT NULL COMMENT '좋아요한 유저 Id',
  `post_id`    BIGINT(20) UNSIGNED NOT NULL COMMENT '좋아요한 Post Id',
  `created_at` TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '게시글 좋아요';

CREATE TABLE comment
(
  `id`            BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `content`       text                NOT NULL COMMENT '댓글 내용',
  `secret_type`   VARCHAR(30)         NOT NULL COMMENT '익명 여부 enum타입',
  `comment_state` VARCHAR(30)         NOT NULL COMMENT 'Comment 상태 enum타입',
  `post_id`       BIGINT(20) UNSIGNED NOT NULL COMMENT 'Post Id',
  `account_id`    BIGINT(20) UNSIGNED NOT NULL COMMENT '유저 Id',
  `parent_id`     BIGINT(20) UNSIGNED NOT NULL COMMENT '부모 댓글 Id',
  `created_at`    TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '댓글';

CREATE TABLE like_comment
(
  `id`         BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `account_id` BIGINT(20) UNSIGNED NOT NULL COMMENT '좋아요한 유저 Id',
  `comment_id` BIGINT(20) UNSIGNED NOT NULL COMMENT '좋아요한 Comment Id',
  `created_at` TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '좋아요 댓글';

CREATE TABLE emoticon
(
  `id`       BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `file_url` VARCHAR(255)        NOT NULL COMMENT '이모티콘 URL',
  `name`     VARCHAR(100)        NOT NULL COMMENT '이모티콘 이름',
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '이모티콘';

CREATE TABLE post_emoticon
(
  `id`          BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `rotate`      FLOAT(8, 2)         NOT NULL DEFAULT '0',
  `position_x`  FLOAT(8, 2)         NOT NULL DEFAULT '0',
  `position_y`  FLOAT(8, 2)         NOT NULL DEFAULT '0',
  `post_id`     BIGINT(20) UNSIGNED NOT NULL COMMENT 'Post Id',
  `emoticon_id` BIGINT(20) UNSIGNED NOT NULL COMMENT 'Emoticon Id',
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '게시글 내 이모티콘';

CREATE TABLE contact
(
  `id`         BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `content`    text                NOT NULL COMMENT '문의내용',
  `sender_id`  BIGINT UNSIGNED     NOT NULL COMMENT '문의한 유저 Id',
  `created_at` TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '문의하기';

CREATE TABLE notification
(
  `id`               BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `account_id`       BIGINT(20) UNSIGNED NOT NULL COMMENT '알림 받는 유저 Id',
  `other_account_id` BIGINT(20) UNSIGNED NOT NULL COMMENT '알림 주는 유저 Id',
  `related_post_id`  BIGINT(20) UNSIGNED NOT NULL COMMENT '알림 관련 Post Id',
  `notification_type` VARCHAR(30)         NOT NULL COMMENT '알림 enum타입',
  `read`             BOOLEAN             NOT NULL COMMENT '알림 읽었는지 확인',
  `created_at`       TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '알림';
