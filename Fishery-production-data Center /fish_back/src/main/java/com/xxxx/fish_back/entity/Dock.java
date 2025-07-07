package com.xxxx.fish_back.entity;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("dock_info")
public class Dock {
    private Integer id;
    private String dock_name;
    private String dock_loca;
    private Integer dock_berths;
    private BigDecimal dock_line;
    private Integer dock_deep;
    private String dock_equip;
    private BigDecimal dock_area;
    private Integer dock_capa;
    private String dock_state;
    private String dock_tel;
}
