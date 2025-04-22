package org.custom_dto;

import org.entry.Entry;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomEntry {
  Entry entry;
  int permissions;
}
