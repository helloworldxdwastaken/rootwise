import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";

/**
 * Analyze food image using Google Gemini Vision API (Free tier)
 * POST /api/food/analyze
 * Body: { imageBase64: string, mealType?: string }
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { imageBase64, mealType } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "imageBase64 is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Call Gemini Vision API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this food image and provide nutritional information.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "description": "Brief description of the food/meal",
  "items": ["item1", "item2"],
  "calories": estimated total calories as number,
  "protein": grams as number,
  "carbs": grams as number,
  "fat": grams as number,
  "fiber": grams as number or null,
  "portionSize": "estimated portion description",
  "confidence": confidence score 0-1,
  "healthNotes": "brief health insight about this meal"
}

Be realistic with calorie estimates based on typical portion sizes visible in the image.`,
                },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const error = await geminiResponse.text();
      console.error("Gemini API error:", error);
      return NextResponse.json(
        { error: "Failed to analyze image" },
        { status: 500 }
      );
    }

    const geminiData = await geminiResponse.json();
    const textContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      return NextResponse.json(
        { error: "No analysis returned" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let analysis;
    try {
      // Clean potential markdown formatting
      const cleanJson = textContent
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      analysis = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", textContent);
      return NextResponse.json(
        { error: "Failed to parse food analysis" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis: {
        description: analysis.description || "Unknown food",
        items: analysis.items || [],
        calories: analysis.calories || 0,
        protein: analysis.protein || 0,
        carbs: analysis.carbs || 0,
        fat: analysis.fat || 0,
        fiber: analysis.fiber || null,
        portionSize: analysis.portionSize || "1 serving",
        confidence: analysis.confidence || 0.5,
        healthNotes: analysis.healthNotes || null,
        mealType: mealType || "OTHER",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Food analysis error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

