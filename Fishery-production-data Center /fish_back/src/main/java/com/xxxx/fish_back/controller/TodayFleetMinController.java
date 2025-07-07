package com.xxxx.fish_back.controller;

import com.google.gson.Gson;
import com.xxxx.fish_back.entity.TodayFleetMin;
import com.xxxx.fish_back.mapper.TodayFleetMinMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@SuppressWarnings("all")
@CrossOrigin(origins = {"*","null"})
public class TodayFleetMinController {
    @Autowired
    private TodayFleetMinMapper todayFleetMinMapper;
    private Gson gson = new Gson();

    @GetMapping("/todayfleet")
    public String getTodayDockMin() {
        List<TodayFleetMin> todayFleetMin = todayFleetMinMapper.selectList(null);
        return gson.toJson(todayFleetMin);
    }

    @RequestMapping("/select_todayfleet")
    public List<TodayFleetMin> selectTodayFleetMin() {
        return todayFleetMinMapper.selectList(null);
    }

}
