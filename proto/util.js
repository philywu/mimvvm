//remove duplicated from Array
// // with arrays
// const dupArr = [1, 1, 2, 3, 1];
// const uniArr = [...(new Set(dupArr))];
// // [1, 2, 3]

// // with objects on a key.
// const dupObj = [{ id: 1, value: 'a' }, { id: 2, value: 'b' }, { id: 1, value: 'c' }];
// const uniKeys = [...(new Set(dupObj.map(({ id }) => id)))];
// // [ '1', '2' ]

//use createTreeWalker
// myfilter=function(node){
//     if (node.tagName=="DIV" || node.tagName=="IMG") //filter out DIV and IMG elements
//     return NodeFilter.FILTER_ACCEPT
//     else
//     return NodeFilter.FILTER_SKIP
//     }
     
//     var walker=document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, myfilter, false)
     
//     while (walker.nextNode())
//     walker.currentNode.style.display="none" //hide all DIV and IMG elements on the page