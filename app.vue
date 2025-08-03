<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { useAuth } from "@/composables/useAuth";

const userStore = useUserStore();
const { logout } = useAuth();

onMounted(() => {
  const accessToken = localStorage.getItem("access_token");
  const username = localStorage.getItem("username");

  if (accessToken && username) {
    userStore.setUser({ username: "user1", email: "", id: null});
    userStore.setToken(accessToken);
  } else {
    logout(); // очищаем store и localStorage, перенаправляем на логин
  }
});
</script>
