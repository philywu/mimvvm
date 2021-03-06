import CONFIG from "../config/app_config.js";
import {
    ViewModel
} from "../viewmodel/view_model.js";

import {EventListenerProvider} from "../viewmodel/event_listener.js";

var _CONFIG_FILE_PATH = "../config/config.json";
var _PAGE_FILE_EXT = ".page.html";
var _PRINT_FILE_EXT = ".print.html";
var _VIEW_FILE_PATH = "../view/";

const _FETCH_ARGS = {
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin':'*'
    }
  }
/**
 * page control class
 */
class Page {
    constructor () {       
        this.currentPageConfig = {};
        this.historyPageConfigStack = [];        
        this.config = CONFIG;
        this.viewModel = new ViewModel();
        this.eventListener = null;
        
    }
    /**
     * get page configuration by pageName.
     * set controllerInstance 
     * @param {string} pageName 
     */
    getPageConfig(pageName) {
        if (this.config){
            // const pages = this.config.pages;
            // let pageConfig = pages.filter(el => {                
            //     return (el.name == pageName)
            //     });
        
           // pageConfig[0].controllerInstance = ControllerFactory.getInstance(pageConfig[0].controller);
            this.currentPageConfig = this.config.pages[pageName] ; 
            //set page name with Key
            this.currentPageConfig.pageName = pageName;
            return this.currentPageConfig ;
        } 
    }
    /**
     * get home page name by searching header->isHome field in config file
     */
    getHomePageName() {
        if (this.config){
            const pages = this.config.pages;
            let homePageName = null;
            for (let pageName in pages){                    
                let page = pages[pageName];
                let isHome = page.header.isHome
                if (isHome){
                    homePageName = pageName;
                    break;
                }
                
            }              
            return homePageName;
        } 
    }
    
    /**
     * push pageconfig in history stack
     * @param {config} pageConfig 
     */
    historyPush(pageConfig){
        this.historyPageConfigStack.push(pageConfig);
    }
    /**
     * pop pageconfig in history stack
     */
    historyPop(){
        if (this.historyPageConfigStack.length>0){
            return this.historyPageConfigStack.pop();
        } else {
            return this.currentPageConfig;
        }
    }
    /**
     * intial load page 
     * @param {string} pageName 
     * 
     */
    init(pageName) {             
        // if (!this.config){
        //     this.config = await this.getConfigFromJson();
        // }
        this.config = CONFIG;
        if (!pageName) {
           pageName = this.getHomePageName();
        } 
        this.viewModel.init(pageName);
        this.eventListener = EventListenerProvider.getInstance(pageName);  
        this.eventListener.init(this.viewModel);    
       // console.log(this.viewModel.vmData);  
        return this.getPageConfig(pageName);
    }
    /**
     * get view file content
     * @param {string} viewName 
     */
    async generateView(mainDiv,viewName){
       let pageHTML = await this.getPageFile(viewName);        
       this.viewModel.vmData.name ="Rita";
       //this.viewModel.vmData.list[0].name = "Austrilia";
       //this.viewModel.vmData.list.push({"name":"japan"});
       let parsedHTML = this.parseHTML(pageHTML);       
       mainDiv.innerHTML = parsedHTML;
       this.eventListener.registerEvent(mainDiv);

    }
     /**
     * get view file content
     * @param {string} viewName 
     */
    async getPageFile(viewName){
        const fileName = _VIEW_FILE_PATH+viewName+_PAGE_FILE_EXT; 
       
        try {
            let res = await fetch(fileName,_FETCH_ARGS);
            return res.text();
        } catch(err) {
            return null; 
        }
    }
    parseHTML(html){
        let vm= this.viewModel.data;        
        let tl = eval("`"+html+"`");
        return tl ;
    }
    async getPrintFile(viewName){
        const fileName = _VIEW_FILE_PATH+viewName+_PRINT_FILE_EXT; 
       
        try {
            let res = await fetch(fileName,_FETCH_ARGS);
            return res.text();
        } catch(err) {
            return null; 
        }
    }
    /**
     * get config from Json
     * Obsoleted 
     */
    async getConfigFromJson() {
        if (!this.config) {
            try {
                let res = await fetch(_CONFIG_FILE_PATH,_FETCH_ARGS);
                return res.json();
            } catch(err) {
                console.log(err);
                return null; 
            }
        } else {
            return this.config;
        }
        
    }
   
}

export {Page}
