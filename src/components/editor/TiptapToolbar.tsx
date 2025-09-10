import { Editor } from '@tiptap/react'
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Palette,
  MoreHorizontal,
  Moon,
  Sun,
  MessageSquare,
  Strikethrough,
  Code,
  Superscript,
  Subscript,
  Indent,
  Outdent,
  Upload,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useTheme } from 'next-themes'
import { useRef } from 'react'

interface TiptapToolbarProps {
  editor: Editor | null
  onCommentToggle?: () => void
}

export function TiptapToolbar({ editor, onCommentToggle }: TiptapToolbarProps) {
  const { theme, setTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!editor) {
    return null
  }

  const formatText = (format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code') => {
    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run()
        break
      case 'italic':
        editor.chain().focus().toggleItalic().run()
        break
      case 'underline':
        editor.chain().focus().toggleUnderline().run()
        break
      case 'strikethrough':
        editor.chain().focus().toggleStrike().run()
        break
      case 'code':
        editor.chain().focus().toggleCode().run()
        break
    }
  }

  const formatHeading = (headingSize: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'paragraph') => {
    if (headingSize === 'paragraph') {
      editor.chain().focus().setParagraph().run()
    } else {
      editor.chain().focus().toggleHeading({ level: parseInt(headingSize.slice(1)) as 1 | 2 | 3 | 4 | 5 | 6 }).run()
    }
  }

  const insertList = (listType: 'bullet' | 'number') => {
    if (listType === 'bullet') {
      editor.chain().focus().toggleBulletList().run()
    } else {
      editor.chain().focus().toggleOrderedList().run()
    }
  }

  const insertQuote = () => {
    editor.chain().focus().toggleBlockquote().run()
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const onImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll create a local URL
      const url = URL.createObjectURL(file)
      
      editor.chain().focus().setImage({ src: url, alt: file.name }).run()
    }
  }

  const undo = () => {
    editor.chain().focus().undo().run()
  }

  const redo = () => {
    editor.chain().focus().redo().run()
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const setTextAlign = (align: 'left' | 'center' | 'right') => {
    editor.chain().focus().setTextAlign(align).run()
  }

  const insertLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run()
  }

  const setHighlight = (color: string) => {
    if (color === 'none') {
      editor.chain().focus().unsetHighlight().run()
    } else {
      editor.chain().focus().setHighlight({ color }).run()
    }
  }

  return (
    <div className="flex items-center gap-1 p-3 border-b bg-editor-toolbar flex-wrap sticky top-0 z-10 shadow-sm">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onImageUpload}
        accept="image/*"
        className="hidden"
      />
      
      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Text Formatting */}
      <Select onValueChange={(value) => formatHeading(value as any)}>
        <SelectTrigger className="w-36 h-8 text-sm">
          <SelectValue placeholder="Normal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="paragraph">Normal</SelectItem>
          <SelectItem value="h1">Heading 1</SelectItem>
          <SelectItem value="h2">Heading 2</SelectItem>
          <SelectItem value="h3">Heading 3</SelectItem>
          <SelectItem value="h4">Heading 4</SelectItem>
          <SelectItem value="h5">Heading 5</SelectItem>
          <SelectItem value="h6">Heading 6</SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Basic Formatting */}
      <div className="flex items-center gap-1">
        <Button
          variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => formatText('bold')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => formatText('italic')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => formatText('underline')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => formatText('strikethrough')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Text Color & Highlight */}
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-accent"
              title="Text color"
            >
              <Type className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setTextColor('#000000')}>Black</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTextColor('#ef4444')}>Red</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTextColor('#3b82f6')}>Blue</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTextColor('#10b981')}>Green</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTextColor('#8b5cf6')}>Purple</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-accent"
              title="Highlight color"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setHighlight('none')}>None</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setHighlight('#fef08a')}>Yellow</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setHighlight('#bbf7d0')}>Green</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setHighlight('#bfdbfe')}>Blue</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setHighlight('#fce7f3')}>Pink</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Lists and Alignment */}
      <div className="flex items-center gap-1">
        <Button
          variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => insertList('bullet')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Bulleted list"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => insertList('number')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Numbered list"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
          disabled={!editor.can().sinkListItem('listItem')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Increase indent"
        >
          <Indent className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().liftListItem('listItem').run()}
          disabled={!editor.can().liftListItem('listItem')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Decrease indent"
        >
          <Outdent className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <Button
          variant={editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setTextAlign('left')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Align left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setTextAlign('center')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Align center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setTextAlign('right')}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Align right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Insert Options */}
      <div className="flex items-center gap-1">
        <Button
          variant={editor.isActive('link') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={insertLink}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Insert link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleImageUpload}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Insert image"
        >
          <Upload className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={insertQuote}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Comments and Theme */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCommentToggle?.()}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Add comment"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="h-8 w-8 p-0 hover:bg-accent"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* More Options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-accent"
            title="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => formatText('code')}>
            <Code className="h-4 w-4 mr-2" />
            Code
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Superscript className="h-4 w-4 mr-2" />
            Superscript
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Subscript className="h-4 w-4 mr-2" />
            Subscript
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Insert table</DropdownMenuItem>
          <DropdownMenuItem>Insert drawing</DropdownMenuItem>
          <DropdownMenuItem>Insert equation</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
