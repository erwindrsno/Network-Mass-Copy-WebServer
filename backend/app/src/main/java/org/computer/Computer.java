package org.computer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Computer {
    Long id;
    String ip_address;
    String host_name;
    int lab_num;
}
