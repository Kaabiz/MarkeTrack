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
  campaignBudget: number;          // BigDecimal → number in JSON
  campaignStartDate: string;       // LocalDate → "YYYY-MM-DD"
  campaignEndDate: string;         // LocalDate → "YYYY-MM-DD"
  campaignStatus: string;          // enum on backend; string here is safest
  campaignCreatedAt: string;       // Instant → ISO string
  campaignUpdatedAt: string;       // Instant → ISO string
  createdBy?: UserSummary;         // keep it light for now
  // You can add tags, reports, etc. later when you need them
}
