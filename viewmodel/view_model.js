import VM_CONFIG from "../config/vm_config.js";
import {
    Util
} from "../scripts/util.js";

const nodeRegStr = '\\{\\{\\s?(\\w+)\\s?\\}\\}' ;
const nodeReg = new RegExp(nodeRegStr,'g')
const nodeRegDot = /\{\{\s?([\w.]+)\s?\}\}/g ;

    
                  
                   
class VMNode {  
    constructor (node) {
      this.template = node.innerHTML;
      this.node = node;
      this.nodeTextList = VMNode.getNodeTextList(this.node);
      if (this.nodeTextList){
        this.generateTemplate(this.nodeTextList);
      }
      this.nodeText = VMNode.getNodeText(this.node);
      this.variableKeys = VMNode.getKeys(this.nodeText);
    }
    //generate template string for each text node.
    generateTemplate(list){
        for (let child of list){
            child.template =  child.textContent.slice(0);
        }
    }
  
    update (name,value) {
      console.log("update",name,value);
      let key = "{{"+name+"}}"; 
      for (let nodeText of this.nodeTextList){
        let temp_template = nodeText.template.slice(0)
        nodeText.textContent = temp_template.replace(key,(match,variable) =>{
            return value ; 
        });
        // nodeText.textContent = nodeText.textContent.replace(key,(match,variable) =>{
        //     return value ; 
        // });
        
        //nodeText.textContent = nodeText.textContent.replace(key,value);
      // nodeText.textContent = value;
      }
    //   let temp_template = this.template.slice(0)
    //   this.node.innerHTML = temp_template.replace(/\{\{\s?(\w+)\s?\}\}/g, (match, variable) => {
    //   return data[variable] || ''
    //   })
    }
    static getKeys(text){
        return text.match(nodeReg)
    }
    static getNodeTextList(node) {
        let nodeArray = Array.from(node.childNodes);
    
        let list = nodeArray.filter(child =>{                            
            return (child.nodeType == 3 && child.textContent.trim().length>0);
        });
       
        return list ; 
    }
    static getNodeText(node) {
        let list = VMNode.getNodeTextList(node);
        let content = "";
            if (list.length>0){
                content = list.map (item =>{
                    return item.textContent;
                }).join("");       
            }
        return content; 
    }   

    
  }
class BoundModel {   
    
    constructor (data,vmNodes) {
        const callbacks = [];
        this.data = data ; 
        this.vmNodes = vmNodes;
        // data.push({
        //   add_callback: function add_callback (fn) {
        //     callbacks.push(fn)
        //   }
        // });
        this.updateVMNode = this.updateVMNode.bind(this);
        
        let updateVM = this.updateVMNode ; 
    
        const proxy = new Proxy(data, {
          set: function (target, property, value) {
            console.log("set");
            target[property] = value;
            //this.updateVMNode(property,value)
            
            updateVM(property,value);
            //callbacks.forEach((callback) => callback())
            return true;
          }
        });

    
        return proxy ;
      }
      updateVMNode(name,value){
           // console.log("updateVMNode",name,value,this.vmNodes);
            let updateVMList = this.vmNodes.filter(item =>{                
                let key = "{{"+name+"}}";                
                return item.variableKeys.includes(key);
            });
           if (updateVMList){
               for (let vmNode of updateVMList){
                vmNode.update(name,value);
               }
           }
      }
}
class ViewModel {
    constructor() {
        //vm data is the view model which will used in page
        this.vmData = {};
        this.data = {};
        //all variables that between {{}}
        this.variables = [];
        
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
   
    scanPage(div,pageHTML){
        div.innerHTML = pageHTML ;
        //let nodeReg = new RegExp(nodeRegStr,'gm')
       // this.variables = nodeReg.exec('{{name}} here{{another}}');
       let arr = pageHTML.match(nodeReg)
       //remove duplicated
       this.variables = [...(new Set(arr))];
//       let eleList = div.querySelectorAll("*");

       this.vmNodes  = this.scanComponent(div);

       this.model = new BoundModel (this.data,this.vmNodes);
    
    }
    scanComponent(div){
        
        const nodeFilter =function(node){
            
            let content = VMNode.getNodeText(node);
            if (content.search(nodeReg)>=0) {
                return NodeFilter.FILTER_ACCEPT
            } else {
                return NodeFilter.FILTER_SKIP
            }
        }
        let nodeList = [];
        let walker=document.createTreeWalker(div, NodeFilter.SHOW_ELEMENT, nodeFilter, false)
         
        while (walker.nextNode()){            
            let node = walker.currentNode;                       
            let vmMode = new VMNode(node);
            nodeList.push(vmMode);
        }
       return nodeList ;
        
    }
  
}
export {
    ViewModel
}