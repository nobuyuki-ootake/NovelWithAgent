import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { useCharacters } from "../hooks/useCharacters";
import CharacterList from "../features/characters/CharacterList";
import CharacterForm from "../components/characters/CharacterForm";
import { AIAssistButton } from "../components/ui/AIAssistButton";
import { AIAssistModal } from "../components/modals/AIAssistModal";
import { useAIAssist } from "../hooks/useAIAssist";
import { useRecoilValue } from "recoil";
import { currentProjectState } from "../store/atoms";
import { v4 as uuidv4 } from "uuid";
import { Character, CharacterTrait } from "../types";

const CharactersPage: React.FC = () => {
  const [aiAssistModalOpen, setAiAssistModalOpen] = useState(false);
  const currentProject = useRecoilValue(currentProjectState);

  const {
    characters,
    viewMode,
    openDialog,
    editMode,
    formData,
    formErrors,
    tempImageUrl,
    selectedEmoji,
    newTrait,
    newCustomField,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    handleViewModeChange,
    handleOpenDialog,
    handleEditCharacter,
    handleCloseDialog,
    handleImageUpload,
    handleEmojiSelect,
    handleInputChange,
    handleSelectChange,
    handleAddTrait,
    handleRemoveTrait,
    handleNewTraitChange,
    handleCustomFieldChange,
    handleAddCustomField,
    handleRemoveCustomField,
    handleDeleteCharacter,
    handleSaveCharacter,
    handleCloseSnackbar,
    handleSaveStatus,
    handleDeleteStatus,
    addCharacter,
  } = useCharacters();

  // AIアシスト機能を使用
  const { generateCharactersBatch, isLoading } = useAIAssist({
    onCharacterGenerated: (result) => {
      if (result && result.response) {
        // 個別のキャラクターをパースして追加
        const character = parseAIResponseToCharacter(result.response);
        if (character) {
          console.log(`キャラクター「${character.name}」を追加します`);
          // 必ず新しいIDを割り当てて追加（既存キャラクターとの重複を避ける）
          const newCharacterId = uuidv4();

          // 関係性のIDも更新
          const updatedRelationships = character.relationships.map((rel) => ({
            ...rel,
            id: uuidv4(), // 関係性のIDを更新
          }));

          // 最終的なキャラクターオブジェクト
          const newCharacter = {
            ...character,
            id: newCharacterId,
            relationships: updatedRelationships,
          };

          // キャラクターを追加
          addCharacter(newCharacter);
        }
      }
    },
    onCharacterGenerationProgress: (progress, character, total) => {
      console.log(
        `生成進捗: ${Math.round(progress * 100)}%`,
        character?.name,
        `${total || "?"}人中`
      );
    },
  });

  // AIアシスタントを開く
  const handleOpenAIAssist = async () => {
    setAiAssistModalOpen(true);
    return Promise.resolve();
  };

  // AIアシストリクエスト実行
  const handleAIAssist = async (message: string) => {
    // あらすじとプロットを参照してキャラクター生成をリクエスト
    const synopsis = currentProject?.synopsis || "";
    const plotElements = currentProject?.plot || [];
    const existingCharacters = currentProject?.characters || [];

    // 分割生成モードを使用
    return await generateCharactersBatch(
      message,
      [
        ...plotElements.map((item) => ({ type: "plotItem", content: item })),
        { type: "synopsis", content: synopsis },
      ],
      existingCharacters.map((char) => ({ type: "character", content: char }))
    );
  };

  // AIアシスト完了時の処理
  const handleAIAssistComplete = (result: any) => {
    if (result && result.batchResponse && result.characters) {
      console.log(
        "バッチ生成完了:",
        result.totalCharacters,
        "人のキャラクターが生成されました"
      );

      // バッチ処理の場合は個別キャラクターがすでに追加済みなので
      // ここでの追加処理は不要
    } else if (result && result.response) {
      // 従来の処理 - 一括レスポンスからキャラクターをパース
      const characters = parseAIResponseToCharacters(result.response);
      console.log("追加するキャラクター:", characters.length, "件");

      // すべてのキャラクターを追加
      characters.forEach((character) => {
        addCharacter(character); // IDはパース時にすでに設定済み
      });
    }
  };

  // AIのレスポンスをキャラクターデータに変換する関数
  const parseAIResponseToCharacter = (aiResponse: string): Character | null => {
    try {
      // 名前の抽出
      const nameMatch = aiResponse.match(/名前[：:]\s*(.+?)($|\n)/);
      if (!nameMatch || !nameMatch[1]?.trim()) {
        console.log("名前が見つかりませんでした");
        return null;
      }

      const name = nameMatch[1].trim();
      console.log(`キャラクター「${name}」のパース処理開始`);

      // 役割の抽出と変換
      const roleMatch = aiResponse.match(/役割[：:]\s*(.+?)($|\n)/);
      let role: "protagonist" | "antagonist" | "supporting" = "supporting";
      if (roleMatch && roleMatch[1]) {
        const roleName = roleMatch[1].trim();
        if (roleName.includes("主人公")) role = "protagonist";
        else if (roleName.includes("敵役")) role = "antagonist";
        console.log(`役割: ${role}`);
      }

      // 性別の抽出
      const genderMatch = aiResponse.match(/性別[：:]\s*(.+?)($|\n)/);
      const gender = genderMatch && genderMatch[1] ? genderMatch[1].trim() : "";
      console.log(`性別: ${gender}`);

      // 年齢の抽出
      const ageMatch = aiResponse.match(/年齢[：:]\s*(.+?)($|\n)/);
      const birthDate = ageMatch && ageMatch[1] ? ageMatch[1].trim() : "";
      console.log(`年齢/誕生日: ${birthDate}`);

      // 説明の抽出 - 複数行も考慮
      const descriptionMatch = aiResponse.match(
        /説明[：:]\s*(.+?)(?=\n\n|\n(?:背景|動機|特性|アイコン|関係)[：:]|$)/s
      );
      const description =
        descriptionMatch && descriptionMatch[1]
          ? descriptionMatch[1].trim()
          : "";
      console.log(`説明: ${description ? "あり" : "なし"}`);

      // 背景の抽出 - 複数行も考慮
      const backgroundMatch = aiResponse.match(
        /背景[：:]\s*(.+?)(?=\n\n|\n(?:動機|特性|アイコン|関係)[：:]|$)/s
      );
      const background =
        backgroundMatch && backgroundMatch[1] ? backgroundMatch[1].trim() : "";
      console.log(`背景: ${background ? "あり" : "なし"}`);

      // 動機の抽出 - 複数行も考慮
      const motivationMatch = aiResponse.match(
        /動機[：:]\s*(.+?)(?=\n\n|\n(?:特性|アイコン|関係)[：:]|$)/s
      );
      const motivation =
        motivationMatch && motivationMatch[1] ? motivationMatch[1].trim() : "";
      console.log(`動機: ${motivation ? "あり" : "なし"}`);

      // 特性の抽出 - 改行や句読点で区切られたリスト
      const traitsMatch = aiResponse.match(
        /特性[：:]\s*(.+?)(?=\n\n|\n(?:アイコン|関係)[：:]|$)/s
      );
      const traits: CharacterTrait[] = [];
      if (traitsMatch && traitsMatch[1]) {
        // カンマ、読点、改行で分割
        const traitList = traitsMatch[1].split(/[,、\n]/);
        traitList.forEach((trait) => {
          const trimmedTrait = trait.trim();
          if (trimmedTrait) {
            traits.push({
              id: uuidv4(),
              name: trimmedTrait,
              value: "",
            });
          }
        });
      }
      console.log(`特性数: ${traits.length}`);

      // アイコンの抽出
      const iconMatch = aiResponse.match(/アイコン[：:]\s*(.+?)(?=$|\n)/);
      let imageUrl = "";
      if (iconMatch && iconMatch[1]) {
        const emoji = iconMatch[1].trim().match(/[^\s]+/)?.[0] || "";
        const availableEmojis = [
          "👑",
          "😈",
          "🙂",
          "👤",
          "🦸",
          "🦹",
          "🧙",
          "👸",
          "🤴",
          "👩‍🚀",
          "👨‍🚀",
          "👩‍🔬",
          "👨‍🔬",
          "🧝",
          "🧛",
          "🧟",
          "🧞",
          "🥷",
          "🧚",
          "🧜",
          "🧝‍♀️",
          "🧙‍♂️",
          "🦊",
          "🐱",
          "🐶",
          "🐺",
          "🦁",
          "🐯",
          "🌸",
          "🤖",
        ];

        // 有効な絵文字かチェック
        if (emoji && availableEmojis.includes(emoji)) {
          // 絵文字をデータURLに変換
          imageUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(
            emoji
          )}`;
          console.log(`アイコン: ${emoji}`);
        } else {
          // 役割に基づいたデフォルトのアイコンを使用
          const defaultEmoji =
            role === "protagonist" ? "👑" : role === "antagonist" ? "😈" : "🙂";
          imageUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(
            defaultEmoji
          )}`;
          console.log(`デフォルトアイコン: ${defaultEmoji}`);
        }
      } else {
        // デフォルトのアイコン（役割に基づく）
        const defaultEmoji =
          role === "protagonist" ? "👑" : role === "antagonist" ? "😈" : "🙂";
        imageUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(
          defaultEmoji
        )}`;
        console.log(`デフォルトアイコン: ${defaultEmoji}`);
      }

      // 関係性の抽出 - 一般にリスト形式で提供される
      const relationships: {
        id: string;
        targetCharacterId: string;
        type: string;
        description: string;
      }[] = [];
      const relationshipsMatch = aiResponse.match(
        /関係[：:]\s*(.+?)(?=\n\n|\n(?:名前)[：:]|$)/s
      );

      if (relationshipsMatch && relationshipsMatch[1]) {
        // 各行を取得
        const relationLines = relationshipsMatch[1]
          .split(/\n/)
          .filter((line) => line.trim().startsWith("-"));
        relationLines.forEach((line) => {
          // - キャラクター名: 関係タイプ - 説明 の形式を想定
          const relationMatch = line.match(
            /\s*-\s*([^:]+)[：:]\s*([^-]+)-\s*(.+)/
          );
          if (relationMatch) {
            const targetName = relationMatch[1].trim();
            const relationType = relationMatch[2].trim();
            const description = relationMatch[3].trim();

            relationships.push({
              id: uuidv4(),
              targetCharacterId: targetName, // 実際のIDではなく、名前を一時的に保存
              type: relationType,
              description: description,
            });
            console.log(`関係性追加: ${targetName} - ${relationType}`);
          }
        });
      }
      console.log(`関係性数: ${relationships.length}`);

      // 新しいキャラクターオブジェクトを作成
      const newCharacter: Character = {
        id: "", // 呼び出し側で設定
        name: name,
        role,
        gender,
        birthDate,
        description,
        background,
        motivation,
        traits,
        relationships,
        imageUrl,
        customFields: [],
        statuses: [],
      };

      console.log(`キャラクター「${name}」のパース完了`);
      return newCharacter;
    } catch (error) {
      console.error("AIレスポンスのパースエラー:", error);
      return null;
    }
  };

  // 複数キャラパース用
  const parseAIResponseToCharacters = (aiResponse: string): Character[] => {
    console.log("AIレスポンス:", aiResponse); // デバッグ用

    // チャラクター区切りパターンを探す
    // より厳密なパターン: 空行2つまたは「名前:」という文字列で始まる行
    const characterBlocks: string[] = [];

    // AIモデルのフォーマットがばらつくことを考慮し、複数の分割パターンを試す
    // 1. まず、完全な空行2つで区切られたブロックを識別
    let blocks = aiResponse.split(/\n\s*\n\s*\n/);

    // 1つしかブロックがない場合は、より緩い条件で分割を試みる
    if (blocks.length <= 1) {
      // 2. 空行1つでの区切りを試す
      blocks = aiResponse.split(/\n\s*\n/);
    }

    // ブロックが少なすぎる場合、名前で区切る最後の手段を試す
    if (blocks.length <= 1) {
      // 名前:で始まるブロックごとに分割
      const namePattern = /(?:^|\n)名前[：:]/g;
      let match;
      let startIndex = 0;

      // 各「名前:」の位置を見つけて、それぞれのブロックを抽出
      while ((match = namePattern.exec(aiResponse)) !== null) {
        if (startIndex > 0) {
          // 前のブロックの終わりから現在のブロックの始まりまでを抽出
          const block = aiResponse.substring(startIndex, match.index);
          characterBlocks.push("名前:" + block);
        }
        // 次のブロックの開始位置を保存（「名前:」の長さを除く）
        startIndex = match.index + match[0].length;
      }

      // 最後のブロックを追加
      if (startIndex > 0 && startIndex < aiResponse.length) {
        const lastBlock = aiResponse.substring(startIndex);
        characterBlocks.push("名前:" + lastBlock);
      }
    } else {
      // 空行区切りがうまくいった場合の処理
      blocks.forEach((block) => {
        const trimmedBlock = block.trim();
        if (trimmedBlock) {
          // ブロックに「名前:」がなければ追加
          if (
            !trimmedBlock.startsWith("名前:") &&
            !trimmedBlock.startsWith("名前：")
          ) {
            characterBlocks.push("名前:" + trimmedBlock);
          } else {
            characterBlocks.push(trimmedBlock);
          }
        }
      });
    }

    console.log("分割されたブロック数:", characterBlocks.length); // デバッグ用
    characterBlocks.forEach((block, index) => {
      console.log(`ブロック ${index + 1}:`, block.substring(0, 50) + "..."); // 各ブロックの冒頭部分のみを表示
    });

    // 各ブロックをキャラクターにパース
    const characters = characterBlocks
      .map((block) => {
        try {
          const character = parseAIResponseToCharacter(block);
          if (character) {
            console.log("パースしたキャラクター:", character.name); // デバッグ用
            return { ...character, id: uuidv4() }; // ここでIDを設定
          }
          return null;
        } catch (e) {
          console.error("キャラクターパースエラー:", e);
          return null;
        }
      })
      .filter(Boolean) as Character[];

    // 関係性処理: 名前からIDへの変換
    // キャラクター名からIDへのマッピングを作成
    const nameToIdMap = new Map<string, string>();
    characters.forEach((character) => {
      nameToIdMap.set(character.name.toLowerCase(), character.id);
    });

    // 各キャラクターの関係性を処理
    characters.forEach((character) => {
      character.relationships = character.relationships.map((rel) => {
        // targetCharacterIdが名前の場合、IDに変換
        if (
          typeof rel.targetCharacterId === "string" &&
          !rel.targetCharacterId.match(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
          )
        ) {
          const targetName = rel.targetCharacterId.toLowerCase();
          const targetId = nameToIdMap.get(targetName);
          if (targetId) {
            return { ...rel, targetCharacterId: targetId };
          }
        }
        return rel;
      });
    });

    console.log("最終的なキャラクター数:", characters.length); // デバッグ用
    return characters;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* ヘッダー部分 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          キャラクター
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AIAssistButton
            onAssist={handleOpenAIAssist}
            text="AIにキャラクターを考えてもらう"
            variant="outline"
            disabled={isLoading}
            className="mr-2"
          />
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="表示モード"
            size="small"
            sx={{ mr: 2 }}
          >
            <ToggleButton value="grid" aria-label="グリッド表示">
              <GridViewIcon />
            </ToggleButton>
            <ToggleButton value="list" aria-label="リスト表示">
              <ListViewIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenDialog}
          >
            新規キャラクター
          </Button>
        </Box>
      </Box>

      {/* キャラクター一覧 */}
      <CharacterList
        characters={characters.map((character) => ({
          ...character,
          description: character.description || "",
          background: character.background || "",
          motivation: character.motivation || "",
          traits: character.traits ?? [],
          relationships: (character.relationships ?? []).map((rel) => ({
            ...rel,
            description: rel.description || "",
          })),
          customFields: character.customFields ?? [],
          statuses: character.statuses || [],
        }))}
        viewMode={viewMode}
        onAddCharacter={handleOpenDialog}
        onEditCharacter={(character) =>
          handleEditCharacter({
            ...character,
            description: character.description || "",
            background: character.background || "",
            motivation: character.motivation || "",
            traits: character.traits ?? [],
            relationships: (character.relationships ?? []).map((rel) => ({
              ...rel,
              description: rel.description || "",
            })),
            customFields: character.customFields ?? [],
            statuses: character.statuses || [],
          })
        }
        onDeleteCharacter={handleDeleteCharacter}
      />

      {/* キャラクター編集ダイアログ */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "キャラクターを編集" : "新規キャラクター作成"}
        </DialogTitle>
        <DialogContent dividers>
          <CharacterForm
            formData={{
              ...formData,
            }}
            formErrors={formErrors}
            selectedEmoji={selectedEmoji}
            tempImageUrl={tempImageUrl}
            newTrait={newTrait}
            newCustomField={newCustomField}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onImageUpload={handleImageUpload}
            onEmojiSelect={handleEmojiSelect}
            onNewTraitChange={handleNewTraitChange}
            onAddTrait={handleAddTrait}
            onRemoveTrait={handleRemoveTrait}
            onCustomFieldChange={handleCustomFieldChange}
            onAddCustomField={handleAddCustomField}
            onRemoveCustomField={handleRemoveCustomField}
            onSave={handleSaveCharacter}
            onCancel={handleCloseDialog}
            onSaveStatus={handleSaveStatus}
            onDeleteStatus={handleDeleteStatus}
          />
        </DialogContent>
      </Dialog>

      {/* AIアシストモーダル */}
      <AIAssistModal
        open={aiAssistModalOpen}
        onClose={() => setAiAssistModalOpen(false)}
        title="AIにキャラクターを作成してもらう"
        description="あらすじとプロットを参照して、物語に登場するキャラクターを作成します。"
        defaultMessage={`物語に登場する全ての主要キャラクターを、1キャラごとに「名前:」「役割:」「性別:」「年齢:」「説明:」「背景:」「動機:」「特性:」「アイコン:」の形式でまとめて出力してください。`}
        onAssistComplete={handleAIAssistComplete}
        requestAssist={handleAIAssist}
      />

      {/* スナックバー通知 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CharactersPage;
