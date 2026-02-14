package com.spillabs.sales_order.service.implementations;

import com.spillabs.sales_order.domain.entity.Customer;
import com.spillabs.sales_order.domain.entity.Item;
import com.spillabs.sales_order.domain.entity.SalesOrder;
import com.spillabs.sales_order.domain.entity.SalesOrderItem;
import com.spillabs.sales_order.dto.SalesOrderDTO;
import com.spillabs.sales_order.dto.SalesOrderItemDTO;
import com.spillabs.sales_order.repository.CustomerRepository;
import com.spillabs.sales_order.repository.ItemRepository;
import com.spillabs.sales_order.repository.SalesOrderRepository;
import com.spillabs.sales_order.service.interfaces.SalesOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalesOrderServiceImpl implements SalesOrderService {

    private final SalesOrderRepository salesOrderRepository;
    private final CustomerRepository customerRepository;
    private final ItemRepository itemRepository;

    @Override
    @Transactional
    public SalesOrderDTO createOrder(SalesOrderDTO dto) {
        SalesOrder order = new SalesOrder();
        updateOrderFromDTO(order, dto);
        SalesOrder savedOrder = salesOrderRepository.save(order);
        return convertToDTO(savedOrder);
    }

    @Override
    @Transactional
    public SalesOrderDTO updateOrder(Long id, SalesOrderDTO dto) {
        SalesOrder order = salesOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Clear existing items to be replaced/updated (Simplified approach: clear and
        // re-add)
        // In a real app, you might want to update existing items to preserve IDs if
        // needed,
        // but for this task, clearing and re-adding is often acceptable for "edit
        // order".
        order.getItems().clear();

        updateOrderFromDTO(order, dto);
        SalesOrder savedOrder = salesOrderRepository.save(order);
        return convertToDTO(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalesOrderDTO> getAllOrders() {
        return salesOrderRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SalesOrderDTO getOrderById(Long id) {
        return salesOrderRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    private void updateOrderFromDTO(SalesOrder order, SalesOrderDTO dto) {
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        order.setCustomer(customer);
        order.setInvoiceNo(dto.getInvoiceNo());
        order.setInvoiceDate(dto.getInvoiceDate());
        order.setReferenceNo(dto.getReferenceNo());
        order.setNote(dto.getNote());

        BigDecimal totalExcl = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;
        BigDecimal totalIncl = BigDecimal.ZERO;

        if (dto.getItems() != null) {
            for (SalesOrderItemDTO itemDTO : dto.getItems()) {
                SalesOrderItem item = new SalesOrderItem();
                Item product = itemRepository.findById(itemDTO.getItemId())
                        .orElseThrow(() -> new RuntimeException("Item not found"));

                item.setItem(product);
                item.setQuantity(itemDTO.getQuantity());
                item.setPrice(itemDTO.getPrice()); // User can edit price or use product price
                item.setTaxRate(itemDTO.getTaxRate());
                item.setNote(itemDTO.getNote());

                // Calculations
                // Excl Amount = Quantity * Price
                BigDecimal exclAmount = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

                // Tax Amount = Excl Amount * Tax Rate / 100
                BigDecimal taxAmount = exclAmount.multiply(item.getTaxRate()).divide(BigDecimal.valueOf(100), 2,
                        RoundingMode.HALF_UP);

                // Incl Amount = Excl Amount + Tax Amount
                BigDecimal inclAmount = exclAmount.add(taxAmount);

                item.setExclAmount(exclAmount);
                item.setTaxAmount(taxAmount);
                item.setInclAmount(inclAmount);

                order.addItem(item);

                totalExcl = totalExcl.add(exclAmount);
                totalTax = totalTax.add(taxAmount);
                totalIncl = totalIncl.add(inclAmount);
            }
        }

        order.setTotalExcl(totalExcl);
        order.setTotalTax(totalTax);
        order.setTotalIncl(totalIncl);
    }

    private SalesOrderDTO convertToDTO(SalesOrder order) {
        SalesOrderDTO dto = new SalesOrderDTO();
        dto.setId(order.getId());
        dto.setCustomerId(order.getCustomer().getId());
        dto.setCustomerName(order.getCustomer().getName());
        dto.setInvoiceNo(order.getInvoiceNo());
        dto.setInvoiceDate(order.getInvoiceDate());
        dto.setReferenceNo(order.getReferenceNo());
        dto.setNote(order.getNote());
        dto.setTotalExcl(order.getTotalExcl());
        dto.setTotalTax(order.getTotalTax());
        dto.setTotalIncl(order.getTotalIncl());
        dto.setCreatedAt(order.getCreatedAt());

        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream().map(this::convertToItemDTO).collect(Collectors.toList()));
        }

        return dto;
    }

    private SalesOrderItemDTO convertToItemDTO(SalesOrderItem item) {
        SalesOrderItemDTO dto = new SalesOrderItemDTO();
        dto.setId(item.getId());
        dto.setItemId(item.getItem().getId());
        dto.setItemCode(item.getItem().getCode());
        dto.setItemDescription(item.getItem().getDescription());
        dto.setNote(item.getNote());
        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getPrice());
        dto.setTaxRate(item.getTaxRate());
        dto.setExclAmount(item.getExclAmount());
        dto.setTaxAmount(item.getTaxAmount());
        dto.setInclAmount(item.getInclAmount());
        return dto;
    }
}
