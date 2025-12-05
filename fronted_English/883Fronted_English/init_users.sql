-- 创建用户数据以及更新密码为123456

-- 插入学生用户 S0001
INSERT INTO t_user (username, password_hash, full_name, email, phone_number, status, token_version) VALUES
('S0001', '$2b$10$nekbHf5AUMZLliNgHOKy6uVtha5W1eTJ8LyYX/qG0gZYBETQkO/My', 'Student One', 'student1@example.com', '13800138001', 1, 1);

-- 插入教师用户 T0001
INSERT INTO t_user (username, password_hash, full_name, email, phone_number, status, token_version) VALUES
('T0001', '$2b$10$SPb1ql3zLVx/pUtMRlIYzeVhou9cgqe1TtPauiUxtk5k5anJZohp6', 'Teacher One', 'teacher1@example.com', '13900139001', 1, 1);

-- 插入管理员用户 admin01
INSERT INTO t_user (username, password_hash, full_name, email, phone_number, status, token_version) VALUES
('admin01', '$2b$10$W4Aipo1UszfgLe4Dqk.W3.YvPQRmrCo7bqGtwh8GzqOYJqTIf3z1u', 'Admin One', 'admin1@example.com', '13700137001', 1, 1);

-- 确保角色存在
INSERT IGNORE INTO t_role (role_name, role_key, description) VALUES
('Student', 'student', '学生角色'),
('Teacher', 'teacher', '教师角色'),
('Admin', 'admin', '管理员角色');

-- 获取角色ID
SET @student_role_id = (SELECT role_id FROM t_role WHERE role_key = 'student');
SET @teacher_role_id = (SELECT role_id FROM t_role WHERE role_key = 'teacher');
SET @admin_role_id = (SELECT role_id FROM t_role WHERE role_key = 'admin');

-- 获取用户ID
SET @student_user_id = (SELECT user_id FROM t_user WHERE username = 'S0001');
SET @teacher_user_id = (SELECT user_id FROM t_user WHERE username = 'T0001');
SET @admin_user_id = (SELECT user_id FROM t_user WHERE username = 'admin01');

-- 分配角色
INSERT INTO t_user_role (user_id, role_id) VALUES
(@student_user_id, @student_role_id),
(@teacher_user_id, @teacher_role_id),
(@admin_user_id, @admin_role_id);

-- 验证插入结果
SELECT u.username, u.full_name, r.role_name
FROM t_user u
JOIN t_user_role ur ON u.user_id = ur.user_id
JOIN t_role r ON ur.role_id = r.role_id
WHERE u.username IN ('S0001', 'T0001', 'admin01');