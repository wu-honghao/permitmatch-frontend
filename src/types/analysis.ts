
import type {
  Salary,
  Contract,
  EducationRequirement,
  ExperienceRequirement,
  SkillRequirement,
  PermitSupport,
} from './job';

export type SkillCoverage = {
  matched: number;
  total: number;
  coveredSkills: string[];
  missingSkills: string[][];
};

export type SkillScoreType =
  | 'weighted'
  | 'required_only'
  | 'unavailable';

export type SkillScoreResult = {
  score: number | null;
  scoreType: SkillScoreType;
  required: SkillCoverage;
  preferred: SkillCoverage;
  hasPendingReview: boolean;
};

export type ProfileSnapshot = {
  needsPermit: boolean | null;
  targetRole: string | null;
  educationLevel: string | null;
  yearsExperience: number | null;
  skills: string[];
  preferredLocation: string | null;
};

export type JobSnapshot = {
  title: string | null;
  location: string | null;
  company: string | null;
  rawDescription: string;
  requirements: SkillRequirement[];
  salary: Salary | null;
  contract: Contract | null;
  educationRequirement: EducationRequirement | null;
  experienceRequirement: ExperienceRequirement | null;
  permitSupport: PermitSupport | null;
};

export type Analysis = {
  _id: string;
  ownerId: string;
  jobId: string;
  profileSnapshot: ProfileSnapshot;
  jobSnapshot: JobSnapshot;
  skillScoreResult: SkillScoreResult;
  createdAt: string;
  updatedAt: string;
};

export type AnalysisListItem = {
  _id: string;
  jobId: string;
  jobSnapshot: {
    company: string | null;
    title: string | null;
  };
  skillScoreResult: {
    score: number | null;
  };
  createdAt: string;
  jobExists: boolean
};

export type AnalysisListResponse = AnalysisListItem[];