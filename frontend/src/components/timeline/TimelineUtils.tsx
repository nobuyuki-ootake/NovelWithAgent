import { Character } from "../../types";

// キャラクターの役割に応じたアイコンとカラーを定義
export const getCharacterIcon = (character: Character) => {
  switch (character.role) {
    case "protagonist":
      return {
        color: "#FFD700", // ゴールド
        emoji: "👑",
      };
    case "antagonist":
      return {
        color: "#DC143C", // クリムゾン
        emoji: "😈",
      };
    case "supporting":
      return {
        color: "#4169E1", // ロイヤルブルー
        emoji: "🙂",
      };
    default:
      return {
        color: "#808080", // グレー
        emoji: "👤",
      };
  }
};
