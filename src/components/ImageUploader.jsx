import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image } from 'lucide-react'

const ImageUploader = ({ onImageUpload }) => {
  const [uploadedImage, setUploadedImage] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result)
        onImageUpload(file)
      }
      reader.readAsDataURL(file)
    }
  }, [onImageUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false
  })

  const removeImage = () => {
    setUploadedImage(null)
    onImageUpload(null)
  }

  if (uploadedImage) {
    return (
      <div className="relative">
        <div className="relative bg-dark-surface-light rounded-lg p-4">
          <img
            src={uploadedImage}
            alt="Uploaded product"
            className="w-full h-64 object-cover rounded-lg"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-dark-text-secondary mt-2">Product image uploaded successfully</p>
      </div>
    )
  }

  return (
    <div>
      <label className="block text-sm font-medium text-dark-text mb-2">
        Product Image
      </label>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-dark-surface-light bg-dark-surface-light hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            {isDragActive ? (
              <Upload className="w-8 h-8 text-white" />
            ) : (
              <Image className="w-8 h-8 text-white" />
            )}
          </div>
          <div>
            <p className="text-dark-text font-medium">
              {isDragActive ? 'Drop your image here' : 'Upload product image'}
            </p>
            <p className="text-dark-text-secondary text-sm">
              Drag & drop or click to select (JPG, PNG, GIF)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageUploader