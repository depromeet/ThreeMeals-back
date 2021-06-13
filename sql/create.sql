CREATE TABLE IF NOT EXISTS account
(
  `id`               BIGINT(20) UNSIGNED     NOT NULL AUTO_INCREMENT,
  `nickname`         VARCHAR(100)            NOT NULL COMMENT '유저 닉네임',
  `provider`         VARCHAR(8)              NOT NULL COMMENT '소셜 로그인 종류 enum타입',
  `providerId`       VARCHAR(20)             NOT NULL COMMENT '소셜 로그인에서 가져오는 고유 Id',
  `status`           VARCHAR(10)             NOT NULL COMMENT '상태',
  `image`            text                    NULL COMMENT '프로필 이미지',
  `content`          VARCHAR(50)        	 NULL COMMENT '자기소개 글',
  `profileUrl`       VARCHAR(50)             NULL COMMENT '인스타그램 혹은 facebook',
  `created_at`       TIMESTAMP               NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP               NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '유저 정보';

CREATE TABLE IF NOT EXISTS post
(
  `id`               BIGINT(20) UNSIGNED       NOT NULL AUTO_INCREMENT,
  `content`          text                      NOT NULL COMMENT '댓글 내용',
  `post_type`        VARCHAR(255)              NOT NULL COMMENT '물어봐 / 답해줘 / OX 퀴즈 enum타입',
  `post_state`       VARCHAR(255)              NOT NULL COMMENT 'Post 상태',
  `color`            VARCHAR(20)               NOT NULL COMMENT '배경 IsHexColor color여부',
  `secret_type`      VARCHAR(255)              NOT NULL COMMENT '익명 여부 enum타입',
  `comments_count`   INT                       NOT NULL DEFAULT 0,
  `from_account_id`  BIGINT UNSIGNED           NOT NULL COMMENT '나에게 글 쓴 유저 Id',
  `to_account_id`    BIGINT UNSIGNED           NOT NULL COMMENT '내가 글 쓴 유저 Id',
  `created_at`       TIMESTAMP                 NOT NULL,
  `updated_at`       TIMESTAMP                 NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '게시글';


CREATE TABLE IF NOT EXISTS like_post
(
  `id`               BIGINT(20) UNSIGNED       NOT NULL AUTO_INCREMENT,
  `account_id`       BIGINT UNSIGNED           NOT NULL COMMENT '좋아요한 유저 Id',
  `post_id`          BIGINT UNSIGNED           NOT NULL COMMENT '좋아요한 Post Id',
  `created_at`       TIMESTAMP                 NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '좋아요 게시글';


CREATE TABLE IF NOT EXISTS comment
(
  `id`             BIGINT(20) UNSIGNED       NOT NULL AUTO_INCREMENT,
  `content`        text                      NOT NULL COMMENT '댓글 내용',
  `secret_type`    VARCHAR(255)              NOT NULL COMMENT '익명 여부 enum타입',
  `comment_status` VARCHAR(255)              NOT NULL COMMENT 'Comment 상태 enum타입',
  `post_id`        BIGINT UNSIGNED           NOT NULL COMMENT 'Post Id',
  `account_id`     BIGINT UNSIGNED           NOT NULL COMMENT '유저 Id',
  `parent_id`      BIGINT UNSIGNED           NOT NULL COMMENT '부모 댓글 Id',
  `created_at`     TIMESTAMP                 NOT NULL,
  `updated_at`     TIMESTAMP                 NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '댓글';


CREATE TABLE IF NOT EXISTS like_comment
(
  `id`               BIGINT(20) UNSIGNED       NOT NULL AUTO_INCREMENT,
  `account_id`       BIGINT UNSIGNED           NOT NULL COMMENT '좋아요한 유저 Id',
  `comment_id`       BIGINT UNSIGNED           NOT NULL COMMENT '좋아요한 Comment Id',
  `created_at`       TIMESTAMP                 NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '좋아요 댓글';


CREATE TABLE IF NOT EXISTS emoticon
(
  `id`               BIGINT(20) UNSIGNED       NOT NULL AUTO_INCREMENT,
  `file_url`         VARCHAR(255)              NOT NULL COMMENT '이모티콘 URL',
  `name`             VARCHAR(255)              NOT NULL COMMENT '이모티콘 이름',
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '이모티콘';


CREATE TABLE IF NOT EXISTS post_emoticon
(
  `id`               BIGINT(20) UNSIGNED       NOT NULL AUTO_INCREMENT,
  `rotate`           FLOAT(8,2)                NOT NULL DEFAULT '0',
  `position_x`       FLOAT(8,2)                NOT NULL DEFAULT '0',
  `position_y`       FLOAT(8,2)                NOT NULL DEFAULT '0',
  `post_id`          BIGINT UNSIGNED           NOT NULL COMMENT 'Post Id',
  `emoticon_id`      BIGINT UNSIGNED           NOT NULL COMMENT 'Emoticon Id',
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '게시글 내 이모티콘';


CREATE TABLE IF NOT EXISTS contact
(
  `id`               BIGINT(20) UNSIGNED       NOT NULL AUTO_INCREMENT,
  `content`          text                      NOT NULL COMMENT '문의내용',
  `sender_id`        BIGINT UNSIGNED           NOT NULL COMMENT '문의한 유저 Id',
  `created_at`       TIMESTAMP                 NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '문의하기';


CREATE TABLE IF NOT EXISTS notification
(
  `id`                BIGINT(20) UNSIGNED       NOT NULL AUTO_INCREMENT,
  `account_id`        BIGINT UNSIGNED           NOT NULL COMMENT '알림 받는 유저 Id',
  `other_account_id`  BIGINT UNSIGNED           NOT NULL COMMENT '알림 주는 유저 Id',
  `related_post_id`   BIGINT UNSIGNED           NOT NULL COMMENT '알림 관련 Post Id',
  `notificationType`  VARCHAR(15)               NOT NULL COMMENT '알림 enum타입',
  `created_at`        TIMESTAMP                 NOT NULL,
  `updated_at`        TIMESTAMP                 NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET = utf8mb4 COMMENT '알림';