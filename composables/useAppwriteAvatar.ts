/**
 * Appwrite 头像服务 Composable
 * 提供用户头像、图标和图片生成相关功能
 */
export const useAppwriteAvatar = () => {
  // 获取 Nuxt 应用实例以访问插件提供的服务
  const nuxtApp = useNuxtApp();
  const { $appwrite } = nuxtApp;
  
  // 如果插件未正确加载，显示错误
  if (!$appwrite) {
    console.error('Appwrite 插件未正确加载');
    throw new Error('Appwrite 插件未正确加载');
  }
  
  // 初始化头像服务
  // 由于类型定义问题，直接访问使用 any 类型绕过 TypeScript 检查
  const avatars = ($appwrite as any).avatars;
  
  /**
   * 获取自定义图片
   * @param url 图片URL
   * @param width 宽度（可选）
   * @param height 高度（可选）
   * @returns 处理后的图片URL
   */
  const getImage = (url: string, width?: number, height?: number) => {
    try {
      return avatars?.getImage ? avatars.getImage(url, width, height) : null;
    } catch (error) {
      console.error('获取图片失败', error);
      return null;
    }
  };
  
  /**
   * 获取网站favicon图标
   * @param url 网站URL
   * @returns favicon URL
   */
  const getFavicon = (url: string) => {
    try {
      return avatars?.getFavicon ? avatars.getFavicon(url) : null;
    } catch (error) {
      console.error('获取favicon失败', error);
      return null;
    }
  };
  
  /**
   * 获取用户首字母头像
   * @param name 用户名称（可选）
   * @param width 宽度（可选）
   * @param height 高度（可选）
   * @param background 背景颜色（可选）
   * @returns 头像URL
   */
  const getInitialsAvatar = (name?: string, width?: number, height?: number, background?: string) => {
    try {
      return avatars?.getInitials ? avatars.getInitials(name, width, height, background) : null;
    } catch (error) {
      console.error('获取首字母头像失败', error);
      return null;
    }
  };
  
  /**
   * 获取基于电子邮件的Gravatar头像
   * @param email 电子邮件
   * @param size 大小（可选）
   * @returns 头像URL
   */
  const getGravatarImage = (email: string, size?: number) => {
    try {
      return avatars?.getImage ? avatars.getImage('gravatar', email, size) : null;
    } catch (error) {
      console.error('获取Gravatar头像失败', error);
      return null;
    }
  };
  
  /**
   * 生成随机头像
   * @param code 唯一标识符
   * @param width 宽度（可选）
   * @param height 高度（可选）
   * @returns 头像URL
   */
  const getRandomAvatar = (code: string, width?: number, height?: number) => {
    try {
      // 可以选择不同的头像类型：adventurer, adventurer-neutral, avataaars, big-ears, big-ears-neutral, 
      // big-smile, bottts, croodles, croodles-neutral, identicon, initials, micah, miniavs, 
      // notionists, open-peeps, personas, pixel-art, pixel-art-neutral
      return avatars?.getImage ? avatars.getImage('initials', code, width, height) : null;
    } catch (error) {
      console.error('获取随机头像失败', error);
      return null;
    }
  };
  
  /**
   * 获取国旗图标
   * @param code 国家代码
   * @param width 宽度（可选）
   * @param height 高度（可选）
   * @param quality 图片质量（可选）
   * @returns 国旗URL
   */
  const getCountryFlag = (code: string, width?: number, height?: number, quality?: number) => {
    try {
      return avatars?.getFlag ? avatars.getFlag(code, width, height, quality) : null;
    } catch (error) {
      console.error('获取国旗图标失败', error);
      return null;
    }
  };
  
  /**
   * 获取浏览器图标
   * @param code 浏览器代码
   * @param width 宽度（可选）
   * @param height 高度（可选）
   * @param quality 图片质量（可选）
   * @returns 浏览器图标URL
   */
  const getBrowserIcon = (code: string, width?: number, height?: number, quality?: number) => {
    try {
      return avatars?.getBrowser ? avatars.getBrowser(code, width, height, quality) : null;
    } catch (error) {
      console.error('获取浏览器图标失败', error);
      return null;
    }
  };
  
  /**
   * 获取信用卡图标
   * @param code 信用卡代码
   * @param width 宽度（可选）
   * @param height 高度（可选）
   * @param quality 图片质量（可选）
   * @returns 信用卡图标URL
   */
  const getCreditCardIcon = (code: string, width?: number, height?: number, quality?: number) => {
    try {
      return avatars?.getCreditCard ? avatars.getCreditCard(code, width, height, quality) : null;
    } catch (error) {
      console.error('获取信用卡图标失败', error);
      return null;
    }
  };
  
  /**
   * 获取二维码
   * @param text 文本内容
   * @param size 大小（可选）
   * @param margin 边距（可选）
   * @param download 是否下载（可选）
   * @returns 二维码URL
   */
  const getQRCode = (text: string, size?: number, margin?: number, download?: boolean) => {
    try {
      return avatars?.getQR ? avatars.getQR(text, size, margin, download) : null;
    } catch (error) {
      console.error('获取二维码失败', error);
      return null;
    }
  };
  
  // 返回所有可用的方法
  return {
    getImage,
    getFavicon,
    getInitialsAvatar,
    getGravatarImage,
    getRandomAvatar,
    getCountryFlag,
    getBrowserIcon,
    getCreditCardIcon,
    getQRCode
  };
}; 