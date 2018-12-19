import CONFIG from "../config/listener_config.js"
class EventListenerProvider{
    static getInstance(pageName,args){
        let cls = CONFIG.listeners[pageName];
        if (cls){
            return new cls.class(args);
        }
    }
}


export {EventListenerProvider}