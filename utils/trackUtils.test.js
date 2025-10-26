import { describe, it, expect } from "vitest";
import {
  normalizeId,
  extractYearFromReleaseDate,
  normalizeGenreName,
  normalizeTrack,
} from "~/utils/trackUtils";

describe("normalizeId", () => {
  it("должна вернуть null для null", () => {
    expect(normalizeId(null)).toBe(null);
  });

  it("должна вернуть null для undefined", () => {
    expect(normalizeId(undefined)).toBe(null);
  });

  it("должна вернуть null для пустой строки", () => {
    expect(normalizeId("")).toBe(null);
  });

  it("должна вернуть null для строки с только пробелами", () => {
    expect(normalizeId("   ")).toBe(null);
  });

  it("должна вернуть нормализованную строку для валидного ID", () => {
    expect(normalizeId("12345")).toBe("12345");
  });

  it("должна обрезать пробелы", () => {
    expect(normalizeId("  hello  ")).toBe("hello");
  });

  it("должна преобразовать число в строку", () => {
    expect(normalizeId(123)).toBe("123");
  });

  it("должна преобразовать булево значение в строку", () => {
    expect(normalizeId(true)).toBe("true");
  });

  it("должна вернуть null для нулевого числа (0)", () => {
    expect(normalizeId(0)).toBe("0");
  });
});

describe("extractYearFromReleaseDate", () => {
  it('должна вернуть "Неизвестно" для null', () => {
    expect(extractYearFromReleaseDate(null)).toBe("Неизвестно");
  });

  it('должна вернуть "Неизвестно" для undefined', () => {
    expect(extractYearFromReleaseDate(undefined)).toBe("Неизвестно");
  });

  it('должна вернуть "Неизвестно" для пустой строки', () => {
    expect(extractYearFromReleaseDate("")).toBe("Неизвестно");
  });

  it("должна извлечь год из простой даты", () => {
    expect(extractYearFromReleaseDate("2023-10-26")).toBe("2023");
  });

  it("должна извлечь год из даты с временем", () => {
    expect(extractYearFromReleaseDate("2022-05-15 14:30")).toBe("2022");
  });

  it("должна извлечь год из даты с HTML-тегом", () => {
    expect(extractYearFromReleaseDate("2021-12-31<br>more info")).toBe("2021");
  });

  it("должна вернуть первый найденный год из строки с несколькими годами", () => {
    expect(
      extractYearFromReleaseDate("Релиз 2020 года, переиздано в 2023")
    ).toBe("2020");
  });

  it("должна вернуть оригинальную строку если год не найден", () => {
    expect(extractYearFromReleaseDate("неизвестная дата")).toBe(
      "неизвестная дата"
    );
  });

  it("должна обрезать пробелы перед обработкой", () => {
    expect(extractYearFromReleaseDate("  2019-01-01  ")).toBe("2019");
  });

  it("должна работать с объектом Date", () => {
    const date = new Date("2024-01-15");
    const result = extractYearFromReleaseDate(date);
    expect(result).toMatch(/\d{4}/);
  });
});

describe("normalizeGenreName", () => {
  it('должна вернуть "неизвестно" для null', () => {
    expect(normalizeGenreName(null)).toBe("неизвестно");
  });

  it('должна вернуть "неизвестно" для undefined', () => {
    expect(normalizeGenreName(undefined)).toBe("неизвестно");
  });

  it('должна вернуть "неизвестно" для пустой строки', () => {
    expect(normalizeGenreName("")).toBe("неизвестно");
  });

  it("должна преобразовать жанр в нижний регистр", () => {
    expect(normalizeGenreName("Rock")).toBe("rock");
  });

  it("должна преобразовать жанр в нижний регистр и обрезать пробелы", () => {
    expect(normalizeGenreName("  JAZZ  ")).toBe("jazz");
  });

  it("должна сохранить кириллицу", () => {
    expect(normalizeGenreName("Рок")).toBe("рок");
  });

  it("должна работать с смешанным регистром и спецсимволами", () => {
    expect(normalizeGenreName("  Hip-Hop  ")).toBe("hip-hop");
  });
});

describe("normalizeTrack", () => {
  it("должна нормализовать трек с полем id", () => {
    const track = { id: "123", title: "Song" };
    const result = normalizeTrack(track);

    expect(result.id).toBe("123");
    expect(result.title).toBe("Song");
  });

  it("должна использовать _id если id отсутствует", () => {
    const track = { _id: "abc456", title: "Song" };
    const result = normalizeTrack(track);

    expect(result.id).toBe("abc456");
  });

  it("должна использовать trackId если id и _id отсутствуют", () => {
    const track = { trackId: "xyz789", title: "Song" };
    const result = normalizeTrack(track);

    expect(result.id).toBe("xyz789");
  });

  it("должна использовать fallbackId если нет id, _id и trackId", () => {
    const track = { title: "Song" };
    const result = normalizeTrack(track, "fallback123");

    expect(result.id).toBe("fallback123");
  });

  it("должна использовать сгенерированный ID если все остальное отсутствует", () => {
    const track = { title: "Song" };
    const result = normalizeTrack(track, null, 5);

    expect(result.id).toBe("__generated_5");
  });

  it("должна использовать сгенерированный ID если id пуст", () => {
    const track = { id: "   ", title: "Song" };
    const result = normalizeTrack(track, "fallback", 3);

    expect(result.id).toBe("__generated_3");
  });

  it("должна сохранить все остальные свойства трека", () => {
    const track = {
      id: "123",
      title: "My Song",
      artist: "Artist Name",
      duration: 240,
      genre: "Rock",
    };
    const result = normalizeTrack(track);

    expect(result.id).toBe("123");
    expect(result.title).toBe("My Song");
    expect(result.artist).toBe("Artist Name");
    expect(result.duration).toBe(240);
    expect(result.genre).toBe("Rock");
  });

  it("должна работать с индексом по умолчанию", () => {
    const track = { title: "Song" };
    const result = normalizeTrack(track);

    expect(result.id).toBe("__generated_0");
  });

  it("должна обрезать пробелы в ID", () => {
    const track = { id: "  valid123  ", title: "Song" };
    const result = normalizeTrack(track);

    expect(result.id).toBe("valid123");
  });

  it("должна обработать null трек", () => {
    const result = normalizeTrack(null, "fallback", 1);

    expect(result.id).toBe("fallback");
  });

  it("должна обработать undefined трек", () => {
    const result = normalizeTrack(undefined, "fallback", 2);

    expect(result.id).toBe("fallback");
  });
});
