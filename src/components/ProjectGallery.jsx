import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useProjectImagesStore } from '@/lib/supabaseProjectImages'

export const ProjectGallery = ({ projectPath }) => {
  const { images, loading, error, initializeImages } = useProjectImagesStore()

  useEffect(() => {
    if (!images || Object.keys(images).length === 0) {
      initializeImages()
    }
  }, [images, initializeImages])

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">Error loading images: {error}</div>
  }

  const projectKey = projectPath.toLowerCase() + 'Images'
  const projectImages = images[projectKey] || []

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projectImages.map((imageUrl, index) => (
        <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={`Project image ${index + 1}`}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        </div>
      ))}
    </div>
  )
}

ProjectGallery.propTypes = {
  projectPath: PropTypes.string.isRequired
}

ProjectGallery.displayName = 'ProjectGallery'

export default ProjectGallery