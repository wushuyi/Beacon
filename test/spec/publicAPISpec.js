
describe("Beacon", function () {
    it("初始化", function () {
        expect(window.beacon).toBeDefined();
    });
    
    describe("测试API完整性", function(){
        it("定义了 on 方法", function(){
            expect(beacon.on).toBeDefined();
        });    
    });
    
    
    
    describe("对指定目标进行扩展", function(){
        it("基于 prototype 继承", function(){
            var Fn = function(){};
            Fn.prototype = beacon;
            var obj = new Fn;
            expect(obj.on).toBeDefined();
        });
        
        it("基于 call 继承", function(){
            var Fn = function(){
                beacon.call(this);
            };
            var obj = new Fn;
            expect(obj.on).toBeDefined();
        });
        
        
        it("生成对象代理", function(){
            var obj = {};
            var objProxy = beacon(obj);
            expect(objProxy.on).toBeDefined();
        });        
    });
    
    
    describe("Beacon.on", function(){
        it("自定义普通事件全局广播", function(){
           var CUSTOM_EVENT = beacon.createEvent("custom event");
           var testResult = false;
           beacon.on(CUSTOM_EVENT, function(){
              testResult = true;   
           }); 
           
           expect(testResult).toEqual(false);
           beacon.on(CUSTOM_EVENT);
           expect(testResult).toEqual(true);
        });
        
        
        it("自定义复合事件全局广播", function(){
           var INTEGRANT_EVENT_FIRST  = beacon.createEvent("integrant event first");
           var INTEGRANT_EVENT_SECEND = beacon.createEvent("integrant event secend");
           var COMBINATIOINAL_EVENT   = beacon.createEvent(INTEGRANT_EVENT_FIRST, INTEGRANT_EVENT_SECEND);
           var testResult = 0;
           beacon.on(COMBINATIOINAL_EVENT, function(){
              testResult++;   
           }); 
           
           expect(testResult).toEqual(0);
           beacon.on(INTEGRANT_EVENT_FIRST);
           expect(testResult).toEqual(0);
           beacon.on(INTEGRANT_EVENT_SECEND);
           expect(testResult).toEqual(1);
           beacon.on(INTEGRANT_EVENT_SECEND);
           expect(testResult).toEqual(1);
           beacon.on(INTEGRANT_EVENT_FIRST);
           expect(testResult).toEqual(2);
        });        
        
        
        describe("移除普通事件侦听", function(){
            it("当同时指定事件名及事件句柄时", function(){
                var result = 0;
                var CUSTOM_EVENT =beacon.createEvent("cusotm event");
                
                function customEventHandle(){
                    result++;
                }
                beacon.on(CUSTOM_EVENT, customEventHandle);
                beacon.on(CUSTOM_EVENT);
                expect(result).toEqual(1);
                beacon.on(CUSTOM_EVENT);
                expect(result).toEqual(2);
                beacon.off(CUSTOM_EVENT, customEventHandle);
                beacon.on(CUSTOM_EVENT);
                expect(result).toEqual(2);
            });
            
            it("移除指定事件名下所有处理句柄", function(){
                var result = {
                    a:0,
                    b:10
                };
                var CUSTOM_EVENT =beacon.createEvent("cusotm event");
                
                function customEventHandleA(){
                    result.a+=1;
                }
                
                function customEventHandleB(){
                    result.b+=1;
                }
                
                beacon.on(CUSTOM_EVENT, customEventHandleA);
                beacon.on(CUSTOM_EVENT, customEventHandleB);

                
                beacon.on(CUSTOM_EVENT);
                expect(result.a).toEqual(1);
                expect(result.b).toEqual(11);
                
                beacon.on(CUSTOM_EVENT);
                expect(result.a).toEqual(2);
                expect(result.b).toEqual(12);
                
                beacon.off(CUSTOM_EVENT);
                
                beacon.on(CUSTOM_EVENT);
                expect(result.a).toEqual(2);
                expect(result.b).toEqual(12);
            });
            
            
            
            
            it("清空全局自定义事件", function(){
                var result = {
                    a:0,
                    b:10
                };
                var CUSTOM_EVENT_A =beacon.createEvent("cusotm event A");
                var CUSTOM_EVENT_B =beacon.createEvent("cusotm event B");
                
                function customEventHandleA(){
                    result.a+=1;
                }
                
                function customEventHandleB(){
                    result.b+=1;
                }
                
                beacon.on(CUSTOM_EVENT_A, customEventHandleA);
                beacon.on(CUSTOM_EVENT_B, customEventHandleB);

                
                beacon.on(CUSTOM_EVENT_A);
                expect(result.a).toEqual(1);
                expect(result.b).toEqual(10);
                
                beacon.on(CUSTOM_EVENT_B);
                expect(result.a).toEqual(1);
                expect(result.b).toEqual(11);
                
                beacon.on(CUSTOM_EVENT_B);
                beacon.on(CUSTOM_EVENT_A);
                expect(result.a).toEqual(2);
                expect(result.b).toEqual(12);
                
                
                beacon.off();
                
                beacon.on(CUSTOM_EVENT_A);
                beacon.on(CUSTOM_EVENT_B);
                expect(result.a).toEqual(2);
                expect(result.b).toEqual(12);
            });
            
        });
        
        describe("移除复合事件", function(){
            it("指定事件句柄", function(){
                var INTEGRANT_EVENT_FIRST  = beacon.createEvent("integrant event first");
                var INTEGRANT_EVENT_SECEND = beacon.createEvent("integrant event secend");
                var COMBINATIOINAL_EVENT   = beacon.createEvent(INTEGRANT_EVENT_FIRST, INTEGRANT_EVENT_SECEND);
                var testResult = 0;
                var eventHandle = function(){
                  testResult++;   
                };
                
                beacon.on(COMBINATIOINAL_EVENT, eventHandle); 
                
                expect(testResult).toEqual(0);
                
                beacon.on(INTEGRANT_EVENT_FIRST);
                expect(testResult).toEqual(0);
                
                beacon.on(INTEGRANT_EVENT_SECEND);
                expect(testResult).toEqual(1);
                
                beacon.on(INTEGRANT_EVENT_SECEND);
                expect(testResult).toEqual(1);
                
                beacon.on(INTEGRANT_EVENT_FIRST);
                expect(testResult).toEqual(2);
                
                beacon.off(COMBINATIOINAL_EVENT, eventHandle);
                
                beacon.on(INTEGRANT_EVENT_SECEND);
                beacon.on(INTEGRANT_EVENT_FIRST);
                expect(testResult).toEqual(2);

            });
            
            
            it("清除指定事件下的所有句柄", function(){
                var INTEGRANT_EVENT_FIRST  = beacon.createEvent("integrant event first");
                var INTEGRANT_EVENT_SECEND = beacon.createEvent("integrant event secend");
                var COMBINATIOINAL_EVENT   = beacon.createEvent(INTEGRANT_EVENT_FIRST, INTEGRANT_EVENT_SECEND);
                var testResult = {
                    a:1,b:100
                };
                var eventHandleA = function(){
                  testResult.a++;   
                };
                
                var eventHandleB = function(){
                  testResult.b++;   
                };                
                
                beacon.on(COMBINATIOINAL_EVENT, eventHandleA); 
                
                expect(testResult.a).toEqual(1);
                expect(testResult.b).toEqual(100);
                
                beacon.on(INTEGRANT_EVENT_FIRST);
                expect(testResult.a).toEqual(1);
                expect(testResult.b).toEqual(100);
                
                beacon.on(INTEGRANT_EVENT_SECEND);
                expect(testResult.a).toEqual(2);
                expect(testResult.b).toEqual(100);
                
                
                beacon.on(COMBINATIOINAL_EVENT, eventHandleB); 
                
                beacon.on(INTEGRANT_EVENT_SECEND);
                expect(testResult.a).toEqual(2);
                expect(testResult.b).toEqual(100);
                
                beacon.on(INTEGRANT_EVENT_FIRST);
                expect(testResult.a).toEqual(3);
                expect(testResult.b).toEqual(101);
                
                beacon.on(INTEGRANT_EVENT_SECEND);
                beacon.on(INTEGRANT_EVENT_FIRST);
                expect(testResult.a).toEqual(4);
                expect(testResult.b).toEqual(102);                
                
                
                beacon.off(COMBINATIOINAL_EVENT);
                
                beacon.on(INTEGRANT_EVENT_SECEND);
                beacon.on(INTEGRANT_EVENT_FIRST);
                expect(testResult.a).toEqual(4);
                expect(testResult.b).toEqual(102);                
            });
            
            
            
            it("清空所有事件", function(){
                var INTEGRANT_EVENT_FIRST  = beacon.createEvent("integrant event first");
                var INTEGRANT_EVENT_SECEND = beacon.createEvent("integrant event secend");
                var COMBINATIOINAL_EVENT   = beacon.createEvent(INTEGRANT_EVENT_FIRST, INTEGRANT_EVENT_SECEND);
                var testResult = 0;
                var eventHandle = function(){
                  testResult++;   
                };
                
                beacon.on(COMBINATIOINAL_EVENT, eventHandle); 
                
                expect(testResult).toEqual(0);
                
                beacon.on(INTEGRANT_EVENT_FIRST);
                expect(testResult).toEqual(0);
                
                beacon.on(INTEGRANT_EVENT_SECEND);
                expect(testResult).toEqual(1);
                
                beacon.on(INTEGRANT_EVENT_SECEND);
                expect(testResult).toEqual(1);
                
                beacon.on(INTEGRANT_EVENT_FIRST);
                expect(testResult).toEqual(2);
                
                beacon.off();
                
                beacon.on(INTEGRANT_EVENT_SECEND);
                beacon.on(INTEGRANT_EVENT_FIRST);
                expect(testResult).toEqual(2);

            });
        });
        
        describe("获取事件对象", function() {
            it("当触发普通事件时", function(){
                var result = "";
                beacon.on("eventtest", function(event, data){
                    expect(event).toBeDefined();
                    expect(data).toBeDefined();
                    expect(data).toEqual("someData");
                    result = data;
                });
                beacon.on("eventtest", "someData");
                expect(result).toEqual("someData");
            });
        });
    });
    
    
    
    
});