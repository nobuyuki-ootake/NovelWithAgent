import { Project } from "../types/project";

/**
 * プロジェクトエクスポート用のユーティリティクラス
 */
export class ExportUtil {
  /**
   * プロジェクトをJSONファイルとしてエクスポートする
   * @param project エクスポートするプロジェクト
   * @returns ダウンロードが開始されたかどうか
   */
  static exportProjectAsJson(project: Project): boolean {
    try {
      // プロジェクトデータをJSON文字列に変換
      const projectJson = JSON.stringify(project, null, 2);

      // Blobオブジェクトを作成
      const blob = new Blob([projectJson], { type: "application/json" });

      // ダウンロードリンクを作成
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${project.name.replace(/\s+/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.json`;

      // ダウンロードを開始
      document.body.appendChild(link);
      link.click();

      // クリーンアップ
      URL.revokeObjectURL(url);
      document.body.removeChild(link);

      return true;
    } catch (error) {
      console.error("プロジェクトのエクスポートに失敗しました:", error);
      return false;
    }
  }

  /**
   * プロジェクトの統計情報をテキストファイルとしてエクスポートする
   * @param project エクスポートするプロジェクト
   * @returns ダウンロードが開始されたかどうか
   */
  static exportProjectStats(project: Project): boolean {
    try {
      const stats = this.generateProjectStats(project);

      // テキストファイルとしてBlobオブジェクトを作成
      const blob = new Blob([stats], { type: "text/plain;charset=utf-8" });

      // ダウンロードリンクを作成
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${project.name.replace(/\s+/g, "_")}_stats_${
        new Date().toISOString().split("T")[0]
      }.txt`;

      // ダウンロードを開始
      document.body.appendChild(link);
      link.click();

      // クリーンアップ
      URL.revokeObjectURL(url);
      document.body.removeChild(link);

      return true;
    } catch (error) {
      console.error("プロジェクト統計のエクスポートに失敗しました:", error);
      return false;
    }
  }

  /**
   * プロジェクトを小説テキストとしてエクスポートする
   * @param project エクスポートするプロジェクト
   * @returns ダウンロードが開始されたかどうか
   */
  static exportNovelText(project: Project): boolean {
    try {
      // 章ごとのテキストを結合
      let novelText = `# ${project.name}\n\n`;

      if (project.description) {
        novelText += `${project.description}\n\n`;
      }

      // 各章のテキストを追加
      project.chapters
        .sort((a, b) => a.order - b.order)
        .forEach((chapter) => {
          novelText += `## ${chapter.title}\n\n${chapter.content}\n\n`;

          // セクションがある場合は追加
          if (chapter.sections && chapter.sections.length > 0) {
            chapter.sections
              .sort((a, b) => a.order - b.order)
              .forEach((section) => {
                novelText += `### ${section.title}\n\n${section.content}\n\n`;
              });
          }
        });

      // テキストファイルとしてBlobオブジェクトを作成
      const blob = new Blob([novelText], { type: "text/plain;charset=utf-8" });

      // ダウンロードリンクを作成
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${project.name.replace(/\s+/g, "_")}_text_${
        new Date().toISOString().split("T")[0]
      }.txt`;

      // ダウンロードを開始
      document.body.appendChild(link);
      link.click();

      // クリーンアップ
      URL.revokeObjectURL(url);
      document.body.removeChild(link);

      return true;
    } catch (error) {
      console.error("小説テキストのエクスポートに失敗しました:", error);
      return false;
    }
  }

  /**
   * プロジェクトの統計情報を生成する
   * @param project 統計を生成するプロジェクト
   * @returns 統計情報のテキスト
   */
  private static generateProjectStats(project: Project): string {
    // 文字数と単語数を計算
    let totalCharCount = 0;
    let totalWordCount = 0;

    project.chapters.forEach((chapter) => {
      // 章の本文の文字数
      totalCharCount += chapter.content.length;

      // おおよその単語数（スペースで区切られた単語数）
      const words = chapter.content
        .split(/\s+/)
        .filter((word) => word.length > 0);
      totalWordCount += words.length;

      // セクションがある場合はその文字数も追加
      if (chapter.sections && chapter.sections.length > 0) {
        chapter.sections.forEach((section) => {
          totalCharCount += section.content.length;
          const sectionWords = section.content
            .split(/\s+/)
            .filter((word) => word.length > 0);
          totalWordCount += sectionWords.length;
        });
      }
    });

    // 統計情報のテキストを生成
    let stats = `「${project.name}」の統計情報\n`;
    stats += `===================================\n\n`;
    stats += `作成日: ${new Date(project.createdAt).toLocaleDateString(
      "ja-JP"
    )}\n`;
    stats += `最終更新日: ${new Date(project.updatedAt).toLocaleDateString(
      "ja-JP"
    )}\n\n`;

    stats += `キャラクター数: ${project.characters.length}名\n`;
    stats += `場所数: ${project.worldBuilding.places.length}箇所\n`;
    stats += `タイムラインイベント数: ${project.timeline.length}件\n`;
    stats += `章数: ${project.chapters.length}章\n\n`;

    stats += `総文字数: ${totalCharCount}文字\n`;
    stats += `総単語数: ${totalWordCount}語\n\n`;

    if (project.metadata.wordCountGoal) {
      const progress = (totalWordCount / project.metadata.wordCountGoal) * 100;
      stats += `単語数目標: ${project.metadata.wordCountGoal}語\n`;
      stats += `進捗: ${progress.toFixed(2)}%\n\n`;
    }

    if (project.metadata.genre && project.metadata.genre.length > 0) {
      stats += `ジャンル: ${project.metadata.genre.join(", ")}\n`;
    }

    if (project.metadata.tags && project.metadata.tags.length > 0) {
      stats += `タグ: ${project.metadata.tags.join(", ")}\n`;
    }

    return stats;
  }
}
