import VM_CONFIG from "../config/vm_config.js";
import {EventListener} from "./event_listener.js";
class ViewModel {
    constructor(){
        //vm data is the view model which will used in page
        this.vmData = {}
        this.listener = new EventListener()
    }
    load(pageName){
        this.vmData = VM_CONFIG.pages[pageName].data;
        
        //this.vmData._pageName = pageName;
    }
    
}
export {ViewModel}