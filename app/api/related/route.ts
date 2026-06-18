import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: Request) {
  const { query, answer } = await req.json()

  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'user',
        content: `Based on this question and answer, generate exactly 4 short follow-up questions a curious user might ask next. Return ONLY a valid JSON array of strings, nothing else.

Question: ${query}
Answer: ${answer.slice(0, 600)}

Format: ["question 1", "question 2", "question 3", "question 4"]`,
      },
    ],
    temperature: 0.8,
    max_tokens: 200,
  })

  const text = response.choices[0]?.message?.content?.trim() || '[]'
  try {
    const match = text.match(/\[[\s\S]*\]/)
    const questions = JSON.parse(match ? match[0] : text)
    return NextResponse.json({ questions: Array.isArray(questions) ? questions.slice(0, 4) : [] })
  } catch {
    return NextResponse.json({ questions: [] })
  }
}
