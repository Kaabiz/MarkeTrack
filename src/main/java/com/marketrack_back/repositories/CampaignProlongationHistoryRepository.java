package com.marketrack_back.repositories;

import com.marketrack_back.entities.CampaignProlongationHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CampaignProlongationHistoryRepository extends JpaRepository<CampaignProlongationHistory, Long> {
}