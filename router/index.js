import { createRouter, createWebHistory } from "vue-router";
import AuthPage from "@/pages/auth.vue";
import StartPage from "@/pages/start-page.vue";
import allTodos from "@/pages/all-todos.vue";
import usersList from "@/pages/users-list.vue";
import UserPage from "@/pages/user-page.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Авторизация",
      component: AuthPage,
    },
    {
      path: "/start",
      name: "Стартовая страница",
      component: StartPage,
      beforeEnter: (to, from, next) => {
        const loggedInUserId = localStorage.getItem("loggedInUserId");
        if (loggedInUserId) {
          next();
        } else {
          next("/");
        }
      },
    },
    {
      path: "/alltodos",
      name: "Все ТУДУ",
      component: allTodos,
      beforeEnter: (to, from, next) => {
        const loggedInUserId = localStorage.getItem("loggedInUserId");
        if (loggedInUserId) {
          next();
        } else {
          next("/");
        }
      },
    },
    {
      path: "/userlist",
      name: "Список пользователей",
      component: usersList,
      beforeEnter: (to, from, next) => {
        const loggedInUserId = localStorage.getItem("loggedInUserId");
        if (loggedInUserId) {
          next();
        } else {
          next("/");
        }
      },
    },
    {
      path: "/userpage/:id",
      name: "Страница пользователя",
      component: UserPage,
      beforeEnter: (to, from, next) => {
        const loggedInUserId = localStorage.getItem("loggedInUserId");
        if (loggedInUserId) {
          next();
        } else {
          next("/");
        }
      },
    },
  ],
});

export default router;
