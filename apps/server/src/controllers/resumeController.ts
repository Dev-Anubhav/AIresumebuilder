import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

const initialResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    website: '',
    location: '',
    title: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  custom: {
    certifications: [],
    languages: [],
  },
};

export const createResume = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, templateId } = req.body;

    const resume = await prisma.resume.create({
      data: {
        title: title || 'My Resume',
        templateId: templateId || 'minimalist',
        personalInfo: initialResumeData.personalInfo,
        experience: initialResumeData.experience,
        education: initialResumeData.education,
        skills: initialResumeData.skills,
        projects: initialResumeData.projects,
        custom: initialResumeData.custom,
        userId: req.user.id,
      },
    });

    return res.status(201).json({ resume });
  } catch (err: any) {
    console.error('Create resume error:', err);
    return res.status(500).json({ error: err.message || 'Creation failed' });
  }
};

export const getResumes = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
    });

    return res.status(200).json({ resumes });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getResumeDetails = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const resume = await prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    return res.status(200).json({ resume });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateResume = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { title, templateId, personalInfo, experience, education, skills, projects, custom } = req.body;

    const updated = await prisma.resume.update({
      where: { id: req.params.id, userId: req.user.id },
      data: {
        title,
        templateId,
        personalInfo,
        experience,
        education,
        skills,
        projects,
        custom,
      },
    });

    return res.status(200).json({ resume: updated });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteResume = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const doc = await prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!doc) return res.status(404).json({ error: 'Resume not found' });

    await prisma.resume.delete({ where: { id: doc.id } });

    return res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
