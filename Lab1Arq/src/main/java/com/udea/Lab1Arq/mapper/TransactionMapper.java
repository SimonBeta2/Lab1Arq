package com.udea.Lab1Arq.mapper;

import com.udea.Lab1Arq.DTO.TransactionDTO;
import com.udea.Lab1Arq.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TransactionMapper {
TransactionMapper INSTANCE = Mappers.getMapper(TransactionMapper.class);
TransactionDTO toDTO(Transaction transaction);



}