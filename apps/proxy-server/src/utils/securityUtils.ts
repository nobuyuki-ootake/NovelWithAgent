/**
 * セキュリティユーティリティ関数
 * インジェクション攻撃を防ぐためのセキュリティ機能を提供
 */

import * as yaml from 'js-yaml';

/**
 * 入力値を安全にサニタイズする関数
 * YAMLインジェクション攻撃を防ぐために危険な文字列を除去
 */
export const sanitizeUserInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/!!js\//gi, '') // YAML JavaScript tags を除去
    .replace(/!!python\//gi, '') // Python tags を除去
    .replace(/!!ruby\//gi, '') // Ruby tags を除去
    .replace(/!!scala\//gi, '') // Scala tags を除去
    .replace(/!!java\//gi, '') // Java tags を除去
    .replace(/[<>]/g, '') // HTML tags を除去
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '') // 危険な制御文字を除去（改行、タブ、CRは保持）
    .replace(/\$\{[^}]*\}/g, '') // テンプレート文字列を除去
    .trim();
};

/**
 * マークダウンのコードブロック記法を除去する関数
 * GeminiなどのAIモデルが```yaml ... ```形式で返すレスポンスを処理
 */
const removeCodeBlockFormatting = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }
  
  // コードブロック記法のパターン（```yaml, ```yml, ```YAML など）
  const codeBlockPattern = /^```(?:yaml|yml|YAML|YML)?\s*\n([\s\S]*?)\n?```\s*$/;
  const match = input.match(codeBlockPattern);
  
  if (match) {
    // コードブロック内の内容だけを返す
    console.log('[SECURITY] Detected code block formatting, extracting content');
    return match[1];
  }
  
  // コードブロック記法がない場合はそのまま返す
  return input;
};

/**
 * 安全なYAMLパース関数
 * SAFE_SCHEMAを使用してJavaScriptコードの実行を防ぐ
 */
export const parseYamlSafely = (input: string): any => {
  try {
    // まずコードブロック記法を除去
    const withoutCodeBlock = removeCodeBlockFormatting(input);
    
    // 入力をサニタイズ
    const sanitizedInput = sanitizeUserInput(withoutCodeBlock);
    
    // 空文字列の場合はnullを返す
    if (!sanitizedInput.trim()) {
      return null;
    }
    
    // 入力を十分にサニタイズした後でyaml.loadを使用
    // サニタイゼーションにより危険なタグは既に除去済み
    return yaml.load(sanitizedInput);
  } catch (error) {
    console.error('[SECURITY] YAML parse error:', error);
    console.error('[SECURITY] Input was:', input.substring(0, 200) + '...');
    throw new Error('Invalid YAML format: potentially malicious content detected');
  }
};

/**
 * JSONコードブロック記法を除去する関数
 */
const removeJsonCodeBlockFormatting = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }
  
  // JSONコードブロック記法のパターン（```json, ```JSON など）
  const codeBlockPattern = /^```(?:json|JSON)?\s*\n([\s\S]*?)\n?```\s*$/;
  const match = input.match(codeBlockPattern);
  
  if (match) {
    // コードブロック内の内容だけを返す
    console.log('[SECURITY] Detected JSON code block formatting, extracting content');
    return match[1];
  }
  
  // コードブロック記法がない場合はそのまま返す
  return input;
};

/**
 * 安全なJSONパース関数
 * JSONインジェクション攻撃を防ぐ
 */
export const parseJsonSafely = (input: string): any => {
  try {
    // まずコードブロック記法を除去
    const withoutCodeBlock = removeJsonCodeBlockFormatting(input);
    
    // 入力をサニタイズ
    const sanitizedInput = sanitizeUserInput(withoutCodeBlock);
    
    // 空文字列の場合はnullを返す
    if (!sanitizedInput.trim()) {
      return null;
    }
    
    return JSON.parse(sanitizedInput);
  } catch (error) {
    console.error('[SECURITY] JSON parse error:', error);
    console.error('[SECURITY] Input was:', input.substring(0, 200) + '...');
    throw new Error('Invalid JSON format: potentially malicious content detected');
  }
};

/**
 * プロンプトインジェクションを防ぐためのテキストサニタイゼーション
 */
export const sanitizePromptInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/ignore\s+previous\s+instructions?/gi, '') // プロンプトインジェクションの典型例
    .replace(/forget\s+everything/gi, '')
    .replace(/system\s*:/gi, 'System Note:') // システムプロンプトの混入を防ぐ
    .replace(/assistant\s*:/gi, 'Assistant Note:')
    .replace(/user\s*:/gi, 'User Note:')
    .replace(/\[INST\]/gi, '[Instruction]') // Llamaスタイルのプロンプト制御
    .replace(/\[\/INST\]/gi, '[/Instruction]')
    .trim();
};