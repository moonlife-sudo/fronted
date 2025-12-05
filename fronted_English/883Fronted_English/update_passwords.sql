-- 更新用户密码为123456的BCrypt哈希值

-- 更新学生账号 S0001 的密码
UPDATE t_user SET password_hash = '$2b$10$nekbHf5AUMZLliNgHOKy6uVtha5W1eTJ8LyYX/qG0gZYBETQkO/My' WHERE username = 'S0001';

-- 更新教师账号 T0001 的密码
UPDATE t_user SET password_hash = '$2b$10$SPb1ql3zLVx/pUtMRlIYzeVhou9cgqe1TtPauiUxtk5k5anJZohp6' WHERE username = 'T0001';

-- 更新管理员账号 admin01 的密码
UPDATE t_user SET password_hash = '$2b$10$W4Aipo1UszfgLe4Dqk.W3.YvPQRmrCo7bqGtwh8GzqOYJqTIf3z1u' WHERE username = 'admin01';

-- 执行上述语句后，这三个账号的密码将变为 123456

-- 验证更新结果
SELECT username, password_hash FROM t_user WHERE username IN ('S0001', 'T0001', 'admin01');