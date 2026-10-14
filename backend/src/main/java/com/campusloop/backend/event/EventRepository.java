package com.campusloop.backend.event;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campusloop.backend.entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
}