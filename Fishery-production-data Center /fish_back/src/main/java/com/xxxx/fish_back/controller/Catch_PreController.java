package com.xxxx.fish_back.controller;


import com.google.gson.Gson;
import com.xxxx.fish_back.entity.Catch_Pre;
import com.xxxx.fish_back.mapper.Catch_PreMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SuppressWarnings("all")
@CrossOrigin(origins = {"*","null"})
public class Catch_PreController {
    @Autowired
    private Catch_PreMapper catch_preMapper;
    private Gson gson = new Gson();

    @GetMapping("/catchpre")
    public String getCatch_Pre() {
        List<Catch_Pre> catch_pre = catch_preMapper.selectList(null);
        return gson.toJson(catch_pre);
    }

    @RequestMapping("/selectcatchpre")
    public List<Catch_Pre> selecCatch_Pre() {
        return catch_preMapper.selectList(null);
    }

//    @GetMapping("/selectpage")
//    public String  selectpage(@RequestParam(defaultValue = "1") Integer pageNum, @RequestParam(defaultValue = "10") Integer pageSize) {
//    }

    @PostMapping("/addcatchpre")
    public String addCatch_Pre(@RequestBody  Catch_Pre catch_pre) {
        catch_preMapper.insert(catch_pre);
        return gson.toJson(catch_pre);
    }

    @PostMapping("/deletecatchpre")
    public String deleteCatch_Pre(@RequestBody Catch_Pre catch_pre) {
        catch_preMapper.deleteById(catch_pre);
        return gson.toJson(catch_pre);
    }


    @PostMapping("/updatecatchpre")
    public String updateCatch_Pre(@RequestBody Catch_Pre catch_pre) {
        catch_preMapper.updateById(catch_pre);
        return gson.toJson(catch_pre);
    }
}
