package com.marketrack_back.services;

import com.marketrack_back.entities.Report;

import java.util.List;
import java.util.Optional;

public interface ReportServiceInterface {
    List<Report> getAllReports();
    Optional<Report> getReportById(Long id);
    Report createReport(Report report);
    Report updateReport(Long id, Report reportDetails);
    void deleteReport(Long id);
}