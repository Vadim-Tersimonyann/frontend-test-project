<template>
  <div class="users-list">
    <navigation-block />

    <div>
      <h1 class="users-list__title">Список пользователей</h1>
      <div
        @click="router.replace({ path: `/userpage/${element.id}` })"
        class="users-list__wrapper"
        v-for="(element, index) in user"
        :key="index"
      >
        <div class="users-list__item">{{ element.id }}</div>
        <div class="users-list__item">
          {{ element.name }} {{ element.surname }}
        </div>
        <div class="users-list__item">{{ element.email }}</div>
        <div class="users-list__item">{{ element.tel }}</div>
      </div>
    </div>
    <app-footer />
  </div>
</template>
<script setup>
import navigationBlock from "../../blocks/navigation-block.vue";
import appFooter from "../../blocks/app-footer.vue";
import user from "@/user";
import router from "../../router";
</script>
<style lang="scss">
.users-list {
  background: linear-gradient(135deg, #b8d7ab, #f0e68c);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__title {
    display: flex;
    justify-content: center;
  }

  &__wrapper {
    display: flex;
    height: auto;
    margin: 30px;
    border: 1px solid #000000;
    border-radius: 10px;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #3b795c5e;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #3b795c;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      padding: 10px;
    }
  }

  &__item {
    padding: 10px;
    font-size: 23px;

    @media (max-width: 768px) {
      font-size: 16px;
      padding: 5px;
    }
  }

  @media (max-width: 768px) {
    .users-list__wrapper {
      flex-direction: column;
      align-items: flex-start;
      padding: 10px;
    }

    .users-list__item {
      font-size: 16px;
      padding: 5px;
    }
  }

  @media (max-width: 480px) {
    .users-list__item {
      font-size: 14px;
      padding: 3px;
    }
  }
}
</style>
