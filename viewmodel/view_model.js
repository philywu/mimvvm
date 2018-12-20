import VM_CONFIG from "../config/vm_config.js";
import {
    Util
} from "../scripts/util.js";


class ViewModel {
    constructor() {
        //vm data is the view model which will used in page
        this.vmData = {}
        this.data = {}
    }
    init(pageName) {        
        this.data = VM_CONFIG.pages[pageName].data;
        this.vmData = this.genVMData(this.data);

        //this.vmData._pageName = pageName;
        // console.log(Util.checkType(["a", "b"]));
        // console.log(Util.checkType("Strr"));
        // console.log(Util.checkType({
        //     "a": "b"
        // }));
        // console.log(Util.checkType(1));
        // console.log(Util.checkType(false));
        // console.log(Util.checkType({
        //     "a": {
        //         "c": "d"
        //     }
        // }));
        // ${vm.list.map(item =>`<li>${item.name}</li>`).join('')}      
    }
    genVMData(jsonObj){
      return new Proxy(jsonObj,{
          get: function(obj,prop) {
            console.log("get",obj,prop)
            return obj[prop];
          },
          set: function(obj, prop, value) {
            console.log("set",obj,prop,value)
            return true;
          }
      });
    }
    buildMonitor(data) {
       
       //this.buildDeep(data);

    }
    buildDeep(data) {
        for (let key of Reflect.ownKeys(data)) {
            //get origin value            
            let val = data[key];
            let valType = Util.checkType(val);
            if (valType =="function"){
                console.log("function");
                return ;
            }
             else if (valType == "object") {
                this.buildDeep(val);
            } else if( valType == "Array") {
                let arr = Reflect.getPrototypeOf(val);
                //let arr = val;
                let oldPush = arr.push; 
                arr.push = function(){
                    console.log("push",val,key);
                    oldPush.apply(arr,arguments)
                }
                this.buildDeep(val);
            }
            else {
                //console.log(Array.isArray(val));
                Reflect.defineProperty(data, key, {
                    get: function () {
                        console.log("getter", val);
                        return val;
                    },
                    set: function (newValue) {
                        console.log("setter", newValue);
                        val = newValue;
                    }
                })
            }
        }
        // Reflect.defineProperty
        //    let key = "name";
        //    let value = data[key];
        //        Reflect.defineProperty(data,key,{
        //             get:function(){
        //                 console.log("getter",this);
        //                // return data[key];
        //                return value;

        //             },
        //             set:function(newValue){
        //                 console.log("setter");
        //                 value = newValue;
        //             }
        //         });
       // console.log(data.name);
    }


}
export {
    ViewModel
}