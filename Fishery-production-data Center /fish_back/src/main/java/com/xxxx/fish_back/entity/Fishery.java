package com.xxxx.fish_back.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("fsy")
public class Fishery {
    private Integer id;
    private String fsy_id ;
    private String fsy_name ;
    private Integer fsy_area ;
    private Integer fsy_deep ;
    private String fsy_bottom ;
    private String fsy_resource ;
    private String fsy_opeart ;
    private Integer fsy_output ;
    private Integer fsy_value ;
    private String fsy_admin ;
    private String fsy_phone ;
}
