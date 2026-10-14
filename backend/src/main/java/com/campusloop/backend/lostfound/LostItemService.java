package com.campusloop.backend.lostfound;

import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class LostItemService {

    private final LostItemRepository lostItemRepository;

    public LostItemService(LostItemRepository lostItemRepository) {
        this.lostItemRepository = lostItemRepository;
    }

    public LostItem addLostItem(LostItem lostItem) {
        if (lostItem.getDateFound() == null || lostItem.getDateFound().isBlank()) {
            lostItem.setDateFound(LocalDate.now().toString());
        }
        return lostItemRepository.save(lostItem);
    }

    public List<LostItem> getAllLostItems() {
        return lostItemRepository.findAllByOrderByIdDesc();
    }

    public LostItem getLostItemById(Long id) {
        return lostItemRepository.findById(id).orElse(null);
    }
}