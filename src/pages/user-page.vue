<template>
  <div class="user-page">
    <navigationBlock />
    <div class="user-page__wrapper">
      <h1>{{ userList.name }} {{ userList.surname }}</h1>
      <div class="user-page__info">
        <span
          v-if="
            !isEditingAddress && currentUser && currentUser.id === userList.id
          "
          @dblclick="editAddress"
        >
          {{ "Юридический адрес" }}: {{ userList.address }}
          <button
            type="button"
            class="user-page__button btn btn-success"
            @click="editAddress"
          >
            Редактировать
          </button>
        </span>
        <input
          v-else-if="
            tempAddress && currentUser && currentUser.id === userList.id
          "
          type="text"
          v-model="tempAddress"
          @blur="saveAddress"
          @keyup.enter="saveAddress"
        />
        <span v-else>{{ "Юридический адрес" }}: {{ userList.address }}</span>
        <button
          type="button"
          class="user-page__button btn btn-success"
          v-if="isEditingAddress"
          @click="saveAddress"
        >
          Сохранить
        </button>
      </div>

      <div class="user-page__info">
        <span
          v-if="
            !isEditingWebsite && currentUser && currentUser.id === userList.id
          "
          @dblclick="editWebsite"
        >
          {{ "Вебсайт" }}: {{ userList.website }}
          <button
            type="button"
            class="user-page__button btn btn-success"
            @click="editWebsite"
          >
            Редактировать
          </button>
        </span>

        <input
          v-else-if="
            tempWebsite && currentUser && currentUser.id === userList.id
          "
          type="text"
          v-model="tempWebsite"
          @blur="saveWebsite"
          @keyup.enter="saveWebsite"
        />
        <span v-else>{{ "Вебсайт" }}: {{ userList.website }}</span>
        <button
          type="button"
          class="user-page__button btn btn-success"
          v-if="isEditingWebsite"
          @click="saveWebsite"
        >
          Сохранить
        </button>
      </div>

      <div class="user-page__info">
        <span
          v-if="
            !isEditingCompany && currentUser && currentUser.id === userList.id
          "
          @dblclick="editCompany"
        >
          {{ "Название компании" }}: {{ userList.company }}
          <button
            type="button"
            class="user-page__button btn btn-success"
            @click="editCompany"
          >
            Редактировать
          </button>
        </span>
        <input
          v-else-if="
            tempCompany && currentUser && currentUser.id === userList.id
          "
          type="text"
          v-model="tempCompany"
          @blur="saveCompany"
          @keyup.enter="saveCompany"
        />
        <span v-else>{{ "Название компании" }}: {{ userList.company }}</span>
        <button
          type="button"
          class="user-page__button btn btn-success"
          v-if="isEditingCompany"
          @click="saveCompany"
        >
          Сохранить
        </button>
      </div>
    </div>
    <div id="map" class="user-page__map"></div>
    <appFooter />
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";
import L from "leaflet";
import { onMounted, ref } from "vue";
import "leaflet/dist/leaflet.css";
import navigationBlock from "../../blocks/navigation-block.vue";
import appFooter from "../../blocks/app-footer.vue";
import user from "@/user";

const isEditingAddress = ref(false);
const isEditingWebsite = ref(false);
const isEditingCompany = ref(false);
const tempAddress = ref("");
const tempWebsite = ref("");
const tempCompany = ref("");
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

const updateTodos = () => {};

const editAddress = () => {
  isEditingAddress.value = true;
  tempAddress.value = userList.address;
};

const saveAddress = () => {
  userList.address = tempAddress.value;
  isEditingAddress.value = false;
  updateTodos();
};

const editWebsite = () => {
  isEditingWebsite.value = true;
  tempWebsite.value = userList.website;
};

const saveWebsite = () => {
  userList.website = tempWebsite.value;
  isEditingWebsite.value = false;
  updateUserList();
};

const editCompany = () => {
  isEditingCompany.value = true;
  tempCompany.value = userList.company;
};

const saveCompany = () => {
  userList.company = tempCompany.value;
  isEditingCompany.value = false;
  updateUserList();
};

const route = useRoute();
const userId = parseInt(route.params.id);
const userList = user.value.find((e) => e.id === userId);
onMounted(() => {
  if (userList.latitude && userList.longitude) {
    const map = L.map("map").setView(
      [userList.latitude, userList.longitude],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([userList.latitude, userList.longitude])
      .addTo(map)
      .bindPopup(`${userList.name} ${userList.surname}`)
      .openPopup();
  }
});
</script>
<style lang="scss">
.user-page {
  background: linear-gradient(135deg, #b8d7ab, #f0e68c);
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    background-color: #3b795c5e;
  }
  &__info {
    font-size: 20px;
  }
  &__map {
    width: 100wh;
    height: 300px;
    margin: 50px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  &__input {
    display: flex;
  }
  &__button {
    margin-left: 10px;
    margin-bottom: 2px;
    background-color: #3b795c5e;
  }
}
</style>
