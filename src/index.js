import './prism/prism.css'
import './markdown.css'
import {handleCode} from './wholeHandler'
import {
    handleSplitLine,
    handleTitle,
    handleReference,
    handleSingleCode,
    handleBold,
    handleLink,
    handleItalic
} from './singleHandler'

import markEditor from './markEditor'

class Markdown{
    constructor(dom){
        this.entry = document.querySelector(dom);
        this.cache = []
        this.cacheIndex = -1
        this.lastEdit;
        this.analysed = function(){}

        var entry = this.entry
        entry.setAttribute('contenteditable','true')
        entry.className= 'editor __markdown__'
        entry.innerHTML = '<div class="section"></div>'
        entry.focus()
        /* 处理复制过来的内容 */
        entry.addEventListener('paste',function(e){
            e.preventDefault()
            var paste = (e.originalEvent || e).clipboardData.getData('text/plain')
            document.execCommand('insertText',false,paste)
        })

        entry.addEventListener('dragover',e=>{
            e.preventDefault()
        })

        /* 处理键盘事件 */
        entry.addEventListener('keydown',e=>{
            if(e.ctrlKey && e.keyCode == 66){
                e.preventDefault()
            }
            
            if(e.ctrlKey && e.keyCode == 90){
                e.preventDefault()
            }

            setTimeout(()=>{
                let range = window.getSelection().getRangeAt(0)
                /* 防止删除留底dom */
                if(e.keyCode == 8){
                    if(entry.querySelectorAll('.section').length == 0){
                        entry.innerHTML = '<div class="section"></div>'
                    }
                }
                if(e.ctrlKey && e.keyCode == 66){
                    rangeBold(range)
                }
                if(e.ctrlKey && e.keyCode == 90){
                    this.undo()
                }else{
                    this.analysed(this.render(entry))
                    this.saveCache()
                }
                
            },10)
        })

        entry.addEventListener('mouseup',e=>{
            setTimeout(()=>{
                this.saveCache()
            },10)
        })
        this.saveCache(true)
    }

    /* 被动解析 */
    onAnalysed(fun){
        this.analysed = fun
    }

    /**
     * 渲染markdown
     * @param {Node | Text} html 被渲染的值
     * @returns 
     */
    render(html){
        if(typeof html == 'string'){
            const box = document.createElement('div')
            html.split('\n').map(v=>{
                const d = document.createElement('div')
                d.innerText = v
                box.append(d)
            })
            html = box
        }
        let children = Array.from(html.cloneNode(true).childNodes)
        children = handleCode(children)
        children = children.map(dom=>{
            dom = handleSplitLine(dom)
            dom = handleTitle(dom)
            dom = handleReference(dom)
            dom = handleSingleCode(dom)
            dom = handleBold(dom)
            dom = handleBold(dom)
            dom = handleLink(dom)
            dom = handleItalic(dom)
            return dom
        })

        var temp = document.createElement('div')
        temp.className = "__markdown_result__"
        children.map(v=>{
            temp.append(v)
        })
        markEditor(html)
        return temp.outerHTML
    }

    /* 设置样例 */
    setExmple(text){
        const box = document.createElement('div')
        text.split('\n').map(v=>{
            const d = document.createElement('div')
            d.innerText = v
            box.append(d)
        })
        this.entry.innerHTML = box.innerHTML
        this.analysed(this.render(this.entry))
        this.saveCache(true)
    }

    /* 获取光标位置 */
    getCursor(){
        const selection = document.getSelection()
        if(selection.rangeCount==0){
            return []
        }
        const range = selection.getRangeAt(0)
        const nodes = Array.from(this.entry.childNodes)
        const rDom = range.endContainer.parentElement
        let row,col;
        col = range.endOffset
        for(let i=0;i<nodes.length;i++){
            if(rDom == nodes[i]){
                row = i
                break;
            }
        }
        return [row,col]
    }

    /* 存储编辑缓存 */
    saveCache(init){
        if(init){
            this.cacheIndex = -1
            this.cache = []
        }
        const cloneEntry = this.entry.cloneNode(true)
        if(this.lastEdit != cloneEntry.innerHTML){
            this.lastEdit = cloneEntry.innerHTML
            if(this.cache.length-1>this.cacheIndex){
                this.cache = this.cache.slice(0,this.cacheIndex+1)
            }
            this.cache.push({
                node:cloneEntry,
                position:this.getCursor()
            })
            this.cacheIndex++
        }else{
            this.cache[this.cacheIndex]['position'] = this.getCursor()
        }
    }

    /* 撤销 */
    undo(){
        if(this.cacheIndex<=0) return
        
        this.cacheIndex--
        const last = this.cache[this.cacheIndex]
        this.entry.innerHTML = last.node.innerHTML
        this.analysed(this.render(last.node))

        const cloneEntry = this.entry.cloneNode(true)
        this.lastEdit = cloneEntry.innerHTML
        const range = window.getSelection().getRangeAt(0)
        range.setStart(this.entry.childNodes[last.position[0]].childNodes[0],last.position[1]);
        range.setEnd(this.entry.childNodes[last.position[0]].childNodes[0],last.position[1]);
        
        
    }
}

/* 处理加粗 */
function rangeBold(r){
    
    let clone = r.cloneContents(true)
    r.deleteContents()

    r.insertNode(new Text('**'+clone.childNodes[0].wholeText+'**'))
}

window['Markdown'] = Markdown