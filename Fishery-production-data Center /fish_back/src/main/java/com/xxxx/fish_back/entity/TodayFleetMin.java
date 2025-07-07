package com.xxxx.fish_back.entity;

import java.math.BigDecimal;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("today_fleet_min")
public class TodayFleetMin {
    private Integer id;
    private String today_fleet_id;
    private String today_fleet_name;
    private String today_fleet_status;
    private BigDecimal today_fleet_pre;
}