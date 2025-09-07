package com.marketrack_back.services;

import com.marketrack_back.entities.Campaign;

import java.util.List;
import java.util.Optional;

public interface CampaignServiceInterface {
    List<Campaign> getAllCampaigns();
    Optional<Campaign> getCampaignById(Long id);
    Campaign createCampaign(Campaign campaign);
    Campaign updateCampaign(Long id, Campaign campaignDetails);
    void deleteCampaign(Long id);
}