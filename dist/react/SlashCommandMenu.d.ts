import React from 'react';
import type { SlashCommandItem } from '../core/types';
export interface SlashCommandMenuProps {
    items: SlashCommandItem[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}
export declare const SlashCommandMenu: React.FC<SlashCommandMenuProps>;
//# sourceMappingURL=SlashCommandMenu.d.ts.map