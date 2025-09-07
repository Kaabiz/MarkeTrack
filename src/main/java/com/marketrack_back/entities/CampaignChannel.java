package com.marketrack_back.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Set;

@Entity
public class CampaignChannel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long campaignChannelId;

    private BigDecimal campaignChannelAllocatedBudget;
    private String campaignChannelUtmSource;
    private String campaignChannelUtmMedium;
    private String campaignChannelUtmCampaign;

    @ManyToOne
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    @ManyToOne
    @JoinColumn(name = "channel_id")
    private Channel channel;

    @OneToMany(mappedBy = "campaignChannel")
    private Set<MetricRecord> metricRecords;

    public Long getCampaignChannelId() {
        return campaignChannelId;
    }

    public void setCampaignChannelId(Long campaignChannelId) {
        this.campaignChannelId = campaignChannelId;
    }

    public BigDecimal getCampaignChannelAllocatedBudget() {
        return campaignChannelAllocatedBudget;
    }

    public void setCampaignChannelAllocatedBudget(BigDecimal campaignChannelAllocatedBudget) {
        this.campaignChannelAllocatedBudget = campaignChannelAllocatedBudget;
    }

    public String getCampaignChannelUtmSource() {
        return campaignChannelUtmSource;
    }

    public void setCampaignChannelUtmSource(String campaignChannelUtmSource) {
        this.campaignChannelUtmSource = campaignChannelUtmSource;
    }

    public String getCampaignChannelUtmMedium() {
        return campaignChannelUtmMedium;
    }

    public void setCampaignChannelUtmMedium(String campaignChannelUtmMedium) {
        this.campaignChannelUtmMedium = campaignChannelUtmMedium;
    }

    public String getCampaignChannelUtmCampaign() {
        return campaignChannelUtmCampaign;
    }

    public void setCampaignChannelUtmCampaign(String campaignChannelUtmCampaign) {
        this.campaignChannelUtmCampaign = campaignChannelUtmCampaign;
    }

    public Campaign getCampaign() {
        return campaign;
    }

    public void setCampaign(Campaign campaign) {
        this.campaign = campaign;
    }

    public Channel getChannel() {
        return channel;
    }

    public void setChannel(Channel channel) {
        this.channel = channel;
    }

    public Set<MetricRecord> getMetricRecords() {
        return metricRecords;
    }

    public void setMetricRecords(Set<MetricRecord> metricRecords) {
        this.metricRecords = metricRecords;
    }
}