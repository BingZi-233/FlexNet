declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@vueuse/core' {
  export function useStorage<T>(key: string, initialValue: T): Ref<T>
  export function useBreakpoints<T extends Record<string, number>>(breakpoints: T): {
    smaller: (key: keyof T) => Ref<boolean>
    greater: (key: keyof T) => Ref<boolean>
    between: (min: keyof T, max: keyof T) => Ref<boolean>
    isSmaller: (key: keyof T) => boolean
    isGreater: (key: keyof T) => boolean
    isBetween: (min: keyof T, max: keyof T) => boolean
  }
} 