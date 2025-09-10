import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Document } from '@/types/editor';

interface DocumentsListProps {
  documents: Document[];
  activeDocument: Document | null;
  onDocumentSelect: (document: Document) => void;
  onCreateDocument: () => void;
}

export function DocumentsList({
  documents,
  activeDocument,
  onDocumentSelect,
  onCreateDocument,
}: DocumentsListProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search documents..."
            className="pl-9 bg-sidebar-accent"
          />
        </div>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {documents.map((document) => (
            <Button
              key={document.id}
              variant="ghost"
              className={cn(
                "w-full justify-start h-auto p-3 text-left",
                activeDocument?.id === document.id && "bg-sidebar-accent"
              )}
              onClick={() => onDocumentSelect(document)}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sidebar-foreground truncate">
                  {document.title}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span>{formatDate(document.updatedAt)}</span>
                  <span>•</span>
                  <span>{document.wordCount} words</span>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Create New Document */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={onCreateDocument}
          className="w-full gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          New Document
        </Button>
      </div>
    </div>
  );
}