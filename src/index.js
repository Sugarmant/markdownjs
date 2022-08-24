import './prism/prism.js'
import './prism/prism.css'
import './markdown.css'
import {
    handleSplitLine,
    handleTitle,
    handleReference,
    handleSingleCode,
    handleBold,
    handleImageLink,
    handleLink,
    handleItalic,
} from './singleHandler'

import {handleCodes} from './wholeHandler'

import markEditor from './markEditor'

import {getCursor,setCursor} from './util'

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
        entry.innerHTML = ''
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
            if(e.ctrlKey && (e.keyCode == 66 || e.keyCode == 73 || e.keyCode == 90 || e.keyCode == 89)){
                e.preventDefault()
            }
            if(e.keyCode == 13) e.preventDefault()

            setTimeout(()=>{
                let range = window.getSelection().getRangeAt(0)

                if(e.keyCode == 13){
                    const position = getCursor(entry)
                    range.insertNode(new Text('\n'))
                    setCursor(entry,...[position[0]+1,position[1]+1])
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
                    if(e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40){
                        
                        this.renderEditor(entry.innerText)
                        this.saveCache()
                    }
                }
                this.analysed(this.render(entry.innerText))
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
                const p = document.createElement('div')
                p.innerText = v
                box.append(p)
            })
            html = box
        }
        
        let children = Array.from(html.cloneNode(true).childNodes)
        children = handleCodes(children)
        children = children.map(dom=>{
            dom = handleSplitLine(dom)
            dom = handleTitle(dom)
            dom = handleReference(dom)
            dom = handleSingleCode(dom)
            dom = handleBold(dom)
            dom = handleImageLink(dom)
            dom = handleLink(dom)
            dom = handleItalic(dom)
            return dom
        })

        var temp = document.createElement('div')
        temp.className = "__markdown_result__"
        children.map(v=>{
            temp.append(v)
        })
        return temp.outerHTML
    }

    renderEditor(html){
        const position = getCursor(this.entry)
        let dom = document.createElement('div')
        if(typeof html == 'string'){
            // html.split('\n').map(v=>{
            //     const p = document.createElement('span')
            //     p.innerText = v
            //     dom.append(p)
            // })
            this.entry.innerHTML = markEditor(html)
            setCursor(this.entry,...position)
            return
        }
        this.entry.innerHTML = markEditor(dom)
        setCursor(this.entry,...position)
    }

    /* 设置样例 */
    setExmple(text){
        this.analysed(this.render(text))
        this.saveCache(true)
        this.renderEditor(text)
    }

    /* 存储编辑缓存 */
    saveCache(init){
        if(init){
            this.cacheIndex = -1
            this.cache = []
            this.lastEdit = this.entry.cloneNode(true)
        }
        const cloneEntry = this.entry.cloneNode(true)
        if(this.lastEdit != cloneEntry.innerHTML){
            this.lastEdit = cloneEntry.innerHTML
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
        setCursor(this.entry,...last.position)
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
        setCursor(this.entry,...next.position)
    }
}


/* 处理加粗内容 */
function rangeBold(r){
    const start = r.startOffset
    const end = r.endOffset
    const t = r.startContainer.wholeText
    const inner = t.slice(start,end)?t.slice(start,end):'加粗样式'
    if(r.startContainer == r.endContainer){
        const resultText = t.slice(0,start)+'**'+inner+'**'+t.slice(end,t.length)
        r.startContainer.nodeValue = resultText
        r.setStart(r.startContainer,start+2)
        r.setEnd(r.startContainer,start+2+inner.length)
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
    const inner = t.slice(start,end)?t.slice(start,end):'斜体样式'
    if(r.startContainer == r.endContainer){
        const resultText = t.slice(0,start)+'*'+inner+'*'+t.slice(end,t.length)
        r.startContainer.nodeValue = resultText
        r.setStart(r.startContainer,start+1)
        r.setEnd(r.startContainer,start+1+inner.length)
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