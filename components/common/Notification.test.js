import { describe, it, expect } from "vitest";
import Notification from "./Notification.vue";
import { mount } from "@vue/test-utils";

describe("Notification", () => {
  it("отображает сообщение и класс типа, если show=true", () => {
    const wrapper = mount(Notification, {
      props: {
        show: true,
        message: "Всё получилось!",
        type: "success",
      },
      global: {
        stubs: {
          Teleport: true, // отключаем реальный teleport
          Transition: false, // чтобы элемент отрендерился сразу
        },
      },
    });
    expect(wrapper.text()).toContain("Всё получилось!");
    expect(wrapper.find(".notification").exists()).toBe(true);
    expect(wrapper.find(".notification").classes()).toContain("success");
  });

  it("не отображает уведомление, если show=false", () => {
    const wrapper = mount(Notification, {
      props: {
        show: false,
        message: "Hidden",
      },
    });
    expect(wrapper.find(".notification").exists()).toBe(false);
  });
});