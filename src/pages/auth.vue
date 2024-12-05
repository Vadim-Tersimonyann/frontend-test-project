<template>
<div class="auth-page">
  <div class="auth-page__wrapper">
    <span class="auth-page__title">Авторизация</span>
    <span>Логин</span>
    <input
      class="auth-page__input"
      placeholder="qwerty"
      v-model="UserLogin"
      @keyup.enter="loginFunc">
    </input>
    <span>Пароль</span>
    <input
      class="auth-page__input"
      placeholder="12345"
      v-model="UserPassword"
      @keyup.enter="loginFunc">
    </input>
    <span
      class="auth-page__error"
      v-if="err">Неверный логин или парол
    </span>
    <UiButton @click="loginFunc()">
      Войти
    </UiButton>
  </div>
</div>
</template>
<script setup>
import UiButton from '@/components/ui/ui-button.vue';
import { ref } from 'vue';
import router from '../../router';
import usersInfo from '@/user';
const UserPassword = ref('')
const UserLogin = ref('')
const err = ref(false)
const loginFunc = () => {
  const user = usersInfo.value.find(u => u.login === UserLogin.value && u.password === UserPassword.value);

  if (user) {
    user.isLoggedIn = true;
    localStorage.setItem('loggedInUserId', user.id);
    router.replace({ path: '/start' });
  } else {
    err.value = true;
  }
};
</script>
<style lang="scss" scoped>
.auth-page {
  background: linear-gradient(135deg, #b8d7ab, #f0e68c);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  &__title {
    margin-bottom: 20px;
    font-size: 30px;
  }
  &__input {
    margin-top: 5px;
    border-radius: 5px;
    border: none;
  }
  &__error {
    color: #ff0000;

  }
}
</style>
