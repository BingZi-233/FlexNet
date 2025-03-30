/**
 * Payload Reducer 插件
 * 为Appwrite回调函数和复杂对象定义自定义序列化/反序列化处理
 * 处理"Cannot stringify a function"错误
 */
export default definePayloadPlugin((nuxtApp) => {
  // 处理回调函数
  definePayloadReducer('AppwriteCallback', (value) => {
    // 检查是否是回调函数，如果是则返回占位符
    if (typeof value === 'function') {
      return { __type: 'AppwriteCallback' };
    }
  });

  // 恢复回调函数（使用空函数）
  definePayloadReviver('AppwriteCallback', () => {
    // 返回一个空函数作为替代
    return () => console.warn('此函数是通过reviver恢复的占位函数，原始函数无法序列化');
  });

  // 处理OAuth对象
  definePayloadReducer('OAuthProvider', (value) => {
    // 检查是否是OAuth提供商对象
    if (value && typeof value === 'object' && value.constructor && value.constructor.name === 'OAuthProvider') {
      return { __type: 'OAuthProvider', value: String(value) };
    }
  });

  // 恢复OAuth对象
  definePayloadReviver('OAuthProvider', (value) => {
    // 从占位符恢复为字符串
    return value.value;
  });
}); 