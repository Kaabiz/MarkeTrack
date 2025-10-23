package com.marketrack_back.controllers;

import com.marketrack_back.entities.Campaign;
import com.marketrack_back.entities.Client;
import com.marketrack_back.repositories.ClientRepository;
import com.marketrack_back.repositories.specs.ClientSpecs;
import com.marketrack_back.services.CampaignService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@CrossOrigin(origins = "http://localhost:4200") // Allow Angular dev server
public class CampaignController {

    private final CampaignService campaignService;
    private final ClientRepository clientRepository;

    public CampaignController(CampaignService campaignService, ClientRepository clientRepository) {
        this.campaignService = campaignService;
        this.clientRepository = clientRepository;
    }

    // ------------------------
    // 🔹 Basic CRUD Endpoints
    // ------------------------

    @GetMapping
    public List<Campaign> getAllCampaigns() {
        return campaignService.getAllCampaigns();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campaign> getCampaignById(@PathVariable Long id) {
        return campaignService.getCampaignById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Campaign createCampaign(@RequestBody Campaign campaign) {
        return campaignService.createCampaign(campaign);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Campaign> updateCampaign(@PathVariable Long id, @RequestBody Campaign campaignDetails) {
        try {
            return ResponseEntity.ok(campaignService.updateCampaign(id, campaignDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.noContent().build();
    }

    // ------------------------------------------
    // 🔹 New: Audience Preview Endpoints (Step 2)
    // ------------------------------------------

    /**
     * Count how many clients match this campaign's target audience.
     */
    @GetMapping("/{id}/audience/count")
    public ResponseEntity<Long> getAudienceCount(@PathVariable Long id) {
        return campaignService.getCampaignById(id)
                .map(campaign -> {
                    long count = clientRepository.count(ClientSpecs.matchesCampaignTarget(campaign));
                    return ResponseEntity.ok(count);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get a paginated list of clients matching this campaign's target audience.
     */
    @GetMapping("/{id}/audience")
    public ResponseEntity<Page<Client>> getAudience(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return campaignService.getCampaignById(id)
                .map(campaign -> {
                    Pageable pageable = PageRequest.of(page, size);
                    Page<Client> clients = clientRepository.findAll(
                            ClientSpecs.matchesCampaignTarget(campaign), pageable);
                    return ResponseEntity.ok(clients);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
