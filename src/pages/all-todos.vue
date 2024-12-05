<template>
  <div class="all-todos">
    <navigationBlock />
    <modal
      class="modal"
      :is-visible="openWindow"
      @close="handleClose"
      @addTodo="addTodoToList"
      :todos="filteredTodos"
    ></modal>
    <edit-modal
      class="modal"
      :is-visible="editWindow"
      @close="closeEditModal"
      @editTodo="editTodo"
      :todos="todos"
      :editIndex="editTodoIndex"
      :inputText="inputText"
    >
    </edit-modal>
    <div class="filters">
      <div>
        <input
          type="text"
          class="filter filter__id"
          v-model="queryId"
          placeholder="Поиск по ID"
          @input="validateIdInput"
          :class="{ 'is-invalid': isIdInvalid }"
        />
        <div v-if="isIdInvalid" class="invalid-feedback">
          Максимальная длина — 3 символа
        </div>
      </div>
      <div class="text-wrapper">
        <input
          type="text"
          class="filter filters__text"
          v-model="queryText"
          placeholder="Поиск по тексту"
          @input="validateText"
          :class="{ 'is-invalid': isTextInvalid }"
        />
        <div v-if="isTextInvalid" class="invalid-feedback">
          Максимальная длина — 100 символов
        </div>
      </div>
      <select v-model="searchStatus" class="filter">
        <option value="">Все</option>
        <option value="completed">Завершено</option>
        <option value="in-progress">В процессе</option>
      </select>

      <select v-model="searchUser" class="filter filter-user">
        <option value="">Все пользователи</option>
        <option v-for="users in user" :key="users.id" :value="users.id">
          {{ users.name }} {{ users.surname }}
        </option>
      </select>
      <button @click="applyFilters" class="filter__button">Поиск</button>
    </div>
    <div class="sort">
      Сортировка:
      <span @click="sortByStatus" class="sort__item"
        >По статусу выполнения</span
      >
      <span @click="sortByUserName" class="sort__item">По пользователю</span>
      <span @click="sortByText" class="sort__item">По тексту</span>
    </div>
    <div class="main-page__wrapper">
      <div v-if="filteredTodos.length === 0" class="no-results">
        Ничего не найдено
      </div>
      <div class="todo-header"></div>
      <div class="todo" v-for="(todo, index) in paginatedTodos" :key="index">
        <div class="todo__wrapper">
          <span class="todo__text"
            >{{ (currentPage - 1) * rowsPerPage + index + 1 }}.
            {{ todo.text }}</span
          >
          <div class="control-wrapper">
            <input
              v-if="currentUser && currentUser.id === todo.userId"
              type="checkbox"
              :checked="todo.completed"
              @change="toggleTodoStatus(todo)"
              class="todo-checkbox"
            />
            <button
              v-if="currentUser && currentUser.id === todo.userId"
              type="button"
              class="btn btn-outline-success"
              @click="deleteTodo(todo)"
            >
              Удалить
            </button>
            <button
              v-if="currentUser && currentUser.id === todo.userId"
              type="button"
              class="btn btn-outline-success"
              @click="openEditModal(todo)"
            >
              Редактировать
            </button>
            <div
              class="control-name"
              style="cursor: pointer"
              @click="router.push({ path: `/userpage/${todo.userId}` })"
            >
              {{ todo.name }} {{ todo.surname }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="records-info">Всего записей: {{ filteredTodos.length }}</div>
    <button type="button" class="btn add-button btn-success" @click="openModal">
      Добавить дело
    </button>
    <div class="pagination-controls">
      <label>
        Записей на странице:
        <select v-model="rowsPerPage">
          <option
            v-for="option in [5, 10, 20, 25]"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </label>
      <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="page-button"
      >
        Назад
      </button>
      <span>Страница {{ currentPage }} из {{ totalPages }}</span>
      <button
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
        class="page-button"
      >
        Вперед
      </button>
    </div>
    <div class="alert-wrapper">
      <div class="alert alert-success" role="alert" v-show="alert">
        Запись с Id {{ deletedTodo + 1 }} удалена
      </div>
      <div v-if="isLoading" class="loader-overlay">
        <div class="spinner"></div>
      </div>
    </div>
    <appFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import appFooter from "../../blocks/app-footer.vue";
import navigationBlock from "../../blocks/navigation-block.vue";
import modal from "@/components/modal.vue";
import editModal from "@/components/edit-modal.vue";
import router from "../../router";
import user from "@/user";

const openWindow = ref(false);
const editWindow = ref(false);
const todos = ref(JSON.parse(localStorage.getItem("todos")) || []);
const filteredTodos = ref([...todos.value]);
const editTodoIndex = ref(null);
const alert = ref(false);
const deletedTodo = ref(null);
const isLoading = ref(false);
const currentUser = ref(null);
const inputText = ref("");
const queryId = ref("");
const queryText = ref("");
const searchStatus = ref("");
const searchUser = ref("");
const isIdInvalid = ref(false);
const isTextInvalid = ref(false);
const currentPage = ref(1);
const rowsPerPage = ref(10);

const toggleTodoStatus = (todo) => {
  const index = todos.value.findIndex((t) => t.id === todo.id);
  if (index !== -1) {
    todos.value[index].completed = !todos.value[index].completed;
    localStorage.setItem("todos", JSON.stringify(todos.value));
    if (searchStatus.value) {
      applyFilters();
    }
  }
};

const sortByStatus = () => {
  filteredTodos.value = filteredTodos.value.slice().sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });
};

