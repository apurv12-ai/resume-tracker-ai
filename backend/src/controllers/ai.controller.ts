import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

export const tailorResume = async (req: Request, res: Response) => {
  try {
    console.log("KEY FOUND:", !!process.env.GEMINI_API_KEY);
    const { jobDescription, resumeText } = req.body;

    const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

    const prompt = `
Job Description:
${jobDescription}

Resume:
${resumeText}

Give 5-7 specific suggestions to improve the resume for this job.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ suggestion: response });
  } catch (error: any) {
  console.error("GEMINI ERROR:", error);

  res.status(500).json({
    error: error?.message || "AI request failed",
  });
}
};