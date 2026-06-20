import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const apiKey = authHeader?.replace('Bearer ', '');

    if (!apiKey) {
      return Response.json({ text: 'No API key provided. Set your OpenAI key in settings.' }, { status: 400 });
    }

    const body = await request.json();
    const { query, profile, activeProgram, workoutLogs } = body;

    const systemPrompt = `You are an expert fitness coach assistant for GymVerse AI. You help users with workout advice, form tips, nutrition guidance, and motivation.

User Profile:
- Age: ${profile?.age || 'N/A'}
- Gender: ${profile?.gender || 'N/A'}
- Height: ${profile?.height || 'N/A'} cm
- Weight: ${profile?.weight || 'N/A'} kg
- Experience: ${profile?.experienceLevel || 'N/A'}
- Goals: ${profile?.goals?.join(', ') || 'N/A'}
- Environment: ${profile?.environment || 'N/A'}
- Training Frequency: ${profile?.frequency || 'N/A'} days/week

${activeProgram ? `Current Program: ${activeProgram.name} (${activeProgram.splitName})` : ''}
${workoutLogs?.length ? `Recent Workouts: ${workoutLogs.length} logged` : 'No workouts logged yet.'}

Keep responses concise, actionable, and encouraging. Use markdown sparingly. Provide specific advice based on the user's profile.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      return Response.json(
        { text: `OpenAI API error (${response.status}). Please check your API key and try again.` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "I couldn't generate a response.";

    return Response.json({ text });
  } catch (error) {
    console.error('Coach API error:', error);
    return Response.json(
      { text: 'An unexpected error occurred. The local coach engine is still available.' },
      { status: 500 }
    );
  }
}
