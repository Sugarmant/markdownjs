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
            /* 阻止 加粗 斜体 撤回 恢复 事件*/
            if(e.ctrlKey && e.keyCode == 66 || e.keyCode == 73 || e.keyCode == 90 || e.keyCode == 89){
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

                if(e.ctrlKey){
                    if(e.keyCode == 66){
                        rangeBold(range)
                    }else if(e.keyCode == 73){
                        rangeItalics(range)
                    }
                }

                if(e.ctrlKey && e.keyCode == 90){
                    this.undo()
                }else if(e.ctrlKey && e.keyCode == 89){
                    this.redo()
                }else{
                    this.analysed(this.render(entry))
                    this.saveCache()
                }

            },10)
        })

        entry.addEventListener('mouseup',e=>{
            setTimeout(()=>{
                this.saveCache()
                console.log(this.getCursor())
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
            dom = handleLink(dom)
            dom = handleItalic(dom)
            return dom
        })

        var temp = document.createElement('div')
        temp.className = "__markdown_result__"
        children.map(v=>{
            temp.append(v)
        })
        markEditor(html,this)
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
        let rDom;
        if(range.endContainer instanceof HTMLDivElement && range.endContainer.className.indexOf('section')>-1){
            rDom = range.endContainer
        }else{
            rDom = range.endContainer
            while(rDom.tagName!='BODY' && (rDom instanceof Text || rDom.className.indexOf('section')==-1)){
                rDom = rDom.parentElement
            }
        }

        let row,col = 0;
        for(let i=0;i<nodes.length;i++){
            if(rDom == nodes[i] || rDom.contains(nodes[i])){
                row = i
                break;
            }
        }
        
        if(nodes[row].childNodes && range.endContainer instanceof Text){
            col = findColInRow(nodes[row],range)
        }
        return [row,col]
    }

    /* 设置光标位置 */
    setCursor(rowIndex,colIndex){
        const selection = window.getSelection()
        if(selection.rangeCount){
            const r = selection.getRangeAt(0)
            const row = Array.from(this.entry.childNodes)[rowIndex]
            const children = Array.from(row.childNodes)
            let index = 0;
            for(let i=0;i<children.length;i++){
                const len = children[i].length || children[i].innerText.length
                if(index+len<colIndex){
                    index+=len
                }else{
                    const lastIndex = colIndex-index
                    const dom = children[i] instanceof Text?children[i]:children[i].childNodes[0]
                    r.setStart(dom,lastIndex)
                    r.setEnd(dom,lastIndex)
                    break;
                }
            }
        }
        
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
        this.setCursor(...last.position)
    }

    /* 恢复 */
    redo(){
        console.log(this.cacheIndex, this.cache.length)
        if(this.cacheIndex == this.cache.length-1) return
        
        this.cacheIndex++
        const next = this.cache[this.cacheIndex]
        this.entry.innerHTML = next.node.innerHTML
        this.analysed(this.render(next.node))

        const cloneEntry = this.entry.cloneNode(true)
        this.lastEdit = cloneEntry.innerHTML
        this.setCursor(...next.position)
    }
}


/* 处理加粗内容 */
function rangeBold(r){
    const start = r.startOffset
    const end = r.endOffset
    const t = r.startContainer.wholeText
    if(r.startContainer == r.endContainer){
        const resultText = t.slice(0,start)+'**'+t.slice(start,end)+'**'+t.slice(end,t.length)
        r.startContainer.nodeValue = resultText
        r.setStart(r.startContainer,start+2)
        r.setEnd(r.startContainer,start+2+t.slice(start,end).length)
    }else{
        const et = r.endContainer.wholeText
        r.startContainer.nodeValue = t.slice(0,r.startOffset) + '**' + t.slice(r.startOffset,t.length)
        r.endContainer.nodeValue = et.slice(0,r.endOffset) + '**' + et.slice(r.endOffset,et.length)
        r.setStart(r.startContainer,start+2)
        r.setEnd(r.endContainer,end)
    } 
}

/* 处理斜体内容 */
function rangeItalics(r){
    const start = r.startOffset
    const end = r.endOffset
    const t = r.startContainer.wholeText
    if(r.startContainer == r.endContainer){
        const resultText = t.slice(0,start)+'*'+t.slice(start,end)+'*'+t.slice(end,t.length)
        r.startContainer.nodeValue = resultText
        r.setStart(r.startContainer,start+1)
        r.setEnd(r.startContainer,start+1+t.slice(start,end).length)
    }else{
        const et = r.endContainer.wholeText
        r.startContainer.nodeValue = t.slice(0,r.startOffset) + '*' + t.slice(r.startOffset,t.length)
        r.endContainer.nodeValue = et.slice(0,r.endOffset) + '*' + et.slice(r.endOffset,et.length)
        r.setStart(r.startContainer,start+1)
        r.setEnd(r.endContainer,end)
    } 
}

/* 寻找光标所在的列数 */
function findColInRow(row,range,repeat){
    let len = 0;
    for(const item of row.childNodes){
        if(item instanceof Text){
            if(range.endContainer == item){
                len = !repeat?len+=range.endOffset:[len+=range.endOffset]
                break;
            }else{
                len+=item.length
            }
        }else{
            const res = findColInRow(item,range,true)
            if(typeof res == 'number'){
                len+=res
            }else{
                len+=res[0]
                break
            }
        }
    }
    return len
}






window['Markdown'] = Markdown