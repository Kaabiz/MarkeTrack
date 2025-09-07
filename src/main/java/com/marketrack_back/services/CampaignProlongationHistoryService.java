package com.marketrack_back.services;

import com.marketrack_back.entities.CampaignProlongationHistory;
import com.marketrack_back.repositories.CampaignProlongationHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CampaignProlongationHistoryService {
    private final CampaignProlongationHistoryRepository campaignProlongationHistoryRepository;

    public CampaignProlongationHistoryService(CampaignProlongationHistoryRepository campaignProlongationHistoryRepository) {
        this.campaignProlongationHistoryRepository = campaignProlongationHistoryRepository;
    }

    public List<CampaignProlongationHistory> getAllProlongations() {
        return campaignProlongationHistoryRepository.findAll();
    }

    public Optional<CampaignProlongationHistory> getProlongationById(Long id) {
        return campaignProlongationHistoryRepository.findById(id);
    }

    public CampaignProlongationHistory createProlongation(CampaignProlongationHistory prolongation) {
        return campaignProlongationHistoryRepository.save(prolongation);
    }

    public CampaignProlongationHistory updateProlongation(Long id, CampaignProlongationHistory details) {
        return campaignProlongationHistoryRepository.findById(id).map(ph -> {
            ph.setPreviousEndDate(details.getPreviousEndDate());
            ph.setNewEndDate(details.getNewEndDate());
            ph.setChangedAt(details.getChangedAt());
            return campaignProlongationHistoryRepository.save(ph);
        }).orElseThrow(() -> new RuntimeException("Prolongation not found"));
    }

    public void deleteProlongation(Long id) {
        campaignProlongationHistoryRepository.deleteById(id);
    }
}