import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        // Check for API key
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI API key is not configured' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { symbol, price, indicators } = body;

        // Input validation
        if (!symbol) {
            return NextResponse.json({ error: 'Stock symbol is required' }, { status: 400 });
        }

        if (typeof price !== 'number') {
            return NextResponse.json({ error: 'Valid price is required' }, { status: 400 });
        }

        const prompt = `
As an expert financial analyst, analyze the following stock data for ${symbol} and provide a professional investment recommendation.

Market Data:
- Current Price: $${price}
- Technical Indicators: ${JSON.stringify(indicators, null, 2)}

Your analysis should be grounded in technical analysis principles.
Please provide a response in the following JSON format:
{
  "recommendation": "BUY" | "SELL" | "HOLD",
  "reasoning": "A concise but detailed explanation (2-3 sentences) justifying the recommendation based on the provided indicators and price action.",
  "confidence": number (0-100)
}

Ensure the reasoning is specific to the provided data.
`;

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a seasoned financial analyst with expertise in technical analysis. You provide cautious, data-driven investment advice."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "gpt-4o",
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = completion.choices[0].message.content;
        if (!content) {
            throw new Error('No content received from OpenAI');
        }

        const analysis = JSON.parse(content);

        // Validate response structure
        if (!analysis.recommendation || !analysis.reasoning || typeof analysis.confidence !== 'number') {
            throw new Error('Invalid response format from AI');
        }

        return NextResponse.json(analysis);

    } catch (error: any) {
        console.error('AI Analysis Error:', error);

        // Handle specific OpenAI errors if needed, otherwise generic 500
        const errorMessage = error.message || 'Failed to generate analysis';
        const statusCode = error.status || 500;

        return NextResponse.json(
            { error: errorMessage, details: error.message },
            { status: statusCode }
        );
    }
}
