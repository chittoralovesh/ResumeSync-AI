package com.ai.Resume.analyser.model;

import java.util.List;

public class DashboardStatsDto {
    private int latestScore;
    private int latestAtsScore;
    private int totalResumesAnalyzed;
    private List<ActivityLog> recentActivities;

    public int getLatestScore() { return latestScore; }
    public void setLatestScore(int latestScore) { this.latestScore = latestScore; }

    public int getLatestAtsScore() { return latestAtsScore; }
    public void setLatestAtsScore(int latestAtsScore) { this.latestAtsScore = latestAtsScore; }

    public int getTotalResumesAnalyzed() { return totalResumesAnalyzed; }
    public void setTotalResumesAnalyzed(int totalResumesAnalyzed) { this.totalResumesAnalyzed = totalResumesAnalyzed; }

    public List<ActivityLog> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<ActivityLog> recentActivities) { this.recentActivities = recentActivities; }
}
