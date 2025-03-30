<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
html, body {
  overflow-x: hidden;
  position: relative;
  width: 100%;
}

/* 布局过渡动画 */
.layout-enter-active,
.layout-leave-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(12px);
  transform: scale(0.95);
}

/* 统一页面过渡动画 */
.page-enter-active,
.home-page-enter-active,
.about-page-enter-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  overflow-x: hidden;
}

.page-leave-active,
.home-page-leave-active,
.about-page-leave-active {
  transition: all 0.5s cubic-bezier(0.6, 0.04, 0.98, 0.335);
  overflow-x: hidden;
}

.page-enter-from,
.home-page-enter-from,
.about-page-enter-from {
  opacity: 0;
  filter: blur(12px);
  transform: scale(0.95);
}

.page-leave-to,
.home-page-leave-to,
.about-page-leave-to {
  opacity: 0;
  filter: blur(8px);
  transform: scale(1.05);
}
</style>
