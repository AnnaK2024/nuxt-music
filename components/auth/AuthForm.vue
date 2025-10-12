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
            v-if="isRegistration"
            v-model="username"
            class="modal__input username"
            :disabled="loading"
            type="text"
            name="username"
            placeholder="Имя пользователя"
          />

          <input
            v-model="email"
            class="modal__input login"
            :disabled="loading"
            type="email"
            name="email"
            placeholder="Почта"
          />

          <input
            v-model="password"
            class="modal__input password-first"
            :disabled="loading"
            type="password"
            name="password"
            placeholder="Пароль"
          />

          <input
            v-if="isRegistration"
            v-model="confirmPassword"
            class="modal__input password-double"
            :disabled="loading"
            type="password"
            name="confirmPassword"
            placeholder="Повторите пароль"
          />

          <button
            type="submit"
            class="modal__btn"
            :class="{
              'modal__btn--login': !isRegistration,
              'modal__btn--register': isRegistration,
            }"
            :disabled="loading"
          >
            {{
              loading
                ? "Подождите..."
                : isRegistration
                ? "Зарегистрироваться"
                : "Войти"
            }}
          </button>

          <!-- Показываем ссылку‑кнопку только в режиме логина -->
          <NuxtLink
            v-if="!isRegistration"
            class="modal__btn-switch"
            to="/signup"
          >
            Зарегистрироваться
          </NuxtLink>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  isRegistration: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();
const emit = defineEmits(["submit", "error"]);
const { login, signup } = useAuth();

const loading = ref(false);
const username = ref("");
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

  emit("submit", {
    email: email.value,
    password: password.value,
    username: username.value,
  });

  try {
    if (props.isRegistration) {
      await signup({
        email: email.value,
        password: password.value,
        username: username.value,
      });
      alert("Регистрация успешна, войдите в систему");
      router.push("/login"); // Перенаправляем на вход после регистрации
    } else {
      await login({ email: email.value, password: password.value });
      router.push("/"); // Перенаправляем после успешного входа
    }
  } catch (e) {
    alert(e.message);
  }
};
</script>

<style>
.wrapper {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
}

.container-auth {
  max-width: 100%;
  height: 100vh;
  margin: 0 auto;
  position: relative;
  background-color: rgba(0, 0, 0, 0.85);
}

.modal__block {
  position: absolute;
  z-index: 2;
  left: calc(50% - (366px / 2));
  top: calc(50% - (439px / 2));
  opacity: 1;
}

.modal__form-login {
  width: 366px;
  height: 439px;
  background-color: #ffffff;
  border-radius: 12px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 43px 44px 47px 40px;
}

.modal__form-login input:first-child {
  margin-bottom: 30px;
}

.modal__logo {
  width: 140px;
  height: 21px;
  margin-bottom: 34px;
  background-color: transparent;
}

.modal__logo img {
  width: 140px;
  height: auto;
}

.modal__input {
  width: 100%;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid #d0cece;
  padding: 8px 1px;
  margin-right: 3px;
  margin-bottom: 30px;
}

.modal__input::-webkit-input-placeholder {
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.05px;
  color: #d0cece;
}

.modal__input:-ms-input-placeholder {
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.05px;
  color: #d0cece;
}

.modal__input::-ms-input-placeholder {
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.05px;
  color: #d0cece;
}

.modal__input::placeholder {
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.05px;
  color: #d0cece;
}

.modal__btn {
  width: 278px;
  height: 62px;
  background-color: #580ea2; /* фиолетовый */
  border-radius: 6px;
  border: none;

  color: #ffffff;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.05px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.modal__btn:hover {
  background-color: #3f007d; /* темнее фиолетового */
}

.modal__btn:active {
  background-color: #271a58; /* ещё темнее при нажатии */
}

/* Кнопка переключения — белая с границей и черным текстом */
.modal__btn-switch {
  width: 278px;
  height: 62px;
  background-color: #ffffff; /* белый фон */
  border: 1px solid #d0cece; /* светло-серая рамка */
  border-radius: 6px;
  margin-top: 20px;
  color: #000000; /* чёрный текст */
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: -0.05px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none; /* убрать подчёркивание */
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.modal__btn-switch:hover {
  background-color: #f4f5f6; /* светло-серый фон */
  border-color: #bfbfbf; /* чуть темнее рамка */
}

.modal__btn-switch:active {
  background-color: #d9d9d9; /* серый фон */
  border-color: #a6a6a6; /* темнее рамка */
}

/* Стили для кнопки "Войти" (в окне входа) */
.modal__btn--login {
  background-color: #580ea2; /* Синий цвет для входа */
  color: white;
  margin-top: 30px;
}

.modal__btn--login:hover {
  background-color: #3f007d; /* Темнее при наведении */
}

/* Стили для кнопки "Зарегистрироваться" (в окне регистрации) */
.modal__btn--register {
  background-color: #580ea2; /* Зеленый цвет для регистрации */
  color: white;
}

.modal__btn--register:hover {
  background-color: #3f007d; /* Темнее при наведении */
}

/* Отключенное состояние (для обеих кнопок) */
.modal__btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
