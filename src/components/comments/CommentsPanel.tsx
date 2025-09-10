import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MessageSquare, Send, MoreHorizontal, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    initials: string;
  };
  content: string;
  timestamp: Date;
  resolved: boolean;
  replies: Comment[];
}

interface CommentsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommentsPanel({ isOpen, onClose }: CommentsPanelProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: {
        name: 'Sarah Chen',
        initials: 'SC',
        avatar: undefined,
      },
      content: 'This section needs more detail about the implementation approach. Could we add some technical specifications?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      resolved: false,
      replies: [
        {
          id: '1-1',
          author: {
            name: 'John Smith',
            initials: 'JS',
            avatar: undefined,
          },
          content: 'I agree. Should we add a technical diagram here?',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          resolved: false,
          replies: [],
        }
      ],
    },
    {
      id: '2',
      author: {
        name: 'Mike Johnson',
        initials: 'MJ',
        avatar: undefined,
      },
      content: 'Great points in this paragraph! The structure is very clear.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      resolved: true,
      replies: [],
    },
  ]);

  const addComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        initials: 'YU',
        avatar: undefined,
      },
      content: newComment,
      timestamp: new Date(),
      resolved: false,
      replies: [],
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const toggleResolve = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, resolved: !comment.resolved }
        : comment
    ));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h3 className="font-semibold">Comments</h3>
          <Badge variant="secondary" className="text-xs">
            {comments.filter(c => !c.resolved).length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* New Comment */}
      <div className="p-4 border-b border-border">
        <div className="space-y-3">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[60px] resize-none text-sm"
          />
          <div className="flex justify-end">
            <Button 
              onClick={addComment}
              disabled={!newComment.trim()}
              size="sm"
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className={`${comment.resolved ? 'opacity-60 bg-gray-50' : 'bg-white'} shadow-sm`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {comment.author.avatar && (
                        <AvatarImage src={comment.author.avatar} />
                      )}
                      <AvatarFallback className="text-xs">
                        {comment.author.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{comment.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(comment.timestamp)}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleResolve(comment.id)}>
                        {comment.resolved ? 'Unresolve' : 'Resolve'}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm leading-relaxed mb-2">{comment.content}</p>
                {comment.resolved && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    Resolved
                  </Badge>
                )}
                
                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="mt-4 space-y-3 border-l-2 border-muted pl-4 ml-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            {reply.author.avatar && (
                              <AvatarImage src={reply.author.avatar} />
                            )}
                            <AvatarFallback className="text-xs">
                              {reply.author.initials}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-xs font-medium">{reply.author.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(reply.timestamp)}
                          </p>
                        </div>
                        <p className="text-sm leading-relaxed">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {comments.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h4 className="font-medium mb-2">No comments yet</h4>
              <p className="text-sm text-muted-foreground">
                Select text and right-click to add a comment.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}