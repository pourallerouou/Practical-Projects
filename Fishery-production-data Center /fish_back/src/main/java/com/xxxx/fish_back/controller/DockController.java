package com.xxxx.fish_back.controller;

import com.google.gson.Gson;
import com.xxxx.fish_back.entity.Dock;
import com.xxxx.fish_back.mapper.DockMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SuppressWarnings("all")
@CrossOrigin(origins = {"*","null"})
public class DockController {
    @Autowired
    private DockMapper dockMapper;
    private Gson gson = new Gson();

    @GetMapping("/dock")
    public String getDock() {
        List<Dock> dock = dockMapper.selectList(null);
        return gson.toJson(dock);
    }

    @RequestMapping("/selectdock")
    public List<Dock> selectDock() {
        return dockMapper.selectList(null);
    }

}
