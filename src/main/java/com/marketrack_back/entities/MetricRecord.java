package com.marketrack_back.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class MetricRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long metricRecordId;

    private LocalDate metricRecordDate;
    private long metricRecordImpressions;
    private long metricRecordClicks;
    private BigDecimal metricRecordSpend;
    private long metricRecordLeads;
    private long metricRecordConversions;
    private BigDecimal metricRecordRevenue;

    @ManyToOne
    @JoinColumn(name = "campaign_channel_id")
    private CampaignChannel campaignChannel;

    public Long getMetricRecordId() {
        return metricRecordId;
    }

    public void setMetricRecordId(Long metricRecordId) {
        this.metricRecordId = metricRecordId;
    }

    public LocalDate getMetricRecordDate() {
        return metricRecordDate;
    }

    public void setMetricRecordDate(LocalDate metricRecordDate) {
        this.metricRecordDate = metricRecordDate;
    }

    public long getMetricRecordImpressions() {
        return metricRecordImpressions;
    }

    public void setMetricRecordImpressions(long metricRecordImpressions) {
        this.metricRecordImpressions = metricRecordImpressions;
    }

    public long getMetricRecordClicks() {
        return metricRecordClicks;
    }

    public void setMetricRecordClicks(long metricRecordClicks) {
        this.metricRecordClicks = metricRecordClicks;
    }

    public BigDecimal getMetricRecordSpend() {
        return metricRecordSpend;
    }

    public void setMetricRecordSpend(BigDecimal metricRecordSpend) {
        this.metricRecordSpend = metricRecordSpend;
    }

    public long getMetricRecordLeads() {
        return metricRecordLeads;
    }

    public void setMetricRecordLeads(long metricRecordLeads) {
        this.metricRecordLeads = metricRecordLeads;
    }

    public long getMetricRecordConversions() {
        return metricRecordConversions;
    }

    public void setMetricRecordConversions(long metricRecordConversions) {
        this.metricRecordConversions = metricRecordConversions;
    }

    public BigDecimal getMetricRecordRevenue() {
        return metricRecordRevenue;
    }

    public void setMetricRecordRevenue(BigDecimal metricRecordRevenue) {
        this.metricRecordRevenue = metricRecordRevenue;
    }

    public CampaignChannel getCampaignChannel() {
        return campaignChannel;
    }

    public void setCampaignChannel(CampaignChannel campaignChannel) {
        this.campaignChannel = campaignChannel;
    }
}