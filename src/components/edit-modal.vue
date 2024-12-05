<template>
  <div class="modal" tabindex="-1" v-if="isVisible">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Редактирование дела</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <input class="modal__input" v-model="inputText" @keyup.enter="handleEdit"/>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            Отмена
          </button>
          <button type="button" class="btn btn-primary" @click="handleEdit">
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, defineEmits, defineProps, watch } from "vue";

const props = defineProps({
  isVisible: Boolean,
  todos: Array,
  editIndex: Number,
  inputText: String,
});
const emit = defineEmits(["close", "editTodo"]);

const inputText = ref("");

watch(
  () => props.inputText,
  (newText) => {
    inputText.value = newText;
  }
);

const closeModal = () => {
  emit("close");
};

const handleEdit = () => {
  emit("editTodo", {
    id: props.editIndex,
    text: inputText.value,
  });
};
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
