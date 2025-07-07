package com.xxxx.fish_back.entity;

import java.math.BigDecimal;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("today_ship_min")
public class TodayShipMin {
    private Integer id;
    private String today_ship_id;
    private String today_ship_company;
    private BigDecimal today_ship_catch;
    private String today_ship_status;
}