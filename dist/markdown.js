!function(){var e={103:function(e,t,n){var a=function(e){var t=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,n=0,a={},s={manual:e.Prism&&e.Prism.manual,disableWorkerMessageHandler:e.Prism&&e.Prism.disableWorkerMessageHandler,util:{encode:function e(t){return t instanceof r?new r(t.type,e(t.content),t.alias):Array.isArray(t)?t.map(e):t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,"__id",{value:++n}),e.__id},clone:function e(t,n){var a,r;switch(n=n||{},s.util.type(t)){case"Object":if(r=s.util.objId(t),n[r])return n[r];for(var i in a={},n[r]=a,t)t.hasOwnProperty(i)&&(a[i]=e(t[i],n));return a;case"Array":return r=s.util.objId(t),n[r]?n[r]:(a=[],n[r]=a,t.forEach((function(t,s){a[s]=e(t,n)})),a);default:return t}},getLanguage:function(e){for(;e;){var n=t.exec(e.className);if(n)return n[1].toLowerCase();e=e.parentElement}return"none"},setLanguage:function(e,n){e.className=e.className.replace(RegExp(t,"gi"),""),e.classList.add("language-"+n)},currentScript:function(){if("undefined"==typeof document)return null;if("currentScript"in document)return document.currentScript;try{throw new Error}catch(a){var e=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(a.stack)||[])[1];if(e){var t=document.getElementsByTagName("script");for(var n in t)if(t[n].src==e)return t[n]}return null}},isActive:function(e,t,n){for(var a="no-"+t;e;){var s=e.classList;if(s.contains(t))return!0;if(s.contains(a))return!1;e=e.parentElement}return!!n}},languages:{plain:a,plaintext:a,text:a,txt:a,extend:function(e,t){var n=s.util.clone(s.languages[e]);for(var a in t)n[a]=t[a];return n},insertBefore:function(e,t,n,a){var r=(a=a||s.languages)[e],i={};for(var l in r)if(r.hasOwnProperty(l)){if(l==t)for(var o in n)n.hasOwnProperty(o)&&(i[o]=n[o]);n.hasOwnProperty(l)||(i[l]=r[l])}var c=a[e];return a[e]=i,s.languages.DFS(s.languages,(function(t,n){n===c&&t!=e&&(this[t]=i)})),i},DFS:function e(t,n,a,r){r=r||{};var i=s.util.objId;for(var l in t)if(t.hasOwnProperty(l)){n.call(t,l,t[l],a||l);var o=t[l],c=s.util.type(o);"Object"!==c||r[i(o)]?"Array"!==c||r[i(o)]||(r[i(o)]=!0,e(o,n,l,r)):(r[i(o)]=!0,e(o,n,null,r))}}},plugins:{},highlightAll:function(e,t){s.highlightAllUnder(document,e,t)},highlightAllUnder:function(e,t,n){var a={callback:n,container:e,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};s.hooks.run("before-highlightall",a),a.elements=Array.prototype.slice.apply(a.container.querySelectorAll(a.selector)),s.hooks.run("before-all-elements-highlight",a);for(var r,i=0;r=a.elements[i++];)s.highlightElement(r,!0===t,a.callback)},highlightElement:function(t,n,a){var r=s.util.getLanguage(t),i=s.languages[r];s.util.setLanguage(t,r);var l=t.parentElement;l&&"pre"===l.nodeName.toLowerCase()&&s.util.setLanguage(l,r);var o={element:t,language:r,grammar:i,code:t.textContent};function c(e){o.highlightedCode=e,s.hooks.run("before-insert",o),o.element.innerHTML=o.highlightedCode,s.hooks.run("after-highlight",o),s.hooks.run("complete",o),a&&a.call(o.element)}if(s.hooks.run("before-sanity-check",o),(l=o.element.parentElement)&&"pre"===l.nodeName.toLowerCase()&&!l.hasAttribute("tabindex")&&l.setAttribute("tabindex","0"),!o.code)return s.hooks.run("complete",o),void(a&&a.call(o.element));if(s.hooks.run("before-highlight",o),o.grammar)if(n&&e.Worker){var u=new Worker(s.filename);u.onmessage=function(e){c(e.data)},u.postMessage(JSON.stringify({language:o.language,code:o.code,immediateClose:!0}))}else c(s.highlight(o.code,o.grammar,o.language));else c(s.util.encode(o.code))},highlight:function(e,t,n){var a={code:e,grammar:t,language:n};if(s.hooks.run("before-tokenize",a),!a.grammar)throw new Error('The language "'+a.language+'" has no grammar.');return a.tokens=s.tokenize(a.code,a.grammar),s.hooks.run("after-tokenize",a),r.stringify(s.util.encode(a.tokens),a.language)},tokenize:function(e,t){var n=t.rest;if(n){for(var a in n)t[a]=n[a];delete t.rest}var s=new o;return c(s,s.head,e),l(e,s,t,s.head,0),function(e){for(var t=[],n=e.head.next;n!==e.tail;)t.push(n.value),n=n.next;return t}(s)},hooks:{all:{},add:function(e,t){var n=s.hooks.all;n[e]=n[e]||[],n[e].push(t)},run:function(e,t){var n=s.hooks.all[e];if(n&&n.length)for(var a,r=0;a=n[r++];)a(t)}},Token:r};function r(e,t,n,a){this.type=e,this.content=t,this.alias=n,this.length=0|(a||"").length}function i(e,t,n,a){e.lastIndex=t;var s=e.exec(n);if(s&&a&&s[1]){var r=s[1].length;s.index+=r,s[0]=s[0].slice(r)}return s}function l(e,t,n,a,o,g){for(var d in n)if(n.hasOwnProperty(d)&&n[d]){var p=n[d];p=Array.isArray(p)?p:[p];for(var f=0;f<p.length;++f){if(g&&g.cause==d+","+f)return;var h=p[f],m=h.inside,y=!!h.lookbehind,x=!!h.greedy,v=h.alias;if(x&&!h.pattern.global){var b=h.pattern.toString().match(/[imsuy]*$/)[0];h.pattern=RegExp(h.pattern.source,b+"g")}for(var k=h.pattern||h,w=a.next,F=o;w!==t.tail&&!(g&&F>=g.reach);F+=w.value.length,w=w.next){var A=w.value;if(t.length>e.length)return;if(!(A instanceof r)){var C,O=1;if(x){if(!(C=i(k,F,e,y))||C.index>=e.length)break;var E=C.index,$=C.index+C[0].length,S=F;for(S+=w.value.length;E>=S;)S+=(w=w.next).value.length;if(F=S-=w.value.length,w.value instanceof r)continue;for(var j=w;j!==t.tail&&(S<$||"string"==typeof j.value);j=j.next)O++,S+=j.value.length;O--,A=e.slice(F,S),C.index-=F}else if(!(C=i(k,0,A,y)))continue;E=C.index;var T=C[0],_=A.slice(0,E),L=A.slice(E+T.length),P=F+A.length;g&&P>g.reach&&(g.reach=P);var N=w.prev;if(_&&(N=c(t,N,_),F+=_.length),u(t,N,O),w=c(t,N,new r(d,m?s.tokenize(T,m):T,v,T)),L&&c(t,w,L),O>1){var z={cause:d+","+f,reach:P};l(e,t,n,w.prev,F,z),g&&z.reach>g.reach&&(g.reach=z.reach)}}}}}}function o(){var e={value:null,prev:null,next:null},t={value:null,prev:e,next:null};e.next=t,this.head=e,this.tail=t,this.length=0}function c(e,t,n){var a=t.next,s={value:n,prev:t,next:a};return t.next=s,a.prev=s,e.length++,s}function u(e,t,n){for(var a=t.next,s=0;s<n&&a!==e.tail;s++)a=a.next;t.next=a,a.prev=t,e.length-=s}if(e.Prism=s,r.stringify=function e(t,n){if("string"==typeof t)return t;if(Array.isArray(t)){var a="";return t.forEach((function(t){a+=e(t,n)})),a}var r={type:t.type,content:e(t.content,n),tag:"span",classes:["token",t.type],attributes:{},language:n},i=t.alias;i&&(Array.isArray(i)?Array.prototype.push.apply(r.classes,i):r.classes.push(i)),s.hooks.run("wrap",r);var l="";for(var o in r.attributes)l+=" "+o+'="'+(r.attributes[o]||"").replace(/"/g,"&quot;")+'"';return"<"+r.tag+' class="'+r.classes.join(" ")+'"'+l+">"+r.content+"</"+r.tag+">"},!e.document)return e.addEventListener?(s.disableWorkerMessageHandler||e.addEventListener("message",(function(t){var n=JSON.parse(t.data),a=n.language,r=n.code,i=n.immediateClose;e.postMessage(s.highlight(r,s.languages[a],a)),i&&e.close()}),!1),s):s;var g=s.util.currentScript();function d(){s.manual||s.highlightAll()}if(g&&(s.filename=g.src,g.hasAttribute("data-manual")&&(s.manual=!0)),!s.manual){var p=document.readyState;"loading"===p||"interactive"===p&&g&&g.defer?document.addEventListener("DOMContentLoaded",d):window.requestAnimationFrame?window.requestAnimationFrame(d):window.setTimeout(d,16)}return s}("undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{});e.exports&&(e.exports=a),void 0!==n.g&&(n.g.Prism=a),a.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},a.languages.markup.tag.inside["attr-value"].inside.entity=a.languages.markup.entity,a.languages.markup.doctype.inside["internal-subset"].inside=a.languages.markup,a.hooks.add("wrap",(function(e){"entity"===e.type&&(e.attributes.title=e.content.replace(/&amp;/,"&"))})),Object.defineProperty(a.languages.markup.tag,"addInlined",{value:function(e,t){var n={};n["language-"+t]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:a.languages[t]},n.cdata=/^<!\[CDATA\[|\]\]>$/i;var s={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:n}};s["language-"+t]={pattern:/[\s\S]+/,inside:a.languages[t]};var r={};r[e]={pattern:RegExp("(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)".replace(/__/g,(function(){return e})),"i"),lookbehind:!0,greedy:!0,inside:s},a.languages.insertBefore("markup","cdata",r)}}),Object.defineProperty(a.languages.markup.tag,"addAttribute",{value:function(e,t){a.languages.markup.tag.inside["special-attr"].push({pattern:RegExp("(^|[\"'\\s])(?:"+e+")\\s*=\\s*(?:\"[^\"]*\"|'[^']*'|[^\\s'\">=]+(?=[\\s>]))","i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[t,"language-"+t],inside:a.languages[t]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),a.languages.html=a.languages.markup,a.languages.mathml=a.languages.markup,a.languages.svg=a.languages.markup,a.languages.xml=a.languages.extend("markup",{}),a.languages.ssml=a.languages.xml,a.languages.atom=a.languages.xml,a.languages.rss=a.languages.xml,function(e){var t=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;e.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:[^;{\\s\"']|\\s+(?!\\s)|"+t.source+")*?(?:;|(?=\\s*\\{))"),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+t.source+"|(?:[^\\\\\r\n()\"']|\\\\[^])*)\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+t.source+"$"),alias:"url"}}},selector:{pattern:RegExp("(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|"+t.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:t,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},e.languages.css.atrule.inside.rest=e.languages.css;var n=e.languages.markup;n&&(n.tag.addInlined("style","css"),n.tag.addAttribute("style","css"))}(a),a.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},a.languages.javascript=a.languages.extend("clike",{"class-name":[a.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp("(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])"),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),a.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,a.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp("((?:^|[^$\\w\\xA0-\\uFFFF.\"'\\])\\s]|\\b(?:return|yield))\\s*)/(?:(?:\\[(?:[^\\]\\\\\r\n]|\\\\.)*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}|(?:\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.)*\\])*\\])*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\\s|/\\*(?:[^*]|\\*(?!/))*\\*/)*(?:$|[\r\n,.;:})\\]]|//))"),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:a.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:a.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:a.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:a.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:a.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),a.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:a.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),a.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),a.languages.markup&&(a.languages.markup.tag.addInlined("script","javascript"),a.languages.markup.tag.addAttribute("on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)","javascript")),a.languages.js=a.languages.javascript,a.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}},a.languages.webmanifest=a.languages.json,function(e){function t(e,t){return"___"+e.toUpperCase()+t+"___"}Object.defineProperties(e.languages["markup-templating"]={},{buildPlaceholders:{value:function(n,a,s,r){if(n.language===a){var i=n.tokenStack=[];n.code=n.code.replace(s,(function(e){if("function"==typeof r&&!r(e))return e;for(var s,l=i.length;-1!==n.code.indexOf(s=t(a,l));)++l;return i[l]=e,s})),n.grammar=e.languages.markup}}},tokenizePlaceholders:{value:function(n,a){if(n.language===a&&n.tokenStack){n.grammar=e.languages[a];var s=0,r=Object.keys(n.tokenStack);!function i(l){for(var o=0;o<l.length&&!(s>=r.length);o++){var c=l[o];if("string"==typeof c||c.content&&"string"==typeof c.content){var u=r[s],g=n.tokenStack[u],d="string"==typeof c?c:c.content,p=t(a,u),f=d.indexOf(p);if(f>-1){++s;var h=d.substring(0,f),m=new e.Token(a,e.tokenize(g,n.grammar),"language-"+a,g),y=d.substring(f+p.length),x=[];h&&x.push.apply(x,i([h])),x.push(m),y&&x.push.apply(x,i([y])),"string"==typeof c?l.splice.apply(l,[o,1].concat(x)):c.content=x}}else c.content&&i(c.content)}return l}(n.tokens)}}}})}(a),function(e){var t=e.util.clone(e.languages.javascript),n="(?:\\{<S>*\\.{3}(?:[^{}]|<BRACES>)*\\})";function a(e,t){return e=e.replace(/<S>/g,(function(){return"(?:\\s|//.*(?!.)|/\\*(?:[^*]|\\*(?!/))\\*/)"})).replace(/<BRACES>/g,(function(){return"(?:\\{(?:\\{(?:\\{[^{}]*\\}|[^{}])*\\}|[^{}])*\\})"})).replace(/<SPREAD>/g,(function(){return n})),RegExp(e,t)}n=a(n).source,e.languages.jsx=e.languages.extend("markup",t),e.languages.jsx.tag.pattern=a("</?(?:[\\w.:-]+(?:<S>+(?:[\\w.:$-]+(?:=(?:\"(?:\\\\[^]|[^\\\\\"])*\"|'(?:\\\\[^]|[^\\\\'])*'|[^\\s{'\"/>=]+|<BRACES>))?|<SPREAD>))*<S>*/?)?>"),e.languages.jsx.tag.inside.tag.pattern=/^<\/?[^\s>\/]*/,e.languages.jsx.tag.inside["attr-value"].pattern=/=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/,e.languages.jsx.tag.inside.tag.inside["class-name"]=/^[A-Z]\w*(?:\.[A-Z]\w*)*$/,e.languages.jsx.tag.inside.comment=t.comment,e.languages.insertBefore("inside","attr-name",{spread:{pattern:a("<SPREAD>"),inside:e.languages.jsx}},e.languages.jsx.tag),e.languages.insertBefore("inside","special-attr",{script:{pattern:a("=<BRACES>"),alias:"language-javascript",inside:{"script-punctuation":{pattern:/^=(?=\{)/,alias:"punctuation"},rest:e.languages.jsx}}},e.languages.jsx.tag);var s=function(e){return e?"string"==typeof e?e:"string"==typeof e.content?e.content:e.content.map(s).join(""):""},r=function(t){for(var n=[],a=0;a<t.length;a++){var i=t[a],l=!1;if("string"!=typeof i&&("tag"===i.type&&i.content[0]&&"tag"===i.content[0].type?"</"===i.content[0].content[0].content?n.length>0&&n[n.length-1].tagName===s(i.content[0].content[1])&&n.pop():"/>"===i.content[i.content.length-1].content||n.push({tagName:s(i.content[0].content[1]),openedBraces:0}):n.length>0&&"punctuation"===i.type&&"{"===i.content?n[n.length-1].openedBraces++:n.length>0&&n[n.length-1].openedBraces>0&&"punctuation"===i.type&&"}"===i.content?n[n.length-1].openedBraces--:l=!0),(l||"string"==typeof i)&&n.length>0&&0===n[n.length-1].openedBraces){var o=s(i);a<t.length-1&&("string"==typeof t[a+1]||"plain-text"===t[a+1].type)&&(o+=s(t[a+1]),t.splice(a+1,1)),a>0&&("string"==typeof t[a-1]||"plain-text"===t[a-1].type)&&(o=s(t[a-1])+o,t.splice(a-1,1),a--),t[a]=new e.Token("plain-text",o,null,o)}i.content&&"string"!=typeof i.content&&r(i.content)}};e.hooks.add("after-tokenize",(function(e){"jsx"!==e.language&&"tsx"!==e.language||r(e.tokens)}))}(a),function(e){e.languages.typescript=e.languages.extend("javascript",{"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,lookbehind:!0,greedy:!0,inside:null},builtin:/\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/}),e.languages.typescript.keyword.push(/\b(?:abstract|declare|is|keyof|readonly|require)\b/,/\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,/\btype\b(?=\s*(?:[\{*]|$))/),delete e.languages.typescript.parameter,delete e.languages.typescript["literal-property"];var t=e.languages.extend("typescript",{});delete t["class-name"],e.languages.typescript["class-name"].inside=t,e.languages.insertBefore("typescript","function",{decorator:{pattern:/@[$\w\xA0-\uFFFF]+/,inside:{at:{pattern:/^@/,alias:"operator"},function:/^[\s\S]+/}},"generic-function":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,greedy:!0,inside:{function:/^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,generic:{pattern:/<[\s\S]+/,alias:"class-name",inside:t}}}}),e.languages.ts=e.languages.typescript}(a),function(e){var t=e.util.clone(e.languages.typescript);e.languages.tsx=e.languages.extend("jsx",t),delete e.languages.tsx.parameter,delete e.languages.tsx["literal-property"];var n=e.languages.tsx.tag;n.pattern=RegExp("(^|[^\\w$]|(?=</))(?:"+n.pattern.source+")",n.pattern.flags),n.lookbehind=!0}(a),function(){if(void 0!==a&&"undefined"!=typeof document){var e=[];i((function(e){if(e&&e.meta&&e.data){if(e.meta.status&&e.meta.status>=400)return"Error: "+(e.data.message||e.meta.status);if("string"==typeof e.data.content)return"function"==typeof atob?atob(e.data.content.replace(/\s/g,"")):"Your browser cannot decode base64"}return null}),"github"),i((function(e,t){if(e&&e.meta&&e.data&&e.data.files){if(e.meta.status&&e.meta.status>=400)return"Error: "+(e.data.message||e.meta.status);var n=e.data.files,a=t.getAttribute("data-filename");if(null==a)for(var s in n)if(n.hasOwnProperty(s)){a=s;break}return void 0!==n[a]?n[a].content:"Error: unknown or missing gist file "+a}return null}),"gist"),i((function(e){return e&&e.node&&"string"==typeof e.data?e.data:null}),"bitbucket");var t=0,n="data-jsonp-status",s="failed",r='pre[data-jsonp]:not([data-jsonp-status="loaded"]):not([data-jsonp-status="loading"])';a.hooks.add("before-highlightall",(function(e){e.selector+=", "+r})),a.hooks.add("before-sanity-check",(function(i){var l,o=i.element;if(o.matches(r)){i.code="",o.setAttribute(n,"loading");var c=o.appendChild(document.createElement("CODE"));c.textContent="Loading…";var u=i.language;c.className="language-"+u;var g=a.plugins.autoloader;g&&g.loadLanguages(u);var d=o.getAttribute("data-adapter"),p=null;if(d){if("function"!=typeof window[d])return o.setAttribute(n,s),void(c.textContent=(l=d,'✖ Error: JSONP adapter function "'+l+"\" doesn't exist"));p=window[d]}var f=o.getAttribute("data-jsonp");!function(r,i,l,u){var g="prismjsonp"+t++,d=document.createElement("a");d.href=r,d.href+=(d.search?"&":"?")+(i||"callback")+"="+g;var f=document.createElement("script");f.src=d.href,f.onerror=function(){m(),u()};var h=setTimeout((function(){m(),u()}),a.plugins.jsonphighlight.timeout);function m(){clearTimeout(h),document.head.removeChild(f),delete window[g]}window[g]=function(t){m(),function(t){var r=null;if(p)r=p(t,o);else for(var i=0,l=e.length;i<l&&null===(r=e[i].adapter(t,o));i++);null===r?(o.setAttribute(n,s),c.textContent="✖ Error: Cannot parse response (perhaps you need an adapter function?)"):(o.setAttribute(n,"loaded"),c.textContent=r,a.highlightElement(c))}(t)},document.head.appendChild(f)}(f,o.getAttribute("data-callback"),0,(function(){o.setAttribute(n,s),c.textContent="✖ Error: Timeout loading "+f}))}})),a.plugins.jsonphighlight={timeout:5e3,registerAdapter:i,removeAdapter:function(t){if("string"==typeof t&&(t=l(t)),"function"==typeof t){var n=e.findIndex((function(e){return e.adapter===t}));n>=0&&e.splice(n,1)}},highlight:function(e){for(var t,n=(e||document).querySelectorAll(r),s=0;t=n[s++];)a.highlightElement(t)}}}function i(t,n){n=n||t.name,"function"!=typeof t||l(t)||l(n)||e.push({adapter:t,name:n})}function l(t){if("function"==typeof t){for(var n=0;a=e[n++];)if(a.adapter.valueOf()===t.valueOf())return a.adapter}else if("string"==typeof t){var a;for(n=0;a=e[n++];)if(a.name===t)return a.adapter}return null}}()}},t={};function n(a){var s=t[a];if(void 0!==s)return s.exports;var r=t[a]={exports:{}};return e[a](r,r.exports,n),r.exports}n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),function(){"use strict";n(103);function e(e){const t=window.getSelection();0==t.rangeCount&&console.log("no range fount");const n=t.getRangeAt(0),a=r(e,n.startContainer,n.startOffset),s=r(e,n.endContainer,n.endOffset);if(!a[0]||!s[0])throw new Error("Cursor not in the dom");if(e==n.startContainer){const t=e.innerText.length;return[t,t]}return[a[1],s[1]];function r(e,t,n){if(e==t)return 0==n&&(n+=.1),[!0,n];if(e instanceof Text)return[!1,e.length];let a=0;for(let s of e.childNodes){const e=r(s,t,n);if(1==e[0])return[!0,a+e[1]];a+=e[1]}return[!1,a]}}function t(e,t,n){const a=window.getSelection();if(0==a.rangeCount)throw new Error("No range found");const s=a.getRangeAt(0);let r=!1,i=0;!function e(n){if(r)return!1;n instanceof Text&&(i+=n.length,i>=t&&(s.setStart(n,n.length-(i-t)),r=!0));for(let t of n.childNodes)if(0==e(t))return}(e),n||(n=t);let l=!1,o=0;!function e(t){if(l)return!1;t instanceof Text&&(o+=t.length,o>=n&&(s.setEnd(t,t.length-(o-n)),l=!0));for(let n of t.childNodes)if(0==e(n))return}(e)}window.Markdown=class{constructor(n){this.entry=document.querySelector(n),this.cache=[],this.cacheIndex=-1,this.lastEdit,this.analysed=function(){};var a=this.entry;a.setAttribute("contenteditable","true"),a.className="editor __markdown__",a.innerHTML="",a.focus(),a.addEventListener("paste",(function(e){e.preventDefault();var t=(e.originalEvent||e).clipboardData.getData("text/plain");document.execCommand("insertText",!1,t)})),a.addEventListener("dragover",(e=>{e.preventDefault()})),a.addEventListener("keydown",(n=>{!n.ctrlKey||66!=n.keyCode&&73!=n.keyCode&&90!=n.keyCode&&89!=n.keyCode||n.preventDefault(),13!=n.keyCode&&9!=n.keyCode||n.preventDefault(),n.shiftKey&&9==n.keyCode&&n.preventDefault(),37!=n.keyCode&&38!=n.keyCode&&39!=n.keyCode&&40!=n.keyCode&&"Process"!=n.key&&(!n.ctrlKey||90!=n.keyCode&&89!=n.keyCode)&&this.saveCache(),setTimeout((()=>{let s=window.getSelection().getRangeAt(0);if(13==n.keyCode){const n=e(a);if(this.entry.innerText.length==n[0]&&s.insertNode(new Text("\n")),s.insertNode(new Text("\n")),t(a,n[0]+1,n[1]+1),s.collapse&&s.startContainer){const e=s.startContainer.parentElement.parentElement;if(a.contains(e)&&"UL"==e.tagName){const e=document.createElement("li");e.innerHTML="<span>- </span>",s.insertNode(e),t(a,n[0]+3,n[0]+3)}else if(a.contains(e)&&"OL"==e.tagName){const r=document.createElement("li"),i=Number(e.lastChild.querySelector("span").innerText)+1;r.innerHTML="<span>"+i+". </span>",s.insertNode(r),t(a,n[0]+3+String(i).length,n[0]+3+String(i).length)}}}if(9==n.keyCode&&!n.shiftKey){const n=e(a);s.insertNode(new Text("    ")),t(a,n[0]+4,n[1]+4)}if(n.shiftKey&&9==n.keyCode){const n=e(a);let s=this.entry.innerText;for(let e=n[0];e>0;e--)if(e=parseInt(e),"\n"==s[e]&&e!=n[0]){const r=4-s.slice(e+1,e+5).replace(/^ +/g,"").length;if(r){const i=s.slice(0,e+1),l=s.slice(1+e+r,s.length);this.renderEditor(i+l),this.saveCache(),t(a,n[0]-r,n[1]-r)}break}}n.ctrlKey&&(66==n.keyCode?function(e){const t=e.startOffset,n=e.endOffset,a=e.startContainer.wholeText,s=a.slice(t,n)?a.slice(t,n):"加粗样式";if(e.startContainer==e.endContainer){const r=a.slice(0,t)+"**"+s+"**"+a.slice(n,a.length);e.startContainer.nodeValue=r,e.setStart(e.startContainer,t+2),e.setEnd(e.startContainer,t+2+s.length)}else{const s=e.endContainer.wholeText;e.startContainer.nodeValue=a.slice(0,e.startOffset)+"**"+a.slice(e.startOffset,a.length),e.endContainer.nodeValue=s.slice(0,e.endOffset)+"**"+s.slice(e.endOffset,s.length),e.setStart(e.startContainer,t+2),e.setEnd(e.endContainer,n)}}(s):73==n.keyCode&&function(e){const t=e.startOffset,n=e.endOffset,a=e.startContainer.wholeText,s=a.slice(t,n)?a.slice(t,n):"斜体样式";if(e.startContainer==e.endContainer){const r=a.slice(0,t)+"*"+s+"*"+a.slice(n,a.length);e.startContainer.nodeValue=r,e.setStart(e.startContainer,t+1),e.setEnd(e.startContainer,t+1+s.length)}else{const s=e.endContainer.wholeText;e.startContainer.nodeValue=a.slice(0,e.startOffset)+"*"+a.slice(e.startOffset,a.length),e.endContainer.nodeValue=s.slice(0,e.endOffset)+"*"+s.slice(e.endOffset,s.length),e.setStart(e.startContainer,t+1),e.setEnd(e.endContainer,n)}}(s)),n.ctrlKey&&90==n.keyCode?this.undo():n.ctrlKey&&89==n.keyCode?this.redo():37!=n.keyCode&&38!=n.keyCode&&39!=n.keyCode&&40!=n.keyCode&&"Process"!=n.key&&this.renderEditor(a.innerText),this.analysed(this.renderView(a.innerText))}),10)}))}onAnalysed(e){this.analysed=e}renderView(e){var t=document.createElement("div");return t.className="__markdown_result__",t.innerHTML=(e=>{const t=e.split("\n");for(let e=0;e<t.length;e++){t[e]=t[e].replace(/</g,"&lt;").replace(/>/g,"&gt;");let n=t[e],a="";if("```"==n.slice(0,3)){let s="";s+="",a=n.replace("```","").replace(" ","").replace("\n","").replace("\r",""),delete t[e];for(let n=e+1;n<t.length;n++){let a=t[n];if("```"==a.slice(0,3)){s+="\n";break}s+=a+"\n",e=n,delete t[e]}s=s.replace(/\n(?![\s\S]*\n)/,""),e++,delete t[e],Prism.languages[a]||(a="jsx");const r=Prism.highlight(s,Prism.languages[a.replace("\r","")],a);t[e]="<pre><code>"+r+"</code></pre>"}else if("- "==n.slice(0,2)){let n="";for(let a=e;a<t.length;a++){let s=t[a];if("- "!=s.slice(0,2))break;"- "==t[a+1].slice(0,2)?n+="<li>"+s.slice(2,s.length)+"\n</li>":n+="<li>"+s.slice(2,s.length)+"</li>",e=a,delete t[e]}t[e]="<ul>"+n+"</ul>"}else if(n.match(/^[0-9]+\.\s/)){let n="";for(let a=e;a<t.length;a++){let s=t[a];if(!s.match(/^[0-9]+\.\s/))break;t[a+1].match(/^[0-9]\.\s/)?n+="<li>"+s.replace(/^[0-9]+\.\s/,"")+"\n</li>":n+="<li>"+s.replace(/^[0-9]+\.\s/,"")+"</li>",e=a,delete t[e]}t[e]="<ol>"+n+"</ol>"}else{if(n&&n.indexOf("~~")>-1){let e=n,t="";for(;e.indexOf("~~")>-1;){let n=e.indexOf("~~");const a=e.slice(0,n);e=e.slice(n+2);let s=e.indexOf("~~");s>-1&&">"!=a[a.length-1]?(t+=a+"<del>",t+=e.slice(0,s)+"</del>",e=e.slice(s+2)):t+=a+(n>-2?"~~":"")}t+=e,t!=n&&(n=t)}if("###### "==n.slice(0,7)&&(n="<h6>"+n.slice(7,n.length)+"</h6>"),"##### "==n.slice(0,6)&&(n="<h5>"+n.slice(6,n.length)+"</h5>"),"#### "==n.slice(0,5)&&(n="<h4>"+n.slice(5,n.length)+"</h4>"),"### "==n.slice(0,4)&&(n="<h3>"+n.slice(4,n.length)+"</h3>"),"## "==n.slice(0,3)&&(n="<h2>"+n.slice(3,n.length)+"</h2>"),"# "==n.slice(0,2)&&(n="<h1>"+n.slice(2,n.length)+"</h1>"),"&gt; "==n.slice(0,5)&&(n="<blockquote>"+n.slice(5,n.length)+"</blockquote>"),"***"==n&&(n="<hr />"),n=n.replace(/\!\[.*\]\(.*\)/g,(function(e){return'<img alt="'+e.match(/^\!\[.*\]\(/)[0].slice(2,-2)+'" src="'+e.match(/(?=\]\().*\)$/)[0].slice(2,-1)+'" />'})),n=n.replace(/\[.*\]\(.*\)/g,(function(e){let t=e.match(/^\[.*\]\(/)[0].slice(2,-2);return'<a href="'+e.match(/(?=\]\().*\)$/)[0].slice(2,-1)+'">'+t+"</a>"})),n&&n.indexOf("`")>-1){let e=n,t="";for(;e.indexOf("`")>-1;){let n=e.indexOf("`");const a=e.slice(0,n);e=e.slice(n+1);let s=e.indexOf("`");s>-1&&">"!=a[a.length-1]?(t+=a+"<cite>",t+=e.slice(0,s)+"</cite>",e=e.slice(s+1)):t+=a+(n>-1?"`":"")}t+=e,t!=n&&(n=t)}if(n&&n.indexOf("**")>-1){let e=n,t="";for(;e.indexOf("**")>-1;){let n=e.indexOf("**");const a=e.slice(0,n);e=e.slice(n+2);let s=e.indexOf("**");s>-1&&">"!=a[a.length-1]?(t+=a+"<strong>",t+=e.slice(0,s)+"</strong>",e=e.slice(s+2)):t+=a+(n>-2?"**":"")}t+=e,t!=n&&(n=t)}if(n&&n.indexOf("*")>-1){let e=n,t="";for(;e.indexOf("*")>-1&&"*"!=e[e.indexOf("*")+1]&&">"!=e[e.indexOf("*")-1];){let n=e.indexOf("*");const a=e.slice(0,n);e=e.slice(n+1);let s=e.indexOf("*");s>-1&&">"!=a[a.length-1]?(t+=a+"<i>",t+=e.slice(0,s)+"</i>",e=e.slice(s+1)):t+=a+(n>-1?"*":"")}t+=e,t!=n&&(n=t)}t[e]=n,"<"!=n.slice(0,1)&&">"!=n.slice(0,-1)&&(t[e]="<p>"+n+"</p>")}}let n=[];return t.map((e=>n.push(e))),n.join("\n")})(e),t.outerHTML}renderEditor(n){const a=e(this.entry);this.entry.innerHTML=(e=>{const t=e.split("\n");for(let e=0;e<t.length;e++){t[e]=t[e].replace(/</g,"&lt;").replace(/>/g,"&gt;");let n,a=t[e],s="";if("```"==a.slice(0,3)){let r="";r+="\n",n="```",delete t[e];for(let n=e+1;n<t.length;n++){let a=t[n];if("```"==a.slice(0,3)){r+="\n",s="```";break}r+=a+"\n",e=n,delete t[e]}r=r.replace(/\n(?![\s\S]*\n)/,""),e++,delete t[e];const i=a.split("\n")[0].slice(3).replace(" ","").replace("\n","").replace("\r","");let l=a.split("\n")[0].slice(3).replace(" ","").replace("\n","").replace("\r","");Prism.languages[l]||(l="jsx");const o=Prism.highlight(r,Prism.languages[l.replace("\r","")],l);t[e]="<pre><code><span>"+n+i+"</span>"+o+"<span>"+s+"</span></code></pre>"}else if("- "==a.slice(0,2)){let n="";for(let a=e;a<t.length;a++){let s=t[a];if("- "!=s.slice(0,2))break;"- "==t[a+1].slice(0,2)?n+="<li><span>- </span>"+s.slice(2,s.length)+"\n</li>":n+="<li><span>- </span>"+s.slice(2,s.length)+"</li>",e=a,delete t[e]}t[e]="<ul>"+n+"</ul>"}else if(a.match(/^[0-9]+\.\s+/)){let n="",a=1;for(let s=e;s<t.length;s++){let r=t[s];if(!r.match(/^[0-9]+\.\s/))break;t[s+1].match(/^[0-9]+\.\s/)?n+="<li><span>"+a+". </span>"+r.replace(/^[0-9]+\.\s/,"")+"\n</li>":n+="<li><span>"+a+". </span>"+r.replace(/^[0-9]+\.\s/,"")+"</li>",a++,e=s,delete t[e]}t[e]="<ol>"+n+"</ol>"}else{if("###### "==a.slice(0,7)&&(a='<h6><span class="plain">###### </span>'+a.slice(7,a.length)+"</h6>"),"##### "==a.slice(0,6)&&(a='<h5><span class="plain">##### </span>'+a.slice(6,a.length)+"</h5>"),"#### "==a.slice(0,5)&&(a='<h4><span class="plain">#### </span>'+a.slice(5,a.length)+"</h4>"),"### "==a.slice(0,4)&&(a='<h3><span class="plain">### </span>'+a.slice(4,a.length)+"</h3>"),"## "==a.slice(0,3)&&(a='<h2><span class="plain">## </span>'+a.slice(3,a.length)+"</h2>"),"# "==a.slice(0,2)&&(a='<h1><span class="plain"># </span>'+a.slice(2,a.length)+"</h1>"),"***"==a&&(a='<span class="splitLine">***</span>'),"&gt; "==a.slice(0,5)&&(a='<blockquote><span class="plain">'+a.slice(0,5)+"</span>"+a.slice(5,a.length)+"</blockquote>"),a=a.replace(/\!\[.*\]\(.*\)/g,(function(e){let t=e.match(/^\!\[.*\]\(/)[0].slice(2,-2),n=e.match(/(?=\]\().*\)$/)[0].slice(2,-1);return`<span class="img"><img src="${n}" /><span class="text">![${t}]<span class="plain">(${n})</span></span></span>`})),a=a.replace(/\[.*\]\(.*\)/g,(function(e){let t=e.match(/^\[.*\]\(/)[0].slice(1,-2),n=e.match(/(?=\]\().*\)$/)[0].slice(2,-1);return'<span class="plain">[</span>'+t+'<span class="plain">]</span><span class="plain">(<a href="'+n+'">'+n+"</a>)</span>"})),a&&a.indexOf("~~")>-1){let e=a,t="";for(;e.indexOf("~~")>-1;){let n=e.indexOf("~~");const a=e.slice(0,n);e=e.slice(n+2);let s=e.indexOf("~~");s>-1&&">"!=a[a.length-1]?(t+=a+'<span class="del">~~</span><del>',t+=e.slice(0,s)+'</del><span class="del">~~</span>',e=e.slice(s+2)):t+=a+(n>-2?"~~":"")}t+=e,t!=a&&(a=t)}if(a&&a.indexOf("`")>-1){let e=a,t="";for(;e.indexOf("`")>-1;){let n=e.indexOf("`");const a=e.slice(0,n);e=e.slice(n+1);let s=e.indexOf("`");s>-1&&">"!=a[a.length-1]?(t+=a+"<cite>`",t+=e.slice(0,s)+"`</cite>",e=e.slice(s+1)):t+=a+(n>-1?"`":"")}t+=e,t!=a&&(a=t)}if(a&&a.indexOf("**")>-1){let e=a,t="";for(;e.indexOf("**")>-1;){let n=e.indexOf("**");const a=e.slice(0,n);e=e.slice(n+2);let s=e.indexOf("**");s>-1&&">"!=a[a.length-1]?(t+=a+"<strong><span>**</span>",t+=e.slice(0,s)+"<span>**</span></strong>",e=e.slice(s+2)):t+=a+(n>-2?"**":"")}t+=e,t!=a&&(a=t)}if(a&&a.indexOf("*")>-1){let e=a,t="";for(;e.indexOf("*")>-1&&"*"!=e[e.indexOf("*")+1]&&">"!=e[e.indexOf("*")-1];){let n=e.indexOf("*");const a=e.slice(0,n);e=e.slice(n+1);let s=e.indexOf("*");s>-1&&">"!=a[a.length-1]?(t+=a+"<i><span>*</span>",t+=e.slice(0,s)+"<span>*</span></i>",e=e.slice(s+1)):t+=a+(n>-1?"*":"")}t+=e,t!=a&&(a=t)}t[e]=a}}let n=[];return t.map((e=>{n.push(e)})),n.join("\n")})(n),t(this.entry,...a)}setExmple(e){this.analysed(this.renderView(e)),this.renderEditor(e),this.saveCache(!0)}saveCache(t){t&&(this.cacheIndex=-1,this.cache=[],this.lastEdit=this.entry.cloneNode(!0));const n=this.entry.cloneNode(!0);this.lastEdit!=n.innerHTML?(this.lastEdit=n.innerHTML,this.cache.length-1>this.cacheIndex&&(this.cache=this.cache.slice(0,this.cacheIndex+1)),this.cache.push({node:n,position:e(this.entry)}),this.cacheIndex++):this.cache[this.cacheIndex].position=e(this.entry)}undo(){if(this.cacheIndex<=0)return;this.cacheIndex--;const e=this.cache[this.cacheIndex];this.entry.innerHTML=e.node.innerHTML,this.analysed(this.renderView(e.node.innerText));const n=this.entry.cloneNode(!0);this.lastEdit=n.innerHTML,t(this.entry,...e.position)}redo(){if(this.cacheIndex==this.cache.length-1)return;this.cacheIndex++;const e=this.cache[this.cacheIndex];this.entry.innerHTML=e.node.innerHTML,this.analysed(this.renderView(e.node.innerText));const n=this.entry.cloneNode(!0);this.lastEdit=n.innerHTML,t(this.entry,...e.position)}}}()}();