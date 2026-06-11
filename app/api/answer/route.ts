import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: Request) {
  const { query, sources } = await req.json()

  const sourceText = sources
    .map((s: any, i: number) => `[${i + 1}] ${s.title}\n${s.snippet}`)
    .join('\n\n')

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a helpful AI search assistant like Perplexity AI.

Answer the following question using the sources provided.
Cite sources using [1], [2] etc inline in your answer.
Keep the answer clear, concise and well structured.

Question: ${query}

Sources:
${sourceText}`,
      },
    ],
  })

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}