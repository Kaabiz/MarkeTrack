package com.marketrack_back.controllers;

import com.marketrack_back.entities.CampaignProlongationHistory;
import com.marketrack_back.services.CampaignProlongationHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaign-prolongations")
public class CampaignProlongationHistoryController {
    private final CampaignProlongationHistoryService campaignProlongationHistoryService;

    public CampaignProlongationHistoryController(CampaignProlongationHistoryService campaignProlongationHistoryService) {
        this.campaignProlongationHistoryService = campaignProlongationHistoryService;
    }

    @GetMapping
    public List<CampaignProlongationHistory> getAllProlongations() {
        return campaignProlongationHistoryService.getAllProlongations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampaignProlongationHistory> getProlongationById(@PathVariable Long id) {
        return campaignProlongationHistoryService.getProlongationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public CampaignProlongationHistory createProlongation(@RequestBody CampaignProlongationHistory prolongation) {
        return campaignProlongationHistoryService.createProlongation(prolongation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CampaignProlongationHistory> updateProlongation(@PathVariable Long id, @RequestBody CampaignProlongationHistory details) {
        try {
            return ResponseEntity.ok(campaignProlongationHistoryService.updateProlongation(id, details));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProlongation(@PathVariable Long id) {
        campaignProlongationHistoryService.deleteProlongation(id);
        return ResponseEntity.noContent().build();
    }
}