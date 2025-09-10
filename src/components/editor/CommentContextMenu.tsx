import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { MessageSquare, Copy, Scissors, Edit, Trash2 } from 'lucide-react';

interface CommentContextMenuProps {
  children: React.ReactNode;
  onAddComment: () => void;
}

export function CommentContextMenu({ children, onAddComment }: CommentContextMenuProps) {
  const [selectedText, setSelectedText] = useState<string>('');

  const handleContextMenu = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString());
    }
  };

  const handleAddComment = () => {
    if (selectedText.length > 0) {
      onAddComment();
      // Highlight the selected text
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'bg-yellow-200 border-l-2 border-yellow-400 px-1 cursor-pointer';
        span.setAttribute('data-comment', 'true');
        try {
          range.surroundContents(span);
        } catch (e) {
          // If we can't surround contents, just add the comment
          console.log('Could not highlight text for comment');
        }
        selection.removeAllRanges();
      }
    }
  };

  const handleCopy = () => {
    if (selectedText.length > 0) {
      navigator.clipboard.writeText(selectedText);
    }
  };

  const handleCut = () => {
    if (selectedText.length > 0) {
      navigator.clipboard.writeText(selectedText);
      document.execCommand('delete');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      document.execCommand('insertText', false, text);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger onContextMenu={handleContextMenu}>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56 bg-popover border border-border shadow-lg">
        {selectedText.length > 0 && (
          <>
            <ContextMenuItem 
              onClick={handleAddComment}
              className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              Add comment to "{selectedText.substring(0, 20)}..."
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem 
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer"
            >
              <Copy className="h-4 w-4" />
              Copy
            </ContextMenuItem>
            <ContextMenuItem 
              onClick={handleCut}
              className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer"
            >
              <Scissors className="h-4 w-4" />
              Cut
            </ContextMenuItem>
          </>
        )}
        <ContextMenuItem 
          onClick={handlePaste}
          className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer"
        >
          <Edit className="h-4 w-4" />
          Paste
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}