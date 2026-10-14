package com.campusloop.backend.lostfound;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/lost-found")
public class LostItemController {

    private final LostItemService lostItemService;

    public LostItemController(LostItemService lostItemService) {
        this.lostItemService = lostItemService;
    }

    @PostMapping
    public ResponseEntity<?> addLostItem(@RequestBody LostItem lostItem) {
        if (lostItem == null || lostItem.getItemName() == null || lostItem.getItemName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Item name is required."));
        }

        LostItem saved = lostItemService.addLostItem(lostItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public List<LostItem> getAllLostItems() {
        return lostItemService.getAllLostItems();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLostItemById(@PathVariable Long id) {
        LostItem item = lostItemService.getLostItemById(id);
        if (item == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Item not found."));
        }
        return ResponseEntity.ok(item);
    }
}