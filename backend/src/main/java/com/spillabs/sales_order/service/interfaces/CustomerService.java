package com.spillabs.sales_order.service.interfaces;

import com.spillabs.sales_order.dto.CustomerDTO;
import java.util.List;

public interface CustomerService {
    List<CustomerDTO> getAllCustomers();

    CustomerDTO createCustomer(CustomerDTO customerDTO);
}
