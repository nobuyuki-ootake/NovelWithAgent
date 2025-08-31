// テストスクリプト: コードブロック記法の処理をテスト
import { parseYamlSafely, parseJsonSafely } from './dist/utils/securityUtils.js';

console.log('===== YAMLパーステスト =====');

// テストケース1: コードブロック記法付きYAML
const yamlWithCodeBlock = `\`\`\`yaml
---
- name: "オトハ・クロエ"
  role: "protagonist"
  importance: "主要"
  description: "過労死し、スキルなしで異世界に転生した元会社員。"
- name: "サイラス・アーレン"
  role: "supporting"
  importance: "主要"
  description: "王国の辺境を守る無口で実直な騎士。"
\`\`\``;

try {
  const parsed1 = parseYamlSafely(yamlWithCodeBlock);
  console.log('✓ テスト1成功: コードブロック記法付きYAML');
  console.log('  パース結果:', JSON.stringify(parsed1, null, 2));
} catch (error) {
  console.error('✗ テスト1失敗:', error.message);
}

// テストケース2: 通常のYAML（コードブロックなし）
const normalYaml = `---
- name: "テストキャラ1"
  role: "protagonist"
- name: "テストキャラ2"
  role: "antagonist"`;

try {
  const parsed2 = parseYamlSafely(normalYaml);
  console.log('✓ テスト2成功: 通常のYAML');
  console.log('  パース結果:', JSON.stringify(parsed2, null, 2));
} catch (error) {
  console.error('✗ テスト2失敗:', error.message);
}

console.log('\n===== JSONパーステスト =====');

// テストケース3: コードブロック記法付きJSON
const jsonWithCodeBlock = `\`\`\`json
{
  "characters": [
    {
      "name": "主人公",
      "role": "protagonist"
    }
  ]
}
\`\`\``;

try {
  const parsed3 = parseJsonSafely(jsonWithCodeBlock);
  console.log('✓ テスト3成功: コードブロック記法付きJSON');
  console.log('  パース結果:', JSON.stringify(parsed3, null, 2));
} catch (error) {
  console.error('✗ テスト3失敗:', error.message);
}

// テストケース4: 通常のJSON
const normalJson = `{"name": "テスト", "value": 123}`;

try {
  const parsed4 = parseJsonSafely(normalJson);
  console.log('✓ テスト4成功: 通常のJSON');
  console.log('  パース結果:', JSON.stringify(parsed4, null, 2));
} catch (error) {
  console.error('✗ テスト4失敗:', error.message);
}

console.log('\n===== すべてのテスト完了 =====');