// Build-time prerenderer, called by scripts/postbuild.mjs.
import { StrictMode } from 'react'
import { renderToReadableStream } from 'react-dom/server'
import { Root } from './Root'

export async function render(url: string): Promise<string> {
  const stream = await renderToReadableStream(
    <StrictMode>
      <Root url={url} />
    </StrictMode>,
    { onError: (err) => console.warn('[prerender]', url, err) },
  )
  await stream.allReady // wait for lazy routes (case studies) to resolve
  return new Response(stream).text()
}
