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
@TableName("dock_out_direct")

public class Direct {
    private Integer id;
    private Integer dock_out_year;
    private Integer dock_out_month;
    private Integer dock_out_day;
    private Integer dock_out_hour;
    private Date dock_out_time;
    private String dock_out_name;
    private String dock_out_type;
    private BigDecimal dock_out_weight;
    private String dock_out_buyinfo;
}
