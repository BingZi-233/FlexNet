/**
 * 参数验证工具composable
 * 提供常用的验证功能
 */
export const useValidation = () => {
  /**
   * 校验字符串类型参数是否有效
   * @param value 要校验的值
   * @param allowEmpty 是否允许为空字符串
   * @returns 是否有效
   */
  const isValidString = (value: any, allowEmpty = false): boolean => {
    if (typeof value !== 'string') return false;
    if (!allowEmpty && value.trim() === '') return false;
    return true;
  };
  
  /**
   * 校验数字类型参数是否有效
   * @param value 要校验的值
   * @param min 最小值（可选）
   * @param max 最大值（可选）
   * @returns 是否有效
   */
  const isValidNumber = (value: any, min?: number, max?: number): boolean => {
    if (typeof value !== 'number' || isNaN(value)) return false;
    if (min !== undefined && value < min) return false;
    if (max !== undefined && value > max) return false;
    return true;
  };
  
  /**
   * 校验数组类型参数是否有效
   * @param value 要校验的值
   * @param minLength 最小长度（可选）
   * @param maxLength 最大长度（可选）
   * @returns 是否有效
   */
  const isValidArray = (value: any, minLength?: number, maxLength?: number): boolean => {
    if (!Array.isArray(value)) return false;
    if (minLength !== undefined && value.length < minLength) return false;
    if (maxLength !== undefined && value.length > maxLength) return false;
    return true;
  };
  
  /**
   * 校验邮箱格式是否有效
   * @param email 邮箱地址
   * @returns 是否有效
   */
  const isValidEmail = (email: string): boolean => {
    if (!isValidString(email)) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * 校验手机号格式是否有效
   * 要求包含国际区号前缀，如+86
   * @param phone 手机号
   * @returns 是否有效
   */
  const isValidPhone = (phone: string): boolean => {
    if (!isValidString(phone)) return false;
    // 验证带有国际区号的手机号
    const phoneRegex = /^\+[1-9]\d{0,2}[- ]?\d{4,14}$/;
    return phoneRegex.test(phone);
  };
  
  /**
   * 校验密码强度
   * 默认要求至少8个字符，包含大小写字母和数字
   * @param password 密码
   * @param minLength 最小长度
   * @returns 是否有效
   */
  const isValidPassword = (password: string, minLength = 8): boolean => {
    if (!isValidString(password)) return false;
    if (password.length < minLength) return false;
    
    // 默认要求密码包含大小写字母和数字
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumbers;
  };
  
  /**
   * 校验URL格式是否有效
   * @param url URL地址
   * @returns 是否有效
   */
  const isValidUrl = (url: string): boolean => {
    if (!isValidString(url)) return false;
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  /**
   * 校验日期字符串格式是否有效
   * @param dateString 日期字符串
   * @returns 是否有效
   */
  const isValidDate = (dateString: string): boolean => {
    if (!isValidString(dateString)) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };
  
  return {
    isValidString,
    isValidNumber,
    isValidArray,
    isValidEmail,
    isValidPhone,
    isValidPassword,
    isValidUrl,
    isValidDate
  };
}; 