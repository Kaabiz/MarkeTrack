export interface Campaign {
  id?: number;
  name: string;
  channel?: 'Email' | 'Social' | 'Search' | 'Influencer' | 'SMS' | string;
  budget?: number;
  status?: 'ACTIVE' | 'PAUSED' | 'ENDED' | 'DRAFT';

  // 🔽 Step 2 — Targeting fields
  targetGender?: 'Male' | 'Female' | 'Other';
  targetMinAge?: number | null;
  targetMaxAge?: number | null;
  targetOccupation?: string | null;
  targetLocation?: string | null;
  targetInterests?: string | null; // "fitness,tech"
}
