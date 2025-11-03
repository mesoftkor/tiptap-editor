import { Extension } from '@tiptap/core';
import type { SlashCommandItem } from '../types';
export { type SlashCommandItem };
/**
 * 슬래시 명령 확장
 */
export declare const SlashCommand: Extension<any, any>;
/**
 * 기본 슬래시 명령 아이템 목록
 */
export declare function getDefaultSlashItems({ query }: {
    query: string;
}): SlashCommandItem[];
//# sourceMappingURL=slash-command.d.ts.map