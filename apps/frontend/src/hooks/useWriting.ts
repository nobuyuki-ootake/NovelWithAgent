import { useState, useEffect, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentChapterSelector } from "../store/selectors";
import { currentProjectState, currentChapterIdState } from "../store/atoms";
import { createEditorValue, serializeToText } from "../utils/editorUtils";
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

  // プロジェクトのタイムラインイベント
  const timelineEvents: TimelineEvent[] = currentProject?.timeline || [];

  // デバッグログ
  useEffect(() => {
    console.log("Current project timeline:", currentProject?.timeline);
    console.log("Timeline events in useWriting:", timelineEvents);
  }, [currentProject, timelineEvents]);

  // 選択されたイベントの詳細情報
  const selectedEvent: TimelineEvent | null =
    currentProject?.timeline?.find((event) => event.id === selectedEventId) ||
    null;

  useEffect(() => {
    if (currentChapter) {
      setEditorValue(createEditorValue(currentChapter.content));
    } else {
      // 選択されている章がない場合は最初の章を選択
      if (currentProject && currentProject.chapters.length > 0) {
        setCurrentChapterId(currentProject.chapters[0].id);
      }
    }
  }, [currentChapter, currentProject, setCurrentChapterId]);

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
      relatedEvents: [], // 関連イベントの配列を追加
    };

    // プロジェクトを更新
    const updatedProject = {
      ...currentProject,
      chapters: [...currentProject.chapters, newChapter],
      updatedAt: new Date(),
    };

    setCurrentProject(updatedProject);
    setCurrentChapterId(newChapter.id); // 新しい章を選択

    // ローカルストレージに保存
    saveProject(updatedProject);

    // ダイアログを閉じる
    handleCloseNewChapterDialog();
  };

  // イベント割り当てダイアログを開く
  const handleOpenAssignEventsDialog = () => {
    if (!currentChapter) return;

    // 現在の章に割り当てられているイベントIDを設定
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

    // 章を更新
    const updatedChapters = currentProject.chapters.map((chapter) =>
      chapter.id === currentChapter.id
        ? { ...chapter, relatedEvents: selectedEvents }
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
    saveProject(updatedProject);

    // ダイアログを閉じる
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

  // 現在の編集内容を手動で保存する関数
  const handleSaveContent = useCallback(() => {
    if (!currentChapter || !currentProject) return;

    // 章の内容を更新
    const updatedChapters = currentProject.chapters.map((chapter) =>
      chapter.id === currentChapter.id
        ? { ...chapter, content: serializeToText(editorValue) }
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
    saveProject(updatedProject);

    // ユーザーに通知（実際には通知コンポーネントなどを使うと良い）
    alert("内容を保存しました");
  }, [
    currentChapter,
    currentProject,
    editorValue,
    saveProject,
    setCurrentProject,
  ]);

  // イベントを章に追加する処理
  const handleAddEventToChapter = (eventId: string) => {
    if (!currentProject || !currentChapter) return;

    // 既に追加されていれば何もしない
    if (currentChapter.relatedEvents?.includes(eventId)) return;

    // 章を更新
    const updatedChapters = currentProject.chapters.map((chapter) =>
      chapter.id === currentChapter.id
        ? {
            ...chapter,
            relatedEvents: [...(chapter.relatedEvents || []), eventId],
          }
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
    saveProject(updatedProject);
  };

  // イベントを追加する処理
  const handleAddNewEvent = useCallback(
    (newEvent: TimelineEvent) => {
      if (!currentProject) return;

      // タイムラインに新しいイベントを追加
      const updatedTimeline = [...(currentProject.timeline || []), newEvent];

      // プロジェクトを更新
      const updatedProject = {
        ...currentProject,
        timeline: updatedTimeline,
        updatedAt: new Date(),
      };

      console.log("新しいイベントを追加:", newEvent);
      console.log("更新後のタイムライン:", updatedTimeline);

      // Recoilのステートを更新
      setCurrentProject(updatedProject);

      // ローカルストレージに保存
      saveProject(updatedProject);

      // 作成したイベントを自動的に現在の章に関連付ける
      if (currentChapter) {
        handleAddEventToChapter(newEvent.id);
      }
    },
    [
      currentProject,
      currentChapter,
      setCurrentProject,
      saveProject,
      handleAddEventToChapter,
    ]
  );

  return {
    editorValue,
    currentChapter,
    currentProject,
    currentTabIndex,
    currentChapterId,
    timelineEvents,
    newChapterDialogOpen,
    newChapterTitle,
    newChapterSynopsis,
    assignEventsDialogOpen,
    selectedEvents,
    eventDetailDialogOpen,
    selectedEvent,
    handleEditorChange,
    handleTabChange,
    handleChapterSelect,
    handleOpenNewChapterDialog,
    handleCloseNewChapterDialog,
    setNewChapterTitle,
    setNewChapterSynopsis,
    handleCreateChapter,
    handleOpenAssignEventsDialog,
    handleCloseAssignEventsDialog,
    handleToggleEvent,
    handleAssignEvents,
    handleOpenEventDetailDialog,
    handleCloseEventDetailDialog,
    handleAddEventToChapter,
    handleAddNewEvent,
    handleSaveContent,
    serializeToText,
  };
}
