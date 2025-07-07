package com.xxxx.fish_back.entity;


import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("ship")
public class Ship {
    private Long id;
    private String ship_id;       // 渔船编号
    private String ship_name;     // 渔船名
    private String ship_master;    // 船长姓名
    private Integer ship_number;   // 船员数量
    private String ship_type;     // 船类型
    private String ship_company;  // 所属公司
    private String ship_power;    // 动力系统
    private String ship_material; // 船体材质
    private Integer ship_length;   // 长度
    private Integer ship_load;     // 载重
    private Integer ship_tonage;   // 排水量
    private Integer ship_range;    // 航程
    private String ship_equip;    // 装备
    private String ship_tel;      // 联系方式
}

