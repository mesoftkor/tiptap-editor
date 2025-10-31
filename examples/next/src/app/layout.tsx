import type { Metadata } from 'next';
import '@mesoft/tiptap-editor/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mesoft Tiptap Editor - Next.js Example',
  description: 'S3 presigned URL 업로드를 지원하는 리치 텍스트 에디터'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
