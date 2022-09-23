/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/markdown.css":
/*!**************************!*\
  !*** ./src/markdown.css ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/prism/prism.css":
/*!*****************************!*\
  !*** ./src/prism/prism.css ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/getCatalog.js":
/*!***************************!*\
  !*** ./src/getCatalog.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ getCatalog; }
/* harmony export */ });
/* 处理目录 */
function getCatalog(text){
    const arr = []
    text.split('\n').map((v,key)=>{
        const matched = v.match(/^#{1,6}\s/)
        if(matched){
            // debugger
            const con = v.slice(matched[0].length)
            let level = matched[0].length-1
            const preLevel = arr[arr.length-1] && arr[arr.length-1][3]
            if(preLevel == undefined || preLevel>level){
                level = 1
            }else if(preLevel<level){
                level = arr[arr.length-1][2]+1
            }else{
                level = arr[arr.length-1][2]
            }
            arr.push(['_cate'+key+'_',con,level,matched[0].length-1])
        }
    })
    let str = ''
    arr.map(v=> str+='<li class="_level'+v[2]+'_" mapid="'+v[0]+'">'+v[1]+'</li>')

    return '<ul class="__catalog__">'+str+'</ul>'
}

/***/ }),

/***/ "./src/handleEditor.js":
/*!*****************************!*\
  !*** ./src/handleEditor.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
const handleEditor = (html)=>{

    const strs = html.split('\n')

    for(let i=0;i<strs.length;i++){
        /* 处理code */
        strs[i] = strs[i].replace(/</g,'&lt;').replace(/>/g,'&gt;')
        let v = strs[i]
        let start,end = ''
        if(v.slice(0,3) == '```'){
            let box = ''
            box+='\n'
            start = '```'
            delete strs[i]
            for(let e=i+1;e<strs.length;e++){
                let vv = strs[e]
                if(vv.slice(0,3) == '```'){
                    box+='\n'
                    end = '```'
                    break;
                }else{
                    box+=vv+'\n'
                }
                i=e
                delete strs[i]
            }
            box = box.replace(/\n(?![\s\S]*\n)/,'')
            i++
            delete strs[i]
            const originLang = v.split('\n')[0].slice(3).replace(' ','').replace('\n','').replace('\r','')
            let language = v.split('\n')[0].slice(3).replace(' ','').replace('\n','').replace('\r','')
            if(!Prism.languages[language]) language = 'jsx'
            const html = Prism.highlight(box, Prism.languages[language.replace('\r','')],language);
            strs[i] = '<pre><code><span>'+start+originLang+'</span>'+html+'<span>'+end+'</span></code></pre>'
        }else if(v.slice(0,2) == '- '){
            /* 处理无序列表 */
            let box = '';
            for(let e=i;e<strs.length;e++){
                let vv = strs[e]
                if(vv.slice(0,2) == '- '){
                    if(strs[e+1].slice(0,2) == '- '){
                        box+='<li><span>- </span>'+vv.slice(2)+'\n</li>'
                    }else{
                        box+='<li><span>- </span>'+vv.slice(2)+'</li>'
                    }
                }else{
                    break;
                }
                i=e
                delete strs[i]
            }
            strs[i] = '<ul>'+box+'</ul>'
        }else if(v.match(/^[0-9]+\.\s+/)){
            /* 处理有序列表 */
            let box = '';
            let lab = 1
            for(let e=i;e<strs.length;e++){
                let vv = strs[e]
                if(vv.match(/^[0-9]+\.\s/)){
                    if(strs[e+1].match(/^[0-9]+\.\s/)){
                        box+='<li><span>'+lab+'. </span>'+vv.replace(/^[0-9]+\.\s/,'')+'\n</li>'
                    }else{
                        box+='<li><span>'+lab+'. </span>'+vv.replace(/^[0-9]+\.\s/,'')+'</li>'
                    }
                    lab++
                }else{
                    break;
                }
                i=e
                delete strs[i]
            }
            strs[i] = '<ol>'+box+'</ol>'
        }else{

            if(v.slice(0,7) == '###### ') v = '<h6><span class="plain">###### </span>'+v.slice(7)+'</h6>'
            if(v.slice(0,6) == '##### ') v = '<h5><span class="plain">##### </span>'+v.slice(6)+'</h5>'
            if(v.slice(0,5) == '#### ') v = '<h4><span class="plain">#### </span>'+v.slice(5)+'</h4>'
            if(v.slice(0,4) == '### ') v = '<h3><span class="plain">### </span>'+v.slice(4)+'</h3>'
            if(v.slice(0,3) == '## ') v = '<h2><span class="plain">## </span>'+v.slice(3)+'</h2>'
            if(v.slice(0,2) == '# ') v = '<h1><span class="plain"># </span>'+v.slice(2)+'</h1>'

            /* 处理分割线 */
            if(v == '***') v = '<span class="splitLine">***</span>'

            /* 引用内容处理 */
            if(v.slice(0,5) == '&gt; ') v = '<blockquote><span class="plain">'+v.slice(0,5)+'</span>'+v.slice(5)+'</blockquote>'

            /* 处理图片 */
            v = v.replace(/\!\[.*\]\(.*\)/g,function(e){
                let front = e.match(/^\!\[.*\]\(/)[0].slice(2,-2)
                let end = e.match(/(?=\]\().*\)$/)[0].slice(2,-1)
                return `<span class="img"><img src="${end}" /><span class="text">![${front}]<span class="plain">(${end})</span></span></span>`
            })

            /* 处理超链接 */
            v = v.replace(/\[.*\]\(.*\)/g,function(e){
                let front = e.match(/^\[.*\]\(/)[0].slice(1,-2)
                let end = e.match(/(?=\]\().*\)$/)[0].slice(2,-1)
                end = e.replace(front,'').slice(3).slice(0,-1)
                return '<span class="plain">[</span>'+front+'<span class="plain">]</span><span class="plain">(<a href="'+end+'">'+end+'</a>)</span>'
                
            })

            /* 删除线处理 */
            if(v && v.indexOf('~~')>-1){
                let con = v
                let handled = ''
                while(con.indexOf('~~')>-1){
                    let first = con.indexOf('~~')
                    const pre = con.slice(0,first)
                    con = con.slice(first+2)
                    
                    let second = con.indexOf('~~')
                    if(second>-1 && pre[pre.length-1]!='>'){
                        handled += pre+'<span class="del">~~</span><del>'
                        handled += con.slice(0,second)+'</del><span class="del">~~</span>'
                        con = con.slice(second+2)
                    }else{
                        handled += pre+(first>-2?'~~':'')
                    }
                }
                handled+=con
                if(handled != v){
                    v = handled;
                }
            }

            /* 重点内容处理 */
            if(v && v.indexOf('`')>-1){
                let con = v
                let handled = ''
                while(con.indexOf('`')>-1){
                    let first = con.indexOf('`')
                    const pre = con.slice(0,first)
                    con = con.slice(first+1)
                    let second = con.indexOf('`')
                    if(second>-1 && pre[pre.length-1]!='>'){
                        handled += pre+'<cite>`'
                        handled += con.slice(0,second)+'`</cite>'
                        con = con.slice(second+1)
                    }else{
                        
                        handled += pre+(first>-1?'`':'')
                    }
                }
                handled+=con
                if(handled != v){
                    v = handled;
                }
            }

            /* 加粗内容处理 */
            if(v && v.indexOf('**')>-1){
                let con = v
                let handled = ''
                while(con.indexOf('**')>-1){
                    let first = con.indexOf('**')
                    const pre = con.slice(0,first)
                    con = con.slice(first+2)
                    
                    let second = con.indexOf('**')
                    if(second>-1 && pre[pre.length-1]!='>'){
                        handled += pre+'<strong><span>**</span>'
                        handled += con.slice(0,second)+'<span>**</span></strong>'
                        con = con.slice(second+2)
                    }else{
                        handled += pre+(first>-2?'**':'')
                    }
                }
                handled+=con
                if(handled != v){
                    v = handled;
                }
            }

            /* 斜体内容处理 */
            if(v && v.indexOf('*')>-1){
                let con = v
                let handled = ''
                while(con.indexOf('*')>-1 && con[con.indexOf('*')+1]!='*' && con[con.indexOf('*')-1] !='>'){
                    let first = con.indexOf('*')
                    const pre = con.slice(0,first)
                    con = con.slice(first+1)

                    let second = con.indexOf('*')
                    if(second>-1 && pre[pre.length-1]!='>'){
                        handled += pre+'<i><span>*</span>'
                        handled += con.slice(0,second)+'<span>*</span></i>'
                        con = con.slice(second+1)
                    }else{
                        handled += pre+(first>-1?'*':'')
                    }
                }
                handled+=con
                if(handled != v){
                    v = handled;
                }
            }
            strs[i] = v
        }
    }
    let newArr = []
    strs.map(v=>{
        newArr.push(v)
    })
    return newArr.join('\n')
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (handleEditor);

/***/ }),

/***/ "./src/handleView.js":
/*!***************************!*\
  !*** ./src/handleView.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return __WEBPACK_DEFAULT_EXPORT__; }
/* harmony export */ });
const handleView = (html)=>{

    const strs = html.split('\n')

    for(let i=0;i<strs.length;i++){
        strs[i] = strs[i].replace(/</g,'&lt;').replace(/>/g,'&gt;')
        let v = strs[i]
        let language = ''
        if(v.slice(0,3) == '```'){
            let box = ''
            box+=''
            language = v.replace('```','').replace(' ','').replace('\n','').replace('\r','')
            delete strs[i]
            for(let e=i+1;e<strs.length;e++){
                let vv = strs[e]
                if(vv.slice(0,3) == '```'){
                    box+=''+'\n'
                    break;
                }else{
                    box+=vv+'\n'
                }
                i=e
                delete strs[i]
            }
            box = box.replace(/\n(?![\s\S]*\n)/,'')
            i++
            delete strs[i]
            if(!Prism.languages[language]) language = 'jsx'
            const html = Prism.highlight(box, Prism.languages[language.replace('\r','')],language);
            strs[i] = '<pre><code>'+html+'</code></pre>'
        }else if(v.slice(0,2) == '- '){
            /* 处理无序列表 */
            let box = '';
            for(let e=i;e<strs.length;e++){
                let vv = strs[e]
                if(vv.slice(0,2) == '- '){
                    if(strs[e+1].slice(0,2) == '- '){
                        box+='<li>'+vv.slice(2,vv.length)+'\n</li>'
                    }else{
                        box+='<li>'+vv.slice(2,vv.length)+'</li>'
                    }
                }else{
                    break;
                }
                i=e
                delete strs[i]
            }
            strs[i] = '<ul>'+box+'</ul>'
        }else if(v.match(/^[0-9]+\.\s/)){
            /* 处理有序列表 */
            let box = '';
            for(let e=i;e<strs.length;e++){
                let vv = strs[e]
                if(vv.match(/^[0-9]+\.\s/)){
                    if(strs[e+1].match(/^[0-9]\.\s/)){
                        box+='<li>'+vv.replace(/^[0-9]+\.\s/,'')+'\n</li>'
                    }else{
                        box+='<li>'+vv.replace(/^[0-9]+\.\s/,'')+'</li>'
                    }
                }else{
                    break;
                }
                i=e
                delete strs[i]
            }
            strs[i] = '<ol>'+box+'</ol>'
        }else{

             /* 删除线处理 */
             if(v && v.indexOf('~~')>-1){
                let con = v
                let handled = ''
                while(con.indexOf('~~')>-1){
                    let first = con.indexOf('~~')
                    const pre = con.slice(0,first)
                    con = con.slice(first+2)
                    
                    let second = con.indexOf('~~')
                    if(second>-1 && pre[pre.length-1]!='>'){
                        handled += pre+'<del>'
                        handled += con.slice(0,second)+'</del>'
                        con = con.slice(second+2)
                    }else{
                        handled += pre+(first>-2?'~~':'')
                    }
                }
                handled+=con
                if(handled != v){
                    v = handled;
                }
            }

            /* 处理标题 */
            const matched = v.match(/^#{1,6}\s/)
            if(matched){
                v = '<h'+(matched[0].length-1)+' id="_cata'+i+'_">'+v.slice(matched[0].length)+'</h'+(matched[0].length-1)+'>'
            }

            /* 引用内容处理 */
            if(v.slice(0,5) == '&gt; ') v = '<blockquote>'+v.slice(5)+'</blockquote>'

            /* 处理分割线 */
            if(v == '***') v = '<hr />'

            /* 处理图片 */
            v = v.replace(/\!\[.*\]\(.*\)/g,function(e){
                let front = e.match(/^\!\[.*\]\(/)[0].slice(2,-2)
                let end = e.match(/(?=\]\().*\)$/)[0].slice(2,-1)
                return '<img alt="'+front+'" src="'+end+'" />'
            })

            /* 处理超链接 */
            v = v.replace(/\[.*\]\(.*\)/g,function(e){
                let front = e.match(/^\[.*\]\(/)[0].slice(1,-2)
                let end = e.match(/(?=\]\().*\)$/)[0].slice(2,-1)
                return '<a href="'+end+'">'+front+'</a>'
            })

            /* 重点内容处理 */
            if(v && v.indexOf('`')>-1){
                let con = v
                let handled = ''
                while(con.indexOf('`')>-1){
                    let first = con.indexOf('`')
                    const pre = con.slice(0,first)
                    con = con.slice(first+1)
                    let second = con.indexOf('`')
                    if(second>-1 && pre[pre.length-1]!='>'){
                        handled += pre+'<cite>'
                        handled += con.slice(0,second)+'</cite>'
                        con = con.slice(second+1)
                    }else{
                        handled += pre+(first>-1?'`':'')
                    }
                }
                handled+=con
                if(handled != v){
                    v = handled;
                }
            }

            /* 加粗内容处理 */
            if(v && v.indexOf('**')>-1){
                let con = v
                let handled = ''
                while(con.indexOf('**')>-1){
                    let first = con.indexOf('**')
                    const pre = con.slice(0,first)
                    con = con.slice(first+2)
                    
                    let second = con.indexOf('**')
                    if(second>-1 && pre[pre.length-1]!='>'){
                        handled += pre+'<strong>'
                        handled += con.slice(0,second)+'</strong>'
                        con = con.slice(second+2)
                    }else{
                        handled += pre+(first>-2?'**':'')
                    }
                }
                handled+=con
                if(handled != v){
                    v = handled;
                }
            }

            /* 斜体内容处理 */
            if(v && v.indexOf('*')>-1){
                let con = v
                let handled = ''
                while(con.indexOf('*')>-1 && con[con.indexOf('*')+1]!='*' && con[con.indexOf('*')-1] !='>'){
                    let first = con.indexOf('*')
                    const pre = con.slice(0,first)
                    con = con.slice(first+1)

                    let second = con.indexOf('*')
                    if(second>-1 && pre[pre.length-1]!='>'){
                        handled += pre+'<i>'
                        handled += con.slice(0,second)+'</i>'
                        con = con.slice(second+1)
                    }else{
                        handled += pre+(first>-1?'*':'')
                    }
                }
                handled+=con
                if(handled != v){
                    v = handled;
                }
            }
            strs[i] = v
            if(v.slice(0,1) != '<' && v.slice(0,-1) != '>'){
                strs[i] = '<p>'+v+'</p>'
            }
        }
    }
    let newArr = []
    strs.map(v=>newArr.push(v))
    return newArr.join('\n')
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (handleView);

/***/ }),

/***/ "./src/keydownHook.js":
/*!****************************!*\
  !*** ./src/keydownHook.js ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ keyboardHook; }
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.js");
/* harmony import */ var _shortcut__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shortcut */ "./src/shortcut.js");


function keyboardHook(e){
    const position = (0,_util__WEBPACK_IMPORTED_MODULE_0__.getCursor)(this.entry)
    const range = document.getSelection().getRangeAt(0)
    /* 禁用ctrl+ B I Z Y*/
    if(e.ctrlKey && (e.keyCode == 66 || e.keyCode == 73 || e.keyCode == 90 || e.keyCode == 89)){
        e.preventDefault()
    }

    /* 禁用 回车 Tab  */
    if(e.keyCode == 13 || e.keyCode == 9) e.preventDefault()

    /* 禁用shift+Tab */
    if(e.shiftKey && e.keyCode == 9) e.preventDefault()

    /* Tab 前进一行 */
    if(!e.shiftKey && e.keyCode == 9 ){
        if(range.collapsed){
            range.insertNode(new Text("    "))
            ;(0,_util__WEBPACK_IMPORTED_MODULE_0__.setCursor)(this.entry,position[0]+4,position[1]+4)
        }else{
            const con = this.entry.innerText.split('\n')
            let effectedLineCount = 0
            let len = 0
            for(let i=0;i<con.length;i++){
                if(len>position[0]){
                    con[i-1] = '    '+con[i-1]
                    effectedLineCount+=4
                    if(len>position[1]){
                        break;
                    }
                }
                len += con[i].length+1
            }
            this.renderEditor(con.join('\n'))
            this.analysed(this.renderView(this.entry.innerText))
            ;(0,_util__WEBPACK_IMPORTED_MODULE_0__.setCursor)(this.entry,position[0]+4,position[1]+effectedLineCount)
        }
    }

    /* shift+Tab 退一行 */
    if(e.shiftKey && e.keyCode == 9){
        let con = this.entry.innerText.split('\n')
        let effectedLineCount = 0
        let len = 0
        let firstOffset = -1
        for(let i=0;i<con.length;i++){
            if(len>position[0]){
                if(firstOffset==-1) firstOffset = con[i-1].length - con[i-1].replace(/^\s+/,'').length
                for(let e=0;e<4;e++){
                    if(con[i-1][0] == ' '){
                        effectedLineCount+=1
                        con[i-1] = con[i-1].slice(1)
                    }
                }
                if(len>position[1]){
                    break;
                }
            }
            len += con[i].length+1
        }
        this.renderEditor(con.join('\n'))
        this.analysed(this.renderView(this.entry.innerText))
        ;(0,_util__WEBPACK_IMPORTED_MODULE_0__.setCursor)(this.entry,position[0]-firstOffset,position[1]-effectedLineCount)
    }

    /* 处理 加粗，斜体 */
    if(e.ctrlKey){
        if(e.keyCode == 66){
            (0,_shortcut__WEBPACK_IMPORTED_MODULE_1__.rangeBold)(range)
        }else if(e.keyCode == 73){
            (0,_shortcut__WEBPACK_IMPORTED_MODULE_1__.rangeItalics)(range)
        }
    }

    /* 处理撤回，恢复，渲染 */
    if(e.ctrlKey && e.keyCode == 90){
        this.undo()
    }else if(e.ctrlKey && e.keyCode == 89){
        this.redo()
    }else{
        if(e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40 && e.key!='Process'){
            this.renderEditor(this.entry.innerText)
        }
    }

    setTimeout(()=>{
        let range = window.getSelection().getRangeAt(0)
        /* 处理回车相关 */
        if(e.keyCode == 13){

            //处理换行
            if(this.entry.innerText.length == position[0]) range.insertNode(new Text('\n'))
            range.insertNode(new Text('\n'))
            ;(0,_util__WEBPACK_IMPORTED_MODULE_0__.setCursor)(this.entry,position[0]+1,position[1]+1)

            //处理无序有序列表换行样式
            if(range.collapsed){
                if(range.startContainer){
                    const parent = range.startContainer.parentElement.parentElement
                    if(this.entry.contains(parent) && parent.tagName == 'UL'){
                        const li = document.createElement('li')
                        li.innerHTML = '<span>- </span>'
                        range.insertNode(li)
                        ;(0,_util__WEBPACK_IMPORTED_MODULE_0__.setCursor)(this.entry,position[0]+3,position[0]+3)
                    }else if(this.entry.contains(parent) && parent.tagName == 'OL'){
                        const li = document.createElement('li')
                        const lastNumber = Number(parent.lastChild.querySelector('span').innerText)+1
                        li.innerHTML = '<span>'+lastNumber+'. </span>'
                        range.insertNode(li)
                        ;(0,_util__WEBPACK_IMPORTED_MODULE_0__.setCursor)(this.entry,position[0]+3+String(lastNumber).length,position[0]+3+String(lastNumber).length)
                    }
                }
            }
        }
        
        /* 全部处理之后保存 */
        if(e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40 && e.key!='Process'){
            if(!(e.ctrlKey && (e.keyCode == 90 || e.keyCode == 89))) {
                this.renderEditor(this.entry.innerText)
                this.analysed(this.renderView(this.entry.innerText))
                this.saveCache()
            }
        }
    },10)
}

/***/ }),

