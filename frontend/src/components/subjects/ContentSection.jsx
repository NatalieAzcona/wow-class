import React, { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ContentEditor from './ContentEditor'
import ModuleActions from './ModuleActions'
import { API } from '../../config/api'
import './ContentSection.scss'

const ContentSection = ({ module, isTeacher }) => {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit],
    content: module.content || '',
    editable: false,
  })

  useEffect(() => {
    if (editor) editor.commands.setContent(module.content || '')
  }, [module.content, editor])

  const saveMutation = useMutation({
    mutationFn: (content) =>
      fetch(API + `/module/${module._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: module.title,
          subject: module.subject,
          level: module.level,
          videoUrl: module.videoUrl,
          content,
        }),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(['module', module._id])
      editor.setEditable(false)
      setEditing(false)
    },
  })

  const start = () => { editor.setEditable(true); setEditing(true) }
  const cancel = () => {
    editor.commands.setContent(module.content || '')
    editor.setEditable(false)
    setEditing(false)
  }

  return (
    <div className="content-section">
      <ContentEditor editor={editor} editing={editing} />

      {isTeacher && !editing && (
        <button className="content-section__edit-btn" onClick={start}>Editar contenido</button>
      )}
      {isTeacher && editing && (
        <ModuleActions
          onSave={() => saveMutation.mutate(editor.getHTML())}
          onCancel={cancel}
          isPending={saveMutation.isPending}
        />
      )}
    </div>
  )
}

export default ContentSection
