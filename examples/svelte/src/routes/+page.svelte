<script lang="ts">
  import { RichTextEditor, type UploadConfig } from '@mesoft/tiptap-editor/svelte';

  let content = $state('<h1>Welcome to Mesoft Tiptap Editor!</h1><p>Start editing...</p>');
  let unusedImages = $state<string[]>([]);

  // Mock S3 업로드 설정 (실제로는 백엔드 API 호출)
  const uploadConfig: UploadConfig = {
    getPresignedUrl: async (filename, contentType, category) => {
      // 실제 환경에서는 백엔드 API를 호출합니다
      console.log('Mock presigned URL request:', { filename, contentType, category });

      // Mock response
      return {
        uploadUrl: 'https://mock-s3-url.com/upload',
        publicUrl: `https://mock-cdn.com/${category}/${filename}`
      };
    },
    deleteImages: async (imageUrls) => {
      console.log('Deleting images:', imageUrls);
      return {
        success: true,
        deletedCount: imageUrls.length
      };
    }
  };

  function handleUnusedImagesChange(urls: string[]) {
    unusedImages = urls;
    console.log('Unused images:', urls);
  }

  function handleSave() {
    console.log('Saving content:', content);
    if (unusedImages.length > 0) {
      console.log('Cleaning up unused images:', unusedImages);
      uploadConfig.deleteImages?.(unusedImages);
    }
    alert('Content saved! (Check console for details)');
  }
</script>

<div class="container">
  <header>
    <h1>🎨 Mesoft Tiptap Editor - Svelte Example</h1>
    <p>S3 presigned URL 업로드를 지원하는 리치 텍스트 에디터</p>
  </header>

  <main>
    <div class="editor-section">
      <h2>에디터</h2>
      <RichTextEditor
        bind:value={content}
        uploadCategory="temp"
        minHeight="400px"
        {uploadConfig}
        onUnusedImagesChange={handleUnusedImagesChange}
      />
      <div class="actions">
        <button onclick={handleSave} class="btn-primary">저장</button>
      </div>
    </div>

    <div class="preview-section">
      <h2>HTML 출력</h2>
      <pre><code>{content}</code></pre>
    </div>

    {#if unusedImages.length > 0}
      <div class="info-section">
        <h3>⚠️ 사용하지 않는 이미지</h3>
        <ul>
          {#each unusedImages as imageUrl}
            <li>{imageUrl}</li>
          {/each}
        </ul>
      </div>
    {/if}
  </main>

  <footer>
    <p>
      Built with <a href="https://tiptap.dev" target="_blank">Tiptap</a> and
      <a href="https://svelte.dev" target="_blank">Svelte</a>
    </p>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: #f5f5f5;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  header {
    text-align: center;
    margin-bottom: 3rem;
  }

  header h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 0.5rem;
  }

  header p {
    font-size: 1.125rem;
    color: #666;
  }

  main {
    display: grid;
    gap: 2rem;
  }

  .editor-section {
    background: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .editor-section h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #333;
  }

  .actions {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
  }

  .btn-primary {
    padding: 0.75rem 1.5rem;
    background: #3c50e0;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-primary:hover {
    background: #2a3eb8;
  }

  .preview-section {
    background: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .preview-section h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #333;
  }

  pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 1rem;
    border-radius: 0.375rem;
    overflow-x: auto;
    font-size: 0.875rem;
  }

  code {
    font-family: 'Courier New', monospace;
  }

  .info-section {
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 0.5rem;
    padding: 1.5rem;
  }

  .info-section h3 {
    margin-top: 0;
    color: #856404;
  }

  .info-section ul {
    margin: 0;
    padding-left: 1.5rem;
  }

  .info-section li {
    color: #856404;
    word-break: break-all;
  }

  footer {
    text-align: center;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #ddd;
    color: #666;
  }

  footer a {
    color: #3c50e0;
    text-decoration: none;
  }

  footer a:hover {
    text-decoration: underline;
  }
</style>
