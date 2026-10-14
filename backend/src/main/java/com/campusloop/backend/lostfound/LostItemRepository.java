package com.campusloop.backend.lostfound;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LostItemRepository extends JpaRepository<LostItem, Long> {
    List<LostItem> findAllByOrderByIdDesc();
}