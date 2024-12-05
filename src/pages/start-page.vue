<template>
  <div class="start-page">
    <modal
      class="modal"
      :is-visible="openWindow"
      @close="handleClose"
      @addTodo="addTodoToList"
      :todos="todos"
    ></modal>
    <edit-modal
      class="modal"
      :is-visible="editWindow"
      @close="closeEditModal"
      @editTodo="editTodo"
      :todos="todos"
      :inputText="inputText"
      :editIndex="editTodoIndex"
    >
    </edit-modal>
    <navigation-block />
    <div v-if="filteredTodos.length === 0" class="no-todos">
      <h1>Создайте свое первое дело!</h1>
    </div>
    <UItable
      :todos="filteredTodos"
      @delete-todo="deleteTodo"
      @editTodo="openEditModal"
      @todo-completed="todoCompleted"
    ></UItable>
    <button type="button" class="btn add-button btn-success" @click="openModal">
      Добавить дело
    </button>
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
import { ref, computed, onMounted } from "vue";
import appFooter from "../../blocks/app-footer.vue";
import modal from "@/components/modal.vue";
import editModal from "@/components/edit-modal.vue";
import navigationBlock from "../../blocks/navigation-block.vue";
import UItable from "@/components/ui/table.vue";
import user from "@/user";
const openWindow = ref(false);
const editWindow = ref(false);
const todos = ref(JSON.parse(localStorage.getItem("todos")) || []);
const editTodoIndex = ref(null);
const alert = ref(false);
const deletedTodo = ref(null);
const isLoading = ref(false);
const currentUser = ref(null);
const inputText = ref("");

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

const updateTodos = () => {
  localStorage.setItem("todos", JSON.stringify(todos.value));
};

const addTodoToList = (newTodoText) => {
  let todoWithUser = {
    id: todos.value.length ? todos.value[todos.value.length - 1].id + 1 : 1,
    text: newTodoText,
    userId: currentUser.value.id,
    name: currentUser.value.name,
    surname: currentUser.value.surname,
  };
  todos.value.push(todoWithUser);
  updateTodos();
};

const todoCompleted = (todo) => {
  const targetTodo = todos.value.find((t) => t === todo);
  if (targetTodo) {
    targetTodo.completed = !targetTodo.completed;
    updateTodos();
  }
};

const filteredTodos = computed(() => {
  if (!currentUser.value) return [];
  return todos.value.filter((todo) => todo.userId === currentUser.value.id);
});

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

const editTodo = (updatedTodo) => {
  const index = todos.value.findIndex((todo) => todo.id === updatedTodo.id);
  if (index !== -1) {
    console.log("Updating Todo:", updatedTodo);
    todos.value[index].text = updatedTodo.text;
    localStorage.setItem("todos", JSON.stringify(todos.value));
  }
  closeEditModal();
};

const closeEditModal = () => {
  editWindow.value = false;
  editTodoIndex.value = null;
};

const deleteTodo = (index) => {
  isLoading.value = true;
  todos.value.splice(index, 1);
  deletedTodo.value = index;
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(updateTodos());
      isLoading.value = false;
      alert.value = !alert.value;
      setTimeout(() => {
        alert.value = false;
      }, 2000);
    }, 1000);
  });
};
</script>
<style lang="scss">
.start-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(135deg, #b8d7ab, #f0e68c);
}

.no-todos {
  display: flex;
  justify-content: center;
  text-align: center;
}

.control-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
}
.navbar {
  &__logo {
    width: 100px;
    height: 50px;
  }
}
.navbar-nav {
  display: flex;
  justify-content: space-around;
  width: 100%;
}
.todo {
  margin-bottom: 10px;
  padding: 10px;

  border-radius: 10px;
  &__wrapper {
    background-color: #3b795c5e;

    padding: 10px;
    display: flex;
    justify-content: space-between;
    padding: 20px;
    border-radius: 10px;
    align-items: center;
  }
  &__number {
    padding: 5px;
    border: 1px solid #2f2424;
    border-radius: 10px;
  }
  &__text {
    font-size: 20px;
  }
}
.alert-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.alert {
  position: absolute;
  top: 50vh;
}
.add-button {
  margin: 40px;
  display: flex;
  justify-content: center;
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

.btn {
  font-size: 19px;
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
</style>
