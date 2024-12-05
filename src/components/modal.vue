<template>
  <div class="modal" tabindex="-1" v-if="isVisible">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Создание задачи</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <input
            class="modal__input"
            v-model="inputText"
            placeholder="Сходить в магазин..."
            @keyup.enter="addTodo"
          />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            Закрыть
          </button>
          <button type="button" class="btn btn-primary" @click="addTodo">
            Добавить дело
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, defineEmits, defineProps } from "vue";

defineProps({
  isVisible: Boolean,
  todos: Array,
});
const emit = defineEmits(["close", "addTodo"]);

const closeModal = () => {
  emit("close");
};

const todos = ref([]);
const addTodo = () => {
  emit("addTodo", inputText.value);

  todos.value.push(inputText.value);
  inputText.value = "";
  closeModal();
};
const inputText = ref("");
</script>
<style scoped lang="scss">
.modal {
  display: block;
  align-content: center;
  justify-content: center;
  background-color: #146c43dd;
  &__input {
    width: 100%;
    height: 40px;
    border: 1px solid #146c43;
    border-radius: 10px;
  }
}
</style>
