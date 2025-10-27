<template>
  <div class="wrapper">
    <div class="error-page">
      <h1>Ошибка {{ error.statusCode }}</h1>
      <p>{{ error.message }}</p>
      <NuxtLink to="/" class="btn">Вернуться на главную</NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  error: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100vh;
  margin: 0 auto;
  position: relative;
  background-color: #181818;
}
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: #181818;
  gap: 30px;
  padding-top: 400px;
}
h1 {
  font-size: 50px;
}
p {
  font-size: 30px;
}
.btn {
  margin-top: 2rem;
  background-color: #5c2e91; /* фиолетовый */
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;
  user-select: none;
}

.btn:hover {
  background-color: #7e49b8;
}
</style>
