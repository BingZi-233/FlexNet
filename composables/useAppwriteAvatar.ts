import type { Models } from 'appwrite';

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
   * @param name 用于生成头像的名称
   * @param width 宽度（可选）
   * @param height 高度（可选）
   * @param background 背景颜色（可选）
   */
  const getInitialsAvatar = (
    name: string = 'Anonymous',
    width: number = 80,
    height: number = 80,
    background?: string
  ): string => {
    let url = $appwrite.avatars.getInitials(name);
    
    // 添加宽度和高度参数
    url += `?width=${width}&height=${height}`;
    
    // 如果指定了背景颜色，添加到URL
    if (background) {
      url += `&background=${encodeURIComponent(background)}`;
    }
    
    return url;
  };
  
  /**
   * 获取Gravatar头像URL
   * @param email 用户邮箱
   * @param size 尺寸（可选）
   */
  const getGravatarImage = (
    email: string,
    size: number = 80
  ): string => {
    return $appwrite.avatars.getGravatar(email, size);
  };
  
  /**
   * 获取国旗图标
   * @param countryCode 国家代码（两个字母的ISO 3166-1代码）
   * @param width 宽度（可选）
   * @param height 高度（可选）
   */
  const getCountryFlag = (
    countryCode: string,
    width: number = 100,
    height: number = 75
  ): string => {
    let url = $appwrite.avatars.getFlag(countryCode);
    
    // 添加宽度和高度参数
    url += `?width=${width}&height=${height}`;
    
    return url;
  };
  
  /**
   * 获取浏览器图标
   * @param browser 浏览器代码 (chrome, firefox, safari, edge 等)
   * @param width 宽度（可选）
   * @param height 高度（可选）
   */
  const getBrowserIcon = (
    browser: string,
    width: number = 100,
    height: number = 100
  ): string => {
    let url = $appwrite.avatars.getBrowser(browser);
    
    // 添加宽度和高度参数
    url += `?width=${width}&height=${height}`;
    
    return url;
  };
  
  /**
   * 获取信用卡图标
   * @param provider 信用卡提供商代码 (amex, argencard, cabal, censosud, diners, discover, elo, hipercard, jcb, mastercard, naranja, targeta-shopping, union-china, visa 等)
   * @param width 宽度（可选）
   * @param height 高度（可选）
   */
  const getCreditCardIcon = (
    provider: string,
    width: number = 100,
    height: number = 100
  ): string => {
    let url = $appwrite.avatars.getCreditCard(provider);
    
    // 添加宽度和高度参数
    url += `?width=${width}&height=${height}`;
    
    return url;
  };
  
  /**
   * 获取二维码图片
   * @param text 要编码为二维码的文本
   * @param size 尺寸（可选）
   * @param margin 边距（可选）
   * @param download 是否添加下载头（可选）
   */
  const getQRCode = (
    text: string,
    size: number = 400,
    margin: number = 1,
    download: boolean = false
  ): string => {
    let url = $appwrite.avatars.getQR(text);
    
    // 添加参数
    url += `?size=${size}&margin=${margin}`;
    
    if (download) {
      url += '&download=1';
    }
    
    return url;
  };
  
  /**
   * 获取随机头像URL（使用DiceBear生成）
   * @param style 头像样式，如 'avataaars', 'bottts', 'initials' 等
   * @param seed 随机种子，用于生成一致的头像
   * @param width 宽度（可选）
   * @param height 高度（可选）
   */
  const getRandomAvatar = (
    style: string = 'initials',
    seed: string = 'avatar',
    width: number = 80,
    height: number = 80
  ): string => {
    let url = $appwrite.avatars.getImage(style, seed);
    
    // 添加宽度和高度参数
    url += `?width=${width}&height=${height}`;
    
    return url;
  };
  
  return {
    getInitialsAvatar,
    getGravatarImage,
    getCountryFlag,
    getBrowserIcon,
    getCreditCardIcon,
    getQRCode,
    getRandomAvatar
  };
}; 