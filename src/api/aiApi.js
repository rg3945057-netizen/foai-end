import axios from 'axios';

const HF_ROUTER = 'https://router.huggingface.co/v1/chat/completions';
const MODEL = 'Qwen/Qwen3-1.7B:featherless-ai';

/**
 * Call Qwen3-1.7B via HuggingFace router (OpenAI chat completions format).
 * Only answers questions based on the current dashboard context.
 * @param {string} userMessage
 * @param {Object} context - current dashboard data
 * @returns {string} AI reply
 */
export async function askAI(userMessage, context = {}) {
  const token = import.meta.env.VITE_AI_TOKEN;
  if (!token) throw new Error('No VITE_AI_TOKEN configured.');

  const contextBlock = buildContextBlock(context);

  const systemPrompt = `You are a dashboard assistant for the ISS Orbit Intelligence Dashboard.
You ONLY answer questions based on the dashboard data provided below.
Do NOT use any outside knowledge. Do NOT hallucinate. Do NOT guess.
If the answer is not present in the dashboard data, respond exactly with:
"I only answer based on current dashboard data."

=== CURRENT DASHBOARD DATA ===
${contextBlock}
=== END OF DATA ===

Answer concisely and factually using ONLY the data above.`;

  const response = await fetch(HF_ROUTER, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.3,
      top_p: 0.9,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`HuggingFace API error ${response.status}: ${err}`);
  }

  const result = await response.json();
  const raw = result?.choices?.[0]?.message?.content || '';
  return raw.trim() || 'I only answer based on current dashboard data.';
}

function buildContextBlock(ctx) {
  const lines = [];

  if (ctx.iss) {
    lines.push(`ISS Position: Latitude ${ctx.iss.latitude}, Longitude ${ctx.iss.longitude}`);
    lines.push(`ISS Altitude: ${ctx.iss.altitude ? parseFloat(ctx.iss.altitude).toFixed(2) + ' km' : 'N/A'}`);
    lines.push(`ISS Speed: ${ctx.iss.speed ? ctx.iss.speed + ' km/h' : 'N/A'}`);
    lines.push(`ISS Region: ${ctx.iss.region || 'Unknown'}`);
    lines.push(`Last updated: ${ctx.iss.lastUpdated || 'N/A'}`);
  }

  if (ctx.astronauts) {
    lines.push(`People in space: ${ctx.astronauts.count}`);
    if (ctx.astronauts.names?.length) {
      lines.push(`Astronaut names: ${ctx.astronauts.names.join(', ')}`);
    }
  }

  if (ctx.news) {
    lines.push(`Total news articles loaded: ${ctx.news.count}`);
    if (ctx.news.headlines?.length) {
      lines.push('Top headlines:');
      ctx.news.headlines.slice(0, 5).forEach((h, i) => lines.push(`  ${i + 1}. ${h}`));
    }
    if (ctx.news.sources?.length) {
      lines.push(`News sources: ${ctx.news.sources.join(', ')}`);
    }
  }

  if (lines.length === 0) lines.push('No dashboard data available yet.');
  return lines.join('\n');
}
