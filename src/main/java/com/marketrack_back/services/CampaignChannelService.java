package com.marketrack_back.services;

import com.marketrack_back.entities.CampaignChannel;
import com.marketrack_back.repositories.CampaignChannelRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CampaignChannelService {
    private final CampaignChannelRepository campaignChannelRepository;

    public CampaignChannelService(CampaignChannelRepository campaignChannelRepository) {
        this.campaignChannelRepository = campaignChannelRepository;
    }

    public List<CampaignChannel> getAllCampaignChannels() {
        return campaignChannelRepository.findAll();
    }

    public Optional<CampaignChannel> getCampaignChannelById(Long id) {
        return campaignChannelRepository.findById(id);
    }

    public CampaignChannel createCampaignChannel(CampaignChannel campaignChannel) {
        return campaignChannelRepository.save(campaignChannel);
    }

    public CampaignChannel updateCampaignChannel(Long id, CampaignChannel details) {
        return campaignChannelRepository.findById(id).map(cc -> {
            cc.setCampaignChannelAllocatedBudget(details.getCampaignChannelAllocatedBudget());
            cc.setCampaignChannelUtmSource(details.getCampaignChannelUtmSource());
            cc.setCampaignChannelUtmMedium(details.getCampaignChannelUtmMedium());
            cc.setCampaignChannelUtmCampaign(details.getCampaignChannelUtmCampaign());
            return campaignChannelRepository.save(cc);
        }).orElseThrow(() -> new RuntimeException("CampaignChannel not found"));
    }

    public void deleteCampaignChannel(Long id) {
        campaignChannelRepository.deleteById(id);
    }
}