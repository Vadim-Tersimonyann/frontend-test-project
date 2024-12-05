<template>
  <div class="nav-menu">
    <nav class="nav flex-column">
      <a class="nav-link" aria-current="page" href="/start">Главная</a>
      <a class="nav-link" href="/alltodos">Все TODO</a>
      <a class="nav-link" href="/userlist">Список пользователей</a>
      <a v-if="currentUser" class="nav-link" @click.prevent="goToUserPage(currentUser.id)">
        {{ currentUser.name }} {{ currentUser.surname }}
      </a>
    </nav>
    <button class="btn btn-outline-success" type="submit" @click="logout">Выход</button>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import router from '../router';
import user from '@/user';
const currentUser = ref(null);
const getCurrentUser = () => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (loggedInUserId) {
    const userId = parseInt(loggedInUserId);
    const userData = user.value.find((u) => u.id === userId);
    if (userData) {
      currentUser.value = userData;
    }
  }
};
onMounted(() => {
  getCurrentUser();
});

const goToUserPage = (userId) => {
  router.push(`/userpage/${userId}`);
};
const emit = defineEmits(['logout'])
const logout = () => {
  emit('logout')
}
</script>
<style lang="scss" scoped>
.nav-menu {
  display: flex;
  flex-direction: column;
}
.nav-link {
  font-size: 20px;
  color: black;
  cursor: pointer;
  border: 1px solid #000;
  border-radius: 20px;
  width: 100%;


}
.btn {
  font-size: 20px;
  padding: 10px;
  margin: 10px;
}

.nav {
  gap: 20px;
  margin: 0 10px;

}
</style>
