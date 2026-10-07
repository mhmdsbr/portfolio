'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ProjectFormProps {
  initialData?: {
    id?: number
    title: string
    category: string
    description: string | null
    roles: string[] | null
    image: string | null
    link: string | null
    githubUrl: string | null
    tech: string[] | null
  }
  onSubmit: (formData: FormData) => Promise<unknown>
  submitLabel: string
}

function hasProjectId(result: unknown): result is { id: number } {
  return (
    typeof result === 'object' &&
    result !== null &&
    'id' in result &&
    typeof result.id === 'number'
  )
}

export default function ProjectForm({ initialData, onSubmit, submitLabel }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [techInput, setTechInput] = useState(initialData?.tech?.join(', ') || '')
  const [imageUrl, setImageUrl] = useState(initialData?.image || '')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage('')
    try {
      const savedProject = await onSubmit(formData)
      setMessage('✅ Project saved successfully!')
      router.refresh()

      if (!initialData?.id && hasProjectId(savedProject)) {
        router.replace(`/admin/projects/${savedProject.id}`)
      }
    } catch (error) {
      setMessage('❌ Failed to save project')
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-3xl">
      {message && (
        <div className={`p-3 rounded ${message.includes('Failed') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {message}
        </div>
      )}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={initialData?.title}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
          Category *
        </label>
        <select
          id="category"
          name="category"
          defaultValue={initialData?.category}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          required
        >
          <option value="React">React</option>
          <option value="Next.js">Next.js</option>
          <option value="WordPress">WordPress</option>
          <option value="Vue.js">Vue.js</option>
          <option value="Angular">Angular</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initialData?.description || ''}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div>
        <label htmlFor="roles" className="block text-sm font-medium text-gray-300 mb-1">
          Roles and responsibilities
        </label>
        <textarea
          id="roles"
          name="roles"
          rows={5}
          defaultValue={initialData?.roles?.join('\n') || ''}
          placeholder="Build reusable components&#10;Improve page performance&#10;Collaborate with designers"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <p className="text-xs text-gray-400 mt-1">Add one role or responsibility per line</p>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-1">
          Image URL
        </label>
        <input
          type="url"
          id="image"
          name="image"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="/images/project.png"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        {imageUrl && (
          <div className="mt-2 inline-block rounded bg-gray-800 p-2">
            <Image
              src={imageUrl}
              alt="Project image preview"
              width={240}
              height={144}
              unoptimized
              className="h-36 w-60 rounded object-cover"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-300 mb-1">
            Live Demo URL
          </label>
          <input
            type="url"
            id="link"
            name="link"
            defaultValue={initialData?.link || ''}
            placeholder="https://..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-300 mb-1">
            GitHub URL
          </label>
          <input
            type="url"
            id="githubUrl"
            name="githubUrl"
            defaultValue={initialData?.githubUrl || ''}
            placeholder="https://github.com/..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="tech" className="block text-sm font-medium text-gray-300 mb-1">
        Technologies
        </label>
        <input
          type="text"
          id="tech"
          name="tech"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          placeholder="React, TypeScript, Tailwind"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          Enter one or more technologies separated by commas. Existing technologies are reused.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-6 rounded-md transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/projects')}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-md transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}