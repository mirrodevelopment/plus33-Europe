package com.plus33.europe.global.repository;

import com.plus33.europe.global.model.FranchiseApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FranchiseRepository extends JpaRepository<FranchiseApplication, Long> {
}
