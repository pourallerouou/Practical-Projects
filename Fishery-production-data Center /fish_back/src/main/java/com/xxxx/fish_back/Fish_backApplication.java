package com.xxxx.fish_back;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.xxxx.fish_back.mapper")
public class Fish_backApplication {

    public static void main(String[] args) {
        SpringApplication.run(Fish_backApplication.class, args);
    }

}
