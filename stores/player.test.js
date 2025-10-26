import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { usePlayerStore } from "~/stores/player";

describe("Player Store - Getters (чистые функции)", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("hasNext", () => {
    it("должна вернуть false если плейлист пуст", () => {
      const store = usePlayerStore();
      store.playlist = [];
      store.currentTrack = null;

      expect(store.hasNext).toBe(false);
    });

    it("должна вернуть true если включен режим shuffle", () => {
      const store = usePlayerStore();
      store.playlist = [
        { id: "1", name: "Track 1", url: "url1" },
        { id: "2", name: "Track 2", url: "url2" },
      ];
      store.currentTrack = store.playlist[0];
      store.isShuffle = true;

      expect(store.hasNext).toBe(true);
    });

    it("должна вернуть true если включен режим repeat playlist", () => {
      const store = usePlayerStore();
      store.playlist = [
        { id: "1", name: "Track 1", url: "url1" },
        { id: "2", name: "Track 2", url: "url2" },
      ];
      store.currentTrack = store.playlist[1]; // последний трек
      store.isRepeatPlaylist = true;

      expect(store.hasNext).toBe(true);
    });

    it("должна вернуть true если текущий трек не последний", () => {
      const store = usePlayerStore();
      store.playlist = [
        { id: "1", name: "Track 1", url: "url1" },
        { id: "2", name: "Track 2", url: "url2" },
        { id: "3", name: "Track 3", url: "url3" },
      ];
      store.currentTrack = store.playlist[0];

      expect(store.hasNext).toBe(true);
    });

    it("должна вернуть false если текущий трек последний и нет режимов", () => {
      const store = usePlayerStore();
      store.playlist = [
        { id: "1", name: "Track 1", url: "url1" },
        { id: "2", name: "Track 2", url: "url2" },
      ];
      store.currentTrack = store.playlist[1]; // последний
      store.isShuffle = false;
      store.isRepeatPlaylist = false;

      expect(store.hasNext).toBe(false);
    });
  });

  describe("currentIndex", () => {
    it("должна вернуть правильный индекс текущего трека", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", name: "Track 1", url: "url1" },
        { id: "2", name: "Track 2", url: "url2" },
        { id: "3", name: "Track 3", url: "url3" },
      ];
      store.playlist = tracks;
      store.currentTrack = tracks[1];

      expect(store.currentIndex).toBe(1);
    });

    it("должна вернуть -1 если трека нет в плейлисте", () => {
      const store = usePlayerStore();
      store.playlist = [
        { id: "1", name: "Track 1", url: "url1" },
        { id: "2", name: "Track 2", url: "url2" },
      ];
      store.currentTrack = { id: "999", name: "Unknown", url: "url999" };

      expect(store.currentIndex).toBe(-1);
    });

    it("должна вернуть -1 если currentTrack null", () => {
      const store = usePlayerStore();
      store.playlist = [{ id: "1", name: "Track 1", url: "url1" }];
      store.currentTrack = null;

      expect(store.currentIndex).toBe(-1);
    });
  });

  describe("currentTrackIndexOrZero", () => {
    it("должна вернуть индекс текущего трека если он найден", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", name: "Track 1", url: "url1" },
        { id: "2", name: "Track 2", url: "url2" },
      ];
      store.playlist = tracks;
      store.currentTrack = tracks[1];

      expect(store.currentTrackIndexOrZero).toBe(1);
    });

    it("должна вернуть 0 если трека нет в плейлисте", () => {
      const store = usePlayerStore();
      store.playlist = [{ id: "1", name: "Track 1", url: "url1" }];
      store.currentTrack = { id: "999", name: "Unknown", url: "url999" };

      expect(store.currentTrackIndexOrZero).toBe(0);
    });

    it("должна вернуть 0 если currentTrack null", () => {
      const store = usePlayerStore();
      store.playlist = [{ id: "1", name: "Track 1", url: "url1" }];
      store.currentTrack = null;

      expect(store.currentTrackIndexOrZero).toBe(0);
    });
  });
});

