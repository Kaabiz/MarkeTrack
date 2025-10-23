package com.marketrack_back.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long campaignId;

    private String campaignName;
    private String campaignObjective;
    private BigDecimal campaignBudget;
    private LocalDate campaignStartDate;
    private LocalDate campaignEndDate;
    @Enumerated(EnumType.STRING)
    private CampaignStatus campaignStatus;
    private Instant campaignCreatedAt;
    private Instant campaignUpdatedAt;

    @ManyToOne
    @JoinColumn(name = "created_by")
    @JsonIgnore
    private User createdBy;

    @OneToMany(mappedBy = "campaign")
    @JsonIgnore
    private Set<CampaignChannel> campaignChannels;

    @ManyToMany
    @JoinTable(
        name = "campaign_tag",
        joinColumns = @JoinColumn(name = "campaign_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @JsonIgnore
    private Set<Tag> tags;

    @OneToMany(mappedBy = "campaign")
    @JsonIgnore
    private Set<Report> reports;

    @OneToMany(mappedBy = "campaign")
    @JsonIgnore
    private Set<CampaignProlongationHistory> prolongations;


// add these simple fields directly on Campaign
    private String targetGender;     // "Male","Female","Other", or null for Any
    private Integer targetMinAge;    // nullable
    private Integer targetMaxAge;    // nullable
    private String targetOccupation; // free text (we'll do LIKE)
    private String targetLocation;   // free text (LIKE)
    private String targetInterests;  // comma-separated keywords (e.g., "fitness,tech")

    public String getTargetGender() {
        return targetGender;
    }

    public void setTargetGender(String targetGender) {
        this.targetGender = targetGender;
    }

    public Integer getTargetMinAge() {
        return targetMinAge;
    }

    public void setTargetMinAge(Integer targetMinAge) {
        this.targetMinAge = targetMinAge;
    }

    public Integer getTargetMaxAge() {
        return targetMaxAge;
    }

    public void setTargetMaxAge(Integer targetMaxAge) {
        this.targetMaxAge = targetMaxAge;
    }

    public String getTargetOccupation() {
        return targetOccupation;
    }

    public void setTargetOccupation(String targetOccupation) {
        this.targetOccupation = targetOccupation;
    }

    public String getTargetLocation() {
        return targetLocation;
    }

    public void setTargetLocation(String targetLocation) {
        this.targetLocation = targetLocation;
    }

    public String getTargetInterests() {
        return targetInterests;
    }

    public void setTargetInterests(String targetInterests) {
        this.targetInterests = targetInterests;
    }

    public Long getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Long campaignId) {
        this.campaignId = campaignId;
    }

    public String getCampaignName() {
        return campaignName;
    }

    public void setCampaignName(String campaignName) {
        this.campaignName = campaignName;
    }

    public String getCampaignObjective() {
        return campaignObjective;
    }

    public void setCampaignObjective(String campaignObjective) {
        this.campaignObjective = campaignObjective;
    }

    public BigDecimal getCampaignBudget() {
        return campaignBudget;
    }

    public void setCampaignBudget(BigDecimal campaignBudget) {
        this.campaignBudget = campaignBudget;
    }

    public LocalDate getCampaignStartDate() {
        return campaignStartDate;
    }

    public void setCampaignStartDate(LocalDate campaignStartDate) {
        this.campaignStartDate = campaignStartDate;
    }

    public LocalDate getCampaignEndDate() {
        return campaignEndDate;
    }

    public void setCampaignEndDate(LocalDate campaignEndDate) {
        this.campaignEndDate = campaignEndDate;
    }

    public CampaignStatus getCampaignStatus() {
        return campaignStatus;
    }

    public void setCampaignStatus(CampaignStatus campaignStatus) {
        this.campaignStatus = campaignStatus;
    }

    public Instant getCampaignCreatedAt() {
        return campaignCreatedAt;
    }

    public void setCampaignCreatedAt(Instant campaignCreatedAt) {
        this.campaignCreatedAt = campaignCreatedAt;
    }

    public Instant getCampaignUpdatedAt() {
        return campaignUpdatedAt;
    }

    public void setCampaignUpdatedAt(Instant campaignUpdatedAt) {
        this.campaignUpdatedAt = campaignUpdatedAt;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public Set<CampaignChannel> getCampaignChannels() {
        return campaignChannels;
    }

    public void setCampaignChannels(Set<CampaignChannel> campaignChannels) {
        this.campaignChannels = campaignChannels;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    public Set<Report> getReports() {
        return reports;
    }

    public void setReports(Set<Report> reports) {
        this.reports = reports;
    }

    public Set<CampaignProlongationHistory> getProlongations() {
        return prolongations;
    }

    public void setProlongations(Set<CampaignProlongationHistory> prolongations) {
        this.prolongations = prolongations;
    }
}