<template>
  <div class="navigation">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <button
          v-if="logo"
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Переключатель навигации"
          @click="openNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
          <img
            src="/public/logo.webp"
            class="navbar__logo"
            @click="goToMainMenu"
          />
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="/start">Главная</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/alltodos">Все TODO</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/userlist">Список пользователей</a>
            </li>
            <li class="nav-item" v-if="currentUser">
              <a class="nav-link" @click="goToUserPage(currentUser.id)"
                >{{ currentUser.name }} {{ currentUser.surname }}</a
              >
            </li>
          </ul>
          <button class="btn btn-outline-success" @click="logout">Выход</button>
        </div>
      </div>
    </nav>
  </div>
  <navMenu v-if="navigationMenu" @logout="logout" />
</template>
<script setup>
import { ref, onMounted } from "vue";
import router from "../router";
import user from "@/user";
import navMenu from "./nav-menu.vue";

const logo = ref(true);
const navigationMenu = ref(false);
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

const logout = () => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (loggedInUserId) {
    const userId = parseInt(loggedInUserId);
    const loggedUser = user.value.find((u) => u.id === userId);
    if (loggedUser) {
      loggedUser.isLoggedIn = false;
    }
  }
  localStorage.removeItem("loggedInUserId");
  router.push("/");
};
const goToUserPage = (userId) => {
  router.push(`/userpage/${userId}`);
};

const goToMainMenu = () => {
  router.push("/start");
};

const openNav = () => {
  navigationMenu.value = !navigationMenu.value;
};
</script>
<style lang="scss" scoped>
.nav-item {
  border: 1px dotted #b2aaaa;
  border-radius: 20px;
  padding: 0 40px;
}

.btn {
  font-size: 19px;
  border-radius: 20px;
}

.navbar-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.nav-link {
  cursor: pointer;
  color: #1a4316;
  font-size: 20px;
  align-items: center;
}
.navbar__logo {
  cursor: pointer;
}

.nav-item {
  border: 1px dotted #b2aaaa;
  border-radius: 20px;
  padding: 0 40px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.nav-item:hover {
  background-color: #3b795c5e;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.nav-link {
  cursor: pointer;
  color: #1a4316;
  font-size: 20px;
  align-items: center;
  transition: color 0.3s ease, text-decoration 0.3s ease;
}

.nav-link:hover {
  color: #65a30d;
  text-decoration: underline;
}
</style>
