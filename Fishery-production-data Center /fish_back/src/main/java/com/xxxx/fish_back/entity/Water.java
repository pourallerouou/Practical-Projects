package com.xxxx.fish_back.entity;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("water")
public class Water {
    public int id;
    public String water_fishery;
    public short water_year;
    public short water_month;
    public short water_day;
    public short water_hour;
    public float water_T;
    public float water_MN;
    public float water_PH;
    public float water_DO;
    public float water_TCL;
    public float water_HCL;
    public float water_temp;
    public float water_TN;
    public float water_NO2;
    public float water_NO3;
    public float water_TP;
    public float water_S;
    public float water_SS;
    public float water_HM;
    public short water_mark;
}
