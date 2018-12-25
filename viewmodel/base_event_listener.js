import {Util} from "../scripts/util.js";
class BaseEventListener {
    constructor(args){
        this.vm = null;    
        this.eventPreFix = "ls:";
        this.supportEventList = [
            "click","change"
        ]
    }
    init (vm){
        this.vm = vm; 
    }
    /**
     * load data inform
     * @param {boolean} isIntial if it is a intial load
     */
    load(data){
        // this.vm.model.name = "Phily";
        this.loadDeep(data);
        
    }
    loadDeep(data){
     //   let keys = Object.keys(data);
     let keys = Object.keys(data);
        for (let key of keys){
            let valType = Util.checkType(data[key]);
            if (valType!="object" && valType !="array"){
                console.log(valType,key,data[key]);
                let val = data[key];
                data[key] = val;
            }
        }
    }
    /**
     * set the events from html page, which start with ls: 
     * @param {Node} rootDiv 
     */
    registerEvent(rootDiv){
        for (let eventName of this.supportEventList){
           const eventOn = "on"+eventName;
           const sel = `*[${eventOn}^="${this.eventPreFix}"]`;
           let sourceList = rootDiv.querySelectorAll(sel);
           if (sourceList){
               for (let source of sourceList) {
                   //console.log(this.getAllAttributes(source[eventOn]),source.getAttribute(eventOn));
                   let functionName = source.getAttribute(eventOn);
                   // remove the prefix "ls:" of function name 
                   let newFunctionName = functionName.slice(this.eventPreFix.length);
                   source[eventOn] = this[newFunctionName];
                   
               }
           }
        }
    }
    getAllAttributes(obj) {
        let methods = new Set();
        let keys = Reflect.ownKeys(obj)
        keys.forEach((k) => methods.add(k));
        return methods;
      }
    getAllMethodNames(obj) {
        let methods = new Set();
        while (obj = Reflect.getPrototypeOf(obj)) {
          let keys = Reflect.ownKeys(obj)
          keys.forEach((k) => methods.add(k));
        }
        return methods;
      }
}
export {BaseEventListener}