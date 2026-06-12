import { Request, Response } from "express";
import pdfParse from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

export const analyzeResumeATS = async (
  req: Request,
  res: Response
) => {
  try {
    const file = (req as any).file;

    if (!file) {
      return res.status(400).json({
        error: "Resume PDF is required",
      });
    }

    const pdfData = await pdfParse(file.buffer);

    const resumeText = pdfData.text;
    console.log("Extracted resume text length:", resumeText.length);
console.log("First 200 chars:", resumeText.substring(0, 200));
    console.log(
  "Gemini Key:",
  process.env.GEMINI_API_KEY?.substring(0, 12)
);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const prompt = `
Analyze this resume for ATS compatibility.

Resume:
${resumeText}

Give:

1. ATS Score out of 100
2. Top strengths
3. Missing keywords
4. Improvement suggestions

Format neatly.
`;

    const result = await model.generateContent(prompt);

    const analysis = result.response.text();

    res.json({
      analysis,
    });
  } catch (error: any) {
    console.error("ATS ERROR:", error);

    res.status(500).json({
      error: error?.message || "ATS analysis failed",
    });
  }
};