package com.marketrack_back.repositories;

import com.marketrack_back.entities.CampaignChannel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CampaignChannelRepository extends JpaRepository<CampaignChannel, Long> {
}