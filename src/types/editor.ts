export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  cursor?: {
    x: number;
    y: number;
  };
}

export interface Document {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
  collaborators: User[];
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  content: string;
  author: User;
  timestamp: Date;
  changes: string;
  wordsAdded: number;
  wordsRemoved: number;
}

export interface ShareSettings {
  permission: 'view' | 'edit' | 'admin';
  link: string;
}