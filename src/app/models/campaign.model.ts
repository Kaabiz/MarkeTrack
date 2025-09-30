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