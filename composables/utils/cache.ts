interface CacheOptions {
  ttl?: number; // 过期时间（毫秒）
  staleWhileRevalidate?: boolean; // 过期后是否返回旧数据
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

/**
 * 缓存工具composable
 * 提供请求数据缓存功能
 */
export const useCache = () => {
  const cache = reactive(new Map<string, CacheItem<any>>());
  
  /**
   * 获取缓存数据
   * @param key 缓存键
   * @param fetcher 数据获取函数
   * @param options 缓存选项
   * @returns 缓存或新获取的数据
   */
  const getWithCache = async <T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> => {
    const { ttl = 5 * 60 * 1000, staleWhileRevalidate = false } = options;
    const now = Date.now();
    
    // 检查缓存是否存在且未过期
    if (cache.has(key)) {
      const cached = cache.get(key)!;
      const isExpired = now - cached.timestamp > ttl;
      
      if (!isExpired) {
        return cached.data as T;
      }
      
      // 过期但配置了staleWhileRevalidate选项
      if (staleWhileRevalidate) {
        // 异步更新缓存
        fetcher().then(newData => {
          cache.set(key, { data: newData, timestamp: now });
        });
        
        // 返回过期数据
        return cached.data as T;
      }
    }
    
    // 缓存不存在或过期且不使用staleWhileRevalidate
    const data = await fetcher();
    cache.set(key, { data, timestamp: now });
    return data;
  };
  
  /**
   * 使特定缓存失效
   * @param key 缓存键
   */
  const invalidate = (key: string): void => {
    cache.delete(key);
  };
  
  /**
   * 使用前缀匹配使多个缓存失效
   * @param prefix 缓存键前缀
   */
  const invalidateByPrefix = (prefix: string): number => {
    let count = 0;
    
    for (const key of cache.keys()) {
      if (key.startsWith(prefix)) {
        cache.delete(key);
        count++;
      }
    }
    
    return count;
  };
  
  /**
   * 清除所有缓存
   */
  const clear = (): void => {
    cache.clear();
  };
  
  return {
    getWithCache,
    invalidate,
    invalidateByPrefix,
    clear
  };
}; 