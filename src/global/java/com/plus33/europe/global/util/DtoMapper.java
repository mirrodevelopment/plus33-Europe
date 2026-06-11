package com.plus33.europe.global.util;

import com.plus33.europe.local.model.Product;
import com.plus33.europe.local.dto.ProductDTO;
import com.plus33.europe.global.model.JournalStory;
import com.plus33.europe.global.dto.JournalStoryDTO;
import com.plus33.europe.global.model.FranchiseApplication;
import com.plus33.europe.global.dto.FranchiseApplicationDTO;

public class DtoMapper {

    public static ProductDTO toProductDto(Product entity) {
        if (entity == null) return null;
        return new ProductDTO(
            entity.getId(),
            entity.getName(),
            entity.getDescription(),
            entity.getPrice(),
            entity.getCategory(),
            entity.getOrigin(),
            entity.getRoast(),
            entity.getNotes(),
            entity.getImagePath(),
            entity.getBadge()
        );
    }

    public static JournalStoryDTO toJournalStoryDto(JournalStory entity) {
        if (entity == null) return null;
        return new JournalStoryDTO(
            entity.getId(),
            entity.getTitle(),
            entity.getCategory(),
            entity.getDateString(),
            entity.getImagePath(),
            entity.getExcerpt(),
            entity.getReadTime(),
            entity.getSubtitle(),
            entity.isFeatured()
        );
    }

    public static FranchiseApplicationDTO toFranchiseDto(FranchiseApplication entity) {
        if (entity == null) return null;
        return new FranchiseApplicationDTO(
            entity.getId(),
            entity.getName(),
            entity.getEmail(),
            entity.getPhone(),
            entity.getCity(),
            entity.getCapital(),
            entity.getBackground()
        );
    }

    public static FranchiseApplication toFranchiseEntity(FranchiseApplicationDTO dto) {
        if (dto == null) return null;
        FranchiseApplication entity = new FranchiseApplication();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setCity(dto.getCity());
        entity.setCapital(dto.getCapital());
        entity.setBackground(dto.getBackground());
        return entity;
    }
}
