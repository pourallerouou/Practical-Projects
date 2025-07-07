package com.xxxx.fish_back.controller;

import com.google.gson.Gson;
import com.xxxx.fish_back.entity.Ship;
import com.xxxx.fish_back.mapper.ShipMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SuppressWarnings("all")
@CrossOrigin(origins = {"*","null"})
public class ShipController {
    @Autowired
    private ShipMapper shipMapper;
    private Gson gson = new Gson();

    @GetMapping("/ship")
    public String getShip() {
        List<Ship> ship = shipMapper.selectList(null);
        return gson.toJson(ship);
    }

    @RequestMapping("/selectship")
    public List<Ship> selectShip() {
        return shipMapper.selectList(null);
    }

//    @GetMapping("/selectpage")
//    public String  selectpage(@RequestParam(defaultValue = "1") Integer pageNum, @RequestParam(defaultValue = "10") Integer pageSize) {
//    }

    @PostMapping("/addship")
    public String addShip(@RequestBody Ship ship) {
        shipMapper.insert(ship);
        return gson.toJson(ship);
    }

    @PostMapping("/deleteship")
    public String deleteShip(@RequestBody Ship ship) {
        shipMapper.deleteById(ship);
        return gson.toJson(ship);
    }


    @PostMapping("/updateship")
    public String updateShip(@RequestBody Ship ship) {
        shipMapper.updateById(ship);
        return gson.toJson(ship);
    }
}
