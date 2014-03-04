Beacon
======

轻量级事件类库

### 事件  
事件对象可分为如下几种类型:  
* 字符串  
    可以是浏览器预定事件名，也可以自定义任意字符串

        var event = "简单事件字符串"; 
* 普通事件      
    引用类型，通过 createEvent 方法创建。参数可选，建议传入简短描述文字，以便开发调试。

        var event = beacon.createEvent("General Event");
   
* 复合事件      
    引用类型，通过 createEvent 方法创建。参数为任意事件类型，参数数量不限。

        // 定义两个普通事件
        var eventA = beacon.createEvent("General Event A");
        var eventB = beacon.createEvent("General Event B");
        
        // 由以上两个普通事件组合成为一个复合事件
        var ComEvent = beacon.createEvent(eventA, eventB);
        
### 事件侦听
事件侦听分为以下两种方式：
* 指定侦听对象 

        beacon(target).on(event, eventHandle);
        
* 全局侦听 

        beacon.on(event, eventHandle);        

### 触发事件

* 触发指定对象事件

        beacon(target).on(event, [userData]);
        
* 广播事件

        beacon.on(event, [userData]);
        
### 移除指定事件句柄
        var eventHandle = function(){};
        beacon.on("event", eventHandle);        
        beacon.off("event", eventHandle);
        
### 移除特定对象的指定事件句柄
        var eventHandle = function(){};
        var target = {};
        beacon(target).on("event", eventHandle);        
        beacon(target).off("event", eventHandle);        
        
### 移除特定对象的指定事件
        var eventHandle = function(){};
        var target = {};
        beacon(target).on("event", eventHandle);        
        beacon(target).off("event");                
        
### 移除特定对象的所有事件
        var eventHandle = function(){};
        var target = {};
        beacon(target).on("event", eventHandle);        
        beacon(target).off();                        
        
### 特定事件
        var event = beacon.createEvent("test event");
        beacon.on(event, function(){
            console.log("事件已触发");
        });
        beacon.on(event);
        
### 复合事件
        var eventA = beacon.createEvent("test event A");
        var eventB = beacon.createEvent("test event B");
        var ComEvent = beacon.createEvent(eventA, eventB);
        beacon.on(Comevent, function(){
            console.log("事件已触发");
        });
        beacon.on(eventA);
        beacon.on(eventB);