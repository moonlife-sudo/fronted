import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 生成BCrypt密码哈希值的工具类
 */
public class GeneratePasswordHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // 要加密的密码
        String password = "123456";
        
        // 生成哈希值
        String hash = encoder.encode(password);
        
        System.out.println("原始密码: " + password);
        System.out.println("BCrypt哈希值: " + hash);
        
        // 验证密码
        boolean matches = encoder.matches(password, hash);
        System.out.println("密码验证结果: " + matches);
        
        // 生成多个账号的密码哈希值
        String[] usernames = {"S0001", "T0001", "admin01"};
        for (String username : usernames) {
            String userHash = encoder.encode(password);
            System.out.println(username + " 的密码哈希值: " + userHash);
        }
    }
}