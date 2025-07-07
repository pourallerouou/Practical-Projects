package com.xxxx.fish_back.entity;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.sql.Time;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("fishery_catch")

/**
 * -- 创建渔获记录表
 * CREATE TABLE fishery_catch (
 *     id INT AUTO_INCREMENT PRIMARY KEY,
 *     catch_fishery VARCHAR(20) NOT NULL COMMENT '渔场名称',
 *     catch_ship VARCHAR(10) NOT NULL COMMENT '渔船编号',
 *     catch_dock VARCHAR(50) NOT NULL COMMENT '停靠码头',
 *     catch_company VARCHAR(50) NOT NULL COMMENT '所属公司',
 *     catch_year INT NOT NULL COMMENT '年',
 *     catch_month TINYINT NOT NULL COMMENT '月(1-12)',
 *     catch_day TINYINT NOT NULL COMMENT '日(1-31)',
 *     catch_week TINYINT COMMENT '周(1-52)',
 *     catch_date DATE NOT NULL COMMENT '日期',
 *     catch_hour TINYINT NOT NULL COMMENT '小时',
 *     catch_time TIME NOT NULL COMMENT '时间(24小时制)',
 *     catch_type VARCHAR(20) NOT NULL COMMENT '海产类别',
 *     catch_name VARCHAR(20) NOT NULL COMMENT '海产名称',
 *     catch_weight DECIMAL(10,2) NOT NULL COMMENT '重量(单位:公斤)',
 *     catch_other TEXT COMMENT '备注'
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='捕捞记录总表';
 */

public class Catch {
    // 主键ID，自增
    private Integer id;
    private String catch_fishery;
    private String catch_ship;
    private String catch_dock;
    private String catch_company;
    private Integer catch_year;
    private Integer catch_month;
    private Integer catch_day;  // 字段名是catch_yday而非catch_day
    private Integer catch_week;  //
    private Date catch_date;
    private Integer catch_hour;
    private Time catch_time;
    private String catch_type;  // 图片中类型为VARCH(50)，对应Java的String
    private String catch_name;
    private Double catch_weight;  // DECIMAL(10,2)对应Java的Double
    private String catch_other;
}



