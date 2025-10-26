import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia, defineStore } from "pinia";

import { ref } from "vue";

// Mock Store
const useTracksStore = defineStore("tracks", {
  state: () => ({
    filters: {
      author: null,
      year: null,
      genre: null,
    },
    availableAuthors: ["The Beatles", "Pink Floyd", "Queen"],
    availableYears: ["1969", "1973", "1975"],
    availableGenres: ["rock", "pop", "progressive rock"],
  }),
  actions: {
    setFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters };
    },
  },
});

// Mock компонента
const FilterComponent = {
  template: `
    <div class="centerblock__filter filter">
      <div class="filter__title">Искать по:</div>

      <div class="filter__wrapper">
        <div
          class="filter__button button-author"
          :class="{ active: activeDropdown === 'author' }"
          @click="toggleDropdown('author')"
        >
          исполнителю
        </div>
        <div
          v-show="activeDropdown === 'author'"
          class="filter__dropdown dropdown-author"
        >
          <ul class="filter__list">
            <li
              v-for="author in tracksStore.availableAuthors"
              :key="author"
              class="filter__item"
              @click="selectFilterValue('author', author)"
            >
              {{ author }}
            </li>
          </ul>
        </div>
      </div>

      <div class="filter__wrapper">
        <div
          class="filter__button button-year"
          :class="{ active: activeDropdown === 'year' }"
          @click="toggleDropdown('year')"
        >
          году выпуска
        </div>
        <div
          v-show="activeDropdown === 'year'"
          class="filter__dropdown dropdown-year"
        >
          <ul class="filter__list">
            <li
              v-for="year in tracksStore.availableYears"
              :key="year"
              class="filter__item"
              @click="selectFilterValue('year', year)"
            >
              {{ year }}
            </li>
          </ul>
        </div>
      </div>

      <div class="filter__wrapper">
        <div
          class="filter__button button-genre"
          :class="{ active: activeDropdown === 'genre' }"
          @click="toggleDropdown('genre')"
        >
          жанру
        </div>
        <div
          v-show="activeDropdown === 'genre'"
          class="filter__dropdown dropdown-genre"
        >
          <ul class="filter__list">
            <li
              v-for="genre in tracksStore.availableGenres"
              :key="genre"
              class="filter__item"
              @click="selectFilterValue('genre', genre)"
            >
              {{ genre }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  setup() {
    const tracksStore = useTracksStore();
    const activeDropdown = ref(null);

    function toggleDropdown(kind) {
      if (activeDropdown.value === kind) {
        activeDropdown.value = null;
      } else {
        activeDropdown.value = kind;
      }
    }

    function selectFilterValue(kind, value) {
      if (kind === "author") {
        const sameValue =
          tracksStore.filters.author &&
          String(tracksStore.filters.author) === String(value);

        tracksStore.setFilters({ author: sameValue ? null : String(value) });
      } else if (kind === "year") {
        const sameValue =
          tracksStore.filters.year &&
          String(tracksStore.filters.year) === String(value);

        tracksStore.setFilters({ year: sameValue ? null : String(value) });
      } else if (kind === "genre") {
        const normalizedValue = String(value).toLowerCase().trim();
        const sameValue =
          tracksStore.filters.genre &&
          String(tracksStore.filters.genre) === normalizedValue;

        tracksStore.setFilters({ genre: sameValue ? null : normalizedValue });
      }

      activeDropdown.value = null;
    }

    return { tracksStore, activeDropdown, toggleDropdown, selectFilterValue };
  },
};

describe("Filter Component", () => {
  let wrapper;
  let store;
  let pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    store = useTracksStore();

    wrapper = mount(FilterComponent, {
      global: {
        plugins: [pinia],
      },
    });
  });

  describe("Rendering", () => {
    it("должен отрендериться", () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("должен отобразить три кнопки", () => {
      const buttons = wrapper.findAll(".filter__button");
      expect(buttons).toHaveLength(3);
    });

    it("должен отобразить заголовок", () => {
      const title = wrapper.find(".filter__title");
      expect(title.text()).toBe("Искать по:");
    });
  });

  describe("Dropdown Toggle", () => {
    it("открывает dropdown author", async () => {
      const button = wrapper.find(".button-author");
      await button.trigger("click");
      expect(wrapper.vm.activeDropdown).toBe("author");
    });

    it("открывает dropdown year", async () => {
      const button = wrapper.find(".button-year");
      await button.trigger("click");
      expect(wrapper.vm.activeDropdown).toBe("year");
    });

    it("открывает dropdown genre", async () => {
      const button = wrapper.find(".button-genre");
      await button.trigger("click");
      expect(wrapper.vm.activeDropdown).toBe("genre");
    });

    it("закрывает dropdown при повторном клике", async () => {
      const button = wrapper.find(".button-author");
      await button.trigger("click");
      expect(wrapper.vm.activeDropdown).toBe("author");

      await button.trigger("click");
      expect(wrapper.vm.activeDropdown).toBeNull();
    });

    it("переключается между dropdowns", async () => {
      const authorBtn = wrapper.find(".button-author");
      const yearBtn = wrapper.find(".button-year");

      await authorBtn.trigger("click");
      expect(wrapper.vm.activeDropdown).toBe("author");

      await yearBtn.trigger("click");
      expect(wrapper.vm.activeDropdown).toBe("year");
    });
  });

  describe("Author Filter", () => {
    it("показывает список авторов", async () => {
      const button = wrapper.find(".button-author");
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      const dropdown = wrapper.find(".dropdown-author");
      const items = dropdown.findAll(".filter__item");
      expect(items).toHaveLength(3);
      expect(items[0].text()).toBe("The Beatles");
    });

    it("устанавливает фильтр автора", async () => {
      const button = wrapper.find(".button-author");
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      const dropdown = wrapper.find(".dropdown-author");
      const items = dropdown.findAll(".filter__item");
      await items[0].trigger("click");

      expect(store.filters.author).toBe("The Beatles");
    });

    it("закрывает dropdown после выбора", async () => {
      const button = wrapper.find(".button-author");
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      const dropdown = wrapper.find(".dropdown-author");
      const items = dropdown.findAll(".filter__item");
      await items[0].trigger("click");

      expect(wrapper.vm.activeDropdown).toBeNull();
    });

    it("очищает фильтр при повторном выборе", async () => {
      const button = wrapper.find(".button-author");

      await button.trigger("click");
      await wrapper.vm.$nextTick();
      let dropdown = wrapper.find(".dropdown-author");
      let items = dropdown.findAll(".filter__item");
      await items[0].trigger("click");

      expect(store.filters.author).toBe("The Beatles");

      await button.trigger("click");
      await wrapper.vm.$nextTick();
      dropdown = wrapper.find(".dropdown-author");
      items = dropdown.findAll(".filter__item");
      await items[0].trigger("click");

      expect(store.filters.author).toBeNull();
    });
  });

  describe("Year Filter", () => {
    it("показывает список лет", async () => {
      const button = wrapper.find(".button-year");
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      const dropdown = wrapper.find(".dropdown-year");
      const items = dropdown.findAll(".filter__item");
      expect(items).toHaveLength(3);
      expect(items[0].text()).toBe("1969");
    });

    it("устанавливает фильтр года", async () => {
      const button = wrapper.find(".button-year");
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      const dropdown = wrapper.find(".dropdown-year");
      const items = dropdown.findAll(".filter__item");
      await items[1].trigger("click");

      expect(store.filters.year).toBe("1973");
    });

    it("очищает фильтр при повторном выборе", async () => {
      const button = wrapper.find(".button-year");

      await button.trigger("click");
      await wrapper.vm.$nextTick();
      let dropdown = wrapper.find(".dropdown-year");
      let items = dropdown.findAll(".filter__item");
      await items[0].trigger("click");

      expect(store.filters.year).toBe("1969");

      await button.trigger("click");
      await wrapper.vm.$nextTick();
      dropdown = wrapper.find(".dropdown-year");
      items = dropdown.findAll(".filter__item");
      await items[0].trigger("click");

      expect(store.filters.year).toBeNull();
    });
  });

  describe("Genre Filter", () => {
    it("показывает список жанров", async () => {
      const button = wrapper.find(".button-genre");
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      const dropdown = wrapper.find(".dropdown-genre");
      const items = dropdown.findAll(".filter__item");
      expect(items).toHaveLength(3);
      expect(items[0].text()).toBe("rock");
    });

    it("устанавливает нормализованный фильтр", async () => {
      const button = wrapper.find(".button-genre");
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      const dropdown = wrapper.find(".dropdown-genre");
      const items = dropdown.findAll(".filter__item");
      await items[1].trigger("click");

      expect(store.filters.genre).toBe("pop");
    });

    it("нормализует жанр в lowercase", async () => {
      store.availableGenres = ["ROCK", "POP"];
      await wrapper.vm.$nextTick();

      const button = wrapper.find(".button-genre");
      await button.trigger("click");
      await wrapper.vm.$nextTick();

      const dropdown = wrapper.find(".dropdown-genre");
      const items = dropdown.findAll(".filter__item");
      await items[0].trigger("click");

      expect(store.filters.genre).toBe("rock");
    });

    it("очищает фильтр при повторном выборе", async () => {
      const button = wrapper.find(".button-genre");

      await button.trigger("click");
      await wrapper.vm.$nextTick();
      let dropdown = wrapper.find(".dropdown-genre");
      let items = dropdown.findAll(".filter__item");
      await items[0].trigger("click");

      expect(store.filters.genre).toBe("rock");

      await button.trigger("click");
      await wrapper.vm.$nextTick();
      dropdown = wrapper.find(".dropdown-genre");
      items = dropdown.findAll(".filter__item");
      await items[0].trigger("click");

      expect(store.filters.genre).toBeNull();
    });
  });

  describe("Integration", () => {
    it("изменяет filters в store правильно", async () => {
      expect(store.filters.author).toBeNull();
      expect(store.filters.year).toBeNull();
      expect(store.filters.genre).toBeNull();

      const authorBtn = wrapper.find(".button-author");
      await authorBtn.trigger("click");
      await wrapper.vm.$nextTick();

      let dropdown = wrapper.find(".dropdown-author");
      let items = dropdown.findAll(".filter__item");
      await items[0].trigger("click");

      expect(store.filters.author).toBe("The Beatles");
      expect(store.filters.year).toBeNull();
      expect(store.filters.genre).toBeNull();
    });

    it("не влияет на другие фильтры", async () => {
      const authorBtn = wrapper.find(".button-author");
      const yearBtn = wrapper.find(".button-year");

      await authorBtn.trigger("click");
      await wrapper.vm.$nextTick();
      let dropdown = wrapper.find(".dropdown-author");
      let items = dropdown.findAll(".filter__item");
      await items[0].trigger("click");

      expect(store.filters.author).toBe("The Beatles");
      expect(store.filters.year).toBeNull();

      await yearBtn.trigger("click");
      await wrapper.vm.$nextTick();
      dropdown = wrapper.find(".dropdown-year");
      items = dropdown.findAll(".filter__item");
      await items[0].trigger("click");

      expect(store.filters.author).toBe("The Beatles");
      expect(store.filters.year).toBe("1969");
    });
  });
});
