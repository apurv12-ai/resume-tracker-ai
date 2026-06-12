// src/controllers/applications.controller.ts
import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export const getApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.userId! },
      orderBy: { updatedAt: "desc" },
    });
    res.json(applications);
  } catch {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

export const createApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { company, role, status, jobUrl, jobDescription, notes } = req.body;
    if (!company || !role) {
      res.status(400).json({ error: "Company and role are required" });
      return;
    }
    const application = await prisma.application.create({
      data: {
        userId: req.userId!,
        company,
        role,
        status: status || "SAVED",
        jobUrl,
        jobDescription,
        notes,
      },
    });
    res.status(201).json(application);
  } catch {
    res.status(500).json({ error: "Failed to create application" });
  }
};

export const updateApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { company, role, status, jobUrl, jobDescription, notes, appliedAt } = req.body;
    const existing = await prisma.application.findFirst({
      where: { id, userId: req.userId! },
    });
    if (!existing) {
      res.status(404).json({ error: "Application not found" });
      return;
    }
    const updated = await prisma.application.update({
      where: { id },
      data: {
        ...(company && { company }),
        ...(role && { role }),
        ...(status && { status }),
        ...(jobUrl !== undefined && { jobUrl }),
        ...(jobDescription !== undefined && { jobDescription }),
        ...(notes !== undefined && { notes }),
        ...(appliedAt && { appliedAt: new Date(appliedAt) }),
      },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Failed to update application" });
  }
};

export const deleteApplication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.application.deleteMany({ where: { id, userId: req.userId! } });
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete application" });
  }
};