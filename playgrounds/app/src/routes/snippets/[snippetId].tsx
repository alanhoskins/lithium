import { createEffect, createResource, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import Editor from '~/components/Editor'
import { authFetch } from '~/lib/utils'
import { Snippet, SnippetSettings } from '~/types'

export default function ViewSnippet({ params }: { params: { snippetId: string } }) {
  const [snippet] = createResource<Snippet>(async () => {
    const response = await authFetch(`/api/snippets/${params.snippetId}`)
    if (!response.ok) {
      return undefined
    }
    const data = await response.json()
    return data
  })

  const [snippetSettings, setSnippetSettings] = createStore<SnippetSettings>({ ...snippet()! })

  createEffect(() => {
    console.log('snippet in effect', snippet())
    const updatedSnippetSettings = snippet()
    if (updatedSnippetSettings) {
      setSnippetSettings(updatedSnippetSettings)
    }
  })

  return (
    <main class="mx-auto text-gray-700  dark:text-gray-100 px-4 flex flex-col justify-center">
      <Show when={snippet()}>
        <Editor
          snippetId={params.snippetId}
          snippetSettings={snippetSettings}
          setSnippetSettings={setSnippetSettings}
        />
      </Show>
    </main>
  )
}
