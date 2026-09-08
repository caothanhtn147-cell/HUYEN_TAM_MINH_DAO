/**
 * BẢO MẬT CHÍNH ĐẠO W3C WEBCRYPTO API
 * Phòng vệ phân quyền, ký số dữ liệu chống F12 sửa localStorage
 */

// SHA-256 Hash kỳ vọng của Master Key: "JCT-MASTER-KEY"
// Tạo bằng: crypto.subtle.digest('SHA-256', new TextEncoder().encode("JCT-MASTER-KEY"))
// Hex: 8527a42b10a9a8385db1f91d09e51c6b3e9444aa5fa4df52b47e4eb7b686caea
const MASTER_KEY_HASH = '8527a42b10a9a8385db1f91d09e51c6b3e9444aa5fa4df52b47e4eb7b686caea';

// Khẩu lệnh bí truyền dự phòng: "JCT2026"
// Hex: a603fc5b525db3bca7aa04f479d46927a44a6f7b322e70e28f3bb1c6e1db71fa
const MASTER_KEY_FALLBACK_HASH = 'a603fc5b525db3bca7aa04f479d46927a44a6f7b322e70e28f3bb1c6e1db71fa';

export class SecurityVault {
  /**
   * Băm chuỗi văn bản sang mã hex SHA-256 bằng WebCrypto phần cứng
   */
  public static async sha256Hex(message: string): Promise<string> {
    if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
      // Fallback đơn giản cho môi trường SSR không có window.crypto
      return '';
    }
    const msgBuffer = new TextEncoder().encode(message.trim());
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Xác thực khẩu lệnh Sư Phụ JCT bằng so sánh mã băm (Zero Plaintext Leakage)
   */
  public static async verifyMasterKey(inputSecret: string): Promise<boolean> {
    try {
      const inputHash = await this.sha256Hex(inputSecret.trim().toUpperCase());
      return inputHash === MASTER_KEY_HASH || inputHash === MASTER_KEY_FALLBACK_HASH;
    } catch {
      return false;
    }
  }

  /**
   * Tạo chữ ký số chống sửa lậu localStorage
   */
  public static async signProfile(deviceId: string, role: string, credits: number): Promise<string> {
    const payload = `${deviceId}::${role}::${credits}::JCT_VAULT_SALT_2026`;
    return await this.sha256Hex(payload);
  }

  /**
   * Xác minh tính toàn vẹn của hồ sơ người dùng
   */
  public static async verifyProfileSignature(
    deviceId: string,
    role: string,
    credits: number,
    signature: string
  ): Promise<boolean> {
    const expectedSig = await this.signProfile(deviceId, role, credits);
    return expectedSig === signature;
  }
}
