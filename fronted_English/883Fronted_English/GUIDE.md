新增用于初始化用户数据和生成BCrypt密码哈希值的相关文件。

## 文件说明

### 1. init_users.sql
**用途**: 初始化数据库中的用户数据和角色信息

**功能**:
- 创建三个默认用户：
  - S0001（学生用户）
  - T0001（教师用户）
  - admin01（管理员用户）
- 创建三个默认角色：
  - student（学生角色）
  - teacher（教师角色）
  - admin（管理员角色）
- 为用户分配相应角色
- 所有用户的初始密码均为：123456（已使用BCrypt加密）

**使用方法**:
```sql
-- 在MySQL数据库中执行此SQL文件
mysql -u username -p database_name < init_users.sql
```

### 2. generate-bcrypt.js
**用途**: Node.js脚本，用于生成BCrypt密码哈希值

**依赖**:
```bash
npm install bcrypt
```

**功能**:
- 生成指定密码的BCrypt哈希值
- 支持批量生成多个用户的密码哈希值
- 包含密码验证功能

**运行方法**:
```bash
node generate-bcrypt.js
```

### 3. GeneratePasswordHash.java
**用途**: Java工具类，用于生成BCrypt密码哈希值

**依赖**:
```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-crypto</artifactId>
</dependency>
```

**功能**:
- 使用Spring Security的BCryptPasswordEncoder生成哈希值
- 支持批量生成多个用户的密码哈希值
- 包含密码验证功能

**编译和运行**:
```bash
javac GeneratePasswordHash.java
java GeneratePasswordHash
```

### 4. update_passwords.sql
**用途**: 更新数据库中已有用户的密码哈希值

**功能**:
- 将指定用户的密码更新为123456的BCrypt哈希值
- 包含更新验证语句

**使用方法**:
```sql
-- 在MySQL数据库中执行此SQL文件
mysql -u root -p 123456 campus_system < update_passwords.sql
```

## 默认用户信息

| 用户名 | 角色 | 姓名 | 邮箱 | 初始密码 |
|--------|------|------|------|----------|
| S0001 | student | Student One | student1@example.com | 123456 |
| T0001 | teacher | Teacher One | teacher1@example.com | 123456 |
| admin01 | admin | Admin One | admin1@example.com | 123456 |

## 密码哈希值说明

所有用户的密码都使用BCrypt算法进行加密，成本因子为10。文件中已包含的哈希值对应密码"123456"。

## 使用步骤

1. **首次部署**:
   - 执行 `init_users.sql` 创建用户和角色数据

2. **更新密码**:
   - 如果需要重置密码为123456，执行 `update_passwords.sql`

3. **生成新的哈希值**:
   - 如果需要为其他密码生成哈希值，使用 `generate-bcrypt.js` 或 `GeneratePasswordHash.java`

## 技术支持

如遇到问题，请检查：
1. 数据库连接是否正确
2. 是否有足够的权限执行SQL语句
3. BCrypt库的版本兼容性

