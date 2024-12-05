<template>
  <button class="button">
    <slot />
  </button>
</template>
<script setup></script>
<style lang="scss" scoped>
.button {
  cursor: pointer;
  background-color: #fff;
  border: none;
  border-radius: 10px;
  background-color: #146c43;
  width: 100px;
  height: 30px;
  color: #fff;
}
</style>
