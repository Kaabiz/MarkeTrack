package com.marketrack_back.controllers;

import com.marketrack_back.entities.CampaignChannel;
import com.marketrack_back.services.CampaignChannelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaign-channels")
public class CampaignChannelController {
    private final CampaignChannelService campaignChannelService;

    public CampaignChannelController(CampaignChannelService campaignChannelService) {
        this.campaignChannelService = campaignChannelService;
    }

    @GetMapping
    public List<CampaignChannel> getAllCampaignChannels() {
        return campaignChannelService.getAllCampaignChannels();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampaignChannel> getCampaignChannelById(@PathVariable Long id) {
        return campaignChannelService.getCampaignChannelById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public CampaignChannel createCampaignChannel(@RequestBody CampaignChannel campaignChannel) {
        return campaignChannelService.createCampaignChannel(campaignChannel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CampaignChannel> updateCampaignChannel(@PathVariable Long id, @RequestBody CampaignChannel details) {
        try {
            return ResponseEntity.ok(campaignChannelService.updateCampaignChannel(id, details));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampaignChannel(@PathVariable Long id) {
        campaignChannelService.deleteCampaignChannel(id);
        return ResponseEntity.noContent().build();
    }
}