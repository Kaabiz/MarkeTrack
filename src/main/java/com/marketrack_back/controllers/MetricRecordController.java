package com.marketrack_back.controllers;

import com.marketrack_back.entities.MetricRecord;
import com.marketrack_back.services.MetricRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metric-records")
public class MetricRecordController {
    private final MetricRecordService metricRecordService;

    public MetricRecordController(MetricRecordService metricRecordService) {
        this.metricRecordService = metricRecordService;
    }

    @GetMapping
    public List<MetricRecord> getAllMetricRecords() {
        return metricRecordService.getAllMetricRecords();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MetricRecord> getMetricRecordById(@PathVariable Long id) {
        return metricRecordService.getMetricRecordById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public MetricRecord createMetricRecord(@RequestBody MetricRecord metricRecord) {
        return metricRecordService.createMetricRecord(metricRecord);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MetricRecord> updateMetricRecord(@PathVariable Long id, @RequestBody MetricRecord details) {
        try {
            return ResponseEntity.ok(metricRecordService.updateMetricRecord(id, details));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMetricRecord(@PathVariable Long id) {
        metricRecordService.deleteMetricRecord(id);
        return ResponseEntity.noContent().build();
    }
}