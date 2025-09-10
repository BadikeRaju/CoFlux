import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { DocumentVersion } from '@/types/editor';

interface VersionHistoryProps {
  versions: DocumentVersion[];
  onRestoreVersion: (version: DocumentVersion) => void;
}

export function VersionHistory({ versions, onRestoreVersion }: VersionHistoryProps) {
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

  const getChangeText = (version: DocumentVersion) => {
    if (version.wordsAdded > 0 && version.wordsRemoved > 0) {
      return `+${version.wordsAdded} words, -${version.wordsRemoved} words`;
    } else if (version.wordsAdded > 0) {
      return `+${version.wordsAdded} words`;
    } else if (version.wordsRemoved > 0) {
      return `-${version.wordsRemoved} words`;
    }
    return 'Initial document creation';
  };

  return (
    <div className="p-4 space-y-4">
      {versions.map((version) => (
        <div key={version.id} className="space-y-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={version.author.avatar} alt={version.author.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {version.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-sidebar-foreground">
                {version.author.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDate(version.timestamp)}
              </div>
            </div>
          </div>
          
          <div className="pl-11">
            <div className="text-sm text-sidebar-foreground mb-1">
              {version.changes}
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              {getChangeText(version)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRestoreVersion(version)}
              className="h-7 text-xs"
            >
              Restore
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}