import { Browser, CreditCard, Flag } from 'appwrite';

/**
 * useAppwriteAvatar composable
 * 
 * 提供Appwrite头像服务的封装，方便在应用中生成用户头像
 */
export const useAppwriteAvatar = () => {
  // 使用Nuxt的useNuxtApp访问通过插件注册的Appwrite实例
  const { $appwrite } = useNuxtApp();
  
  /**
   * 获取基于用户名首字母的头像URL
   * @param name 用于生成头像的名称（可选）
   * @param width 宽度（可选，0-2000之间的整数）
   * @param height 高度（可选，0-2000之间的整数）
   * @param background 背景颜色（可选）
   * @returns 头像图片URL
   */
  const getInitialsAvatar = (
    name?: string,
    width: number = 100,
    height: number = 100,
    background?: string
  ): string => {
    // 验证宽度和高度的范围
    width = Math.max(0, Math.min(2000, Math.floor(width)));
    height = Math.max(0, Math.min(2000, Math.floor(height)));
    
    return $appwrite.avatars.getInitials(
      name,
      width,
      height,
      background
    );
  };
  
  /**
   * 获取国旗图标
   * @param code 国家代码（两个字母的ISO 3166-1代码），可使用Flag枚举或字符串
   * @param width 宽度（可选，0-2000之间的整数）
   * @param height 高度（可选，0-2000之间的整数）
   * @param quality 图片质量（可选，0-100之间的整数）
   * @returns 国旗图片URL
   */
  const getFlag = (
    code: Flag | string,
    width: number = 100,
    height: number = 100,
    quality: number = 100
  ): string => {
    // 验证参数范围
    width = Math.max(0, Math.min(2000, Math.floor(width)));
    height = Math.max(0, Math.min(2000, Math.floor(height)));
    quality = Math.max(0, Math.min(100, Math.floor(quality)));
    
    return $appwrite.avatars.getFlag(
      code as Flag,
      width,
      height,
      quality
    );
  };
  
  /**
   * 获取浏览器图标
   * @param code 浏览器代码，可使用Browser枚举或字符串
   * @param width 宽度（可选，0-2000之间的整数）
   * @param height 高度（可选，0-2000之间的整数）
   * @param quality 图片质量（可选，0-100之间的整数）
   * @returns 浏览器图标URL
   */
  const getBrowser = (
    code: Browser | string,
    width: number = 100,
    height: number = 100,
    quality: number = 100
  ): string => {
    // 验证参数范围
    width = Math.max(0, Math.min(2000, Math.floor(width)));
    height = Math.max(0, Math.min(2000, Math.floor(height)));
    quality = Math.max(0, Math.min(100, Math.floor(quality)));
    
    return $appwrite.avatars.getBrowser(
      code as Browser,
      width,
      height,
      quality
    );
  };
  
  /**
   * 获取信用卡图标
   * @param code 信用卡代码，可使用CreditCard枚举或字符串
   * @param width 宽度（可选，0-2000之间的整数）
   * @param height 高度（可选，0-2000之间的整数）
   * @param quality 图片质量（可选，0-100之间的整数）
   * @returns 信用卡图标URL
   */
  const getCreditCard = (
    code: CreditCard | string,
    width: number = 100,
    height: number = 100,
    quality: number = 100
  ): string => {
    // 验证参数范围
    width = Math.max(0, Math.min(2000, Math.floor(width)));
    height = Math.max(0, Math.min(2000, Math.floor(height)));
    quality = Math.max(0, Math.min(100, Math.floor(quality)));
    
    return $appwrite.avatars.getCreditCard(
      code as CreditCard,
      width,
      height,
      quality
    );
  };
  
  /**
   * 获取网站favicon图标
   * @param url 网站URL
   * @returns favicon图标URL
   */
  const getFavicon = (url: string): string => {
    return $appwrite.avatars.getFavicon(url);
  };
  
  /**
   * 获取远程图片并调整大小
   * 此方法用于获取、裁剪和显示远程图片，确保使用TLS协议
   * @param url 远程图片URL
   * @param width 宽度（可选，0-2000之间的整数，默认为400）
   * @param height 高度（可选，0-2000之间的整数，默认为400）
   * @returns 处理后的图片URL
   */
  const getImage = (
    url: string,
    width: number = 400,
    height: number = 400
  ): string => {
    // 验证宽度和高度的范围
    width = Math.max(0, Math.min(2000, Math.floor(width)));
    height = Math.max(0, Math.min(2000, Math.floor(height)));
    
    return $appwrite.avatars.getImage(
      url,
      width,
      height
    );
  };
  
  /**
   * 获取二维码图片
   * @param text 要编码为二维码的文本
   * @param size 尺寸（可选，1-1000之间的整数，默认为400）
   * @param margin 边距（可选，0-10之间的整数，默认为1）
   * @param download 是否添加下载头（可选，默认为false）
   *                API实际接受0或1，但这里使用布尔值更符合TypeScript类型
   * @returns 二维码图片URL
   */
  const getQR = (
    text: string,
    size: number = 400,
    margin: number = 1,
    download: boolean = false
  ): string => {
    // 验证参数范围
    size = Math.max(1, Math.min(1000, Math.floor(size)));
    margin = Math.max(0, Math.min(10, Math.floor(margin)));
    
    return $appwrite.avatars.getQR(
      text,
      size,
      margin,
      download
    );
  };
  
  // 提供Browser, CreditCard和Flag枚举供外部使用
  return {
    getInitialsAvatar,
    getFlag,
    getBrowser,
    getCreditCard,
    getFavicon,
    getImage,
    getQR,
    Browser,
    CreditCard,
    Flag
  };
}; 