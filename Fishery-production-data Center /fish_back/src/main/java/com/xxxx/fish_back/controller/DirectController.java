package com.xxxx.fish_back.controller;

import com.google.gson.Gson;
import com.xxxx.fish_back.entity.Direct;
import com.xxxx.fish_back.mapper.DirectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SuppressWarnings("all")
@CrossOrigin(origins = {"*","null"})
public class DirectController {
    @Autowired
    private DirectMapper directMapper;
    private Gson gson = new Gson();

    @GetMapping("/direct")
    public String getDirect() {
        List<Direct> direct = directMapper.selectList(null);
        return gson.toJson(direct);
    }

    @RequestMapping("/selectdirect")
    public List<Direct> selectDirect() {
        return directMapper.selectList(null);
    }

}
