import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { TextAlign } from '@tiptap/extension-text-align'
import { Underline } from '@tiptap/extension-underline'
import { Link } from '@tiptap/extension-link'
import { Image } from '@tiptap/extension-image'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { useEffect, useState } from 'react'
import { TiptapToolbar } from './TiptapToolbar'
import { CommentContextMenu } from './CommentContextMenu'
import { cn } from '@/lib/utils'

interface TiptapEditorProps {
  onContentChange?: (content: string) => void;
  initialContent?: string;
  className?: string;
  onCommentToggle?: () => void;
  documentId?: string;
}


export function TiptapEditor(props: TiptapEditorProps) {
  const {
    onContentChange,
    initialContent = '',
    className = '',
    onCommentToggle,
    documentId
  } = props;

  const [isReady, setIsReady] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'min-h-full p-8 focus:outline-none resize-none w-full max-w-4xl mx-auto text-left leading-relaxed text-base prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        style: 'min-height: calc(100vh - 120px); line-height: 1.6; font-family: system-ui, -apple-system, sans-serif;',
        'data-placeholder': 'Start writing your document...',
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      onContentChange?.(content)
    },
  })

  // Initialize content when editor is ready
  useEffect(() => {
    if (editor && initialContent && !isReady) {
      editor.commands.setContent(initialContent)
      setIsReady(true)
    }
  }, [editor, initialContent, isReady])

  // Update content when documentId changes
  useEffect(() => {
    if (editor && documentId) {
      // Clear and set new content for new document
      editor.commands.setContent(initialContent || '')
    }
  }, [documentId, editor, initialContent])

  if (!editor) {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading editor...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <TiptapToolbar 
        editor={editor} 
        onCommentToggle={onCommentToggle} 
      />
      <div className="flex-1 relative overflow-auto">
        <CommentContextMenu onAddComment={() => onCommentToggle?.()}>
          <EditorContent 
            editor={editor}
            className="h-full"
          />
        </CommentContextMenu>
      </div>
    </div>
  )
}
