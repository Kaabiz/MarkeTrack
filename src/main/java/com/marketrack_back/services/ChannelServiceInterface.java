package com.marketrack_back.services;

import com.marketrack_back.entities.Channel;

import java.util.List;
import java.util.Optional;

public interface ChannelServiceInterface {
    List<Channel> getAllChannels();
    Optional<Channel> getChannelById(Long id);
    Channel createChannel(Channel channel);
    Channel updateChannel(Long id, Channel channelDetails);
    void deleteChannel(Long id);
}