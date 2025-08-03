<template>
  <div class="wrapper">
    <div class="container-auth">
      <div class="modal__block">
        <form class="modal__form-login" @submit.prevent="handleSubmit">
          <NuxtLink to="/">
            <div class="modal__logo">
              <img src="/img/logo_modal.png" alt="logo" />
            </div>
          </NuxtLink>

          <input
            v-model="email"
            class="modal__input login"
            type="text"
            name="login"
            placeholder="Почта"
          />

          <input
            v-model="password"
            class="modal__input password-first"
            type="password"
            name="password"
            placeholder="Пароль"
          />

          <input
            v-if="isRegistration"
            v-model="confirmPassword"
            class="modal__input password-double"
            type="password"
            name="password"
            placeholder="Повторите пароль"
          />

          <button type="submit" class="modal__btn">
            {{ isRegistration ? "Зарегистрироваться" : "Войти" }}
          </button>

          <NuxtLink
            :to="isRegistration ? '/login' : '/signup'"
            class="modal__btn-switch"
          >
            {{ isRegistration ? "Войти" : "Зарегистрироваться" }}
          </NuxtLink>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isRegistration: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit"]);

const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const handleSubmit = async () => {
  if (!email.value.trim() || !password.value.trim()) {
    throw showError({
      statusCode: 400,
      message: "Заполните email и пароль",
    });
  }
  if (props.isRegistration && password.value !== confirmPassword.value) {
    alert("Пароли не совпадают");
    return;
  }
  // дальше логика входа/регистрации
};
</script>
