package com.xxxx.fish_back.controller;

import com.google.gson.Gson;
import com.xxxx.fish_back.entity.TodayDockMin;
import com.xxxx.fish_back.mapper.TodayDockMinMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@SuppressWarnings("all")
@CrossOrigin(origins = {"*","null"})
public class TodayDockMinController {
    @Autowired
    private TodayDockMinMapper todayDockMinMapper;
    private Gson gson = new Gson();

    @GetMapping("/todaydock")
    public String getTodayDockMin() {
        List<TodayDockMin> todayDockMin = todayDockMinMapper.selectList(null);
        return gson.toJson(todayDockMin);
    }

    @RequestMapping("/select_todaydock")
    public List<TodayDockMin> selectTodayDockMin() {
        return todayDockMinMapper.selectList(null);
    }

}

