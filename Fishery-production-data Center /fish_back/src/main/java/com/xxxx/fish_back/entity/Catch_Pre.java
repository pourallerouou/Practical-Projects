package com.xxxx.fish_back.entity;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Time;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("fsy_catchpre")
public class Catch_Pre {

    // 主键ID，自增
    public int id;
    // 捕捞日期
    public Date catch_Date;
    // 捕捞时间
    public Time catch_Time;
    // 捕捞类型（鱼类/甲壳类/软体动物等）
    public String catch_Type;
    // 捕捞重量（公斤）
    public BigDecimal catch_Weight;
    // 渔船编号（格式：两位大写字母+五位数字）
    public String catch_Ship;
    // 上岸码头（可为空）
    public String catch_Dock;
    // 渔场名称（来自图片中的7个渔场）
    public String catch_Fishery;
    // 海产品名称
    public String catch_Name;
    // 备注信息（可为空）
    public String catch_Other;
    }
