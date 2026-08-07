import { marked } from 'marked'

marked.setOptions({
  async: false,
  gfm: true,
  breaks: false,
})

/** Render trusted (author-authored) markdown to HTML on the server. */
export function renderMarkdown(md: string): string {
  return marked.parse(md) as string
}
