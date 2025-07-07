package com.xxxx.fish_back.controller;

import com.google.gson.Gson;
import com.xxxx.fish_back.entity.TodayShipMin;
import com.xxxx.fish_back.mapper.TodayShipMinMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@SuppressWarnings("all")
@CrossOrigin(origins = {"*","null"})
public class TodayShipMinController {
    @Autowired
    private TodayShipMinMapper todayShipMinMapper;
    private Gson gson = new Gson();

    @GetMapping("/todayship")
    public String getTodayShipMin() {
        List<TodayShipMin> todayShipMin = todayShipMinMapper.selectList(null);
        return gson.toJson(todayShipMin);
    }

    @RequestMapping("/select_todayship")
    public List<TodayShipMin> selectTodayShip() {
        return todayShipMinMapper.selectList(null);
    }

}
