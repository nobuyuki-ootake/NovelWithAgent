const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://localhost:5173/home');
  // await expect(page.locator('html')).toMatchAriaSnapshot(`
  //   - document:
  //     - heading "小説創作支援ツール" [level=1]
  //     - button "新規プロジェクト"
  //     - heading "プロジェクト一覧" [level=2]
  //     - paragraph: プロジェクトがありません。新規プロジェクトを作成してください。
  //     - heading "ツールの特徴" [level=2]
  //     - list:
  //       - listitem:
  //         - text: 物語の構造化
  //         - paragraph: あらすじ、プロット、キャラクター設定などを体系的に管理できます。
  //       - listitem:
  //         - text: 世界観構築支援
  //         - paragraph: 小説の世界観や設定を詳細に作り込むための各種ツールを提供します。
  //       - listitem:
  //         - text: タイムライン管理
  //         - paragraph: 物語の時系列を視覚的に管理し、整合性を保ちながら創作できます。
  //       - listitem:
  //         - text: AIアシスタント連携
  //         - paragraph: 創作過程でAIアシスタントからアドバイスやアイデアを得られます。
  //     - heading "使い方" [level=2]
  //     - list:
  //       - listitem:
  //         - text: 1. プロジェクトの作成
  //         - paragraph: 「新規プロジェクト」ボタンから小説のプロジェクトを作成します。
  //       - listitem:
  //         - text: 2. 設定の作成
  //         - paragraph: あらすじ、プロット、キャラクター、世界観などの設定を作成します。
  //       - listitem:
  //         - text: 3. タイムラインの整理
  //         - paragraph: 物語の出来事を時系列順に配置し、整合性を確認します。
  //       - listitem:
  //         - text: 4. 執筆と編集
  //         - paragraph: 設定に基づいて執筆を進め、必要に応じてAIのサポートを受けられます。
  //   `);
  await page.getByRole('button', { name: '新規プロジェクト' }).click();
  // await expect(page.locator('body')).toMatchAriaSnapshot(`
  //   - dialog "新規プロジェクト作成":
  //     - heading "新規プロジェクト作成" [level=2]
  //     - textbox "プロジェクト名"
  //     - button "キャンセル"
  //     - button "作成" [disabled]
  //   `);
  await page.getByRole('textbox', { name: 'プロジェクト名' }).click();
  await page.getByRole('textbox', { name: 'プロジェクト名' }).fill('New project');
  await page.getByRole('button', { name: '作成' }).click();
  await page.getByRole('button', { name: 'キャラクター' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  // await expect(page.locator('html')).toMatchAriaSnapshot(`
  //   - document:
  //     - main:
  //       - heading "キャラクター" [level=1]
  //       - group "表示モード":
  //         - button "グリッド表示" [pressed]
  //         - button "リスト表示"
  //       - button "新規キャラクター"
  //       - paragraph: まだキャラクターがありません
  //       - button "キャラクターを作成する"
  //       - button "menu"
  //     - button
  //     - heading "AIアシスタント" [level=6]
  //     - list:
  //       - paragraph: AIアシスタントとの会話を開始しましょう。 プロットやキャラクター、文章について質問や相談ができます。
  //     - textbox "メッセージを入力..."
  //     - button "送信" [disabled]
  //   `);
  await page.getByRole('button', { name: '新規キャラクター' }).click();
  await page.getByRole('textbox', { name: '名前' }).click();
  await page.getByRole('textbox', { name: '名前' }).fill('taro');
  await page.getByRole('combobox', { name: '役割 脇役' }).click();
  await page.getByRole('option', { name: '主人公' }).click();
  await page.getByRole('button', { name: '保存' }).click();
  // await expect(page.locator('html')).toMatchAriaSnapshot(`
  //   - document:
  //     - main:
  //       - heading "キャラクター" [level=1]
  //       - group "表示モード":
  //         - button "グリッド表示" [pressed]
  //         - button "リスト表示"
  //       - button "新規キャラクター"
  //       - text: 👑 taro 主人公
  //       - paragraph: 説明がありません
  //       - button "詳細"
  //       - button
  //       - button
  //       - alert:
  //         - text: 新しいキャラクターを作成しました
  //         - button "Close"
  //       - button "menu"
  //     - button
  //     - heading "AIアシスタント" [level=6]
  //     - list:
  //       - paragraph: AIアシスタントとの会話を開始しましょう。 プロットやキャラクター、文章について質問や相談ができます。
  //     - textbox "メッセージを入力..."
  //     - button "送信" [disabled]
  //   `);
  await page.getByRole('button', { name: 'menu' }).click();
  await page.getByRole('button', { name: '世界観構築' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  // await expect(page.locator('html')).toMatchAriaSnapshot(`
  //   - document:
  //     - main:
  //       - heading "New project" [level=4]
  //       - heading "世界観構築" [level=6]
  //       - tablist "world building tabs":
  //         - tab "ワールドマップ" [selected]
  //         - tab "世界観設定"
  //         - tab "ルール"
  //         - tab "地名"
  //         - tab "社会と文化"
  //         - tab "地理と環境"
  //         - tab "歴史と伝説"
  //         - tab "魔法と技術"
  //         - tab "自由入力"
  //       - tabpanel:
  //         - heading "ワールドマップ" [level=6]
  //         - paragraph: 世界のマップ画像をアップロードしてください
  //         - button "マップ画像をアップロード"
  //         - paragraph: 物語の舞台となる世界のマップを視覚化することで、世界観をより具体的に設計できます。 場所や領域、地形などを描いた画像をアップロードしてください。
  //       - button "保存" [disabled]
  //       - button "menu"
  //     - button
  //     - heading "AIアシスタント" [level=6]
  //     - list:
  //       - paragraph: AIアシスタントとの会話を開始しましょう。 プロットやキャラクター、文章について質問や相談ができます。
  //     - textbox "メッセージを入力..."
  //     - button "送信" [disabled]
  //   `);
  await page.getByRole('tab', { name: '地名' }).click();
  // await expect(page.locator('html')).toMatchAriaSnapshot(`
  //   - document:
  //     - main:
  //       - heading "New project" [level=4]
  //       - heading "世界観構築" [level=6]
  //       - tablist "world building tabs":
  //         - tab "ワールドマップ"
  //         - tab "世界観設定"
  //         - tab "ルール"
  //         - tab "地名" [selected]
  //         - tab "社会と文化"
  //         - tab "地理と環境"
  //         - tab "歴史と伝説"
  //         - tab "魔法と技術"
  //         - tab "自由入力"
  //       - tabpanel:
  //         - heading "地名" [level=6]
  //         - paragraph: 物語の舞台となる重要な場所を追加しましょう
  //         - button "新規地名登録"
  //         - text: 地名
  //         - textbox "地名"
  //         - text: 物語における重要性
  //         - textbox "物語における重要性"
  //         - text: 説明
  //         - textbox "説明"
  //         - button "追加" [disabled]
  //         - paragraph: 地名がありません。「新規地名登録」から追加してください。
  //       - button "保存" [disabled]
  //       - button "menu"
  //     - button
  //     - heading "AIアシスタント" [level=6]
  //     - list:
  //       - paragraph: AIアシスタントとの会話を開始しましょう。 プロットやキャラクター、文章について質問や相談ができます。
  //     - textbox "メッセージを入力..."
  //     - button "送信" [disabled]
  //   `);
  await page.getByRole('textbox', { name: '地名' }).click();
  await page.getByRole('textbox', { name: '地名' }).fill('japan');
  await page.getByRole('button', { name: '追加' }).click();
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByRole('button', { name: 'menu' }).click();
  await page.getByRole('button', { name: 'タイムライン' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('button', { name: 'イベント追加' }).click();
  await page.getByRole('textbox', { name: 'イベントタイトル' }).click();
  await page.getByRole('textbox', { name: 'イベントタイトル' }).fill('new event');
  await page.getByRole('combobox', { name: '関連キャラクター' }).click();
  await page.getByRole('option', { name: '👑 taro' }).click();
  await page.locator('#menu- > .MuiBackdrop-root').click();
  await page.getByRole('combobox', { name: '関連地名' }).click();
  await page.getByRole('option', { name: 'japan' }).click();
  await page.locator('#menu- div').first().click();
  await page.getByRole('button', { name: '追加' }).click();
  await page.getByRole('button', { name: '保存' }).click();
  await page.getByRole('button', { name: 'menu' }).click();
  await page.getByRole('button', { name: '本文執筆' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.locator('div').filter({ hasText: /^章が作成されていません章が選択されていません左側のリストから章を選択するか、新しい章を作成してください。新規章作成$/ }).getByRole('button').click();
  await page.getByRole('textbox', { name: '章のタイトル' }).click();
  await page.getByRole('textbox', { name: '章のタイトル' }).fill('1章');
  await page.getByRole('button', { name: '作成' }).click();
  await page.getByRole('button', { name: 'イベントを割り当て' }).click();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: '保存' }).click();
  // await expect(page.locator('#root')).toMatchAriaSnapshot(`
  //   - main:
  //     - heading "New project" [level=4]
  //     - heading "1章" [level=5]
  //     - button "新規章作成"
  //     - list:
  //       - listitem:
  //         - button "1. 1章 概要なし":
  //           - paragraph: 概要なし
  //     - heading "関連イベント" [level=6]
  //     - button "イベントを割り当て"
  //     - list:
  //       - listitem:
  //         - button /new event \\d+-\\d+-\\d+:/:
  //           - paragraph:
  //             - paragraph: /\\d+-\\d+-\\d+:/
  //     - tablist:
  //       - tab "原稿用紙モード" [selected]
  //       - tab "プレビューモード"
  //     - textbox
  //     - button "menu"
  //   - button
  //   - heading "AIアシスタント" [level=6]
  //   - list:
  //     - paragraph: AIアシスタントとの会話を開始しましょう。 プロットやキャラクター、文章について質問や相談ができます。
  //   - textbox "メッセージを入力..."
  //   - button "送信" [disabled]
  //   `);

  // ---------------------
  await context.close();
  await browser.close();
})();