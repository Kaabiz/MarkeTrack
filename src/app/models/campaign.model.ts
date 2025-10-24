// src/app/models/campaign.model.ts
export interface UserSummary {
  userId: number;
  userEmail: string;
  userFullName: string;
}

export interface Campaign {
  campaignId: number;
  campaignName: string;
  campaignObjective: string;
  campaignBudget: number;
  campaignStartDate: string;
  campaignEndDate: string;
  campaignStatus: string;
  campaignCreatedAt: string;
  campaignUpdatedAt: string;
  createdBy?: UserSummary;
  campaigns?: Campaign[];  // Add this to handle nested campaigns
}

/*
export interface Campaign {
  id?: number;
  name: string;
  channel?: string;
  budget?: number;
  status?: 'ACTIVE' | 'PAUSED' | 'ENDED' | 'DRAFT';
  targetGender?: 'Male' | 'Female' | 'Other';
  targetMinAge?: number | null;
  targetMaxAge?: number | null;
  targetOccupation?: string | null;
  targetLocation?: string | null;
  targetInterests?: string | null;
}

*/