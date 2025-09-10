import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/types/editor';

interface PeopleListProps {
  users: User[];
}

const getStatusColor = (status: User['status']) => {
  switch (status) {
    case 'online':
      return 'bg-status-online';
    case 'away':
      return 'bg-status-away';
    case 'offline':
      return 'bg-status-offline';
    default:
      return 'bg-status-offline';
  }
};

const getStatusText = (status: User['status']) => {
  switch (status) {
    case 'online':
      return 'Online';
    case 'away':
      return 'Last seen 1 hour ago';
    case 'offline':
      return 'Offline';
    default:
      return 'Unknown';
  }
};

export function PeopleList({ users }: PeopleListProps) {
  return (
    <div className="p-4 space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div 
              className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-sidebar",
                getStatusColor(user.status)
              )}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sidebar-foreground truncate">
              {user.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {getStatusText(user.status)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}