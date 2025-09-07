package com.marketrack_back.services;

import com.marketrack_back.entities.MetricRecord;

import java.util.List;
import java.util.Optional;

public interface MetricRecordServiceInterface {
    List<MetricRecord> getAllMetricRecords();
    Optional<MetricRecord> getMetricRecordById(Long id);
    MetricRecord createMetricRecord(MetricRecord metricRecord);
    MetricRecord updateMetricRecord(Long id, MetricRecord details);
    void deleteMetricRecord(Long id);
}