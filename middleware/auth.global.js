import { useUserStore } from "@/stores/user";

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();

  const publicPages = ["/login", "/signup"];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !userStore.username) {
    return navigateTo("/login");
  }
});
