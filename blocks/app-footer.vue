<template>
  <div class="app-footer">
    <div class="app-footer__wrapper">
      <span class="app-footer__text"
        >Обретите спокойствие и ясность с помощью нашего нового приложения,
        которое поможет вам записывать свои дела и всегда держать их на
        карандаше</span
      >
    </div>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.app-footer {
  &__wrapper {
    padding: 20px;
    background: radial-gradient(circle, #2c6b2f, #82c91e);
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    @media (max-width: 768px) {
      padding: 15px;
    }
    @media (max-width: 480px) {
      padding: 10px;
    }
  }

  &__text {
    color: white;
    font-size: 19px;
    line-height: 1.5;
    max-width: 800px;
    word-wrap: break-word;
    padding: 0 10px;

    @media (max-width: 768px) {
      font-size: 15px;
    }

    @media (max-width: 480px) {
      font-size: 14px;
    }
  }
}
</style>
