
export type RequirementImportance = 'required' | 'preferred' | 'review';

export type Salary = {
  rawContent: string | null;
  min: number | null;
  max: number | null;
  currency: string | null;
  period: 'hour' | 'month' | 'year' | null;
};

export type Contract = {
  rawContent: string | null;
  type: 'permanent' | 'fixed_term' | 'other' | null;
  durationMonths: number | null;
};

export type EducationRequirement = {
  rawContent: string | null;
  level: 'high_school' | 'diploma' | 'bachelor' | 'master' | 'phd' | null;
  importance: RequirementImportance;
  fieldOfStudy: string | null;
};

export type ExperienceRequirement = {
  rawContent: string | null;
  minYears: number | null;
  maxYears: number | null;
  importance: RequirementImportance;
  scope: string | null;
};

export type SkillRequirement = {
  rawContent: string | null;
  category: RequirementImportance;
  operator: 'all' | 'any' | null;
  skills: string[];
};

export type PermitSupport = {
  rawContent: string | null;
  status: 'supported' | 'not_supported' | 'unknown';
};

type latestAnalysis = {
  createdAt: Date;
  skillScoreResult: {
    score: number,
    scoreType: string
  };
  _id: string;
}

export type Job = {
  _id: string;
  ownerId: string;
  rawDescription: string;
  title: string;
  company: string | null;
  location: string | null;
  salary: Salary | null;
  contract: Contract | null;
  educationRequirement: EducationRequirement | null;
  experienceRequirement: ExperienceRequirement | null;
  requirements: SkillRequirement[];
  permitSupport: PermitSupport | null;
  latestAnalysisId: latestAnalysis
  createdAt: string;
  updatedAt: string;
};

export type ScoreType = 'weighted' | 'required_only' | 'unavailable';

export type JobListItem = {
  _id: string;
  title: string;
  company: string | null;
  location: string | null;
  skillScore: number | null;
  scoreType: ScoreType | null;
  updatedAt: string;
};

export type JobFormValues = {
  title: string;
  company?: string;
  location?: string;
  rawDescription?: string;

  salary?: {
    min?: number | null;
  };

  contract?: {
    durationMonths?: number | null;
  };

  experienceRequirement?: {
    minYears?: number | null;
    scope?: string | null;
  };

  educationRequirement?: {
    level?: string | null;
  };

  permitSupport?: {
    status?: "supported" | "not_supported" | "unknown";
  };

  requirements?: {
    category: "required" | "preferred" | "review";
    operator?: "all" | "any" | null;
    skills?: string[];
    rawContent?: string | null;
  }[];

  checked?: boolean;
};
