import './prism/prism.js'
import './prism/prism.css'
import './markdown.css'

import handleEditor from './handleEditor'
import handleView from './handleView'
import keydownHook from './keydownHook'

import getCatalog from './getCatalog'

import {getCursor,setCursor} from './util'

import {
    rangeBold,
    rangeItalics,
    rangeDel,
    rangeCite,
    rangeH1,
    rangeH2,
    rangeHr,
    rangeLink,
    rangeUl,
    rangeOl,
    rangeImg,
    rangeCode
} from './shortcut'

class Markdown{
    constructor(data){
        
        this.entry = document.querySelector(data.editor);
        this.stage = document.querySelector(data.stage);
        this.catalog = document.querySelector(data.catalog);
        this.change = data.change
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
                const position = getCursor(this.entry)
                setCursor(this.entry,position[0]+rn.length,position[1]+rn.length)
            }
        }.bind(this))

        /* 禁止拖拽 */
        entry.addEventListener('dragover',e=>{
            e.preventDefault()
        })

        /* 处理键盘事件 */
        entry.addEventListener('keydown',keydownHook.bind(this))
        
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
        temp.innerHTML = handleView(html)
        return temp.outerHTML
    }

    renderEditor(html){
        const position = getCursor(this.entry)
        this.entry.innerHTML = handleEditor(html)
        setCursor(this.entry,...position)
        this.getCatalogCallBack(getCatalog(html))
        
    }

    /* 设置样例 */
    setExmple(text){
        this.analysed(this.renderView(text))
        this.renderEditor(text)
        this.saveCache(true)
    }
    
    getText(){
        return this.entry.innerText
    }

    refresh(text,pos){
        const position = pos?pos:getCursor(this.entry)
        this.renderEditor(text?text:this.entry.innerText)
        this.analysed(this.renderView(text?text:this.entry.innerText))
        setCursor(this.entry,...position)
        this.entry.focus()
    }

    /* 存储编辑缓存 */
    saveCache(init){
        if(init){
            this.cacheIndex = 0
            this.cache = [{
                node:this.entry.cloneNode(true),
                position:getCursor(this.entry)
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
                position:getCursor(this.entry)
            })
            this.cacheIndex++
        }else{
            this.cache[this.cacheIndex]['position'] = getCursor(this.entry)
        }
        if(this.change) this.change(this.entry.innerText)
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
            case 'del':rangeDel(getRange());break;
            case 'italics':rangeItalics(getRange());break;
            case 'bold':rangeBold(getRange());break;
            case 'cite':rangeCite(getRange());break;
            case 'h1':rangeH1(getRange());break;
            case 'h2':rangeH2(getRange());break;
            case 'hr':rangeHr(getRange());break;
            case 'link':rangeLink(getRange());break;
            case 'ul':rangeUl(getRange());break;
            case 'ol':rangeOl(getRange());break;
            case 'img':rangeImg(getRange());break;
            case 'code':rangeCode(getRange());break;
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