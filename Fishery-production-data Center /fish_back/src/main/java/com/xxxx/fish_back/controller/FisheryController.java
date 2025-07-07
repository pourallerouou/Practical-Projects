package com.xxxx.fish_back.controller;

import com.google.gson.Gson;
import com.xxxx.fish_back.entity.Fishery;
import com.xxxx.fish_back.mapper.FisheryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SuppressWarnings("all")
@CrossOrigin(origins = {"*","null"})
public class FisheryController {
    @Autowired
    private FisheryMapper fisheryMapper;
    private Gson gson = new Gson();

    @GetMapping("/Fishery")
    public String getFishery() {
        List<Fishery> fishery = fisheryMapper.selectList(null);
        return gson.toJson(fishery);
    }

    @RequestMapping("/select")
    public List<Fishery> selectFishery() {
        return fisheryMapper.selectList(null);
    }

//    @GetMapping("/selectpage")
//    public String  selectpage(@RequestParam(defaultValue = "1") Integer pageNum, @RequestParam(defaultValue = "10") Integer pageSize) {
//    }

    @PostMapping("/add")
    public String addFishery(@RequestBody Fishery fishery) {
        fisheryMapper.insert(fishery);
        return gson.toJson(fishery);
    }

    @PostMapping("/delete")
    public String deleteFishery(@RequestBody Fishery fishery) {
        fisheryMapper.deleteById(fishery);
        return gson.toJson(fishery);
    }


    @PostMapping("/update")
    public String updateFishery(@RequestBody Fishery fishery) {
        fisheryMapper.updateById(fishery);
        return gson.toJson(fishery);
    }
}
