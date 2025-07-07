package com.xxxx.fish_back.entity;


import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("dock_out_fleet")
public class Trans {
    private Integer id;
    private short dock_out_year;
    private short dock_out_month;
    private short dock_out_day;
    private short dock_out_hour;
    private Date dock_out_time;
    private String dock_out_fleet;
    private String dock_out_company;
    private String dock_out_name;
    private String dock_out_type;
    private BigDecimal dock_out_weight;
    private String dock_out_other;

}