describe("Player Store - Actions (чистые функции без побочных эффектов)", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("setPlaylist", () => {
    it("должна установить плейлист", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", name: "Track 1", url: "url1" },
        { id: "2", name: "Track 2", url: "url2" },
      ];

      store.setPlaylist(tracks);

      expect(store.playlist).toHaveLength(2);
      expect(store.playlist[0].id).toBe("1");
    });

    it("должна установить первый трек как текущий по умолчанию", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", name: "Track 1", url: "url1" },
        { id: "2", name: "Track 2", url: "url2" },
      ];

      store.setPlaylist(tracks);

      expect(store.currentTrack?.id).toBe("1");
    });

    it("должна установить трек по startIndex", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", name: "Track 1", url: "url1" },
        { id: "2", name: "Track 2", url: "url2" },
        { id: "3", name: "Track 3", url: "url3" },
      ];

      store.setPlaylist(tracks, 2);

      expect(store.currentTrack?.id).toBe("3");
    });

    it("должна обработать пустой плейлист", () => {
      const store = usePlayerStore();
      store.currentTrack = { id: "1", name: "Track 1", url: "url1" };

      store.setPlaylist([]);

      expect(store.playlist).toHaveLength(0);
      expect(store.currentTrack).toBeNull();
    });

    it("должна скопировать массив (не ссылку)", () => {
      const store = usePlayerStore();
      const tracks = [{ id: "1", name: "Track 1", url: "url1" }];

      store.setPlaylist(tracks);
      tracks.push({ id: "2", name: "Track 2", url: "url2" });

      expect(store.playlist).toHaveLength(1);
    });
  });

  describe("setCurrentTrackByIndex", () => {
    it("должна установить трек по валидному индексу", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", name: "Track 1", url: "url1" },
        { id: "2", name: "Track 2", url: "url2" },
        { id: "3", name: "Track 3", url: "url3" },
      ];
      store.playlist = tracks;

      store.setCurrentTrackByIndex(1);

      expect(store.currentTrack?.id).toBe("2");
    });

    it("должна ограничить индекс в пределах плейлиста (макс)", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", name: "Track 1", url: "url1" },
        { id: "2", name: "Track 2", url: "url2" },
      ];
      store.playlist = tracks;

      store.setCurrentTrackByIndex(100);

      expect(store.currentTrack?.id).toBe("2");
    });

    it("должна ограничить индекс в пределах плейлиста (мин)", () => {
      const store = usePlayerStore();
      const tracks = [
        { id: "1", name: "Track 1", url: "url1" },
        { id: "2", name: "Track 2", url: "url2" },
      ];
      store.playlist = tracks;

      store.setCurrentTrackByIndex(-5);

      expect(store.currentTrack?.id).toBe("1");
    });

    it("должна установить null если плейлист пуст", () => {
      const store = usePlayerStore();
      store.playlist = [];

      store.setCurrentTrackByIndex(0);

      expect(store.currentTrack).toBeNull();
    });
  });

  describe("setPlaying", () => {
    it("должна установить флаг isPlaying в true", () => {
      const store = usePlayerStore();
      store.isPlaying = false;

      store.setPlaying(true);

      expect(store.isPlaying).toBe(true);
    });

    it("должна установить флаг isPlaying в false", () => {
      const store = usePlayerStore();
      store.isPlaying = true;

      store.setPlaying(false);

      expect(store.isPlaying).toBe(false);
    });

    it("должна преобразовать truthy значения в true", () => {
      const store = usePlayerStore();

      store.setPlaying(1);
      expect(store.isPlaying).toBe(true);

      store.setPlaying("text");
      expect(store.isPlaying).toBe(true);
    });

    it("должна преобразовать falsy значения в false", () => {
      const store = usePlayerStore();

      store.setPlaying(0);
      expect(store.isPlaying).toBe(false);

      store.setPlaying("");
      expect(store.isPlaying).toBe(false);

      store.setPlaying(null);
      expect(store.isPlaying).toBe(false);
    });
  });

  describe("setVolume", () => {
    it("должна установить громкость в допустимых пределах", () => {
      const store = usePlayerStore();

      store.setVolume(75);

      expect(store.volume).toBe(75);
    });

    it("должна ограничить громкость максимум 100", () => {
      const store = usePlayerStore();

      store.setVolume(150);

      expect(store.volume).toBe(100);
    });

    it("должна ограничить громкость минимум 0", () => {
      const store = usePlayerStore();

      store.setVolume(-50);

      expect(store.volume).toBe(0);
    });

    it("должна преобразовать строку в число", () => {
      const store = usePlayerStore();

      store.setVolume("50");

      expect(store.volume).toBe(50);
    });
  });

  describe("toggleRepeat", () => {
    it("должна переключить режим repeat", () => {
      const store = usePlayerStore();
      expect(store.isRepeat).toBe(false);

      store.toggleRepeat();
      expect(store.isRepeat).toBe(true);

      store.toggleRepeat();
      expect(store.isRepeat).toBe(false);
    });
  });

  describe("toggleRepeatPlaylist", () => {
    it("должна переключить режим repeat playlist", () => {
      const store = usePlayerStore();
      expect(store.isRepeatPlaylist).toBe(false);

      store.toggleRepeatPlaylist();
      expect(store.isRepeatPlaylist).toBe(true);

      store.toggleRepeatPlaylist();
      expect(store.isRepeatPlaylist).toBe(false);
    });
  });

  describe("toggleShuffle", () => {
    it("должна переключить режим shuffle", () => {
      const store = usePlayerStore();
      expect(store.isShuffle).toBe(false);

      store.toggleShuffle();
      expect(store.isShuffle).toBe(true);

      store.toggleShuffle();
      expect(store.isShuffle).toBe(false);
    });
  });

  describe("seekToPercent", () => {
    it("должна вычислить правильное время seek", () => {
      const store = usePlayerStore();
      const mockAudio = {
        currentTime: 0,
        duration: 100,
      };
      store.audioRef = mockAudio;

      store.seekToPercent(50);

      expect(store.progress).toBe(50);
      expect(store.currentTime).toBe(50);
      expect(mockAudio.currentTime).toBe(50);
    });

    it("должна обработать 0 процентов", () => {
      const store = usePlayerStore();
      const mockAudio = {
        currentTime: 0,
        duration: 100,
      };
      store.audioRef = mockAudio;

      store.seekToPercent(0);

      expect(store.progress).toBe(0);
      expect(mockAudio.currentTime).toBe(0);
    });

    it("должна обработать 100 процентов", () => {
      const store = usePlayerStore();
      const mockAudio = {
        currentTime: 0,
        duration: 100,
      };
      store.audioRef = mockAudio;

      store.seekToPercent(100);

      expect(store.progress).toBe(100);
      expect(mockAudio.currentTime).toBe(100);
    });

    it("должна не делать ничего если audioRef отсутствует", () => {
      const store = usePlayerStore();
      store.audioRef = null;

      expect(() => store.seekToPercent(50)).not.toThrow();
    });

    it("должна не делать ничего если duration 0", () => {
      const store = usePlayerStore();
      const mockAudio = {
        currentTime: 0,
        duration: 0,
      };
      store.audioRef = mockAudio;

      store.seekToPercent(50);

      expect(mockAudio.currentTime).toBe(0); // ← Было 0, осталось 0
      expect(store.progress).toBe(0); // ← Было 0, осталось 0
    });
  });
});
