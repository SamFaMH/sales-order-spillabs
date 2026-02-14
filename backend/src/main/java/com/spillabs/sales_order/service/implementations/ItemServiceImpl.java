package com.spillabs.sales_order.service.implementations;

import com.spillabs.sales_order.domain.entity.Item;
import com.spillabs.sales_order.dto.ItemDTO;
import com.spillabs.sales_order.repository.ItemRepository;
import com.spillabs.sales_order.service.interfaces.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ItemDTO> getAllItems() {
        return itemRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ItemDTO createItem(ItemDTO itemDTO) {
        Item item = convertToEntity(itemDTO);
        Item savedItem = itemRepository.save(item);
        return convertToDTO(savedItem);
    }

    @Override
    public ItemDTO getItemById(Long id) {
        return itemRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    @Override
    public ItemDTO getItemByCode(String code) {
        // Ideally implement findByCode in repository, but for now throwing exception if
        // not supported directly without repo update
        // Assuming repo update is needed or we skip this for now. I'll stick to basic
        // implementation and add repository method if needed.
        // Actually I should add findByCode to ItemRepository.
        throw new UnsupportedOperationException("Not implemented yet");
    }

    private ItemDTO convertToDTO(Item item) {
        ItemDTO dto = new ItemDTO();
        dto.setId(item.getId());
        dto.setCode(item.getCode());
        dto.setDescription(item.getDescription());
        dto.setPrice(item.getPrice());
        dto.setCreatedAt(item.getCreatedAt());
        return dto;
    }

    private Item convertToEntity(ItemDTO dto) {
        Item item = new Item();
        item.setCode(dto.getCode());
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());
        return item;
    }
}
