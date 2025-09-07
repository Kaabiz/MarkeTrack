package com.marketrack_back.entities;

import jakarta.persistence.*;
import java.util.Set;

@Entity
public class Channel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long channelId;

    @Enumerated(EnumType.STRING)
    private ChannelType channelType;

    private String channelName;

    @OneToMany(mappedBy = "channel")
    private Set<CampaignChannel> campaignChannels;

    public Long getChannelId() {
        return channelId;
    }

    public void setChannelId(Long channelId) {
        this.channelId = channelId;
    }

    public ChannelType getChannelType() {
        return channelType;
    }

    public void setChannelType(ChannelType channelType) {
        this.channelType = channelType;
    }

    public String getChannelName() {
        return channelName;
    }

    public void setChannelName(String channelName) {
        this.channelName = channelName;
    }

    public Set<CampaignChannel> getCampaignChannels() {
        return campaignChannels;
    }

    public void setCampaignChannels(Set<CampaignChannel> campaignChannels) {
        this.campaignChannels = campaignChannels;
    }
}