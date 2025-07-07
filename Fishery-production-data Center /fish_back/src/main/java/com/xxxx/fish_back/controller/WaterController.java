package com.xxxx.fish_back.controller;

import com.google.gson.Gson;
import com.xxxx.fish_back.entity.Water;
import com.xxxx.fish_back.mapper.WaterMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @SuppressWarnings("all")
@CrossOrigin(origins = {"*","null"})
    public class WaterController {
        @Autowired
        private WaterMapper waterMapper;
        private Gson gson = new Gson();

        @GetMapping("/water")
        public String getWater() {
            List<Water> water = waterMapper.selectList(null);
            return gson.toJson(water);
        }

        @RequestMapping("/selectwater")
        public List<Water> selectWater() {
            return waterMapper.selectList(null);
        }

//    @GetMapping("/selectpage")
//    public String  selectpage(@RequestParam(defaultValue = "1") Integer pageNum, @RequestParam(defaultValue = "10") Integer pageSize) {
//    }

        @PostMapping("/addwater")
        public String addWater(@RequestBody Water water) {
            waterMapper.insert(water);
            return gson.toJson(water);
        }

        @PostMapping("/deletewater")
        public String deleteWater(@RequestBody Water water) {
            waterMapper.deleteById(water);
            return gson.toJson(water);
        }


        @PostMapping("/updatewater")
        public String updateWater(@RequestBody Water water) {
            waterMapper.updateById(water);
            return gson.toJson(water);
        }
    }


