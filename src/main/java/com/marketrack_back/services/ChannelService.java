package com.marketrack_back.services;

import com.marketrack_back.entities.Channel;
import com.marketrack_back.repositories.ChannelRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChannelService {
    private final ChannelRepository channelRepository;

    public ChannelService(ChannelRepository channelRepository) {
        this.channelRepository = channelRepository;
    }

    public List<Channel> getAllChannels() {
        return channelRepository.findAll();
    }

    public Optional<Channel> getChannelById(Long id) {
        return channelRepository.findById(id);
    }

    public Channel createChannel(Channel channel) {
        return channelRepository.save(channel);
    }

    public Channel updateChannel(Long id, Channel channelDetails) {
        return channelRepository.findById(id).map(channel -> {
            channel.setChannelName(channelDetails.getChannelName());
            channel.setChannelType(channelDetails.getChannelType());
            return channelRepository.save(channel);
        }).orElseThrow(() -> new RuntimeException("Channel not found"));
    }

    public void deleteChannel(Long id) {
        channelRepository.deleteById(id);
    }
}