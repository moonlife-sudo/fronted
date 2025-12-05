// 使用bcrypt生成密码哈希值的脚本
const bcrypt = require('bcrypt');

// 要加密的密码
const password = '123456';
// 生成哈希值的成本因子
const saltRounds = 10;

// 生成哈希值
async function generateHash() {
    try {
        // 生成盐值
        const salt = await bcrypt.genSalt(saltRounds);
        // 使用盐值生成哈希值
        const hash = await bcrypt.hash(password, salt);
        
        console.log('原始密码:', password);
        console.log('BCrypt哈希值:', hash);
        
        // 验证密码
        const match = await bcrypt.compare(password, hash);
        console.log('密码验证结果:', match);
        
        // 为多个账号生成密码哈希值
        const usernames = ['S0001', 'T0001', 'admin01'];
        for (const username of usernames) {
            const userHash = await bcrypt.hash(password, saltRounds);
            console.log(`${username} 的密码哈希值: ${userHash}`);
        }
    } catch (error) {
        console.error('生成哈希值时出错:', error);
    }
}

// 运行生成哈希值的函数
generateHash();