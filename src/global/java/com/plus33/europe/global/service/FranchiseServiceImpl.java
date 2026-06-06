package com.plus33.europe.global.service;

import com.plus33.europe.global.dto.FranchiseApplicationDTO;
import com.plus33.europe.global.model.FranchiseApplication;
import com.plus33.europe.global.repository.FranchiseRepository;
import com.plus33.europe.global.util.DtoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FranchiseServiceImpl implements FranchiseService {

    private final FranchiseRepository franchiseRepository;

    @Autowired
    public FranchiseServiceImpl(FranchiseRepository franchiseRepository) {
        this.franchiseRepository = franchiseRepository;
    }

    @Override
    public FranchiseApplicationDTO submitApplication(FranchiseApplicationDTO dto) {
        FranchiseApplication entity = DtoMapper.toFranchiseEntity(dto);
        FranchiseApplication saved = franchiseRepository.save(entity);
        return DtoMapper.toFranchiseDto(saved);
    }
}
