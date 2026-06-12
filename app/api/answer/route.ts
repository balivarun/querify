import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { query, sources } = await req.json();

  const sourceText = sources
    .map((s: any, i: number) => `[${i + 1}] ${s.title}\n${s.snippet}`)
    .join("\n\n");

  const stream = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: `You are a helpful AI search assistant. Answer the following question using ONLY the sources provided. Cite sources using [1], [2] etc inline in your answer. Keep it concise and well-structured.

Question: ${query}

Sources:
${sourceText}`,
      },
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 1024,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.choices[0]?.delta?.content) {
          controller.enqueue(encoder.encode(chunk.choices[0].delta.content));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
