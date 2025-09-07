package com.marketrack_back.repositories;

import com.marketrack_back.entities.MetricRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MetricRecordRepository extends JpaRepository<MetricRecord, Long> {
}