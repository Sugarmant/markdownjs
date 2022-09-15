import './prism/prism.js'
import './prism/prism.css'
import './markdown.css'

import handleEditor from './handleEditor'

import handleView from './handleView'

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
            if(e.keyCode == 13 || e.keyCode == 9) e.preventDefault()
            if(e.shiftKey && e.keyCode == 9) e.preventDefault()

            setTimeout(()=>{
                let range = window.getSelection().getRangeAt(0)

                if(e.keyCode == 13){
                    const position = getCursor(entry)
                    range.insertNode(new Text('\n'))
                    setCursor(entry,...[position[0]+1,position[1]+1])
                }

                if(e.keyCode == 9 && !e.shiftKey){
                    const position = getCursor(entry)
                    range.insertNode(new Text("    "))
                    setCursor(entry,...[position[0]+4,position[1]+4])
                }
                if(e.shiftKey && e.keyCode == 9){
                    const position = getCursor(entry)
                    let con = this.entry.innerText
                    for(let i=position[0];i>0;i--){
                        i = parseInt(i)  //防止出现小数
                        if(con[i] == '\n' && i!=position[0]){
                            
                            const spaceLength = 4-con.slice(i+1,i+5).replace(/^ +/g,'').length
                            if(spaceLength){
                                const start = con.slice(0,i+1)
                                const end = con.slice(1+i+spaceLength,con.length)
                                this.renderEditor(start+end)
                                this.saveCache()
                                
                                setCursor(entry,...[position[0]-spaceLength,position[1]-spaceLength])
                            }
                            break
                        }
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
                    if(e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40 && e.key!='Process'){
                        this.renderEditor(entry.innerText)
                        this.saveCache()
                    }
                }
                
                this.analysed(this.renderView(entry.innerText))
            },10)
        })
        entry.addEventListener('mouseup',e=>{
            setTimeout(()=>{
                this.saveCache()
            },10)
        })
    }

    /* 被动解析 */
    onAnalysed(fun){
        this.analysed = fun
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
    }

    /* 设置样例 */
    setExmple(text){
        this.analysed(this.renderView(text))
        this.renderEditor(text)
        this.saveCache(true)
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
        this.analysed(this.renderView(last.node.innerText))

        const cloneEntry = this.entry.cloneNode(true)
        this.lastEdit = cloneEntry.innerHTML
        setCursor(this.entry,...last.position)
    }

    /* 恢复 */
    redo(){
        if(this.cacheIndex == this.cache.length-1) return
        
        this.cacheIndex++
        const next = this.cache[this.cacheIndex]
        this.entry.innerHTML = next.node.innerHTML
        this.analysed(this.renderView(next.node.innerText))

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

window['Markdown'] = Markdown