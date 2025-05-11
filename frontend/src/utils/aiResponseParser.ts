import { v4 as uuidv4 } from "uuid";
import { Character, CharacterTrait } from "../types";
import { WorldBuildingElement } from "../types/worldBuilding";

/**
 * AIレスポンスから世界観要素をパースする
 * @param aiResponse AIのレスポンステキスト
 */
export const parseWorldBuildingElement = (
  aiResponse: string
): WorldBuildingElement | null => {
  try {
    // 名前の抽出
    const nameMatch = aiResponse.match(/名前[：:]\s*(.+?)($|\n)/);
    if (!nameMatch || !nameMatch[1]?.trim()) {
      console.log("要素名が見つかりませんでした");
      return null;
    }

    const name = nameMatch[1].trim();
    console.log(`世界観要素「${name}」のパース処理開始`);

    // タイプの抽出
    const typeMatch = aiResponse.match(/タイプ[：:]\s*(.+?)($|\n)/);
    const type = typeMatch && typeMatch[1] ? typeMatch[1].trim() : "place";
    console.log(`要素タイプ: ${type}`);

    // 正規化されたタイプ（小文字に変換して比較用）
    const normalizedType = type.toLowerCase().trim();

    // 説明の抽出 - 複数行も考慮
    const descriptionMatch = aiResponse.match(
      /説明[：:]\s*(.+?)(?=\n\n|\n(?:特徴|重要性|立地|習慣|影響|関連)[：:]|$)/s
    );
    const description =
      descriptionMatch && descriptionMatch[1] ? descriptionMatch[1].trim() : "";
    console.log(`説明: ${description ? "あり" : "なし"}`);

    // 特徴の抽出 - 複数行も考慮
    const featuresMatch = aiResponse.match(
      /特徴[：:]\s*(.+?)(?=\n\n|\n(?:重要性|立地|習慣|影響|関連)[：:]|$)/s
    );
    const features =
      featuresMatch && featuresMatch[1] ? featuresMatch[1].trim() : "";
    console.log(`特徴: ${features ? "あり" : "なし"}`);

    // 重要性の抽出
    const importanceMatch = aiResponse.match(
      /重要性[：:]\s*(.+?)(?=\n\n|\n(?:立地|習慣|影響|関連)[：:]|$)/s
    );
    const importance =
      importanceMatch && importanceMatch[1] ? importanceMatch[1].trim() : "";
    console.log(`重要性: ${importance ? "あり" : "なし"}`);

    // 場所タイプ特有のフィールド
    let location = "";
    let population = "";
    let culturalFeatures = "";

    if (normalizedType.includes("場所") || normalizedType === "place") {
      // 立地の抽出
      const locationMatch = aiResponse.match(
        /立地[：:]\s*(.+?)(?=\n\n|\n(?:人口|文化|関連)[：:]|$)/s
      );
      location =
        locationMatch && locationMatch[1] ? locationMatch[1].trim() : "";

      // 人口の抽出
      const populationMatch = aiResponse.match(
        /人口[：:]\s*(.+?)(?=\n\n|\n(?:文化|関連)[：:]|$)/s
      );
      population =
        populationMatch && populationMatch[1] ? populationMatch[1].trim() : "";

      // 文化的特徴の抽出
      const culturalMatch = aiResponse.match(
        /文化的特徴[：:]\s*(.+?)(?=\n\n|\n(?:関連)[：:]|$)/s
      );
      culturalFeatures =
        culturalMatch && culturalMatch[1] ? culturalMatch[1].trim() : "";
    }

    // 文化タイプ特有のフィールド
    let customs = "";
    let beliefs = "";
    let history = "";

    if (normalizedType.includes("文化") || normalizedType === "culture") {
      // 習慣の抽出
      const customsMatch = aiResponse.match(
        /習慣[：:]\s*(.+?)(?=\n\n|\n(?:信念|歴史|関連)[：:]|$)/s
      );
      customs = customsMatch && customsMatch[1] ? customsMatch[1].trim() : "";

      // 信念の抽出
      const beliefsMatch = aiResponse.match(
        /信念[：:]\s*(.+?)(?=\n\n|\n(?:歴史|関連)[：:]|$)/s
      );
      beliefs = beliefsMatch && beliefsMatch[1] ? beliefsMatch[1].trim() : "";

      // 歴史の抽出
      const historyMatch = aiResponse.match(
        /歴史[：:]\s*(.+?)(?=\n\n|\n(?:関連)[：:]|$)/s
      );
      history = historyMatch && historyMatch[1] ? historyMatch[1].trim() : "";
    }

    // ルールタイプ特有のフィールド
    let impact = "";
    let exceptions = "";
    let origin = "";

    if (normalizedType.includes("ルール") || normalizedType === "rule") {
      // 影響の抽出
      const impactMatch = aiResponse.match(
        /影響[：:]\s*(.+?)(?=\n\n|\n(?:例外|由来|関連)[：:]|$)/s
      );
      impact = impactMatch && impactMatch[1] ? impactMatch[1].trim() : "";

      // 例外の抽出
      const exceptionsMatch = aiResponse.match(
        /例外[：:]\s*(.+?)(?=\n\n|\n(?:由来|関連)[：:]|$)/s
      );
      exceptions =
        exceptionsMatch && exceptionsMatch[1] ? exceptionsMatch[1].trim() : "";

      // 由来の抽出
      const originMatch = aiResponse.match(
        /由来[：:]\s*(.+?)(?=\n\n|\n(?:関連)[：:]|$)/s
      );
      origin = originMatch && originMatch[1] ? originMatch[1].trim() : "";
    }

    // 関連事項の抽出
    const relationsMatch = aiResponse.match(/関連事項[：:]\s*(.+?)(?=\n\n|$)/s);
    const relations =
      relationsMatch && relationsMatch[1] ? relationsMatch[1].trim() : "";

    // 標準化されたタイプを設定（日本語の場合も英語に統一）
    let standardizedType = "element"; // デフォルト値

    if (normalizedType.includes("場所") || normalizedType === "place") {
      standardizedType = "place";
    } else if (
      normalizedType.includes("文化") ||
      normalizedType === "culture"
    ) {
      standardizedType = "culture";
    } else if (normalizedType.includes("ルール") || normalizedType === "rule") {
      standardizedType = "rule";
    } else if (
      normalizedType.includes("歴史") ||
      normalizedType === "history"
    ) {
      standardizedType = "history";
    } else if (normalizedType.includes("伝説") || normalizedType === "legend") {
      standardizedType = "legend";
    } else if (
      normalizedType.includes("技術") ||
      normalizedType === "technology"
    ) {
      standardizedType = "technology";
    } else if (normalizedType.includes("魔法") || normalizedType === "magic") {
      standardizedType = "magic";
    }

    const parsedElement: WorldBuildingElement = {
      id: uuidv4(),
      name,
      type: standardizedType,
      originalType: type, // 元のタイプも保持
      description,
      features,
      importance,
      // 場所特有のフィールド
      location,
      population,
      culturalFeatures,
      // 文化特有のフィールド
      customs,
      beliefs,
      history,
      // ルール特有のフィールド
      impact,
      exceptions,
      origin,
      // 関連事項
      relations,
    };

    console.log(`世界観要素「${name}」のパース完了`);
    return parsedElement;
  } catch (error) {
    console.error("AIレスポンスのパースエラー:", error);
    return null;
  }
};

/**
 * AIのレスポンスからキャラクターデータに変換する関数
 * @param aiResponse AIレスポンステキスト
 */
export const parseAIResponseToCharacter = (
  aiResponse: string
): Character | null => {
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
      descriptionMatch && descriptionMatch[1] ? descriptionMatch[1].trim() : "";
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
        imageUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(emoji)}`;
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

/**
 * 複数キャラクターのパース
 * @param aiResponse AIレスポンステキスト
 */
export const parseAIResponseToCharacters = (
  aiResponse: string
): Character[] => {
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
