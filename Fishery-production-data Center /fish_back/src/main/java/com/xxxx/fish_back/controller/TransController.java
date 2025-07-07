package com.xxxx.fish_back.controller;

import com.google.gson.Gson;
import com.xxxx.fish_back.entity.Trans;
import com.xxxx.fish_back.mapper.TransMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@SuppressWarnings("all")
@CrossOrigin(origins = {"*","null"})
public class TransController {
    @Autowired
    private TransMapper transMapper;
    private Gson gson = new Gson();

    @GetMapping("/trans")
    public String getTrans() {
        List<Trans> trans = transMapper.selectList(null);
        return gson.toJson(trans);
    }

    @RequestMapping("/selecttrans")
    public List<Trans> selectTrans() {
        return transMapper.selectList(null);
    }

}
