package com.plus33.europe.local.service;

import com.plus33.europe.local.dto.ProductDTO;
import com.plus33.europe.local.model.Product;
import com.plus33.europe.local.repository.ProductRepository;
import com.plus33.europe.global.util.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<ProductDTO> getProducts(String category) {
        List<Product> products;
        if (category == null || category.trim().isEmpty() || "all".equalsIgnoreCase(category)) {
            products = productRepository.findAll();
        } else {
            products = productRepository.findByCategory(category.toLowerCase());
        }
        return products.stream()
                .map(DtoMapper::toProductDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ProductDTO> getProductById(Long id) {
        return productRepository.findById(id)
                .map(DtoMapper::toProductDto);
    }
}
