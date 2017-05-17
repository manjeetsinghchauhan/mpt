/* DOM parser for text/html, see http://stackoverflow.com/a/9251106/938089 */
;(function(DOMParser) {"use strict";var DOMParser_proto=DOMParser.prototype,real_parseFromString=DOMParser_proto.parseFromString;try{if((new DOMParser).parseFromString("", "text/html"))return;}catch(e){}DOMParser_proto.parseFromString=function(markup,type){if(/^\s*text\/html\s*(;|$)/i.test(type)){var doc=document.implementation.createHTMLDocument(""),doc_elt=doc.documentElement,first_elt;doc_elt.innerHTML=markup;first_elt=doc_elt.firstElementChild;if (doc_elt.childElementCount===1&&first_elt.localName.toLowerCase()==="html")doc.replaceChild(first_elt,doc_elt);return doc;}else{return real_parseFromString.apply(this, arguments);}};}(DOMParser));


function validateHTML(html) {
    //log('Validating: ' + html);
    var parser = new DOMParser()
      , d = parser.parseFromString('<?xml version="1.0"?>'+html,'text/xml')
      , allnodes;
    if (d.querySelector('parsererror')) {
        //log('Not welformed HTML (XML)!');
        return null;
    } else {
        /* To use text/html, see http://stackoverflow.com/a/9251106/938089 */
        d = parser.parseFromString(html, 'text/html');
        allnodes = d.querySelectorAll('*');
        for (var i=allnodes.length-1; i>=0; i--) {
            if (allnodes[i] instanceof HTMLUnknownElement) return false;
        }
    }
    return true; /* The document is syntactically correct, all tags are closed */
}
