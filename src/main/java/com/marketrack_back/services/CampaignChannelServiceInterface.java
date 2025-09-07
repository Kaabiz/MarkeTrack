package com.marketrack_back.services;

import com.marketrack_back.entities.CampaignChannel;

import java.util.List;
import java.util.Optional;

public interface CampaignChannelServiceInterface {
    List<CampaignChannel> getAllCampaignChannels();
    Optional<CampaignChannel> getCampaignChannelById(Long id);
    CampaignChannel createCampaignChannel(CampaignChannel campaignChannel);
    CampaignChannel updateCampaignChannel(Long id, CampaignChannel details);
    void deleteCampaignChannel(Long id);
}