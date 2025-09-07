package com.marketrack_back.services;

import com.marketrack_back.entities.Tag;

import java.util.List;
import java.util.Optional;

public interface TagServiceInterface {
    List<Tag> getAllTags();
    Optional<Tag> getTagById(Long id);
    Tag createTag(Tag tag);
    Tag updateTag(Long id, Tag tagDetails);
    void deleteTag(Long id);
}