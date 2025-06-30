package com.openclassrooms.poc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class PocApplication {

	public static void main(String[] args) {
		SpringApplication.run(PocApplication.class, args);
	}

}
