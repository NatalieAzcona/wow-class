import React from 'react'
import './YoutubeEmbed.scss'

const getEmbedUrl = (url) => {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

const YoutubeEmbed = ({ url, title }) => {
  const embedUrl = getEmbedUrl(url)
  if (!embedUrl) return null

  return (
    <div className="youtube-embed">
      <iframe
        src={embedUrl}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

export default YoutubeEmbed