/***/ "./src/prism/prism.js":
/*!****************************!*\
  !*** ./src/prism/prism.js ***!
  \****************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* PrismJS 1.28.0
https://prismjs.com/download.html#themes=prism-tomorrow&languages=markup+css+clike+javascript+json+markup-templating+jsx+tsx+typescript&plugins=jsonp-highlight */
var _self="undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{},Prism=function(e){var n=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,t=0,r={},a={manual:e.Prism&&e.Prism.manual,disableWorkerMessageHandler:e.Prism&&e.Prism.disableWorkerMessageHandler,util:{encode:function e(n){return n instanceof i?new i(n.type,e(n.content),n.alias):Array.isArray(n)?n.map(e):n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,"__id",{value:++t}),e.__id},clone:function e(n,t){var r,i;switch(t=t||{},a.util.type(n)){case"Object":if(i=a.util.objId(n),t[i])return t[i];for(var l in r={},t[i]=r,n)n.hasOwnProperty(l)&&(r[l]=e(n[l],t));return r;case"Array":return i=a.util.objId(n),t[i]?t[i]:(r=[],t[i]=r,n.forEach((function(n,a){r[a]=e(n,t)})),r);default:return n}},getLanguage:function(e){for(;e;){var t=n.exec(e.className);if(t)return t[1].toLowerCase();e=e.parentElement}return"none"},setLanguage:function(e,t){e.className=e.className.replace(RegExp(n,"gi"),""),e.classList.add("language-"+t)},currentScript:function(){if("undefined"==typeof document)return null;if("currentScript"in document)return document.currentScript;try{throw new Error}catch(r){var e=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(r.stack)||[])[1];if(e){var n=document.getElementsByTagName("script");for(var t in n)if(n[t].src==e)return n[t]}return null}},isActive:function(e,n,t){for(var r="no-"+n;e;){var a=e.classList;if(a.contains(n))return!0;if(a.contains(r))return!1;e=e.parentElement}return!!t}},languages:{plain:r,plaintext:r,text:r,txt:r,extend:function(e,n){var t=a.util.clone(a.languages[e]);for(var r in n)t[r]=n[r];return t},insertBefore:function(e,n,t,r){var i=(r=r||a.languages)[e],l={};for(var o in i)if(i.hasOwnProperty(o)){if(o==n)for(var s in t)t.hasOwnProperty(s)&&(l[s]=t[s]);t.hasOwnProperty(o)||(l[o]=i[o])}var u=r[e];return r[e]=l,a.languages.DFS(a.languages,(function(n,t){t===u&&n!=e&&(this[n]=l)})),l},DFS:function e(n,t,r,i){i=i||{};var l=a.util.objId;for(var o in n)if(n.hasOwnProperty(o)){t.call(n,o,n[o],r||o);var s=n[o],u=a.util.type(s);"Object"!==u||i[l(s)]?"Array"!==u||i[l(s)]||(i[l(s)]=!0,e(s,t,o,i)):(i[l(s)]=!0,e(s,t,null,i))}}},plugins:{},highlightAll:function(e,n){a.highlightAllUnder(document,e,n)},highlightAllUnder:function(e,n,t){var r={callback:t,container:e,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};a.hooks.run("before-highlightall",r),r.elements=Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)),a.hooks.run("before-all-elements-highlight",r);for(var i,l=0;i=r.elements[l++];)a.highlightElement(i,!0===n,r.callback)},highlightElement:function(n,t,r){var i=a.util.getLanguage(n),l=a.languages[i];a.util.setLanguage(n,i);var o=n.parentElement;o&&"pre"===o.nodeName.toLowerCase()&&a.util.setLanguage(o,i);var s={element:n,language:i,grammar:l,code:n.textContent};function u(e){s.highlightedCode=e,a.hooks.run("before-insert",s),s.element.innerHTML=s.highlightedCode,a.hooks.run("after-highlight",s),a.hooks.run("complete",s),r&&r.call(s.element)}if(a.hooks.run("before-sanity-check",s),(o=s.element.parentElement)&&"pre"===o.nodeName.toLowerCase()&&!o.hasAttribute("tabindex")&&o.setAttribute("tabindex","0"),!s.code)return a.hooks.run("complete",s),void(r&&r.call(s.element));if(a.hooks.run("before-highlight",s),s.grammar)if(t&&e.Worker){var c=new Worker(a.filename);c.onmessage=function(e){u(e.data)},c.postMessage(JSON.stringify({language:s.language,code:s.code,immediateClose:!0}))}else u(a.highlight(s.code,s.grammar,s.language));else u(a.util.encode(s.code))},highlight:function(e,n,t){var r={code:e,grammar:n,language:t};if(a.hooks.run("before-tokenize",r),!r.grammar)throw new Error('The language "'+r.language+'" has no grammar.');return r.tokens=a.tokenize(r.code,r.grammar),a.hooks.run("after-tokenize",r),i.stringify(a.util.encode(r.tokens),r.language)},tokenize:function(e,n){var t=n.rest;if(t){for(var r in t)n[r]=t[r];delete n.rest}var a=new s;return u(a,a.head,e),o(e,a,n,a.head,0),function(e){for(var n=[],t=e.head.next;t!==e.tail;)n.push(t.value),t=t.next;return n}(a)},hooks:{all:{},add:function(e,n){var t=a.hooks.all;t[e]=t[e]||[],t[e].push(n)},run:function(e,n){var t=a.hooks.all[e];if(t&&t.length)for(var r,i=0;r=t[i++];)r(n)}},Token:i};function i(e,n,t,r){this.type=e,this.content=n,this.alias=t,this.length=0|(r||"").length}function l(e,n,t,r){e.lastIndex=n;var a=e.exec(t);if(a&&r&&a[1]){var i=a[1].length;a.index+=i,a[0]=a[0].slice(i)}return a}function o(e,n,t,r,s,g){for(var f in t)if(t.hasOwnProperty(f)&&t[f]){var h=t[f];h=Array.isArray(h)?h:[h];for(var d=0;d<h.length;++d){if(g&&g.cause==f+","+d)return;var v=h[d],p=v.inside,m=!!v.lookbehind,y=!!v.greedy,k=v.alias;if(y&&!v.pattern.global){var x=v.pattern.toString().match(/[imsuy]*$/)[0];v.pattern=RegExp(v.pattern.source,x+"g")}for(var b=v.pattern||v,w=r.next,A=s;w!==n.tail&&!(g&&A>=g.reach);A+=w.value.length,w=w.next){var E=w.value;if(n.length>e.length)return;if(!(E instanceof i)){var P,L=1;if(y){if(!(P=l(b,A,e,m))||P.index>=e.length)break;var S=P.index,O=P.index+P[0].length,j=A;for(j+=w.value.length;S>=j;)j+=(w=w.next).value.length;if(A=j-=w.value.length,w.value instanceof i)continue;for(var C=w;C!==n.tail&&(j<O||"string"==typeof C.value);C=C.next)L++,j+=C.value.length;L--,E=e.slice(A,j),P.index-=A}else if(!(P=l(b,0,E,m)))continue;S=P.index;var N=P[0],_=E.slice(0,S),M=E.slice(S+N.length),W=A+E.length;g&&W>g.reach&&(g.reach=W);var z=w.prev;if(_&&(z=u(n,z,_),A+=_.length),c(n,z,L),w=u(n,z,new i(f,p?a.tokenize(N,p):N,k,N)),M&&u(n,w,M),L>1){var I={cause:f+","+d,reach:W};o(e,n,t,w.prev,A,I),g&&I.reach>g.reach&&(g.reach=I.reach)}}}}}}function s(){var e={value:null,prev:null,next:null},n={value:null,prev:e,next:null};e.next=n,this.head=e,this.tail=n,this.length=0}function u(e,n,t){var r=n.next,a={value:t,prev:n,next:r};return n.next=a,r.prev=a,e.length++,a}function c(e,n,t){for(var r=n.next,a=0;a<t&&r!==e.tail;a++)r=r.next;n.next=r,r.prev=n,e.length-=a}if(e.Prism=a,i.stringify=function e(n,t){if("string"==typeof n)return n;if(Array.isArray(n)){var r="";return n.forEach((function(n){r+=e(n,t)})),r}var i={type:n.type,content:e(n.content,t),tag:"span",classes:["token",n.type],attributes:{},language:t},l=n.alias;l&&(Array.isArray(l)?Array.prototype.push.apply(i.classes,l):i.classes.push(l)),a.hooks.run("wrap",i);var o="";for(var s in i.attributes)o+=" "+s+'="'+(i.attributes[s]||"").replace(/"/g,"&quot;")+'"';return"<"+i.tag+' class="'+i.classes.join(" ")+'"'+o+">"+i.content+"</"+i.tag+">"},!e.document)return e.addEventListener?(a.disableWorkerMessageHandler||e.addEventListener("message",(function(n){var t=JSON.parse(n.data),r=t.language,i=t.code,l=t.immediateClose;e.postMessage(a.highlight(i,a.languages[r],r)),l&&e.close()}),!1),a):a;var g=a.util.currentScript();function f(){a.manual||a.highlightAll()}if(g&&(a.filename=g.src,g.hasAttribute("data-manual")&&(a.manual=!0)),!a.manual){var h=document.readyState;"loading"===h||"interactive"===h&&g&&g.defer?document.addEventListener("DOMContentLoaded",f):window.requestAnimationFrame?window.requestAnimationFrame(f):window.setTimeout(f,16)}return a}(_self); true&&module.exports&&(module.exports=Prism),"undefined"!=typeof __webpack_require__.g&&(__webpack_require__.g.Prism=Prism);
Prism.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},Prism.languages.markup.tag.inside["attr-value"].inside.entity=Prism.languages.markup.entity,Prism.languages.markup.doctype.inside["internal-subset"].inside=Prism.languages.markup,Prism.hooks.add("wrap",(function(a){"entity"===a.type&&(a.attributes.title=a.content.replace(/&amp;/,"&"))})),Object.defineProperty(Prism.languages.markup.tag,"addInlined",{value:function(a,e){var s={};s["language-"+e]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:Prism.languages[e]},s.cdata=/^<!\[CDATA\[|\]\]>$/i;var t={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:s}};t["language-"+e]={pattern:/[\s\S]+/,inside:Prism.languages[e]};var n={};n[a]={pattern:RegExp("(<__[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])*?(?=</__>)".replace(/__/g,(function(){return a})),"i"),lookbehind:!0,greedy:!0,inside:t},Prism.languages.insertBefore("markup","cdata",n)}}),Object.defineProperty(Prism.languages.markup.tag,"addAttribute",{value:function(a,e){Prism.languages.markup.tag.inside["special-attr"].push({pattern:RegExp("(^|[\"'\\s])(?:"+a+")\\s*=\\s*(?:\"[^\"]*\"|'[^']*'|[^\\s'\">=]+(?=[\\s>]))","i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[e,"language-"+e],inside:Prism.languages[e]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),Prism.languages.html=Prism.languages.markup,Prism.languages.mathml=Prism.languages.markup,Prism.languages.svg=Prism.languages.markup,Prism.languages.xml=Prism.languages.extend("markup",{}),Prism.languages.ssml=Prism.languages.xml,Prism.languages.atom=Prism.languages.xml,Prism.languages.rss=Prism.languages.xml;
!function(s){var e=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;s.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:[^;{\\s\"']|\\s+(?!\\s)|"+e.source+")*?(?:;|(?=\\s*\\{))"),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+e.source+"|(?:[^\\\\\r\n()\"']|\\\\[^])*)\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+e.source+"$"),alias:"url"}}},selector:{pattern:RegExp("(^|[{}\\s])[^{}\\s](?:[^{};\"'\\s]|\\s+(?![\\s{])|"+e.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:e,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},s.languages.css.atrule.inside.rest=s.languages.css;var t=s.languages.markup;t&&(t.tag.addInlined("style","css"),t.tag.addAttribute("style","css"))}(Prism);
Prism.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/};
Prism.languages.javascript=Prism.languages.extend("clike",{"class-name":[Prism.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp("(^|[^\\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\\dA-Fa-f]+(?:_[\\dA-Fa-f]+)*n?|\\d+(?:_\\d+)*n|(?:\\d+(?:_\\d+)*(?:\\.(?:\\d+(?:_\\d+)*)?)?|\\.\\d+(?:_\\d+)*)(?:[Ee][+-]?\\d+(?:_\\d+)*)?)(?![\\w$])"),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),Prism.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp("((?:^|[^$\\w\\xA0-\\uFFFF.\"'\\])\\s]|\\b(?:return|yield))\\s*)/(?:(?:\\[(?:[^\\]\\\\\r\n]|\\\\.)*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}|(?:\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.|\\[(?:[^[\\]\\\\\r\n]|\\\\.)*\\])*\\])*\\]|\\\\.|[^/\\\\\\[\r\n])+/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\\s|/\\*(?:[^*]|\\*(?!/))*\\*/)*(?:$|[\r\n,.;:})\\]]|//))"),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:Prism.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:Prism.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),Prism.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:Prism.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),Prism.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),Prism.languages.markup&&(Prism.languages.markup.tag.addInlined("script","javascript"),Prism.languages.markup.tag.addAttribute("on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)","javascript")),Prism.languages.js=Prism.languages.javascript;
Prism.languages.json={property:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,lookbehind:!0,greedy:!0},string:{pattern:/(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,lookbehind:!0,greedy:!0},comment:{pattern:/\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},number:/-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,punctuation:/[{}[\],]/,operator:/:/,boolean:/\b(?:false|true)\b/,null:{pattern:/\bnull\b/,alias:"keyword"}},Prism.languages.webmanifest=Prism.languages.json;
!function(e){function n(e,n){return"___"+e.toUpperCase()+n+"___"}Object.defineProperties(e.languages["markup-templating"]={},{buildPlaceholders:{value:function(t,a,r,o){if(t.language===a){var c=t.tokenStack=[];t.code=t.code.replace(r,(function(e){if("function"==typeof o&&!o(e))return e;for(var r,i=c.length;-1!==t.code.indexOf(r=n(a,i));)++i;return c[i]=e,r})),t.grammar=e.languages.markup}}},tokenizePlaceholders:{value:function(t,a){if(t.language===a&&t.tokenStack){t.grammar=e.languages[a];var r=0,o=Object.keys(t.tokenStack);!function c(i){for(var u=0;u<i.length&&!(r>=o.length);u++){var g=i[u];if("string"==typeof g||g.content&&"string"==typeof g.content){var l=o[r],s=t.tokenStack[l],f="string"==typeof g?g:g.content,p=n(a,l),k=f.indexOf(p);if(k>-1){++r;var m=f.substring(0,k),d=new e.Token(a,e.tokenize(s,t.grammar),"language-"+a,s),h=f.substring(k+p.length),v=[];m&&v.push.apply(v,c([m])),v.push(d),h&&v.push.apply(v,c([h])),"string"==typeof g?i.splice.apply(i,[u,1].concat(v)):g.content=v}}else g.content&&c(g.content)}return i}(t.tokens)}}}})}(Prism);
!function(t){var n=t.util.clone(t.languages.javascript),e="(?:\\{<S>*\\.{3}(?:[^{}]|<BRACES>)*\\})";function a(t,n){return t=t.replace(/<S>/g,(function(){return"(?:\\s|//.*(?!.)|/\\*(?:[^*]|\\*(?!/))\\*/)"})).replace(/<BRACES>/g,(function(){return"(?:\\{(?:\\{(?:\\{[^{}]*\\}|[^{}])*\\}|[^{}])*\\})"})).replace(/<SPREAD>/g,(function(){return e})),RegExp(t,n)}e=a(e).source,t.languages.jsx=t.languages.extend("markup",n),t.languages.jsx.tag.pattern=a("</?(?:[\\w.:-]+(?:<S>+(?:[\\w.:$-]+(?:=(?:\"(?:\\\\[^]|[^\\\\\"])*\"|'(?:\\\\[^]|[^\\\\'])*'|[^\\s{'\"/>=]+|<BRACES>))?|<SPREAD>))*<S>*/?)?>"),t.languages.jsx.tag.inside.tag.pattern=/^<\/?[^\s>\/]*/,t.languages.jsx.tag.inside["attr-value"].pattern=/=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/,t.languages.jsx.tag.inside.tag.inside["class-name"]=/^[A-Z]\w*(?:\.[A-Z]\w*)*$/,t.languages.jsx.tag.inside.comment=n.comment,t.languages.insertBefore("inside","attr-name",{spread:{pattern:a("<SPREAD>"),inside:t.languages.jsx}},t.languages.jsx.tag),t.languages.insertBefore("inside","special-attr",{script:{pattern:a("=<BRACES>"),alias:"language-javascript",inside:{"script-punctuation":{pattern:/^=(?=\{)/,alias:"punctuation"},rest:t.languages.jsx}}},t.languages.jsx.tag);var s=function(t){return t?"string"==typeof t?t:"string"==typeof t.content?t.content:t.content.map(s).join(""):""},g=function(n){for(var e=[],a=0;a<n.length;a++){var o=n[a],i=!1;if("string"!=typeof o&&("tag"===o.type&&o.content[0]&&"tag"===o.content[0].type?"</"===o.content[0].content[0].content?e.length>0&&e[e.length-1].tagName===s(o.content[0].content[1])&&e.pop():"/>"===o.content[o.content.length-1].content||e.push({tagName:s(o.content[0].content[1]),openedBraces:0}):e.length>0&&"punctuation"===o.type&&"{"===o.content?e[e.length-1].openedBraces++:e.length>0&&e[e.length-1].openedBraces>0&&"punctuation"===o.type&&"}"===o.content?e[e.length-1].openedBraces--:i=!0),(i||"string"==typeof o)&&e.length>0&&0===e[e.length-1].openedBraces){var r=s(o);a<n.length-1&&("string"==typeof n[a+1]||"plain-text"===n[a+1].type)&&(r+=s(n[a+1]),n.splice(a+1,1)),a>0&&("string"==typeof n[a-1]||"plain-text"===n[a-1].type)&&(r=s(n[a-1])+r,n.splice(a-1,1),a--),n[a]=new t.Token("plain-text",r,null,r)}o.content&&"string"!=typeof o.content&&g(o.content)}};t.hooks.add("after-tokenize",(function(t){"jsx"!==t.language&&"tsx"!==t.language||g(t.tokens)}))}(Prism);
!function(e){e.languages.typescript=e.languages.extend("javascript",{"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,lookbehind:!0,greedy:!0,inside:null},builtin:/\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/}),e.languages.typescript.keyword.push(/\b(?:abstract|declare|is|keyof|readonly|require)\b/,/\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,/\btype\b(?=\s*(?:[\{*]|$))/),delete e.languages.typescript.parameter,delete e.languages.typescript["literal-property"];var s=e.languages.extend("typescript",{});delete s["class-name"],e.languages.typescript["class-name"].inside=s,e.languages.insertBefore("typescript","function",{decorator:{pattern:/@[$\w\xA0-\uFFFF]+/,inside:{at:{pattern:/^@/,alias:"operator"},function:/^[\s\S]+/}},"generic-function":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,greedy:!0,inside:{function:/^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,generic:{pattern:/<[\s\S]+/,alias:"class-name",inside:s}}}}),e.languages.ts=e.languages.typescript}(Prism);
!function(e){var a=e.util.clone(e.languages.typescript);e.languages.tsx=e.languages.extend("jsx",a),delete e.languages.tsx.parameter,delete e.languages.tsx["literal-property"];var t=e.languages.tsx.tag;t.pattern=RegExp("(^|[^\\w$]|(?=</))(?:"+t.pattern.source+")",t.pattern.flags),t.lookbehind=!0}(Prism);
!function(){if("undefined"!=typeof Prism&&"undefined"!=typeof document){var t=[];o((function(t){if(t&&t.meta&&t.data){if(t.meta.status&&t.meta.status>=400)return"Error: "+(t.data.message||t.meta.status);if("string"==typeof t.data.content)return"function"==typeof atob?atob(t.data.content.replace(/\s/g,"")):"Your browser cannot decode base64"}return null}),"github"),o((function(t,e){if(t&&t.meta&&t.data&&t.data.files){if(t.meta.status&&t.meta.status>=400)return"Error: "+(t.data.message||t.meta.status);var n=t.data.files,a=e.getAttribute("data-filename");if(null==a)for(var r in n)if(n.hasOwnProperty(r)){a=r;break}return void 0!==n[a]?n[a].content:"Error: unknown or missing gist file "+a}return null}),"gist"),o((function(t){return t&&t.node&&"string"==typeof t.data?t.data:null}),"bitbucket");var e=0,n="data-jsonp-status",a="failed",r='pre[data-jsonp]:not([data-jsonp-status="loaded"]):not([data-jsonp-status="loading"])';Prism.hooks.add("before-highlightall",(function(t){t.selector+=", "+r})),Prism.hooks.add("before-sanity-check",(function(o){var i,u=o.element;if(u.matches(r)){o.code="",u.setAttribute(n,"loading");var s=u.appendChild(document.createElement("CODE"));s.textContent="Loading…";var d=o.language;s.className="language-"+d;var f=Prism.plugins.autoloader;f&&f.loadLanguages(d);var l=u.getAttribute("data-adapter"),c=null;if(l){if("function"!=typeof window[l])return u.setAttribute(n,a),void(s.textContent=(i=l,'✖ Error: JSONP adapter function "'+i+"\" doesn't exist"));c=window[l]}var p=u.getAttribute("data-jsonp");!function(r,o,i,d){var f="prismjsonp"+e++,l=document.createElement("a");l.href=r,l.href+=(l.search?"&":"?")+(o||"callback")+"="+f;var p=document.createElement("script");p.src=l.href,p.onerror=function(){g(),d()};var m=setTimeout((function(){g(),d()}),Prism.plugins.jsonphighlight.timeout);function g(){clearTimeout(m),document.head.removeChild(p),delete window[f]}window[f]=function(e){g(),function(e){var r=null;if(c)r=c(e,u);else for(var o=0,i=t.length;o<i&&null===(r=t[o].adapter(e,u));o++);null===r?(u.setAttribute(n,a),s.textContent="✖ Error: Cannot parse response (perhaps you need an adapter function?)"):(u.setAttribute(n,"loaded"),s.textContent=r,Prism.highlightElement(s))}(e)},document.head.appendChild(p)}(p,u.getAttribute("data-callback"),0,(function(){u.setAttribute(n,a),s.textContent="✖ Error: Timeout loading "+p}))}})),Prism.plugins.jsonphighlight={timeout:5e3,registerAdapter:o,removeAdapter:function(e){if("string"==typeof e&&(e=i(e)),"function"==typeof e){var n=t.findIndex((function(t){return t.adapter===e}));n>=0&&t.splice(n,1)}},highlight:function(t){for(var e,n=(t||document).querySelectorAll(r),a=0;e=n[a++];)Prism.highlightElement(e)}}}function o(e,n){n=n||e.name,"function"!=typeof e||i(e)||i(n)||t.push({adapter:e,name:n})}function i(e){if("function"==typeof e){for(var n=0;a=t[n++];)if(a.adapter.valueOf()===e.valueOf())return a.adapter}else if("string"==typeof e){var a;for(n=0;a=t[n++];)if(a.name===e)return a.adapter}return null}}();


/***/ }),

/***/ "./src/shortcut.js":
/*!*************************!*\
  !*** ./src/shortcut.js ***!
  \*************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "rangeBold": function() { return /* binding */ rangeBold; },
/* harmony export */   "rangeCite": function() { return /* binding */ rangeCite; },
/* harmony export */   "rangeCode": function() { return /* binding */ rangeCode; },
/* harmony export */   "rangeDel": function() { return /* binding */ rangeDel; },
/* harmony export */   "rangeH1": function() { return /* binding */ rangeH1; },
/* harmony export */   "rangeH2": function() { return /* binding */ rangeH2; },
/* harmony export */   "rangeHr": function() { return /* binding */ rangeHr; },
/* harmony export */   "rangeImg": function() { return /* binding */ rangeImg; },
/* harmony export */   "rangeItalics": function() { return /* binding */ rangeItalics; },
/* harmony export */   "rangeLink": function() { return /* binding */ rangeLink; },
/* harmony export */   "rangeOl": function() { return /* binding */ rangeOl; },
/* harmony export */   "rangeUl": function() { return /* binding */ rangeUl; }
/* harmony export */ });
/* 处理加粗内容 */
function rangeBold(r){
    const start = r.startOffset
    const end = r.endOffset
    const t = r.startContainer.wholeText
    const inner = t.slice(start,end)?t.slice(start,end):'加粗样式'
    if(r.startContainer == r.endContainer){
        const resultText = t.slice(0,start)+'**'+inner+'**'+t.slice(end,t.length)
        r.startContainer.nodeValue = resultText
        r.setStart(r.startContainer,start)
        r.setEnd(r.startContainer,start+4+inner.length)
    }else{
        const et = r.endContainer.wholeText
        r.startContainer.nodeValue = t.slice(0,r.startOffset) + '**' + t.slice(r.startOffset,t.length)
        r.endContainer.nodeValue = et.slice(0,r.endOffset) + '**' + et.slice(r.endOffset,et.length)
        r.setStart(r.startContainer,start)
        r.setEnd(r.endContainer,end+2)
    } 
}

/* 处理斜体内容 */
function rangeItalics(r){
    const start = r.startOffset
    const end = r.endOffset
    const t = r.startContainer.wholeText
    const inner = t.slice(start,end)?t.slice(start,end):'斜体样式'
    if(r.startContainer == r.endContainer){
        const resultText = t.slice(0,start)+'*'+inner+'*'+t.slice(end,t.length)
        r.startContainer.nodeValue = resultText
        r.setStart(r.startContainer,start)
        r.setEnd(r.startContainer,start+2+inner.length)
    }else{
        const et = r.endContainer.wholeText
        r.startContainer.nodeValue = t.slice(0,r.startOffset) + '*' + t.slice(r.startOffset,t.length)
        r.endContainer.nodeValue = et.slice(0,r.endOffset) + '*' + et.slice(r.endOffset,et.length)
        r.setStart(r.startContainer,start)
        r.setEnd(r.endContainer,end+1)
    } 
}

/* 处理删除线 */
function rangeDel(r){
    const start = r.startOffset
    const end = r.endOffset
    const t = r.startContainer.wholeText
    const inner = t.slice(start,end)?t.slice(start,end):'删除线'
    if(r.startContainer == r.endContainer){
        const resultText = t.slice(0,start)+'~~'+inner+'~~'+t.slice(end,t.length)
        r.startContainer.nodeValue = resultText
        r.setStart(r.startContainer,start)
        r.setEnd(r.startContainer,start+4+inner.length)
    }else{
        const et = r.endContainer.wholeText
        r.startContainer.nodeValue = t.slice(0,r.startOffset) + '~~' + t.slice(r.startOffset,t.length)
        r.endContainer.nodeValue = et.slice(0,r.endOffset) + '~~' + et.slice(r.endOffset,et.length)
        r.setStart(r.startContainer,start+2)
        r.setEnd(r.endContainer,end)
    }
}

/* 处理标记 */
function rangeCite(r){
    const start = r.startOffset
    const end = r.endOffset
    const t = r.startContainer.wholeText
    const inner = t.slice(start,end)?t.slice(start,end):'删除线'
    if(r.startContainer == r.endContainer){
        const resultText = t.slice(0,start)+'`'+inner+'`'+t.slice(end,t.length)
        r.startContainer.nodeValue = resultText
        r.setStart(r.startContainer,start)
        r.setEnd(r.startContainer,start+2+inner.length)
    }else{
        const et = r.endContainer.wholeText
        r.startContainer.nodeValue = t.slice(0,r.startOffset) + '`' + t.slice(r.startOffset,t.length)
        r.endContainer.nodeValue = et.slice(0,r.endOffset) + '`' + et.slice(r.endOffset,et.length)
        r.setStart(r.startContainer,start+1)
        r.setEnd(r.endContainer,end)
    }
}

/* 处理一级标题 */
function rangeH1(r){
    if(r.collapsed){
        const str = new Text('# 一级标题')
        r.insertNode(str)
        r.setStart(str,str.length)
        r.setEnd(str,str.length)
    }else{
        const str = new Text('\n# '+String(r).replace(/\n/g,'')+"\n")
        r.deleteContents()
        r.insertNode(str)
        r.setStart(str,str.length-.9)
        r.setEnd(str,str.length-.9)
    }
}

/* 处理二级标题 */
function rangeH2(r){
    if(r.collapsed){
        const str = new Text('## 二级标题')
        r.insertNode(str)
        r.setStart(str,str.length)
        r.setEnd(str,str.length)
    }else{
        const str = new Text('\n## '+String(r).replace(/\n/g,'')+"\n")
        r.deleteContents()
        r.insertNode(str)
        r.setStart(str,str.length-.9)
        r.setEnd(str,str.length-.9)
    }
}

/* 处理分割线 */
function rangeHr(r){
    if(r.collapsed){
        const str = new Text('\n***\n')
        r.insertNode(str)
        r.setStart(str,str.length)
        r.setEnd(str,str.length)
    }else{
        const str = new Text('\n***\n')
        r.deleteContents()
        r.insertNode(str)
        r.setStart(str,str.length-.9)
        r.setEnd(str,str.length-.9)
    }
}

/* 处理超链接 */
function rangeLink(r){
    if(r.collapsed){
        const str = new Text('[这是超链接](https://www.yehger.com)')
        r.insertNode(str)
        r.setStart(str,'[这是超链接]'.length+1)
        r.setEnd(str,str.length-1)
    }else{
        const str = new Text('[这是超链接](https://www.yehger.com)')
        r.deleteContents()
        r.insertNode(str)
        r.setStart(str,'[这是超链接]'.length+1)
        r.setEnd(str,str.length-1)
    }
}

/* 处理有序列表 */
function rangeUl(r){
    if(r.collapsed){
        const str = new Text('- 无序列表')
        r.insertNode(str)
        r.setStart(str,str.length)
        r.setEnd(str,str.length)
    }else{
        const str = new Text('\n- '+String(r).replace(/\n/g,'')+"\n")
        r.deleteContents()
        r.insertNode(str)
        r.setStart(str,str.length-.9)
        r.setEnd(str,str.length-.9)
    }
}

/* 处理无序列表 */
function rangeOl(r){
    if(r.collapsed){
        const str = new Text('1. 有序列表')
        r.insertNode(str)
        r.setStart(str,str.length)
        r.setEnd(str,str.length)
    }else{
        const str = new Text('\n1. '+String(r).replace(/\n/g,'')+"\n")
        r.deleteContents()
        r.insertNode(str)
        r.setStart(str,str.length-.9)
        r.setEnd(str,str.length-.9)
    }
}

/* 处理图片 */
function rangeImg(r){
    if(r.collapsed){
        const str = new Text('![这是图片](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5bc85dc7a9fc4624bbc484f889d3040c~tplv-k3u1fbpfcp-watermark.image)')
        r.insertNode(str)
        r.setStart(str,'![这是图片]'.length+1)
        r.setEnd(str,str.length-1)
    }else{
        const str = new Text('![这是图片](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5bc85dc7a9fc4624bbc484f889d3040c~tplv-k3u1fbpfcp-watermark.image)')
        r.deleteContents()
        r.insertNode(str)
        r.setStart(str,'![这是图片]'.length+1)
        r.setEnd(str,str.length-1)
    }
}

/* 处理代码块 */
function rangeCode(r){
    const start = r.startOffset
    const end = r.endOffset
    const t = r.startContainer.wholeText
    const inner = t.slice(start,end)?t.slice(start,end):'这里输入代码'
    if(r.startContainer == r.endContainer){
        const resultText = t.slice(0,start)+'\n```\n'+inner+'\n```\n'+t.slice(end,t.length)
        r.startContainer.nodeValue = resultText
        r.setStart(r.startContainer,start+5)
        r.setEnd(r.startContainer,start+5+inner.length)
    }else{
        const et = r.endContainer.wholeText
        r.startContainer.nodeValue = t.slice(0,r.startOffset) + '\n```\n' + t.slice(r.startOffset,t.length)
        r.endContainer.nodeValue = et.slice(0,r.endOffset) + '\n```\n' + et.slice(r.endOffset,et.length)
        r.setStart(r.startContainer,start+5)
        r.setEnd(r.endContainer,end+1)
    } 
}

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getCursor": function() { return /* binding */ getCursor; },
/* harmony export */   "setCursor": function() { return /* binding */ setCursor; }
/* harmony export */ });
/* 获取当前光标所在位置*/
function getCursor(dom){
    const selection = window.getSelection()
    if(selection.rangeCount==0){
        console.log('no range fount')
    }
    const range = selection.getRangeAt(0)
    const start = countLength(dom,range.startContainer,range.startOffset)
    const end = countLength(dom,range.endContainer,range.endOffset)
    
    if((!start[0] || !end[0])){
        throw new Error('Cursor not in the dom')
    }
    
    if(dom == range.startContainer){
        const len = dom.innerText.length
        return [len,len]
    }
   
    return [start[1],end[1]]

    function countLength(node,targetNode,offset){
        if(node == targetNode){
            if(offset == 0) offset+=.1
            return [true,offset]
        } 
        if(node instanceof Text) {
            return [false,node.length]
        }
        let len = 0

        for(let item of node.childNodes){
            const result = countLength(item,targetNode,offset)
            
            if(result[0] == true){
                return [true,len+result[1]]
            }else{
                len = len+result[1]
            }
        }
        return [false,len]
    }
}

/* 设置光标位置 */
function setCursor(dom,start,end){
    const selection = window.getSelection()
    if(selection.rangeCount==0){
        throw new Error('No range found')
    }
    const range = selection.getRangeAt(0)

    let startDone = false
    let startTextCount = 0
    setStart(dom)
    function setStart(node){
        if(startDone) return false
        if(node instanceof Text){
            startTextCount+=node.length
            if(startTextCount>=start){
                range.setStart(node,node.length-(startTextCount-start))
                startDone = true
            }
        }
        for(let item of node.childNodes){
            if(setStart(item) == false) return
        }
    }

    if(!end) end = start
    let endDone = false
    let endTextCount = 0
    setEnd(dom)
    function setEnd(node){
        if(endDone) return false
        if(node instanceof Text){
            endTextCount+=node.length
            if(endTextCount>=end){
                range.setEnd(node,node.length-(endTextCount-end))
                endDone = true
            }
        }
        for(let item of node.childNodes){
            if(setEnd(item) == false) return
        }
    }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _prism_prism_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./prism/prism.js */ "./src/prism/prism.js");
/* harmony import */ var _prism_prism_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prism_prism_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _prism_prism_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./prism/prism.css */ "./src/prism/prism.css");
/* harmony import */ var _markdown_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./markdown.css */ "./src/markdown.css");
/* harmony import */ var _handleEditor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./handleEditor */ "./src/handleEditor.js");
/* harmony import */ var _handleView__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./handleView */ "./src/handleView.js");
/* harmony import */ var _keydownHook__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./keydownHook */ "./src/keydownHook.js");
/* harmony import */ var _getCatalog__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getCatalog */ "./src/getCatalog.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./util */ "./src/util.js");
/* harmony import */ var _shortcut__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./shortcut */ "./src/shortcut.js");














class Markdown{
    constructor(data){
        
        this.entry = document.querySelector(data.editor);
        this.stage = document.querySelector(data.stage);
        this.catalog = document.querySelector(data.catalog);
        this.cache = []
        this.cacheIndex = -1
        this.lastEdit;
        this.analysed = function(str){
            if(this.stage) this.stage.innerHTML = str
        }.bind(this)
        this.getCatalogCallBack = function(str){
            if(this.catalog) this.catalog.innerHTML = str
        }.bind(this)

        var entry = this.entry
        entry.setAttribute('contenteditable','true')
        entry.className= 'editor __markdown__'
        entry.innerHTML = ''
        entry.focus()

        /* 处理复制过来的内容 */
        entry.addEventListener('paste',function(e){
            e.preventDefault()
            var paste = (e.originalEvent || e).clipboardData.getData('text/plain')
            document.execCommand('insertText',false,paste)
        })

        /* 禁止拖拽 */
        entry.addEventListener('dragover',e=>{
            e.preventDefault()
        })

        /* 处理键盘事件 */
        entry.addEventListener('keydown',_keydownHook__WEBPACK_IMPORTED_MODULE_5__["default"].bind(this))

        entry.addEventListener('mouseup',function(){
            this.saveCache()
        }.bind(this))
    }

    /* 被动解析 */
    onAnalysed(fun){
        this.analysed = fun
    }

    /* 被动获取目录 */
    onGetCatalog(fun){
        this.getCatalogCallBack = fun
    }

    renderView(html){
        var temp = document.createElement('div')
        temp.className = "__markdown_result__"
        temp.innerHTML = (0,_handleView__WEBPACK_IMPORTED_MODULE_4__["default"])(html)
        return temp.outerHTML
    }

    renderEditor(html){
        const position = (0,_util__WEBPACK_IMPORTED_MODULE_7__.getCursor)(this.entry)
        this.entry.innerHTML = (0,_handleEditor__WEBPACK_IMPORTED_MODULE_3__["default"])(html)
        ;(0,_util__WEBPACK_IMPORTED_MODULE_7__.setCursor)(this.entry,...position)
        this.getCatalogCallBack((0,_getCatalog__WEBPACK_IMPORTED_MODULE_6__["default"])(html))
        
    }

