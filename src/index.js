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
        this.analysed = function(){}
        
        var entry = document.querySelector(dom);
        this.entry = entry
        entry.className= 'editor __markdown__'
        entry.innerHTML = '<div class="section"></div>'
        entry.setAttribute('contenteditable','true');
        /* 处理复制过来的内容 */
        entry.addEventListener('paste',function(e){
            e.preventDefault()
            var paste = (e.originalEvent || e).clipboardData.getData('text/plain')
            document.execCommand('insertText',false,paste)
        })

        /* 处理键盘事件 */
        entry.addEventListener('keydown',e=>{
            let range = window.getSelection().getRangeAt(0)
            if(e.ctrlKey && e.keyCode == 66){
                e.preventDefault()
            }

            setTimeout(()=>{
                /* 防止删除留底dom */
                if(e.keyCode == 8){
                    if(entry.querySelectorAll('.section').length == 0){
                        entry.innerHTML = '<div class="section"></div>'
                    }
                }
                if(e.ctrlKey && e.keyCode == 66){
                    rangeBold(range)
                }

                this.analysed(this.render(entry))
            },10)
        })
    }

    onAnalysed(fun){
        this.analysed = fun
    }

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

    setExmple(text){
        const box = document.createElement('div')
        text.split('\n').map(v=>{
            const d = document.createElement('div')
            d.innerText = v
            box.append(d)
        })
        this.entry.innerHTML = box.innerHTML
        this.analysed(this.render(this.entry))
    }
}

/* 处理加粗 */
function rangeBold(r){
    let clone = r.cloneContents(true)
    r.deleteContents()

    r.insertNode(new Text('**'+clone.childNodes[0].wholeText+'**'))
}

window['Markdown'] = Markdown