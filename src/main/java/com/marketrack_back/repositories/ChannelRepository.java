package com.marketrack_back.repositories;

import com.marketrack_back.entities.Channel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChannelRepository extends JpaRepository<Channel, Long> {
}