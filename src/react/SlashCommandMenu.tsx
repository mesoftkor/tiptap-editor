import React from 'react';
import type { SlashCommandItem } from '../core/types';

export interface SlashCommandMenuProps {
  items: SlashCommandItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  items,
  selectedIndex,
  onSelect
}) => {
  return (
    <div className="mesoft-slash-menu">
      {items.length === 0 ? (
        <div className="mesoft-slash-menu-empty">명령어가 없습니다</div>
      ) : (
        items.map((item, index) => (
          <button
            key={`${item.title}-${index}`}
            type="button"
            className={`mesoft-slash-menu-item ${index === selectedIndex ? 'selected' : ''}`}
            onClick={() => onSelect(index)}
          >
            <span className="icon">{item.icon}</span>
            <div className="content">
              <div className="title">{item.title}</div>
            </div>
          </button>
        ))
      )}
    </div>
  );
};