const sortByUserName = () => {
  filteredTodos.value = filteredTodos.value.slice().sort((a, b) => {
    const nameA = `${a.name} ${a.surname}`.toLowerCase();
    const nameB = `${b.name} ${b.surname}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });
};

const sortByText = () => {
  filteredTodos.value = filteredTodos.value.slice().sort((a, b) => {
    return a.text.toLowerCase().localeCompare(b.text.toLowerCase());
  });
};

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

const totalPages = computed(() =>
  Math.ceil(filteredTodos.value.length / rowsPerPage.value)
);

const paginatedTodos = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return filteredTodos.value.slice(start, end);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const validateIdInput = (event) => {
  const value = event.target.value.replace(/\D/g, "");
  if (value.length > 3) {
    isIdInvalid.value = true;
    queryId.value = value.slice(0, 3);
  } else {
    isIdInvalid.value = false;
    queryId.value = value;
  }
};

const validateText = () => {
  isTextInvalid.value = queryText.value.length > 100;
  if (isTextInvalid.value) {
    queryText.value = queryText.value.slice(0, 100);
  }
};

const applyFilters = () => {
  filteredTodos.value = todos.value.filter((item) => {
    let isMatch = true;
    if (queryId.value) {
      isMatch = isMatch && item.userId.toString().includes(queryId.value);
    }
    if (queryText.value) {
      const searchText = queryText.value.toLowerCase();
      isMatch = isMatch && item.text.toLowerCase().includes(searchText);
    }
    if (searchStatus.value) {
      isMatch =
        isMatch &&
        ((searchStatus.value === "completed" && item.completed) ||
          (searchStatus.value === "in-progress" && !item.completed));
    }
    if (searchUser.value) {
      isMatch = isMatch && item.userId === parseInt(searchUser.value);
    }
    return isMatch;
  });
  currentPage.value = 1;
};

const openModal = () => {
  openWindow.value = true;
};

const handleClose = () => {
  openWindow.value = false;
};
const openEditModal = (todo) => {
  editWindow.value = true;
  editTodoIndex.value = todo.id;
  inputText.value = todo.text;
};

const closeEditModal = () => {
  editWindow.value = false;
  inputText.value = "";
  editTodoIndex.value = null;
};

const addTodoToList = (newTodoText) => {
  const todoWithUser = {
    id: todos.value.length ? todos.value[todos.value.length - 1].id + 1 : 1,
    text: newTodoText,
    userId: currentUser.value.id,
    name: currentUser.value.name,
    surname: currentUser.value.surname,
  };
  todos.value.push(todoWithUser);
  localStorage.setItem("todos", JSON.stringify(todos.value));
  applyFilters();
};

const updateTodos = () => {
  localStorage.setItem("todos", JSON.stringify(todos.value));
};

const editTodo = (updatedTodo) => {
  const index = todos.value.findIndex((todo) => todo.id === updatedTodo.id);
  if (index !== -1) {
    console.log("Updating Todo:", updatedTodo);
    todos.value[index].text = updatedTodo.text;
    localStorage.setItem("todos", JSON.stringify(todos.value));
    applyFilters();
  }
  closeEditModal();
};

const deleteTodo = (todo) => {
  isLoading.value = true;
  const index = todos.value.findIndex((t) => t.id === todo.id);
  if (index !== -1) {
    todos.value.splice(index, 1);
    applyFilters();
    deletedTodo.value = todo.id;
    updateTodos();
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
        isLoading.value = false;
        alert.value = !alert.value;
        setTimeout(() => {
          alert.value = false;
        }, 2000);
      }, 1000);
    });
  }
};
</script>
<style lang="scss">
.all-todos {
  background: linear-gradient(135deg, #b8d7ab, #f0e68c);
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.sort {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  font-size: 19px;
  margin-top: 10px;

  &__item {
    border: 1px dotted #3b795c5e;
    border-radius: 10px;
    padding: 5px;
    cursor: pointer;
  }
}

.page-button {
  border: 1px solid #000;
  border-radius: 20px;
  background-color: #3b795c5e;
}

.pagination-controls {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.no-results {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}

.control-name {
  font-size: 18px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top: 5px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.todo-checkbox {
  margin-left: 10px;
  transform: scale(1.2);
  cursor: pointer;
}

.records-info {
  margin-left: 20px;
}

.filters {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  color: #616161;
  margin: 20px 20px 0;

  &__text {
    width: 100%;
    color: #616161;
  }
  &__id {
    width: 100%;
    color: #616161;
  }

  .filter {
    border: 2px solid #3b795c5e;
    border-radius: 10px;
    color: #616161;
    outline: none;
    background-color: transparent;

    &__button {
      border: 2px solid #3b795c5e;
      border-radius: 10px;
      width: 110px;
      color: #616161;
      background-color: transparent;
    }
  }

  .text-wrapper {
    width: 100%;
  }

  .is-invalid {
    border-color: red;
  }

  .invalid-feedback {
    position: absolute;
  }
}

.pagination-controls {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter,
  .filter__button {
    width: 100%;
    margin-bottom: 10px;
  }

  .sort {
    flex-direction: column;
    font-size: 16px;
    gap: 10px;
  }

  .pagination-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .todo__wrapper {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 15px;
  }

  .todo-checkbox {
    margin-left: 0;
  }

  .page-button {
    width: 100%;
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .all-todos {
    padding: 10px;
  }

  .todo__wrapper {
    padding: 10px;
  }

  .filters {
    margin-top: 15px;
  }

  .pagination-controls {
    margin-bottom: 15px;
  }

  .no-results {
    font-size: 18px;
  }
}
</style>
.filters { display: flex; justify-content: center; margin-top: 20px; &__text {
width: 100%; } &__id { width: 100%; } } .filter { border: 2px solid #3b795c5e;
border-radius: 10px; outline: none; background-color: transparent; &__button {
border: 2px solid #3b795c5e; border-radius: 10px; width: 110px; } }
