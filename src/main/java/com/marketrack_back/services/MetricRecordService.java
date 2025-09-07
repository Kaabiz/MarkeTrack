package com.marketrack_back.services;

import com.marketrack_back.entities.MetricRecord;
import com.marketrack_back.repositories.MetricRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MetricRecordService {
    private final MetricRecordRepository metricRecordRepository;

    public MetricRecordService(MetricRecordRepository metricRecordRepository) {
        this.metricRecordRepository = metricRecordRepository;
    }

    public List<MetricRecord> getAllMetricRecords() {
        return metricRecordRepository.findAll();
    }

    public Optional<MetricRecord> getMetricRecordById(Long id) {
        return metricRecordRepository.findById(id);
    }

    public MetricRecord createMetricRecord(MetricRecord metricRecord) {
        return metricRecordRepository.save(metricRecord);
    }

    public MetricRecord updateMetricRecord(Long id, MetricRecord details) {
        return metricRecordRepository.findById(id).map(mr -> {
            mr.setMetricRecordDate(details.getMetricRecordDate());
            mr.setMetricRecordImpressions(details.getMetricRecordImpressions());
            mr.setMetricRecordClicks(details.getMetricRecordClicks());
            mr.setMetricRecordSpend(details.getMetricRecordSpend());
            mr.setMetricRecordLeads(details.getMetricRecordLeads());
            mr.setMetricRecordConversions(details.getMetricRecordConversions());
            mr.setMetricRecordRevenue(details.getMetricRecordRevenue());
            return metricRecordRepository.save(mr);
        }).orElseThrow(() -> new RuntimeException("MetricRecord not found"));
    }

    public void deleteMetricRecord(Long id) {
        metricRecordRepository.deleteById(id);
    }
}