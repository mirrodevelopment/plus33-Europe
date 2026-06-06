package com.plus33.europe.local;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.plus33.europe")
@EnableJpaRepositories(basePackages = "com.plus33.europe")
@EntityScan(basePackages = "com.plus33.europe")
public class Plus33EuropeApplication {

	public static void main(String[] args) {
		SpringApplication.run(Plus33EuropeApplication.class, args);
	}

}
