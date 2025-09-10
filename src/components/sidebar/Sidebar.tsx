import { useState } from 'react';
import { Files, Users, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DocumentsList } from './DocumentsList';
import { PeopleList } from './PeopleList';
import { VersionHistory } from './VersionHistory';
import type { Document, User, DocumentVersion } from '@/types/editor';

type SidebarTab = 'documents' | 'people' | 'history';

interface SidebarProps {
  documents: Document[];
  activeDocument: Document | null;
  users: User[];
  versions: DocumentVersion[];
  onDocumentSelect: (document: Document) => void;
  onCreateDocument: () => void;
  onRestoreVersion: (version: DocumentVersion) => void;
}

export function Sidebar({
  documents,
  activeDocument,
  users,
  versions,
  onDocumentSelect,
  onCreateDocument,
  onRestoreVersion,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('documents');

  const tabs = [
    { id: 'documents' as const, label: 'Documents', icon: Files },
    { id: 'people' as const, label: 'People', icon: Users },
    { id: 'history' as const, label: 'History', icon: History },
  ];

  return (
    <div className="w-[22rem] bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">CF</span>
          </div>
          <span className="font-semibold text-sidebar-foreground">CoFlux</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-sidebar-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={cn(
                "flex-1 rounded-none h-12 gap-1.5 px-1 min-w-0",
                activeTab === tab.id && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs font-medium leading-tight">{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'documents' && (
          <DocumentsList
            documents={documents}
            activeDocument={activeDocument}
            onDocumentSelect={onDocumentSelect}
            onCreateDocument={onCreateDocument}
          />
        )}
        {activeTab === 'people' && (
          <PeopleList users={users} />
        )}
        {activeTab === 'history' && (
          <VersionHistory
            versions={versions}
            onRestoreVersion={onRestoreVersion}
          />
        )}
      </div>
    </div>
  );
}