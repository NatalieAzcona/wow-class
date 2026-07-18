import React from 'react'
import { EditorContent } from '@tiptap/react'
import './ContentEditor.scss'

const ContentEditor = ({ editor, editing }) => {
  if (!editor) return null

  return (
    <div className="content-editor">
      {editing && (
        <div className="content-editor__toolbar">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}>B</button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}><em>I</em></button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}>H2</button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}>H3</button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'active' : ''}>• Lista</button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'active' : ''}>1. Lista</button>
        </div>
      )}
      <div className={`content-editor__body${editing ? ' content-editor__body--active' : ''}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default ContentEditor
