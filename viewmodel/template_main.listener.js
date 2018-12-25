import { BaseEventListener } from "./base_event_listener.js";

class TemplateMainListener extends BaseEventListener {
    constructor(args) {
        super(args);

    }
    init (vm){
        super.init(vm);
        //put the special logic to set VM here
        // let m = this.getAllMethodNames(this);
        // console.log(m);
        // this["test"].apply(null,null);
        
    }
    /**
     * initial page with vm value
     */
    load(isIntial){
        super.load(this.vm.model);
    }
    registerEvent(rootDiv){
        super.registerEvent(rootDiv);
        // put special logic here
        //example:
       // this.vm.model.name  = "Chloe";
        let btn = rootDiv.querySelector("#clkMe");
        btn.addEventListener("click",evt =>{
            console.log("clicked me");
        })
    }
}
export {TemplateMainListener};