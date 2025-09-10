import { useState } from 'react';
import { Share2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Document, User } from '@/types/editor';

interface EditorHeaderProps {
  document: Document | null;
  users: User[];
  currentUser: User;
  onShare: () => void;
  onSettings: () => void;
  onTitleChange: (title: string) => void;
}

export function EditorHeader({
  document,
  users,
  currentUser,
  onShare,
  onSettings,
  onTitleChange,
}: EditorHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(document?.title || '');

  const handleTitleSubmit = () => {
    if (tempTitle.trim()) {
      onTitleChange(tempTitle.trim());
    } else {
      setTempTitle(document?.title || '');
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTempTitle(document?.title || '');
      setIsEditingTitle(false);
    }
  };

  const activeUsers = users.filter(user => user.status === 'online');

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-4">
      {/* Left Section - Title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {isEditingTitle ? (
          <Input
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={handleTitleKeyDown}
            className="h-8 text-lg font-medium bg-transparent border-none shadow-none focus-visible:ring-1 focus-visible:ring-ring max-w-md"
            autoFocus
          />
        ) : (
          <button
            onClick={() => {
              setTempTitle(document?.title || '');
              setIsEditingTitle(true);
            }}
            className="text-lg font-medium hover:bg-accent hover:text-accent-foreground px-2 py-1 rounded transition-colors truncate max-w-md text-left"
          >
            {document?.title || 'Untitled Document'}
          </button>
        )}
      </div>

      {/* Right Section - Actions & Users */}
      <div className="flex items-center gap-2">
        {/* Active Users */}
        {activeUsers.length > 0 && (
          <div className="flex items-center gap-1 mr-2">
            <div className="flex -space-x-2">
              {activeUsers.slice(0, 3).map((user) => (
                <Avatar key={user.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {activeUsers.length > 3 && (
                <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs font-medium">+{activeUsers.length - 3}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Share Button */}
        <Button onClick={onShare} className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>

        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover border border-border shadow-lg">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
            </div>
            <DropdownMenuItem onClick={onSettings} className="gap-2 cursor-pointer">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}