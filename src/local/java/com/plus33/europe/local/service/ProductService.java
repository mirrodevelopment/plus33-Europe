package com.plus33.europe.local.service;

import com.plus33.europe.local.dto.ProductDTO;
import org.springframework.lang.NonNull;
import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<ProductDTO> getProducts(String category);
    Optional<ProductDTO> getProductById(@NonNull Long id);
}
