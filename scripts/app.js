import {
    Page
} from "./page.js";
import GLOBAL from "./constants.js";
import {
    Util
} from "./util.js"; 
import { I18n } from "./i18n.js";
{
    /*
    app: global vairable of app page
    */
    var app = {        
        page: null
    };
    // check service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/sw.js').then(function (registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
                app.swRegistration = registration;
            }, function (err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }

    /**
     * initial method, load the page by using pageName, if no page name, load the home page
     */
    app.init = function (pageName) {

       app.page = new Page();
       let pageConfig = app.page.load(pageName)
       app.render(pageConfig);
        

    }

    /**
     * route to page with page name, and add hisotry stack.
     */

    app.route = function (pageName, param) {
        if (app.page.config) {

            app.page.historyPush(app.page.currentPageConfig);
            let pageConfig = app.page.getPageConfig(pageName);
            app.render(pageConfig, param);

        } else {
            app.init(pageName);
        }
    }
    /**
     * rerender the same page
     */
    app.reRender = function (param) {
        //set current page 
        //header
        app.render(app.page.currentPageConfig,param)
    }
    /**
     * render page by using config
     */
    app.render = function (config, param) {
        //set current page 
        //header
        if (config) {
            app.renderHeader(config.header);
            app.renderMain(config, param);
        }
    }
    /**
     * render header of page by using config
     */
    app.renderHeader = function (headerConfig) {
        let header = document.getElementById('pageHeader');
        let title = header.getElementsByTagName("h4")[0];
        title.innerHTML = headerConfig.title;
        let headerLeft = document.getElementById('headerLeft');
        let leftIcon;
        if (headerConfig.isHome) {
            leftIcon = "fa-home";
        }
        if (headerConfig.isBack) {
            leftIcon = "fa-chevron-left";
            headerLeft.addEventListener("click", app.back);
        }
        headerLeft.innerHTML = `<i class="fas ${leftIcon} pl-1 pr-1"></i>`;

    }
    /**
     * render main page by using config
     */
    app.renderMain = async function (config, param) {
        let mainDiv = document.querySelector('#pageMain');
        let html = await this.page.generateView(config.name);
        mainDiv.innerHTML = html;
        // if (param && param.i18n){
        //     let i18n = I18n.use(param.i18n);
        //     let loaded = await i18n.loadMessageBuldle();
        //    app.translateLocale(mainDiv,i18n)
        // }


        //app.setupController(config, param);       
    }
   
    /**
     * do history back action
     */
    app.back = function (e) {
        console.log('back');
        let pageConfig = app.page.historyPop();
        app.page.currentPageConfig = pageConfig;
        app.render(pageConfig);
    }

    // initial the app, main entry of app.
    app.init();


}