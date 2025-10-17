
import { GoogleGenAI, Type } from "@google/genai";
import type { Question } from '../types';

export const generateQuestions = async (topic: string, count: number): Promise<Question[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Generate ${count} multiple-choice questions about ${topic}. Each question must have 4 options and one correct answer. The correct answer should be indicated by its index (0-3).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              description: `An array of ${count} questions.`,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: {
                    type: Type.STRING,
                    description: "The question text."
                  },
                  options: {
                    type: Type.ARRAY,
                    description: "An array of 4 possible string answers.",
                    items: {
                      type: Type.STRING
                    }
                  },
                  correctAnswerIndex: {
                    type: Type.INTEGER,
                    description: "The 0-based index of the correct answer in the options array."
                  }
                },
                 required: ["question", "options", "correctAnswerIndex"]
              }
            }
          },
          required: ["questions"]
        }
      },
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);

    if (parsed && Array.isArray(parsed.questions)) {
       // Validate the structure of each question
      const validatedQuestions: Question[] = parsed.questions.filter((q: any) => 
        typeof q.question === 'string' &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctAnswerIndex === 'number' &&
        q.correctAnswerIndex >= 0 &&
        q.correctAnswerIndex < 4
      );

      if (validatedQuestions.length !== parsed.questions.length) {
          console.warn("Some generated questions had an invalid format and were filtered out.");
      }
      
      return validatedQuestions;
    } else {
        throw new Error("AI response did not match the expected format.");
    }

  } catch (error) {
    console.error("Error generating questions with Gemini:", error);
    throw new Error("Failed to generate questions. Please check the console for more details.");
  }
};
