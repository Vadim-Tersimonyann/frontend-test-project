<template>
  <div class="main-page__wrapper">
    <div class="todo" v-for="(todo, index) in todos" :key="index">
      <div class="todo__wrapper">
        <span class="todo__text">{{ index + 1 }}. {{ todo.text }}</span>
        <div class="control-wrapper">
          <div class="form-check">
            <input
              type="checkbox"
              :checked="todo.completed"
              class="todo-checkbox"
              @change="handleCheckboxChange(todo)"
            />
          </div>
          <button
            type="button"
            class="btn btn-outline-success"
            @click="$emit('deleteTodo', index)"
          >
            Удалить
          </button>
          <button
            type="button"
            class="btn btn-outline-success"
            @click="$emit('editTodo', todo, index)"
          >
            Редактировать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";

const handleCheckboxChange = (todo) => {
  todo.completed = !todo.completed;
  localStorage.setItem("todos", JSON.stringify(props.todos));
};

const props = defineProps({
  todos: Array,
});
const emit = defineEmits(["deleteTodo", "editTodo", "todo-completed"]);
</script>