    /* 设置样例 */
    setExmple(text){
        this.analysed(this.renderView(text))
        this.renderEditor(text)
        this.saveCache(true)
    }

    refresh(text,pos){
        const position = pos?pos:(0,_util__WEBPACK_IMPORTED_MODULE_7__.getCursor)(this.entry)
        this.renderEditor(text?text:this.entry.innerText)
        this.analysed(this.renderView(text?text:this.entry.innerText))
        ;(0,_util__WEBPACK_IMPORTED_MODULE_7__.setCursor)(this.entry,...position)
        this.entry.focus()
    }

    /* 存储编辑缓存 */
    saveCache(init){
        if(init){
            this.cacheIndex = 0
            this.cache = [{
                node:this.entry.cloneNode(true),
                position:(0,_util__WEBPACK_IMPORTED_MODULE_7__.getCursor)(this.entry)
            }]
            this.lastEdit = this.entry.cloneNode(true).innerText
        }
        
        const cloneEntry = this.entry.cloneNode(true)
        if(this.lastEdit != cloneEntry.innerText){
            this.lastEdit = cloneEntry.innerText
            if(this.cache.length-1>this.cacheIndex){
                this.cache = this.cache.slice(0,this.cacheIndex+1)
            }
            this.cache.push({
                node:cloneEntry,
                position:(0,_util__WEBPACK_IMPORTED_MODULE_7__.getCursor)(this.entry)
            })
            this.cacheIndex++
        }else{
            this.cache[this.cacheIndex]['position'] = (0,_util__WEBPACK_IMPORTED_MODULE_7__.getCursor)(this.entry)
        }
    }

    /* 撤销 */
    undo(){
        if(this.cacheIndex<=0) return
        this.cacheIndex--
        const last = this.cache[this.cacheIndex]
        this.refresh(last.node.innerText,last.position)

        const cloneEntry = this.entry.cloneNode(true)
        this.lastEdit = cloneEntry.innerText
    }

    /* 恢复 */
    redo(){
        if(this.cacheIndex == this.cache.length-1) return

        this.cacheIndex++
        const next = this.cache[this.cacheIndex]
        this.refresh(next.node.innerText,next.position)

        const cloneEntry = this.entry.cloneNode(true)
        this.lastEdit = cloneEntry.innerText
    }

    /* 触发方法 */
    dispatch(type){
        switch(type){
            case 'del':(0,_shortcut__WEBPACK_IMPORTED_MODULE_8__.rangeDel)(getRange());break;
            case 'italics':(0,_shortcut__WEBPACK_IMPORTED_MODULE_8__.rangeItalics)(getRange());break;
            case 'bold':(0,_shortcut__WEBPACK_IMPORTED_MODULE_8__.rangeBold)(getRange());break;
            case 'cite':(0,_shortcut__WEBPACK_IMPORTED_MODULE_8__.rangeCite)(getRange());break;
            case 'h1':(0,_shortcut__WEBPACK_IMPORTED_MODULE_8__.rangeH1)(getRange());break;
            case 'h2':(0,_shortcut__WEBPACK_IMPORTED_MODULE_8__.rangeH2)(getRange());break;
            case 'hr':(0,_shortcut__WEBPACK_IMPORTED_MODULE_8__.rangeHr)(getRange());break;
            case 'link':(0,_shortcut__WEBPACK_IMPORTED_MODULE_8__.rangeLink)(getRange());break;
            case 'ul':(0,_shortcut__WEBPACK_IMPORTED_MODULE_8__.rangeUl)(getRange());break;
            case 'ol':(0,_shortcut__WEBPACK_IMPORTED_MODULE_8__.rangeOl)(getRange());break;
            case 'img':(0,_shortcut__WEBPACK_IMPORTED_MODULE_8__.rangeImg)(getRange());break;
            case 'code':(0,_shortcut__WEBPACK_IMPORTED_MODULE_8__.rangeCode)(getRange());break;
            default:throw new Error('"'+type+'"'+" isn't a valid value.");
        }
        this.refresh()
        this.saveCache()
    }
}


function getRange(){
    const selection = document.getSelection()
    if(selection.rangeCount){
        return selection.getRangeAt(0)
    }else{
        throw new Error('无范围选择')
    }
}

