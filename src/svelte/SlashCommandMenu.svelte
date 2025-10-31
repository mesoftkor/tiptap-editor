<script lang="ts">
  import type { SlashCommandItem } from '../core/types';

  let {
    items = $bindable<SlashCommandItem[]>([]),
    selectedIndex = $bindable(0),
    onSelect
  }: {
    items?: SlashCommandItem[];
    selectedIndex?: number;
    onSelect?: (index: number) => void;
  } = $props();

  function selectItem(index: number) {
    if (onSelect) {
      onSelect(index);
    }
  }
</script>

<div class="mesoft-slash-menu">
  {#if items.length === 0}
    <div class="mesoft-slash-menu-empty">명령어가 없습니다</div>
  {:else}
    {#each items as item, index}
      <button
        type="button"
        class="mesoft-slash-menu-item"
        class:selected={index === selectedIndex}
        onclick={() => selectItem(index)}
      >
        <span class="icon">{item.icon}</span>
        <div class="content">
          <div class="title">{item.title}</div>
        </div>
      </button>
    {/each}
  {/if}
</div>

<style>
  .mesoft-slash-menu {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    max-height: 500px;
    overflow-y: auto;
    min-width: 220px;
    z-index: 10;
  }

  .mesoft-slash-menu-empty {
    padding: 0.5rem;
    font-size: 0.75rem;
    color: #64748b;
  }

  .mesoft-slash-menu-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem;
    text-align: left;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: background-color 0.15s;
  }

  .mesoft-slash-menu-item:hover,
  .mesoft-slash-menu-item.selected {
    background-color: #f1f5f9;
  }

  .mesoft-slash-menu-item:first-child {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }

  .mesoft-slash-menu-item:last-child {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }

  .icon {
    font-size: 0.875rem;
  }

  .content {
    flex: 1;
  }

  .title {
    font-weight: 500;
    color: #1e293b;
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .mesoft-slash-menu {
      background: #1e293b;
      border-color: #334155;
    }

    .mesoft-slash-menu-empty {
      color: #94a3b8;
    }

    .mesoft-slash-menu-item:hover,
    .mesoft-slash-menu-item.selected {
      background-color: #334155;
    }

    .title {
      color: #f1f5f9;
    }
  }
</style>
