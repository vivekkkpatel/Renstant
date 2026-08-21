package com.renstant.backend;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RenstantApplication {

	public static void main(String[] args) {
		SpringApplication.run(RenstantApplication.class, args);
	}

}
