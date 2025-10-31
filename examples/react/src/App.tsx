import { useState } from 'react';
import { RichTextEditor, type UploadConfig } from '@mesoft/tiptap-editor/react';
import './App.css';

function App() {
  const [content, setContent] = useState(
    '<h1>Welcome to Mesoft Tiptap Editor!</h1><p>Start editing...</p>'
  );
  const [unusedImages, setUnusedImages] = useState<string[]>([]);

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

  const handleUnusedImagesChange = (urls: string[]) => {
    setUnusedImages(urls);
    console.log('Unused images:', urls);
  };

  const handleSave = () => {
    console.log('Saving content:', content);
    if (unusedImages.length > 0) {
      console.log('Cleaning up unused images:', unusedImages);
      uploadConfig.deleteImages?.(unusedImages);
    }
    alert('Content saved! (Check console for details)');
  };

  return (
    <div className="container">
      <header>
        <h1>🎨 Mesoft Tiptap Editor - React Example</h1>
        <p>S3 presigned URL 업로드를 지원하는 리치 텍스트 에디터</p>
      </header>

      <main>
        <div className="editor-section">
          <h2>에디터</h2>
          <RichTextEditor
            value={content}
            onChange={setContent}
            uploadCategory="temp"
            minHeight="400px"
            uploadConfig={uploadConfig}
            onUnusedImagesChange={handleUnusedImagesChange}
          />
          <div className="actions">
            <button onClick={handleSave} className="btn-primary">
              저장
            </button>
          </div>
        </div>

        <div className="preview-section">
          <h2>HTML 출력</h2>
          <pre>
            <code>{content}</code>
          </pre>
        </div>

        {unusedImages.length > 0 && (
          <div className="info-section">
            <h3>⚠️ 사용하지 않는 이미지</h3>
            <ul>
              {unusedImages.map((imageUrl, index) => (
                <li key={index}>{imageUrl}</li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <footer>
        <p>
          Built with <a href="https://tiptap.dev" target="_blank" rel="noopener noreferrer">Tiptap</a> and{' '}
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">React</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
