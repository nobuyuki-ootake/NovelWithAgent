import { useState, useEffect, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentChapterSelector } from "../store/selectors";
import { currentProjectState, currentChapterIdState } from "../store/atoms";
import {
  createEditorValue,
  serializeToText,
  createEmptyEditor,
} from "../utils/editorUtils";
import { v4 as uuidv4 } from "uuid";
import { Descendant } from "slate";
import {
  Chapter,
  TimelineEvent,
  NovelProject,
  // Scene, // 未使用のためコメントアウト
} from "@novel-ai-assistant/types";

export function useWriting() {
  const [editorValue, setEditorValue] = useState<Descendant[]>([]);
  const currentChapter = useRecoilValue(currentChapterSelector);
  const [currentChapterId, setCurrentChapterId] = useRecoilState(
    currentChapterIdState
  );
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectState);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  // 章作成関連
  const [newChapterDialogOpen, setNewChapterDialogOpen] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterSynopsis, setNewChapterSynopsis] = useState("");

  // イベント関連
  const [assignEventsDialogOpen, setAssignEventsDialogOpen] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [eventDetailDialogOpen, setEventDetailDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // 原稿用紙モード関連
  const [manuscriptPages, setManuscriptPages] = useState<string[]>([""]);
  const [currentManuscriptPageIndex, setCurrentManuscriptPageIndex] =
    useState(0);

  // プロジェクトのタイムラインイベント
  const timelineEvents: TimelineEvent[] = currentProject?.timeline || [];

  // デバッグログ
  useEffect(() => {
    console.log("Current project timeline:", currentProject?.timeline);
    console.log("Timeline events in useWriting:", timelineEvents);
  }, [currentProject?.timeline]);

  // 選択されたイベントの詳細情報
  const selectedEvent: TimelineEvent | null =
    currentProject?.timeline?.find((event) => event.id === selectedEventId) ||
    null;

  // 章が切り替わった時 (currentChapterId が変更された時) にエディタとページを初期化
  useEffect(() => {
    if (currentChapter) {
      console.log(
        `useWriting useEffect (triggered by currentChapterId change): Initializing for chapter ${currentChapter.id} (${currentChapter.title}). currentChapterId state: ${currentChapterId}`
      );
      setEditorValue(createEditorValue(currentChapter.content));

      if (
        currentChapter.manuscriptPages &&
        currentChapter.manuscriptPages.length > 0
      ) {
        setManuscriptPages(currentChapter.manuscriptPages);
      } else {
        setManuscriptPages([""]);
      }
      setCurrentManuscriptPageIndex(0);
    } else {
      // currentChapter が null の場合 (例: プロジェクトに章がない、またはIDが不正など)
      // 以前は currentProject?.chapters.length を見ていたが、
      // currentChapter が null ならエディタは空にするのが一貫している
      setEditorValue(createEmptyEditor());
      setManuscriptPages([""]);
      setCurrentManuscriptPageIndex(0);
      if (currentChapterId) {
        // IDがあるのにチャプターが取得できない場合
        console.log(
          `useWriting useEffect: No current chapter found for ID ${currentChapterId}, resetting editor.`
        );
      } else {
        // IDすらない（例えばプロジェクト初期状態など）
        console.log(
          "useWriting useEffect: No current chapter ID, resetting editor."
        );
      }
    }
  }, [currentChapterId]); // 依存配列を currentChapterId に限定

  const handleEditorChange = (value: Descendant[]) => {
    setEditorValue(value);

    if (currentChapter && currentProject) {
      // 章の内容を更新
      const updatedChapters = currentProject.chapters.map((chapter) =>
        chapter.id === currentChapter.id
          ? { ...chapter, content: serializeToText(value) }
          : chapter
      );

      // プロジェクトを更新
      const updatedProject = {
        ...currentProject,
        chapters: updatedChapters,
        updatedAt: new Date(),
      };

      setCurrentProject(updatedProject);

      // ローカルストレージに保存
      const projectsStr = localStorage.getItem("novelProjects");
      if (projectsStr) {
        const projects = JSON.parse(projectsStr);
        const updatedProjects = projects.map((p: NovelProject) =>
          p.id === updatedProject.id ? updatedProject : p
        );
        localStorage.setItem("novelProjects", JSON.stringify(updatedProjects));
      }
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTabIndex(newValue);
  };

  // 章の選択を処理する関数
  const handleChapterSelect = (chapterId: string) => {
    setCurrentChapterId(chapterId);
    console.log(
      `useWriting handleChapterSelect: chapterId set to: ${chapterId}`
    );
  };

  // 新規章作成ダイアログを開く
  const handleOpenNewChapterDialog = () => {
    setNewChapterTitle("");
    setNewChapterSynopsis("");
    setNewChapterDialogOpen(true);
  };

  // 新規章作成ダイアログを閉じる
  const handleCloseNewChapterDialog = () => {
    setNewChapterDialogOpen(false);
  };

  // 新規章を作成する
  const handleCreateChapter = () => {
    if (!currentProject || !newChapterTitle.trim()) return;

    // 新しい章番号を決定（既存の章がある場合は最大値+1、なければ1）
    const newOrder =
      currentProject.chapters.length > 0
        ? Math.max(...currentProject.chapters.map((ch) => ch.order)) + 1
        : 1;

    // 新しい章オブジェクトを作成
    const newChapter: Chapter = {
      id: uuidv4(),
      title: newChapterTitle.trim(),
      synopsis: newChapterSynopsis.trim(),
      content: "",
      order: newOrder,
      scenes: [],
      relatedEvents: [],
      manuscriptPages: [""],
    };

    const updatedProject = {
      ...currentProject,
      chapters: [...currentProject.chapters, newChapter],
      updatedAt: new Date(),
    };

    setCurrentProject(updatedProject);
    setCurrentChapterId(newChapter.id);
    saveProject(updatedProject);
    handleCloseNewChapterDialog();
  };

  // イベント割り当てダイアログを開く
  const handleOpenAssignEventsDialog = () => {
    if (!currentChapter) return;
    setSelectedEvents(currentChapter.relatedEvents || []);
    setAssignEventsDialogOpen(true);
  };

  // イベント割り当てダイアログを閉じる
  const handleCloseAssignEventsDialog = () => {
    setAssignEventsDialogOpen(false);
  };

  // イベントの選択状態を切り替える
  const handleToggleEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  // 選択したイベントを章に割り当てる
  const handleAssignEvents = () => {
    if (!currentProject || !currentChapter) return;
    const updatedChapters = currentProject.chapters.map((chapter) =>
      chapter.id === currentChapter.id
        ? { ...chapter, relatedEvents: selectedEvents }
        : chapter
    );
    const updatedProject = {
      ...currentProject,
      chapters: updatedChapters,
      updatedAt: new Date(),
    };
    setCurrentProject(updatedProject);
    saveProject(updatedProject);
    handleCloseAssignEventsDialog();
  };

  // イベント詳細ダイアログを開く
  const handleOpenEventDetailDialog = (eventId: string) => {
    setSelectedEventId(eventId);
    setEventDetailDialogOpen(true);
  };

  // イベント詳細ダイアログを閉じる
  const handleCloseEventDetailDialog = () => {
    setEventDetailDialogOpen(false);
    setSelectedEventId(null);
  };

  // プロジェクトをローカルストレージに保存する関数
  const saveProject = useCallback((project: NovelProject) => {
    const projectsStr = localStorage.getItem("novelProjects");
    if (projectsStr) {
      const projects = JSON.parse(projectsStr);
      const updatedProjects = projects.map((p: NovelProject) =>
        p.id === project.id ? project : p
      );
      localStorage.setItem("novelProjects", JSON.stringify(updatedProjects));
    }
  }, []);

  // 原稿用紙のページ内容が変更されたときのハンドラ
  const handleManuscriptPageChange = useCallback(
    (pageIndex: number, newHtml: string) => {
      if (!currentProject || !currentChapter) return;

      // manuscriptPages のコピーを作成して更新
      const updatedManuscriptPages = [...manuscriptPages];
      if (pageIndex >= 0 && pageIndex < updatedManuscriptPages.length) {
        updatedManuscriptPages[pageIndex] = newHtml;
        setManuscriptPages(updatedManuscriptPages); // ローカルステートを更新

        // 現在の章の manuscriptPages を更新
        const updatedChapters = currentProject.chapters.map((chapter) =>
          chapter.id === currentChapter.id
            ? { ...chapter, manuscriptPages: updatedManuscriptPages }
            : chapter
        );

        const updatedProject = {
          ...currentProject,
          chapters: updatedChapters,
          updatedAt: new Date(),
        };
        setCurrentProject(updatedProject);
        saveProject(updatedProject);
      } else {
        console.warn(
          `handleManuscriptPageChange: Invalid pageIndex: ${pageIndex}`
        );
      }
    },
    [
      currentProject,
      currentChapter,
      manuscriptPages,
      setCurrentProject,
      saveProject,
    ]
  );

  // 新しい原稿用紙ページを追加するハンドラ
  const handleAddManuscriptPage = useCallback(() => {
    if (!currentProject || !currentChapter) {
      console.warn("handleAddManuscriptPage: No current project or chapter.");
      return;
    }
    console.log(
      "handleAddManuscriptPage: Start. Current manuscriptPages state:",
      [...manuscriptPages] // スプレッド構文で現在の値をキャプチャ
    );

    const newPages = [...manuscriptPages, ""]; // 新しい空のページを追加
    console.log("handleAddManuscriptPage: newPages created:", [...newPages]);
    setManuscriptPages(newPages); // まずローカルのReactステートを更新
    console.log(
      "handleAddManuscriptPage: Called setManuscriptPages with newPages. currentManuscriptPageIndex before update:",
      currentManuscriptPageIndex
    );

    // 新しく追加されたページを現在のページとして設定
    setCurrentManuscriptPageIndex(newPages.length - 1);
    console.log(
      "handleAddManuscriptPage: Called setCurrentManuscriptPageIndex. New index:",
      newPages.length - 1
    );

    // 次に、Recoilで管理しているプロジェクトデータを更新
    const updatedChapters = currentProject.chapters.map((chapter) =>
      chapter.id === currentChapter.id
        ? { ...chapter, manuscriptPages: newPages } // 更新されたページ配列で上書き
        : chapter
    );
    console.log(
      "handleAddManuscriptPage: updatedChapters created. Chapter being updated:",
      currentChapter.id,
      "New manuscriptPages for this chapter:",
      newPages
    );

    const updatedProject = {
      ...currentProject,
      chapters: updatedChapters,
      updatedAt: new Date(),
    };
    setCurrentProject(updatedProject); // Recoilのステートを更新
    console.log(
      "handleAddManuscriptPage: Called setCurrentProject. Project's chapter manuscriptPages should be updated now."
    );

    saveProject(updatedProject); // ローカルストレージに保存

    console.log(
      `handleAddManuscriptPage: End. manuscriptPages state potentially updated. Total pages: ${
        newPages.length
      }, Current index: ${newPages.length - 1}`
    );
  }, [
    currentProject,
    currentChapter,
    manuscriptPages,
    setCurrentProject,
    saveProject,
  ]);

  const handleRemoveManuscriptPage = useCallback(() => {
    if (!currentProject || !currentChapter) return;
    const updatedChapters = currentProject.chapters.map((chapter) =>
      chapter.id === currentChapter.id
        ? {
            ...chapter,
            manuscriptPages: manuscriptPages.filter(
              (_, index) => index !== currentManuscriptPageIndex
            ),
          }
        : chapter
    );
    const updatedProject = {
      ...currentProject,
      chapters: updatedChapters,
      updatedAt: new Date(),
    };
    setCurrentProject(updatedProject);
    saveProject(updatedProject);
  }, [
    currentProject,
    currentChapter,
    manuscriptPages,
    currentManuscriptPageIndex,
    setCurrentProject,
    saveProject,
  ]);

  const handlePreviousManuscriptPage = () => {
    setCurrentManuscriptPageIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextManuscriptPage = () => {
    setCurrentManuscriptPageIndex((prev) =>
      Math.min(manuscriptPages.length - 1, prev + 1)
    );
  };

  // 現在の編集内容を手動で保存する関数
  const handleSaveContent = useCallback(() => {
    if (!currentChapter || !currentProject) return;

    // 章の内容を更新 (エディタの値から)
    const updatedChaptersWithContent = currentProject.chapters.map((chapter) =>
      chapter.id === currentChapter.id
        ? { ...chapter, content: serializeToText(editorValue) }
        : chapter
    );

    // 原稿用紙の内容を更新 (現在のページ配列から)
    const finalChapters = updatedChaptersWithContent.map((chapter) =>
      chapter.id === currentChapter.id
        ? { ...chapter, manuscriptPages: manuscriptPages }
        : chapter
    );

    // プロジェクトを更新
    const updatedProject = {
      ...currentProject,
      chapters: finalChapters,
      updatedAt: new Date(),
    };

    setCurrentProject(updatedProject);
    saveProject(updatedProject);
    alert("内容を保存しました"); // TODO: Snackbarに置き換える
  }, [
    currentChapter,
    currentProject,
    editorValue,
    manuscriptPages,
    saveProject,
    setCurrentProject,
  ]);

  // イベントを章に追加する処理
  const handleAddEventToChapter = (eventId: string) => {
    if (!currentProject || !currentChapter) return;
    const updatedChapters = currentProject.chapters.map((chapter) =>
      chapter.id === currentChapter.id
        ? {
            ...chapter,
            relatedEvents: [...(chapter.relatedEvents || []), eventId],
          }
        : chapter
    );
    const updatedProject = {
      ...currentProject,
      chapters: updatedChapters,
      updatedAt: new Date(),
    };
    setCurrentProject(updatedProject);
    saveProject(updatedProject);
  };

  // イベントを章から削除する処理
  const handleRemoveEventFromChapter = (eventId: string) => {
    if (!currentProject || !currentChapter) return;
    const updatedChapters = currentProject.chapters.map((chapter) =>
      chapter.id === currentChapter.id
        ? {
            ...chapter,
            relatedEvents: chapter.relatedEvents?.filter(
              (id) => id !== eventId
            ),
          }
        : chapter
    );
    const updatedProject = {
      ...currentProject,
      chapters: updatedChapters,
      updatedAt: new Date(),
    };
    setCurrentProject(updatedProject);
    saveProject(updatedProject);
  };

  // 新規イベントを追加する処理 (プロジェクト全体へ)
  const handleAddNewEvent = useCallback(
    (newEvent: TimelineEvent) => {
      if (!currentProject) return;
      const updatedProject = {
        ...currentProject,
        timeline: [...(currentProject.timeline || []), newEvent],
        updatedAt: new Date(),
      };
      setCurrentProject(updatedProject);
      saveProject(updatedProject);
    },
    [currentProject, setCurrentProject, saveProject]
  );

  return {
    editorValue,
    currentChapter,
    currentProject,
    currentChapterId,
    currentTabIndex,
    newChapterDialogOpen,
    newChapterTitle,
    newChapterSynopsis,
    assignEventsDialogOpen,
    eventDetailDialogOpen,
    selectedEvent,
    selectedEvents,
    timelineEvents,
    manuscriptPages,
    currentManuscriptPageIndex,
    handleEditorChange,
    handleTabChange,
    handleChapterSelect,
    handleOpenNewChapterDialog,
    handleCloseNewChapterDialog,
    handleCreateChapter,
    setNewChapterTitle,
    setNewChapterSynopsis,
    handleOpenAssignEventsDialog,
    handleCloseAssignEventsDialog,
    handleToggleEvent,
    handleAssignEvents,
    handleOpenEventDetailDialog,
    handleCloseEventDetailDialog,
    handleSaveContent,
    handleAddEventToChapter,
    handleRemoveEventFromChapter,
    handleAddNewEvent,
    handleManuscriptPageChange,
    handleAddManuscriptPage,
    handleRemoveManuscriptPage,
    handlePreviousManuscriptPage,
    handleNextManuscriptPage,
  };
}
