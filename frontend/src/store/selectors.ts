import { selector } from "recoil";
import { currentProjectState, currentChapterIdState } from "./atoms";
import { Chapter } from "../types";

// 現在選択されている章を取得するセレクタ
export const currentChapterSelector = selector<Chapter | null>({
  key: "currentChapter",
  get: ({ get }) => {
    const currentProject = get(currentProjectState);
    const currentChapterId = get(currentChapterIdState);

    if (!currentProject || !currentChapterId) {
      return null;
    }

    return (
      currentProject.chapters.find(
        (chapter) => chapter.id === currentChapterId
      ) || null
    );
  },
});

// 章の順序でソートされた章リストを取得するセレクタ
export const sortedChaptersSelector = selector({
  key: "sortedChapters",
  get: ({ get }) => {
    const currentProject = get(currentProjectState);

    if (!currentProject) {
      return [];
    }

    return [...currentProject.chapters].sort((a, b) => a.order - b.order);
  },
});

// キャラクター名の一覧を取得するセレクタ
export const characterNamesSelector = selector({
  key: "characterNames",
  get: ({ get }) => {
    const currentProject = get(currentProjectState);

    if (!currentProject) {
      return [];
    }

    return currentProject.characters.map((character) => ({
      id: character.id,
      name: character.name,
      role: character.role,
    }));
  },
});
