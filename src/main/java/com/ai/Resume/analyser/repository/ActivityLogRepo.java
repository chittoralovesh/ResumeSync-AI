package com.ai.Resume.analyser.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ai.Resume.analyser.model.ActivityLog;

@Repository
public interface ActivityLogRepo extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByUsernameOrderByTimestampDesc(String username);
    List<ActivityLog> findTop10ByUsernameOrderByTimestampDesc(String username);
}
