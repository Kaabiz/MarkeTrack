package com.marketrack_back.entities;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
public class CampaignProlongationHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long prolongationId;

    private LocalDate previousEndDate;
    private LocalDate newEndDate;
    private Instant changedAt;

    @ManyToOne
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    public Long getProlongationId() {
        return prolongationId;
    }

    public void setProlongationId(Long prolongationId) {
        this.prolongationId = prolongationId;
    }

    public LocalDate getPreviousEndDate() {
        return previousEndDate;
    }

    public void setPreviousEndDate(LocalDate previousEndDate) {
        this.previousEndDate = previousEndDate;
    }

    public LocalDate getNewEndDate() {
        return newEndDate;
    }

    public void setNewEndDate(LocalDate newEndDate) {
        this.newEndDate = newEndDate;
    }

    public Instant getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(Instant changedAt) {
        this.changedAt = changedAt;
    }

    public Campaign getCampaign() {
        return campaign;
    }

    public void setCampaign(Campaign campaign) {
        this.campaign = campaign;
    }
}