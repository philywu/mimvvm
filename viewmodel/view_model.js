import VM_CONFIG from "../config/vm_config.js";
class ViewModel {
    constructor(){
        //vm data is the view model which will used in page
        this.vmData = {}        
    }
    init(pageName){
        this.vmData = VM_CONFIG.pages[pageName].data;
        
        //this.vmData._pageName = pageName;
    }
    
}
export {ViewModel}