window['Markdown'] = Markdown
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDbE5BO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QkFBc0Isa0RBQU8sYUFBYTtBQUMxQyxzQkFBc0Isa0RBQU8sYUFBYTtBQUMxQyx3QkFBd0Isb0RBQVMsYUFBYTtBQUM5QyxzQkFBc0Isa0RBQU8sYUFBYTtBQUMxQyxzQkFBc0Isa0RBQU8sYUFBYTtBQUMxQyx1QkFBdUIsbURBQVEsYUFBYTtBQUM1Qyx3QkFBd0Isb0RBQVMsYUFBYTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QiIsInNvdXJjZXMiOlsid2VicGFjazovL21hcmtkb3duLy4vc3JjL21hcmtkb3duLmNzcyIsIndlYnBhY2s6Ly9tYXJrZG93bi8uL3NyYy9wcmlzbS9wcmlzbS5jc3MiLCJ3ZWJwYWNrOi8vbWFya2Rvd24vLi9zcmMvZ2V0Q2F0YWxvZy5qcyIsIndlYnBhY2s6Ly9tYXJrZG93bi8uL3NyYy9oYW5kbGVFZGl0b3IuanMiLCJ3ZWJwYWNrOi8vbWFya2Rvd24vLi9zcmMvaGFuZGxlVmlldy5qcyIsIndlYnBhY2s6Ly9tYXJrZG93bi8uL3NyYy9rZXlkb3duSG9vay5qcyIsIndlYnBhY2s6Ly9tYXJrZG93bi8uL3NyYy9wcmlzbS9wcmlzbS5qcyIsIndlYnBhY2s6Ly9tYXJrZG93bi8uL3NyYy9zaG9ydGN1dC5qcyIsIndlYnBhY2s6Ly9tYXJrZG93bi8uL3NyYy91dGlsLmpzIiwid2VicGFjazovL21hcmtkb3duL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL21hcmtkb3duL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL21hcmtkb3duL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9tYXJrZG93bi93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL21hcmtkb3duL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbWFya2Rvd24vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9tYXJrZG93bi8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvKiDlpITnkIbnm67lvZUgKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Q2F0YWxvZyh0ZXh0KXtcclxuICAgIGNvbnN0IGFyciA9IFtdXHJcbiAgICB0ZXh0LnNwbGl0KCdcXG4nKS5tYXAoKHYsa2V5KT0+e1xyXG4gICAgICAgIGNvbnN0IG1hdGNoZWQgPSB2Lm1hdGNoKC9eI3sxLDZ9XFxzLylcclxuICAgICAgICBpZihtYXRjaGVkKXtcclxuICAgICAgICAgICAgLy8gZGVidWdnZXJcclxuICAgICAgICAgICAgY29uc3QgY29uID0gdi5zbGljZShtYXRjaGVkWzBdLmxlbmd0aClcclxuICAgICAgICAgICAgbGV0IGxldmVsID0gbWF0Y2hlZFswXS5sZW5ndGgtMVxyXG4gICAgICAgICAgICBjb25zdCBwcmVMZXZlbCA9IGFyclthcnIubGVuZ3RoLTFdICYmIGFyclthcnIubGVuZ3RoLTFdWzNdXHJcbiAgICAgICAgICAgIGlmKHByZUxldmVsID09IHVuZGVmaW5lZCB8fCBwcmVMZXZlbD5sZXZlbCl7XHJcbiAgICAgICAgICAgICAgICBsZXZlbCA9IDFcclxuICAgICAgICAgICAgfWVsc2UgaWYocHJlTGV2ZWw8bGV2ZWwpe1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwgPSBhcnJbYXJyLmxlbmd0aC0xXVsyXSsxXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwgPSBhcnJbYXJyLmxlbmd0aC0xXVsyXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFyci5wdXNoKFsnX2NhdGUnK2tleSsnXycsY29uLGxldmVsLG1hdGNoZWRbMF0ubGVuZ3RoLTFdKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBsZXQgc3RyID0gJydcclxuICAgIGFyci5tYXAodj0+IHN0cis9JzxsaSBjbGFzcz1cIl9sZXZlbCcrdlsyXSsnX1wiIG1hcGlkPVwiJyt2WzBdKydcIj4nK3ZbMV0rJzwvbGk+JylcclxuXHJcbiAgICByZXR1cm4gJzx1bCBjbGFzcz1cIl9fY2F0YWxvZ19fXCI+JytzdHIrJzwvdWw+J1xyXG59IiwiY29uc3QgaGFuZGxlRWRpdG9yID0gKGh0bWwpPT57XHJcblxyXG4gICAgY29uc3Qgc3RycyA9IGh0bWwuc3BsaXQoJ1xcbicpXHJcblxyXG4gICAgZm9yKGxldCBpPTA7aTxzdHJzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIC8qIOWkhOeQhmNvZGUgKi9cclxuICAgICAgICBzdHJzW2ldID0gc3Ryc1tpXS5yZXBsYWNlKC88L2csJyZsdDsnKS5yZXBsYWNlKC8+L2csJyZndDsnKVxyXG4gICAgICAgIGxldCB2ID0gc3Ryc1tpXVxyXG4gICAgICAgIGxldCBzdGFydCxlbmQgPSAnJ1xyXG4gICAgICAgIGlmKHYuc2xpY2UoMCwzKSA9PSAnYGBgJyl7XHJcbiAgICAgICAgICAgIGxldCBib3ggPSAnJ1xyXG4gICAgICAgICAgICBib3grPSdcXG4nXHJcbiAgICAgICAgICAgIHN0YXJ0ID0gJ2BgYCdcclxuICAgICAgICAgICAgZGVsZXRlIHN0cnNbaV1cclxuICAgICAgICAgICAgZm9yKGxldCBlPWkrMTtlPHN0cnMubGVuZ3RoO2UrKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdnYgPSBzdHJzW2VdXHJcbiAgICAgICAgICAgICAgICBpZih2di5zbGljZSgwLDMpID09ICdgYGAnKXtcclxuICAgICAgICAgICAgICAgICAgICBib3grPSdcXG4nXHJcbiAgICAgICAgICAgICAgICAgICAgZW5kID0gJ2BgYCdcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGJveCs9dnYrJ1xcbidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGk9ZVxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0cnNbaV1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBib3ggPSBib3gucmVwbGFjZSgvXFxuKD8hW1xcc1xcU10qXFxuKS8sJycpXHJcbiAgICAgICAgICAgIGkrK1xyXG4gICAgICAgICAgICBkZWxldGUgc3Ryc1tpXVxyXG4gICAgICAgICAgICBjb25zdCBvcmlnaW5MYW5nID0gdi5zcGxpdCgnXFxuJylbMF0uc2xpY2UoMykucmVwbGFjZSgnICcsJycpLnJlcGxhY2UoJ1xcbicsJycpLnJlcGxhY2UoJ1xccicsJycpXHJcbiAgICAgICAgICAgIGxldCBsYW5ndWFnZSA9IHYuc3BsaXQoJ1xcbicpWzBdLnNsaWNlKDMpLnJlcGxhY2UoJyAnLCcnKS5yZXBsYWNlKCdcXG4nLCcnKS5yZXBsYWNlKCdcXHInLCcnKVxyXG4gICAgICAgICAgICBpZighUHJpc20ubGFuZ3VhZ2VzW2xhbmd1YWdlXSkgbGFuZ3VhZ2UgPSAnanN4J1xyXG4gICAgICAgICAgICBjb25zdCBodG1sID0gUHJpc20uaGlnaGxpZ2h0KGJveCwgUHJpc20ubGFuZ3VhZ2VzW2xhbmd1YWdlLnJlcGxhY2UoJ1xccicsJycpXSxsYW5ndWFnZSk7XHJcbiAgICAgICAgICAgIHN0cnNbaV0gPSAnPHByZT48Y29kZT48c3Bhbj4nK3N0YXJ0K29yaWdpbkxhbmcrJzwvc3Bhbj4nK2h0bWwrJzxzcGFuPicrZW5kKyc8L3NwYW4+PC9jb2RlPjwvcHJlPidcclxuICAgICAgICB9ZWxzZSBpZih2LnNsaWNlKDAsMikgPT0gJy0gJyl7XHJcbiAgICAgICAgICAgIC8qIOWkhOeQhuaXoOW6j+WIl+ihqCAqL1xyXG4gICAgICAgICAgICBsZXQgYm94ID0gJyc7XHJcbiAgICAgICAgICAgIGZvcihsZXQgZT1pO2U8c3Rycy5sZW5ndGg7ZSsrKXtcclxuICAgICAgICAgICAgICAgIGxldCB2diA9IHN0cnNbZV1cclxuICAgICAgICAgICAgICAgIGlmKHZ2LnNsaWNlKDAsMikgPT0gJy0gJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc3Ryc1tlKzFdLnNsaWNlKDAsMikgPT0gJy0gJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveCs9JzxsaT48c3Bhbj4tIDwvc3Bhbj4nK3Z2LnNsaWNlKDIpKydcXG48L2xpPidcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94Kz0nPGxpPjxzcGFuPi0gPC9zcGFuPicrdnYuc2xpY2UoMikrJzwvbGk+J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaT1lXHJcbiAgICAgICAgICAgICAgICBkZWxldGUgc3Ryc1tpXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN0cnNbaV0gPSAnPHVsPicrYm94Kyc8L3VsPidcclxuICAgICAgICB9ZWxzZSBpZih2Lm1hdGNoKC9eWzAtOV0rXFwuXFxzKy8pKXtcclxuICAgICAgICAgICAgLyog5aSE55CG5pyJ5bqP5YiX6KGoICovXHJcbiAgICAgICAgICAgIGxldCBib3ggPSAnJztcclxuICAgICAgICAgICAgbGV0IGxhYiA9IDFcclxuICAgICAgICAgICAgZm9yKGxldCBlPWk7ZTxzdHJzLmxlbmd0aDtlKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IHZ2ID0gc3Ryc1tlXVxyXG4gICAgICAgICAgICAgICAgaWYodnYubWF0Y2goL15bMC05XStcXC5cXHMvKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc3Ryc1tlKzFdLm1hdGNoKC9eWzAtOV0rXFwuXFxzLykpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3grPSc8bGk+PHNwYW4+JytsYWIrJy4gPC9zcGFuPicrdnYucmVwbGFjZSgvXlswLTldK1xcLlxccy8sJycpKydcXG48L2xpPidcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94Kz0nPGxpPjxzcGFuPicrbGFiKycuIDwvc3Bhbj4nK3Z2LnJlcGxhY2UoL15bMC05XStcXC5cXHMvLCcnKSsnPC9saT4nXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGxhYisrXHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGk9ZVxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0cnNbaV1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdHJzW2ldID0gJzxvbD4nK2JveCsnPC9vbD4nXHJcbiAgICAgICAgfWVsc2V7XHJcblxyXG4gICAgICAgICAgICBpZih2LnNsaWNlKDAsNykgPT0gJyMjIyMjIyAnKSB2ID0gJzxoNj48c3BhbiBjbGFzcz1cInBsYWluXCI+IyMjIyMjIDwvc3Bhbj4nK3Yuc2xpY2UoNykrJzwvaDY+J1xyXG4gICAgICAgICAgICBpZih2LnNsaWNlKDAsNikgPT0gJyMjIyMjICcpIHYgPSAnPGg1PjxzcGFuIGNsYXNzPVwicGxhaW5cIj4jIyMjIyA8L3NwYW4+Jyt2LnNsaWNlKDYpKyc8L2g1PidcclxuICAgICAgICAgICAgaWYodi5zbGljZSgwLDUpID09ICcjIyMjICcpIHYgPSAnPGg0PjxzcGFuIGNsYXNzPVwicGxhaW5cIj4jIyMjIDwvc3Bhbj4nK3Yuc2xpY2UoNSkrJzwvaDQ+J1xyXG4gICAgICAgICAgICBpZih2LnNsaWNlKDAsNCkgPT0gJyMjIyAnKSB2ID0gJzxoMz48c3BhbiBjbGFzcz1cInBsYWluXCI+IyMjIDwvc3Bhbj4nK3Yuc2xpY2UoNCkrJzwvaDM+J1xyXG4gICAgICAgICAgICBpZih2LnNsaWNlKDAsMykgPT0gJyMjICcpIHYgPSAnPGgyPjxzcGFuIGNsYXNzPVwicGxhaW5cIj4jIyA8L3NwYW4+Jyt2LnNsaWNlKDMpKyc8L2gyPidcclxuICAgICAgICAgICAgaWYodi5zbGljZSgwLDIpID09ICcjICcpIHYgPSAnPGgxPjxzcGFuIGNsYXNzPVwicGxhaW5cIj4jIDwvc3Bhbj4nK3Yuc2xpY2UoMikrJzwvaDE+J1xyXG5cclxuICAgICAgICAgICAgLyog5aSE55CG5YiG5Ymy57q/ICovXHJcbiAgICAgICAgICAgIGlmKHYgPT0gJyoqKicpIHYgPSAnPHNwYW4gY2xhc3M9XCJzcGxpdExpbmVcIj4qKio8L3NwYW4+J1xyXG5cclxuICAgICAgICAgICAgLyog5byV55So5YaF5a655aSE55CGICovXHJcbiAgICAgICAgICAgIGlmKHYuc2xpY2UoMCw1KSA9PSAnJmd0OyAnKSB2ID0gJzxibG9ja3F1b3RlPjxzcGFuIGNsYXNzPVwicGxhaW5cIj4nK3Yuc2xpY2UoMCw1KSsnPC9zcGFuPicrdi5zbGljZSg1KSsnPC9ibG9ja3F1b3RlPidcclxuXHJcbiAgICAgICAgICAgIC8qIOWkhOeQhuWbvueJhyAqL1xyXG4gICAgICAgICAgICB2ID0gdi5yZXBsYWNlKC9cXCFcXFsuKlxcXVxcKC4qXFwpL2csZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgZnJvbnQgPSBlLm1hdGNoKC9eXFwhXFxbLipcXF1cXCgvKVswXS5zbGljZSgyLC0yKVxyXG4gICAgICAgICAgICAgICAgbGV0IGVuZCA9IGUubWF0Y2goLyg/PVxcXVxcKCkuKlxcKSQvKVswXS5zbGljZSgyLC0xKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGA8c3BhbiBjbGFzcz1cImltZ1wiPjxpbWcgc3JjPVwiJHtlbmR9XCIgLz48c3BhbiBjbGFzcz1cInRleHRcIj4hWyR7ZnJvbnR9XTxzcGFuIGNsYXNzPVwicGxhaW5cIj4oJHtlbmR9KTwvc3Bhbj48L3NwYW4+PC9zcGFuPmBcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC8qIOWkhOeQhui2hemTvuaOpSAqL1xyXG4gICAgICAgICAgICB2ID0gdi5yZXBsYWNlKC9cXFsuKlxcXVxcKC4qXFwpL2csZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgZnJvbnQgPSBlLm1hdGNoKC9eXFxbLipcXF1cXCgvKVswXS5zbGljZSgxLC0yKVxyXG4gICAgICAgICAgICAgICAgbGV0IGVuZCA9IGUubWF0Y2goLyg/PVxcXVxcKCkuKlxcKSQvKVswXS5zbGljZSgyLC0xKVxyXG4gICAgICAgICAgICAgICAgZW5kID0gZS5yZXBsYWNlKGZyb250LCcnKS5zbGljZSgzKS5zbGljZSgwLC0xKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cInBsYWluXCI+Wzwvc3Bhbj4nK2Zyb250Kyc8c3BhbiBjbGFzcz1cInBsYWluXCI+XTwvc3Bhbj48c3BhbiBjbGFzcz1cInBsYWluXCI+KDxhIGhyZWY9XCInK2VuZCsnXCI+JytlbmQrJzwvYT4pPC9zcGFuPidcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLyog5Yig6Zmk57q/5aSE55CGICovXHJcbiAgICAgICAgICAgIGlmKHYgJiYgdi5pbmRleE9mKCd+ficpPi0xKXtcclxuICAgICAgICAgICAgICAgIGxldCBjb24gPSB2XHJcbiAgICAgICAgICAgICAgICBsZXQgaGFuZGxlZCA9ICcnXHJcbiAgICAgICAgICAgICAgICB3aGlsZShjb24uaW5kZXhPZignfn4nKT4tMSl7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpcnN0ID0gY29uLmluZGV4T2YoJ35+JylcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmUgPSBjb24uc2xpY2UoMCxmaXJzdClcclxuICAgICAgICAgICAgICAgICAgICBjb24gPSBjb24uc2xpY2UoZmlyc3QrMilcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2Vjb25kID0gY29uLmluZGV4T2YoJ35+JylcclxuICAgICAgICAgICAgICAgICAgICBpZihzZWNvbmQ+LTEgJiYgcHJlW3ByZS5sZW5ndGgtMV0hPSc+Jyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gcHJlKyc8c3BhbiBjbGFzcz1cImRlbFwiPn5+PC9zcGFuPjxkZWw+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkICs9IGNvbi5zbGljZSgwLHNlY29uZCkrJzwvZGVsPjxzcGFuIGNsYXNzPVwiZGVsXCI+fn48L3NwYW4+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb24gPSBjb24uc2xpY2Uoc2Vjb25kKzIpXHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gcHJlKyhmaXJzdD4tMj8nfn4nOicnKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGhhbmRsZWQrPWNvblxyXG4gICAgICAgICAgICAgICAgaWYoaGFuZGxlZCAhPSB2KXtcclxuICAgICAgICAgICAgICAgICAgICB2ID0gaGFuZGxlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyog6YeN54K55YaF5a655aSE55CGICovXHJcbiAgICAgICAgICAgIGlmKHYgJiYgdi5pbmRleE9mKCdgJyk+LTEpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbiA9IHZcclxuICAgICAgICAgICAgICAgIGxldCBoYW5kbGVkID0gJydcclxuICAgICAgICAgICAgICAgIHdoaWxlKGNvbi5pbmRleE9mKCdgJyk+LTEpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmaXJzdCA9IGNvbi5pbmRleE9mKCdgJylcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmUgPSBjb24uc2xpY2UoMCxmaXJzdClcclxuICAgICAgICAgICAgICAgICAgICBjb24gPSBjb24uc2xpY2UoZmlyc3QrMSlcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2Vjb25kID0gY29uLmluZGV4T2YoJ2AnKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNlY29uZD4tMSAmJiBwcmVbcHJlLmxlbmd0aC0xXSE9Jz4nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlZCArPSBwcmUrJzxjaXRlPmAnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gY29uLnNsaWNlKDAsc2Vjb25kKSsnYDwvY2l0ZT4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbiA9IGNvbi5zbGljZShzZWNvbmQrMSlcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gcHJlKyhmaXJzdD4tMT8nYCc6JycpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaGFuZGxlZCs9Y29uXHJcbiAgICAgICAgICAgICAgICBpZihoYW5kbGVkICE9IHYpe1xyXG4gICAgICAgICAgICAgICAgICAgIHYgPSBoYW5kbGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiDliqDnspflhoXlrrnlpITnkIYgKi9cclxuICAgICAgICAgICAgaWYodiAmJiB2LmluZGV4T2YoJyoqJyk+LTEpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbiA9IHZcclxuICAgICAgICAgICAgICAgIGxldCBoYW5kbGVkID0gJydcclxuICAgICAgICAgICAgICAgIHdoaWxlKGNvbi5pbmRleE9mKCcqKicpPi0xKXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZmlyc3QgPSBjb24uaW5kZXhPZignKionKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZSA9IGNvbi5zbGljZSgwLGZpcnN0KVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbiA9IGNvbi5zbGljZShmaXJzdCsyKVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWNvbmQgPSBjb24uaW5kZXhPZignKionKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNlY29uZD4tMSAmJiBwcmVbcHJlLmxlbmd0aC0xXSE9Jz4nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlZCArPSBwcmUrJzxzdHJvbmc+PHNwYW4+Kio8L3NwYW4+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkICs9IGNvbi5zbGljZSgwLHNlY29uZCkrJzxzcGFuPioqPC9zcGFuPjwvc3Ryb25nPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uID0gY29uLnNsaWNlKHNlY29uZCsyKVxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkICs9IHByZSsoZmlyc3Q+LTI/JyoqJzonJylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVkKz1jb25cclxuICAgICAgICAgICAgICAgIGlmKGhhbmRsZWQgIT0gdil7XHJcbiAgICAgICAgICAgICAgICAgICAgdiA9IGhhbmRsZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIOaWnOS9k+WGheWuueWkhOeQhiAqL1xyXG4gICAgICAgICAgICBpZih2ICYmIHYuaW5kZXhPZignKicpPi0xKXtcclxuICAgICAgICAgICAgICAgIGxldCBjb24gPSB2XHJcbiAgICAgICAgICAgICAgICBsZXQgaGFuZGxlZCA9ICcnXHJcbiAgICAgICAgICAgICAgICB3aGlsZShjb24uaW5kZXhPZignKicpPi0xICYmIGNvbltjb24uaW5kZXhPZignKicpKzFdIT0nKicgJiYgY29uW2Nvbi5pbmRleE9mKCcqJyktMV0gIT0nPicpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmaXJzdCA9IGNvbi5pbmRleE9mKCcqJylcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmUgPSBjb24uc2xpY2UoMCxmaXJzdClcclxuICAgICAgICAgICAgICAgICAgICBjb24gPSBjb24uc2xpY2UoZmlyc3QrMSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlY29uZCA9IGNvbi5pbmRleE9mKCcqJylcclxuICAgICAgICAgICAgICAgICAgICBpZihzZWNvbmQ+LTEgJiYgcHJlW3ByZS5sZW5ndGgtMV0hPSc+Jyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gcHJlKyc8aT48c3Bhbj4qPC9zcGFuPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlZCArPSBjb24uc2xpY2UoMCxzZWNvbmQpKyc8c3Bhbj4qPC9zcGFuPjwvaT4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbiA9IGNvbi5zbGljZShzZWNvbmQrMSlcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlZCArPSBwcmUrKGZpcnN0Pi0xPycqJzonJylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVkKz1jb25cclxuICAgICAgICAgICAgICAgIGlmKGhhbmRsZWQgIT0gdil7XHJcbiAgICAgICAgICAgICAgICAgICAgdiA9IGhhbmRsZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3Ryc1tpXSA9IHZcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgbmV3QXJyID0gW11cclxuICAgIHN0cnMubWFwKHY9PntcclxuICAgICAgICBuZXdBcnIucHVzaCh2KVxyXG4gICAgfSlcclxuICAgIHJldHVybiBuZXdBcnIuam9pbignXFxuJylcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaGFuZGxlRWRpdG9yIiwiY29uc3QgaGFuZGxlVmlldyA9IChodG1sKT0+e1xyXG5cclxuICAgIGNvbnN0IHN0cnMgPSBodG1sLnNwbGl0KCdcXG4nKVxyXG5cclxuICAgIGZvcihsZXQgaT0wO2k8c3Rycy5sZW5ndGg7aSsrKXtcclxuICAgICAgICBzdHJzW2ldID0gc3Ryc1tpXS5yZXBsYWNlKC88L2csJyZsdDsnKS5yZXBsYWNlKC8+L2csJyZndDsnKVxyXG4gICAgICAgIGxldCB2ID0gc3Ryc1tpXVxyXG4gICAgICAgIGxldCBsYW5ndWFnZSA9ICcnXHJcbiAgICAgICAgaWYodi5zbGljZSgwLDMpID09ICdgYGAnKXtcclxuICAgICAgICAgICAgbGV0IGJveCA9ICcnXHJcbiAgICAgICAgICAgIGJveCs9JydcclxuICAgICAgICAgICAgbGFuZ3VhZ2UgPSB2LnJlcGxhY2UoJ2BgYCcsJycpLnJlcGxhY2UoJyAnLCcnKS5yZXBsYWNlKCdcXG4nLCcnKS5yZXBsYWNlKCdcXHInLCcnKVxyXG4gICAgICAgICAgICBkZWxldGUgc3Ryc1tpXVxyXG4gICAgICAgICAgICBmb3IobGV0IGU9aSsxO2U8c3Rycy5sZW5ndGg7ZSsrKXtcclxuICAgICAgICAgICAgICAgIGxldCB2diA9IHN0cnNbZV1cclxuICAgICAgICAgICAgICAgIGlmKHZ2LnNsaWNlKDAsMykgPT0gJ2BgYCcpe1xyXG4gICAgICAgICAgICAgICAgICAgIGJveCs9JycrJ1xcbidcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGJveCs9dnYrJ1xcbidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGk9ZVxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0cnNbaV1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBib3ggPSBib3gucmVwbGFjZSgvXFxuKD8hW1xcc1xcU10qXFxuKS8sJycpXHJcbiAgICAgICAgICAgIGkrK1xyXG4gICAgICAgICAgICBkZWxldGUgc3Ryc1tpXVxyXG4gICAgICAgICAgICBpZighUHJpc20ubGFuZ3VhZ2VzW2xhbmd1YWdlXSkgbGFuZ3VhZ2UgPSAnanN4J1xyXG4gICAgICAgICAgICBjb25zdCBodG1sID0gUHJpc20uaGlnaGxpZ2h0KGJveCwgUHJpc20ubGFuZ3VhZ2VzW2xhbmd1YWdlLnJlcGxhY2UoJ1xccicsJycpXSxsYW5ndWFnZSk7XHJcbiAgICAgICAgICAgIHN0cnNbaV0gPSAnPHByZT48Y29kZT4nK2h0bWwrJzwvY29kZT48L3ByZT4nXHJcbiAgICAgICAgfWVsc2UgaWYodi5zbGljZSgwLDIpID09ICctICcpe1xyXG4gICAgICAgICAgICAvKiDlpITnkIbml6Dluo/liJfooaggKi9cclxuICAgICAgICAgICAgbGV0IGJveCA9ICcnO1xyXG4gICAgICAgICAgICBmb3IobGV0IGU9aTtlPHN0cnMubGVuZ3RoO2UrKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdnYgPSBzdHJzW2VdXHJcbiAgICAgICAgICAgICAgICBpZih2di5zbGljZSgwLDIpID09ICctICcpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHN0cnNbZSsxXS5zbGljZSgwLDIpID09ICctICcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3grPSc8bGk+Jyt2di5zbGljZSgyLHZ2Lmxlbmd0aCkrJ1xcbjwvbGk+J1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3grPSc8bGk+Jyt2di5zbGljZSgyLHZ2Lmxlbmd0aCkrJzwvbGk+J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaT1lXHJcbiAgICAgICAgICAgICAgICBkZWxldGUgc3Ryc1tpXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN0cnNbaV0gPSAnPHVsPicrYm94Kyc8L3VsPidcclxuICAgICAgICB9ZWxzZSBpZih2Lm1hdGNoKC9eWzAtOV0rXFwuXFxzLykpe1xyXG4gICAgICAgICAgICAvKiDlpITnkIbmnInluo/liJfooaggKi9cclxuICAgICAgICAgICAgbGV0IGJveCA9ICcnO1xyXG4gICAgICAgICAgICBmb3IobGV0IGU9aTtlPHN0cnMubGVuZ3RoO2UrKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdnYgPSBzdHJzW2VdXHJcbiAgICAgICAgICAgICAgICBpZih2di5tYXRjaCgvXlswLTldK1xcLlxccy8pKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihzdHJzW2UrMV0ubWF0Y2goL15bMC05XVxcLlxccy8pKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94Kz0nPGxpPicrdnYucmVwbGFjZSgvXlswLTldK1xcLlxccy8sJycpKydcXG48L2xpPidcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94Kz0nPGxpPicrdnYucmVwbGFjZSgvXlswLTldK1xcLlxccy8sJycpKyc8L2xpPidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGk9ZVxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0cnNbaV1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdHJzW2ldID0gJzxvbD4nK2JveCsnPC9vbD4nXHJcbiAgICAgICAgfWVsc2V7XHJcblxyXG4gICAgICAgICAgICAgLyog5Yig6Zmk57q/5aSE55CGICovXHJcbiAgICAgICAgICAgICBpZih2ICYmIHYuaW5kZXhPZignfn4nKT4tMSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29uID0gdlxyXG4gICAgICAgICAgICAgICAgbGV0IGhhbmRsZWQgPSAnJ1xyXG4gICAgICAgICAgICAgICAgd2hpbGUoY29uLmluZGV4T2YoJ35+Jyk+LTEpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmaXJzdCA9IGNvbi5pbmRleE9mKCd+ficpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJlID0gY29uLnNsaWNlKDAsZmlyc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uID0gY29uLnNsaWNlKGZpcnN0KzIpXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlY29uZCA9IGNvbi5pbmRleE9mKCd+ficpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc2Vjb25kPi0xICYmIHByZVtwcmUubGVuZ3RoLTFdIT0nPicpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkICs9IHByZSsnPGRlbD4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gY29uLnNsaWNlKDAsc2Vjb25kKSsnPC9kZWw+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb24gPSBjb24uc2xpY2Uoc2Vjb25kKzIpXHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gcHJlKyhmaXJzdD4tMj8nfn4nOicnKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGhhbmRsZWQrPWNvblxyXG4gICAgICAgICAgICAgICAgaWYoaGFuZGxlZCAhPSB2KXtcclxuICAgICAgICAgICAgICAgICAgICB2ID0gaGFuZGxlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyog5aSE55CG5qCH6aKYICovXHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoZWQgPSB2Lm1hdGNoKC9eI3sxLDZ9XFxzLylcclxuICAgICAgICAgICAgaWYobWF0Y2hlZCl7XHJcbiAgICAgICAgICAgICAgICB2ID0gJzxoJysobWF0Y2hlZFswXS5sZW5ndGgtMSkrJyBpZD1cIl9jYXRhJytpKydfXCI+Jyt2LnNsaWNlKG1hdGNoZWRbMF0ubGVuZ3RoKSsnPC9oJysobWF0Y2hlZFswXS5sZW5ndGgtMSkrJz4nXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIOW8leeUqOWGheWuueWkhOeQhiAqL1xyXG4gICAgICAgICAgICBpZih2LnNsaWNlKDAsNSkgPT0gJyZndDsgJykgdiA9ICc8YmxvY2txdW90ZT4nK3Yuc2xpY2UoNSkrJzwvYmxvY2txdW90ZT4nXHJcblxyXG4gICAgICAgICAgICAvKiDlpITnkIbliIblibLnur8gKi9cclxuICAgICAgICAgICAgaWYodiA9PSAnKioqJykgdiA9ICc8aHIgLz4nXHJcblxyXG4gICAgICAgICAgICAvKiDlpITnkIblm77niYcgKi9cclxuICAgICAgICAgICAgdiA9IHYucmVwbGFjZSgvXFwhXFxbLipcXF1cXCguKlxcKS9nLGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGZyb250ID0gZS5tYXRjaCgvXlxcIVxcWy4qXFxdXFwoLylbMF0uc2xpY2UoMiwtMilcclxuICAgICAgICAgICAgICAgIGxldCBlbmQgPSBlLm1hdGNoKC8oPz1cXF1cXCgpLipcXCkkLylbMF0uc2xpY2UoMiwtMSlcclxuICAgICAgICAgICAgICAgIHJldHVybiAnPGltZyBhbHQ9XCInK2Zyb250KydcIiBzcmM9XCInK2VuZCsnXCIgLz4nXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvKiDlpITnkIbotoXpk77mjqUgKi9cclxuICAgICAgICAgICAgdiA9IHYucmVwbGFjZSgvXFxbLipcXF1cXCguKlxcKS9nLGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGZyb250ID0gZS5tYXRjaCgvXlxcWy4qXFxdXFwoLylbMF0uc2xpY2UoMSwtMilcclxuICAgICAgICAgICAgICAgIGxldCBlbmQgPSBlLm1hdGNoKC8oPz1cXF1cXCgpLipcXCkkLylbMF0uc2xpY2UoMiwtMSlcclxuICAgICAgICAgICAgICAgIHJldHVybiAnPGEgaHJlZj1cIicrZW5kKydcIj4nK2Zyb250Kyc8L2E+J1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLyog6YeN54K55YaF5a655aSE55CGICovXHJcbiAgICAgICAgICAgIGlmKHYgJiYgdi5pbmRleE9mKCdgJyk+LTEpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbiA9IHZcclxuICAgICAgICAgICAgICAgIGxldCBoYW5kbGVkID0gJydcclxuICAgICAgICAgICAgICAgIHdoaWxlKGNvbi5pbmRleE9mKCdgJyk+LTEpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmaXJzdCA9IGNvbi5pbmRleE9mKCdgJylcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmUgPSBjb24uc2xpY2UoMCxmaXJzdClcclxuICAgICAgICAgICAgICAgICAgICBjb24gPSBjb24uc2xpY2UoZmlyc3QrMSlcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2Vjb25kID0gY29uLmluZGV4T2YoJ2AnKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNlY29uZD4tMSAmJiBwcmVbcHJlLmxlbmd0aC0xXSE9Jz4nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlZCArPSBwcmUrJzxjaXRlPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlZCArPSBjb24uc2xpY2UoMCxzZWNvbmQpKyc8L2NpdGU+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb24gPSBjb24uc2xpY2Uoc2Vjb25kKzEpXHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gcHJlKyhmaXJzdD4tMT8nYCc6JycpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaGFuZGxlZCs9Y29uXHJcbiAgICAgICAgICAgICAgICBpZihoYW5kbGVkICE9IHYpe1xyXG4gICAgICAgICAgICAgICAgICAgIHYgPSBoYW5kbGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiDliqDnspflhoXlrrnlpITnkIYgKi9cclxuICAgICAgICAgICAgaWYodiAmJiB2LmluZGV4T2YoJyoqJyk+LTEpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbiA9IHZcclxuICAgICAgICAgICAgICAgIGxldCBoYW5kbGVkID0gJydcclxuICAgICAgICAgICAgICAgIHdoaWxlKGNvbi5pbmRleE9mKCcqKicpPi0xKXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZmlyc3QgPSBjb24uaW5kZXhPZignKionKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZSA9IGNvbi5zbGljZSgwLGZpcnN0KVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbiA9IGNvbi5zbGljZShmaXJzdCsyKVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWNvbmQgPSBjb24uaW5kZXhPZignKionKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNlY29uZD4tMSAmJiBwcmVbcHJlLmxlbmd0aC0xXSE9Jz4nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlZCArPSBwcmUrJzxzdHJvbmc+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkICs9IGNvbi5zbGljZSgwLHNlY29uZCkrJzwvc3Ryb25nPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uID0gY29uLnNsaWNlKHNlY29uZCsyKVxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkICs9IHByZSsoZmlyc3Q+LTI/JyoqJzonJylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVkKz1jb25cclxuICAgICAgICAgICAgICAgIGlmKGhhbmRsZWQgIT0gdil7XHJcbiAgICAgICAgICAgICAgICAgICAgdiA9IGhhbmRsZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIOaWnOS9k+WGheWuueWkhOeQhiAqL1xyXG4gICAgICAgICAgICBpZih2ICYmIHYuaW5kZXhPZignKicpPi0xKXtcclxuICAgICAgICAgICAgICAgIGxldCBjb24gPSB2XHJcbiAgICAgICAgICAgICAgICBsZXQgaGFuZGxlZCA9ICcnXHJcbiAgICAgICAgICAgICAgICB3aGlsZShjb24uaW5kZXhPZignKicpPi0xICYmIGNvbltjb24uaW5kZXhPZignKicpKzFdIT0nKicgJiYgY29uW2Nvbi5pbmRleE9mKCcqJyktMV0gIT0nPicpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmaXJzdCA9IGNvbi5pbmRleE9mKCcqJylcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmUgPSBjb24uc2xpY2UoMCxmaXJzdClcclxuICAgICAgICAgICAgICAgICAgICBjb24gPSBjb24uc2xpY2UoZmlyc3QrMSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlY29uZCA9IGNvbi5pbmRleE9mKCcqJylcclxuICAgICAgICAgICAgICAgICAgICBpZihzZWNvbmQ+LTEgJiYgcHJlW3ByZS5sZW5ndGgtMV0hPSc+Jyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gcHJlKyc8aT4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gY29uLnNsaWNlKDAsc2Vjb25kKSsnPC9pPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uID0gY29uLnNsaWNlKHNlY29uZCsxKVxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkICs9IHByZSsoZmlyc3Q+LTE/JyonOicnKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGhhbmRsZWQrPWNvblxyXG4gICAgICAgICAgICAgICAgaWYoaGFuZGxlZCAhPSB2KXtcclxuICAgICAgICAgICAgICAgICAgICB2ID0gaGFuZGxlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdHJzW2ldID0gdlxyXG4gICAgICAgICAgICBpZih2LnNsaWNlKDAsMSkgIT0gJzwnICYmIHYuc2xpY2UoMCwtMSkgIT0gJz4nKXtcclxuICAgICAgICAgICAgICAgIHN0cnNbaV0gPSAnPHA+Jyt2Kyc8L3A+J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IG5ld0FyciA9IFtdXHJcbiAgICBzdHJzLm1hcCh2PT5uZXdBcnIucHVzaCh2KSlcclxuICAgIHJldHVybiBuZXdBcnIuam9pbignXFxuJylcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgaGFuZGxlVmlldyIsImltcG9ydCB7Z2V0Q3Vyc29yLHNldEN1cnNvcn0gZnJvbSAnLi91dGlsJ1xyXG5pbXBvcnQge3JhbmdlQm9sZCxyYW5nZUl0YWxpY3N9IGZyb20gJy4vc2hvcnRjdXQnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGtleWJvYXJkSG9vayhlKXtcclxuICAgIGNvbnN0IHBvc2l0aW9uID0gZ2V0Q3Vyc29yKHRoaXMuZW50cnkpXHJcbiAgICBjb25zdCByYW5nZSA9IGRvY3VtZW50LmdldFNlbGVjdGlvbigpLmdldFJhbmdlQXQoMClcclxuICAgIC8qIOemgeeUqGN0cmwrIEIgSSBaIFkqL1xyXG4gICAgaWYoZS5jdHJsS2V5ICYmIChlLmtleUNvZGUgPT0gNjYgfHwgZS5rZXlDb2RlID09IDczIHx8IGUua2V5Q29kZSA9PSA5MCB8fCBlLmtleUNvZGUgPT0gODkpKXtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcclxuICAgIH1cclxuXHJcbiAgICAvKiDnpoHnlKgg5Zue6L2mIFRhYiAgKi9cclxuICAgIGlmKGUua2V5Q29kZSA9PSAxMyB8fCBlLmtleUNvZGUgPT0gOSkgZS5wcmV2ZW50RGVmYXVsdCgpXHJcblxyXG4gICAgLyog56aB55Soc2hpZnQrVGFiICovXHJcbiAgICBpZihlLnNoaWZ0S2V5ICYmIGUua2V5Q29kZSA9PSA5KSBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICAvKiBUYWIg5YmN6L+b5LiA6KGMICovXHJcbiAgICBpZighZS5zaGlmdEtleSAmJiBlLmtleUNvZGUgPT0gOSApe1xyXG4gICAgICAgIGlmKHJhbmdlLmNvbGxhcHNlZCl7XHJcbiAgICAgICAgICAgIHJhbmdlLmluc2VydE5vZGUobmV3IFRleHQoXCIgICAgXCIpKVxyXG4gICAgICAgICAgICBzZXRDdXJzb3IodGhpcy5lbnRyeSxwb3NpdGlvblswXSs0LHBvc2l0aW9uWzFdKzQpXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbiA9IHRoaXMuZW50cnkuaW5uZXJUZXh0LnNwbGl0KCdcXG4nKVxyXG4gICAgICAgICAgICBsZXQgZWZmZWN0ZWRMaW5lQ291bnQgPSAwXHJcbiAgICAgICAgICAgIGxldCBsZW4gPSAwXHJcbiAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8Y29uLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgaWYobGVuPnBvc2l0aW9uWzBdKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25baS0xXSA9ICcgICAgJytjb25baS0xXVxyXG4gICAgICAgICAgICAgICAgICAgIGVmZmVjdGVkTGluZUNvdW50Kz00XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobGVuPnBvc2l0aW9uWzFdKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGVuICs9IGNvbltpXS5sZW5ndGgrMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyRWRpdG9yKGNvbi5qb2luKCdcXG4nKSlcclxuICAgICAgICAgICAgdGhpcy5hbmFseXNlZCh0aGlzLnJlbmRlclZpZXcodGhpcy5lbnRyeS5pbm5lclRleHQpKVxyXG4gICAgICAgICAgICBzZXRDdXJzb3IodGhpcy5lbnRyeSxwb3NpdGlvblswXSs0LHBvc2l0aW9uWzFdK2VmZmVjdGVkTGluZUNvdW50KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiBzaGlmdCtUYWIg6YCA5LiA6KGMICovXHJcbiAgICBpZihlLnNoaWZ0S2V5ICYmIGUua2V5Q29kZSA9PSA5KXtcclxuICAgICAgICBsZXQgY29uID0gdGhpcy5lbnRyeS5pbm5lclRleHQuc3BsaXQoJ1xcbicpXHJcbiAgICAgICAgbGV0IGVmZmVjdGVkTGluZUNvdW50ID0gMFxyXG4gICAgICAgIGxldCBsZW4gPSAwXHJcbiAgICAgICAgbGV0IGZpcnN0T2Zmc2V0ID0gLTFcclxuICAgICAgICBmb3IobGV0IGk9MDtpPGNvbi5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgaWYobGVuPnBvc2l0aW9uWzBdKXtcclxuICAgICAgICAgICAgICAgIGlmKGZpcnN0T2Zmc2V0PT0tMSkgZmlyc3RPZmZzZXQgPSBjb25baS0xXS5sZW5ndGggLSBjb25baS0xXS5yZXBsYWNlKC9eXFxzKy8sJycpLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBlPTA7ZTw0O2UrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY29uW2ktMV1bMF0gPT0gJyAnKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWZmZWN0ZWRMaW5lQ291bnQrPTFcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uW2ktMV0gPSBjb25baS0xXS5zbGljZSgxKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKGxlbj5wb3NpdGlvblsxXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGVuICs9IGNvbltpXS5sZW5ndGgrMVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlbmRlckVkaXRvcihjb24uam9pbignXFxuJykpXHJcbiAgICAgICAgdGhpcy5hbmFseXNlZCh0aGlzLnJlbmRlclZpZXcodGhpcy5lbnRyeS5pbm5lclRleHQpKVxyXG4gICAgICAgIHNldEN1cnNvcih0aGlzLmVudHJ5LHBvc2l0aW9uWzBdLWZpcnN0T2Zmc2V0LHBvc2l0aW9uWzFdLWVmZmVjdGVkTGluZUNvdW50KVxyXG4gICAgfVxyXG5cclxuICAgIC8qIOWkhOeQhiDliqDnspfvvIzmlpzkvZMgKi9cclxuICAgIGlmKGUuY3RybEtleSl7XHJcbiAgICAgICAgaWYoZS5rZXlDb2RlID09IDY2KXtcclxuICAgICAgICAgICAgcmFuZ2VCb2xkKHJhbmdlKVxyXG4gICAgICAgIH1lbHNlIGlmKGUua2V5Q29kZSA9PSA3Myl7XHJcbiAgICAgICAgICAgIHJhbmdlSXRhbGljcyhyYW5nZSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyog5aSE55CG5pKk5Zue77yM5oGi5aSN77yM5riy5p+TICovXHJcbiAgICBpZihlLmN0cmxLZXkgJiYgZS5rZXlDb2RlID09IDkwKXtcclxuICAgICAgICB0aGlzLnVuZG8oKVxyXG4gICAgfWVsc2UgaWYoZS5jdHJsS2V5ICYmIGUua2V5Q29kZSA9PSA4OSl7XHJcbiAgICAgICAgdGhpcy5yZWRvKClcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGlmKGUua2V5Q29kZSAhPSAzNyAmJiBlLmtleUNvZGUgIT0gMzggJiYgZS5rZXlDb2RlICE9IDM5ICYmIGUua2V5Q29kZSAhPSA0MCAmJiBlLmtleSE9J1Byb2Nlc3MnKXtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJFZGl0b3IodGhpcy5lbnRyeS5pbm5lclRleHQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICBsZXQgcmFuZ2UgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkuZ2V0UmFuZ2VBdCgwKVxyXG4gICAgICAgIC8qIOWkhOeQhuWbnui9puebuOWFsyAqL1xyXG4gICAgICAgIGlmKGUua2V5Q29kZSA9PSAxMyl7XHJcblxyXG4gICAgICAgICAgICAvL+WkhOeQhuaNouihjFxyXG4gICAgICAgICAgICBpZih0aGlzLmVudHJ5LmlubmVyVGV4dC5sZW5ndGggPT0gcG9zaXRpb25bMF0pIHJhbmdlLmluc2VydE5vZGUobmV3IFRleHQoJ1xcbicpKVxyXG4gICAgICAgICAgICByYW5nZS5pbnNlcnROb2RlKG5ldyBUZXh0KCdcXG4nKSlcclxuICAgICAgICAgICAgc2V0Q3Vyc29yKHRoaXMuZW50cnkscG9zaXRpb25bMF0rMSxwb3NpdGlvblsxXSsxKVxyXG5cclxuICAgICAgICAgICAgLy/lpITnkIbml6Dluo/mnInluo/liJfooajmjaLooYzmoLflvI9cclxuICAgICAgICAgICAgaWYocmFuZ2UuY29sbGFwc2VkKXtcclxuICAgICAgICAgICAgICAgIGlmKHJhbmdlLnN0YXJ0Q29udGFpbmVyKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJlbnQgPSByYW5nZS5zdGFydENvbnRhaW5lci5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmVudHJ5LmNvbnRhaW5zKHBhcmVudCkgJiYgcGFyZW50LnRhZ05hbWUgPT0gJ1VMJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaS5pbm5lckhUTUwgPSAnPHNwYW4+LSA8L3NwYW4+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByYW5nZS5pbnNlcnROb2RlKGxpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRDdXJzb3IodGhpcy5lbnRyeSxwb3NpdGlvblswXSszLHBvc2l0aW9uWzBdKzMpXHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYodGhpcy5lbnRyeS5jb250YWlucyhwYXJlbnQpICYmIHBhcmVudC50YWdOYW1lID09ICdPTCcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFzdE51bWJlciA9IE51bWJlcihwYXJlbnQubGFzdENoaWxkLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKS5pbm5lclRleHQpKzFcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGkuaW5uZXJIVE1MID0gJzxzcGFuPicrbGFzdE51bWJlcisnLiA8L3NwYW4+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByYW5nZS5pbnNlcnROb2RlKGxpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRDdXJzb3IodGhpcy5lbnRyeSxwb3NpdGlvblswXSszK1N0cmluZyhsYXN0TnVtYmVyKS5sZW5ndGgscG9zaXRpb25bMF0rMytTdHJpbmcobGFzdE51bWJlcikubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvKiDlhajpg6jlpITnkIbkuYvlkI7kv53lrZggKi9cclxuICAgICAgICBpZihlLmtleUNvZGUgIT0gMzcgJiYgZS5rZXlDb2RlICE9IDM4ICYmIGUua2V5Q29kZSAhPSAzOSAmJiBlLmtleUNvZGUgIT0gNDAgJiYgZS5rZXkhPSdQcm9jZXNzJyl7XHJcbiAgICAgICAgICAgIGlmKCEoZS5jdHJsS2V5ICYmIChlLmtleUNvZGUgPT0gOTAgfHwgZS5rZXlDb2RlID09IDg5KSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRWRpdG9yKHRoaXMuZW50cnkuaW5uZXJUZXh0KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmFseXNlZCh0aGlzLnJlbmRlclZpZXcodGhpcy5lbnRyeS5pbm5lclRleHQpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zYXZlQ2FjaGUoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSwxMClcclxufSIsIi8qIFByaXNtSlMgMS4yOC4wXHJcbmh0dHBzOi8vcHJpc21qcy5jb20vZG93bmxvYWQuaHRtbCN0aGVtZXM9cHJpc20tdG9tb3Jyb3cmbGFuZ3VhZ2VzPW1hcmt1cCtjc3MrY2xpa2UramF2YXNjcmlwdCtqc29uK21hcmt1cC10ZW1wbGF0aW5nK2pzeCt0c3grdHlwZXNjcmlwdCZwbHVnaW5zPWpzb25wLWhpZ2hsaWdodCAqL1xyXG52YXIgX3NlbGY9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFdvcmtlckdsb2JhbFNjb3BlJiZzZWxmIGluc3RhbmNlb2YgV29ya2VyR2xvYmFsU2NvcGU/c2VsZjp7fSxQcmlzbT1mdW5jdGlvbihlKXt2YXIgbj0vKD86XnxcXHMpbGFuZyg/OnVhZ2UpPy0oW1xcdy1dKykoPz1cXHN8JCkvaSx0PTAscj17fSxhPXttYW51YWw6ZS5QcmlzbSYmZS5QcmlzbS5tYW51YWwsZGlzYWJsZVdvcmtlck1lc3NhZ2VIYW5kbGVyOmUuUHJpc20mJmUuUHJpc20uZGlzYWJsZVdvcmtlck1lc3NhZ2VIYW5kbGVyLHV0aWw6e2VuY29kZTpmdW5jdGlvbiBlKG4pe3JldHVybiBuIGluc3RhbmNlb2YgaT9uZXcgaShuLnR5cGUsZShuLmNvbnRlbnQpLG4uYWxpYXMpOkFycmF5LmlzQXJyYXkobik/bi5tYXAoZSk6bi5yZXBsYWNlKC8mL2csXCImYW1wO1wiKS5yZXBsYWNlKC88L2csXCImbHQ7XCIpLnJlcGxhY2UoL1xcdTAwYTAvZyxcIiBcIil9LHR5cGU6ZnVuY3Rpb24oZSl7cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlKS5zbGljZSg4LC0xKX0sb2JqSWQ6ZnVuY3Rpb24oZSl7cmV0dXJuIGUuX19pZHx8T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2lkXCIse3ZhbHVlOisrdH0pLGUuX19pZH0sY2xvbmU6ZnVuY3Rpb24gZShuLHQpe3ZhciByLGk7c3dpdGNoKHQ9dHx8e30sYS51dGlsLnR5cGUobikpe2Nhc2VcIk9iamVjdFwiOmlmKGk9YS51dGlsLm9iaklkKG4pLHRbaV0pcmV0dXJuIHRbaV07Zm9yKHZhciBsIGluIHI9e30sdFtpXT1yLG4pbi5oYXNPd25Qcm9wZXJ0eShsKSYmKHJbbF09ZShuW2xdLHQpKTtyZXR1cm4gcjtjYXNlXCJBcnJheVwiOnJldHVybiBpPWEudXRpbC5vYmpJZChuKSx0W2ldP3RbaV06KHI9W10sdFtpXT1yLG4uZm9yRWFjaCgoZnVuY3Rpb24obixhKXtyW2FdPWUobix0KX0pKSxyKTtkZWZhdWx0OnJldHVybiBufX0sZ2V0TGFuZ3VhZ2U6ZnVuY3Rpb24oZSl7Zm9yKDtlOyl7dmFyIHQ9bi5leGVjKGUuY2xhc3NOYW1lKTtpZih0KXJldHVybiB0WzFdLnRvTG93ZXJDYXNlKCk7ZT1lLnBhcmVudEVsZW1lbnR9cmV0dXJuXCJub25lXCJ9LHNldExhbmd1YWdlOmZ1bmN0aW9uKGUsdCl7ZS5jbGFzc05hbWU9ZS5jbGFzc05hbWUucmVwbGFjZShSZWdFeHAobixcImdpXCIpLFwiXCIpLGUuY2xhc3NMaXN0LmFkZChcImxhbmd1YWdlLVwiK3QpfSxjdXJyZW50U2NyaXB0OmZ1bmN0aW9uKCl7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIGRvY3VtZW50KXJldHVybiBudWxsO2lmKFwiY3VycmVudFNjcmlwdFwiaW4gZG9jdW1lbnQpcmV0dXJuIGRvY3VtZW50LmN1cnJlbnRTY3JpcHQ7dHJ5e3Rocm93IG5ldyBFcnJvcn1jYXRjaChyKXt2YXIgZT0oL2F0IFteKFxcclxcbl0qXFwoKC4qKTpbXjpdKzpbXjpdK1xcKSQvaS5leGVjKHIuc3RhY2spfHxbXSlbMV07aWYoZSl7dmFyIG49ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7Zm9yKHZhciB0IGluIG4paWYoblt0XS5zcmM9PWUpcmV0dXJuIG5bdF19cmV0dXJuIG51bGx9fSxpc0FjdGl2ZTpmdW5jdGlvbihlLG4sdCl7Zm9yKHZhciByPVwibm8tXCIrbjtlOyl7dmFyIGE9ZS5jbGFzc0xpc3Q7aWYoYS5jb250YWlucyhuKSlyZXR1cm4hMDtpZihhLmNvbnRhaW5zKHIpKXJldHVybiExO2U9ZS5wYXJlbnRFbGVtZW50fXJldHVybiEhdH19LGxhbmd1YWdlczp7cGxhaW46cixwbGFpbnRleHQ6cix0ZXh0OnIsdHh0OnIsZXh0ZW5kOmZ1bmN0aW9uKGUsbil7dmFyIHQ9YS51dGlsLmNsb25lKGEubGFuZ3VhZ2VzW2VdKTtmb3IodmFyIHIgaW4gbil0W3JdPW5bcl07cmV0dXJuIHR9LGluc2VydEJlZm9yZTpmdW5jdGlvbihlLG4sdCxyKXt2YXIgaT0ocj1yfHxhLmxhbmd1YWdlcylbZV0sbD17fTtmb3IodmFyIG8gaW4gaSlpZihpLmhhc093blByb3BlcnR5KG8pKXtpZihvPT1uKWZvcih2YXIgcyBpbiB0KXQuaGFzT3duUHJvcGVydHkocykmJihsW3NdPXRbc10pO3QuaGFzT3duUHJvcGVydHkobyl8fChsW29dPWlbb10pfXZhciB1PXJbZV07cmV0dXJuIHJbZV09bCxhLmxhbmd1YWdlcy5ERlMoYS5sYW5ndWFnZXMsKGZ1bmN0aW9uKG4sdCl7dD09PXUmJm4hPWUmJih0aGlzW25dPWwpfSkpLGx9LERGUzpmdW5jdGlvbiBlKG4sdCxyLGkpe2k9aXx8e307dmFyIGw9YS51dGlsLm9iaklkO2Zvcih2YXIgbyBpbiBuKWlmKG4uaGFzT3duUHJvcGVydHkobykpe3QuY2FsbChuLG8sbltvXSxyfHxvKTt2YXIgcz1uW29dLHU9YS51dGlsLnR5cGUocyk7XCJPYmplY3RcIiE9PXV8fGlbbChzKV0/XCJBcnJheVwiIT09dXx8aVtsKHMpXXx8KGlbbChzKV09ITAsZShzLHQsbyxpKSk6KGlbbChzKV09ITAsZShzLHQsbnVsbCxpKSl9fX0scGx1Z2luczp7fSxoaWdobGlnaHRBbGw6ZnVuY3Rpb24oZSxuKXthLmhpZ2hsaWdodEFsbFVuZGVyKGRvY3VtZW50LGUsbil9LGhpZ2hsaWdodEFsbFVuZGVyOmZ1bmN0aW9uKGUsbix0KXt2YXIgcj17Y2FsbGJhY2s6dCxjb250YWluZXI6ZSxzZWxlY3RvcjonY29kZVtjbGFzcyo9XCJsYW5ndWFnZS1cIl0sIFtjbGFzcyo9XCJsYW5ndWFnZS1cIl0gY29kZSwgY29kZVtjbGFzcyo9XCJsYW5nLVwiXSwgW2NsYXNzKj1cImxhbmctXCJdIGNvZGUnfTthLmhvb2tzLnJ1bihcImJlZm9yZS1oaWdobGlnaHRhbGxcIixyKSxyLmVsZW1lbnRzPUFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShyLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKHIuc2VsZWN0b3IpKSxhLmhvb2tzLnJ1bihcImJlZm9yZS1hbGwtZWxlbWVudHMtaGlnaGxpZ2h0XCIscik7Zm9yKHZhciBpLGw9MDtpPXIuZWxlbWVudHNbbCsrXTspYS5oaWdobGlnaHRFbGVtZW50KGksITA9PT1uLHIuY2FsbGJhY2spfSxoaWdobGlnaHRFbGVtZW50OmZ1bmN0aW9uKG4sdCxyKXt2YXIgaT1hLnV0aWwuZ2V0TGFuZ3VhZ2UobiksbD1hLmxhbmd1YWdlc1tpXTthLnV0aWwuc2V0TGFuZ3VhZ2UobixpKTt2YXIgbz1uLnBhcmVudEVsZW1lbnQ7byYmXCJwcmVcIj09PW8ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSYmYS51dGlsLnNldExhbmd1YWdlKG8saSk7dmFyIHM9e2VsZW1lbnQ6bixsYW5ndWFnZTppLGdyYW1tYXI6bCxjb2RlOm4udGV4dENvbnRlbnR9O2Z1bmN0aW9uIHUoZSl7cy5oaWdobGlnaHRlZENvZGU9ZSxhLmhvb2tzLnJ1bihcImJlZm9yZS1pbnNlcnRcIixzKSxzLmVsZW1lbnQuaW5uZXJIVE1MPXMuaGlnaGxpZ2h0ZWRDb2RlLGEuaG9va3MucnVuKFwiYWZ0ZXItaGlnaGxpZ2h0XCIscyksYS5ob29rcy5ydW4oXCJjb21wbGV0ZVwiLHMpLHImJnIuY2FsbChzLmVsZW1lbnQpfWlmKGEuaG9va3MucnVuKFwiYmVmb3JlLXNhbml0eS1jaGVja1wiLHMpLChvPXMuZWxlbWVudC5wYXJlbnRFbGVtZW50KSYmXCJwcmVcIj09PW8ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSYmIW8uaGFzQXR0cmlidXRlKFwidGFiaW5kZXhcIikmJm8uc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIixcIjBcIiksIXMuY29kZSlyZXR1cm4gYS5ob29rcy5ydW4oXCJjb21wbGV0ZVwiLHMpLHZvaWQociYmci5jYWxsKHMuZWxlbWVudCkpO2lmKGEuaG9va3MucnVuKFwiYmVmb3JlLWhpZ2hsaWdodFwiLHMpLHMuZ3JhbW1hcilpZih0JiZlLldvcmtlcil7dmFyIGM9bmV3IFdvcmtlcihhLmZpbGVuYW1lKTtjLm9ubWVzc2FnZT1mdW5jdGlvbihlKXt1KGUuZGF0YSl9LGMucG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkoe2xhbmd1YWdlOnMubGFuZ3VhZ2UsY29kZTpzLmNvZGUsaW1tZWRpYXRlQ2xvc2U6ITB9KSl9ZWxzZSB1KGEuaGlnaGxpZ2h0KHMuY29kZSxzLmdyYW1tYXIscy5sYW5ndWFnZSkpO2Vsc2UgdShhLnV0aWwuZW5jb2RlKHMuY29kZSkpfSxoaWdobGlnaHQ6ZnVuY3Rpb24oZSxuLHQpe3ZhciByPXtjb2RlOmUsZ3JhbW1hcjpuLGxhbmd1YWdlOnR9O2lmKGEuaG9va3MucnVuKFwiYmVmb3JlLXRva2VuaXplXCIsciksIXIuZ3JhbW1hcil0aHJvdyBuZXcgRXJyb3IoJ1RoZSBsYW5ndWFnZSBcIicrci5sYW5ndWFnZSsnXCIgaGFzIG5vIGdyYW1tYXIuJyk7cmV0dXJuIHIudG9rZW5zPWEudG9rZW5pemUoci5jb2RlLHIuZ3JhbW1hciksYS5ob29rcy5ydW4oXCJhZnRlci10b2tlbml6ZVwiLHIpLGkuc3RyaW5naWZ5KGEudXRpbC5lbmNvZGUoci50b2tlbnMpLHIubGFuZ3VhZ2UpfSx0b2tlbml6ZTpmdW5jdGlvbihlLG4pe3ZhciB0PW4ucmVzdDtpZih0KXtmb3IodmFyIHIgaW4gdCluW3JdPXRbcl07ZGVsZXRlIG4ucmVzdH12YXIgYT1uZXcgcztyZXR1cm4gdShhLGEuaGVhZCxlKSxvKGUsYSxuLGEuaGVhZCwwKSxmdW5jdGlvbihlKXtmb3IodmFyIG49W10sdD1lLmhlYWQubmV4dDt0IT09ZS50YWlsOyluLnB1c2godC52YWx1ZSksdD10Lm5leHQ7cmV0dXJuIG59KGEpfSxob29rczp7YWxsOnt9LGFkZDpmdW5jdGlvbihlLG4pe3ZhciB0PWEuaG9va3MuYWxsO3RbZV09dFtlXXx8W10sdFtlXS5wdXNoKG4pfSxydW46ZnVuY3Rpb24oZSxuKXt2YXIgdD1hLmhvb2tzLmFsbFtlXTtpZih0JiZ0Lmxlbmd0aClmb3IodmFyIHIsaT0wO3I9dFtpKytdOylyKG4pfX0sVG9rZW46aX07ZnVuY3Rpb24gaShlLG4sdCxyKXt0aGlzLnR5cGU9ZSx0aGlzLmNvbnRlbnQ9bix0aGlzLmFsaWFzPXQsdGhpcy5sZW5ndGg9MHwocnx8XCJcIikubGVuZ3RofWZ1bmN0aW9uIGwoZSxuLHQscil7ZS5sYXN0SW5kZXg9bjt2YXIgYT1lLmV4ZWModCk7aWYoYSYmciYmYVsxXSl7dmFyIGk9YVsxXS5sZW5ndGg7YS5pbmRleCs9aSxhWzBdPWFbMF0uc2xpY2UoaSl9cmV0dXJuIGF9ZnVuY3Rpb24gbyhlLG4sdCxyLHMsZyl7Zm9yKHZhciBmIGluIHQpaWYodC5oYXNPd25Qcm9wZXJ0eShmKSYmdFtmXSl7dmFyIGg9dFtmXTtoPUFycmF5LmlzQXJyYXkoaCk/aDpbaF07Zm9yKHZhciBkPTA7ZDxoLmxlbmd0aDsrK2Qpe2lmKGcmJmcuY2F1c2U9PWYrXCIsXCIrZClyZXR1cm47dmFyIHY9aFtkXSxwPXYuaW5zaWRlLG09ISF2Lmxvb2tiZWhpbmQseT0hIXYuZ3JlZWR5LGs9di5hbGlhcztpZih5JiYhdi5wYXR0ZXJuLmdsb2JhbCl7dmFyIHg9di5wYXR0ZXJuLnRvU3RyaW5nKCkubWF0Y2goL1tpbXN1eV0qJC8pWzBdO3YucGF0dGVybj1SZWdFeHAodi5wYXR0ZXJuLnNvdXJjZSx4K1wiZ1wiKX1mb3IodmFyIGI9di5wYXR0ZXJufHx2LHc9ci5uZXh0LEE9czt3IT09bi50YWlsJiYhKGcmJkE+PWcucmVhY2gpO0ErPXcudmFsdWUubGVuZ3RoLHc9dy5uZXh0KXt2YXIgRT13LnZhbHVlO2lmKG4ubGVuZ3RoPmUubGVuZ3RoKXJldHVybjtpZighKEUgaW5zdGFuY2VvZiBpKSl7dmFyIFAsTD0xO2lmKHkpe2lmKCEoUD1sKGIsQSxlLG0pKXx8UC5pbmRleD49ZS5sZW5ndGgpYnJlYWs7dmFyIFM9UC5pbmRleCxPPVAuaW5kZXgrUFswXS5sZW5ndGgsaj1BO2ZvcihqKz13LnZhbHVlLmxlbmd0aDtTPj1qOylqKz0odz13Lm5leHQpLnZhbHVlLmxlbmd0aDtpZihBPWotPXcudmFsdWUubGVuZ3RoLHcudmFsdWUgaW5zdGFuY2VvZiBpKWNvbnRpbnVlO2Zvcih2YXIgQz13O0MhPT1uLnRhaWwmJihqPE98fFwic3RyaW5nXCI9PXR5cGVvZiBDLnZhbHVlKTtDPUMubmV4dClMKyssais9Qy52YWx1ZS5sZW5ndGg7TC0tLEU9ZS5zbGljZShBLGopLFAuaW5kZXgtPUF9ZWxzZSBpZighKFA9bChiLDAsRSxtKSkpY29udGludWU7Uz1QLmluZGV4O3ZhciBOPVBbMF0sXz1FLnNsaWNlKDAsUyksTT1FLnNsaWNlKFMrTi5sZW5ndGgpLFc9QStFLmxlbmd0aDtnJiZXPmcucmVhY2gmJihnLnJlYWNoPVcpO3ZhciB6PXcucHJldjtpZihfJiYoej11KG4seixfKSxBKz1fLmxlbmd0aCksYyhuLHosTCksdz11KG4seixuZXcgaShmLHA/YS50b2tlbml6ZShOLHApOk4sayxOKSksTSYmdShuLHcsTSksTD4xKXt2YXIgST17Y2F1c2U6ZitcIixcIitkLHJlYWNoOld9O28oZSxuLHQsdy5wcmV2LEEsSSksZyYmSS5yZWFjaD5nLnJlYWNoJiYoZy5yZWFjaD1JLnJlYWNoKX19fX19fWZ1bmN0aW9uIHMoKXt2YXIgZT17dmFsdWU6bnVsbCxwcmV2Om51bGwsbmV4dDpudWxsfSxuPXt2YWx1ZTpudWxsLHByZXY6ZSxuZXh0Om51bGx9O2UubmV4dD1uLHRoaXMuaGVhZD1lLHRoaXMudGFpbD1uLHRoaXMubGVuZ3RoPTB9ZnVuY3Rpb24gdShlLG4sdCl7dmFyIHI9bi5uZXh0LGE9e3ZhbHVlOnQscHJldjpuLG5leHQ6cn07cmV0dXJuIG4ubmV4dD1hLHIucHJldj1hLGUubGVuZ3RoKyssYX1mdW5jdGlvbiBjKGUsbix0KXtmb3IodmFyIHI9bi5uZXh0LGE9MDthPHQmJnIhPT1lLnRhaWw7YSsrKXI9ci5uZXh0O24ubmV4dD1yLHIucHJldj1uLGUubGVuZ3RoLT1hfWlmKGUuUHJpc209YSxpLnN0cmluZ2lmeT1mdW5jdGlvbiBlKG4sdCl7aWYoXCJzdHJpbmdcIj09dHlwZW9mIG4pcmV0dXJuIG47aWYoQXJyYXkuaXNBcnJheShuKSl7dmFyIHI9XCJcIjtyZXR1cm4gbi5mb3JFYWNoKChmdW5jdGlvbihuKXtyKz1lKG4sdCl9KSkscn12YXIgaT17dHlwZTpuLnR5cGUsY29udGVudDplKG4uY29udGVudCx0KSx0YWc6XCJzcGFuXCIsY2xhc3NlczpbXCJ0b2tlblwiLG4udHlwZV0sYXR0cmlidXRlczp7fSxsYW5ndWFnZTp0fSxsPW4uYWxpYXM7bCYmKEFycmF5LmlzQXJyYXkobCk/QXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoaS5jbGFzc2VzLGwpOmkuY2xhc3Nlcy5wdXNoKGwpKSxhLmhvb2tzLnJ1bihcIndyYXBcIixpKTt2YXIgbz1cIlwiO2Zvcih2YXIgcyBpbiBpLmF0dHJpYnV0ZXMpbys9XCIgXCIrcysnPVwiJysoaS5hdHRyaWJ1dGVzW3NdfHxcIlwiKS5yZXBsYWNlKC9cIi9nLFwiJnF1b3Q7XCIpKydcIic7cmV0dXJuXCI8XCIraS50YWcrJyBjbGFzcz1cIicraS5jbGFzc2VzLmpvaW4oXCIgXCIpKydcIicrbytcIj5cIitpLmNvbnRlbnQrXCI8L1wiK2kudGFnK1wiPlwifSwhZS5kb2N1bWVudClyZXR1cm4gZS5hZGRFdmVudExpc3RlbmVyPyhhLmRpc2FibGVXb3JrZXJNZXNzYWdlSGFuZGxlcnx8ZS5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLChmdW5jdGlvbihuKXt2YXIgdD1KU09OLnBhcnNlKG4uZGF0YSkscj10Lmxhbmd1YWdlLGk9dC5jb2RlLGw9dC5pbW1lZGlhdGVDbG9zZTtlLnBvc3RNZXNzYWdlKGEuaGlnaGxpZ2h0KGksYS5sYW5ndWFnZXNbcl0scikpLGwmJmUuY2xvc2UoKX0pLCExKSxhKTphO3ZhciBnPWEudXRpbC5jdXJyZW50U2NyaXB0KCk7ZnVuY3Rpb24gZigpe2EubWFudWFsfHxhLmhpZ2hsaWdodEFsbCgpfWlmKGcmJihhLmZpbGVuYW1lPWcuc3JjLGcuaGFzQXR0cmlidXRlKFwiZGF0YS1tYW51YWxcIikmJihhLm1hbnVhbD0hMCkpLCFhLm1hbnVhbCl7dmFyIGg9ZG9jdW1lbnQucmVhZHlTdGF0ZTtcImxvYWRpbmdcIj09PWh8fFwiaW50ZXJhY3RpdmVcIj09PWgmJmcmJmcuZGVmZXI/ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmKTp3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lP3dpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZik6d2luZG93LnNldFRpbWVvdXQoZiwxNil9cmV0dXJuIGF9KF9zZWxmKTtcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlJiZtb2R1bGUuZXhwb3J0cyYmKG1vZHVsZS5leHBvcnRzPVByaXNtKSxcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsJiYoZ2xvYmFsLlByaXNtPVByaXNtKTtcclxuUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cD17Y29tbWVudDp7cGF0dGVybjovPCEtLSg/Oig/ITwhLS0pW1xcc1xcU10pKj8tLT4vLGdyZWVkeTohMH0scHJvbG9nOntwYXR0ZXJuOi88XFw/W1xcc1xcU10rP1xcPz4vLGdyZWVkeTohMH0sZG9jdHlwZTp7cGF0dGVybjovPCFET0NUWVBFKD86W14+XCInW1xcXV18XCJbXlwiXSpcInwnW14nXSonKSsoPzpcXFsoPzpbXjxcIidcXF1dfFwiW15cIl0qXCJ8J1teJ10qJ3w8KD8hIS0tKXw8IS0tKD86W14tXXwtKD8hLT4pKSotLT4pKlxcXVxccyopPz4vaSxncmVlZHk6ITAsaW5zaWRlOntcImludGVybmFsLXN1YnNldFwiOntwYXR0ZXJuOi8oXlteXFxbXSpcXFspW1xcc1xcU10rKD89XFxdPiQpLyxsb29rYmVoaW5kOiEwLGdyZWVkeTohMCxpbnNpZGU6bnVsbH0sc3RyaW5nOntwYXR0ZXJuOi9cIlteXCJdKlwifCdbXiddKicvLGdyZWVkeTohMH0scHVuY3R1YXRpb246L148IXw+JHxbW1xcXV0vLFwiZG9jdHlwZS10YWdcIjovXkRPQ1RZUEUvaSxuYW1lOi9bXlxcczw+J1wiXSsvfX0sY2RhdGE6e3BhdHRlcm46LzwhXFxbQ0RBVEFcXFtbXFxzXFxTXSo/XFxdXFxdPi9pLGdyZWVkeTohMH0sdGFnOntwYXR0ZXJuOi88XFwvPyg/IVxcZClbXlxccz5cXC89JDwlXSsoPzpcXHMoPzpcXHMqW15cXHM+XFwvPV0rKD86XFxzKj1cXHMqKD86XCJbXlwiXSpcInwnW14nXSonfFteXFxzJ1wiPj1dKyg/PVtcXHM+XSkpfCg/PVtcXHMvPl0pKSkrKT9cXHMqXFwvPz4vLGdyZWVkeTohMCxpbnNpZGU6e3RhZzp7cGF0dGVybjovXjxcXC8/W15cXHM+XFwvXSsvLGluc2lkZTp7cHVuY3R1YXRpb246L148XFwvPy8sbmFtZXNwYWNlOi9eW15cXHM+XFwvOl0rOi99fSxcInNwZWNpYWwtYXR0clwiOltdLFwiYXR0ci12YWx1ZVwiOntwYXR0ZXJuOi89XFxzKig/OlwiW15cIl0qXCJ8J1teJ10qJ3xbXlxccydcIj49XSspLyxpbnNpZGU6e3B1bmN0dWF0aW9uOlt7cGF0dGVybjovXj0vLGFsaWFzOlwiYXR0ci1lcXVhbHNcIn0se3BhdHRlcm46L14oXFxzKilbXCInXXxbXCInXSQvLGxvb2tiZWhpbmQ6ITB9XX19LHB1bmN0dWF0aW9uOi9cXC8/Pi8sXCJhdHRyLW5hbWVcIjp7cGF0dGVybjovW15cXHM+XFwvXSsvLGluc2lkZTp7bmFtZXNwYWNlOi9eW15cXHM+XFwvOl0rOi99fX19LGVudGl0eTpbe3BhdHRlcm46LyZbXFxkYS16XXsxLDh9Oy9pLGFsaWFzOlwibmFtZWQtZW50aXR5XCJ9LC8mI3g/W1xcZGEtZl17MSw4fTsvaV19LFByaXNtLmxhbmd1YWdlcy5tYXJrdXAudGFnLmluc2lkZVtcImF0dHItdmFsdWVcIl0uaW5zaWRlLmVudGl0eT1QcmlzbS5sYW5ndWFnZXMubWFya3VwLmVudGl0eSxQcmlzbS5sYW5ndWFnZXMubWFya3VwLmRvY3R5cGUuaW5zaWRlW1wiaW50ZXJuYWwtc3Vic2V0XCJdLmluc2lkZT1QcmlzbS5sYW5ndWFnZXMubWFya3VwLFByaXNtLmhvb2tzLmFkZChcIndyYXBcIiwoZnVuY3Rpb24oYSl7XCJlbnRpdHlcIj09PWEudHlwZSYmKGEuYXR0cmlidXRlcy50aXRsZT1hLmNvbnRlbnQucmVwbGFjZSgvJmFtcDsvLFwiJlwiKSl9KSksT2JqZWN0LmRlZmluZVByb3BlcnR5KFByaXNtLmxhbmd1YWdlcy5tYXJrdXAudGFnLFwiYWRkSW5saW5lZFwiLHt2YWx1ZTpmdW5jdGlvbihhLGUpe3ZhciBzPXt9O3NbXCJsYW5ndWFnZS1cIitlXT17cGF0dGVybjovKF48IVxcW0NEQVRBXFxbKVtcXHNcXFNdKz8oPz1cXF1cXF0+JCkvaSxsb29rYmVoaW5kOiEwLGluc2lkZTpQcmlzbS5sYW5ndWFnZXNbZV19LHMuY2RhdGE9L148IVxcW0NEQVRBXFxbfFxcXVxcXT4kL2k7dmFyIHQ9e1wiaW5jbHVkZWQtY2RhdGFcIjp7cGF0dGVybjovPCFcXFtDREFUQVxcW1tcXHNcXFNdKj9cXF1cXF0+L2ksaW5zaWRlOnN9fTt0W1wibGFuZ3VhZ2UtXCIrZV09e3BhdHRlcm46L1tcXHNcXFNdKy8saW5zaWRlOlByaXNtLmxhbmd1YWdlc1tlXX07dmFyIG49e307blthXT17cGF0dGVybjpSZWdFeHAoXCIoPF9fW14+XSo+KSg/OjwhXFxcXFtDREFUQVxcXFxbKD86W15cXFxcXV18XFxcXF0oPyFcXFxcXT4pKSpcXFxcXVxcXFxdPnwoPyE8IVxcXFxbQ0RBVEFcXFxcWylbXl0pKj8oPz08L19fPilcIi5yZXBsYWNlKC9fXy9nLChmdW5jdGlvbigpe3JldHVybiBhfSkpLFwiaVwiKSxsb29rYmVoaW5kOiEwLGdyZWVkeTohMCxpbnNpZGU6dH0sUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZShcIm1hcmt1cFwiLFwiY2RhdGFcIixuKX19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cC50YWcsXCJhZGRBdHRyaWJ1dGVcIix7dmFsdWU6ZnVuY3Rpb24oYSxlKXtQcmlzbS5sYW5ndWFnZXMubWFya3VwLnRhZy5pbnNpZGVbXCJzcGVjaWFsLWF0dHJcIl0ucHVzaCh7cGF0dGVybjpSZWdFeHAoXCIoXnxbXFxcIidcXFxcc10pKD86XCIrYStcIilcXFxccyo9XFxcXHMqKD86XFxcIlteXFxcIl0qXFxcInwnW14nXSonfFteXFxcXHMnXFxcIj49XSsoPz1bXFxcXHM+XSkpXCIsXCJpXCIpLGxvb2tiZWhpbmQ6ITAsaW5zaWRlOntcImF0dHItbmFtZVwiOi9eW15cXHM9XSsvLFwiYXR0ci12YWx1ZVwiOntwYXR0ZXJuOi89W1xcc1xcU10rLyxpbnNpZGU6e3ZhbHVlOntwYXR0ZXJuOi8oXj1cXHMqKFtcIiddfCg/IVtcIiddKSkpXFxTW1xcc1xcU10qKD89XFwyJCkvLGxvb2tiZWhpbmQ6ITAsYWxpYXM6W2UsXCJsYW5ndWFnZS1cIitlXSxpbnNpZGU6UHJpc20ubGFuZ3VhZ2VzW2VdfSxwdW5jdHVhdGlvbjpbe3BhdHRlcm46L149LyxhbGlhczpcImF0dHItZXF1YWxzXCJ9LC9cInwnL119fX19KX19KSxQcmlzbS5sYW5ndWFnZXMuaHRtbD1QcmlzbS5sYW5ndWFnZXMubWFya3VwLFByaXNtLmxhbmd1YWdlcy5tYXRobWw9UHJpc20ubGFuZ3VhZ2VzLm1hcmt1cCxQcmlzbS5sYW5ndWFnZXMuc3ZnPVByaXNtLmxhbmd1YWdlcy5tYXJrdXAsUHJpc20ubGFuZ3VhZ2VzLnhtbD1QcmlzbS5sYW5ndWFnZXMuZXh0ZW5kKFwibWFya3VwXCIse30pLFByaXNtLmxhbmd1YWdlcy5zc21sPVByaXNtLmxhbmd1YWdlcy54bWwsUHJpc20ubGFuZ3VhZ2VzLmF0b209UHJpc20ubGFuZ3VhZ2VzLnhtbCxQcmlzbS5sYW5ndWFnZXMucnNzPVByaXNtLmxhbmd1YWdlcy54bWw7XHJcbiFmdW5jdGlvbihzKXt2YXIgZT0vKD86XCIoPzpcXFxcKD86XFxyXFxufFtcXHNcXFNdKXxbXlwiXFxcXFxcclxcbl0pKlwifCcoPzpcXFxcKD86XFxyXFxufFtcXHNcXFNdKXxbXidcXFxcXFxyXFxuXSkqJykvO3MubGFuZ3VhZ2VzLmNzcz17Y29tbWVudDovXFwvXFwqW1xcc1xcU10qP1xcKlxcLy8sYXRydWxlOntwYXR0ZXJuOlJlZ0V4cChcIkBbXFxcXHctXSg/OlteO3tcXFxcc1xcXCInXXxcXFxccysoPyFcXFxccyl8XCIrZS5zb3VyY2UrXCIpKj8oPzo7fCg/PVxcXFxzKlxcXFx7KSlcIiksaW5zaWRlOntydWxlOi9eQFtcXHctXSsvLFwic2VsZWN0b3ItZnVuY3Rpb24tYXJndW1lbnRcIjp7cGF0dGVybjovKFxcYnNlbGVjdG9yXFxzKlxcKFxccyooPyFbXFxzKV0pKSg/OlteKClcXHNdfFxccysoPyFbXFxzKV0pfFxcKCg/OlteKCldfFxcKFteKCldKlxcKSkqXFwpKSsoPz1cXHMqXFwpKS8sbG9va2JlaGluZDohMCxhbGlhczpcInNlbGVjdG9yXCJ9LGtleXdvcmQ6e3BhdHRlcm46LyhefFteXFx3LV0pKD86YW5kfG5vdHxvbmx5fG9yKSg/IVtcXHctXSkvLGxvb2tiZWhpbmQ6ITB9fX0sdXJsOntwYXR0ZXJuOlJlZ0V4cChcIlxcXFxidXJsXFxcXCgoPzpcIitlLnNvdXJjZStcInwoPzpbXlxcXFxcXFxcXFxyXFxuKClcXFwiJ118XFxcXFxcXFxbXl0pKilcXFxcKVwiLFwiaVwiKSxncmVlZHk6ITAsaW5zaWRlOntmdW5jdGlvbjovXnVybC9pLHB1bmN0dWF0aW9uOi9eXFwofFxcKSQvLHN0cmluZzp7cGF0dGVybjpSZWdFeHAoXCJeXCIrZS5zb3VyY2UrXCIkXCIpLGFsaWFzOlwidXJsXCJ9fX0sc2VsZWN0b3I6e3BhdHRlcm46UmVnRXhwKFwiKF58W3t9XFxcXHNdKVtee31cXFxcc10oPzpbXnt9O1xcXCInXFxcXHNdfFxcXFxzKyg/IVtcXFxcc3tdKXxcIitlLnNvdXJjZStcIikqKD89XFxcXHMqXFxcXHspXCIpLGxvb2tiZWhpbmQ6ITB9LHN0cmluZzp7cGF0dGVybjplLGdyZWVkeTohMH0scHJvcGVydHk6e3BhdHRlcm46LyhefFteLVxcd1xceEEwLVxcdUZGRkZdKSg/IVxccylbLV9hLXpcXHhBMC1cXHVGRkZGXSg/Oig/IVxccylbLVxcd1xceEEwLVxcdUZGRkZdKSooPz1cXHMqOikvaSxsb29rYmVoaW5kOiEwfSxpbXBvcnRhbnQ6LyFpbXBvcnRhbnRcXGIvaSxmdW5jdGlvbjp7cGF0dGVybjovKF58W14tYS16MC05XSlbLWEtejAtOV0rKD89XFwoKS9pLGxvb2tiZWhpbmQ6ITB9LHB1bmN0dWF0aW9uOi9bKCl7fTs6LF0vfSxzLmxhbmd1YWdlcy5jc3MuYXRydWxlLmluc2lkZS5yZXN0PXMubGFuZ3VhZ2VzLmNzczt2YXIgdD1zLmxhbmd1YWdlcy5tYXJrdXA7dCYmKHQudGFnLmFkZElubGluZWQoXCJzdHlsZVwiLFwiY3NzXCIpLHQudGFnLmFkZEF0dHJpYnV0ZShcInN0eWxlXCIsXCJjc3NcIikpfShQcmlzbSk7XHJcblByaXNtLmxhbmd1YWdlcy5jbGlrZT17Y29tbWVudDpbe3BhdHRlcm46LyhefFteXFxcXF0pXFwvXFwqW1xcc1xcU10qPyg/OlxcKlxcL3wkKS8sbG9va2JlaGluZDohMCxncmVlZHk6ITB9LHtwYXR0ZXJuOi8oXnxbXlxcXFw6XSlcXC9cXC8uKi8sbG9va2JlaGluZDohMCxncmVlZHk6ITB9XSxzdHJpbmc6e3BhdHRlcm46LyhbXCInXSkoPzpcXFxcKD86XFxyXFxufFtcXHNcXFNdKXwoPyFcXDEpW15cXFxcXFxyXFxuXSkqXFwxLyxncmVlZHk6ITB9LFwiY2xhc3MtbmFtZVwiOntwYXR0ZXJuOi8oXFxiKD86Y2xhc3N8ZXh0ZW5kc3xpbXBsZW1lbnRzfGluc3RhbmNlb2Z8aW50ZXJmYWNlfG5ld3x0cmFpdClcXHMrfFxcYmNhdGNoXFxzK1xcKClbXFx3LlxcXFxdKy9pLGxvb2tiZWhpbmQ6ITAsaW5zaWRlOntwdW5jdHVhdGlvbjovWy5cXFxcXS99fSxrZXl3b3JkOi9cXGIoPzpicmVha3xjYXRjaHxjb250aW51ZXxkb3xlbHNlfGZpbmFsbHl8Zm9yfGZ1bmN0aW9ufGlmfGlufGluc3RhbmNlb2Z8bmV3fG51bGx8cmV0dXJufHRocm93fHRyeXx3aGlsZSlcXGIvLGJvb2xlYW46L1xcYig/OmZhbHNlfHRydWUpXFxiLyxmdW5jdGlvbjovXFxiXFx3Kyg/PVxcKCkvLG51bWJlcjovXFxiMHhbXFxkYS1mXStcXGJ8KD86XFxiXFxkKyg/OlxcLlxcZCopP3xcXEJcXC5cXGQrKSg/OmVbKy1dP1xcZCspPy9pLG9wZXJhdG9yOi9bPD5dPT98WyE9XT0/PT98LS0/fFxcK1xcKz98JiY/fFxcfFxcfD98Wz8qL35eJV0vLHB1bmN0dWF0aW9uOi9be31bXFxdOygpLC46XS99O1xyXG5QcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdD1QcmlzbS5sYW5ndWFnZXMuZXh0ZW5kKFwiY2xpa2VcIix7XCJjbGFzcy1uYW1lXCI6W1ByaXNtLmxhbmd1YWdlcy5jbGlrZVtcImNsYXNzLW5hbWVcIl0se3BhdHRlcm46LyhefFteJFxcd1xceEEwLVxcdUZGRkZdKSg/IVxccylbXyRBLVpcXHhBMC1cXHVGRkZGXSg/Oig/IVxccylbJFxcd1xceEEwLVxcdUZGRkZdKSooPz1cXC4oPzpjb25zdHJ1Y3Rvcnxwcm90b3R5cGUpKS8sbG9va2JlaGluZDohMH1dLGtleXdvcmQ6W3twYXR0ZXJuOi8oKD86XnxcXH0pXFxzKiljYXRjaFxcYi8sbG9va2JlaGluZDohMH0se3BhdHRlcm46LyhefFteLl18XFwuXFwuXFwuXFxzKilcXGIoPzphc3xhc3NlcnQoPz1cXHMqXFx7KXxhc3luYyg/PVxccyooPzpmdW5jdGlvblxcYnxcXCh8WyRcXHdcXHhBMC1cXHVGRkZGXXwkKSl8YXdhaXR8YnJlYWt8Y2FzZXxjbGFzc3xjb25zdHxjb250aW51ZXxkZWJ1Z2dlcnxkZWZhdWx0fGRlbGV0ZXxkb3xlbHNlfGVudW18ZXhwb3J0fGV4dGVuZHN8ZmluYWxseSg/PVxccyooPzpcXHt8JCkpfGZvcnxmcm9tKD89XFxzKig/OlsnXCJdfCQpKXxmdW5jdGlvbnwoPzpnZXR8c2V0KSg/PVxccyooPzpbI1xcWyRcXHdcXHhBMC1cXHVGRkZGXXwkKSl8aWZ8aW1wbGVtZW50c3xpbXBvcnR8aW58aW5zdGFuY2VvZnxpbnRlcmZhY2V8bGV0fG5ld3xudWxsfG9mfHBhY2thZ2V8cHJpdmF0ZXxwcm90ZWN0ZWR8cHVibGljfHJldHVybnxzdGF0aWN8c3VwZXJ8c3dpdGNofHRoaXN8dGhyb3d8dHJ5fHR5cGVvZnx1bmRlZmluZWR8dmFyfHZvaWR8d2hpbGV8d2l0aHx5aWVsZClcXGIvLGxvb2tiZWhpbmQ6ITB9XSxmdW5jdGlvbjovIz8oPyFcXHMpW18kYS16QS1aXFx4QTAtXFx1RkZGRl0oPzooPyFcXHMpWyRcXHdcXHhBMC1cXHVGRkZGXSkqKD89XFxzKig/OlxcLlxccyooPzphcHBseXxiaW5kfGNhbGwpXFxzKik/XFwoKS8sbnVtYmVyOntwYXR0ZXJuOlJlZ0V4cChcIihefFteXFxcXHckXSkoPzpOYU58SW5maW5pdHl8MFtiQl1bMDFdKyg/Ol9bMDFdKykqbj98MFtvT11bMC03XSsoPzpfWzAtN10rKSpuP3wwW3hYXVtcXFxcZEEtRmEtZl0rKD86X1tcXFxcZEEtRmEtZl0rKSpuP3xcXFxcZCsoPzpfXFxcXGQrKSpufCg/OlxcXFxkKyg/Ol9cXFxcZCspKig/OlxcXFwuKD86XFxcXGQrKD86X1xcXFxkKykqKT8pP3xcXFxcLlxcXFxkKyg/Ol9cXFxcZCspKikoPzpbRWVdWystXT9cXFxcZCsoPzpfXFxcXGQrKSopPykoPyFbXFxcXHckXSlcIiksbG9va2JlaGluZDohMH0sb3BlcmF0b3I6Ly0tfFxcK1xcK3xcXCpcXCo9P3w9PnwmJj0/fFxcfFxcfD0/fFshPV09PXw8PD0/fD4+Pj89P3xbLSsqLyUmfF4hPTw+XT0/fFxcLnszfXxcXD9cXD89P3xcXD9cXC4/fFt+Ol0vfSksUHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHRbXCJjbGFzcy1uYW1lXCJdWzBdLnBhdHRlcm49LyhcXGIoPzpjbGFzc3xleHRlbmRzfGltcGxlbWVudHN8aW5zdGFuY2VvZnxpbnRlcmZhY2V8bmV3KVxccyspW1xcdy5cXFxcXSsvLFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoXCJqYXZhc2NyaXB0XCIsXCJrZXl3b3JkXCIse3JlZ2V4OntwYXR0ZXJuOlJlZ0V4cChcIigoPzpefFteJFxcXFx3XFxcXHhBMC1cXFxcdUZGRkYuXFxcIidcXFxcXSlcXFxcc118XFxcXGIoPzpyZXR1cm58eWllbGQpKVxcXFxzKikvKD86KD86XFxcXFsoPzpbXlxcXFxdXFxcXFxcXFxcXHJcXG5dfFxcXFxcXFxcLikqXFxcXF18XFxcXFxcXFwufFteL1xcXFxcXFxcXFxcXFtcXHJcXG5dKSsvW2RnaW15dXNdezAsN318KD86XFxcXFsoPzpbXltcXFxcXVxcXFxcXFxcXFxyXFxuXXxcXFxcXFxcXC58XFxcXFsoPzpbXltcXFxcXVxcXFxcXFxcXFxyXFxuXXxcXFxcXFxcXC58XFxcXFsoPzpbXltcXFxcXVxcXFxcXFxcXFxyXFxuXXxcXFxcXFxcXC4pKlxcXFxdKSpcXFxcXSkqXFxcXF18XFxcXFxcXFwufFteL1xcXFxcXFxcXFxcXFtcXHJcXG5dKSsvW2RnaW15dXNdezAsN312W2RnaW15dXNdezAsN30pKD89KD86XFxcXHN8L1xcXFwqKD86W14qXXxcXFxcKig/IS8pKSpcXFxcKi8pKig/OiR8W1xcclxcbiwuOzp9KVxcXFxdXXwvLykpXCIpLGxvb2tiZWhpbmQ6ITAsZ3JlZWR5OiEwLGluc2lkZTp7XCJyZWdleC1zb3VyY2VcIjp7cGF0dGVybjovXihcXC8pW1xcc1xcU10rKD89XFwvW2Etel0qJCkvLGxvb2tiZWhpbmQ6ITAsYWxpYXM6XCJsYW5ndWFnZS1yZWdleFwiLGluc2lkZTpQcmlzbS5sYW5ndWFnZXMucmVnZXh9LFwicmVnZXgtZGVsaW1pdGVyXCI6L15cXC98XFwvJC8sXCJyZWdleC1mbGFnc1wiOi9eW2Etel0rJC99fSxcImZ1bmN0aW9uLXZhcmlhYmxlXCI6e3BhdHRlcm46LyM/KD8hXFxzKVtfJGEtekEtWlxceEEwLVxcdUZGRkZdKD86KD8hXFxzKVskXFx3XFx4QTAtXFx1RkZGRl0pKig/PVxccypbPTpdXFxzKig/OmFzeW5jXFxzKik/KD86XFxiZnVuY3Rpb25cXGJ8KD86XFwoKD86W14oKV18XFwoW14oKV0qXFwpKSpcXCl8KD8hXFxzKVtfJGEtekEtWlxceEEwLVxcdUZGRkZdKD86KD8hXFxzKVskXFx3XFx4QTAtXFx1RkZGRl0pKilcXHMqPT4pKS8sYWxpYXM6XCJmdW5jdGlvblwifSxwYXJhbWV0ZXI6W3twYXR0ZXJuOi8oZnVuY3Rpb24oPzpcXHMrKD8hXFxzKVtfJGEtekEtWlxceEEwLVxcdUZGRkZdKD86KD8hXFxzKVskXFx3XFx4QTAtXFx1RkZGRl0pKik/XFxzKlxcKFxccyopKD8hXFxzKSg/OlteKClcXHNdfFxccysoPyFbXFxzKV0pfFxcKFteKCldKlxcKSkrKD89XFxzKlxcKSkvLGxvb2tiZWhpbmQ6ITAsaW5zaWRlOlByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0fSx7cGF0dGVybjovKF58W14kXFx3XFx4QTAtXFx1RkZGRl0pKD8hXFxzKVtfJGEtelxceEEwLVxcdUZGRkZdKD86KD8hXFxzKVskXFx3XFx4QTAtXFx1RkZGRl0pKig/PVxccyo9PikvaSxsb29rYmVoaW5kOiEwLGluc2lkZTpQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdH0se3BhdHRlcm46LyhcXChcXHMqKSg/IVxccykoPzpbXigpXFxzXXxcXHMrKD8hW1xccyldKXxcXChbXigpXSpcXCkpKyg/PVxccypcXClcXHMqPT4pLyxsb29rYmVoaW5kOiEwLGluc2lkZTpQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdH0se3BhdHRlcm46LygoPzpcXGJ8XFxzfF4pKD8hKD86YXN8YXN5bmN8YXdhaXR8YnJlYWt8Y2FzZXxjYXRjaHxjbGFzc3xjb25zdHxjb250aW51ZXxkZWJ1Z2dlcnxkZWZhdWx0fGRlbGV0ZXxkb3xlbHNlfGVudW18ZXhwb3J0fGV4dGVuZHN8ZmluYWxseXxmb3J8ZnJvbXxmdW5jdGlvbnxnZXR8aWZ8aW1wbGVtZW50c3xpbXBvcnR8aW58aW5zdGFuY2VvZnxpbnRlcmZhY2V8bGV0fG5ld3xudWxsfG9mfHBhY2thZ2V8cHJpdmF0ZXxwcm90ZWN0ZWR8cHVibGljfHJldHVybnxzZXR8c3RhdGljfHN1cGVyfHN3aXRjaHx0aGlzfHRocm93fHRyeXx0eXBlb2Z8dW5kZWZpbmVkfHZhcnx2b2lkfHdoaWxlfHdpdGh8eWllbGQpKD8hWyRcXHdcXHhBMC1cXHVGRkZGXSkpKD86KD8hXFxzKVtfJGEtekEtWlxceEEwLVxcdUZGRkZdKD86KD8hXFxzKVskXFx3XFx4QTAtXFx1RkZGRl0pKlxccyopXFwoXFxzKnxcXF1cXHMqXFwoXFxzKikoPyFcXHMpKD86W14oKVxcc118XFxzKyg/IVtcXHMpXSl8XFwoW14oKV0qXFwpKSsoPz1cXHMqXFwpXFxzKlxceykvLGxvb2tiZWhpbmQ6ITAsaW5zaWRlOlByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0fV0sY29uc3RhbnQ6L1xcYltBLVpdKD86W0EtWl9dfFxcZHg/KSpcXGIvfSksUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZShcImphdmFzY3JpcHRcIixcInN0cmluZ1wiLHtoYXNoYmFuZzp7cGF0dGVybjovXiMhLiovLGdyZWVkeTohMCxhbGlhczpcImNvbW1lbnRcIn0sXCJ0ZW1wbGF0ZS1zdHJpbmdcIjp7cGF0dGVybjovYCg/OlxcXFxbXFxzXFxTXXxcXCRcXHsoPzpbXnt9XXxcXHsoPzpbXnt9XXxcXHtbXn1dKlxcfSkqXFx9KStcXH18KD8hXFwkXFx7KVteXFxcXGBdKSpgLyxncmVlZHk6ITAsaW5zaWRlOntcInRlbXBsYXRlLXB1bmN0dWF0aW9uXCI6e3BhdHRlcm46L15gfGAkLyxhbGlhczpcInN0cmluZ1wifSxpbnRlcnBvbGF0aW9uOntwYXR0ZXJuOi8oKD86XnxbXlxcXFxdKSg/OlxcXFx7Mn0pKilcXCRcXHsoPzpbXnt9XXxcXHsoPzpbXnt9XXxcXHtbXn1dKlxcfSkqXFx9KStcXH0vLGxvb2tiZWhpbmQ6ITAsaW5zaWRlOntcImludGVycG9sYXRpb24tcHVuY3R1YXRpb25cIjp7cGF0dGVybjovXlxcJFxce3xcXH0kLyxhbGlhczpcInB1bmN0dWF0aW9uXCJ9LHJlc3Q6UHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHR9fSxzdHJpbmc6L1tcXHNcXFNdKy99fSxcInN0cmluZy1wcm9wZXJ0eVwiOntwYXR0ZXJuOi8oKD86XnxbLHtdKVsgXFx0XSopKFtcIiddKSg/OlxcXFwoPzpcXHJcXG58W1xcc1xcU10pfCg/IVxcMilbXlxcXFxcXHJcXG5dKSpcXDIoPz1cXHMqOikvbSxsb29rYmVoaW5kOiEwLGdyZWVkeTohMCxhbGlhczpcInByb3BlcnR5XCJ9fSksUHJpc20ubGFuZ3VhZ2VzLmluc2VydEJlZm9yZShcImphdmFzY3JpcHRcIixcIm9wZXJhdG9yXCIse1wibGl0ZXJhbC1wcm9wZXJ0eVwiOntwYXR0ZXJuOi8oKD86XnxbLHtdKVsgXFx0XSopKD8hXFxzKVtfJGEtekEtWlxceEEwLVxcdUZGRkZdKD86KD8hXFxzKVskXFx3XFx4QTAtXFx1RkZGRl0pKig/PVxccyo6KS9tLGxvb2tiZWhpbmQ6ITAsYWxpYXM6XCJwcm9wZXJ0eVwifX0pLFByaXNtLmxhbmd1YWdlcy5tYXJrdXAmJihQcmlzbS5sYW5ndWFnZXMubWFya3VwLnRhZy5hZGRJbmxpbmVkKFwic2NyaXB0XCIsXCJqYXZhc2NyaXB0XCIpLFByaXNtLmxhbmd1YWdlcy5tYXJrdXAudGFnLmFkZEF0dHJpYnV0ZShcIm9uKD86YWJvcnR8Ymx1cnxjaGFuZ2V8Y2xpY2t8Y29tcG9zaXRpb24oPzplbmR8c3RhcnR8dXBkYXRlKXxkYmxjbGlja3xlcnJvcnxmb2N1cyg/OmlufG91dCk/fGtleSg/OmRvd258dXApfGxvYWR8bW91c2UoPzpkb3dufGVudGVyfGxlYXZlfG1vdmV8b3V0fG92ZXJ8dXApfHJlc2V0fHJlc2l6ZXxzY3JvbGx8c2VsZWN0fHNsb3RjaGFuZ2V8c3VibWl0fHVubG9hZHx3aGVlbClcIixcImphdmFzY3JpcHRcIikpLFByaXNtLmxhbmd1YWdlcy5qcz1QcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdDtcclxuUHJpc20ubGFuZ3VhZ2VzLmpzb249e3Byb3BlcnR5OntwYXR0ZXJuOi8oXnxbXlxcXFxdKVwiKD86XFxcXC58W15cXFxcXCJcXHJcXG5dKSpcIig/PVxccyo6KS8sbG9va2JlaGluZDohMCxncmVlZHk6ITB9LHN0cmluZzp7cGF0dGVybjovKF58W15cXFxcXSlcIig/OlxcXFwufFteXFxcXFwiXFxyXFxuXSkqXCIoPyFcXHMqOikvLGxvb2tiZWhpbmQ6ITAsZ3JlZWR5OiEwfSxjb21tZW50OntwYXR0ZXJuOi9cXC9cXC8uKnxcXC9cXCpbXFxzXFxTXSo/KD86XFwqXFwvfCQpLyxncmVlZHk6ITB9LG51bWJlcjovLT9cXGJcXGQrKD86XFwuXFxkKyk/KD86ZVsrLV0/XFxkKyk/XFxiL2kscHVuY3R1YXRpb246L1t7fVtcXF0sXS8sb3BlcmF0b3I6LzovLGJvb2xlYW46L1xcYig/OmZhbHNlfHRydWUpXFxiLyxudWxsOntwYXR0ZXJuOi9cXGJudWxsXFxiLyxhbGlhczpcImtleXdvcmRcIn19LFByaXNtLmxhbmd1YWdlcy53ZWJtYW5pZmVzdD1QcmlzbS5sYW5ndWFnZXMuanNvbjtcclxuIWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oZSxuKXtyZXR1cm5cIl9fX1wiK2UudG9VcHBlckNhc2UoKStuK1wiX19fXCJ9T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZS5sYW5ndWFnZXNbXCJtYXJrdXAtdGVtcGxhdGluZ1wiXT17fSx7YnVpbGRQbGFjZWhvbGRlcnM6e3ZhbHVlOmZ1bmN0aW9uKHQsYSxyLG8pe2lmKHQubGFuZ3VhZ2U9PT1hKXt2YXIgYz10LnRva2VuU3RhY2s9W107dC5jb2RlPXQuY29kZS5yZXBsYWNlKHIsKGZ1bmN0aW9uKGUpe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIG8mJiFvKGUpKXJldHVybiBlO2Zvcih2YXIgcixpPWMubGVuZ3RoOy0xIT09dC5jb2RlLmluZGV4T2Yocj1uKGEsaSkpOykrK2k7cmV0dXJuIGNbaV09ZSxyfSkpLHQuZ3JhbW1hcj1lLmxhbmd1YWdlcy5tYXJrdXB9fX0sdG9rZW5pemVQbGFjZWhvbGRlcnM6e3ZhbHVlOmZ1bmN0aW9uKHQsYSl7aWYodC5sYW5ndWFnZT09PWEmJnQudG9rZW5TdGFjayl7dC5ncmFtbWFyPWUubGFuZ3VhZ2VzW2FdO3ZhciByPTAsbz1PYmplY3Qua2V5cyh0LnRva2VuU3RhY2spOyFmdW5jdGlvbiBjKGkpe2Zvcih2YXIgdT0wO3U8aS5sZW5ndGgmJiEocj49by5sZW5ndGgpO3UrKyl7dmFyIGc9aVt1XTtpZihcInN0cmluZ1wiPT10eXBlb2YgZ3x8Zy5jb250ZW50JiZcInN0cmluZ1wiPT10eXBlb2YgZy5jb250ZW50KXt2YXIgbD1vW3JdLHM9dC50b2tlblN0YWNrW2xdLGY9XCJzdHJpbmdcIj09dHlwZW9mIGc/ZzpnLmNvbnRlbnQscD1uKGEsbCksaz1mLmluZGV4T2YocCk7aWYoaz4tMSl7KytyO3ZhciBtPWYuc3Vic3RyaW5nKDAsayksZD1uZXcgZS5Ub2tlbihhLGUudG9rZW5pemUocyx0LmdyYW1tYXIpLFwibGFuZ3VhZ2UtXCIrYSxzKSxoPWYuc3Vic3RyaW5nKGsrcC5sZW5ndGgpLHY9W107bSYmdi5wdXNoLmFwcGx5KHYsYyhbbV0pKSx2LnB1c2goZCksaCYmdi5wdXNoLmFwcGx5KHYsYyhbaF0pKSxcInN0cmluZ1wiPT10eXBlb2YgZz9pLnNwbGljZS5hcHBseShpLFt1LDFdLmNvbmNhdCh2KSk6Zy5jb250ZW50PXZ9fWVsc2UgZy5jb250ZW50JiZjKGcuY29udGVudCl9cmV0dXJuIGl9KHQudG9rZW5zKX19fX0pfShQcmlzbSk7XHJcbiFmdW5jdGlvbih0KXt2YXIgbj10LnV0aWwuY2xvbmUodC5sYW5ndWFnZXMuamF2YXNjcmlwdCksZT1cIig/OlxcXFx7PFM+KlxcXFwuezN9KD86W157fV18PEJSQUNFUz4pKlxcXFx9KVwiO2Z1bmN0aW9uIGEodCxuKXtyZXR1cm4gdD10LnJlcGxhY2UoLzxTPi9nLChmdW5jdGlvbigpe3JldHVyblwiKD86XFxcXHN8Ly8uKig/IS4pfC9cXFxcKig/OlteKl18XFxcXCooPyEvKSlcXFxcKi8pXCJ9KSkucmVwbGFjZSgvPEJSQUNFUz4vZywoZnVuY3Rpb24oKXtyZXR1cm5cIig/OlxcXFx7KD86XFxcXHsoPzpcXFxce1tee31dKlxcXFx9fFtee31dKSpcXFxcfXxbXnt9XSkqXFxcXH0pXCJ9KSkucmVwbGFjZSgvPFNQUkVBRD4vZywoZnVuY3Rpb24oKXtyZXR1cm4gZX0pKSxSZWdFeHAodCxuKX1lPWEoZSkuc291cmNlLHQubGFuZ3VhZ2VzLmpzeD10Lmxhbmd1YWdlcy5leHRlbmQoXCJtYXJrdXBcIixuKSx0Lmxhbmd1YWdlcy5qc3gudGFnLnBhdHRlcm49YShcIjwvPyg/OltcXFxcdy46LV0rKD86PFM+Kyg/OltcXFxcdy46JC1dKyg/Oj0oPzpcXFwiKD86XFxcXFxcXFxbXl18W15cXFxcXFxcXFxcXCJdKSpcXFwifCcoPzpcXFxcXFxcXFteXXxbXlxcXFxcXFxcJ10pKid8W15cXFxcc3snXFxcIi8+PV0rfDxCUkFDRVM+KSk/fDxTUFJFQUQ+KSkqPFM+Ki8/KT8+XCIpLHQubGFuZ3VhZ2VzLmpzeC50YWcuaW5zaWRlLnRhZy5wYXR0ZXJuPS9ePFxcLz9bXlxccz5cXC9dKi8sdC5sYW5ndWFnZXMuanN4LnRhZy5pbnNpZGVbXCJhdHRyLXZhbHVlXCJdLnBhdHRlcm49Lz0oPyFcXHspKD86XCIoPzpcXFxcW1xcc1xcU118W15cXFxcXCJdKSpcInwnKD86XFxcXFtcXHNcXFNdfFteXFxcXCddKSonfFteXFxzJ1wiPl0rKS8sdC5sYW5ndWFnZXMuanN4LnRhZy5pbnNpZGUudGFnLmluc2lkZVtcImNsYXNzLW5hbWVcIl09L15bQS1aXVxcdyooPzpcXC5bQS1aXVxcdyopKiQvLHQubGFuZ3VhZ2VzLmpzeC50YWcuaW5zaWRlLmNvbW1lbnQ9bi5jb21tZW50LHQubGFuZ3VhZ2VzLmluc2VydEJlZm9yZShcImluc2lkZVwiLFwiYXR0ci1uYW1lXCIse3NwcmVhZDp7cGF0dGVybjphKFwiPFNQUkVBRD5cIiksaW5zaWRlOnQubGFuZ3VhZ2VzLmpzeH19LHQubGFuZ3VhZ2VzLmpzeC50YWcpLHQubGFuZ3VhZ2VzLmluc2VydEJlZm9yZShcImluc2lkZVwiLFwic3BlY2lhbC1hdHRyXCIse3NjcmlwdDp7cGF0dGVybjphKFwiPTxCUkFDRVM+XCIpLGFsaWFzOlwibGFuZ3VhZ2UtamF2YXNjcmlwdFwiLGluc2lkZTp7XCJzY3JpcHQtcHVuY3R1YXRpb25cIjp7cGF0dGVybjovXj0oPz1cXHspLyxhbGlhczpcInB1bmN0dWF0aW9uXCJ9LHJlc3Q6dC5sYW5ndWFnZXMuanN4fX19LHQubGFuZ3VhZ2VzLmpzeC50YWcpO3ZhciBzPWZ1bmN0aW9uKHQpe3JldHVybiB0P1wic3RyaW5nXCI9PXR5cGVvZiB0P3Q6XCJzdHJpbmdcIj09dHlwZW9mIHQuY29udGVudD90LmNvbnRlbnQ6dC5jb250ZW50Lm1hcChzKS5qb2luKFwiXCIpOlwiXCJ9LGc9ZnVuY3Rpb24obil7Zm9yKHZhciBlPVtdLGE9MDthPG4ubGVuZ3RoO2ErKyl7dmFyIG89blthXSxpPSExO2lmKFwic3RyaW5nXCIhPXR5cGVvZiBvJiYoXCJ0YWdcIj09PW8udHlwZSYmby5jb250ZW50WzBdJiZcInRhZ1wiPT09by5jb250ZW50WzBdLnR5cGU/XCI8L1wiPT09by5jb250ZW50WzBdLmNvbnRlbnRbMF0uY29udGVudD9lLmxlbmd0aD4wJiZlW2UubGVuZ3RoLTFdLnRhZ05hbWU9PT1zKG8uY29udGVudFswXS5jb250ZW50WzFdKSYmZS5wb3AoKTpcIi8+XCI9PT1vLmNvbnRlbnRbby5jb250ZW50Lmxlbmd0aC0xXS5jb250ZW50fHxlLnB1c2goe3RhZ05hbWU6cyhvLmNvbnRlbnRbMF0uY29udGVudFsxXSksb3BlbmVkQnJhY2VzOjB9KTplLmxlbmd0aD4wJiZcInB1bmN0dWF0aW9uXCI9PT1vLnR5cGUmJlwie1wiPT09by5jb250ZW50P2VbZS5sZW5ndGgtMV0ub3BlbmVkQnJhY2VzKys6ZS5sZW5ndGg+MCYmZVtlLmxlbmd0aC0xXS5vcGVuZWRCcmFjZXM+MCYmXCJwdW5jdHVhdGlvblwiPT09by50eXBlJiZcIn1cIj09PW8uY29udGVudD9lW2UubGVuZ3RoLTFdLm9wZW5lZEJyYWNlcy0tOmk9ITApLChpfHxcInN0cmluZ1wiPT10eXBlb2YgbykmJmUubGVuZ3RoPjAmJjA9PT1lW2UubGVuZ3RoLTFdLm9wZW5lZEJyYWNlcyl7dmFyIHI9cyhvKTthPG4ubGVuZ3RoLTEmJihcInN0cmluZ1wiPT10eXBlb2YgblthKzFdfHxcInBsYWluLXRleHRcIj09PW5bYSsxXS50eXBlKSYmKHIrPXMoblthKzFdKSxuLnNwbGljZShhKzEsMSkpLGE+MCYmKFwic3RyaW5nXCI9PXR5cGVvZiBuW2EtMV18fFwicGxhaW4tdGV4dFwiPT09blthLTFdLnR5cGUpJiYocj1zKG5bYS0xXSkrcixuLnNwbGljZShhLTEsMSksYS0tKSxuW2FdPW5ldyB0LlRva2VuKFwicGxhaW4tdGV4dFwiLHIsbnVsbCxyKX1vLmNvbnRlbnQmJlwic3RyaW5nXCIhPXR5cGVvZiBvLmNvbnRlbnQmJmcoby5jb250ZW50KX19O3QuaG9va3MuYWRkKFwiYWZ0ZXItdG9rZW5pemVcIiwoZnVuY3Rpb24odCl7XCJqc3hcIiE9PXQubGFuZ3VhZ2UmJlwidHN4XCIhPT10Lmxhbmd1YWdlfHxnKHQudG9rZW5zKX0pKX0oUHJpc20pO1xyXG4hZnVuY3Rpb24oZSl7ZS5sYW5ndWFnZXMudHlwZXNjcmlwdD1lLmxhbmd1YWdlcy5leHRlbmQoXCJqYXZhc2NyaXB0XCIse1wiY2xhc3MtbmFtZVwiOntwYXR0ZXJuOi8oXFxiKD86Y2xhc3N8ZXh0ZW5kc3xpbXBsZW1lbnRzfGluc3RhbmNlb2Z8aW50ZXJmYWNlfG5ld3x0eXBlKVxccyspKD8ha2V5b2ZcXGIpKD8hXFxzKVtfJGEtekEtWlxceEEwLVxcdUZGRkZdKD86KD8hXFxzKVskXFx3XFx4QTAtXFx1RkZGRl0pKig/Olxccyo8KD86W148Pl18PCg/OltePD5dfDxbXjw+XSo+KSo+KSo+KT8vLGxvb2tiZWhpbmQ6ITAsZ3JlZWR5OiEwLGluc2lkZTpudWxsfSxidWlsdGluOi9cXGIoPzpBcnJheXxGdW5jdGlvbnxQcm9taXNlfGFueXxib29sZWFufGNvbnNvbGV8bmV2ZXJ8bnVtYmVyfHN0cmluZ3xzeW1ib2x8dW5rbm93bilcXGIvfSksZS5sYW5ndWFnZXMudHlwZXNjcmlwdC5rZXl3b3JkLnB1c2goL1xcYig/OmFic3RyYWN0fGRlY2xhcmV8aXN8a2V5b2Z8cmVhZG9ubHl8cmVxdWlyZSlcXGIvLC9cXGIoPzphc3NlcnRzfGluZmVyfGludGVyZmFjZXxtb2R1bGV8bmFtZXNwYWNlfHR5cGUpXFxiKD89XFxzKig/Olt7XyRhLXpBLVpcXHhBMC1cXHVGRkZGXXwkKSkvLC9cXGJ0eXBlXFxiKD89XFxzKig/OltcXHsqXXwkKSkvKSxkZWxldGUgZS5sYW5ndWFnZXMudHlwZXNjcmlwdC5wYXJhbWV0ZXIsZGVsZXRlIGUubGFuZ3VhZ2VzLnR5cGVzY3JpcHRbXCJsaXRlcmFsLXByb3BlcnR5XCJdO3ZhciBzPWUubGFuZ3VhZ2VzLmV4dGVuZChcInR5cGVzY3JpcHRcIix7fSk7ZGVsZXRlIHNbXCJjbGFzcy1uYW1lXCJdLGUubGFuZ3VhZ2VzLnR5cGVzY3JpcHRbXCJjbGFzcy1uYW1lXCJdLmluc2lkZT1zLGUubGFuZ3VhZ2VzLmluc2VydEJlZm9yZShcInR5cGVzY3JpcHRcIixcImZ1bmN0aW9uXCIse2RlY29yYXRvcjp7cGF0dGVybjovQFskXFx3XFx4QTAtXFx1RkZGRl0rLyxpbnNpZGU6e2F0OntwYXR0ZXJuOi9eQC8sYWxpYXM6XCJvcGVyYXRvclwifSxmdW5jdGlvbjovXltcXHNcXFNdKy99fSxcImdlbmVyaWMtZnVuY3Rpb25cIjp7cGF0dGVybjovIz8oPyFcXHMpW18kYS16QS1aXFx4QTAtXFx1RkZGRl0oPzooPyFcXHMpWyRcXHdcXHhBMC1cXHVGRkZGXSkqXFxzKjwoPzpbXjw+XXw8KD86W148Pl18PFtePD5dKj4pKj4pKj4oPz1cXHMqXFwoKS8sZ3JlZWR5OiEwLGluc2lkZTp7ZnVuY3Rpb246L14jPyg/IVxccylbXyRhLXpBLVpcXHhBMC1cXHVGRkZGXSg/Oig/IVxccylbJFxcd1xceEEwLVxcdUZGRkZdKSovLGdlbmVyaWM6e3BhdHRlcm46LzxbXFxzXFxTXSsvLGFsaWFzOlwiY2xhc3MtbmFtZVwiLGluc2lkZTpzfX19fSksZS5sYW5ndWFnZXMudHM9ZS5sYW5ndWFnZXMudHlwZXNjcmlwdH0oUHJpc20pO1xyXG4hZnVuY3Rpb24oZSl7dmFyIGE9ZS51dGlsLmNsb25lKGUubGFuZ3VhZ2VzLnR5cGVzY3JpcHQpO2UubGFuZ3VhZ2VzLnRzeD1lLmxhbmd1YWdlcy5leHRlbmQoXCJqc3hcIixhKSxkZWxldGUgZS5sYW5ndWFnZXMudHN4LnBhcmFtZXRlcixkZWxldGUgZS5sYW5ndWFnZXMudHN4W1wibGl0ZXJhbC1wcm9wZXJ0eVwiXTt2YXIgdD1lLmxhbmd1YWdlcy50c3gudGFnO3QucGF0dGVybj1SZWdFeHAoXCIoXnxbXlxcXFx3JF18KD89PC8pKSg/OlwiK3QucGF0dGVybi5zb3VyY2UrXCIpXCIsdC5wYXR0ZXJuLmZsYWdzKSx0Lmxvb2tiZWhpbmQ9ITB9KFByaXNtKTtcclxuIWZ1bmN0aW9uKCl7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIFByaXNtJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgZG9jdW1lbnQpe3ZhciB0PVtdO28oKGZ1bmN0aW9uKHQpe2lmKHQmJnQubWV0YSYmdC5kYXRhKXtpZih0Lm1ldGEuc3RhdHVzJiZ0Lm1ldGEuc3RhdHVzPj00MDApcmV0dXJuXCJFcnJvcjogXCIrKHQuZGF0YS5tZXNzYWdlfHx0Lm1ldGEuc3RhdHVzKTtpZihcInN0cmluZ1wiPT10eXBlb2YgdC5kYXRhLmNvbnRlbnQpcmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgYXRvYj9hdG9iKHQuZGF0YS5jb250ZW50LnJlcGxhY2UoL1xccy9nLFwiXCIpKTpcIllvdXIgYnJvd3NlciBjYW5ub3QgZGVjb2RlIGJhc2U2NFwifXJldHVybiBudWxsfSksXCJnaXRodWJcIiksbygoZnVuY3Rpb24odCxlKXtpZih0JiZ0Lm1ldGEmJnQuZGF0YSYmdC5kYXRhLmZpbGVzKXtpZih0Lm1ldGEuc3RhdHVzJiZ0Lm1ldGEuc3RhdHVzPj00MDApcmV0dXJuXCJFcnJvcjogXCIrKHQuZGF0YS5tZXNzYWdlfHx0Lm1ldGEuc3RhdHVzKTt2YXIgbj10LmRhdGEuZmlsZXMsYT1lLmdldEF0dHJpYnV0ZShcImRhdGEtZmlsZW5hbWVcIik7aWYobnVsbD09YSlmb3IodmFyIHIgaW4gbilpZihuLmhhc093blByb3BlcnR5KHIpKXthPXI7YnJlYWt9cmV0dXJuIHZvaWQgMCE9PW5bYV0/blthXS5jb250ZW50OlwiRXJyb3I6IHVua25vd24gb3IgbWlzc2luZyBnaXN0IGZpbGUgXCIrYX1yZXR1cm4gbnVsbH0pLFwiZ2lzdFwiKSxvKChmdW5jdGlvbih0KXtyZXR1cm4gdCYmdC5ub2RlJiZcInN0cmluZ1wiPT10eXBlb2YgdC5kYXRhP3QuZGF0YTpudWxsfSksXCJiaXRidWNrZXRcIik7dmFyIGU9MCxuPVwiZGF0YS1qc29ucC1zdGF0dXNcIixhPVwiZmFpbGVkXCIscj0ncHJlW2RhdGEtanNvbnBdOm5vdChbZGF0YS1qc29ucC1zdGF0dXM9XCJsb2FkZWRcIl0pOm5vdChbZGF0YS1qc29ucC1zdGF0dXM9XCJsb2FkaW5nXCJdKSc7UHJpc20uaG9va3MuYWRkKFwiYmVmb3JlLWhpZ2hsaWdodGFsbFwiLChmdW5jdGlvbih0KXt0LnNlbGVjdG9yKz1cIiwgXCIrcn0pKSxQcmlzbS5ob29rcy5hZGQoXCJiZWZvcmUtc2FuaXR5LWNoZWNrXCIsKGZ1bmN0aW9uKG8pe3ZhciBpLHU9by5lbGVtZW50O2lmKHUubWF0Y2hlcyhyKSl7by5jb2RlPVwiXCIsdS5zZXRBdHRyaWJ1dGUobixcImxvYWRpbmdcIik7dmFyIHM9dS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiQ09ERVwiKSk7cy50ZXh0Q29udGVudD1cIkxvYWRpbmfigKZcIjt2YXIgZD1vLmxhbmd1YWdlO3MuY2xhc3NOYW1lPVwibGFuZ3VhZ2UtXCIrZDt2YXIgZj1QcmlzbS5wbHVnaW5zLmF1dG9sb2FkZXI7ZiYmZi5sb2FkTGFuZ3VhZ2VzKGQpO3ZhciBsPXUuZ2V0QXR0cmlidXRlKFwiZGF0YS1hZGFwdGVyXCIpLGM9bnVsbDtpZihsKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiB3aW5kb3dbbF0pcmV0dXJuIHUuc2V0QXR0cmlidXRlKG4sYSksdm9pZChzLnRleHRDb250ZW50PShpPWwsJ+KcliBFcnJvcjogSlNPTlAgYWRhcHRlciBmdW5jdGlvbiBcIicraStcIlxcXCIgZG9lc24ndCBleGlzdFwiKSk7Yz13aW5kb3dbbF19dmFyIHA9dS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWpzb25wXCIpOyFmdW5jdGlvbihyLG8saSxkKXt2YXIgZj1cInByaXNtanNvbnBcIitlKyssbD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtsLmhyZWY9cixsLmhyZWYrPShsLnNlYXJjaD9cIiZcIjpcIj9cIikrKG98fFwiY2FsbGJhY2tcIikrXCI9XCIrZjt2YXIgcD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO3Auc3JjPWwuaHJlZixwLm9uZXJyb3I9ZnVuY3Rpb24oKXtnKCksZCgpfTt2YXIgbT1zZXRUaW1lb3V0KChmdW5jdGlvbigpe2coKSxkKCl9KSxQcmlzbS5wbHVnaW5zLmpzb25waGlnaGxpZ2h0LnRpbWVvdXQpO2Z1bmN0aW9uIGcoKXtjbGVhclRpbWVvdXQobSksZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZChwKSxkZWxldGUgd2luZG93W2ZdfXdpbmRvd1tmXT1mdW5jdGlvbihlKXtnKCksZnVuY3Rpb24oZSl7dmFyIHI9bnVsbDtpZihjKXI9YyhlLHUpO2Vsc2UgZm9yKHZhciBvPTAsaT10Lmxlbmd0aDtvPGkmJm51bGw9PT0ocj10W29dLmFkYXB0ZXIoZSx1KSk7bysrKTtudWxsPT09cj8odS5zZXRBdHRyaWJ1dGUobixhKSxzLnRleHRDb250ZW50PVwi4pyWIEVycm9yOiBDYW5ub3QgcGFyc2UgcmVzcG9uc2UgKHBlcmhhcHMgeW91IG5lZWQgYW4gYWRhcHRlciBmdW5jdGlvbj8pXCIpOih1LnNldEF0dHJpYnV0ZShuLFwibG9hZGVkXCIpLHMudGV4dENvbnRlbnQ9cixQcmlzbS5oaWdobGlnaHRFbGVtZW50KHMpKX0oZSl9LGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQocCl9KHAsdS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNhbGxiYWNrXCIpLDAsKGZ1bmN0aW9uKCl7dS5zZXRBdHRyaWJ1dGUobixhKSxzLnRleHRDb250ZW50PVwi4pyWIEVycm9yOiBUaW1lb3V0IGxvYWRpbmcgXCIrcH0pKX19KSksUHJpc20ucGx1Z2lucy5qc29ucGhpZ2hsaWdodD17dGltZW91dDo1ZTMscmVnaXN0ZXJBZGFwdGVyOm8scmVtb3ZlQWRhcHRlcjpmdW5jdGlvbihlKXtpZihcInN0cmluZ1wiPT10eXBlb2YgZSYmKGU9aShlKSksXCJmdW5jdGlvblwiPT10eXBlb2YgZSl7dmFyIG49dC5maW5kSW5kZXgoKGZ1bmN0aW9uKHQpe3JldHVybiB0LmFkYXB0ZXI9PT1lfSkpO24+PTAmJnQuc3BsaWNlKG4sMSl9fSxoaWdobGlnaHQ6ZnVuY3Rpb24odCl7Zm9yKHZhciBlLG49KHR8fGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKHIpLGE9MDtlPW5bYSsrXTspUHJpc20uaGlnaGxpZ2h0RWxlbWVudChlKX19fWZ1bmN0aW9uIG8oZSxuKXtuPW58fGUubmFtZSxcImZ1bmN0aW9uXCIhPXR5cGVvZiBlfHxpKGUpfHxpKG4pfHx0LnB1c2goe2FkYXB0ZXI6ZSxuYW1lOm59KX1mdW5jdGlvbiBpKGUpe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGUpe2Zvcih2YXIgbj0wO2E9dFtuKytdOylpZihhLmFkYXB0ZXIudmFsdWVPZigpPT09ZS52YWx1ZU9mKCkpcmV0dXJuIGEuYWRhcHRlcn1lbHNlIGlmKFwic3RyaW5nXCI9PXR5cGVvZiBlKXt2YXIgYTtmb3Iobj0wO2E9dFtuKytdOylpZihhLm5hbWU9PT1lKXJldHVybiBhLmFkYXB0ZXJ9cmV0dXJuIG51bGx9fSgpO1xyXG4iLCIvKiDlpITnkIbliqDnspflhoXlrrkgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmdlQm9sZChyKXtcclxuICAgIGNvbnN0IHN0YXJ0ID0gci5zdGFydE9mZnNldFxyXG4gICAgY29uc3QgZW5kID0gci5lbmRPZmZzZXRcclxuICAgIGNvbnN0IHQgPSByLnN0YXJ0Q29udGFpbmVyLndob2xlVGV4dFxyXG4gICAgY29uc3QgaW5uZXIgPSB0LnNsaWNlKHN0YXJ0LGVuZCk/dC5zbGljZShzdGFydCxlbmQpOifliqDnspfmoLflvI8nXHJcbiAgICBpZihyLnN0YXJ0Q29udGFpbmVyID09IHIuZW5kQ29udGFpbmVyKXtcclxuICAgICAgICBjb25zdCByZXN1bHRUZXh0ID0gdC5zbGljZSgwLHN0YXJ0KSsnKionK2lubmVyKycqKicrdC5zbGljZShlbmQsdC5sZW5ndGgpXHJcbiAgICAgICAgci5zdGFydENvbnRhaW5lci5ub2RlVmFsdWUgPSByZXN1bHRUZXh0XHJcbiAgICAgICAgci5zZXRTdGFydChyLnN0YXJ0Q29udGFpbmVyLHN0YXJ0KVxyXG4gICAgICAgIHIuc2V0RW5kKHIuc3RhcnRDb250YWluZXIsc3RhcnQrNCtpbm5lci5sZW5ndGgpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBjb25zdCBldCA9IHIuZW5kQ29udGFpbmVyLndob2xlVGV4dFxyXG4gICAgICAgIHIuc3RhcnRDb250YWluZXIubm9kZVZhbHVlID0gdC5zbGljZSgwLHIuc3RhcnRPZmZzZXQpICsgJyoqJyArIHQuc2xpY2Uoci5zdGFydE9mZnNldCx0Lmxlbmd0aClcclxuICAgICAgICByLmVuZENvbnRhaW5lci5ub2RlVmFsdWUgPSBldC5zbGljZSgwLHIuZW5kT2Zmc2V0KSArICcqKicgKyBldC5zbGljZShyLmVuZE9mZnNldCxldC5sZW5ndGgpXHJcbiAgICAgICAgci5zZXRTdGFydChyLnN0YXJ0Q29udGFpbmVyLHN0YXJ0KVxyXG4gICAgICAgIHIuc2V0RW5kKHIuZW5kQ29udGFpbmVyLGVuZCsyKVxyXG4gICAgfSBcclxufVxyXG5cclxuLyog5aSE55CG5pac5L2T5YaF5a65ICovXHJcbmV4cG9ydCBmdW5jdGlvbiByYW5nZUl0YWxpY3Mocil7XHJcbiAgICBjb25zdCBzdGFydCA9IHIuc3RhcnRPZmZzZXRcclxuICAgIGNvbnN0IGVuZCA9IHIuZW5kT2Zmc2V0XHJcbiAgICBjb25zdCB0ID0gci5zdGFydENvbnRhaW5lci53aG9sZVRleHRcclxuICAgIGNvbnN0IGlubmVyID0gdC5zbGljZShzdGFydCxlbmQpP3Quc2xpY2Uoc3RhcnQsZW5kKTon5pac5L2T5qC35byPJ1xyXG4gICAgaWYoci5zdGFydENvbnRhaW5lciA9PSByLmVuZENvbnRhaW5lcil7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0VGV4dCA9IHQuc2xpY2UoMCxzdGFydCkrJyonK2lubmVyKycqJyt0LnNsaWNlKGVuZCx0Lmxlbmd0aClcclxuICAgICAgICByLnN0YXJ0Q29udGFpbmVyLm5vZGVWYWx1ZSA9IHJlc3VsdFRleHRcclxuICAgICAgICByLnNldFN0YXJ0KHIuc3RhcnRDb250YWluZXIsc3RhcnQpXHJcbiAgICAgICAgci5zZXRFbmQoci5zdGFydENvbnRhaW5lcixzdGFydCsyK2lubmVyLmxlbmd0aClcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGNvbnN0IGV0ID0gci5lbmRDb250YWluZXIud2hvbGVUZXh0XHJcbiAgICAgICAgci5zdGFydENvbnRhaW5lci5ub2RlVmFsdWUgPSB0LnNsaWNlKDAsci5zdGFydE9mZnNldCkgKyAnKicgKyB0LnNsaWNlKHIuc3RhcnRPZmZzZXQsdC5sZW5ndGgpXHJcbiAgICAgICAgci5lbmRDb250YWluZXIubm9kZVZhbHVlID0gZXQuc2xpY2UoMCxyLmVuZE9mZnNldCkgKyAnKicgKyBldC5zbGljZShyLmVuZE9mZnNldCxldC5sZW5ndGgpXHJcbiAgICAgICAgci5zZXRTdGFydChyLnN0YXJ0Q29udGFpbmVyLHN0YXJ0KVxyXG4gICAgICAgIHIuc2V0RW5kKHIuZW5kQ29udGFpbmVyLGVuZCsxKVxyXG4gICAgfSBcclxufVxyXG5cclxuLyog5aSE55CG5Yig6Zmk57q/ICovXHJcbmV4cG9ydCBmdW5jdGlvbiByYW5nZURlbChyKXtcclxuICAgIGNvbnN0IHN0YXJ0ID0gci5zdGFydE9mZnNldFxyXG4gICAgY29uc3QgZW5kID0gci5lbmRPZmZzZXRcclxuICAgIGNvbnN0IHQgPSByLnN0YXJ0Q29udGFpbmVyLndob2xlVGV4dFxyXG4gICAgY29uc3QgaW5uZXIgPSB0LnNsaWNlKHN0YXJ0LGVuZCk/dC5zbGljZShzdGFydCxlbmQpOifliKDpmaTnur8nXHJcbiAgICBpZihyLnN0YXJ0Q29udGFpbmVyID09IHIuZW5kQ29udGFpbmVyKXtcclxuICAgICAgICBjb25zdCByZXN1bHRUZXh0ID0gdC5zbGljZSgwLHN0YXJ0KSsnfn4nK2lubmVyKyd+ficrdC5zbGljZShlbmQsdC5sZW5ndGgpXHJcbiAgICAgICAgci5zdGFydENvbnRhaW5lci5ub2RlVmFsdWUgPSByZXN1bHRUZXh0XHJcbiAgICAgICAgci5zZXRTdGFydChyLnN0YXJ0Q29udGFpbmVyLHN0YXJ0KVxyXG4gICAgICAgIHIuc2V0RW5kKHIuc3RhcnRDb250YWluZXIsc3RhcnQrNCtpbm5lci5sZW5ndGgpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBjb25zdCBldCA9IHIuZW5kQ29udGFpbmVyLndob2xlVGV4dFxyXG4gICAgICAgIHIuc3RhcnRDb250YWluZXIubm9kZVZhbHVlID0gdC5zbGljZSgwLHIuc3RhcnRPZmZzZXQpICsgJ35+JyArIHQuc2xpY2Uoci5zdGFydE9mZnNldCx0Lmxlbmd0aClcclxuICAgICAgICByLmVuZENvbnRhaW5lci5ub2RlVmFsdWUgPSBldC5zbGljZSgwLHIuZW5kT2Zmc2V0KSArICd+ficgKyBldC5zbGljZShyLmVuZE9mZnNldCxldC5sZW5ndGgpXHJcbiAgICAgICAgci5zZXRTdGFydChyLnN0YXJ0Q29udGFpbmVyLHN0YXJ0KzIpXHJcbiAgICAgICAgci5zZXRFbmQoci5lbmRDb250YWluZXIsZW5kKVxyXG4gICAgfVxyXG59XHJcblxyXG4vKiDlpITnkIbmoIforrAgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmdlQ2l0ZShyKXtcclxuICAgIGNvbnN0IHN0YXJ0ID0gci5zdGFydE9mZnNldFxyXG4gICAgY29uc3QgZW5kID0gci5lbmRPZmZzZXRcclxuICAgIGNvbnN0IHQgPSByLnN0YXJ0Q29udGFpbmVyLndob2xlVGV4dFxyXG4gICAgY29uc3QgaW5uZXIgPSB0LnNsaWNlKHN0YXJ0LGVuZCk/dC5zbGljZShzdGFydCxlbmQpOifliKDpmaTnur8nXHJcbiAgICBpZihyLnN0YXJ0Q29udGFpbmVyID09IHIuZW5kQ29udGFpbmVyKXtcclxuICAgICAgICBjb25zdCByZXN1bHRUZXh0ID0gdC5zbGljZSgwLHN0YXJ0KSsnYCcraW5uZXIrJ2AnK3Quc2xpY2UoZW5kLHQubGVuZ3RoKVxyXG4gICAgICAgIHIuc3RhcnRDb250YWluZXIubm9kZVZhbHVlID0gcmVzdWx0VGV4dFxyXG4gICAgICAgIHIuc2V0U3RhcnQoci5zdGFydENvbnRhaW5lcixzdGFydClcclxuICAgICAgICByLnNldEVuZChyLnN0YXJ0Q29udGFpbmVyLHN0YXJ0KzIraW5uZXIubGVuZ3RoKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgY29uc3QgZXQgPSByLmVuZENvbnRhaW5lci53aG9sZVRleHRcclxuICAgICAgICByLnN0YXJ0Q29udGFpbmVyLm5vZGVWYWx1ZSA9IHQuc2xpY2UoMCxyLnN0YXJ0T2Zmc2V0KSArICdgJyArIHQuc2xpY2Uoci5zdGFydE9mZnNldCx0Lmxlbmd0aClcclxuICAgICAgICByLmVuZENvbnRhaW5lci5ub2RlVmFsdWUgPSBldC5zbGljZSgwLHIuZW5kT2Zmc2V0KSArICdgJyArIGV0LnNsaWNlKHIuZW5kT2Zmc2V0LGV0Lmxlbmd0aClcclxuICAgICAgICByLnNldFN0YXJ0KHIuc3RhcnRDb250YWluZXIsc3RhcnQrMSlcclxuICAgICAgICByLnNldEVuZChyLmVuZENvbnRhaW5lcixlbmQpXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qIOWkhOeQhuS4gOe6p+agh+mimCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2VIMShyKXtcclxuICAgIGlmKHIuY29sbGFwc2VkKXtcclxuICAgICAgICBjb25zdCBzdHIgPSBuZXcgVGV4dCgnIyDkuIDnuqfmoIfpopgnKVxyXG4gICAgICAgIHIuaW5zZXJ0Tm9kZShzdHIpXHJcbiAgICAgICAgci5zZXRTdGFydChzdHIsc3RyLmxlbmd0aClcclxuICAgICAgICByLnNldEVuZChzdHIsc3RyLmxlbmd0aClcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGNvbnN0IHN0ciA9IG5ldyBUZXh0KCdcXG4jICcrU3RyaW5nKHIpLnJlcGxhY2UoL1xcbi9nLCcnKStcIlxcblwiKVxyXG4gICAgICAgIHIuZGVsZXRlQ29udGVudHMoKVxyXG4gICAgICAgIHIuaW5zZXJ0Tm9kZShzdHIpXHJcbiAgICAgICAgci5zZXRTdGFydChzdHIsc3RyLmxlbmd0aC0uOSlcclxuICAgICAgICByLnNldEVuZChzdHIsc3RyLmxlbmd0aC0uOSlcclxuICAgIH1cclxufVxyXG5cclxuLyog5aSE55CG5LqM57qn5qCH6aKYICovXHJcbmV4cG9ydCBmdW5jdGlvbiByYW5nZUgyKHIpe1xyXG4gICAgaWYoci5jb2xsYXBzZWQpe1xyXG4gICAgICAgIGNvbnN0IHN0ciA9IG5ldyBUZXh0KCcjIyDkuoznuqfmoIfpopgnKVxyXG4gICAgICAgIHIuaW5zZXJ0Tm9kZShzdHIpXHJcbiAgICAgICAgci5zZXRTdGFydChzdHIsc3RyLmxlbmd0aClcclxuICAgICAgICByLnNldEVuZChzdHIsc3RyLmxlbmd0aClcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGNvbnN0IHN0ciA9IG5ldyBUZXh0KCdcXG4jIyAnK1N0cmluZyhyKS5yZXBsYWNlKC9cXG4vZywnJykrXCJcXG5cIilcclxuICAgICAgICByLmRlbGV0ZUNvbnRlbnRzKClcclxuICAgICAgICByLmluc2VydE5vZGUoc3RyKVxyXG4gICAgICAgIHIuc2V0U3RhcnQoc3RyLHN0ci5sZW5ndGgtLjkpXHJcbiAgICAgICAgci5zZXRFbmQoc3RyLHN0ci5sZW5ndGgtLjkpXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qIOWkhOeQhuWIhuWJsue6vyAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2VIcihyKXtcclxuICAgIGlmKHIuY29sbGFwc2VkKXtcclxuICAgICAgICBjb25zdCBzdHIgPSBuZXcgVGV4dCgnXFxuKioqXFxuJylcclxuICAgICAgICByLmluc2VydE5vZGUoc3RyKVxyXG4gICAgICAgIHIuc2V0U3RhcnQoc3RyLHN0ci5sZW5ndGgpXHJcbiAgICAgICAgci5zZXRFbmQoc3RyLHN0ci5sZW5ndGgpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBjb25zdCBzdHIgPSBuZXcgVGV4dCgnXFxuKioqXFxuJylcclxuICAgICAgICByLmRlbGV0ZUNvbnRlbnRzKClcclxuICAgICAgICByLmluc2VydE5vZGUoc3RyKVxyXG4gICAgICAgIHIuc2V0U3RhcnQoc3RyLHN0ci5sZW5ndGgtLjkpXHJcbiAgICAgICAgci5zZXRFbmQoc3RyLHN0ci5sZW5ndGgtLjkpXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qIOWkhOeQhui2hemTvuaOpSAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2VMaW5rKHIpe1xyXG4gICAgaWYoci5jb2xsYXBzZWQpe1xyXG4gICAgICAgIGNvbnN0IHN0ciA9IG5ldyBUZXh0KCdb6L+Z5piv6LaF6ZO+5o6lXShodHRwczovL3d3dy55ZWhnZXIuY29tKScpXHJcbiAgICAgICAgci5pbnNlcnROb2RlKHN0cilcclxuICAgICAgICByLnNldFN0YXJ0KHN0ciwnW+i/meaYr+i2hemTvuaOpV0nLmxlbmd0aCsxKVxyXG4gICAgICAgIHIuc2V0RW5kKHN0cixzdHIubGVuZ3RoLTEpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBjb25zdCBzdHIgPSBuZXcgVGV4dCgnW+i/meaYr+i2hemTvuaOpV0oaHR0cHM6Ly93d3cueWVoZ2VyLmNvbSknKVxyXG4gICAgICAgIHIuZGVsZXRlQ29udGVudHMoKVxyXG4gICAgICAgIHIuaW5zZXJ0Tm9kZShzdHIpXHJcbiAgICAgICAgci5zZXRTdGFydChzdHIsJ1vov5nmmK/otoXpk77mjqVdJy5sZW5ndGgrMSlcclxuICAgICAgICByLnNldEVuZChzdHIsc3RyLmxlbmd0aC0xKVxyXG4gICAgfVxyXG59XHJcblxyXG4vKiDlpITnkIbmnInluo/liJfooaggKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmdlVWwocil7XHJcbiAgICBpZihyLmNvbGxhcHNlZCl7XHJcbiAgICAgICAgY29uc3Qgc3RyID0gbmV3IFRleHQoJy0g5peg5bqP5YiX6KGoJylcclxuICAgICAgICByLmluc2VydE5vZGUoc3RyKVxyXG4gICAgICAgIHIuc2V0U3RhcnQoc3RyLHN0ci5sZW5ndGgpXHJcbiAgICAgICAgci5zZXRFbmQoc3RyLHN0ci5sZW5ndGgpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBjb25zdCBzdHIgPSBuZXcgVGV4dCgnXFxuLSAnK1N0cmluZyhyKS5yZXBsYWNlKC9cXG4vZywnJykrXCJcXG5cIilcclxuICAgICAgICByLmRlbGV0ZUNvbnRlbnRzKClcclxuICAgICAgICByLmluc2VydE5vZGUoc3RyKVxyXG4gICAgICAgIHIuc2V0U3RhcnQoc3RyLHN0ci5sZW5ndGgtLjkpXHJcbiAgICAgICAgci5zZXRFbmQoc3RyLHN0ci5sZW5ndGgtLjkpXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qIOWkhOeQhuaXoOW6j+WIl+ihqCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2VPbChyKXtcclxuICAgIGlmKHIuY29sbGFwc2VkKXtcclxuICAgICAgICBjb25zdCBzdHIgPSBuZXcgVGV4dCgnMS4g5pyJ5bqP5YiX6KGoJylcclxuICAgICAgICByLmluc2VydE5vZGUoc3RyKVxyXG4gICAgICAgIHIuc2V0U3RhcnQoc3RyLHN0ci5sZW5ndGgpXHJcbiAgICAgICAgci5zZXRFbmQoc3RyLHN0ci5sZW5ndGgpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBjb25zdCBzdHIgPSBuZXcgVGV4dCgnXFxuMS4gJytTdHJpbmcocikucmVwbGFjZSgvXFxuL2csJycpK1wiXFxuXCIpXHJcbiAgICAgICAgci5kZWxldGVDb250ZW50cygpXHJcbiAgICAgICAgci5pbnNlcnROb2RlKHN0cilcclxuICAgICAgICByLnNldFN0YXJ0KHN0cixzdHIubGVuZ3RoLS45KVxyXG4gICAgICAgIHIuc2V0RW5kKHN0cixzdHIubGVuZ3RoLS45KVxyXG4gICAgfVxyXG59XHJcblxyXG4vKiDlpITnkIblm77niYcgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmdlSW1nKHIpe1xyXG4gICAgaWYoci5jb2xsYXBzZWQpe1xyXG4gICAgICAgIGNvbnN0IHN0ciA9IG5ldyBUZXh0KCchW+i/meaYr+WbvueJh10oaHR0cHM6Ly9wMy1qdWVqaW4uYnl0ZWltZy5jb20vdG9zLWNuLWktazN1MWZicGZjcC81YmM4NWRjN2E5ZmM0NjI0YmJjNDg0Zjg4OWQzMDQwY350cGx2LWszdTFmYnBmY3Atd2F0ZXJtYXJrLmltYWdlKScpXHJcbiAgICAgICAgci5pbnNlcnROb2RlKHN0cilcclxuICAgICAgICByLnNldFN0YXJ0KHN0ciwnIVvov5nmmK/lm77niYddJy5sZW5ndGgrMSlcclxuICAgICAgICByLnNldEVuZChzdHIsc3RyLmxlbmd0aC0xKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgY29uc3Qgc3RyID0gbmV3IFRleHQoJyFb6L+Z5piv5Zu+54mHXShodHRwczovL3AzLWp1ZWppbi5ieXRlaW1nLmNvbS90b3MtY24taS1rM3UxZmJwZmNwLzViYzg1ZGM3YTlmYzQ2MjRiYmM0ODRmODg5ZDMwNDBjfnRwbHYtazN1MWZicGZjcC13YXRlcm1hcmsuaW1hZ2UpJylcclxuICAgICAgICByLmRlbGV0ZUNvbnRlbnRzKClcclxuICAgICAgICByLmluc2VydE5vZGUoc3RyKVxyXG4gICAgICAgIHIuc2V0U3RhcnQoc3RyLCchW+i/meaYr+WbvueJh10nLmxlbmd0aCsxKVxyXG4gICAgICAgIHIuc2V0RW5kKHN0cixzdHIubGVuZ3RoLTEpXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qIOWkhOeQhuS7o+eggeWdlyAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2VDb2RlKHIpe1xyXG4gICAgY29uc3Qgc3RhcnQgPSByLnN0YXJ0T2Zmc2V0XHJcbiAgICBjb25zdCBlbmQgPSByLmVuZE9mZnNldFxyXG4gICAgY29uc3QgdCA9IHIuc3RhcnRDb250YWluZXIud2hvbGVUZXh0XHJcbiAgICBjb25zdCBpbm5lciA9IHQuc2xpY2Uoc3RhcnQsZW5kKT90LnNsaWNlKHN0YXJ0LGVuZCk6J+i/memHjOi+k+WFpeS7o+eggSdcclxuICAgIGlmKHIuc3RhcnRDb250YWluZXIgPT0gci5lbmRDb250YWluZXIpe1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdFRleHQgPSB0LnNsaWNlKDAsc3RhcnQpKydcXG5gYGBcXG4nK2lubmVyKydcXG5gYGBcXG4nK3Quc2xpY2UoZW5kLHQubGVuZ3RoKVxyXG4gICAgICAgIHIuc3RhcnRDb250YWluZXIubm9kZVZhbHVlID0gcmVzdWx0VGV4dFxyXG4gICAgICAgIHIuc2V0U3RhcnQoci5zdGFydENvbnRhaW5lcixzdGFydCs1KVxyXG4gICAgICAgIHIuc2V0RW5kKHIuc3RhcnRDb250YWluZXIsc3RhcnQrNStpbm5lci5sZW5ndGgpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBjb25zdCBldCA9IHIuZW5kQ29udGFpbmVyLndob2xlVGV4dFxyXG4gICAgICAgIHIuc3RhcnRDb250YWluZXIubm9kZVZhbHVlID0gdC5zbGljZSgwLHIuc3RhcnRPZmZzZXQpICsgJ1xcbmBgYFxcbicgKyB0LnNsaWNlKHIuc3RhcnRPZmZzZXQsdC5sZW5ndGgpXHJcbiAgICAgICAgci5lbmRDb250YWluZXIubm9kZVZhbHVlID0gZXQuc2xpY2UoMCxyLmVuZE9mZnNldCkgKyAnXFxuYGBgXFxuJyArIGV0LnNsaWNlKHIuZW5kT2Zmc2V0LGV0Lmxlbmd0aClcclxuICAgICAgICByLnNldFN0YXJ0KHIuc3RhcnRDb250YWluZXIsc3RhcnQrNSlcclxuICAgICAgICByLnNldEVuZChyLmVuZENvbnRhaW5lcixlbmQrMSlcclxuICAgIH0gXHJcbn0iLCIvKiDojrflj5blvZPliY3lhYnmoIfmiYDlnKjkvY3nva4qL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3Vyc29yKGRvbSl7XHJcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKClcclxuICAgIGlmKHNlbGVjdGlvbi5yYW5nZUNvdW50PT0wKXtcclxuICAgICAgICBjb25zb2xlLmxvZygnbm8gcmFuZ2UgZm91bnQnKVxyXG4gICAgfVxyXG4gICAgY29uc3QgcmFuZ2UgPSBzZWxlY3Rpb24uZ2V0UmFuZ2VBdCgwKVxyXG4gICAgY29uc3Qgc3RhcnQgPSBjb3VudExlbmd0aChkb20scmFuZ2Uuc3RhcnRDb250YWluZXIscmFuZ2Uuc3RhcnRPZmZzZXQpXHJcbiAgICBjb25zdCBlbmQgPSBjb3VudExlbmd0aChkb20scmFuZ2UuZW5kQ29udGFpbmVyLHJhbmdlLmVuZE9mZnNldClcclxuICAgIFxyXG4gICAgaWYoKCFzdGFydFswXSB8fCAhZW5kWzBdKSl7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDdXJzb3Igbm90IGluIHRoZSBkb20nKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZihkb20gPT0gcmFuZ2Uuc3RhcnRDb250YWluZXIpe1xyXG4gICAgICAgIGNvbnN0IGxlbiA9IGRvbS5pbm5lclRleHQubGVuZ3RoXHJcbiAgICAgICAgcmV0dXJuIFtsZW4sbGVuXVxyXG4gICAgfVxyXG4gICBcclxuICAgIHJldHVybiBbc3RhcnRbMV0sZW5kWzFdXVxyXG5cclxuICAgIGZ1bmN0aW9uIGNvdW50TGVuZ3RoKG5vZGUsdGFyZ2V0Tm9kZSxvZmZzZXQpe1xyXG4gICAgICAgIGlmKG5vZGUgPT0gdGFyZ2V0Tm9kZSl7XHJcbiAgICAgICAgICAgIGlmKG9mZnNldCA9PSAwKSBvZmZzZXQrPS4xXHJcbiAgICAgICAgICAgIHJldHVybiBbdHJ1ZSxvZmZzZXRdXHJcbiAgICAgICAgfSBcclxuICAgICAgICBpZihub2RlIGluc3RhbmNlb2YgVGV4dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gW2ZhbHNlLG5vZGUubGVuZ3RoXVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbGVuID0gMFxyXG5cclxuICAgICAgICBmb3IobGV0IGl0ZW0gb2Ygbm9kZS5jaGlsZE5vZGVzKXtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY291bnRMZW5ndGgoaXRlbSx0YXJnZXROb2RlLG9mZnNldClcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKHJlc3VsdFswXSA9PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbdHJ1ZSxsZW4rcmVzdWx0WzFdXVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGxlbiA9IGxlbityZXN1bHRbMV1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW2ZhbHNlLGxlbl1cclxuICAgIH1cclxufVxyXG5cclxuLyog6K6+572u5YWJ5qCH5L2N572uICovXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRDdXJzb3IoZG9tLHN0YXJ0LGVuZCl7XHJcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKClcclxuICAgIGlmKHNlbGVjdGlvbi5yYW5nZUNvdW50PT0wKXtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHJhbmdlIGZvdW5kJylcclxuICAgIH1cclxuICAgIGNvbnN0IHJhbmdlID0gc2VsZWN0aW9uLmdldFJhbmdlQXQoMClcclxuXHJcbiAgICBsZXQgc3RhcnREb25lID0gZmFsc2VcclxuICAgIGxldCBzdGFydFRleHRDb3VudCA9IDBcclxuICAgIHNldFN0YXJ0KGRvbSlcclxuICAgIGZ1bmN0aW9uIHNldFN0YXJ0KG5vZGUpe1xyXG4gICAgICAgIGlmKHN0YXJ0RG9uZSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgaWYobm9kZSBpbnN0YW5jZW9mIFRleHQpe1xyXG4gICAgICAgICAgICBzdGFydFRleHRDb3VudCs9bm9kZS5sZW5ndGhcclxuICAgICAgICAgICAgaWYoc3RhcnRUZXh0Q291bnQ+PXN0YXJ0KXtcclxuICAgICAgICAgICAgICAgIHJhbmdlLnNldFN0YXJ0KG5vZGUsbm9kZS5sZW5ndGgtKHN0YXJ0VGV4dENvdW50LXN0YXJ0KSlcclxuICAgICAgICAgICAgICAgIHN0YXJ0RG9uZSA9IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IobGV0IGl0ZW0gb2Ygbm9kZS5jaGlsZE5vZGVzKXtcclxuICAgICAgICAgICAgaWYoc2V0U3RhcnQoaXRlbSkgPT0gZmFsc2UpIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZighZW5kKSBlbmQgPSBzdGFydFxyXG4gICAgbGV0IGVuZERvbmUgPSBmYWxzZVxyXG4gICAgbGV0IGVuZFRleHRDb3VudCA9IDBcclxuICAgIHNldEVuZChkb20pXHJcbiAgICBmdW5jdGlvbiBzZXRFbmQobm9kZSl7XHJcbiAgICAgICAgaWYoZW5kRG9uZSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgaWYobm9kZSBpbnN0YW5jZW9mIFRleHQpe1xyXG4gICAgICAgICAgICBlbmRUZXh0Q291bnQrPW5vZGUubGVuZ3RoXHJcbiAgICAgICAgICAgIGlmKGVuZFRleHRDb3VudD49ZW5kKXtcclxuICAgICAgICAgICAgICAgIHJhbmdlLnNldEVuZChub2RlLG5vZGUubGVuZ3RoLShlbmRUZXh0Q291bnQtZW5kKSlcclxuICAgICAgICAgICAgICAgIGVuZERvbmUgPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGxldCBpdGVtIG9mIG5vZGUuY2hpbGROb2Rlcyl7XHJcbiAgICAgICAgICAgIGlmKHNldEVuZChpdGVtKSA9PSBmYWxzZSkgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGU7IH07XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICcuL3ByaXNtL3ByaXNtLmpzJ1xyXG5pbXBvcnQgJy4vcHJpc20vcHJpc20uY3NzJ1xyXG5pbXBvcnQgJy4vbWFya2Rvd24uY3NzJ1xyXG5cclxuaW1wb3J0IGhhbmRsZUVkaXRvciBmcm9tICcuL2hhbmRsZUVkaXRvcidcclxuaW1wb3J0IGhhbmRsZVZpZXcgZnJvbSAnLi9oYW5kbGVWaWV3J1xyXG5pbXBvcnQga2V5ZG93bkhvb2sgZnJvbSAnLi9rZXlkb3duSG9vaydcclxuXHJcbmltcG9ydCBnZXRDYXRhbG9nIGZyb20gJy4vZ2V0Q2F0YWxvZydcclxuXHJcbmltcG9ydCB7Z2V0Q3Vyc29yLHNldEN1cnNvcn0gZnJvbSAnLi91dGlsJ1xyXG5cclxuaW1wb3J0IHtcclxuICAgIHJhbmdlQm9sZCxcclxuICAgIHJhbmdlSXRhbGljcyxcclxuICAgIHJhbmdlRGVsLFxyXG4gICAgcmFuZ2VDaXRlLFxyXG4gICAgcmFuZ2VIMSxcclxuICAgIHJhbmdlSDIsXHJcbiAgICByYW5nZUhyLFxyXG4gICAgcmFuZ2VMaW5rLFxyXG4gICAgcmFuZ2VVbCxcclxuICAgIHJhbmdlT2wsXHJcbiAgICByYW5nZUltZyxcclxuICAgIHJhbmdlQ29kZVxyXG59IGZyb20gJy4vc2hvcnRjdXQnXHJcblxyXG5jbGFzcyBNYXJrZG93bntcclxuICAgIGNvbnN0cnVjdG9yKGRhdGEpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZW50cnkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGRhdGEuZWRpdG9yKTtcclxuICAgICAgICB0aGlzLnN0YWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihkYXRhLnN0YWdlKTtcclxuICAgICAgICB0aGlzLmNhdGFsb2cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGRhdGEuY2F0YWxvZyk7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IFtdXHJcbiAgICAgICAgdGhpcy5jYWNoZUluZGV4ID0gLTFcclxuICAgICAgICB0aGlzLmxhc3RFZGl0O1xyXG4gICAgICAgIHRoaXMuYW5hbHlzZWQgPSBmdW5jdGlvbihzdHIpe1xyXG4gICAgICAgICAgICBpZih0aGlzLnN0YWdlKSB0aGlzLnN0YWdlLmlubmVySFRNTCA9IHN0clxyXG4gICAgICAgIH0uYmluZCh0aGlzKVxyXG4gICAgICAgIHRoaXMuZ2V0Q2F0YWxvZ0NhbGxCYWNrID0gZnVuY3Rpb24oc3RyKXtcclxuICAgICAgICAgICAgaWYodGhpcy5jYXRhbG9nKSB0aGlzLmNhdGFsb2cuaW5uZXJIVE1MID0gc3RyXHJcbiAgICAgICAgfS5iaW5kKHRoaXMpXHJcblxyXG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMuZW50cnlcclxuICAgICAgICBlbnRyeS5zZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScsJ3RydWUnKVxyXG4gICAgICAgIGVudHJ5LmNsYXNzTmFtZT0gJ2VkaXRvciBfX21hcmtkb3duX18nXHJcbiAgICAgICAgZW50cnkuaW5uZXJIVE1MID0gJydcclxuICAgICAgICBlbnRyeS5mb2N1cygpXHJcblxyXG4gICAgICAgIC8qIOWkhOeQhuWkjeWItui/h+adpeeahOWGheWuuSAqL1xyXG4gICAgICAgIGVudHJ5LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJyxmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgIHZhciBwYXN0ZSA9IChlLm9yaWdpbmFsRXZlbnQgfHwgZSkuY2xpcGJvYXJkRGF0YS5nZXREYXRhKCd0ZXh0L3BsYWluJylcclxuICAgICAgICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2luc2VydFRleHQnLGZhbHNlLHBhc3RlKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8qIOemgeatouaLluaLvSAqL1xyXG4gICAgICAgIGVudHJ5LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJyxlPT57XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8qIOWkhOeQhumUruebmOS6i+S7tiAqL1xyXG4gICAgICAgIGVudHJ5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLGtleWRvd25Ib29rLmJpbmQodGhpcykpXHJcblxyXG4gICAgICAgIGVudHJ5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZUNhY2hlKClcclxuICAgICAgICB9LmJpbmQodGhpcykpXHJcbiAgICB9XHJcblxyXG4gICAgLyog6KKr5Yqo6Kej5p6QICovXHJcbiAgICBvbkFuYWx5c2VkKGZ1bil7XHJcbiAgICAgICAgdGhpcy5hbmFseXNlZCA9IGZ1blxyXG4gICAgfVxyXG5cclxuICAgIC8qIOiiq+WKqOiOt+WPluebruW9lSAqL1xyXG4gICAgb25HZXRDYXRhbG9nKGZ1bil7XHJcbiAgICAgICAgdGhpcy5nZXRDYXRhbG9nQ2FsbEJhY2sgPSBmdW5cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJWaWV3KGh0bWwpe1xyXG4gICAgICAgIHZhciB0ZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgICAgICB0ZW1wLmNsYXNzTmFtZSA9IFwiX19tYXJrZG93bl9yZXN1bHRfX1wiXHJcbiAgICAgICAgdGVtcC5pbm5lckhUTUwgPSBoYW5kbGVWaWV3KGh0bWwpXHJcbiAgICAgICAgcmV0dXJuIHRlbXAub3V0ZXJIVE1MXHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyRWRpdG9yKGh0bWwpe1xyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gZ2V0Q3Vyc29yKHRoaXMuZW50cnkpXHJcbiAgICAgICAgdGhpcy5lbnRyeS5pbm5lckhUTUwgPSBoYW5kbGVFZGl0b3IoaHRtbClcclxuICAgICAgICBzZXRDdXJzb3IodGhpcy5lbnRyeSwuLi5wb3NpdGlvbilcclxuICAgICAgICB0aGlzLmdldENhdGFsb2dDYWxsQmFjayhnZXRDYXRhbG9nKGh0bWwpKVxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qIOiuvue9ruagt+S+iyAqL1xyXG4gICAgc2V0RXhtcGxlKHRleHQpe1xyXG4gICAgICAgIHRoaXMuYW5hbHlzZWQodGhpcy5yZW5kZXJWaWV3KHRleHQpKVxyXG4gICAgICAgIHRoaXMucmVuZGVyRWRpdG9yKHRleHQpXHJcbiAgICAgICAgdGhpcy5zYXZlQ2FjaGUodHJ1ZSlcclxuICAgIH1cclxuXHJcbiAgICByZWZyZXNoKHRleHQscG9zKXtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHBvcz9wb3M6Z2V0Q3Vyc29yKHRoaXMuZW50cnkpXHJcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0b3IodGV4dD90ZXh0OnRoaXMuZW50cnkuaW5uZXJUZXh0KVxyXG4gICAgICAgIHRoaXMuYW5hbHlzZWQodGhpcy5yZW5kZXJWaWV3KHRleHQ/dGV4dDp0aGlzLmVudHJ5LmlubmVyVGV4dCkpXHJcbiAgICAgICAgc2V0Q3Vyc29yKHRoaXMuZW50cnksLi4ucG9zaXRpb24pXHJcbiAgICAgICAgdGhpcy5lbnRyeS5mb2N1cygpXHJcbiAgICB9XHJcblxyXG4gICAgLyog5a2Y5YKo57yW6L6R57yT5a2YICovXHJcbiAgICBzYXZlQ2FjaGUoaW5pdCl7XHJcbiAgICAgICAgaWYoaW5pdCl7XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGVJbmRleCA9IDBcclxuICAgICAgICAgICAgdGhpcy5jYWNoZSA9IFt7XHJcbiAgICAgICAgICAgICAgICBub2RlOnRoaXMuZW50cnkuY2xvbmVOb2RlKHRydWUpLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246Z2V0Q3Vyc29yKHRoaXMuZW50cnkpXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgIHRoaXMubGFzdEVkaXQgPSB0aGlzLmVudHJ5LmNsb25lTm9kZSh0cnVlKS5pbm5lclRleHRcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgY2xvbmVFbnRyeSA9IHRoaXMuZW50cnkuY2xvbmVOb2RlKHRydWUpXHJcbiAgICAgICAgaWYodGhpcy5sYXN0RWRpdCAhPSBjbG9uZUVudHJ5LmlubmVyVGV4dCl7XHJcbiAgICAgICAgICAgIHRoaXMubGFzdEVkaXQgPSBjbG9uZUVudHJ5LmlubmVyVGV4dFxyXG4gICAgICAgICAgICBpZih0aGlzLmNhY2hlLmxlbmd0aC0xPnRoaXMuY2FjaGVJbmRleCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlID0gdGhpcy5jYWNoZS5zbGljZSgwLHRoaXMuY2FjaGVJbmRleCsxKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGUucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBub2RlOmNsb25lRW50cnksXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjpnZXRDdXJzb3IodGhpcy5lbnRyeSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgdGhpcy5jYWNoZUluZGV4KytcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZVt0aGlzLmNhY2hlSW5kZXhdWydwb3NpdGlvbiddID0gZ2V0Q3Vyc29yKHRoaXMuZW50cnkpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qIOaSpOmUgCAqL1xyXG4gICAgdW5kbygpe1xyXG4gICAgICAgIGlmKHRoaXMuY2FjaGVJbmRleDw9MCkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5jYWNoZUluZGV4LS1cclxuICAgICAgICBjb25zdCBsYXN0ID0gdGhpcy5jYWNoZVt0aGlzLmNhY2hlSW5kZXhdXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoKGxhc3Qubm9kZS5pbm5lclRleHQsbGFzdC5wb3NpdGlvbilcclxuXHJcbiAgICAgICAgY29uc3QgY2xvbmVFbnRyeSA9IHRoaXMuZW50cnkuY2xvbmVOb2RlKHRydWUpXHJcbiAgICAgICAgdGhpcy5sYXN0RWRpdCA9IGNsb25lRW50cnkuaW5uZXJUZXh0XHJcbiAgICB9XHJcblxyXG4gICAgLyog5oGi5aSNICovXHJcbiAgICByZWRvKCl7XHJcbiAgICAgICAgaWYodGhpcy5jYWNoZUluZGV4ID09IHRoaXMuY2FjaGUubGVuZ3RoLTEpIHJldHVyblxyXG5cclxuICAgICAgICB0aGlzLmNhY2hlSW5kZXgrK1xyXG4gICAgICAgIGNvbnN0IG5leHQgPSB0aGlzLmNhY2hlW3RoaXMuY2FjaGVJbmRleF1cclxuICAgICAgICB0aGlzLnJlZnJlc2gobmV4dC5ub2RlLmlubmVyVGV4dCxuZXh0LnBvc2l0aW9uKVxyXG5cclxuICAgICAgICBjb25zdCBjbG9uZUVudHJ5ID0gdGhpcy5lbnRyeS5jbG9uZU5vZGUodHJ1ZSlcclxuICAgICAgICB0aGlzLmxhc3RFZGl0ID0gY2xvbmVFbnRyeS5pbm5lclRleHRcclxuICAgIH1cclxuXHJcbiAgICAvKiDop6blj5Hmlrnms5UgKi9cclxuICAgIGRpc3BhdGNoKHR5cGUpe1xyXG4gICAgICAgIHN3aXRjaCh0eXBlKXtcclxuICAgICAgICAgICAgY2FzZSAnZGVsJzpyYW5nZURlbChnZXRSYW5nZSgpKTticmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaXRhbGljcyc6cmFuZ2VJdGFsaWNzKGdldFJhbmdlKCkpO2JyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdib2xkJzpyYW5nZUJvbGQoZ2V0UmFuZ2UoKSk7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2NpdGUnOnJhbmdlQ2l0ZShnZXRSYW5nZSgpKTticmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaDEnOnJhbmdlSDEoZ2V0UmFuZ2UoKSk7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2gyJzpyYW5nZUgyKGdldFJhbmdlKCkpO2JyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdocic6cmFuZ2VIcihnZXRSYW5nZSgpKTticmVhaztcclxuICAgICAgICAgICAgY2FzZSAnbGluayc6cmFuZ2VMaW5rKGdldFJhbmdlKCkpO2JyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICd1bCc6cmFuZ2VVbChnZXRSYW5nZSgpKTticmVhaztcclxuICAgICAgICAgICAgY2FzZSAnb2wnOnJhbmdlT2woZ2V0UmFuZ2UoKSk7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2ltZyc6cmFuZ2VJbWcoZ2V0UmFuZ2UoKSk7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2NvZGUnOnJhbmdlQ29kZShnZXRSYW5nZSgpKTticmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDp0aHJvdyBuZXcgRXJyb3IoJ1wiJyt0eXBlKydcIicrXCIgaXNuJ3QgYSB2YWxpZCB2YWx1ZS5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVmcmVzaCgpXHJcbiAgICAgICAgdGhpcy5zYXZlQ2FjaGUoKVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0UmFuZ2UoKXtcclxuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGRvY3VtZW50LmdldFNlbGVjdGlvbigpXHJcbiAgICBpZihzZWxlY3Rpb24ucmFuZ2VDb3VudCl7XHJcbiAgICAgICAgcmV0dXJuIHNlbGVjdGlvbi5nZXRSYW5nZUF0KDApXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ+aXoOiMg+WbtOmAieaLqScpXHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvd1snTWFya2Rvd24nXSA9IE1hcmtkb3duIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9