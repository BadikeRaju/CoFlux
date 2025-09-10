import { useEffect, useState } from 'react';
import { $createParagraphNode, $createTextNode, $getRoot, $getSelection, $isRangeSelection } from 'lexical';
import { $createHeadingNode } from '@lexical/rich-text';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { ListNode, ListItemNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { EditorToolbar } from './EditorToolbar';
import { CommentContextMenu } from './CommentContextMenu';
import { cn } from '@/lib/utils';

const theme = {
  heading: {
    h1: 'text-3xl font-bold mb-4 mt-6',
    h2: 'text-2xl font-semibold mb-3 mt-5',
    h3: 'text-xl font-medium mb-2 mt-4',
    h4: 'text-lg font-medium mb-2 mt-3',
    h5: 'text-base font-medium mb-1 mt-2',
    h6: 'text-sm font-medium mb-1 mt-2',
  },
  paragraph: 'mb-3 leading-relaxed',
  quote: 'border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700',
  list: {
    nested: {
      listitem: 'list-none',
    },
    ol: 'list-decimal ml-6 mb-3',
    ul: 'list-disc ml-6 mb-3',
    listitem: 'mb-1',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    code: 'bg-gray-100 px-1 py-0.5 rounded text-sm font-mono',
  },
};

interface TextEditorProps {
  onContentChange?: (content: string) => void;
  initialContent?: string;
  className?: string;
  onCommentToggle?: () => void;
}

function MyOnChangePlugin({ onChange }: { onChange: (content: string) => void }) {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const content = root.getTextContent();
        onChange(content);
      });
    });
  }, [editor, onChange]);
  
  return null;
}

function InitialContentPlugin({ content }: { content: string }) {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    if (content) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(content));
        root.append(paragraph);
      });
    }
  }, [editor, content]);
  
  return null;
}

export function TextEditor(props: TextEditorProps) {
  const {
    onContentChange,
    initialContent = '',
    className = '',
    onCommentToggle
  } = props;
  const initialConfig = {
    namespace: 'CoFlux Editor',
    theme,
    onError: (error: Error) => {
      console.error('Lexical error:', error);
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
  };

  const handleContentChange = (content: string) => {
    onContentChange?.(content);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <LexicalComposer initialConfig={initialConfig}>
        <EditorToolbar onCommentToggle={onCommentToggle} />
        <div className="flex-1 relative overflow-auto">
          <CommentContextMenu onAddComment={() => onCommentToggle?.()}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable 
                  className="min-h-full p-8 focus:outline-none resize-none w-full max-w-4xl mx-auto text-left leading-relaxed text-base"
                  style={{ 
                    minHeight: 'calc(100vh - 120px)',
                    background: 'hsl(var(--editor-background))',
                    lineHeight: '1.6',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                />
              }
              placeholder={
                <div className="absolute top-8 left-8 text-muted-foreground pointer-events-none max-w-4xl mx-auto">
                  Start writing your document...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </CommentContextMenu>
        </div>
        <HistoryPlugin />
        <ListPlugin />
        {onContentChange && <MyOnChangePlugin onChange={handleContentChange} />}
        {initialContent && <InitialContentPlugin content={initialContent} />}
      </LexicalComposer>
    </div>
  );
}