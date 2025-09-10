import { useState } from 'react';
import { Sidebar } from './sidebar/Sidebar';
import { EditorHeader } from './header/EditorHeader';
import { TiptapEditor } from './editor/TiptapEditor';
import { ShareModal } from './modals/ShareModal';
import { SettingsModal } from './modals/SettingsModal';
import { CommentsPanel } from './comments/CommentsPanel';
import { useDocuments } from '@/hooks/useDocuments';

export function CollaborativeEditor() {
  const {
    documents,
    activeDocument,
    users,
    versions,
    currentUser,
    createDocument,
    setActiveDocument,
    updateDocumentContent,
    updateDocumentTitle,
    restoreVersion,
    updateCurrentUser,
  } = useDocuments();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCommentsPanelOpen, setIsCommentsPanelOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <EditorHeader
        document={activeDocument}
        users={users}
        currentUser={currentUser}
        onShare={() => setIsShareModalOpen(true)}
        onSettings={() => setIsSettingsModalOpen(true)}
        onTitleChange={updateDocumentTitle}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          documents={documents}
          activeDocument={activeDocument}
          users={users}
          versions={versions}
          onDocumentSelect={setActiveDocument}
          onCreateDocument={createDocument}
          onRestoreVersion={restoreVersion}
        />

        {/* Editor */}
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col relative">
            {activeDocument ? (
              <TiptapEditor
                key={activeDocument.id}
                initialContent={activeDocument.content}
                onContentChange={updateDocumentContent}
                onCommentToggle={() => setIsCommentsPanelOpen(!isCommentsPanelOpen)}
                className="h-full"
                documentId={activeDocument.id}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-editor-background">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2">Welcome to CoFlux</h2>
                  <p className="text-muted-foreground mb-4">
                    Select a document from the sidebar or create a new one to get started.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Comments Panel */}
          {isCommentsPanelOpen && (
            <div className="w-80 border-l border-border bg-background">
              <CommentsPanel
                isOpen={isCommentsPanelOpen}
                onClose={() => setIsCommentsPanelOpen(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        documentTitle={activeDocument?.title || ''}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentUser={{
          name: currentUser.name,
          email: currentUser.email,
        }}
        onUpdateUser={updateCurrentUser}
      />
    </div>
  );
}