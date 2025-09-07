package com.marketrack_back.services;

import com.marketrack_back.entities.Report;
import com.marketrack_back.repositories.ReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReportService {
    private final ReportRepository reportRepository;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Optional<Report> getReportById(Long id) {
        return reportRepository.findById(id);
    }

    public Report createReport(Report report) {
        return reportRepository.save(report);
    }

    public Report updateReport(Long id, Report reportDetails) {
        return reportRepository.findById(id).map(report -> {
            report.setReportFromDate(reportDetails.getReportFromDate());
            report.setReportToDate(reportDetails.getReportToDate());
            report.setReportFormat(reportDetails.getReportFormat());
            report.setReportStoragePath(reportDetails.getReportStoragePath());
            return reportRepository.save(report);
        }).orElseThrow(() -> new RuntimeException("Report not found"));
    }

    public void deleteReport(Long id) {
        reportRepository.deleteById(id);
    }
}