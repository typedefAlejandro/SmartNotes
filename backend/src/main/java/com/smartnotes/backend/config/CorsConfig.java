package com.smartnotes.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
// Configuração global de CORS para permitir requisições de qualquer origem e método.
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Configura o CORS para aceitar requisições de qualquer origem e método HTTP.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedOrigins("*").allowedMethods("*");
    }
}
