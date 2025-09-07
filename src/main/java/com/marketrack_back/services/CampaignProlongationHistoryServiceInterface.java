package com.marketrack_back.services;

import com.marketrack_back.entities.CampaignProlongationHistory;

import java.util.List;
import java.util.Optional;

public interface CampaignProlongationHistoryServiceInterface {
    List<CampaignProlongationHistory> getAllProlongations();
    Optional<CampaignProlongationHistory> getProlongationById(Long id);
    CampaignProlongationHistory createProlongation(CampaignProlongationHistory prolongation);
    CampaignProlongationHistory updateProlongation(Long id, CampaignProlongationHistory details);
    void deleteProlongation(Long id);
}