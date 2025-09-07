package com.marketrack_back.entities;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    private LocalDate reportFromDate;
    private LocalDate reportToDate;
    @Enumerated(EnumType.STRING)
    private ReportFormat reportFormat;
    private String reportStoragePath;
    private Instant reportCreatedAt;

    @ManyToOne
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public LocalDate getReportFromDate() {
        return reportFromDate;
    }

    public void setReportFromDate(LocalDate reportFromDate) {
        this.reportFromDate = reportFromDate;
    }

    public LocalDate getReportToDate() {
        return reportToDate;
    }

    public void setReportToDate(LocalDate reportToDate) {
        this.reportToDate = reportToDate;
    }

    public ReportFormat getReportFormat() {
        return reportFormat;
    }

    public void setReportFormat(ReportFormat reportFormat) {
        this.reportFormat = reportFormat;
    }

    public String getReportStoragePath() {
        return reportStoragePath;
    }

    public void setReportStoragePath(String reportStoragePath) {
        this.reportStoragePath = reportStoragePath;
    }

    public Instant getReportCreatedAt() {
        return reportCreatedAt;
    }

    public void setReportCreatedAt(Instant reportCreatedAt) {
        this.reportCreatedAt = reportCreatedAt;
    }

    public Campaign getCampaign() {
        return campaign;
    }

    public void setCampaign(Campaign campaign) {
        this.campaign = campaign;
    }
}