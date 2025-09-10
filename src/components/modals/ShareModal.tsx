import { useState } from 'react';
import { Copy, X, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { ShareSettings } from '@/types/editor';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
}

export function ShareModal({ isOpen, onClose, documentTitle }: ShareModalProps) {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<ShareSettings['permission']>('edit');
  const [shareLink] = useState('https://coflux.com/doc/abc123'); // Mock link
  const { toast } = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (email) {
      toast({
        title: "Invitation sent!",
        description: `Invitation sent to ${email} with ${permission} permissions.`,
      });
      setEmail('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Share with people */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Share with people</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter email addresses..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Permission level */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Permission level</Label>
            <Select value={permission} onValueChange={(value: ShareSettings['permission']) => setPermission(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">Can view</SelectItem>
                <SelectItem value="edit">Can edit</SelectItem>
                <SelectItem value="admin">Can manage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Share link */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Share link</Label>
            <div className="flex gap-2">
              <Input
                value={shareLink}
                readOnly
                className="flex-1 bg-muted"
              />
              <Button variant="outline" onClick={handleCopyLink}>
                Copy
              </Button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleShare} disabled={!email}>
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}