package com.xxxx.fish_back.controller;

import com.google.gson.Gson;
import com.xxxx.fish_back.entity.Catch;
import com.xxxx.fish_back.mapper.CatchMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SuppressWarnings("all")
@CrossOrigin(origins = {"*","null"})
public class CatchController {
    @Autowired
    private CatchMapper catchMapper;
    private Gson gson = new Gson();

    @GetMapping("/catch")
    public String getCatch() {
        List<Catch> catch_ = catchMapper.selectList(null);
        return gson.toJson(catch_);
    }

    @RequestMapping("/selectcatch")
    public List<Catch> selecCatch() {
        return catchMapper.selectList(null);
    }

//    @GetMapping("/selectpage")
//    public String  selectpage(@RequestParam(defaultValue = "1") Integer pageNum, @RequestParam(defaultValue = "10") Integer pageSize) {
//    }

    @PostMapping("/addcatch")
    public String addCatch(@RequestBody Catch catch_) {
        catchMapper.insert(catch_);
        return gson.toJson(catch_);
    }

    @PostMapping("/deletecatch")
    public String deleteCatch(@RequestBody Catch catch_) {
        catchMapper.deleteById(catch_);
        return gson.toJson(catch_);
    }


    @PostMapping("/updatecatch")
    public String updateCatch(@RequestBody Catch catch_) {
        catchMapper.updateById(catch_);
        return gson.toJson(catch_);
    }
}
