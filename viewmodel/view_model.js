import VM_CONFIG from "../config/vm_config.js";
class ViewModel {
    constructor(){
        this.vmData = {}
    }
    load(pageName){
        this.vmData = VM_CONFIG.pages[pageName];
    }
    
}
export {ViewModel}