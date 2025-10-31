import React from 'react';
import { TiptapEditor, type TiptapEditorProps } from './TiptapEditor';

export interface RichTextEditorProps extends Omit<TiptapEditorProps, 'content' | 'onContentChange'> {
  value: string;
  onChange: (value: string) => void;
}

/**
 * RichTextEditor - TiptapEditor의 간편한 래퍼 컴포넌트
 *
 * value/onChange를 사용하여 폼 컨트롤처럼 사용할 수 있습니다.
 *
 * @example
 * ```tsx
 * const [content, setContent] = useState('');
 *
 * <RichTextEditor
 *   value={content}
 *   onChange={setContent}
 *   uploadCategory="notice"
 *   minHeight="400px"
 *   uploadConfig={myUploadConfig}
 * />
 * ```
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  ...rest
}) => {
  return (
    <TiptapEditor
      content={value}
      onContentChange={onChange}
      {...rest}
    />
  );
};
