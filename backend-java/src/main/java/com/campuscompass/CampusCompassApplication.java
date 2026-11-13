package com.campuscompass;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CampusCompassApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusCompassApplication.class, args);
        System.out.println("==================================================");
        System.out.println("   CAMPUS COMPASS AI - SPRING BOOT BACKEND        ");
        System.out.println("   Learn. Collaborate. Skill-Swap. Career Ready.  ");
        System.out.println("==================================================");
    }
}
