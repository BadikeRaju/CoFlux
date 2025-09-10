import { useState, useCallback } from 'react';
import type { Document, User, DocumentVersion } from '@/types/editor';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@coflux.com',
    avatar: '',
    status: 'online',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@coflux.com',
    avatar: '',
    status: 'online',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@coflux.com',
    avatar: '',
    status: 'away',
  },
];

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Project Proposal - CoFlux Editor',
    content: 'This document outlines the development plan for our new collaborative text editor. The editor will support real-time collaboration, allowing multiple users to work on the same document simultaneously.',
    wordCount: 1250,
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    collaborators: mockUsers,
  },
  {
    id: '2',
    title: 'Meeting Notes - Q4 Planning',
    content: 'Quarterly planning meeting notes and action items.',
    wordCount: 890,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
    collaborators: [mockUsers[0], mockUsers[1]],
  },
  {
    id: '3',
    title: 'Technical Architecture Guide',
    content: 'System architecture and implementation details.',
    wordCount: 2100,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    collaborators: [mockUsers[0], mockUsers[2]],
  },
];

const mockVersions: DocumentVersion[] = [
  {
    id: '1',
    documentId: '1',
    content: 'Updated content',
    author: mockUsers[0],
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    changes: 'Added collaboration architecture section',
    wordsAdded: 150,
    wordsRemoved: 0,
  },
  {
    id: '2',
    documentId: '1',
    content: 'Previous content',
    author: mockUsers[1],
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    changes: 'Updated project timeline',
    wordsAdded: 50,
    wordsRemoved: 20,
  },
  {
    id: '3',
    documentId: '1',
    content: 'Initial content',
    author: mockUsers[0],
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
    changes: 'Initial document creation',
    wordsAdded: 1000,
    wordsRemoved: 0,
  },
];

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [activeDocument, setActiveDocument] = useState<Document | null>(mockDocuments[0]);
  const [users] = useState<User[]>(mockUsers);
  const [versions] = useState<DocumentVersion[]>(mockVersions);
  const [currentUser] = useState<User>(mockUsers[0]);

  const createDocument = useCallback(() => {
    const newDocument: Document = {
      id: Date.now().toString(),
      title: 'Untitled Document',
      content: '',
      wordCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      collaborators: [currentUser],
    };
    
    setDocuments(prev => [newDocument, ...prev]);
    setActiveDocument(newDocument);
  }, [currentUser]);

  const updateDocument = useCallback((id: string, updates: Partial<Document>) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id 
          ? { ...doc, ...updates, updatedAt: new Date() }
          : doc
      )
    );
    
    if (activeDocument?.id === id) {
      setActiveDocument(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  }, [activeDocument]);

  const updateDocumentContent = useCallback((content: string) => {
    if (!activeDocument) return;
    
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    updateDocument(activeDocument.id, { content, wordCount });
  }, [activeDocument, updateDocument]);

  const updateDocumentTitle = useCallback((title: string) => {
    if (!activeDocument) return;
    updateDocument(activeDocument.id, { title });
  }, [activeDocument, updateDocument]);

  const restoreVersion = useCallback((version: DocumentVersion) => {
    if (!activeDocument) return;
    updateDocument(activeDocument.id, { content: version.content });
  }, [activeDocument, updateDocument]);

  const updateCurrentUser = useCallback((updates: Partial<User>) => {
    // In a real app, this would update the user in the backend
    console.log('Updating user:', updates);
  }, []);

  return {
    documents,
    activeDocument,
    users,
    versions: versions.filter(v => v.documentId === activeDocument?.id),
    currentUser,
    createDocument,
    setActiveDocument,
    updateDocumentContent,
    updateDocumentTitle,
    restoreVersion,
    updateCurrentUser,
  };
}