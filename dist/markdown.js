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
    const strs = html.replace(/\r\n/g,'\n').split('\n')
    
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
                    try{
                        if(strs[e+1].match(/^[0-9]+\.\s/)){
                            box+='<li><span>'+lab+'. </span>'+vv.replace(/^[0-9]+\.\s/,'')+'\n</li>'
                        }else{
                            box+='<li><span>'+lab+'. </span>'+vv.replace(/^[0-9]+\.\s/,'')+'</li>'
                        }
                        lab++
                    }catch(err){
                        break
                    }
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
    const strs = html.replace(/\r\n/g,'\n').split('\n')

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
            if(v.indexOf('<hr') != 0 && v.indexOf('<h6') != 0 && v.indexOf('<h5') != 0 && v.indexOf('<h4') != 0 && v.indexOf('<h3') != 0 && v.indexOf('<h2') != 0 && v.indexOf('<h1') != 0 && v.indexOf('<blockquote') != 0){
                strs[i] = '<p>'+v+'</p>'
            }
        }
    }
    let newArr = []
    strs.map(v=>newArr.push(v))
    return newArr.join('')
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
        if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.altKey) return
        if(e.ctrlKey && (e.keyCode == 90 || e.keyCode == 89)) return
        if(e.key == 'Process' && (e.code != 'Space' && e.code!='Period' && e.code!='Comma' && e.code!='Digit1')) return
        this.renderEditor(this.entry.innerText)
        this.analysed(this.renderView(this.entry.innerText))
        this.saveCache()
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
        entry.innerText = ''
        entry.focus()

        /* 处理复制过来的内容 */
        entry.addEventListener('paste',function(e){
            e.preventDefault()
            var paste = (e.originalEvent || e).clipboardData.getData('text/plain')
            document.execCommand('insertText',false,paste.replace(/\r\n/g,'\n'))
            this.refresh()
            const rn = paste.match(/\r\n/g)
            if(rn) {
                const position = (0,_util__WEBPACK_IMPORTED_MODULE_7__.getCursor)(this.entry)
                ;(0,_util__WEBPACK_IMPORTED_MODULE_7__.setCursor)(this.entry,position[0]+rn.length,position[1]+rn.length)
            }
        }.bind(this))

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDbE5BO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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LGFBQWE7QUFDOUMsd0JBQXdCLG9EQUFTLGFBQWE7QUFDOUMsc0JBQXNCLGtEQUFPLGFBQWE7QUFDMUMsc0JBQXNCLGtEQUFPLGFBQWE7QUFDMUMsc0JBQXNCLGtEQUFPLGFBQWE7QUFDMUMsd0JBQXdCLG9EQUFTLGFBQWE7QUFDOUMsc0JBQXNCLGtEQUFPLGFBQWE7QUFDMUMsc0JBQXNCLGtEQUFPLGFBQWE7QUFDMUMsdUJBQXVCLG1EQUFRLGFBQWE7QUFDNUMsd0JBQXdCLG9EQUFTLGFBQWE7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYXJrZG93bi8uL3NyYy9tYXJrZG93bi5jc3MiLCJ3ZWJwYWNrOi8vbWFya2Rvd24vLi9zcmMvcHJpc20vcHJpc20uY3NzIiwid2VicGFjazovL21hcmtkb3duLy4vc3JjL2dldENhdGFsb2cuanMiLCJ3ZWJwYWNrOi8vbWFya2Rvd24vLi9zcmMvaGFuZGxlRWRpdG9yLmpzIiwid2VicGFjazovL21hcmtkb3duLy4vc3JjL2hhbmRsZVZpZXcuanMiLCJ3ZWJwYWNrOi8vbWFya2Rvd24vLi9zcmMva2V5ZG93bkhvb2suanMiLCJ3ZWJwYWNrOi8vbWFya2Rvd24vLi9zcmMvcHJpc20vcHJpc20uanMiLCJ3ZWJwYWNrOi8vbWFya2Rvd24vLi9zcmMvc2hvcnRjdXQuanMiLCJ3ZWJwYWNrOi8vbWFya2Rvd24vLi9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly9tYXJrZG93bi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tYXJrZG93bi93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9tYXJrZG93bi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbWFya2Rvd24vd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9tYXJrZG93bi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL21hcmtkb3duL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbWFya2Rvd24vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLyog5aSE55CG55uu5b2VICovXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldENhdGFsb2codGV4dCl7XHJcbiAgICBjb25zdCBhcnIgPSBbXVxyXG4gICAgdGV4dC5zcGxpdCgnXFxuJykubWFwKCh2LGtleSk9PntcclxuICAgICAgICBjb25zdCBtYXRjaGVkID0gdi5tYXRjaCgvXiN7MSw2fVxccy8pXHJcbiAgICAgICAgaWYobWF0Y2hlZCl7XHJcbiAgICAgICAgICAgIC8vIGRlYnVnZ2VyXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbiA9IHYuc2xpY2UobWF0Y2hlZFswXS5sZW5ndGgpXHJcbiAgICAgICAgICAgIGxldCBsZXZlbCA9IG1hdGNoZWRbMF0ubGVuZ3RoLTFcclxuICAgICAgICAgICAgY29uc3QgcHJlTGV2ZWwgPSBhcnJbYXJyLmxlbmd0aC0xXSAmJiBhcnJbYXJyLmxlbmd0aC0xXVszXVxyXG4gICAgICAgICAgICBpZihwcmVMZXZlbCA9PSB1bmRlZmluZWQgfHwgcHJlTGV2ZWw+bGV2ZWwpe1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwgPSAxXHJcbiAgICAgICAgICAgIH1lbHNlIGlmKHByZUxldmVsPGxldmVsKXtcclxuICAgICAgICAgICAgICAgIGxldmVsID0gYXJyW2Fyci5sZW5ndGgtMV1bMl0rMVxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGxldmVsID0gYXJyW2Fyci5sZW5ndGgtMV1bMl1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhcnIucHVzaChbJ19jYXRlJytrZXkrJ18nLGNvbixsZXZlbCxtYXRjaGVkWzBdLmxlbmd0aC0xXSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgbGV0IHN0ciA9ICcnXHJcbiAgICBhcnIubWFwKHY9PiBzdHIrPSc8bGkgY2xhc3M9XCJfbGV2ZWwnK3ZbMl0rJ19cIiBtYXBpZD1cIicrdlswXSsnXCI+Jyt2WzFdKyc8L2xpPicpXHJcblxyXG4gICAgcmV0dXJuICc8dWwgY2xhc3M9XCJfX2NhdGFsb2dfX1wiPicrc3RyKyc8L3VsPidcclxufSIsImNvbnN0IGhhbmRsZUVkaXRvciA9IChodG1sKT0+e1xyXG4gICAgY29uc3Qgc3RycyA9IGh0bWwucmVwbGFjZSgvXFxyXFxuL2csJ1xcbicpLnNwbGl0KCdcXG4nKVxyXG4gICAgXHJcbiAgICBmb3IobGV0IGk9MDtpPHN0cnMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgLyog5aSE55CGY29kZSAqL1xyXG4gICAgICAgIHN0cnNbaV0gPSBzdHJzW2ldLnJlcGxhY2UoLzwvZywnJmx0OycpLnJlcGxhY2UoLz4vZywnJmd0OycpXHJcbiAgICAgICAgbGV0IHYgPSBzdHJzW2ldXHJcbiAgICAgICAgbGV0IHN0YXJ0LGVuZCA9ICcnXHJcbiAgICAgICAgaWYodi5zbGljZSgwLDMpID09ICdgYGAnKXtcclxuICAgICAgICAgICAgbGV0IGJveCA9ICcnXHJcbiAgICAgICAgICAgIGJveCs9J1xcbidcclxuICAgICAgICAgICAgc3RhcnQgPSAnYGBgJ1xyXG4gICAgICAgICAgICBkZWxldGUgc3Ryc1tpXVxyXG4gICAgICAgICAgICBmb3IobGV0IGU9aSsxO2U8c3Rycy5sZW5ndGg7ZSsrKXtcclxuICAgICAgICAgICAgICAgIGxldCB2diA9IHN0cnNbZV1cclxuICAgICAgICAgICAgICAgIGlmKHZ2LnNsaWNlKDAsMykgPT0gJ2BgYCcpe1xyXG4gICAgICAgICAgICAgICAgICAgIGJveCs9J1xcbidcclxuICAgICAgICAgICAgICAgICAgICBlbmQgPSAnYGBgJ1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgYm94Kz12disnXFxuJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaT1lXHJcbiAgICAgICAgICAgICAgICBkZWxldGUgc3Ryc1tpXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJveCA9IGJveC5yZXBsYWNlKC9cXG4oPyFbXFxzXFxTXSpcXG4pLywnJylcclxuICAgICAgICAgICAgaSsrXHJcbiAgICAgICAgICAgIGRlbGV0ZSBzdHJzW2ldXHJcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbkxhbmcgPSB2LnNwbGl0KCdcXG4nKVswXS5zbGljZSgzKS5yZXBsYWNlKCcgJywnJykucmVwbGFjZSgnXFxuJywnJykucmVwbGFjZSgnXFxyJywnJylcclxuICAgICAgICAgICAgbGV0IGxhbmd1YWdlID0gdi5zcGxpdCgnXFxuJylbMF0uc2xpY2UoMykucmVwbGFjZSgnICcsJycpLnJlcGxhY2UoJ1xcbicsJycpLnJlcGxhY2UoJ1xccicsJycpXHJcbiAgICAgICAgICAgIGlmKCFQcmlzbS5sYW5ndWFnZXNbbGFuZ3VhZ2VdKSBsYW5ndWFnZSA9ICdqc3gnXHJcbiAgICAgICAgICAgIGNvbnN0IGh0bWwgPSBQcmlzbS5oaWdobGlnaHQoYm94LCBQcmlzbS5sYW5ndWFnZXNbbGFuZ3VhZ2UucmVwbGFjZSgnXFxyJywnJyldLGxhbmd1YWdlKTtcclxuICAgICAgICAgICAgc3Ryc1tpXSA9ICc8cHJlPjxjb2RlPjxzcGFuPicrc3RhcnQrb3JpZ2luTGFuZysnPC9zcGFuPicraHRtbCsnPHNwYW4+JytlbmQrJzwvc3Bhbj48L2NvZGU+PC9wcmU+J1xyXG4gICAgICAgIH1lbHNlIGlmKHYuc2xpY2UoMCwyKSA9PSAnLSAnKXtcclxuICAgICAgICAgICAgLyog5aSE55CG5peg5bqP5YiX6KGoICovXHJcbiAgICAgICAgICAgIGxldCBib3ggPSAnJztcclxuICAgICAgICAgICAgZm9yKGxldCBlPWk7ZTxzdHJzLmxlbmd0aDtlKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IHZ2ID0gc3Ryc1tlXVxyXG4gICAgICAgICAgICAgICAgaWYodnYuc2xpY2UoMCwyKSA9PSAnLSAnKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihzdHJzW2UrMV0uc2xpY2UoMCwyKSA9PSAnLSAnKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94Kz0nPGxpPjxzcGFuPi0gPC9zcGFuPicrdnYuc2xpY2UoMikrJ1xcbjwvbGk+J1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3grPSc8bGk+PHNwYW4+LSA8L3NwYW4+Jyt2di5zbGljZSgyKSsnPC9saT4nXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpPWVcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzdHJzW2ldXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3Ryc1tpXSA9ICc8dWw+Jytib3grJzwvdWw+J1xyXG4gICAgICAgIH1lbHNlIGlmKHYubWF0Y2goL15bMC05XStcXC5cXHMrLykpe1xyXG4gICAgICAgICAgICAvKiDlpITnkIbmnInluo/liJfooaggKi9cclxuICAgICAgICAgICAgbGV0IGJveCA9ICcnO1xyXG4gICAgICAgICAgICBsZXQgbGFiID0gMVxyXG4gICAgICAgICAgICBmb3IobGV0IGU9aTtlPHN0cnMubGVuZ3RoO2UrKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdnYgPSBzdHJzW2VdXHJcbiAgICAgICAgICAgICAgICBpZih2di5tYXRjaCgvXlswLTldK1xcLlxccy8pKXtcclxuICAgICAgICAgICAgICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHN0cnNbZSsxXS5tYXRjaCgvXlswLTldK1xcLlxccy8pKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveCs9JzxsaT48c3Bhbj4nK2xhYisnLiA8L3NwYW4+Jyt2di5yZXBsYWNlKC9eWzAtOV0rXFwuXFxzLywnJykrJ1xcbjwvbGk+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveCs9JzxsaT48c3Bhbj4nK2xhYisnLiA8L3NwYW4+Jyt2di5yZXBsYWNlKC9eWzAtOV0rXFwuXFxzLywnJykrJzwvbGk+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYisrXHJcbiAgICAgICAgICAgICAgICAgICAgfWNhdGNoKGVycil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpPWVcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzdHJzW2ldXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3Ryc1tpXSA9ICc8b2w+Jytib3grJzwvb2w+J1xyXG4gICAgICAgIH1lbHNle1xyXG5cclxuICAgICAgICAgICAgaWYodi5zbGljZSgwLDcpID09ICcjIyMjIyMgJykgdiA9ICc8aDY+PHNwYW4gY2xhc3M9XCJwbGFpblwiPiMjIyMjIyA8L3NwYW4+Jyt2LnNsaWNlKDcpKyc8L2g2PidcclxuICAgICAgICAgICAgaWYodi5zbGljZSgwLDYpID09ICcjIyMjIyAnKSB2ID0gJzxoNT48c3BhbiBjbGFzcz1cInBsYWluXCI+IyMjIyMgPC9zcGFuPicrdi5zbGljZSg2KSsnPC9oNT4nXHJcbiAgICAgICAgICAgIGlmKHYuc2xpY2UoMCw1KSA9PSAnIyMjIyAnKSB2ID0gJzxoND48c3BhbiBjbGFzcz1cInBsYWluXCI+IyMjIyA8L3NwYW4+Jyt2LnNsaWNlKDUpKyc8L2g0PidcclxuICAgICAgICAgICAgaWYodi5zbGljZSgwLDQpID09ICcjIyMgJykgdiA9ICc8aDM+PHNwYW4gY2xhc3M9XCJwbGFpblwiPiMjIyA8L3NwYW4+Jyt2LnNsaWNlKDQpKyc8L2gzPidcclxuICAgICAgICAgICAgaWYodi5zbGljZSgwLDMpID09ICcjIyAnKSB2ID0gJzxoMj48c3BhbiBjbGFzcz1cInBsYWluXCI+IyMgPC9zcGFuPicrdi5zbGljZSgzKSsnPC9oMj4nXHJcbiAgICAgICAgICAgIGlmKHYuc2xpY2UoMCwyKSA9PSAnIyAnKSB2ID0gJzxoMT48c3BhbiBjbGFzcz1cInBsYWluXCI+IyA8L3NwYW4+Jyt2LnNsaWNlKDIpKyc8L2gxPidcclxuXHJcbiAgICAgICAgICAgIC8qIOWkhOeQhuWIhuWJsue6vyAqL1xyXG4gICAgICAgICAgICBpZih2ID09ICcqKionKSB2ID0gJzxzcGFuIGNsYXNzPVwic3BsaXRMaW5lXCI+KioqPC9zcGFuPidcclxuXHJcbiAgICAgICAgICAgIC8qIOW8leeUqOWGheWuueWkhOeQhiAqL1xyXG4gICAgICAgICAgICBpZih2LnNsaWNlKDAsNSkgPT0gJyZndDsgJykgdiA9ICc8YmxvY2txdW90ZT48c3BhbiBjbGFzcz1cInBsYWluXCI+Jyt2LnNsaWNlKDAsNSkrJzwvc3Bhbj4nK3Yuc2xpY2UoNSkrJzwvYmxvY2txdW90ZT4nXHJcblxyXG4gICAgICAgICAgICAvKiDlpITnkIblm77niYcgKi9cclxuICAgICAgICAgICAgdiA9IHYucmVwbGFjZSgvXFwhXFxbLipcXF1cXCguKlxcKS9nLGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGZyb250ID0gZS5tYXRjaCgvXlxcIVxcWy4qXFxdXFwoLylbMF0uc2xpY2UoMiwtMilcclxuICAgICAgICAgICAgICAgIGxldCBlbmQgPSBlLm1hdGNoKC8oPz1cXF1cXCgpLipcXCkkLylbMF0uc2xpY2UoMiwtMSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBgPHNwYW4gY2xhc3M9XCJpbWdcIj48aW1nIHNyYz1cIiR7ZW5kfVwiIC8+PHNwYW4gY2xhc3M9XCJ0ZXh0XCI+IVske2Zyb250fV08c3BhbiBjbGFzcz1cInBsYWluXCI+KCR7ZW5kfSk8L3NwYW4+PC9zcGFuPjwvc3Bhbj5gXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvKiDlpITnkIbotoXpk77mjqUgKi9cclxuICAgICAgICAgICAgdiA9IHYucmVwbGFjZSgvXFxbLipcXF1cXCguKlxcKS9nLGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGZyb250ID0gZS5tYXRjaCgvXlxcWy4qXFxdXFwoLylbMF0uc2xpY2UoMSwtMilcclxuICAgICAgICAgICAgICAgIGxldCBlbmQgPSBlLm1hdGNoKC8oPz1cXF1cXCgpLipcXCkkLylbMF0uc2xpY2UoMiwtMSlcclxuICAgICAgICAgICAgICAgIGVuZCA9IGUucmVwbGFjZShmcm9udCwnJykuc2xpY2UoMykuc2xpY2UoMCwtMSlcclxuICAgICAgICAgICAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCJwbGFpblwiPls8L3NwYW4+Jytmcm9udCsnPHNwYW4gY2xhc3M9XCJwbGFpblwiPl08L3NwYW4+PHNwYW4gY2xhc3M9XCJwbGFpblwiPig8YSBocmVmPVwiJytlbmQrJ1wiPicrZW5kKyc8L2E+KTwvc3Bhbj4nXHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC8qIOWIoOmZpOe6v+WkhOeQhiAqL1xyXG4gICAgICAgICAgICBpZih2ICYmIHYuaW5kZXhPZignfn4nKT4tMSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29uID0gdlxyXG4gICAgICAgICAgICAgICAgbGV0IGhhbmRsZWQgPSAnJ1xyXG4gICAgICAgICAgICAgICAgd2hpbGUoY29uLmluZGV4T2YoJ35+Jyk+LTEpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmaXJzdCA9IGNvbi5pbmRleE9mKCd+ficpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJlID0gY29uLnNsaWNlKDAsZmlyc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uID0gY29uLnNsaWNlKGZpcnN0KzIpXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlY29uZCA9IGNvbi5pbmRleE9mKCd+ficpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc2Vjb25kPi0xICYmIHByZVtwcmUubGVuZ3RoLTFdIT0nPicpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkICs9IHByZSsnPHNwYW4gY2xhc3M9XCJkZWxcIj5+fjwvc3Bhbj48ZGVsPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlZCArPSBjb24uc2xpY2UoMCxzZWNvbmQpKyc8L2RlbD48c3BhbiBjbGFzcz1cImRlbFwiPn5+PC9zcGFuPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uID0gY29uLnNsaWNlKHNlY29uZCsyKVxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkICs9IHByZSsoZmlyc3Q+LTI/J35+JzonJylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVkKz1jb25cclxuICAgICAgICAgICAgICAgIGlmKGhhbmRsZWQgIT0gdil7XHJcbiAgICAgICAgICAgICAgICAgICAgdiA9IGhhbmRsZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIOmHjeeCueWGheWuueWkhOeQhiAqL1xyXG4gICAgICAgICAgICBpZih2ICYmIHYuaW5kZXhPZignYCcpPi0xKXtcclxuICAgICAgICAgICAgICAgIGxldCBjb24gPSB2XHJcbiAgICAgICAgICAgICAgICBsZXQgaGFuZGxlZCA9ICcnXHJcbiAgICAgICAgICAgICAgICB3aGlsZShjb24uaW5kZXhPZignYCcpPi0xKXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZmlyc3QgPSBjb24uaW5kZXhPZignYCcpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJlID0gY29uLnNsaWNlKDAsZmlyc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uID0gY29uLnNsaWNlKGZpcnN0KzEpXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlY29uZCA9IGNvbi5pbmRleE9mKCdgJylcclxuICAgICAgICAgICAgICAgICAgICBpZihzZWNvbmQ+LTEgJiYgcHJlW3ByZS5sZW5ndGgtMV0hPSc+Jyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gcHJlKyc8Y2l0ZT5gJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkICs9IGNvbi5zbGljZSgwLHNlY29uZCkrJ2A8L2NpdGU+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb24gPSBjb24uc2xpY2Uoc2Vjb25kKzEpXHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkICs9IHByZSsoZmlyc3Q+LTE/J2AnOicnKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGhhbmRsZWQrPWNvblxyXG4gICAgICAgICAgICAgICAgaWYoaGFuZGxlZCAhPSB2KXtcclxuICAgICAgICAgICAgICAgICAgICB2ID0gaGFuZGxlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyog5Yqg57KX5YaF5a655aSE55CGICovXHJcbiAgICAgICAgICAgIGlmKHYgJiYgdi5pbmRleE9mKCcqKicpPi0xKXtcclxuICAgICAgICAgICAgICAgIGxldCBjb24gPSB2XHJcbiAgICAgICAgICAgICAgICBsZXQgaGFuZGxlZCA9ICcnXHJcbiAgICAgICAgICAgICAgICB3aGlsZShjb24uaW5kZXhPZignKionKT4tMSl7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpcnN0ID0gY29uLmluZGV4T2YoJyoqJylcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmUgPSBjb24uc2xpY2UoMCxmaXJzdClcclxuICAgICAgICAgICAgICAgICAgICBjb24gPSBjb24uc2xpY2UoZmlyc3QrMilcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2Vjb25kID0gY29uLmluZGV4T2YoJyoqJylcclxuICAgICAgICAgICAgICAgICAgICBpZihzZWNvbmQ+LTEgJiYgcHJlW3ByZS5sZW5ndGgtMV0hPSc+Jyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gcHJlKyc8c3Ryb25nPjxzcGFuPioqPC9zcGFuPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlZCArPSBjb24uc2xpY2UoMCxzZWNvbmQpKyc8c3Bhbj4qKjwvc3Bhbj48L3N0cm9uZz4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbiA9IGNvbi5zbGljZShzZWNvbmQrMilcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlZCArPSBwcmUrKGZpcnN0Pi0yPycqKic6JycpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaGFuZGxlZCs9Y29uXHJcbiAgICAgICAgICAgICAgICBpZihoYW5kbGVkICE9IHYpe1xyXG4gICAgICAgICAgICAgICAgICAgIHYgPSBoYW5kbGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiDmlpzkvZPlhoXlrrnlpITnkIYgKi9cclxuICAgICAgICAgICAgaWYodiAmJiB2LmluZGV4T2YoJyonKT4tMSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29uID0gdlxyXG4gICAgICAgICAgICAgICAgbGV0IGhhbmRsZWQgPSAnJ1xyXG4gICAgICAgICAgICAgICAgd2hpbGUoY29uLmluZGV4T2YoJyonKT4tMSAmJiBjb25bY29uLmluZGV4T2YoJyonKSsxXSE9JyonICYmIGNvbltjb24uaW5kZXhPZignKicpLTFdICE9Jz4nKXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZmlyc3QgPSBjb24uaW5kZXhPZignKicpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJlID0gY29uLnNsaWNlKDAsZmlyc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uID0gY29uLnNsaWNlKGZpcnN0KzEpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWNvbmQgPSBjb24uaW5kZXhPZignKicpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc2Vjb25kPi0xICYmIHByZVtwcmUubGVuZ3RoLTFdIT0nPicpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkICs9IHByZSsnPGk+PHNwYW4+Kjwvc3Bhbj4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gY29uLnNsaWNlKDAsc2Vjb25kKSsnPHNwYW4+Kjwvc3Bhbj48L2k+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb24gPSBjb24uc2xpY2Uoc2Vjb25kKzEpXHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gcHJlKyhmaXJzdD4tMT8nKic6JycpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaGFuZGxlZCs9Y29uXHJcbiAgICAgICAgICAgICAgICBpZihoYW5kbGVkICE9IHYpe1xyXG4gICAgICAgICAgICAgICAgICAgIHYgPSBoYW5kbGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN0cnNbaV0gPSB2XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IG5ld0FyciA9IFtdXHJcbiAgICBzdHJzLm1hcCh2PT57XHJcbiAgICAgICAgbmV3QXJyLnB1c2godilcclxuICAgIH0pXHJcbiAgICByZXR1cm4gbmV3QXJyLmpvaW4oJ1xcbicpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGhhbmRsZUVkaXRvciIsImNvbnN0IGhhbmRsZVZpZXcgPSAoaHRtbCk9PntcclxuICAgIGNvbnN0IHN0cnMgPSBodG1sLnJlcGxhY2UoL1xcclxcbi9nLCdcXG4nKS5zcGxpdCgnXFxuJylcclxuXHJcbiAgICBmb3IobGV0IGk9MDtpPHN0cnMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgc3Ryc1tpXSA9IHN0cnNbaV0ucmVwbGFjZSgvPC9nLCcmbHQ7JykucmVwbGFjZSgvPi9nLCcmZ3Q7JylcclxuICAgICAgICBsZXQgdiA9IHN0cnNbaV1cclxuICAgICAgICBsZXQgbGFuZ3VhZ2UgPSAnJ1xyXG4gICAgICAgIGlmKHYuc2xpY2UoMCwzKSA9PSAnYGBgJyl7XHJcbiAgICAgICAgICAgIGxldCBib3ggPSAnJ1xyXG4gICAgICAgICAgICBib3grPScnXHJcbiAgICAgICAgICAgIGxhbmd1YWdlID0gdi5yZXBsYWNlKCdgYGAnLCcnKS5yZXBsYWNlKCcgJywnJykucmVwbGFjZSgnXFxuJywnJykucmVwbGFjZSgnXFxyJywnJylcclxuICAgICAgICAgICAgZGVsZXRlIHN0cnNbaV1cclxuICAgICAgICAgICAgZm9yKGxldCBlPWkrMTtlPHN0cnMubGVuZ3RoO2UrKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdnYgPSBzdHJzW2VdXHJcbiAgICAgICAgICAgICAgICBpZih2di5zbGljZSgwLDMpID09ICdgYGAnKXtcclxuICAgICAgICAgICAgICAgICAgICBib3grPScnKydcXG4nXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBib3grPXZ2KydcXG4nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpPWVcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzdHJzW2ldXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYm94ID0gYm94LnJlcGxhY2UoL1xcbig/IVtcXHNcXFNdKlxcbikvLCcnKVxyXG4gICAgICAgICAgICBpKytcclxuICAgICAgICAgICAgZGVsZXRlIHN0cnNbaV1cclxuICAgICAgICAgICAgaWYoIVByaXNtLmxhbmd1YWdlc1tsYW5ndWFnZV0pIGxhbmd1YWdlID0gJ2pzeCdcclxuICAgICAgICAgICAgY29uc3QgaHRtbCA9IFByaXNtLmhpZ2hsaWdodChib3gsIFByaXNtLmxhbmd1YWdlc1tsYW5ndWFnZS5yZXBsYWNlKCdcXHInLCcnKV0sbGFuZ3VhZ2UpO1xyXG4gICAgICAgICAgICBzdHJzW2ldID0gJzxwcmU+PGNvZGU+JytodG1sKyc8L2NvZGU+PC9wcmU+J1xyXG4gICAgICAgIH1lbHNlIGlmKHYuc2xpY2UoMCwyKSA9PSAnLSAnKXtcclxuICAgICAgICAgICAgLyog5aSE55CG5peg5bqP5YiX6KGoICovXHJcbiAgICAgICAgICAgIGxldCBib3ggPSAnJztcclxuICAgICAgICAgICAgZm9yKGxldCBlPWk7ZTxzdHJzLmxlbmd0aDtlKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IHZ2ID0gc3Ryc1tlXVxyXG4gICAgICAgICAgICAgICAgaWYodnYuc2xpY2UoMCwyKSA9PSAnLSAnKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihzdHJzW2UrMV0uc2xpY2UoMCwyKSA9PSAnLSAnKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94Kz0nPGxpPicrdnYuc2xpY2UoMix2di5sZW5ndGgpKydcXG48L2xpPidcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm94Kz0nPGxpPicrdnYuc2xpY2UoMix2di5sZW5ndGgpKyc8L2xpPidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGk9ZVxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0cnNbaV1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdHJzW2ldID0gJzx1bD4nK2JveCsnPC91bD4nXHJcbiAgICAgICAgfWVsc2UgaWYodi5tYXRjaCgvXlswLTldK1xcLlxccy8pKXtcclxuICAgICAgICAgICAgLyog5aSE55CG5pyJ5bqP5YiX6KGoICovXHJcbiAgICAgICAgICAgIGxldCBib3ggPSAnJztcclxuICAgICAgICAgICAgZm9yKGxldCBlPWk7ZTxzdHJzLmxlbmd0aDtlKyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IHZ2ID0gc3Ryc1tlXVxyXG4gICAgICAgICAgICAgICAgaWYodnYubWF0Y2goL15bMC05XStcXC5cXHMvKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc3Ryc1tlKzFdLm1hdGNoKC9eWzAtOV1cXC5cXHMvKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveCs9JzxsaT4nK3Z2LnJlcGxhY2UoL15bMC05XStcXC5cXHMvLCcnKSsnXFxuPC9saT4nXHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJveCs9JzxsaT4nK3Z2LnJlcGxhY2UoL15bMC05XStcXC5cXHMvLCcnKSsnPC9saT4nXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpPWVcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzdHJzW2ldXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3Ryc1tpXSA9ICc8b2w+Jytib3grJzwvb2w+J1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgLyog5Yig6Zmk57q/5aSE55CGICovXHJcbiAgICAgICAgICAgICBpZih2ICYmIHYuaW5kZXhPZignfn4nKT4tMSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29uID0gdlxyXG4gICAgICAgICAgICAgICAgbGV0IGhhbmRsZWQgPSAnJ1xyXG4gICAgICAgICAgICAgICAgd2hpbGUoY29uLmluZGV4T2YoJ35+Jyk+LTEpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmaXJzdCA9IGNvbi5pbmRleE9mKCd+ficpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJlID0gY29uLnNsaWNlKDAsZmlyc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uID0gY29uLnNsaWNlKGZpcnN0KzIpXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlY29uZCA9IGNvbi5pbmRleE9mKCd+ficpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc2Vjb25kPi0xICYmIHByZVtwcmUubGVuZ3RoLTFdIT0nPicpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkICs9IHByZSsnPGRlbD4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gY29uLnNsaWNlKDAsc2Vjb25kKSsnPC9kZWw+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb24gPSBjb24uc2xpY2Uoc2Vjb25kKzIpXHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gcHJlKyhmaXJzdD4tMj8nfn4nOicnKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGhhbmRsZWQrPWNvblxyXG4gICAgICAgICAgICAgICAgaWYoaGFuZGxlZCAhPSB2KXtcclxuICAgICAgICAgICAgICAgICAgICB2ID0gaGFuZGxlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyog5aSE55CG5qCH6aKYICovXHJcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoZWQgPSB2Lm1hdGNoKC9eI3sxLDZ9XFxzLylcclxuICAgICAgICAgICAgaWYobWF0Y2hlZCl7XHJcbiAgICAgICAgICAgICAgICB2ID0gJzxoJysobWF0Y2hlZFswXS5sZW5ndGgtMSkrJyBpZD1cIl9jYXRhJytpKydfXCI+Jyt2LnNsaWNlKG1hdGNoZWRbMF0ubGVuZ3RoKSsnPC9oJysobWF0Y2hlZFswXS5sZW5ndGgtMSkrJz4nXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIOW8leeUqOWGheWuueWkhOeQhiAqL1xyXG4gICAgICAgICAgICBpZih2LnNsaWNlKDAsNSkgPT0gJyZndDsgJykgdiA9ICc8YmxvY2txdW90ZT4nK3Yuc2xpY2UoNSkrJzwvYmxvY2txdW90ZT4nXHJcblxyXG4gICAgICAgICAgICAvKiDlpITnkIbliIblibLnur8gKi9cclxuICAgICAgICAgICAgaWYodiA9PSAnKioqJykgdiA9ICc8aHIgLz4nXHJcblxyXG4gICAgICAgICAgICAvKiDlpITnkIblm77niYcgKi9cclxuICAgICAgICAgICAgdiA9IHYucmVwbGFjZSgvXFwhXFxbLipcXF1cXCguKlxcKS9nLGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGZyb250ID0gZS5tYXRjaCgvXlxcIVxcWy4qXFxdXFwoLylbMF0uc2xpY2UoMiwtMilcclxuICAgICAgICAgICAgICAgIGxldCBlbmQgPSBlLm1hdGNoKC8oPz1cXF1cXCgpLipcXCkkLylbMF0uc2xpY2UoMiwtMSlcclxuICAgICAgICAgICAgICAgIHJldHVybiAnPGltZyBhbHQ9XCInK2Zyb250KydcIiBzcmM9XCInK2VuZCsnXCIgLz4nXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvKiDlpITnkIbotoXpk77mjqUgKi9cclxuICAgICAgICAgICAgdiA9IHYucmVwbGFjZSgvXFxbLipcXF1cXCguKlxcKS9nLGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGZyb250ID0gZS5tYXRjaCgvXlxcWy4qXFxdXFwoLylbMF0uc2xpY2UoMSwtMilcclxuICAgICAgICAgICAgICAgIGxldCBlbmQgPSBlLm1hdGNoKC8oPz1cXF1cXCgpLipcXCkkLylbMF0uc2xpY2UoMiwtMSlcclxuICAgICAgICAgICAgICAgIHJldHVybiAnPGEgaHJlZj1cIicrZW5kKydcIj4nK2Zyb250Kyc8L2E+J1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLyog6YeN54K55YaF5a655aSE55CGICovXHJcbiAgICAgICAgICAgIGlmKHYgJiYgdi5pbmRleE9mKCdgJyk+LTEpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbiA9IHZcclxuICAgICAgICAgICAgICAgIGxldCBoYW5kbGVkID0gJydcclxuICAgICAgICAgICAgICAgIHdoaWxlKGNvbi5pbmRleE9mKCdgJyk+LTEpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmaXJzdCA9IGNvbi5pbmRleE9mKCdgJylcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmUgPSBjb24uc2xpY2UoMCxmaXJzdClcclxuICAgICAgICAgICAgICAgICAgICBjb24gPSBjb24uc2xpY2UoZmlyc3QrMSlcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc2Vjb25kID0gY29uLmluZGV4T2YoJ2AnKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNlY29uZD4tMSAmJiBwcmVbcHJlLmxlbmd0aC0xXSE9Jz4nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlZCArPSBwcmUrJzxjaXRlPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlZCArPSBjb24uc2xpY2UoMCxzZWNvbmQpKyc8L2NpdGU+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb24gPSBjb24uc2xpY2Uoc2Vjb25kKzEpXHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gcHJlKyhmaXJzdD4tMT8nYCc6JycpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaGFuZGxlZCs9Y29uXHJcbiAgICAgICAgICAgICAgICBpZihoYW5kbGVkICE9IHYpe1xyXG4gICAgICAgICAgICAgICAgICAgIHYgPSBoYW5kbGVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiDliqDnspflhoXlrrnlpITnkIYgKi9cclxuICAgICAgICAgICAgaWYodiAmJiB2LmluZGV4T2YoJyoqJyk+LTEpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbiA9IHZcclxuICAgICAgICAgICAgICAgIGxldCBoYW5kbGVkID0gJydcclxuICAgICAgICAgICAgICAgIHdoaWxlKGNvbi5pbmRleE9mKCcqKicpPi0xKXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZmlyc3QgPSBjb24uaW5kZXhPZignKionKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZSA9IGNvbi5zbGljZSgwLGZpcnN0KVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbiA9IGNvbi5zbGljZShmaXJzdCsyKVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWNvbmQgPSBjb24uaW5kZXhPZignKionKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNlY29uZD4tMSAmJiBwcmVbcHJlLmxlbmd0aC0xXSE9Jz4nKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlZCArPSBwcmUrJzxzdHJvbmc+J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkICs9IGNvbi5zbGljZSgwLHNlY29uZCkrJzwvc3Ryb25nPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uID0gY29uLnNsaWNlKHNlY29uZCsyKVxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkICs9IHByZSsoZmlyc3Q+LTI/JyoqJzonJylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVkKz1jb25cclxuICAgICAgICAgICAgICAgIGlmKGhhbmRsZWQgIT0gdil7XHJcbiAgICAgICAgICAgICAgICAgICAgdiA9IGhhbmRsZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIOaWnOS9k+WGheWuueWkhOeQhiAqL1xyXG4gICAgICAgICAgICBpZih2ICYmIHYuaW5kZXhPZignKicpPi0xKXtcclxuICAgICAgICAgICAgICAgIGxldCBjb24gPSB2XHJcbiAgICAgICAgICAgICAgICBsZXQgaGFuZGxlZCA9ICcnXHJcbiAgICAgICAgICAgICAgICB3aGlsZShjb24uaW5kZXhPZignKicpPi0xICYmIGNvbltjb24uaW5kZXhPZignKicpKzFdIT0nKicgJiYgY29uW2Nvbi5pbmRleE9mKCcqJyktMV0gIT0nPicpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmaXJzdCA9IGNvbi5pbmRleE9mKCcqJylcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmUgPSBjb24uc2xpY2UoMCxmaXJzdClcclxuICAgICAgICAgICAgICAgICAgICBjb24gPSBjb24uc2xpY2UoZmlyc3QrMSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNlY29uZCA9IGNvbi5pbmRleE9mKCcqJylcclxuICAgICAgICAgICAgICAgICAgICBpZihzZWNvbmQ+LTEgJiYgcHJlW3ByZS5sZW5ndGgtMV0hPSc+Jyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gcHJlKyc8aT4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZWQgKz0gY29uLnNsaWNlKDAsc2Vjb25kKSsnPC9pPidcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uID0gY29uLnNsaWNlKHNlY29uZCsxKVxyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVkICs9IHByZSsoZmlyc3Q+LTE/JyonOicnKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGhhbmRsZWQrPWNvblxyXG4gICAgICAgICAgICAgICAgaWYoaGFuZGxlZCAhPSB2KXtcclxuICAgICAgICAgICAgICAgICAgICB2ID0gaGFuZGxlZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdHJzW2ldID0gdlxyXG4gICAgICAgICAgICBpZih2LmluZGV4T2YoJzxocicpICE9IDAgJiYgdi5pbmRleE9mKCc8aDYnKSAhPSAwICYmIHYuaW5kZXhPZignPGg1JykgIT0gMCAmJiB2LmluZGV4T2YoJzxoNCcpICE9IDAgJiYgdi5pbmRleE9mKCc8aDMnKSAhPSAwICYmIHYuaW5kZXhPZignPGgyJykgIT0gMCAmJiB2LmluZGV4T2YoJzxoMScpICE9IDAgJiYgdi5pbmRleE9mKCc8YmxvY2txdW90ZScpICE9IDApe1xyXG4gICAgICAgICAgICAgICAgc3Ryc1tpXSA9ICc8cD4nK3YrJzwvcD4nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgbmV3QXJyID0gW11cclxuICAgIHN0cnMubWFwKHY9Pm5ld0Fyci5wdXNoKHYpKVxyXG4gICAgcmV0dXJuIG5ld0Fyci5qb2luKCcnKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVWaWV3IiwiaW1wb3J0IHtnZXRDdXJzb3Isc2V0Q3Vyc29yfSBmcm9tICcuL3V0aWwnXHJcbmltcG9ydCB7cmFuZ2VCb2xkLHJhbmdlSXRhbGljc30gZnJvbSAnLi9zaG9ydGN1dCdcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ga2V5Ym9hcmRIb29rKGUpe1xyXG4gICAgY29uc3QgcG9zaXRpb24gPSBnZXRDdXJzb3IodGhpcy5lbnRyeSlcclxuICAgIGNvbnN0IHJhbmdlID0gZG9jdW1lbnQuZ2V0U2VsZWN0aW9uKCkuZ2V0UmFuZ2VBdCgwKVxyXG4gICAgLyog56aB55SoY3RybCsgQiBJIFogWSovXHJcbiAgICBpZihlLmN0cmxLZXkgJiYgKGUua2V5Q29kZSA9PSA2NiB8fCBlLmtleUNvZGUgPT0gNzMgfHwgZS5rZXlDb2RlID09IDkwIHx8IGUua2V5Q29kZSA9PSA4OSkpe1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qIOemgeeUqCDlm57ovaYgVGFiICAqL1xyXG4gICAgaWYoZS5rZXlDb2RlID09IDEzIHx8IGUua2V5Q29kZSA9PSA5KSBlLnByZXZlbnREZWZhdWx0KClcclxuXHJcbiAgICAvKiDnpoHnlKhzaGlmdCtUYWIgKi9cclxuICAgIGlmKGUuc2hpZnRLZXkgJiYgZS5rZXlDb2RlID09IDkpIGUucHJldmVudERlZmF1bHQoKVxyXG5cclxuICAgIC8qIFRhYiDliY3ov5vkuIDooYwgKi9cclxuICAgIGlmKCFlLnNoaWZ0S2V5ICYmIGUua2V5Q29kZSA9PSA5ICl7XHJcbiAgICAgICAgaWYocmFuZ2UuY29sbGFwc2VkKXtcclxuICAgICAgICAgICAgcmFuZ2UuaW5zZXJ0Tm9kZShuZXcgVGV4dChcIiAgICBcIikpXHJcbiAgICAgICAgICAgIHNldEN1cnNvcih0aGlzLmVudHJ5LHBvc2l0aW9uWzBdKzQscG9zaXRpb25bMV0rNClcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgY29uc3QgY29uID0gdGhpcy5lbnRyeS5pbm5lclRleHQuc3BsaXQoJ1xcbicpXHJcbiAgICAgICAgICAgIGxldCBlZmZlY3RlZExpbmVDb3VudCA9IDBcclxuICAgICAgICAgICAgbGV0IGxlbiA9IDBcclxuICAgICAgICAgICAgZm9yKGxldCBpPTA7aTxjb24ubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICBpZihsZW4+cG9zaXRpb25bMF0pe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbltpLTFdID0gJyAgICAnK2NvbltpLTFdXHJcbiAgICAgICAgICAgICAgICAgICAgZWZmZWN0ZWRMaW5lQ291bnQrPTRcclxuICAgICAgICAgICAgICAgICAgICBpZihsZW4+cG9zaXRpb25bMV0pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsZW4gKz0gY29uW2ldLmxlbmd0aCsxXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJFZGl0b3IoY29uLmpvaW4oJ1xcbicpKVxyXG4gICAgICAgICAgICB0aGlzLmFuYWx5c2VkKHRoaXMucmVuZGVyVmlldyh0aGlzLmVudHJ5LmlubmVyVGV4dCkpXHJcbiAgICAgICAgICAgIHNldEN1cnNvcih0aGlzLmVudHJ5LHBvc2l0aW9uWzBdKzQscG9zaXRpb25bMV0rZWZmZWN0ZWRMaW5lQ291bnQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qIHNoaWZ0K1RhYiDpgIDkuIDooYwgKi9cclxuICAgIGlmKGUuc2hpZnRLZXkgJiYgZS5rZXlDb2RlID09IDkpe1xyXG4gICAgICAgIGxldCBjb24gPSB0aGlzLmVudHJ5LmlubmVyVGV4dC5zcGxpdCgnXFxuJylcclxuICAgICAgICBsZXQgZWZmZWN0ZWRMaW5lQ291bnQgPSAwXHJcbiAgICAgICAgbGV0IGxlbiA9IDBcclxuICAgICAgICBsZXQgZmlyc3RPZmZzZXQgPSAtMVxyXG4gICAgICAgIGZvcihsZXQgaT0wO2k8Y29uLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBpZihsZW4+cG9zaXRpb25bMF0pe1xyXG4gICAgICAgICAgICAgICAgaWYoZmlyc3RPZmZzZXQ9PS0xKSBmaXJzdE9mZnNldCA9IGNvbltpLTFdLmxlbmd0aCAtIGNvbltpLTFdLnJlcGxhY2UoL15cXHMrLywnJykubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGU9MDtlPDQ7ZSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihjb25baS0xXVswXSA9PSAnICcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlZmZlY3RlZExpbmVDb3VudCs9MVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25baS0xXSA9IGNvbltpLTFdLnNsaWNlKDEpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYobGVuPnBvc2l0aW9uWzFdKXtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZW4gKz0gY29uW2ldLmxlbmd0aCsxXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVuZGVyRWRpdG9yKGNvbi5qb2luKCdcXG4nKSlcclxuICAgICAgICB0aGlzLmFuYWx5c2VkKHRoaXMucmVuZGVyVmlldyh0aGlzLmVudHJ5LmlubmVyVGV4dCkpXHJcbiAgICAgICAgc2V0Q3Vyc29yKHRoaXMuZW50cnkscG9zaXRpb25bMF0tZmlyc3RPZmZzZXQscG9zaXRpb25bMV0tZWZmZWN0ZWRMaW5lQ291bnQpXHJcbiAgICB9XHJcblxyXG4gICAgLyog5aSE55CGIOWKoOeyl++8jOaWnOS9kyAqL1xyXG4gICAgaWYoZS5jdHJsS2V5KXtcclxuICAgICAgICBpZihlLmtleUNvZGUgPT0gNjYpe1xyXG4gICAgICAgICAgICByYW5nZUJvbGQocmFuZ2UpXHJcbiAgICAgICAgfWVsc2UgaWYoZS5rZXlDb2RlID09IDczKXtcclxuICAgICAgICAgICAgcmFuZ2VJdGFsaWNzKHJhbmdlKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKiDlpITnkIbmkqTlm57vvIzmgaLlpI3vvIzmuLLmn5MgKi9cclxuICAgIGlmKGUuY3RybEtleSAmJiBlLmtleUNvZGUgPT0gOTApe1xyXG4gICAgICAgIHRoaXMudW5kbygpXHJcbiAgICB9ZWxzZSBpZihlLmN0cmxLZXkgJiYgZS5rZXlDb2RlID09IDg5KXtcclxuICAgICAgICB0aGlzLnJlZG8oKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgaWYoZS5rZXlDb2RlICE9IDM3ICYmIGUua2V5Q29kZSAhPSAzOCAmJiBlLmtleUNvZGUgIT0gMzkgJiYgZS5rZXlDb2RlICE9IDQwICYmIGUua2V5IT0nUHJvY2Vzcycpe1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlckVkaXRvcih0aGlzLmVudHJ5LmlubmVyVGV4dClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgIGxldCByYW5nZSA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5nZXRSYW5nZUF0KDApXHJcbiAgICAgICAgLyog5aSE55CG5Zue6L2m55u45YWzICovXHJcbiAgICAgICAgaWYoZS5rZXlDb2RlID09IDEzKXtcclxuXHJcbiAgICAgICAgICAgIC8v5aSE55CG5o2i6KGMXHJcbiAgICAgICAgICAgIGlmKHRoaXMuZW50cnkuaW5uZXJUZXh0Lmxlbmd0aCA9PSBwb3NpdGlvblswXSkgcmFuZ2UuaW5zZXJ0Tm9kZShuZXcgVGV4dCgnXFxuJykpXHJcbiAgICAgICAgICAgIHJhbmdlLmluc2VydE5vZGUobmV3IFRleHQoJ1xcbicpKVxyXG4gICAgICAgICAgICBzZXRDdXJzb3IodGhpcy5lbnRyeSxwb3NpdGlvblswXSsxLHBvc2l0aW9uWzFdKzEpXHJcblxyXG4gICAgICAgICAgICAvL+WkhOeQhuaXoOW6j+acieW6j+WIl+ihqOaNouihjOagt+W8j1xyXG4gICAgICAgICAgICBpZihyYW5nZS5jb2xsYXBzZWQpe1xyXG4gICAgICAgICAgICAgICAgaWYocmFuZ2Uuc3RhcnRDb250YWluZXIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IHJhbmdlLnN0YXJ0Q29udGFpbmVyLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZW50cnkuY29udGFpbnMocGFyZW50KSAmJiBwYXJlbnQudGFnTmFtZSA9PSAnVUwnKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpLmlubmVySFRNTCA9ICc8c3Bhbj4tIDwvc3Bhbj4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlLmluc2VydE5vZGUobGkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEN1cnNvcih0aGlzLmVudHJ5LHBvc2l0aW9uWzBdKzMscG9zaXRpb25bMF0rMylcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZih0aGlzLmVudHJ5LmNvbnRhaW5zKHBhcmVudCkgJiYgcGFyZW50LnRhZ05hbWUgPT0gJ09MJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0TnVtYmVyID0gTnVtYmVyKHBhcmVudC5sYXN0Q2hpbGQucXVlcnlTZWxlY3Rvcignc3BhbicpLmlubmVyVGV4dCkrMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaS5pbm5lckhUTUwgPSAnPHNwYW4+JytsYXN0TnVtYmVyKycuIDwvc3Bhbj4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlLmluc2VydE5vZGUobGkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEN1cnNvcih0aGlzLmVudHJ5LHBvc2l0aW9uWzBdKzMrU3RyaW5nKGxhc3ROdW1iZXIpLmxlbmd0aCxwb3NpdGlvblswXSszK1N0cmluZyhsYXN0TnVtYmVyKS5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qIOWFqOmDqOWkhOeQhuS5i+WQjuS/neWtmCAqL1xyXG4gICAgICAgIGlmKGUua2V5Q29kZSA9PSAzNyB8fCBlLmtleUNvZGUgPT0gMzggfHwgZS5rZXlDb2RlID09IDM5IHx8IGUua2V5Q29kZSA9PSA0MCB8fCBlLmFsdEtleSkgcmV0dXJuXHJcbiAgICAgICAgaWYoZS5jdHJsS2V5ICYmIChlLmtleUNvZGUgPT0gOTAgfHwgZS5rZXlDb2RlID09IDg5KSkgcmV0dXJuXHJcbiAgICAgICAgaWYoZS5rZXkgPT0gJ1Byb2Nlc3MnICYmIChlLmNvZGUgIT0gJ1NwYWNlJyAmJiBlLmNvZGUhPSdQZXJpb2QnICYmIGUuY29kZSE9J0NvbW1hJyAmJiBlLmNvZGUhPSdEaWdpdDEnKSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0b3IodGhpcy5lbnRyeS5pbm5lclRleHQpXHJcbiAgICAgICAgdGhpcy5hbmFseXNlZCh0aGlzLnJlbmRlclZpZXcodGhpcy5lbnRyeS5pbm5lclRleHQpKVxyXG4gICAgICAgIHRoaXMuc2F2ZUNhY2hlKClcclxuICAgIH0sMTApXHJcbn0iLCIvKiBQcmlzbUpTIDEuMjguMFxyXG5odHRwczovL3ByaXNtanMuY29tL2Rvd25sb2FkLmh0bWwjdGhlbWVzPXByaXNtLXRvbW9ycm93Jmxhbmd1YWdlcz1tYXJrdXArY3NzK2NsaWtlK2phdmFzY3JpcHQranNvbittYXJrdXAtdGVtcGxhdGluZytqc3grdHN4K3R5cGVzY3JpcHQmcGx1Z2lucz1qc29ucC1oaWdobGlnaHQgKi9cclxudmFyIF9zZWxmPVwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBXb3JrZXJHbG9iYWxTY29wZSYmc2VsZiBpbnN0YW5jZW9mIFdvcmtlckdsb2JhbFNjb3BlP3NlbGY6e30sUHJpc209ZnVuY3Rpb24oZSl7dmFyIG49Lyg/Ol58XFxzKWxhbmcoPzp1YWdlKT8tKFtcXHctXSspKD89XFxzfCQpL2ksdD0wLHI9e30sYT17bWFudWFsOmUuUHJpc20mJmUuUHJpc20ubWFudWFsLGRpc2FibGVXb3JrZXJNZXNzYWdlSGFuZGxlcjplLlByaXNtJiZlLlByaXNtLmRpc2FibGVXb3JrZXJNZXNzYWdlSGFuZGxlcix1dGlsOntlbmNvZGU6ZnVuY3Rpb24gZShuKXtyZXR1cm4gbiBpbnN0YW5jZW9mIGk/bmV3IGkobi50eXBlLGUobi5jb250ZW50KSxuLmFsaWFzKTpBcnJheS5pc0FycmF5KG4pP24ubWFwKGUpOm4ucmVwbGFjZSgvJi9nLFwiJmFtcDtcIikucmVwbGFjZSgvPC9nLFwiJmx0O1wiKS5yZXBsYWNlKC9cXHUwMGEwL2csXCIgXCIpfSx0eXBlOmZ1bmN0aW9uKGUpe3JldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZSkuc2xpY2UoOCwtMSl9LG9iaklkOmZ1bmN0aW9uKGUpe3JldHVybiBlLl9faWR8fE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19pZFwiLHt2YWx1ZTorK3R9KSxlLl9faWR9LGNsb25lOmZ1bmN0aW9uIGUobix0KXt2YXIgcixpO3N3aXRjaCh0PXR8fHt9LGEudXRpbC50eXBlKG4pKXtjYXNlXCJPYmplY3RcIjppZihpPWEudXRpbC5vYmpJZChuKSx0W2ldKXJldHVybiB0W2ldO2Zvcih2YXIgbCBpbiByPXt9LHRbaV09cixuKW4uaGFzT3duUHJvcGVydHkobCkmJihyW2xdPWUobltsXSx0KSk7cmV0dXJuIHI7Y2FzZVwiQXJyYXlcIjpyZXR1cm4gaT1hLnV0aWwub2JqSWQobiksdFtpXT90W2ldOihyPVtdLHRbaV09cixuLmZvckVhY2goKGZ1bmN0aW9uKG4sYSl7clthXT1lKG4sdCl9KSkscik7ZGVmYXVsdDpyZXR1cm4gbn19LGdldExhbmd1YWdlOmZ1bmN0aW9uKGUpe2Zvcig7ZTspe3ZhciB0PW4uZXhlYyhlLmNsYXNzTmFtZSk7aWYodClyZXR1cm4gdFsxXS50b0xvd2VyQ2FzZSgpO2U9ZS5wYXJlbnRFbGVtZW50fXJldHVyblwibm9uZVwifSxzZXRMYW5ndWFnZTpmdW5jdGlvbihlLHQpe2UuY2xhc3NOYW1lPWUuY2xhc3NOYW1lLnJlcGxhY2UoUmVnRXhwKG4sXCJnaVwiKSxcIlwiKSxlLmNsYXNzTGlzdC5hZGQoXCJsYW5ndWFnZS1cIit0KX0sY3VycmVudFNjcmlwdDpmdW5jdGlvbigpe2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBkb2N1bWVudClyZXR1cm4gbnVsbDtpZihcImN1cnJlbnRTY3JpcHRcImluIGRvY3VtZW50KXJldHVybiBkb2N1bWVudC5jdXJyZW50U2NyaXB0O3RyeXt0aHJvdyBuZXcgRXJyb3J9Y2F0Y2gocil7dmFyIGU9KC9hdCBbXihcXHJcXG5dKlxcKCguKik6W146XSs6W146XStcXCkkL2kuZXhlYyhyLnN0YWNrKXx8W10pWzFdO2lmKGUpe3ZhciBuPWRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO2Zvcih2YXIgdCBpbiBuKWlmKG5bdF0uc3JjPT1lKXJldHVybiBuW3RdfXJldHVybiBudWxsfX0saXNBY3RpdmU6ZnVuY3Rpb24oZSxuLHQpe2Zvcih2YXIgcj1cIm5vLVwiK247ZTspe3ZhciBhPWUuY2xhc3NMaXN0O2lmKGEuY29udGFpbnMobikpcmV0dXJuITA7aWYoYS5jb250YWlucyhyKSlyZXR1cm4hMTtlPWUucGFyZW50RWxlbWVudH1yZXR1cm4hIXR9fSxsYW5ndWFnZXM6e3BsYWluOnIscGxhaW50ZXh0OnIsdGV4dDpyLHR4dDpyLGV4dGVuZDpmdW5jdGlvbihlLG4pe3ZhciB0PWEudXRpbC5jbG9uZShhLmxhbmd1YWdlc1tlXSk7Zm9yKHZhciByIGluIG4pdFtyXT1uW3JdO3JldHVybiB0fSxpbnNlcnRCZWZvcmU6ZnVuY3Rpb24oZSxuLHQscil7dmFyIGk9KHI9cnx8YS5sYW5ndWFnZXMpW2VdLGw9e307Zm9yKHZhciBvIGluIGkpaWYoaS5oYXNPd25Qcm9wZXJ0eShvKSl7aWYobz09bilmb3IodmFyIHMgaW4gdCl0Lmhhc093blByb3BlcnR5KHMpJiYobFtzXT10W3NdKTt0Lmhhc093blByb3BlcnR5KG8pfHwobFtvXT1pW29dKX12YXIgdT1yW2VdO3JldHVybiByW2VdPWwsYS5sYW5ndWFnZXMuREZTKGEubGFuZ3VhZ2VzLChmdW5jdGlvbihuLHQpe3Q9PT11JiZuIT1lJiYodGhpc1tuXT1sKX0pKSxsfSxERlM6ZnVuY3Rpb24gZShuLHQscixpKXtpPWl8fHt9O3ZhciBsPWEudXRpbC5vYmpJZDtmb3IodmFyIG8gaW4gbilpZihuLmhhc093blByb3BlcnR5KG8pKXt0LmNhbGwobixvLG5bb10scnx8byk7dmFyIHM9bltvXSx1PWEudXRpbC50eXBlKHMpO1wiT2JqZWN0XCIhPT11fHxpW2wocyldP1wiQXJyYXlcIiE9PXV8fGlbbChzKV18fChpW2wocyldPSEwLGUocyx0LG8saSkpOihpW2wocyldPSEwLGUocyx0LG51bGwsaSkpfX19LHBsdWdpbnM6e30saGlnaGxpZ2h0QWxsOmZ1bmN0aW9uKGUsbil7YS5oaWdobGlnaHRBbGxVbmRlcihkb2N1bWVudCxlLG4pfSxoaWdobGlnaHRBbGxVbmRlcjpmdW5jdGlvbihlLG4sdCl7dmFyIHI9e2NhbGxiYWNrOnQsY29udGFpbmVyOmUsc2VsZWN0b3I6J2NvZGVbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdLCBbY2xhc3MqPVwibGFuZ3VhZ2UtXCJdIGNvZGUsIGNvZGVbY2xhc3MqPVwibGFuZy1cIl0sIFtjbGFzcyo9XCJsYW5nLVwiXSBjb2RlJ307YS5ob29rcy5ydW4oXCJiZWZvcmUtaGlnaGxpZ2h0YWxsXCIsciksci5lbGVtZW50cz1BcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoci5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbChyLnNlbGVjdG9yKSksYS5ob29rcy5ydW4oXCJiZWZvcmUtYWxsLWVsZW1lbnRzLWhpZ2hsaWdodFwiLHIpO2Zvcih2YXIgaSxsPTA7aT1yLmVsZW1lbnRzW2wrK107KWEuaGlnaGxpZ2h0RWxlbWVudChpLCEwPT09bixyLmNhbGxiYWNrKX0saGlnaGxpZ2h0RWxlbWVudDpmdW5jdGlvbihuLHQscil7dmFyIGk9YS51dGlsLmdldExhbmd1YWdlKG4pLGw9YS5sYW5ndWFnZXNbaV07YS51dGlsLnNldExhbmd1YWdlKG4saSk7dmFyIG89bi5wYXJlbnRFbGVtZW50O28mJlwicHJlXCI9PT1vLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkmJmEudXRpbC5zZXRMYW5ndWFnZShvLGkpO3ZhciBzPXtlbGVtZW50Om4sbGFuZ3VhZ2U6aSxncmFtbWFyOmwsY29kZTpuLnRleHRDb250ZW50fTtmdW5jdGlvbiB1KGUpe3MuaGlnaGxpZ2h0ZWRDb2RlPWUsYS5ob29rcy5ydW4oXCJiZWZvcmUtaW5zZXJ0XCIscykscy5lbGVtZW50LmlubmVySFRNTD1zLmhpZ2hsaWdodGVkQ29kZSxhLmhvb2tzLnJ1bihcImFmdGVyLWhpZ2hsaWdodFwiLHMpLGEuaG9va3MucnVuKFwiY29tcGxldGVcIixzKSxyJiZyLmNhbGwocy5lbGVtZW50KX1pZihhLmhvb2tzLnJ1bihcImJlZm9yZS1zYW5pdHktY2hlY2tcIixzKSwobz1zLmVsZW1lbnQucGFyZW50RWxlbWVudCkmJlwicHJlXCI9PT1vLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkmJiFvLmhhc0F0dHJpYnV0ZShcInRhYmluZGV4XCIpJiZvLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsXCIwXCIpLCFzLmNvZGUpcmV0dXJuIGEuaG9va3MucnVuKFwiY29tcGxldGVcIixzKSx2b2lkKHImJnIuY2FsbChzLmVsZW1lbnQpKTtpZihhLmhvb2tzLnJ1bihcImJlZm9yZS1oaWdobGlnaHRcIixzKSxzLmdyYW1tYXIpaWYodCYmZS5Xb3JrZXIpe3ZhciBjPW5ldyBXb3JrZXIoYS5maWxlbmFtZSk7Yy5vbm1lc3NhZ2U9ZnVuY3Rpb24oZSl7dShlLmRhdGEpfSxjLnBvc3RNZXNzYWdlKEpTT04uc3RyaW5naWZ5KHtsYW5ndWFnZTpzLmxhbmd1YWdlLGNvZGU6cy5jb2RlLGltbWVkaWF0ZUNsb3NlOiEwfSkpfWVsc2UgdShhLmhpZ2hsaWdodChzLmNvZGUscy5ncmFtbWFyLHMubGFuZ3VhZ2UpKTtlbHNlIHUoYS51dGlsLmVuY29kZShzLmNvZGUpKX0saGlnaGxpZ2h0OmZ1bmN0aW9uKGUsbix0KXt2YXIgcj17Y29kZTplLGdyYW1tYXI6bixsYW5ndWFnZTp0fTtpZihhLmhvb2tzLnJ1bihcImJlZm9yZS10b2tlbml6ZVwiLHIpLCFyLmdyYW1tYXIpdGhyb3cgbmV3IEVycm9yKCdUaGUgbGFuZ3VhZ2UgXCInK3IubGFuZ3VhZ2UrJ1wiIGhhcyBubyBncmFtbWFyLicpO3JldHVybiByLnRva2Vucz1hLnRva2VuaXplKHIuY29kZSxyLmdyYW1tYXIpLGEuaG9va3MucnVuKFwiYWZ0ZXItdG9rZW5pemVcIixyKSxpLnN0cmluZ2lmeShhLnV0aWwuZW5jb2RlKHIudG9rZW5zKSxyLmxhbmd1YWdlKX0sdG9rZW5pemU6ZnVuY3Rpb24oZSxuKXt2YXIgdD1uLnJlc3Q7aWYodCl7Zm9yKHZhciByIGluIHQpbltyXT10W3JdO2RlbGV0ZSBuLnJlc3R9dmFyIGE9bmV3IHM7cmV0dXJuIHUoYSxhLmhlYWQsZSksbyhlLGEsbixhLmhlYWQsMCksZnVuY3Rpb24oZSl7Zm9yKHZhciBuPVtdLHQ9ZS5oZWFkLm5leHQ7dCE9PWUudGFpbDspbi5wdXNoKHQudmFsdWUpLHQ9dC5uZXh0O3JldHVybiBufShhKX0saG9va3M6e2FsbDp7fSxhZGQ6ZnVuY3Rpb24oZSxuKXt2YXIgdD1hLmhvb2tzLmFsbDt0W2VdPXRbZV18fFtdLHRbZV0ucHVzaChuKX0scnVuOmZ1bmN0aW9uKGUsbil7dmFyIHQ9YS5ob29rcy5hbGxbZV07aWYodCYmdC5sZW5ndGgpZm9yKHZhciByLGk9MDtyPXRbaSsrXTspcihuKX19LFRva2VuOml9O2Z1bmN0aW9uIGkoZSxuLHQscil7dGhpcy50eXBlPWUsdGhpcy5jb250ZW50PW4sdGhpcy5hbGlhcz10LHRoaXMubGVuZ3RoPTB8KHJ8fFwiXCIpLmxlbmd0aH1mdW5jdGlvbiBsKGUsbix0LHIpe2UubGFzdEluZGV4PW47dmFyIGE9ZS5leGVjKHQpO2lmKGEmJnImJmFbMV0pe3ZhciBpPWFbMV0ubGVuZ3RoO2EuaW5kZXgrPWksYVswXT1hWzBdLnNsaWNlKGkpfXJldHVybiBhfWZ1bmN0aW9uIG8oZSxuLHQscixzLGcpe2Zvcih2YXIgZiBpbiB0KWlmKHQuaGFzT3duUHJvcGVydHkoZikmJnRbZl0pe3ZhciBoPXRbZl07aD1BcnJheS5pc0FycmF5KGgpP2g6W2hdO2Zvcih2YXIgZD0wO2Q8aC5sZW5ndGg7KytkKXtpZihnJiZnLmNhdXNlPT1mK1wiLFwiK2QpcmV0dXJuO3ZhciB2PWhbZF0scD12Lmluc2lkZSxtPSEhdi5sb29rYmVoaW5kLHk9ISF2LmdyZWVkeSxrPXYuYWxpYXM7aWYoeSYmIXYucGF0dGVybi5nbG9iYWwpe3ZhciB4PXYucGF0dGVybi50b1N0cmluZygpLm1hdGNoKC9baW1zdXldKiQvKVswXTt2LnBhdHRlcm49UmVnRXhwKHYucGF0dGVybi5zb3VyY2UseCtcImdcIil9Zm9yKHZhciBiPXYucGF0dGVybnx8dix3PXIubmV4dCxBPXM7dyE9PW4udGFpbCYmIShnJiZBPj1nLnJlYWNoKTtBKz13LnZhbHVlLmxlbmd0aCx3PXcubmV4dCl7dmFyIEU9dy52YWx1ZTtpZihuLmxlbmd0aD5lLmxlbmd0aClyZXR1cm47aWYoIShFIGluc3RhbmNlb2YgaSkpe3ZhciBQLEw9MTtpZih5KXtpZighKFA9bChiLEEsZSxtKSl8fFAuaW5kZXg+PWUubGVuZ3RoKWJyZWFrO3ZhciBTPVAuaW5kZXgsTz1QLmluZGV4K1BbMF0ubGVuZ3RoLGo9QTtmb3Ioais9dy52YWx1ZS5sZW5ndGg7Uz49ajspais9KHc9dy5uZXh0KS52YWx1ZS5sZW5ndGg7aWYoQT1qLT13LnZhbHVlLmxlbmd0aCx3LnZhbHVlIGluc3RhbmNlb2YgaSljb250aW51ZTtmb3IodmFyIEM9dztDIT09bi50YWlsJiYoajxPfHxcInN0cmluZ1wiPT10eXBlb2YgQy52YWx1ZSk7Qz1DLm5leHQpTCsrLGorPUMudmFsdWUubGVuZ3RoO0wtLSxFPWUuc2xpY2UoQSxqKSxQLmluZGV4LT1BfWVsc2UgaWYoIShQPWwoYiwwLEUsbSkpKWNvbnRpbnVlO1M9UC5pbmRleDt2YXIgTj1QWzBdLF89RS5zbGljZSgwLFMpLE09RS5zbGljZShTK04ubGVuZ3RoKSxXPUErRS5sZW5ndGg7ZyYmVz5nLnJlYWNoJiYoZy5yZWFjaD1XKTt2YXIgej13LnByZXY7aWYoXyYmKHo9dShuLHosXyksQSs9Xy5sZW5ndGgpLGMobix6LEwpLHc9dShuLHosbmV3IGkoZixwP2EudG9rZW5pemUoTixwKTpOLGssTikpLE0mJnUobix3LE0pLEw+MSl7dmFyIEk9e2NhdXNlOmYrXCIsXCIrZCxyZWFjaDpXfTtvKGUsbix0LHcucHJldixBLEkpLGcmJkkucmVhY2g+Zy5yZWFjaCYmKGcucmVhY2g9SS5yZWFjaCl9fX19fX1mdW5jdGlvbiBzKCl7dmFyIGU9e3ZhbHVlOm51bGwscHJldjpudWxsLG5leHQ6bnVsbH0sbj17dmFsdWU6bnVsbCxwcmV2OmUsbmV4dDpudWxsfTtlLm5leHQ9bix0aGlzLmhlYWQ9ZSx0aGlzLnRhaWw9bix0aGlzLmxlbmd0aD0wfWZ1bmN0aW9uIHUoZSxuLHQpe3ZhciByPW4ubmV4dCxhPXt2YWx1ZTp0LHByZXY6bixuZXh0OnJ9O3JldHVybiBuLm5leHQ9YSxyLnByZXY9YSxlLmxlbmd0aCsrLGF9ZnVuY3Rpb24gYyhlLG4sdCl7Zm9yKHZhciByPW4ubmV4dCxhPTA7YTx0JiZyIT09ZS50YWlsO2ErKylyPXIubmV4dDtuLm5leHQ9cixyLnByZXY9bixlLmxlbmd0aC09YX1pZihlLlByaXNtPWEsaS5zdHJpbmdpZnk9ZnVuY3Rpb24gZShuLHQpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBuKXJldHVybiBuO2lmKEFycmF5LmlzQXJyYXkobikpe3ZhciByPVwiXCI7cmV0dXJuIG4uZm9yRWFjaCgoZnVuY3Rpb24obil7cis9ZShuLHQpfSkpLHJ9dmFyIGk9e3R5cGU6bi50eXBlLGNvbnRlbnQ6ZShuLmNvbnRlbnQsdCksdGFnOlwic3BhblwiLGNsYXNzZXM6W1widG9rZW5cIixuLnR5cGVdLGF0dHJpYnV0ZXM6e30sbGFuZ3VhZ2U6dH0sbD1uLmFsaWFzO2wmJihBcnJheS5pc0FycmF5KGwpP0FycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGkuY2xhc3NlcyxsKTppLmNsYXNzZXMucHVzaChsKSksYS5ob29rcy5ydW4oXCJ3cmFwXCIsaSk7dmFyIG89XCJcIjtmb3IodmFyIHMgaW4gaS5hdHRyaWJ1dGVzKW8rPVwiIFwiK3MrJz1cIicrKGkuYXR0cmlidXRlc1tzXXx8XCJcIikucmVwbGFjZSgvXCIvZyxcIiZxdW90O1wiKSsnXCInO3JldHVyblwiPFwiK2kudGFnKycgY2xhc3M9XCInK2kuY2xhc3Nlcy5qb2luKFwiIFwiKSsnXCInK28rXCI+XCIraS5jb250ZW50K1wiPC9cIitpLnRhZytcIj5cIn0sIWUuZG9jdW1lbnQpcmV0dXJuIGUuYWRkRXZlbnRMaXN0ZW5lcj8oYS5kaXNhYmxlV29ya2VyTWVzc2FnZUhhbmRsZXJ8fGUuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwoZnVuY3Rpb24obil7dmFyIHQ9SlNPTi5wYXJzZShuLmRhdGEpLHI9dC5sYW5ndWFnZSxpPXQuY29kZSxsPXQuaW1tZWRpYXRlQ2xvc2U7ZS5wb3N0TWVzc2FnZShhLmhpZ2hsaWdodChpLGEubGFuZ3VhZ2VzW3JdLHIpKSxsJiZlLmNsb3NlKCl9KSwhMSksYSk6YTt2YXIgZz1hLnV0aWwuY3VycmVudFNjcmlwdCgpO2Z1bmN0aW9uIGYoKXthLm1hbnVhbHx8YS5oaWdobGlnaHRBbGwoKX1pZihnJiYoYS5maWxlbmFtZT1nLnNyYyxnLmhhc0F0dHJpYnV0ZShcImRhdGEtbWFudWFsXCIpJiYoYS5tYW51YWw9ITApKSwhYS5tYW51YWwpe3ZhciBoPWRvY3VtZW50LnJlYWR5U3RhdGU7XCJsb2FkaW5nXCI9PT1ofHxcImludGVyYWN0aXZlXCI9PT1oJiZnJiZnLmRlZmVyP2RvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsZik6d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZT93aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGYpOndpbmRvdy5zZXRUaW1lb3V0KGYsMTYpfXJldHVybiBhfShfc2VsZik7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJihtb2R1bGUuZXhwb3J0cz1QcmlzbSksXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbCYmKGdsb2JhbC5QcmlzbT1QcmlzbSk7XHJcblByaXNtLmxhbmd1YWdlcy5tYXJrdXA9e2NvbW1lbnQ6e3BhdHRlcm46LzwhLS0oPzooPyE8IS0tKVtcXHNcXFNdKSo/LS0+LyxncmVlZHk6ITB9LHByb2xvZzp7cGF0dGVybjovPFxcP1tcXHNcXFNdKz9cXD8+LyxncmVlZHk6ITB9LGRvY3R5cGU6e3BhdHRlcm46LzwhRE9DVFlQRSg/OltePlwiJ1tcXF1dfFwiW15cIl0qXCJ8J1teJ10qJykrKD86XFxbKD86W148XCInXFxdXXxcIlteXCJdKlwifCdbXiddKid8PCg/ISEtLSl8PCEtLSg/OlteLV18LSg/IS0+KSkqLS0+KSpcXF1cXHMqKT8+L2ksZ3JlZWR5OiEwLGluc2lkZTp7XCJpbnRlcm5hbC1zdWJzZXRcIjp7cGF0dGVybjovKF5bXlxcW10qXFxbKVtcXHNcXFNdKyg/PVxcXT4kKS8sbG9va2JlaGluZDohMCxncmVlZHk6ITAsaW5zaWRlOm51bGx9LHN0cmluZzp7cGF0dGVybjovXCJbXlwiXSpcInwnW14nXSonLyxncmVlZHk6ITB9LHB1bmN0dWF0aW9uOi9ePCF8PiR8W1tcXF1dLyxcImRvY3R5cGUtdGFnXCI6L15ET0NUWVBFL2ksbmFtZTovW15cXHM8PidcIl0rL319LGNkYXRhOntwYXR0ZXJuOi88IVxcW0NEQVRBXFxbW1xcc1xcU10qP1xcXVxcXT4vaSxncmVlZHk6ITB9LHRhZzp7cGF0dGVybjovPFxcLz8oPyFcXGQpW15cXHM+XFwvPSQ8JV0rKD86XFxzKD86XFxzKlteXFxzPlxcLz1dKyg/Olxccyo9XFxzKig/OlwiW15cIl0qXCJ8J1teJ10qJ3xbXlxccydcIj49XSsoPz1bXFxzPl0pKXwoPz1bXFxzLz5dKSkpKyk/XFxzKlxcLz8+LyxncmVlZHk6ITAsaW5zaWRlOnt0YWc6e3BhdHRlcm46L148XFwvP1teXFxzPlxcL10rLyxpbnNpZGU6e3B1bmN0dWF0aW9uOi9ePFxcLz8vLG5hbWVzcGFjZTovXlteXFxzPlxcLzpdKzovfX0sXCJzcGVjaWFsLWF0dHJcIjpbXSxcImF0dHItdmFsdWVcIjp7cGF0dGVybjovPVxccyooPzpcIlteXCJdKlwifCdbXiddKid8W15cXHMnXCI+PV0rKS8saW5zaWRlOntwdW5jdHVhdGlvbjpbe3BhdHRlcm46L149LyxhbGlhczpcImF0dHItZXF1YWxzXCJ9LHtwYXR0ZXJuOi9eKFxccyopW1wiJ118W1wiJ10kLyxsb29rYmVoaW5kOiEwfV19fSxwdW5jdHVhdGlvbjovXFwvPz4vLFwiYXR0ci1uYW1lXCI6e3BhdHRlcm46L1teXFxzPlxcL10rLyxpbnNpZGU6e25hbWVzcGFjZTovXlteXFxzPlxcLzpdKzovfX19fSxlbnRpdHk6W3twYXR0ZXJuOi8mW1xcZGEtel17MSw4fTsvaSxhbGlhczpcIm5hbWVkLWVudGl0eVwifSwvJiN4P1tcXGRhLWZdezEsOH07L2ldfSxQcmlzbS5sYW5ndWFnZXMubWFya3VwLnRhZy5pbnNpZGVbXCJhdHRyLXZhbHVlXCJdLmluc2lkZS5lbnRpdHk9UHJpc20ubGFuZ3VhZ2VzLm1hcmt1cC5lbnRpdHksUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cC5kb2N0eXBlLmluc2lkZVtcImludGVybmFsLXN1YnNldFwiXS5pbnNpZGU9UHJpc20ubGFuZ3VhZ2VzLm1hcmt1cCxQcmlzbS5ob29rcy5hZGQoXCJ3cmFwXCIsKGZ1bmN0aW9uKGEpe1wiZW50aXR5XCI9PT1hLnR5cGUmJihhLmF0dHJpYnV0ZXMudGl0bGU9YS5jb250ZW50LnJlcGxhY2UoLyZhbXA7LyxcIiZcIikpfSkpLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcmlzbS5sYW5ndWFnZXMubWFya3VwLnRhZyxcImFkZElubGluZWRcIix7dmFsdWU6ZnVuY3Rpb24oYSxlKXt2YXIgcz17fTtzW1wibGFuZ3VhZ2UtXCIrZV09e3BhdHRlcm46LyhePCFcXFtDREFUQVxcWylbXFxzXFxTXSs/KD89XFxdXFxdPiQpL2ksbG9va2JlaGluZDohMCxpbnNpZGU6UHJpc20ubGFuZ3VhZ2VzW2VdfSxzLmNkYXRhPS9ePCFcXFtDREFUQVxcW3xcXF1cXF0+JC9pO3ZhciB0PXtcImluY2x1ZGVkLWNkYXRhXCI6e3BhdHRlcm46LzwhXFxbQ0RBVEFcXFtbXFxzXFxTXSo/XFxdXFxdPi9pLGluc2lkZTpzfX07dFtcImxhbmd1YWdlLVwiK2VdPXtwYXR0ZXJuOi9bXFxzXFxTXSsvLGluc2lkZTpQcmlzbS5sYW5ndWFnZXNbZV19O3ZhciBuPXt9O25bYV09e3BhdHRlcm46UmVnRXhwKFwiKDxfX1tePl0qPikoPzo8IVxcXFxbQ0RBVEFcXFxcWyg/OlteXFxcXF1dfFxcXFxdKD8hXFxcXF0+KSkqXFxcXF1cXFxcXT58KD8hPCFcXFxcW0NEQVRBXFxcXFspW15dKSo/KD89PC9fXz4pXCIucmVwbGFjZSgvX18vZywoZnVuY3Rpb24oKXtyZXR1cm4gYX0pKSxcImlcIiksbG9va2JlaGluZDohMCxncmVlZHk6ITAsaW5zaWRlOnR9LFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoXCJtYXJrdXBcIixcImNkYXRhXCIsbil9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KFByaXNtLmxhbmd1YWdlcy5tYXJrdXAudGFnLFwiYWRkQXR0cmlidXRlXCIse3ZhbHVlOmZ1bmN0aW9uKGEsZSl7UHJpc20ubGFuZ3VhZ2VzLm1hcmt1cC50YWcuaW5zaWRlW1wic3BlY2lhbC1hdHRyXCJdLnB1c2goe3BhdHRlcm46UmVnRXhwKFwiKF58W1xcXCInXFxcXHNdKSg/OlwiK2ErXCIpXFxcXHMqPVxcXFxzKig/OlxcXCJbXlxcXCJdKlxcXCJ8J1teJ10qJ3xbXlxcXFxzJ1xcXCI+PV0rKD89W1xcXFxzPl0pKVwiLFwiaVwiKSxsb29rYmVoaW5kOiEwLGluc2lkZTp7XCJhdHRyLW5hbWVcIjovXlteXFxzPV0rLyxcImF0dHItdmFsdWVcIjp7cGF0dGVybjovPVtcXHNcXFNdKy8saW5zaWRlOnt2YWx1ZTp7cGF0dGVybjovKF49XFxzKihbXCInXXwoPyFbXCInXSkpKVxcU1tcXHNcXFNdKig/PVxcMiQpLyxsb29rYmVoaW5kOiEwLGFsaWFzOltlLFwibGFuZ3VhZ2UtXCIrZV0saW5zaWRlOlByaXNtLmxhbmd1YWdlc1tlXX0scHVuY3R1YXRpb246W3twYXR0ZXJuOi9ePS8sYWxpYXM6XCJhdHRyLWVxdWFsc1wifSwvXCJ8Jy9dfX19fSl9fSksUHJpc20ubGFuZ3VhZ2VzLmh0bWw9UHJpc20ubGFuZ3VhZ2VzLm1hcmt1cCxQcmlzbS5sYW5ndWFnZXMubWF0aG1sPVByaXNtLmxhbmd1YWdlcy5tYXJrdXAsUHJpc20ubGFuZ3VhZ2VzLnN2Zz1QcmlzbS5sYW5ndWFnZXMubWFya3VwLFByaXNtLmxhbmd1YWdlcy54bWw9UHJpc20ubGFuZ3VhZ2VzLmV4dGVuZChcIm1hcmt1cFwiLHt9KSxQcmlzbS5sYW5ndWFnZXMuc3NtbD1QcmlzbS5sYW5ndWFnZXMueG1sLFByaXNtLmxhbmd1YWdlcy5hdG9tPVByaXNtLmxhbmd1YWdlcy54bWwsUHJpc20ubGFuZ3VhZ2VzLnJzcz1QcmlzbS5sYW5ndWFnZXMueG1sO1xyXG4hZnVuY3Rpb24ocyl7dmFyIGU9Lyg/OlwiKD86XFxcXCg/OlxcclxcbnxbXFxzXFxTXSl8W15cIlxcXFxcXHJcXG5dKSpcInwnKD86XFxcXCg/OlxcclxcbnxbXFxzXFxTXSl8W14nXFxcXFxcclxcbl0pKicpLztzLmxhbmd1YWdlcy5jc3M9e2NvbW1lbnQ6L1xcL1xcKltcXHNcXFNdKj9cXCpcXC8vLGF0cnVsZTp7cGF0dGVybjpSZWdFeHAoXCJAW1xcXFx3LV0oPzpbXjt7XFxcXHNcXFwiJ118XFxcXHMrKD8hXFxcXHMpfFwiK2Uuc291cmNlK1wiKSo/KD86O3woPz1cXFxccypcXFxceykpXCIpLGluc2lkZTp7cnVsZTovXkBbXFx3LV0rLyxcInNlbGVjdG9yLWZ1bmN0aW9uLWFyZ3VtZW50XCI6e3BhdHRlcm46LyhcXGJzZWxlY3RvclxccypcXChcXHMqKD8hW1xccyldKSkoPzpbXigpXFxzXXxcXHMrKD8hW1xccyldKXxcXCgoPzpbXigpXXxcXChbXigpXSpcXCkpKlxcKSkrKD89XFxzKlxcKSkvLGxvb2tiZWhpbmQ6ITAsYWxpYXM6XCJzZWxlY3RvclwifSxrZXl3b3JkOntwYXR0ZXJuOi8oXnxbXlxcdy1dKSg/OmFuZHxub3R8b25seXxvcikoPyFbXFx3LV0pLyxsb29rYmVoaW5kOiEwfX19LHVybDp7cGF0dGVybjpSZWdFeHAoXCJcXFxcYnVybFxcXFwoKD86XCIrZS5zb3VyY2UrXCJ8KD86W15cXFxcXFxcXFxcclxcbigpXFxcIiddfFxcXFxcXFxcW15dKSopXFxcXClcIixcImlcIiksZ3JlZWR5OiEwLGluc2lkZTp7ZnVuY3Rpb246L151cmwvaSxwdW5jdHVhdGlvbjovXlxcKHxcXCkkLyxzdHJpbmc6e3BhdHRlcm46UmVnRXhwKFwiXlwiK2Uuc291cmNlK1wiJFwiKSxhbGlhczpcInVybFwifX19LHNlbGVjdG9yOntwYXR0ZXJuOlJlZ0V4cChcIihefFt7fVxcXFxzXSlbXnt9XFxcXHNdKD86W157fTtcXFwiJ1xcXFxzXXxcXFxccysoPyFbXFxcXHN7XSl8XCIrZS5zb3VyY2UrXCIpKig/PVxcXFxzKlxcXFx7KVwiKSxsb29rYmVoaW5kOiEwfSxzdHJpbmc6e3BhdHRlcm46ZSxncmVlZHk6ITB9LHByb3BlcnR5OntwYXR0ZXJuOi8oXnxbXi1cXHdcXHhBMC1cXHVGRkZGXSkoPyFcXHMpWy1fYS16XFx4QTAtXFx1RkZGRl0oPzooPyFcXHMpWy1cXHdcXHhBMC1cXHVGRkZGXSkqKD89XFxzKjopL2ksbG9va2JlaGluZDohMH0saW1wb3J0YW50Oi8haW1wb3J0YW50XFxiL2ksZnVuY3Rpb246e3BhdHRlcm46LyhefFteLWEtejAtOV0pWy1hLXowLTldKyg/PVxcKCkvaSxsb29rYmVoaW5kOiEwfSxwdW5jdHVhdGlvbjovWygpe307OixdL30scy5sYW5ndWFnZXMuY3NzLmF0cnVsZS5pbnNpZGUucmVzdD1zLmxhbmd1YWdlcy5jc3M7dmFyIHQ9cy5sYW5ndWFnZXMubWFya3VwO3QmJih0LnRhZy5hZGRJbmxpbmVkKFwic3R5bGVcIixcImNzc1wiKSx0LnRhZy5hZGRBdHRyaWJ1dGUoXCJzdHlsZVwiLFwiY3NzXCIpKX0oUHJpc20pO1xyXG5QcmlzbS5sYW5ndWFnZXMuY2xpa2U9e2NvbW1lbnQ6W3twYXR0ZXJuOi8oXnxbXlxcXFxdKVxcL1xcKltcXHNcXFNdKj8oPzpcXCpcXC98JCkvLGxvb2tiZWhpbmQ6ITAsZ3JlZWR5OiEwfSx7cGF0dGVybjovKF58W15cXFxcOl0pXFwvXFwvLiovLGxvb2tiZWhpbmQ6ITAsZ3JlZWR5OiEwfV0sc3RyaW5nOntwYXR0ZXJuOi8oW1wiJ10pKD86XFxcXCg/OlxcclxcbnxbXFxzXFxTXSl8KD8hXFwxKVteXFxcXFxcclxcbl0pKlxcMS8sZ3JlZWR5OiEwfSxcImNsYXNzLW5hbWVcIjp7cGF0dGVybjovKFxcYig/OmNsYXNzfGV4dGVuZHN8aW1wbGVtZW50c3xpbnN0YW5jZW9mfGludGVyZmFjZXxuZXd8dHJhaXQpXFxzK3xcXGJjYXRjaFxccytcXCgpW1xcdy5cXFxcXSsvaSxsb29rYmVoaW5kOiEwLGluc2lkZTp7cHVuY3R1YXRpb246L1suXFxcXF0vfX0sa2V5d29yZDovXFxiKD86YnJlYWt8Y2F0Y2h8Y29udGludWV8ZG98ZWxzZXxmaW5hbGx5fGZvcnxmdW5jdGlvbnxpZnxpbnxpbnN0YW5jZW9mfG5ld3xudWxsfHJldHVybnx0aHJvd3x0cnl8d2hpbGUpXFxiLyxib29sZWFuOi9cXGIoPzpmYWxzZXx0cnVlKVxcYi8sZnVuY3Rpb246L1xcYlxcdysoPz1cXCgpLyxudW1iZXI6L1xcYjB4W1xcZGEtZl0rXFxifCg/OlxcYlxcZCsoPzpcXC5cXGQqKT98XFxCXFwuXFxkKykoPzplWystXT9cXGQrKT8vaSxvcGVyYXRvcjovWzw+XT0/fFshPV09Pz0/fC0tP3xcXCtcXCs/fCYmP3xcXHxcXHw/fFs/Ki9+XiVdLyxwdW5jdHVhdGlvbjovW3t9W1xcXTsoKSwuOl0vfTtcclxuUHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHQ9UHJpc20ubGFuZ3VhZ2VzLmV4dGVuZChcImNsaWtlXCIse1wiY2xhc3MtbmFtZVwiOltQcmlzbS5sYW5ndWFnZXMuY2xpa2VbXCJjbGFzcy1uYW1lXCJdLHtwYXR0ZXJuOi8oXnxbXiRcXHdcXHhBMC1cXHVGRkZGXSkoPyFcXHMpW18kQS1aXFx4QTAtXFx1RkZGRl0oPzooPyFcXHMpWyRcXHdcXHhBMC1cXHVGRkZGXSkqKD89XFwuKD86Y29uc3RydWN0b3J8cHJvdG90eXBlKSkvLGxvb2tiZWhpbmQ6ITB9XSxrZXl3b3JkOlt7cGF0dGVybjovKCg/Ol58XFx9KVxccyopY2F0Y2hcXGIvLGxvb2tiZWhpbmQ6ITB9LHtwYXR0ZXJuOi8oXnxbXi5dfFxcLlxcLlxcLlxccyopXFxiKD86YXN8YXNzZXJ0KD89XFxzKlxceyl8YXN5bmMoPz1cXHMqKD86ZnVuY3Rpb25cXGJ8XFwofFskXFx3XFx4QTAtXFx1RkZGRl18JCkpfGF3YWl0fGJyZWFrfGNhc2V8Y2xhc3N8Y29uc3R8Y29udGludWV8ZGVidWdnZXJ8ZGVmYXVsdHxkZWxldGV8ZG98ZWxzZXxlbnVtfGV4cG9ydHxleHRlbmRzfGZpbmFsbHkoPz1cXHMqKD86XFx7fCQpKXxmb3J8ZnJvbSg/PVxccyooPzpbJ1wiXXwkKSl8ZnVuY3Rpb258KD86Z2V0fHNldCkoPz1cXHMqKD86WyNcXFskXFx3XFx4QTAtXFx1RkZGRl18JCkpfGlmfGltcGxlbWVudHN8aW1wb3J0fGlufGluc3RhbmNlb2Z8aW50ZXJmYWNlfGxldHxuZXd8bnVsbHxvZnxwYWNrYWdlfHByaXZhdGV8cHJvdGVjdGVkfHB1YmxpY3xyZXR1cm58c3RhdGljfHN1cGVyfHN3aXRjaHx0aGlzfHRocm93fHRyeXx0eXBlb2Z8dW5kZWZpbmVkfHZhcnx2b2lkfHdoaWxlfHdpdGh8eWllbGQpXFxiLyxsb29rYmVoaW5kOiEwfV0sZnVuY3Rpb246LyM/KD8hXFxzKVtfJGEtekEtWlxceEEwLVxcdUZGRkZdKD86KD8hXFxzKVskXFx3XFx4QTAtXFx1RkZGRl0pKig/PVxccyooPzpcXC5cXHMqKD86YXBwbHl8YmluZHxjYWxsKVxccyopP1xcKCkvLG51bWJlcjp7cGF0dGVybjpSZWdFeHAoXCIoXnxbXlxcXFx3JF0pKD86TmFOfEluZmluaXR5fDBbYkJdWzAxXSsoPzpfWzAxXSspKm4/fDBbb09dWzAtN10rKD86X1swLTddKykqbj98MFt4WF1bXFxcXGRBLUZhLWZdKyg/Ol9bXFxcXGRBLUZhLWZdKykqbj98XFxcXGQrKD86X1xcXFxkKykqbnwoPzpcXFxcZCsoPzpfXFxcXGQrKSooPzpcXFxcLig/OlxcXFxkKyg/Ol9cXFxcZCspKik/KT98XFxcXC5cXFxcZCsoPzpfXFxcXGQrKSopKD86W0VlXVsrLV0/XFxcXGQrKD86X1xcXFxkKykqKT8pKD8hW1xcXFx3JF0pXCIpLGxvb2tiZWhpbmQ6ITB9LG9wZXJhdG9yOi8tLXxcXCtcXCt8XFwqXFwqPT98PT58JiY9P3xcXHxcXHw9P3xbIT1dPT18PDw9P3w+Pj4/PT98Wy0rKi8lJnxeIT08Pl09P3xcXC57M318XFw/XFw/PT98XFw/XFwuP3xbfjpdL30pLFByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0W1wiY2xhc3MtbmFtZVwiXVswXS5wYXR0ZXJuPS8oXFxiKD86Y2xhc3N8ZXh0ZW5kc3xpbXBsZW1lbnRzfGluc3RhbmNlb2Z8aW50ZXJmYWNlfG5ldylcXHMrKVtcXHcuXFxcXF0rLyxQcmlzbS5sYW5ndWFnZXMuaW5zZXJ0QmVmb3JlKFwiamF2YXNjcmlwdFwiLFwia2V5d29yZFwiLHtyZWdleDp7cGF0dGVybjpSZWdFeHAoXCIoKD86XnxbXiRcXFxcd1xcXFx4QTAtXFxcXHVGRkZGLlxcXCInXFxcXF0pXFxcXHNdfFxcXFxiKD86cmV0dXJufHlpZWxkKSlcXFxccyopLyg/Oig/OlxcXFxbKD86W15cXFxcXVxcXFxcXFxcXFxyXFxuXXxcXFxcXFxcXC4pKlxcXFxdfFxcXFxcXFxcLnxbXi9cXFxcXFxcXFxcXFxbXFxyXFxuXSkrL1tkZ2lteXVzXXswLDd9fCg/OlxcXFxbKD86W15bXFxcXF1cXFxcXFxcXFxcclxcbl18XFxcXFxcXFwufFxcXFxbKD86W15bXFxcXF1cXFxcXFxcXFxcclxcbl18XFxcXFxcXFwufFxcXFxbKD86W15bXFxcXF1cXFxcXFxcXFxcclxcbl18XFxcXFxcXFwuKSpcXFxcXSkqXFxcXF0pKlxcXFxdfFxcXFxcXFxcLnxbXi9cXFxcXFxcXFxcXFxbXFxyXFxuXSkrL1tkZ2lteXVzXXswLDd9dltkZ2lteXVzXXswLDd9KSg/PSg/OlxcXFxzfC9cXFxcKig/OlteKl18XFxcXCooPyEvKSkqXFxcXCovKSooPzokfFtcXHJcXG4sLjs6fSlcXFxcXV18Ly8pKVwiKSxsb29rYmVoaW5kOiEwLGdyZWVkeTohMCxpbnNpZGU6e1wicmVnZXgtc291cmNlXCI6e3BhdHRlcm46L14oXFwvKVtcXHNcXFNdKyg/PVxcL1thLXpdKiQpLyxsb29rYmVoaW5kOiEwLGFsaWFzOlwibGFuZ3VhZ2UtcmVnZXhcIixpbnNpZGU6UHJpc20ubGFuZ3VhZ2VzLnJlZ2V4fSxcInJlZ2V4LWRlbGltaXRlclwiOi9eXFwvfFxcLyQvLFwicmVnZXgtZmxhZ3NcIjovXlthLXpdKyQvfX0sXCJmdW5jdGlvbi12YXJpYWJsZVwiOntwYXR0ZXJuOi8jPyg/IVxccylbXyRhLXpBLVpcXHhBMC1cXHVGRkZGXSg/Oig/IVxccylbJFxcd1xceEEwLVxcdUZGRkZdKSooPz1cXHMqWz06XVxccyooPzphc3luY1xccyopPyg/OlxcYmZ1bmN0aW9uXFxifCg/OlxcKCg/OlteKCldfFxcKFteKCldKlxcKSkqXFwpfCg/IVxccylbXyRhLXpBLVpcXHhBMC1cXHVGRkZGXSg/Oig/IVxccylbJFxcd1xceEEwLVxcdUZGRkZdKSopXFxzKj0+KSkvLGFsaWFzOlwiZnVuY3Rpb25cIn0scGFyYW1ldGVyOlt7cGF0dGVybjovKGZ1bmN0aW9uKD86XFxzKyg/IVxccylbXyRhLXpBLVpcXHhBMC1cXHVGRkZGXSg/Oig/IVxccylbJFxcd1xceEEwLVxcdUZGRkZdKSopP1xccypcXChcXHMqKSg/IVxccykoPzpbXigpXFxzXXxcXHMrKD8hW1xccyldKXxcXChbXigpXSpcXCkpKyg/PVxccypcXCkpLyxsb29rYmVoaW5kOiEwLGluc2lkZTpQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdH0se3BhdHRlcm46LyhefFteJFxcd1xceEEwLVxcdUZGRkZdKSg/IVxccylbXyRhLXpcXHhBMC1cXHVGRkZGXSg/Oig/IVxccylbJFxcd1xceEEwLVxcdUZGRkZdKSooPz1cXHMqPT4pL2ksbG9va2JlaGluZDohMCxpbnNpZGU6UHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHR9LHtwYXR0ZXJuOi8oXFwoXFxzKikoPyFcXHMpKD86W14oKVxcc118XFxzKyg/IVtcXHMpXSl8XFwoW14oKV0qXFwpKSsoPz1cXHMqXFwpXFxzKj0+KS8sbG9va2JlaGluZDohMCxpbnNpZGU6UHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHR9LHtwYXR0ZXJuOi8oKD86XFxifFxcc3xeKSg/ISg/OmFzfGFzeW5jfGF3YWl0fGJyZWFrfGNhc2V8Y2F0Y2h8Y2xhc3N8Y29uc3R8Y29udGludWV8ZGVidWdnZXJ8ZGVmYXVsdHxkZWxldGV8ZG98ZWxzZXxlbnVtfGV4cG9ydHxleHRlbmRzfGZpbmFsbHl8Zm9yfGZyb218ZnVuY3Rpb258Z2V0fGlmfGltcGxlbWVudHN8aW1wb3J0fGlufGluc3RhbmNlb2Z8aW50ZXJmYWNlfGxldHxuZXd8bnVsbHxvZnxwYWNrYWdlfHByaXZhdGV8cHJvdGVjdGVkfHB1YmxpY3xyZXR1cm58c2V0fHN0YXRpY3xzdXBlcnxzd2l0Y2h8dGhpc3x0aHJvd3x0cnl8dHlwZW9mfHVuZGVmaW5lZHx2YXJ8dm9pZHx3aGlsZXx3aXRofHlpZWxkKSg/IVskXFx3XFx4QTAtXFx1RkZGRl0pKSg/Oig/IVxccylbXyRhLXpBLVpcXHhBMC1cXHVGRkZGXSg/Oig/IVxccylbJFxcd1xceEEwLVxcdUZGRkZdKSpcXHMqKVxcKFxccyp8XFxdXFxzKlxcKFxccyopKD8hXFxzKSg/OlteKClcXHNdfFxccysoPyFbXFxzKV0pfFxcKFteKCldKlxcKSkrKD89XFxzKlxcKVxccypcXHspLyxsb29rYmVoaW5kOiEwLGluc2lkZTpQcmlzbS5sYW5ndWFnZXMuamF2YXNjcmlwdH1dLGNvbnN0YW50Oi9cXGJbQS1aXSg/OltBLVpfXXxcXGR4PykqXFxiL30pLFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoXCJqYXZhc2NyaXB0XCIsXCJzdHJpbmdcIix7aGFzaGJhbmc6e3BhdHRlcm46L14jIS4qLyxncmVlZHk6ITAsYWxpYXM6XCJjb21tZW50XCJ9LFwidGVtcGxhdGUtc3RyaW5nXCI6e3BhdHRlcm46L2AoPzpcXFxcW1xcc1xcU118XFwkXFx7KD86W157fV18XFx7KD86W157fV18XFx7W159XSpcXH0pKlxcfSkrXFx9fCg/IVxcJFxceylbXlxcXFxgXSkqYC8sZ3JlZWR5OiEwLGluc2lkZTp7XCJ0ZW1wbGF0ZS1wdW5jdHVhdGlvblwiOntwYXR0ZXJuOi9eYHxgJC8sYWxpYXM6XCJzdHJpbmdcIn0saW50ZXJwb2xhdGlvbjp7cGF0dGVybjovKCg/Ol58W15cXFxcXSkoPzpcXFxcezJ9KSopXFwkXFx7KD86W157fV18XFx7KD86W157fV18XFx7W159XSpcXH0pKlxcfSkrXFx9Lyxsb29rYmVoaW5kOiEwLGluc2lkZTp7XCJpbnRlcnBvbGF0aW9uLXB1bmN0dWF0aW9uXCI6e3BhdHRlcm46L15cXCRcXHt8XFx9JC8sYWxpYXM6XCJwdW5jdHVhdGlvblwifSxyZXN0OlByaXNtLmxhbmd1YWdlcy5qYXZhc2NyaXB0fX0sc3RyaW5nOi9bXFxzXFxTXSsvfX0sXCJzdHJpbmctcHJvcGVydHlcIjp7cGF0dGVybjovKCg/Ol58Wyx7XSlbIFxcdF0qKShbXCInXSkoPzpcXFxcKD86XFxyXFxufFtcXHNcXFNdKXwoPyFcXDIpW15cXFxcXFxyXFxuXSkqXFwyKD89XFxzKjopL20sbG9va2JlaGluZDohMCxncmVlZHk6ITAsYWxpYXM6XCJwcm9wZXJ0eVwifX0pLFByaXNtLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoXCJqYXZhc2NyaXB0XCIsXCJvcGVyYXRvclwiLHtcImxpdGVyYWwtcHJvcGVydHlcIjp7cGF0dGVybjovKCg/Ol58Wyx7XSlbIFxcdF0qKSg/IVxccylbXyRhLXpBLVpcXHhBMC1cXHVGRkZGXSg/Oig/IVxccylbJFxcd1xceEEwLVxcdUZGRkZdKSooPz1cXHMqOikvbSxsb29rYmVoaW5kOiEwLGFsaWFzOlwicHJvcGVydHlcIn19KSxQcmlzbS5sYW5ndWFnZXMubWFya3VwJiYoUHJpc20ubGFuZ3VhZ2VzLm1hcmt1cC50YWcuYWRkSW5saW5lZChcInNjcmlwdFwiLFwiamF2YXNjcmlwdFwiKSxQcmlzbS5sYW5ndWFnZXMubWFya3VwLnRhZy5hZGRBdHRyaWJ1dGUoXCJvbig/OmFib3J0fGJsdXJ8Y2hhbmdlfGNsaWNrfGNvbXBvc2l0aW9uKD86ZW5kfHN0YXJ0fHVwZGF0ZSl8ZGJsY2xpY2t8ZXJyb3J8Zm9jdXMoPzppbnxvdXQpP3xrZXkoPzpkb3dufHVwKXxsb2FkfG1vdXNlKD86ZG93bnxlbnRlcnxsZWF2ZXxtb3ZlfG91dHxvdmVyfHVwKXxyZXNldHxyZXNpemV8c2Nyb2xsfHNlbGVjdHxzbG90Y2hhbmdlfHN1Ym1pdHx1bmxvYWR8d2hlZWwpXCIsXCJqYXZhc2NyaXB0XCIpKSxQcmlzbS5sYW5ndWFnZXMuanM9UHJpc20ubGFuZ3VhZ2VzLmphdmFzY3JpcHQ7XHJcblByaXNtLmxhbmd1YWdlcy5qc29uPXtwcm9wZXJ0eTp7cGF0dGVybjovKF58W15cXFxcXSlcIig/OlxcXFwufFteXFxcXFwiXFxyXFxuXSkqXCIoPz1cXHMqOikvLGxvb2tiZWhpbmQ6ITAsZ3JlZWR5OiEwfSxzdHJpbmc6e3BhdHRlcm46LyhefFteXFxcXF0pXCIoPzpcXFxcLnxbXlxcXFxcIlxcclxcbl0pKlwiKD8hXFxzKjopLyxsb29rYmVoaW5kOiEwLGdyZWVkeTohMH0sY29tbWVudDp7cGF0dGVybjovXFwvXFwvLip8XFwvXFwqW1xcc1xcU10qPyg/OlxcKlxcL3wkKS8sZ3JlZWR5OiEwfSxudW1iZXI6Ly0/XFxiXFxkKyg/OlxcLlxcZCspPyg/OmVbKy1dP1xcZCspP1xcYi9pLHB1bmN0dWF0aW9uOi9be31bXFxdLF0vLG9wZXJhdG9yOi86Lyxib29sZWFuOi9cXGIoPzpmYWxzZXx0cnVlKVxcYi8sbnVsbDp7cGF0dGVybjovXFxibnVsbFxcYi8sYWxpYXM6XCJrZXl3b3JkXCJ9fSxQcmlzbS5sYW5ndWFnZXMud2VibWFuaWZlc3Q9UHJpc20ubGFuZ3VhZ2VzLmpzb247XHJcbiFmdW5jdGlvbihlKXtmdW5jdGlvbiBuKGUsbil7cmV0dXJuXCJfX19cIitlLnRvVXBwZXJDYXNlKCkrbitcIl9fX1wifU9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGUubGFuZ3VhZ2VzW1wibWFya3VwLXRlbXBsYXRpbmdcIl09e30se2J1aWxkUGxhY2Vob2xkZXJzOnt2YWx1ZTpmdW5jdGlvbih0LGEscixvKXtpZih0Lmxhbmd1YWdlPT09YSl7dmFyIGM9dC50b2tlblN0YWNrPVtdO3QuY29kZT10LmNvZGUucmVwbGFjZShyLChmdW5jdGlvbihlKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBvJiYhbyhlKSlyZXR1cm4gZTtmb3IodmFyIHIsaT1jLmxlbmd0aDstMSE9PXQuY29kZS5pbmRleE9mKHI9bihhLGkpKTspKytpO3JldHVybiBjW2ldPWUscn0pKSx0LmdyYW1tYXI9ZS5sYW5ndWFnZXMubWFya3VwfX19LHRva2VuaXplUGxhY2Vob2xkZXJzOnt2YWx1ZTpmdW5jdGlvbih0LGEpe2lmKHQubGFuZ3VhZ2U9PT1hJiZ0LnRva2VuU3RhY2spe3QuZ3JhbW1hcj1lLmxhbmd1YWdlc1thXTt2YXIgcj0wLG89T2JqZWN0LmtleXModC50b2tlblN0YWNrKTshZnVuY3Rpb24gYyhpKXtmb3IodmFyIHU9MDt1PGkubGVuZ3RoJiYhKHI+PW8ubGVuZ3RoKTt1Kyspe3ZhciBnPWlbdV07aWYoXCJzdHJpbmdcIj09dHlwZW9mIGd8fGcuY29udGVudCYmXCJzdHJpbmdcIj09dHlwZW9mIGcuY29udGVudCl7dmFyIGw9b1tyXSxzPXQudG9rZW5TdGFja1tsXSxmPVwic3RyaW5nXCI9PXR5cGVvZiBnP2c6Zy5jb250ZW50LHA9bihhLGwpLGs9Zi5pbmRleE9mKHApO2lmKGs+LTEpeysrcjt2YXIgbT1mLnN1YnN0cmluZygwLGspLGQ9bmV3IGUuVG9rZW4oYSxlLnRva2VuaXplKHMsdC5ncmFtbWFyKSxcImxhbmd1YWdlLVwiK2EscyksaD1mLnN1YnN0cmluZyhrK3AubGVuZ3RoKSx2PVtdO20mJnYucHVzaC5hcHBseSh2LGMoW21dKSksdi5wdXNoKGQpLGgmJnYucHVzaC5hcHBseSh2LGMoW2hdKSksXCJzdHJpbmdcIj09dHlwZW9mIGc/aS5zcGxpY2UuYXBwbHkoaSxbdSwxXS5jb25jYXQodikpOmcuY29udGVudD12fX1lbHNlIGcuY29udGVudCYmYyhnLmNvbnRlbnQpfXJldHVybiBpfSh0LnRva2Vucyl9fX19KX0oUHJpc20pO1xyXG4hZnVuY3Rpb24odCl7dmFyIG49dC51dGlsLmNsb25lKHQubGFuZ3VhZ2VzLmphdmFzY3JpcHQpLGU9XCIoPzpcXFxcezxTPipcXFxcLnszfSg/Oltee31dfDxCUkFDRVM+KSpcXFxcfSlcIjtmdW5jdGlvbiBhKHQsbil7cmV0dXJuIHQ9dC5yZXBsYWNlKC88Uz4vZywoZnVuY3Rpb24oKXtyZXR1cm5cIig/OlxcXFxzfC8vLiooPyEuKXwvXFxcXCooPzpbXipdfFxcXFwqKD8hLykpXFxcXCovKVwifSkpLnJlcGxhY2UoLzxCUkFDRVM+L2csKGZ1bmN0aW9uKCl7cmV0dXJuXCIoPzpcXFxceyg/OlxcXFx7KD86XFxcXHtbXnt9XSpcXFxcfXxbXnt9XSkqXFxcXH18W157fV0pKlxcXFx9KVwifSkpLnJlcGxhY2UoLzxTUFJFQUQ+L2csKGZ1bmN0aW9uKCl7cmV0dXJuIGV9KSksUmVnRXhwKHQsbil9ZT1hKGUpLnNvdXJjZSx0Lmxhbmd1YWdlcy5qc3g9dC5sYW5ndWFnZXMuZXh0ZW5kKFwibWFya3VwXCIsbiksdC5sYW5ndWFnZXMuanN4LnRhZy5wYXR0ZXJuPWEoXCI8Lz8oPzpbXFxcXHcuOi1dKyg/OjxTPisoPzpbXFxcXHcuOiQtXSsoPzo9KD86XFxcIig/OlxcXFxcXFxcW15dfFteXFxcXFxcXFxcXFwiXSkqXFxcInwnKD86XFxcXFxcXFxbXl18W15cXFxcXFxcXCddKSonfFteXFxcXHN7J1xcXCIvPj1dK3w8QlJBQ0VTPikpP3w8U1BSRUFEPikpKjxTPiovPyk/PlwiKSx0Lmxhbmd1YWdlcy5qc3gudGFnLmluc2lkZS50YWcucGF0dGVybj0vXjxcXC8/W15cXHM+XFwvXSovLHQubGFuZ3VhZ2VzLmpzeC50YWcuaW5zaWRlW1wiYXR0ci12YWx1ZVwiXS5wYXR0ZXJuPS89KD8hXFx7KSg/OlwiKD86XFxcXFtcXHNcXFNdfFteXFxcXFwiXSkqXCJ8Jyg/OlxcXFxbXFxzXFxTXXxbXlxcXFwnXSkqJ3xbXlxccydcIj5dKykvLHQubGFuZ3VhZ2VzLmpzeC50YWcuaW5zaWRlLnRhZy5pbnNpZGVbXCJjbGFzcy1uYW1lXCJdPS9eW0EtWl1cXHcqKD86XFwuW0EtWl1cXHcqKSokLyx0Lmxhbmd1YWdlcy5qc3gudGFnLmluc2lkZS5jb21tZW50PW4uY29tbWVudCx0Lmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoXCJpbnNpZGVcIixcImF0dHItbmFtZVwiLHtzcHJlYWQ6e3BhdHRlcm46YShcIjxTUFJFQUQ+XCIpLGluc2lkZTp0Lmxhbmd1YWdlcy5qc3h9fSx0Lmxhbmd1YWdlcy5qc3gudGFnKSx0Lmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoXCJpbnNpZGVcIixcInNwZWNpYWwtYXR0clwiLHtzY3JpcHQ6e3BhdHRlcm46YShcIj08QlJBQ0VTPlwiKSxhbGlhczpcImxhbmd1YWdlLWphdmFzY3JpcHRcIixpbnNpZGU6e1wic2NyaXB0LXB1bmN0dWF0aW9uXCI6e3BhdHRlcm46L149KD89XFx7KS8sYWxpYXM6XCJwdW5jdHVhdGlvblwifSxyZXN0OnQubGFuZ3VhZ2VzLmpzeH19fSx0Lmxhbmd1YWdlcy5qc3gudGFnKTt2YXIgcz1mdW5jdGlvbih0KXtyZXR1cm4gdD9cInN0cmluZ1wiPT10eXBlb2YgdD90Olwic3RyaW5nXCI9PXR5cGVvZiB0LmNvbnRlbnQ/dC5jb250ZW50OnQuY29udGVudC5tYXAocykuam9pbihcIlwiKTpcIlwifSxnPWZ1bmN0aW9uKG4pe2Zvcih2YXIgZT1bXSxhPTA7YTxuLmxlbmd0aDthKyspe3ZhciBvPW5bYV0saT0hMTtpZihcInN0cmluZ1wiIT10eXBlb2YgbyYmKFwidGFnXCI9PT1vLnR5cGUmJm8uY29udGVudFswXSYmXCJ0YWdcIj09PW8uY29udGVudFswXS50eXBlP1wiPC9cIj09PW8uY29udGVudFswXS5jb250ZW50WzBdLmNvbnRlbnQ/ZS5sZW5ndGg+MCYmZVtlLmxlbmd0aC0xXS50YWdOYW1lPT09cyhvLmNvbnRlbnRbMF0uY29udGVudFsxXSkmJmUucG9wKCk6XCIvPlwiPT09by5jb250ZW50W28uY29udGVudC5sZW5ndGgtMV0uY29udGVudHx8ZS5wdXNoKHt0YWdOYW1lOnMoby5jb250ZW50WzBdLmNvbnRlbnRbMV0pLG9wZW5lZEJyYWNlczowfSk6ZS5sZW5ndGg+MCYmXCJwdW5jdHVhdGlvblwiPT09by50eXBlJiZcIntcIj09PW8uY29udGVudD9lW2UubGVuZ3RoLTFdLm9wZW5lZEJyYWNlcysrOmUubGVuZ3RoPjAmJmVbZS5sZW5ndGgtMV0ub3BlbmVkQnJhY2VzPjAmJlwicHVuY3R1YXRpb25cIj09PW8udHlwZSYmXCJ9XCI9PT1vLmNvbnRlbnQ/ZVtlLmxlbmd0aC0xXS5vcGVuZWRCcmFjZXMtLTppPSEwKSwoaXx8XCJzdHJpbmdcIj09dHlwZW9mIG8pJiZlLmxlbmd0aD4wJiYwPT09ZVtlLmxlbmd0aC0xXS5vcGVuZWRCcmFjZXMpe3ZhciByPXMobyk7YTxuLmxlbmd0aC0xJiYoXCJzdHJpbmdcIj09dHlwZW9mIG5bYSsxXXx8XCJwbGFpbi10ZXh0XCI9PT1uW2ErMV0udHlwZSkmJihyKz1zKG5bYSsxXSksbi5zcGxpY2UoYSsxLDEpKSxhPjAmJihcInN0cmluZ1wiPT10eXBlb2YgblthLTFdfHxcInBsYWluLXRleHRcIj09PW5bYS0xXS50eXBlKSYmKHI9cyhuW2EtMV0pK3Isbi5zcGxpY2UoYS0xLDEpLGEtLSksblthXT1uZXcgdC5Ub2tlbihcInBsYWluLXRleHRcIixyLG51bGwscil9by5jb250ZW50JiZcInN0cmluZ1wiIT10eXBlb2Ygby5jb250ZW50JiZnKG8uY29udGVudCl9fTt0Lmhvb2tzLmFkZChcImFmdGVyLXRva2VuaXplXCIsKGZ1bmN0aW9uKHQpe1wianN4XCIhPT10Lmxhbmd1YWdlJiZcInRzeFwiIT09dC5sYW5ndWFnZXx8Zyh0LnRva2Vucyl9KSl9KFByaXNtKTtcclxuIWZ1bmN0aW9uKGUpe2UubGFuZ3VhZ2VzLnR5cGVzY3JpcHQ9ZS5sYW5ndWFnZXMuZXh0ZW5kKFwiamF2YXNjcmlwdFwiLHtcImNsYXNzLW5hbWVcIjp7cGF0dGVybjovKFxcYig/OmNsYXNzfGV4dGVuZHN8aW1wbGVtZW50c3xpbnN0YW5jZW9mfGludGVyZmFjZXxuZXd8dHlwZSlcXHMrKSg/IWtleW9mXFxiKSg/IVxccylbXyRhLXpBLVpcXHhBMC1cXHVGRkZGXSg/Oig/IVxccylbJFxcd1xceEEwLVxcdUZGRkZdKSooPzpcXHMqPCg/OltePD5dfDwoPzpbXjw+XXw8W148Pl0qPikqPikqPik/Lyxsb29rYmVoaW5kOiEwLGdyZWVkeTohMCxpbnNpZGU6bnVsbH0sYnVpbHRpbjovXFxiKD86QXJyYXl8RnVuY3Rpb258UHJvbWlzZXxhbnl8Ym9vbGVhbnxjb25zb2xlfG5ldmVyfG51bWJlcnxzdHJpbmd8c3ltYm9sfHVua25vd24pXFxiL30pLGUubGFuZ3VhZ2VzLnR5cGVzY3JpcHQua2V5d29yZC5wdXNoKC9cXGIoPzphYnN0cmFjdHxkZWNsYXJlfGlzfGtleW9mfHJlYWRvbmx5fHJlcXVpcmUpXFxiLywvXFxiKD86YXNzZXJ0c3xpbmZlcnxpbnRlcmZhY2V8bW9kdWxlfG5hbWVzcGFjZXx0eXBlKVxcYig/PVxccyooPzpbe18kYS16QS1aXFx4QTAtXFx1RkZGRl18JCkpLywvXFxidHlwZVxcYig/PVxccyooPzpbXFx7Kl18JCkpLyksZGVsZXRlIGUubGFuZ3VhZ2VzLnR5cGVzY3JpcHQucGFyYW1ldGVyLGRlbGV0ZSBlLmxhbmd1YWdlcy50eXBlc2NyaXB0W1wibGl0ZXJhbC1wcm9wZXJ0eVwiXTt2YXIgcz1lLmxhbmd1YWdlcy5leHRlbmQoXCJ0eXBlc2NyaXB0XCIse30pO2RlbGV0ZSBzW1wiY2xhc3MtbmFtZVwiXSxlLmxhbmd1YWdlcy50eXBlc2NyaXB0W1wiY2xhc3MtbmFtZVwiXS5pbnNpZGU9cyxlLmxhbmd1YWdlcy5pbnNlcnRCZWZvcmUoXCJ0eXBlc2NyaXB0XCIsXCJmdW5jdGlvblwiLHtkZWNvcmF0b3I6e3BhdHRlcm46L0BbJFxcd1xceEEwLVxcdUZGRkZdKy8saW5zaWRlOnthdDp7cGF0dGVybjovXkAvLGFsaWFzOlwib3BlcmF0b3JcIn0sZnVuY3Rpb246L15bXFxzXFxTXSsvfX0sXCJnZW5lcmljLWZ1bmN0aW9uXCI6e3BhdHRlcm46LyM/KD8hXFxzKVtfJGEtekEtWlxceEEwLVxcdUZGRkZdKD86KD8hXFxzKVskXFx3XFx4QTAtXFx1RkZGRl0pKlxccyo8KD86W148Pl18PCg/OltePD5dfDxbXjw+XSo+KSo+KSo+KD89XFxzKlxcKCkvLGdyZWVkeTohMCxpbnNpZGU6e2Z1bmN0aW9uOi9eIz8oPyFcXHMpW18kYS16QS1aXFx4QTAtXFx1RkZGRl0oPzooPyFcXHMpWyRcXHdcXHhBMC1cXHVGRkZGXSkqLyxnZW5lcmljOntwYXR0ZXJuOi88W1xcc1xcU10rLyxhbGlhczpcImNsYXNzLW5hbWVcIixpbnNpZGU6c319fX0pLGUubGFuZ3VhZ2VzLnRzPWUubGFuZ3VhZ2VzLnR5cGVzY3JpcHR9KFByaXNtKTtcclxuIWZ1bmN0aW9uKGUpe3ZhciBhPWUudXRpbC5jbG9uZShlLmxhbmd1YWdlcy50eXBlc2NyaXB0KTtlLmxhbmd1YWdlcy50c3g9ZS5sYW5ndWFnZXMuZXh0ZW5kKFwianN4XCIsYSksZGVsZXRlIGUubGFuZ3VhZ2VzLnRzeC5wYXJhbWV0ZXIsZGVsZXRlIGUubGFuZ3VhZ2VzLnRzeFtcImxpdGVyYWwtcHJvcGVydHlcIl07dmFyIHQ9ZS5sYW5ndWFnZXMudHN4LnRhZzt0LnBhdHRlcm49UmVnRXhwKFwiKF58W15cXFxcdyRdfCg/PTwvKSkoPzpcIit0LnBhdHRlcm4uc291cmNlK1wiKVwiLHQucGF0dGVybi5mbGFncyksdC5sb29rYmVoaW5kPSEwfShQcmlzbSk7XHJcbiFmdW5jdGlvbigpe2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBQcmlzbSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGRvY3VtZW50KXt2YXIgdD1bXTtvKChmdW5jdGlvbih0KXtpZih0JiZ0Lm1ldGEmJnQuZGF0YSl7aWYodC5tZXRhLnN0YXR1cyYmdC5tZXRhLnN0YXR1cz49NDAwKXJldHVyblwiRXJyb3I6IFwiKyh0LmRhdGEubWVzc2FnZXx8dC5tZXRhLnN0YXR1cyk7aWYoXCJzdHJpbmdcIj09dHlwZW9mIHQuZGF0YS5jb250ZW50KXJldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIGF0b2I/YXRvYih0LmRhdGEuY29udGVudC5yZXBsYWNlKC9cXHMvZyxcIlwiKSk6XCJZb3VyIGJyb3dzZXIgY2Fubm90IGRlY29kZSBiYXNlNjRcIn1yZXR1cm4gbnVsbH0pLFwiZ2l0aHViXCIpLG8oKGZ1bmN0aW9uKHQsZSl7aWYodCYmdC5tZXRhJiZ0LmRhdGEmJnQuZGF0YS5maWxlcyl7aWYodC5tZXRhLnN0YXR1cyYmdC5tZXRhLnN0YXR1cz49NDAwKXJldHVyblwiRXJyb3I6IFwiKyh0LmRhdGEubWVzc2FnZXx8dC5tZXRhLnN0YXR1cyk7dmFyIG49dC5kYXRhLmZpbGVzLGE9ZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZpbGVuYW1lXCIpO2lmKG51bGw9PWEpZm9yKHZhciByIGluIG4paWYobi5oYXNPd25Qcm9wZXJ0eShyKSl7YT1yO2JyZWFrfXJldHVybiB2b2lkIDAhPT1uW2FdP25bYV0uY29udGVudDpcIkVycm9yOiB1bmtub3duIG9yIG1pc3NpbmcgZ2lzdCBmaWxlIFwiK2F9cmV0dXJuIG51bGx9KSxcImdpc3RcIiksbygoZnVuY3Rpb24odCl7cmV0dXJuIHQmJnQubm9kZSYmXCJzdHJpbmdcIj09dHlwZW9mIHQuZGF0YT90LmRhdGE6bnVsbH0pLFwiYml0YnVja2V0XCIpO3ZhciBlPTAsbj1cImRhdGEtanNvbnAtc3RhdHVzXCIsYT1cImZhaWxlZFwiLHI9J3ByZVtkYXRhLWpzb25wXTpub3QoW2RhdGEtanNvbnAtc3RhdHVzPVwibG9hZGVkXCJdKTpub3QoW2RhdGEtanNvbnAtc3RhdHVzPVwibG9hZGluZ1wiXSknO1ByaXNtLmhvb2tzLmFkZChcImJlZm9yZS1oaWdobGlnaHRhbGxcIiwoZnVuY3Rpb24odCl7dC5zZWxlY3Rvcis9XCIsIFwiK3J9KSksUHJpc20uaG9va3MuYWRkKFwiYmVmb3JlLXNhbml0eS1jaGVja1wiLChmdW5jdGlvbihvKXt2YXIgaSx1PW8uZWxlbWVudDtpZih1Lm1hdGNoZXMocikpe28uY29kZT1cIlwiLHUuc2V0QXR0cmlidXRlKG4sXCJsb2FkaW5nXCIpO3ZhciBzPXUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkNPREVcIikpO3MudGV4dENvbnRlbnQ9XCJMb2FkaW5n4oCmXCI7dmFyIGQ9by5sYW5ndWFnZTtzLmNsYXNzTmFtZT1cImxhbmd1YWdlLVwiK2Q7dmFyIGY9UHJpc20ucGx1Z2lucy5hdXRvbG9hZGVyO2YmJmYubG9hZExhbmd1YWdlcyhkKTt2YXIgbD11LmdldEF0dHJpYnV0ZShcImRhdGEtYWRhcHRlclwiKSxjPW51bGw7aWYobCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2Ygd2luZG93W2xdKXJldHVybiB1LnNldEF0dHJpYnV0ZShuLGEpLHZvaWQocy50ZXh0Q29udGVudD0oaT1sLCfinJYgRXJyb3I6IEpTT05QIGFkYXB0ZXIgZnVuY3Rpb24gXCInK2krXCJcXFwiIGRvZXNuJ3QgZXhpc3RcIikpO2M9d2luZG93W2xdfXZhciBwPXUuZ2V0QXR0cmlidXRlKFwiZGF0YS1qc29ucFwiKTshZnVuY3Rpb24ocixvLGksZCl7dmFyIGY9XCJwcmlzbWpzb25wXCIrZSsrLGw9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7bC5ocmVmPXIsbC5ocmVmKz0obC5zZWFyY2g/XCImXCI6XCI/XCIpKyhvfHxcImNhbGxiYWNrXCIpK1wiPVwiK2Y7dmFyIHA9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtwLnNyYz1sLmhyZWYscC5vbmVycm9yPWZ1bmN0aW9uKCl7ZygpLGQoKX07dmFyIG09c2V0VGltZW91dCgoZnVuY3Rpb24oKXtnKCksZCgpfSksUHJpc20ucGx1Z2lucy5qc29ucGhpZ2hsaWdodC50aW1lb3V0KTtmdW5jdGlvbiBnKCl7Y2xlYXJUaW1lb3V0KG0pLGRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQocCksZGVsZXRlIHdpbmRvd1tmXX13aW5kb3dbZl09ZnVuY3Rpb24oZSl7ZygpLGZ1bmN0aW9uKGUpe3ZhciByPW51bGw7aWYoYylyPWMoZSx1KTtlbHNlIGZvcih2YXIgbz0wLGk9dC5sZW5ndGg7bzxpJiZudWxsPT09KHI9dFtvXS5hZGFwdGVyKGUsdSkpO28rKyk7bnVsbD09PXI/KHUuc2V0QXR0cmlidXRlKG4sYSkscy50ZXh0Q29udGVudD1cIuKcliBFcnJvcjogQ2Fubm90IHBhcnNlIHJlc3BvbnNlIChwZXJoYXBzIHlvdSBuZWVkIGFuIGFkYXB0ZXIgZnVuY3Rpb24/KVwiKToodS5zZXRBdHRyaWJ1dGUobixcImxvYWRlZFwiKSxzLnRleHRDb250ZW50PXIsUHJpc20uaGlnaGxpZ2h0RWxlbWVudChzKSl9KGUpfSxkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHApfShwLHUuZ2V0QXR0cmlidXRlKFwiZGF0YS1jYWxsYmFja1wiKSwwLChmdW5jdGlvbigpe3Uuc2V0QXR0cmlidXRlKG4sYSkscy50ZXh0Q29udGVudD1cIuKcliBFcnJvcjogVGltZW91dCBsb2FkaW5nIFwiK3B9KSl9fSkpLFByaXNtLnBsdWdpbnMuanNvbnBoaWdobGlnaHQ9e3RpbWVvdXQ6NWUzLHJlZ2lzdGVyQWRhcHRlcjpvLHJlbW92ZUFkYXB0ZXI6ZnVuY3Rpb24oZSl7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGUmJihlPWkoZSkpLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUpe3ZhciBuPXQuZmluZEluZGV4KChmdW5jdGlvbih0KXtyZXR1cm4gdC5hZGFwdGVyPT09ZX0pKTtuPj0wJiZ0LnNwbGljZShuLDEpfX0saGlnaGxpZ2h0OmZ1bmN0aW9uKHQpe2Zvcih2YXIgZSxuPSh0fHxkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChyKSxhPTA7ZT1uW2ErK107KVByaXNtLmhpZ2hsaWdodEVsZW1lbnQoZSl9fX1mdW5jdGlvbiBvKGUsbil7bj1ufHxlLm5hbWUsXCJmdW5jdGlvblwiIT10eXBlb2YgZXx8aShlKXx8aShuKXx8dC5wdXNoKHthZGFwdGVyOmUsbmFtZTpufSl9ZnVuY3Rpb24gaShlKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBlKXtmb3IodmFyIG49MDthPXRbbisrXTspaWYoYS5hZGFwdGVyLnZhbHVlT2YoKT09PWUudmFsdWVPZigpKXJldHVybiBhLmFkYXB0ZXJ9ZWxzZSBpZihcInN0cmluZ1wiPT10eXBlb2YgZSl7dmFyIGE7Zm9yKG49MDthPXRbbisrXTspaWYoYS5uYW1lPT09ZSlyZXR1cm4gYS5hZGFwdGVyfXJldHVybiBudWxsfX0oKTtcclxuIiwiLyog5aSE55CG5Yqg57KX5YaF5a65ICovXHJcbmV4cG9ydCBmdW5jdGlvbiByYW5nZUJvbGQocil7XHJcbiAgICBjb25zdCBzdGFydCA9IHIuc3RhcnRPZmZzZXRcclxuICAgIGNvbnN0IGVuZCA9IHIuZW5kT2Zmc2V0XHJcbiAgICBjb25zdCB0ID0gci5zdGFydENvbnRhaW5lci53aG9sZVRleHRcclxuICAgIGNvbnN0IGlubmVyID0gdC5zbGljZShzdGFydCxlbmQpP3Quc2xpY2Uoc3RhcnQsZW5kKTon5Yqg57KX5qC35byPJ1xyXG4gICAgaWYoci5zdGFydENvbnRhaW5lciA9PSByLmVuZENvbnRhaW5lcil7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0VGV4dCA9IHQuc2xpY2UoMCxzdGFydCkrJyoqJytpbm5lcisnKionK3Quc2xpY2UoZW5kLHQubGVuZ3RoKVxyXG4gICAgICAgIHIuc3RhcnRDb250YWluZXIubm9kZVZhbHVlID0gcmVzdWx0VGV4dFxyXG4gICAgICAgIHIuc2V0U3RhcnQoci5zdGFydENvbnRhaW5lcixzdGFydClcclxuICAgICAgICByLnNldEVuZChyLnN0YXJ0Q29udGFpbmVyLHN0YXJ0KzQraW5uZXIubGVuZ3RoKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgY29uc3QgZXQgPSByLmVuZENvbnRhaW5lci53aG9sZVRleHRcclxuICAgICAgICByLnN0YXJ0Q29udGFpbmVyLm5vZGVWYWx1ZSA9IHQuc2xpY2UoMCxyLnN0YXJ0T2Zmc2V0KSArICcqKicgKyB0LnNsaWNlKHIuc3RhcnRPZmZzZXQsdC5sZW5ndGgpXHJcbiAgICAgICAgci5lbmRDb250YWluZXIubm9kZVZhbHVlID0gZXQuc2xpY2UoMCxyLmVuZE9mZnNldCkgKyAnKionICsgZXQuc2xpY2Uoci5lbmRPZmZzZXQsZXQubGVuZ3RoKVxyXG4gICAgICAgIHIuc2V0U3RhcnQoci5zdGFydENvbnRhaW5lcixzdGFydClcclxuICAgICAgICByLnNldEVuZChyLmVuZENvbnRhaW5lcixlbmQrMilcclxuICAgIH0gXHJcbn1cclxuXHJcbi8qIOWkhOeQhuaWnOS9k+WGheWuuSAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2VJdGFsaWNzKHIpe1xyXG4gICAgY29uc3Qgc3RhcnQgPSByLnN0YXJ0T2Zmc2V0XHJcbiAgICBjb25zdCBlbmQgPSByLmVuZE9mZnNldFxyXG4gICAgY29uc3QgdCA9IHIuc3RhcnRDb250YWluZXIud2hvbGVUZXh0XHJcbiAgICBjb25zdCBpbm5lciA9IHQuc2xpY2Uoc3RhcnQsZW5kKT90LnNsaWNlKHN0YXJ0LGVuZCk6J+aWnOS9k+agt+W8jydcclxuICAgIGlmKHIuc3RhcnRDb250YWluZXIgPT0gci5lbmRDb250YWluZXIpe1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdFRleHQgPSB0LnNsaWNlKDAsc3RhcnQpKycqJytpbm5lcisnKicrdC5zbGljZShlbmQsdC5sZW5ndGgpXHJcbiAgICAgICAgci5zdGFydENvbnRhaW5lci5ub2RlVmFsdWUgPSByZXN1bHRUZXh0XHJcbiAgICAgICAgci5zZXRTdGFydChyLnN0YXJ0Q29udGFpbmVyLHN0YXJ0KVxyXG4gICAgICAgIHIuc2V0RW5kKHIuc3RhcnRDb250YWluZXIsc3RhcnQrMitpbm5lci5sZW5ndGgpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBjb25zdCBldCA9IHIuZW5kQ29udGFpbmVyLndob2xlVGV4dFxyXG4gICAgICAgIHIuc3RhcnRDb250YWluZXIubm9kZVZhbHVlID0gdC5zbGljZSgwLHIuc3RhcnRPZmZzZXQpICsgJyonICsgdC5zbGljZShyLnN0YXJ0T2Zmc2V0LHQubGVuZ3RoKVxyXG4gICAgICAgIHIuZW5kQ29udGFpbmVyLm5vZGVWYWx1ZSA9IGV0LnNsaWNlKDAsci5lbmRPZmZzZXQpICsgJyonICsgZXQuc2xpY2Uoci5lbmRPZmZzZXQsZXQubGVuZ3RoKVxyXG4gICAgICAgIHIuc2V0U3RhcnQoci5zdGFydENvbnRhaW5lcixzdGFydClcclxuICAgICAgICByLnNldEVuZChyLmVuZENvbnRhaW5lcixlbmQrMSlcclxuICAgIH0gXHJcbn1cclxuXHJcbi8qIOWkhOeQhuWIoOmZpOe6vyAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2VEZWwocil7XHJcbiAgICBjb25zdCBzdGFydCA9IHIuc3RhcnRPZmZzZXRcclxuICAgIGNvbnN0IGVuZCA9IHIuZW5kT2Zmc2V0XHJcbiAgICBjb25zdCB0ID0gci5zdGFydENvbnRhaW5lci53aG9sZVRleHRcclxuICAgIGNvbnN0IGlubmVyID0gdC5zbGljZShzdGFydCxlbmQpP3Quc2xpY2Uoc3RhcnQsZW5kKTon5Yig6Zmk57q/J1xyXG4gICAgaWYoci5zdGFydENvbnRhaW5lciA9PSByLmVuZENvbnRhaW5lcil7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0VGV4dCA9IHQuc2xpY2UoMCxzdGFydCkrJ35+Jytpbm5lcisnfn4nK3Quc2xpY2UoZW5kLHQubGVuZ3RoKVxyXG4gICAgICAgIHIuc3RhcnRDb250YWluZXIubm9kZVZhbHVlID0gcmVzdWx0VGV4dFxyXG4gICAgICAgIHIuc2V0U3RhcnQoci5zdGFydENvbnRhaW5lcixzdGFydClcclxuICAgICAgICByLnNldEVuZChyLnN0YXJ0Q29udGFpbmVyLHN0YXJ0KzQraW5uZXIubGVuZ3RoKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgY29uc3QgZXQgPSByLmVuZENvbnRhaW5lci53aG9sZVRleHRcclxuICAgICAgICByLnN0YXJ0Q29udGFpbmVyLm5vZGVWYWx1ZSA9IHQuc2xpY2UoMCxyLnN0YXJ0T2Zmc2V0KSArICd+ficgKyB0LnNsaWNlKHIuc3RhcnRPZmZzZXQsdC5sZW5ndGgpXHJcbiAgICAgICAgci5lbmRDb250YWluZXIubm9kZVZhbHVlID0gZXQuc2xpY2UoMCxyLmVuZE9mZnNldCkgKyAnfn4nICsgZXQuc2xpY2Uoci5lbmRPZmZzZXQsZXQubGVuZ3RoKVxyXG4gICAgICAgIHIuc2V0U3RhcnQoci5zdGFydENvbnRhaW5lcixzdGFydCsyKVxyXG4gICAgICAgIHIuc2V0RW5kKHIuZW5kQ29udGFpbmVyLGVuZClcclxuICAgIH1cclxufVxyXG5cclxuLyog5aSE55CG5qCH6K6wICovXHJcbmV4cG9ydCBmdW5jdGlvbiByYW5nZUNpdGUocil7XHJcbiAgICBjb25zdCBzdGFydCA9IHIuc3RhcnRPZmZzZXRcclxuICAgIGNvbnN0IGVuZCA9IHIuZW5kT2Zmc2V0XHJcbiAgICBjb25zdCB0ID0gci5zdGFydENvbnRhaW5lci53aG9sZVRleHRcclxuICAgIGNvbnN0IGlubmVyID0gdC5zbGljZShzdGFydCxlbmQpP3Quc2xpY2Uoc3RhcnQsZW5kKTon5Yig6Zmk57q/J1xyXG4gICAgaWYoci5zdGFydENvbnRhaW5lciA9PSByLmVuZENvbnRhaW5lcil7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0VGV4dCA9IHQuc2xpY2UoMCxzdGFydCkrJ2AnK2lubmVyKydgJyt0LnNsaWNlKGVuZCx0Lmxlbmd0aClcclxuICAgICAgICByLnN0YXJ0Q29udGFpbmVyLm5vZGVWYWx1ZSA9IHJlc3VsdFRleHRcclxuICAgICAgICByLnNldFN0YXJ0KHIuc3RhcnRDb250YWluZXIsc3RhcnQpXHJcbiAgICAgICAgci5zZXRFbmQoci5zdGFydENvbnRhaW5lcixzdGFydCsyK2lubmVyLmxlbmd0aClcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGNvbnN0IGV0ID0gci5lbmRDb250YWluZXIud2hvbGVUZXh0XHJcbiAgICAgICAgci5zdGFydENvbnRhaW5lci5ub2RlVmFsdWUgPSB0LnNsaWNlKDAsci5zdGFydE9mZnNldCkgKyAnYCcgKyB0LnNsaWNlKHIuc3RhcnRPZmZzZXQsdC5sZW5ndGgpXHJcbiAgICAgICAgci5lbmRDb250YWluZXIubm9kZVZhbHVlID0gZXQuc2xpY2UoMCxyLmVuZE9mZnNldCkgKyAnYCcgKyBldC5zbGljZShyLmVuZE9mZnNldCxldC5sZW5ndGgpXHJcbiAgICAgICAgci5zZXRTdGFydChyLnN0YXJ0Q29udGFpbmVyLHN0YXJ0KzEpXHJcbiAgICAgICAgci5zZXRFbmQoci5lbmRDb250YWluZXIsZW5kKVxyXG4gICAgfVxyXG59XHJcblxyXG4vKiDlpITnkIbkuIDnuqfmoIfpopggKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmdlSDEocil7XHJcbiAgICBpZihyLmNvbGxhcHNlZCl7XHJcbiAgICAgICAgY29uc3Qgc3RyID0gbmV3IFRleHQoJyMg5LiA57qn5qCH6aKYJylcclxuICAgICAgICByLmluc2VydE5vZGUoc3RyKVxyXG4gICAgICAgIHIuc2V0U3RhcnQoc3RyLHN0ci5sZW5ndGgpXHJcbiAgICAgICAgci5zZXRFbmQoc3RyLHN0ci5sZW5ndGgpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBjb25zdCBzdHIgPSBuZXcgVGV4dCgnXFxuIyAnK1N0cmluZyhyKS5yZXBsYWNlKC9cXG4vZywnJykrXCJcXG5cIilcclxuICAgICAgICByLmRlbGV0ZUNvbnRlbnRzKClcclxuICAgICAgICByLmluc2VydE5vZGUoc3RyKVxyXG4gICAgICAgIHIuc2V0U3RhcnQoc3RyLHN0ci5sZW5ndGgtLjkpXHJcbiAgICAgICAgci5zZXRFbmQoc3RyLHN0ci5sZW5ndGgtLjkpXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qIOWkhOeQhuS6jOe6p+agh+mimCAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2VIMihyKXtcclxuICAgIGlmKHIuY29sbGFwc2VkKXtcclxuICAgICAgICBjb25zdCBzdHIgPSBuZXcgVGV4dCgnIyMg5LqM57qn5qCH6aKYJylcclxuICAgICAgICByLmluc2VydE5vZGUoc3RyKVxyXG4gICAgICAgIHIuc2V0U3RhcnQoc3RyLHN0ci5sZW5ndGgpXHJcbiAgICAgICAgci5zZXRFbmQoc3RyLHN0ci5sZW5ndGgpXHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBjb25zdCBzdHIgPSBuZXcgVGV4dCgnXFxuIyMgJytTdHJpbmcocikucmVwbGFjZSgvXFxuL2csJycpK1wiXFxuXCIpXHJcbiAgICAgICAgci5kZWxldGVDb250ZW50cygpXHJcbiAgICAgICAgci5pbnNlcnROb2RlKHN0cilcclxuICAgICAgICByLnNldFN0YXJ0KHN0cixzdHIubGVuZ3RoLS45KVxyXG4gICAgICAgIHIuc2V0RW5kKHN0cixzdHIubGVuZ3RoLS45KVxyXG4gICAgfVxyXG59XHJcblxyXG4vKiDlpITnkIbliIblibLnur8gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmdlSHIocil7XHJcbiAgICBpZihyLmNvbGxhcHNlZCl7XHJcbiAgICAgICAgY29uc3Qgc3RyID0gbmV3IFRleHQoJ1xcbioqKlxcbicpXHJcbiAgICAgICAgci5pbnNlcnROb2RlKHN0cilcclxuICAgICAgICByLnNldFN0YXJ0KHN0cixzdHIubGVuZ3RoKVxyXG4gICAgICAgIHIuc2V0RW5kKHN0cixzdHIubGVuZ3RoKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgY29uc3Qgc3RyID0gbmV3IFRleHQoJ1xcbioqKlxcbicpXHJcbiAgICAgICAgci5kZWxldGVDb250ZW50cygpXHJcbiAgICAgICAgci5pbnNlcnROb2RlKHN0cilcclxuICAgICAgICByLnNldFN0YXJ0KHN0cixzdHIubGVuZ3RoLS45KVxyXG4gICAgICAgIHIuc2V0RW5kKHN0cixzdHIubGVuZ3RoLS45KVxyXG4gICAgfVxyXG59XHJcblxyXG4vKiDlpITnkIbotoXpk77mjqUgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmdlTGluayhyKXtcclxuICAgIGlmKHIuY29sbGFwc2VkKXtcclxuICAgICAgICBjb25zdCBzdHIgPSBuZXcgVGV4dCgnW+i/meaYr+i2hemTvuaOpV0oaHR0cHM6Ly93d3cueWVoZ2VyLmNvbSknKVxyXG4gICAgICAgIHIuaW5zZXJ0Tm9kZShzdHIpXHJcbiAgICAgICAgci5zZXRTdGFydChzdHIsJ1vov5nmmK/otoXpk77mjqVdJy5sZW5ndGgrMSlcclxuICAgICAgICByLnNldEVuZChzdHIsc3RyLmxlbmd0aC0xKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgY29uc3Qgc3RyID0gbmV3IFRleHQoJ1vov5nmmK/otoXpk77mjqVdKGh0dHBzOi8vd3d3LnllaGdlci5jb20pJylcclxuICAgICAgICByLmRlbGV0ZUNvbnRlbnRzKClcclxuICAgICAgICByLmluc2VydE5vZGUoc3RyKVxyXG4gICAgICAgIHIuc2V0U3RhcnQoc3RyLCdb6L+Z5piv6LaF6ZO+5o6lXScubGVuZ3RoKzEpXHJcbiAgICAgICAgci5zZXRFbmQoc3RyLHN0ci5sZW5ndGgtMSlcclxuICAgIH1cclxufVxyXG5cclxuLyog5aSE55CG5pyJ5bqP5YiX6KGoICovXHJcbmV4cG9ydCBmdW5jdGlvbiByYW5nZVVsKHIpe1xyXG4gICAgaWYoci5jb2xsYXBzZWQpe1xyXG4gICAgICAgIGNvbnN0IHN0ciA9IG5ldyBUZXh0KCctIOaXoOW6j+WIl+ihqCcpXHJcbiAgICAgICAgci5pbnNlcnROb2RlKHN0cilcclxuICAgICAgICByLnNldFN0YXJ0KHN0cixzdHIubGVuZ3RoKVxyXG4gICAgICAgIHIuc2V0RW5kKHN0cixzdHIubGVuZ3RoKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgY29uc3Qgc3RyID0gbmV3IFRleHQoJ1xcbi0gJytTdHJpbmcocikucmVwbGFjZSgvXFxuL2csJycpK1wiXFxuXCIpXHJcbiAgICAgICAgci5kZWxldGVDb250ZW50cygpXHJcbiAgICAgICAgci5pbnNlcnROb2RlKHN0cilcclxuICAgICAgICByLnNldFN0YXJ0KHN0cixzdHIubGVuZ3RoLS45KVxyXG4gICAgICAgIHIuc2V0RW5kKHN0cixzdHIubGVuZ3RoLS45KVxyXG4gICAgfVxyXG59XHJcblxyXG4vKiDlpITnkIbml6Dluo/liJfooaggKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmdlT2wocil7XHJcbiAgICBpZihyLmNvbGxhcHNlZCl7XHJcbiAgICAgICAgY29uc3Qgc3RyID0gbmV3IFRleHQoJzEuIOacieW6j+WIl+ihqCcpXHJcbiAgICAgICAgci5pbnNlcnROb2RlKHN0cilcclxuICAgICAgICByLnNldFN0YXJ0KHN0cixzdHIubGVuZ3RoKVxyXG4gICAgICAgIHIuc2V0RW5kKHN0cixzdHIubGVuZ3RoKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgY29uc3Qgc3RyID0gbmV3IFRleHQoJ1xcbjEuICcrU3RyaW5nKHIpLnJlcGxhY2UoL1xcbi9nLCcnKStcIlxcblwiKVxyXG4gICAgICAgIHIuZGVsZXRlQ29udGVudHMoKVxyXG4gICAgICAgIHIuaW5zZXJ0Tm9kZShzdHIpXHJcbiAgICAgICAgci5zZXRTdGFydChzdHIsc3RyLmxlbmd0aC0uOSlcclxuICAgICAgICByLnNldEVuZChzdHIsc3RyLmxlbmd0aC0uOSlcclxuICAgIH1cclxufVxyXG5cclxuLyog5aSE55CG5Zu+54mHICovXHJcbmV4cG9ydCBmdW5jdGlvbiByYW5nZUltZyhyKXtcclxuICAgIGlmKHIuY29sbGFwc2VkKXtcclxuICAgICAgICBjb25zdCBzdHIgPSBuZXcgVGV4dCgnIVvov5nmmK/lm77niYddKGh0dHBzOi8vcDMtanVlamluLmJ5dGVpbWcuY29tL3Rvcy1jbi1pLWszdTFmYnBmY3AvNWJjODVkYzdhOWZjNDYyNGJiYzQ4NGY4ODlkMzA0MGN+dHBsdi1rM3UxZmJwZmNwLXdhdGVybWFyay5pbWFnZSknKVxyXG4gICAgICAgIHIuaW5zZXJ0Tm9kZShzdHIpXHJcbiAgICAgICAgci5zZXRTdGFydChzdHIsJyFb6L+Z5piv5Zu+54mHXScubGVuZ3RoKzEpXHJcbiAgICAgICAgci5zZXRFbmQoc3RyLHN0ci5sZW5ndGgtMSlcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGNvbnN0IHN0ciA9IG5ldyBUZXh0KCchW+i/meaYr+WbvueJh10oaHR0cHM6Ly9wMy1qdWVqaW4uYnl0ZWltZy5jb20vdG9zLWNuLWktazN1MWZicGZjcC81YmM4NWRjN2E5ZmM0NjI0YmJjNDg0Zjg4OWQzMDQwY350cGx2LWszdTFmYnBmY3Atd2F0ZXJtYXJrLmltYWdlKScpXHJcbiAgICAgICAgci5kZWxldGVDb250ZW50cygpXHJcbiAgICAgICAgci5pbnNlcnROb2RlKHN0cilcclxuICAgICAgICByLnNldFN0YXJ0KHN0ciwnIVvov5nmmK/lm77niYddJy5sZW5ndGgrMSlcclxuICAgICAgICByLnNldEVuZChzdHIsc3RyLmxlbmd0aC0xKVxyXG4gICAgfVxyXG59XHJcblxyXG4vKiDlpITnkIbku6PnoIHlnZcgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmdlQ29kZShyKXtcclxuICAgIGNvbnN0IHN0YXJ0ID0gci5zdGFydE9mZnNldFxyXG4gICAgY29uc3QgZW5kID0gci5lbmRPZmZzZXRcclxuICAgIGNvbnN0IHQgPSByLnN0YXJ0Q29udGFpbmVyLndob2xlVGV4dFxyXG4gICAgY29uc3QgaW5uZXIgPSB0LnNsaWNlKHN0YXJ0LGVuZCk/dC5zbGljZShzdGFydCxlbmQpOifov5nph4zovpPlhaXku6PnoIEnXHJcbiAgICBpZihyLnN0YXJ0Q29udGFpbmVyID09IHIuZW5kQ29udGFpbmVyKXtcclxuICAgICAgICBjb25zdCByZXN1bHRUZXh0ID0gdC5zbGljZSgwLHN0YXJ0KSsnXFxuYGBgXFxuJytpbm5lcisnXFxuYGBgXFxuJyt0LnNsaWNlKGVuZCx0Lmxlbmd0aClcclxuICAgICAgICByLnN0YXJ0Q29udGFpbmVyLm5vZGVWYWx1ZSA9IHJlc3VsdFRleHRcclxuICAgICAgICByLnNldFN0YXJ0KHIuc3RhcnRDb250YWluZXIsc3RhcnQrNSlcclxuICAgICAgICByLnNldEVuZChyLnN0YXJ0Q29udGFpbmVyLHN0YXJ0KzUraW5uZXIubGVuZ3RoKVxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgY29uc3QgZXQgPSByLmVuZENvbnRhaW5lci53aG9sZVRleHRcclxuICAgICAgICByLnN0YXJ0Q29udGFpbmVyLm5vZGVWYWx1ZSA9IHQuc2xpY2UoMCxyLnN0YXJ0T2Zmc2V0KSArICdcXG5gYGBcXG4nICsgdC5zbGljZShyLnN0YXJ0T2Zmc2V0LHQubGVuZ3RoKVxyXG4gICAgICAgIHIuZW5kQ29udGFpbmVyLm5vZGVWYWx1ZSA9IGV0LnNsaWNlKDAsci5lbmRPZmZzZXQpICsgJ1xcbmBgYFxcbicgKyBldC5zbGljZShyLmVuZE9mZnNldCxldC5sZW5ndGgpXHJcbiAgICAgICAgci5zZXRTdGFydChyLnN0YXJ0Q29udGFpbmVyLHN0YXJ0KzUpXHJcbiAgICAgICAgci5zZXRFbmQoci5lbmRDb250YWluZXIsZW5kKzEpXHJcbiAgICB9IFxyXG59IiwiLyog6I635Y+W5b2T5YmN5YWJ5qCH5omA5Zyo5L2N572uKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEN1cnNvcihkb20pe1xyXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gd2luZG93LmdldFNlbGVjdGlvbigpXHJcbiAgICBpZihzZWxlY3Rpb24ucmFuZ2VDb3VudD09MCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ25vIHJhbmdlIGZvdW50JylcclxuICAgIH1cclxuICAgIGNvbnN0IHJhbmdlID0gc2VsZWN0aW9uLmdldFJhbmdlQXQoMClcclxuICAgIGNvbnN0IHN0YXJ0ID0gY291bnRMZW5ndGgoZG9tLHJhbmdlLnN0YXJ0Q29udGFpbmVyLHJhbmdlLnN0YXJ0T2Zmc2V0KVxyXG4gICAgY29uc3QgZW5kID0gY291bnRMZW5ndGgoZG9tLHJhbmdlLmVuZENvbnRhaW5lcixyYW5nZS5lbmRPZmZzZXQpXHJcbiAgICBcclxuICAgIGlmKCghc3RhcnRbMF0gfHwgIWVuZFswXSkpe1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ3Vyc29yIG5vdCBpbiB0aGUgZG9tJylcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYoZG9tID09IHJhbmdlLnN0YXJ0Q29udGFpbmVyKXtcclxuICAgICAgICBjb25zdCBsZW4gPSBkb20uaW5uZXJUZXh0Lmxlbmd0aFxyXG4gICAgICAgIHJldHVybiBbbGVuLGxlbl1cclxuICAgIH1cclxuICAgXHJcbiAgICByZXR1cm4gW3N0YXJ0WzFdLGVuZFsxXV1cclxuXHJcbiAgICBmdW5jdGlvbiBjb3VudExlbmd0aChub2RlLHRhcmdldE5vZGUsb2Zmc2V0KXtcclxuICAgICAgICBpZihub2RlID09IHRhcmdldE5vZGUpe1xyXG4gICAgICAgICAgICBpZihvZmZzZXQgPT0gMCkgb2Zmc2V0Kz0uMVxyXG4gICAgICAgICAgICByZXR1cm4gW3RydWUsb2Zmc2V0XVxyXG4gICAgICAgIH0gXHJcbiAgICAgICAgaWYobm9kZSBpbnN0YW5jZW9mIFRleHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtmYWxzZSxub2RlLmxlbmd0aF1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGxlbiA9IDBcclxuXHJcbiAgICAgICAgZm9yKGxldCBpdGVtIG9mIG5vZGUuY2hpbGROb2Rlcyl7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGNvdW50TGVuZ3RoKGl0ZW0sdGFyZ2V0Tm9kZSxvZmZzZXQpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihyZXN1bHRbMF0gPT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW3RydWUsbGVuK3Jlc3VsdFsxXV1cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBsZW4gPSBsZW4rcmVzdWx0WzFdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtmYWxzZSxsZW5dXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qIOiuvue9ruWFieagh+S9jee9riAqL1xyXG5leHBvcnQgZnVuY3Rpb24gc2V0Q3Vyc29yKGRvbSxzdGFydCxlbmQpe1xyXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gd2luZG93LmdldFNlbGVjdGlvbigpXHJcbiAgICBpZihzZWxlY3Rpb24ucmFuZ2VDb3VudD09MCl7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyByYW5nZSBmb3VuZCcpXHJcbiAgICB9XHJcbiAgICBjb25zdCByYW5nZSA9IHNlbGVjdGlvbi5nZXRSYW5nZUF0KDApXHJcblxyXG4gICAgbGV0IHN0YXJ0RG9uZSA9IGZhbHNlXHJcbiAgICBsZXQgc3RhcnRUZXh0Q291bnQgPSAwXHJcbiAgICBzZXRTdGFydChkb20pXHJcbiAgICBmdW5jdGlvbiBzZXRTdGFydChub2RlKXtcclxuICAgICAgICBpZihzdGFydERvbmUpIHJldHVybiBmYWxzZVxyXG4gICAgICAgIGlmKG5vZGUgaW5zdGFuY2VvZiBUZXh0KXtcclxuICAgICAgICAgICAgc3RhcnRUZXh0Q291bnQrPW5vZGUubGVuZ3RoXHJcbiAgICAgICAgICAgIGlmKHN0YXJ0VGV4dENvdW50Pj1zdGFydCl7XHJcbiAgICAgICAgICAgICAgICByYW5nZS5zZXRTdGFydChub2RlLG5vZGUubGVuZ3RoLShzdGFydFRleHRDb3VudC1zdGFydCkpXHJcbiAgICAgICAgICAgICAgICBzdGFydERvbmUgPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGxldCBpdGVtIG9mIG5vZGUuY2hpbGROb2Rlcyl7XHJcbiAgICAgICAgICAgIGlmKHNldFN0YXJ0KGl0ZW0pID09IGZhbHNlKSByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIWVuZCkgZW5kID0gc3RhcnRcclxuICAgIGxldCBlbmREb25lID0gZmFsc2VcclxuICAgIGxldCBlbmRUZXh0Q291bnQgPSAwXHJcbiAgICBzZXRFbmQoZG9tKVxyXG4gICAgZnVuY3Rpb24gc2V0RW5kKG5vZGUpe1xyXG4gICAgICAgIGlmKGVuZERvbmUpIHJldHVybiBmYWxzZVxyXG4gICAgICAgIGlmKG5vZGUgaW5zdGFuY2VvZiBUZXh0KXtcclxuICAgICAgICAgICAgZW5kVGV4dENvdW50Kz1ub2RlLmxlbmd0aFxyXG4gICAgICAgICAgICBpZihlbmRUZXh0Q291bnQ+PWVuZCl7XHJcbiAgICAgICAgICAgICAgICByYW5nZS5zZXRFbmQobm9kZSxub2RlLmxlbmd0aC0oZW5kVGV4dENvdW50LWVuZCkpXHJcbiAgICAgICAgICAgICAgICBlbmREb25lID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihsZXQgaXRlbSBvZiBub2RlLmNoaWxkTm9kZXMpe1xyXG4gICAgICAgICAgICBpZihzZXRFbmQoaXRlbSkgPT0gZmFsc2UpIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuXHRcdGZ1bmN0aW9uKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnLi9wcmlzbS9wcmlzbS5qcydcclxuaW1wb3J0ICcuL3ByaXNtL3ByaXNtLmNzcydcclxuaW1wb3J0ICcuL21hcmtkb3duLmNzcydcclxuXHJcbmltcG9ydCBoYW5kbGVFZGl0b3IgZnJvbSAnLi9oYW5kbGVFZGl0b3InXHJcbmltcG9ydCBoYW5kbGVWaWV3IGZyb20gJy4vaGFuZGxlVmlldydcclxuaW1wb3J0IGtleWRvd25Ib29rIGZyb20gJy4va2V5ZG93bkhvb2snXHJcblxyXG5pbXBvcnQgZ2V0Q2F0YWxvZyBmcm9tICcuL2dldENhdGFsb2cnXHJcblxyXG5pbXBvcnQge2dldEN1cnNvcixzZXRDdXJzb3J9IGZyb20gJy4vdXRpbCdcclxuXHJcbmltcG9ydCB7XHJcbiAgICByYW5nZUJvbGQsXHJcbiAgICByYW5nZUl0YWxpY3MsXHJcbiAgICByYW5nZURlbCxcclxuICAgIHJhbmdlQ2l0ZSxcclxuICAgIHJhbmdlSDEsXHJcbiAgICByYW5nZUgyLFxyXG4gICAgcmFuZ2VIcixcclxuICAgIHJhbmdlTGluayxcclxuICAgIHJhbmdlVWwsXHJcbiAgICByYW5nZU9sLFxyXG4gICAgcmFuZ2VJbWcsXHJcbiAgICByYW5nZUNvZGVcclxufSBmcm9tICcuL3Nob3J0Y3V0J1xyXG5cclxuY2xhc3MgTWFya2Rvd257XHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhKXtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmVudHJ5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihkYXRhLmVkaXRvcik7XHJcbiAgICAgICAgdGhpcy5zdGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZGF0YS5zdGFnZSk7XHJcbiAgICAgICAgdGhpcy5jYXRhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihkYXRhLmNhdGFsb2cpO1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBbXVxyXG4gICAgICAgIHRoaXMuY2FjaGVJbmRleCA9IC0xXHJcbiAgICAgICAgdGhpcy5sYXN0RWRpdDtcclxuICAgICAgICB0aGlzLmFuYWx5c2VkID0gZnVuY3Rpb24oc3RyKXtcclxuICAgICAgICAgICAgaWYodGhpcy5zdGFnZSkgdGhpcy5zdGFnZS5pbm5lckhUTUwgPSBzdHJcclxuICAgICAgICB9LmJpbmQodGhpcylcclxuICAgICAgICB0aGlzLmdldENhdGFsb2dDYWxsQmFjayA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY2F0YWxvZykgdGhpcy5jYXRhbG9nLmlubmVySFRNTCA9IHN0clxyXG4gICAgICAgIH0uYmluZCh0aGlzKVxyXG5cclxuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLmVudHJ5XHJcbiAgICAgICAgZW50cnkuc2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnLCd0cnVlJylcclxuICAgICAgICBlbnRyeS5jbGFzc05hbWU9ICdlZGl0b3IgX19tYXJrZG93bl9fJ1xyXG4gICAgICAgIGVudHJ5LmlubmVyVGV4dCA9ICcnXHJcbiAgICAgICAgZW50cnkuZm9jdXMoKVxyXG5cclxuICAgICAgICAvKiDlpITnkIblpI3liLbov4fmnaXnmoTlhoXlrrkgKi9cclxuICAgICAgICBlbnRyeS5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICB2YXIgcGFzdGUgPSAoZS5vcmlnaW5hbEV2ZW50IHx8IGUpLmNsaXBib2FyZERhdGEuZ2V0RGF0YSgndGV4dC9wbGFpbicpXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdpbnNlcnRUZXh0JyxmYWxzZSxwYXN0ZS5yZXBsYWNlKC9cXHJcXG4vZywnXFxuJykpXHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaCgpXHJcbiAgICAgICAgICAgIGNvbnN0IHJuID0gcGFzdGUubWF0Y2goL1xcclxcbi9nKVxyXG4gICAgICAgICAgICBpZihybikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBnZXRDdXJzb3IodGhpcy5lbnRyeSlcclxuICAgICAgICAgICAgICAgIHNldEN1cnNvcih0aGlzLmVudHJ5LHBvc2l0aW9uWzBdK3JuLmxlbmd0aCxwb3NpdGlvblsxXStybi5sZW5ndGgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LmJpbmQodGhpcykpXHJcblxyXG4gICAgICAgIC8qIOemgeatouaLluaLvSAqL1xyXG4gICAgICAgIGVudHJ5LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJyxlPT57XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8qIOWkhOeQhumUruebmOS6i+S7tiAqL1xyXG4gICAgICAgIGVudHJ5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLGtleWRvd25Ib29rLmJpbmQodGhpcykpXHJcbiAgICAgICAgXHJcbiAgICAgICAgZW50cnkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdGhpcy5zYXZlQ2FjaGUoKVxyXG4gICAgICAgIH0uYmluZCh0aGlzKSlcclxuICAgIH1cclxuXHJcbiAgICAvKiDooqvliqjop6PmnpAgKi9cclxuICAgIG9uQW5hbHlzZWQoZnVuKXtcclxuICAgICAgICB0aGlzLmFuYWx5c2VkID0gZnVuXHJcbiAgICB9XHJcblxyXG4gICAgLyog6KKr5Yqo6I635Y+W55uu5b2VICovXHJcbiAgICBvbkdldENhdGFsb2coZnVuKXtcclxuICAgICAgICB0aGlzLmdldENhdGFsb2dDYWxsQmFjayA9IGZ1blxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlclZpZXcoaHRtbCl7XHJcbiAgICAgICAgdmFyIHRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgICAgIHRlbXAuY2xhc3NOYW1lID0gXCJfX21hcmtkb3duX3Jlc3VsdF9fXCJcclxuICAgICAgICB0ZW1wLmlubmVySFRNTCA9IGhhbmRsZVZpZXcoaHRtbClcclxuICAgICAgICByZXR1cm4gdGVtcC5vdXRlckhUTUxcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJFZGl0b3IoaHRtbCl7XHJcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSBnZXRDdXJzb3IodGhpcy5lbnRyeSlcclxuICAgICAgICB0aGlzLmVudHJ5LmlubmVySFRNTCA9IGhhbmRsZUVkaXRvcihodG1sKVxyXG4gICAgICAgIHNldEN1cnNvcih0aGlzLmVudHJ5LC4uLnBvc2l0aW9uKVxyXG4gICAgICAgIHRoaXMuZ2V0Q2F0YWxvZ0NhbGxCYWNrKGdldENhdGFsb2coaHRtbCkpXHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgLyog6K6+572u5qC35L6LICovXHJcbiAgICBzZXRFeG1wbGUodGV4dCl7XHJcbiAgICAgICAgdGhpcy5hbmFseXNlZCh0aGlzLnJlbmRlclZpZXcodGV4dCkpXHJcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0b3IodGV4dClcclxuICAgICAgICB0aGlzLnNhdmVDYWNoZSh0cnVlKVxyXG4gICAgfVxyXG5cclxuICAgIHJlZnJlc2godGV4dCxwb3Mpe1xyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gcG9zP3BvczpnZXRDdXJzb3IodGhpcy5lbnRyeSlcclxuICAgICAgICB0aGlzLnJlbmRlckVkaXRvcih0ZXh0P3RleHQ6dGhpcy5lbnRyeS5pbm5lclRleHQpXHJcbiAgICAgICAgdGhpcy5hbmFseXNlZCh0aGlzLnJlbmRlclZpZXcodGV4dD90ZXh0OnRoaXMuZW50cnkuaW5uZXJUZXh0KSlcclxuICAgICAgICBzZXRDdXJzb3IodGhpcy5lbnRyeSwuLi5wb3NpdGlvbilcclxuICAgICAgICB0aGlzLmVudHJ5LmZvY3VzKClcclxuICAgIH1cclxuXHJcbiAgICAvKiDlrZjlgqjnvJbovpHnvJPlrZggKi9cclxuICAgIHNhdmVDYWNoZShpbml0KXtcclxuICAgICAgICBpZihpbml0KXtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZUluZGV4ID0gMFxyXG4gICAgICAgICAgICB0aGlzLmNhY2hlID0gW3tcclxuICAgICAgICAgICAgICAgIG5vZGU6dGhpcy5lbnRyeS5jbG9uZU5vZGUodHJ1ZSksXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjpnZXRDdXJzb3IodGhpcy5lbnRyeSlcclxuICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgdGhpcy5sYXN0RWRpdCA9IHRoaXMuZW50cnkuY2xvbmVOb2RlKHRydWUpLmlubmVyVGV4dFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBjbG9uZUVudHJ5ID0gdGhpcy5lbnRyeS5jbG9uZU5vZGUodHJ1ZSlcclxuICAgICAgICBpZih0aGlzLmxhc3RFZGl0ICE9IGNsb25lRW50cnkuaW5uZXJUZXh0KXtcclxuICAgICAgICAgICAgdGhpcy5sYXN0RWRpdCA9IGNsb25lRW50cnkuaW5uZXJUZXh0XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY2FjaGUubGVuZ3RoLTE+dGhpcy5jYWNoZUluZGV4KXtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUgPSB0aGlzLmNhY2hlLnNsaWNlKDAsdGhpcy5jYWNoZUluZGV4KzEpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jYWNoZS5wdXNoKHtcclxuICAgICAgICAgICAgICAgIG5vZGU6Y2xvbmVFbnRyeSxcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOmdldEN1cnNvcih0aGlzLmVudHJ5KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB0aGlzLmNhY2hlSW5kZXgrK1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aGlzLmNhY2hlW3RoaXMuY2FjaGVJbmRleF1bJ3Bvc2l0aW9uJ10gPSBnZXRDdXJzb3IodGhpcy5lbnRyeSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyog5pKk6ZSAICovXHJcbiAgICB1bmRvKCl7XHJcbiAgICAgICAgaWYodGhpcy5jYWNoZUluZGV4PD0wKSByZXR1cm5cclxuICAgICAgICB0aGlzLmNhY2hlSW5kZXgtLVxyXG4gICAgICAgIGNvbnN0IGxhc3QgPSB0aGlzLmNhY2hlW3RoaXMuY2FjaGVJbmRleF1cclxuICAgICAgICB0aGlzLnJlZnJlc2gobGFzdC5ub2RlLmlubmVyVGV4dCxsYXN0LnBvc2l0aW9uKVxyXG5cclxuICAgICAgICBjb25zdCBjbG9uZUVudHJ5ID0gdGhpcy5lbnRyeS5jbG9uZU5vZGUodHJ1ZSlcclxuICAgICAgICB0aGlzLmxhc3RFZGl0ID0gY2xvbmVFbnRyeS5pbm5lclRleHRcclxuICAgIH1cclxuXHJcbiAgICAvKiDmgaLlpI0gKi9cclxuICAgIHJlZG8oKXtcclxuICAgICAgICBpZih0aGlzLmNhY2hlSW5kZXggPT0gdGhpcy5jYWNoZS5sZW5ndGgtMSkgcmV0dXJuXHJcblxyXG4gICAgICAgIHRoaXMuY2FjaGVJbmRleCsrXHJcbiAgICAgICAgY29uc3QgbmV4dCA9IHRoaXMuY2FjaGVbdGhpcy5jYWNoZUluZGV4XVxyXG4gICAgICAgIHRoaXMucmVmcmVzaChuZXh0Lm5vZGUuaW5uZXJUZXh0LG5leHQucG9zaXRpb24pXHJcblxyXG4gICAgICAgIGNvbnN0IGNsb25lRW50cnkgPSB0aGlzLmVudHJ5LmNsb25lTm9kZSh0cnVlKVxyXG4gICAgICAgIHRoaXMubGFzdEVkaXQgPSBjbG9uZUVudHJ5LmlubmVyVGV4dFxyXG4gICAgfVxyXG5cclxuICAgIC8qIOinpuWPkeaWueazlSAqL1xyXG4gICAgZGlzcGF0Y2godHlwZSl7XHJcbiAgICAgICAgc3dpdGNoKHR5cGUpe1xyXG4gICAgICAgICAgICBjYXNlICdkZWwnOnJhbmdlRGVsKGdldFJhbmdlKCkpO2JyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdpdGFsaWNzJzpyYW5nZUl0YWxpY3MoZ2V0UmFuZ2UoKSk7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2JvbGQnOnJhbmdlQm9sZChnZXRSYW5nZSgpKTticmVhaztcclxuICAgICAgICAgICAgY2FzZSAnY2l0ZSc6cmFuZ2VDaXRlKGdldFJhbmdlKCkpO2JyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdoMSc6cmFuZ2VIMShnZXRSYW5nZSgpKTticmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaDInOnJhbmdlSDIoZ2V0UmFuZ2UoKSk7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2hyJzpyYW5nZUhyKGdldFJhbmdlKCkpO2JyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdsaW5rJzpyYW5nZUxpbmsoZ2V0UmFuZ2UoKSk7YnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3VsJzpyYW5nZVVsKGdldFJhbmdlKCkpO2JyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdvbCc6cmFuZ2VPbChnZXRSYW5nZSgpKTticmVhaztcclxuICAgICAgICAgICAgY2FzZSAnaW1nJzpyYW5nZUltZyhnZXRSYW5nZSgpKTticmVhaztcclxuICAgICAgICAgICAgY2FzZSAnY29kZSc6cmFuZ2VDb2RlKGdldFJhbmdlKCkpO2JyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OnRocm93IG5ldyBFcnJvcignXCInK3R5cGUrJ1wiJytcIiBpc24ndCBhIHZhbGlkIHZhbHVlLlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoKClcclxuICAgICAgICB0aGlzLnNhdmVDYWNoZSgpXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRSYW5nZSgpe1xyXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZG9jdW1lbnQuZ2V0U2VsZWN0aW9uKClcclxuICAgIGlmKHNlbGVjdGlvbi5yYW5nZUNvdW50KXtcclxuICAgICAgICByZXR1cm4gc2VsZWN0aW9uLmdldFJhbmdlQXQoMClcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcign5peg6IyD5Zu06YCJ5oupJylcclxuICAgIH1cclxufVxyXG5cclxud2luZG93WydNYXJrZG93biddID0gTWFya2Rvd24iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=