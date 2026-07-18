import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import YoutubeEmbed from './YoutubeEmbed'
import ModuleActions from './ModuleActions'
import { API } from '../../config/api'
import './VideoSection.scss'

const VideoSection = ({ module, isTeacher }) => {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [editUrl, setEditUrl] = useState('')

  const saveMutation = useMutation({
    mutationFn: (videoUrl) =>
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
          content: module.content,
          videoUrl,
        }),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries(['module', module._id])
      setEditing(false)
    },
  })

  const start = () => { setEditUrl(module.videoUrl || ''); setEditing(true) }
  const cancel = () => setEditing(false)

  return (
    <div className="video-section">
      {isTeacher && editing && (
        <div className="video-section__field">
          <label className="video-section__label">URL de YouTube</label>
          <input
            className="video-section__input"
            value={editUrl}
            onChange={e => setEditUrl(e.target.value)}
            placeholder="https://www.youtube.com/..."
          />
        </div>
      )}

      <YoutubeEmbed url={editing ? editUrl : module.videoUrl} title={module.title} />

      {isTeacher && !editing && (
        <button className="video-section__edit-btn" onClick={start}>Editar video</button>
      )}
      {isTeacher && editing && (
        <ModuleActions
          onSave={() => saveMutation.mutate(editUrl)}
          onCancel={cancel}
          isPending={saveMutation.isPending}
        />
      )}
    </div>
  )
}

export default VideoSection
