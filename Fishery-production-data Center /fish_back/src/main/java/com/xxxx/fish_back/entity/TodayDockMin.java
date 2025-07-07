package com.xxxx.fish_back.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("today_dock_min")
public class TodayDockMin {
    private Integer id;
    private String today_dock_name;
    private BigDecimal today_dock_input;
    private BigDecimal today_dock_output;
    private String today_dock_status;
}
