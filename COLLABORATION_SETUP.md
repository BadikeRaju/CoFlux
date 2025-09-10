# Collaboration Setup Guide

This document explains how to set up the collaborative editing features for the CoFlux editor.

## Prerequisites

1. Node.js installed on your system
2. The main application dependencies installed (`npm install`)

## WebSocket Server Setup

For real-time collaboration to work, you need to run a WebSocket server. Here's how to set it up:

### Option 1: Using the provided server (Development)

1. Install the WebSocket server dependencies:
```bash
npm install ws y-websocket
```

2. Run the WebSocket server:
```bash
node websocket-server.js
```

The server will start on `ws://localhost:1234`

### Option 2: Using y-websocket-server (Recommended for production)

1. Install y-websocket-server globally:
```bash
npm install -g y-websocket-server
```

2. Run the server:
```bash
y-websocket-server --port 1234
```

## Features Implemented

### ✅ Core Editor Features
- **Rich Text Editing**: Full WYSIWYG editor with Tiptap
- **Text Formatting**: Bold, italic, underline, strikethrough
- **Headings**: H1-H6 support
- **Lists**: Bulleted and numbered lists with indentation
- **Text Alignment**: Left, center, right alignment
- **Links**: Insert and edit links
- **Images**: Upload and insert images
- **Text Colors**: Change text color
- **Highlighting**: Text highlighting with multiple colors
- **Blockquotes**: Quote blocks
- **Code**: Inline code and code blocks

### ✅ Collaboration Features
- **Real-time Editing**: Multiple users can edit simultaneously
- **Conflict Resolution**: Yjs handles operational transformation
- **Offline Support**: IndexedDB persistence for offline editing
- **Collaboration Cursors**: See other users' cursors (when WebSocket is connected)

### ✅ UI/UX Features
- **Modern Toolbar**: Clean, intuitive toolbar with all formatting options
- **Responsive Design**: Works on desktop and mobile
- **Dark/Light Theme**: Theme switching support
- **Loading States**: Proper loading indicators
- **Error Handling**: Graceful error handling

## How It Works

1. **Yjs Document**: The editor uses Yjs to create a shared document state
2. **IndexedDB**: Local persistence ensures data survives browser refreshes
3. **WebSocket**: Real-time synchronization between clients
4. **Tiptap**: Rich text editor built on ProseMirror
5. **Operational Transformation**: Yjs handles conflict resolution automatically

## Testing Collaboration

1. Start the WebSocket server (see setup above)
2. Open the application in multiple browser tabs/windows
3. Start typing in one tab - you should see changes in real-time in other tabs
4. Try editing the same line simultaneously to see conflict resolution

## Troubleshooting

### Text not appearing
- Make sure the WebSocket server is running
- Check browser console for errors
- Verify the WebSocket URL in `src/lib/collaboration.ts`

### Collaboration not working
- Ensure WebSocket server is accessible
- Check network connectivity
- Verify Yjs document is properly initialized

### Performance issues
- Large documents may have performance implications
- Consider implementing document chunking for very large documents
- Monitor WebSocket connection stability

## Production Considerations

1. **WebSocket Server**: Use a production-ready WebSocket server
2. **Authentication**: Implement user authentication and authorization
3. **Rate Limiting**: Add rate limiting to prevent abuse
4. **Monitoring**: Monitor WebSocket connections and document states
5. **Backup**: Implement document backup and recovery
6. **Scaling**: Consider horizontal scaling for large user bases
