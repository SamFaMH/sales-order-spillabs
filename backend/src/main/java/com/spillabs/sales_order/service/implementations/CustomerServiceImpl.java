package com.spillabs.sales_order.service.implementations;

import com.spillabs.sales_order.domain.entity.Customer;
import com.spillabs.sales_order.dto.CustomerDTO;
import com.spillabs.sales_order.repository.CustomerRepository;
import com.spillabs.sales_order.service.interfaces.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        Customer customer = convertToEntity(customerDTO);
        Customer savedCustomer = customerRepository.save(customer);
        return convertToDTO(savedCustomer);
    }

    private CustomerDTO convertToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setAddress1(customer.getAddress1());
        dto.setAddress2(customer.getAddress2());
        dto.setAddress3(customer.getAddress3());
        dto.setSuburb(customer.getSuburb());
        dto.setState(customer.getState());
        dto.setPostCode(customer.getPostCode());
        dto.setCreatedAt(customer.getCreatedAt());
        return dto;
    }

    private Customer convertToEntity(CustomerDTO dto) {
        Customer customer = new Customer();
        customer.setName(dto.getName());
        customer.setAddress1(dto.getAddress1());
        customer.setAddress2(dto.getAddress2());
        customer.setAddress3(dto.getAddress3());
        customer.setSuburb(dto.getSuburb());
        customer.setState(dto.getState());
        customer.setPostCode(dto.getPostCode());
        return customer;
    }
}
