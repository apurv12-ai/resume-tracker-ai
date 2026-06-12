// src/controllers/stats.controller.ts
import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const applications = await prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    const statusCounts = {
      SAVED: 0,
      APPLIED: 0,
      INTERVIEW: 0,
      OFFER: 0,
      REJECTED: 0,
    };
    applications.forEach((a) => {
      statusCounts[a.status as keyof typeof statusCounts]++;
    });

    const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));

    const timelineMap: Record<string, number> = {};
    applications.forEach((a) => {
      const date = new Date(a.createdAt);
      const monday = new Date(date);
      monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
      const key = monday.toISOString().split("T")[0];
      timelineMap[key] = (timelineMap[key] || 0) + 1;
    });

    const timeline = Object.entries(timelineMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, count]) => ({ week, count }));

    const total = applications.length;
    const applied = statusCounts.APPLIED + statusCounts.INTERVIEW + statusCounts.OFFER + statusCounts.REJECTED;
    const interviewed = statusCounts.INTERVIEW + statusCounts.OFFER;
    const offered = statusCounts.OFFER;

    const interviewRate = applied > 0 ? Math.round((interviewed / applied) * 100) : 0;
    const offerRate = interviewed > 0 ? Math.round((offered / interviewed) * 100) : 0;
    const responseRate = applied > 0 ? Math.round(((applied - statusCounts.APPLIED) / applied) * 100) : 0;

    res.json({
      total,
      statusCounts,
      statusBreakdown,
      timeline,
      rates: { interviewRate, offerRate, responseRate },
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};