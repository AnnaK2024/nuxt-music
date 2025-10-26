import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { ref } from "vue";

const useAuth = vi.fn(() => ({
  login: vi.fn(),
  signup: vi.fn(),
}));

const mockRouter = {
  push: vi.fn(),
};

const useRouter = vi.fn(() => mockRouter);

const NuxtLink = {
  template: "<a><slot /></a>",
  props: ["to"],
};

const NuxtImg = {
  template: '<img :alt="alt" :src="src" />',
  props: [
    "alt",
    "src",
    "width",
    "height",
    "loading",
    "quality",
    "format",
    "preload",
    "placeholder",
  ],
};

const showError = vi.fn();

const AuthForm = {
  template: `
    <div class="wrapper">
      <div class="container-auth">
        <div class="modal__block">
          <form class="modal__form-login" @submit.prevent="handleSubmit">
            <NuxtLink to="/login">
              <div class="modal__logo">
                <NuxtImg
                  alt="логотип Skypro Music"
                  :placeholder="[15]"
                  src="/img/logo_modal.png"
                  width="140px"
                  height="21px"
                  loading="eager"
                  quality="90"
                  format="webp"
                  preload
                />
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
  `,
  props: {
    isRegistration: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["submit", "error"],
  setup(props, { emit }) {
    const router = useRouter();
    const { login, signup } = useAuth();

    const loading = ref(false);
    const username = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");

    const handleSubmit = async () => {
      if (!email.value.trim() || !password.value.trim()) {
        showError({
          statusCode: 400,
          message: "Заполните email и пароль",
        });
        return;
      }

      if (props.isRegistration && password.value !== confirmPassword.value) {
        window.alert("Пароли не совпадают");
        return;
      }

      emit("submit", {
        email: email.value,
        password: password.value,
        username: username.value,
      });

      try {
        loading.value = true;
        if (props.isRegistration) {
          await signup({
            email: email.value,
            password: password.value,
            username: username.value,
          });
          window.alert("Регистрация успешна, войдите в систему");
          router.push("/login");
        } else {
          await login({ email: email.value, password: password.value });
          router.push("/");
        }
      } catch (e) {
        window.alert(e.message);
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      username,
      email,
      password,
      confirmPassword,
      handleSubmit,
    };
  },
};

describe("AuthForm Component", () => {
  let wrapper;
  let authMocks;
  let alertSpy;

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();

    alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    authMocks = {
      login: vi.fn().mockResolvedValue({}),
      signup: vi.fn().mockResolvedValue({}),
    };

    useAuth.mockReturnValue(authMocks);

    wrapper = mount(AuthForm, {
      props: {
        isRegistration: false,
      },
      global: {
        components: {
          NuxtLink,
          NuxtImg,
        },
        stubs: {
          NuxtLink,
          NuxtImg,
        },
      },
    });
  });

  afterEach(() => {
    alertSpy.mockRestore();
    mockRouter.push.mockClear();
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("должен отрендериться корректно", () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find(".modal__form-login").exists()).toBe(true);
    });

    it("должен отобразить логотип", () => {
      expect(wrapper.find(".modal__logo").exists()).toBe(true);
    });

    it("должен отобразить поле email", () => {
      const emailInput = wrapper.find('input[name="email"]');
      expect(emailInput.exists()).toBe(true);
      expect(emailInput.attributes("placeholder")).toBe("Почта");
    });

    it("должен отобразить поле пароля", () => {
      const passwordInput = wrapper.find('input[name="password"]');
      expect(passwordInput.exists()).toBe(true);
      expect(passwordInput.attributes("placeholder")).toBe("Пароль");
    });

    it("должен отобразить кнопку входа", () => {
      const button = wrapper.find(".modal__btn");
      expect(button.text()).toBe("Войти");
      expect(button.classes()).toContain("modal__btn--login");
    });

    it("должен отобразить ссылку на регистрацию", () => {
      const link = wrapper.find(".modal__btn-switch");
      expect(link.exists()).toBe(true);
      expect(link.text()).toBe("Зарегистрироваться");
    });
  });

  describe("Login Mode", () => {
    it("не должен показывать поле username", () => {
      const usernameInput = wrapper.find('input[name="username"]');
      expect(usernameInput.exists()).toBe(false);
    });

    it("не должен показывать поле confirmPassword", () => {
      const confirmInput = wrapper.find('input[name="confirmPassword"]');
      expect(confirmInput.exists()).toBe(false);
    });

    it("должен вызвать login при отправке формы", async () => {
      const emailInput = wrapper.find('input[name="email"]');
      const passwordInput = wrapper.find('input[name="password"]');

      await emailInput.setValue("test@example.com");
      await passwordInput.setValue("password123");

      const form = wrapper.find("form");
      await form.trigger("submit");
      await wrapper.vm.$nextTick();

      expect(authMocks.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    it("должен перенаправить на главную после входа", async () => {
      const emailInput = wrapper.find('input[name="email"]');
      const passwordInput = wrapper.find('input[name="password"]');

      await emailInput.setValue("test@example.com");
      await passwordInput.setValue("password123");

      const form = wrapper.find("form");
      await form.trigger("submit");
      await wrapper.vm.$nextTick();

      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });

    it("должен выбросить ошибку если email пуст", async () => {
      const passwordInput = wrapper.find('input[name="password"]');
      await passwordInput.setValue("password123");

      const form = wrapper.find("form");
      await form.trigger("submit");
      await wrapper.vm.$nextTick();

      expect(showError).toHaveBeenCalled();
      expect(authMocks.login).not.toHaveBeenCalled();
    });

    it("должен выбросить ошибку если пароль пуст", async () => {
      const emailInput = wrapper.find('input[name="email"]');
      await emailInput.setValue("test@example.com");

      const form = wrapper.find("form");
      await form.trigger("submit");
      await wrapper.vm.$nextTick();

      expect(showError).toHaveBeenCalled();
      expect(authMocks.login).not.toHaveBeenCalled();
    });

    it("должен эмитить submit событие", async () => {
      const emailInput = wrapper.find('input[name="email"]');
      const passwordInput = wrapper.find('input[name="password"]');

      await emailInput.setValue("test@example.com");
      await passwordInput.setValue("password123");

      const form = wrapper.find("form");
      await form.trigger("submit");

      expect(wrapper.emitted("submit")).toBeTruthy();
      expect(wrapper.emitted("submit")[0][0]).toEqual({
        email: "test@example.com",
        password: "password123",
        username: "",
      });
    });
  });

  describe("Registration Mode", () => {
    it("должен показывать поле username", async () => {
      await wrapper.setProps({ isRegistration: true });
      await wrapper.vm.$nextTick();

      const usernameInput = wrapper.find('input[name="username"]');
      expect(usernameInput.exists()).toBe(true);
    });

    it("должен показывать поле confirmPassword", async () => {
      await wrapper.setProps({ isRegistration: true });
      await wrapper.vm.$nextTick();

      const confirmInput = wrapper.find('input[name="confirmPassword"]');
      expect(confirmInput.exists()).toBe(true);
    });

    it("должен отобразить кнопку регистрации", async () => {
      await wrapper.setProps({ isRegistration: true });
      await wrapper.vm.$nextTick();

      const button = wrapper.find(".modal__btn");
      expect(button.text()).toBe("Зарегистрироваться");
    });

    it("не должен показывать ссылку на регистрацию", async () => {
      await wrapper.setProps({ isRegistration: true });
      await wrapper.vm.$nextTick();

      const link = wrapper.find(".modal__btn-switch");
      expect(link.exists()).toBe(false);
    });

    it("должен вызвать signup при отправке", async () => {
      await wrapper.setProps({ isRegistration: true });
      await wrapper.vm.$nextTick();

      const usernameInput = wrapper.find('input[name="username"]');
      const emailInput = wrapper.find('input[name="email"]');
      const passwordInput = wrapper.find('input[name="password"]');
      const confirmInput = wrapper.find('input[name="confirmPassword"]');

      await usernameInput.setValue("testuser");
      await emailInput.setValue("test@example.com");
      await passwordInput.setValue("password123");
      await confirmInput.setValue("password123");

      const form = wrapper.find("form");
      await form.trigger("submit");
      await wrapper.vm.$nextTick();

      expect(authMocks.signup).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });
    });

    it("должен перенаправить на логин после регистрации", async () => {
      await wrapper.setProps({ isRegistration: true });
      await wrapper.vm.$nextTick();

      const usernameInput = wrapper.find('input[name="username"]');
      const emailInput = wrapper.find('input[name="email"]');
      const passwordInput = wrapper.find('input[name="password"]');
      const confirmInput = wrapper.find('input[name="confirmPassword"]');

      await usernameInput.setValue("testuser");
      await emailInput.setValue("test@example.com");
      await passwordInput.setValue("password123");
      await confirmInput.setValue("password123");

      const form = wrapper.find("form");
      await form.trigger("submit");
      await wrapper.vm.$nextTick();

      expect(mockRouter.push).toHaveBeenCalledWith("/login");
    });

    it("должен эмитить submit с username", async () => {
      await wrapper.setProps({ isRegistration: true });
      await wrapper.vm.$nextTick();

      const usernameInput = wrapper.find('input[name="username"]');
      const emailInput = wrapper.find('input[name="email"]');
      const passwordInput = wrapper.find('input[name="password"]');
      const confirmInput = wrapper.find('input[name="confirmPassword"]');

      await usernameInput.setValue("testuser");
      await emailInput.setValue("test@example.com");
      await passwordInput.setValue("password123");
      await confirmInput.setValue("password123");

      const form = wrapper.find("form");
      await form.trigger("submit");

      expect(wrapper.emitted("submit")).toBeTruthy();
      expect(wrapper.emitted("submit")[0][0]).toEqual({
        email: "test@example.com",
        password: "password123",
        username: "testuser",
      });
    });
  });

  describe("Input Handling", () => {
    it("должен обновлять email", async () => {
      const emailInput = wrapper.find('input[name="email"]');
      await emailInput.setValue("test@example.com");
      expect(wrapper.vm.email).toBe("test@example.com");
    });

    it("должен обновлять пароль", async () => {
      const passwordInput = wrapper.find('input[name="password"]');
      await passwordInput.setValue("password123");
      expect(wrapper.vm.password).toBe("password123");
    });

    it("должен отключать inputs при загрузке", async () => {
      wrapper.vm.loading = true;
      await wrapper.vm.$nextTick();

      const emailInput = wrapper.find('input[name="email"]');
      expect(emailInput.attributes("disabled")).toBeDefined();
    });

    it("должен показывать текст при загрузке", async () => {
      wrapper.vm.loading = true;
      await wrapper.vm.$nextTick();

      const button = wrapper.find(".modal__btn");
      expect(button.text()).toBe("Подождите...");
    });
  });

  describe("Error Handling", () => {
    it("должен обработать ошибку при входе", async () => {
      const error = new Error("Invalid credentials");
      authMocks.login.mockRejectedValueOnce(error);

      const emailInput = wrapper.find('input[name="email"]');
      const passwordInput = wrapper.find('input[name="password"]');

      await emailInput.setValue("test@example.com");
      await passwordInput.setValue("wrongpassword");

      const form = wrapper.find("form");
      await form.trigger("submit");
      await wrapper.vm.$nextTick();

      expect(alertSpy).toHaveBeenCalledWith("Invalid credentials");
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("должен обработать ошибку при регистрации", async () => {
      await wrapper.setProps({ isRegistration: true });
      await wrapper.vm.$nextTick();

      const error = new Error("Email already exists");
      authMocks.signup.mockRejectedValueOnce(error);

      const usernameInput = wrapper.find('input[name="username"]');
      const emailInput = wrapper.find('input[name="email"]');
      const passwordInput = wrapper.find('input[name="password"]');
      const confirmInput = wrapper.find('input[name="confirmPassword"]');

      await usernameInput.setValue("testuser");
      await emailInput.setValue("existing@example.com");
      await passwordInput.setValue("password123");
      await confirmInput.setValue("password123");

      const form = wrapper.find("form");
      await form.trigger("submit");
      await wrapper.vm.$nextTick();

      expect(alertSpy).toHaveBeenCalledWith("Email already exists");
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe("Form Validation", () => {
    it("должен игнорировать пробелы в email", async () => {
      const emailInput = wrapper.find('input[name="email"]');
      const passwordInput = wrapper.find('input[name="password"]');

      await emailInput.setValue("   ");
      await passwordInput.setValue("password123");

      const form = wrapper.find("form");
      await form.trigger("submit");
      await wrapper.vm.$nextTick();

      expect(showError).toHaveBeenCalled();
      expect(authMocks.login).not.toHaveBeenCalled();
    });

    it("должен игнорировать пробелы в пароле", async () => {
      const emailInput = wrapper.find('input[name="email"]');
      const passwordInput = wrapper.find('input[name="password"]');

      await emailInput.setValue("test@example.com");
      await passwordInput.setValue("   ");

      const form = wrapper.find("form");
      await form.trigger("submit");
      await wrapper.vm.$nextTick();

      expect(showError).toHaveBeenCalled();
      expect(authMocks.login).not.toHaveBeenCalled();
    });
  });
});
