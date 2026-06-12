import { Request, Response } from 'express';

export const tailorResume = async (req: Request, res: Response) => {
  try {
    const { jobDescription, resumeText } = req.body;

    const suggestion = `✅ RESUME TAILORING SUGGESTIONS:

1. Add relevant keywords from job description (Data Analytics, Python, SQL, Tableau)
2. Quantify achievements: "Built reports serving 500+ daily users" instead of generic statements
3. Reorder bullet points to prioritize matching skills first
4. Add metrics: "Reduced query time by 40%", "Analyzed 2M+ records"
5. Include technical tools mentioned in JD: Python, Power BI, Excel, AWS
6. Highlight team collaboration in 1-2 bullets
7. Change "Worked on projects" to "Designed and deployed solutions that"`;

    res.json({ suggestion });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request' });
  }
};