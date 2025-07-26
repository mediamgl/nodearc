// Copy and paste this entire file:
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function askAI(prompt: string, context?: string): Promise<string> {
  try {
    const messages: any[] = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant for a note-taking app called NodeArc. Help users organize their thoughts, generate insights, and answer questions about their notes.'
      }
    ]

    if (context) {
      messages.push({
        role: 'system',
        content: `Context from user's notes: ${context}`
      })
    }

    messages.push({
      role: 'user',
      content: prompt
    })

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    })

    return response.choices[0].message.content || 'No response generated'
  } catch (error) {
    console.error('AI Error:', error)
    throw new Error('Failed to get AI response')
  }
}

export async function generateSummary(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Summarize the following text in a concise and clear manner.'
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.5,
      max_tokens: 500,
    })

    return response.choices[0].message.content || 'No summary generated'
  } catch (error) {
    console.error('Summary Error:', error)
    throw new Error('Failed to generate summary')
  }
}

export async function extractKeyPoints(text: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Extract 3-5 key points from the following text. Return them as a JSON array of strings.'
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 300,
    })

    const content = response.choices[0].message.content || '[]'
    return JSON.parse(content)
  } catch (error) {
    console.error('Key Points Error:', error)
    return []
  }
}
