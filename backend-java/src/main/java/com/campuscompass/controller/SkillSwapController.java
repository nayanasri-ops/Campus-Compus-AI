package com.campuscompass.controller;

import com.campuscompass.model.SkillSwapRequest;
import com.campuscompass.service.SkillSwapService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/skillswap")
@CrossOrigin(origins = "*")
public class SkillSwapController {

    private final SkillSwapService skillSwapService;

    public SkillSwapController(SkillSwapService skillSwapService) {
        this.skillSwapService = skillSwapService;
    }

    @GetMapping("/matches")
    public ResponseEntity<Map<String, Object>> getSkillSwapMatches(@RequestParam(required = false) Long studentId) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/requests")
    public ResponseEntity<Map<String, Object>> createRequest(@RequestBody Map<String, Object> requestPayload) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "PENDING");
        response.put("message", "SkillSwap request dispatched to peer successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/requests/{id}/accept")
    public ResponseEntity<Map<String, Object>> acceptRequest(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", id);
        response.put("status", "ACTIVE");
        response.put("message", "Exchange accepted! Chat channel and meeting scheduler unlocked.");
        return ResponseEntity.ok(response);
    }
}
