import {getCursor,setCursor} from './util'
import {rangeBold,rangeItalics} from './shortcut'
export default function keyboardHook(e){
    const position = getCursor(this.entry)
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
            setCursor(this.entry,position[0]+4,position[1]+4)
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
            setCursor(this.entry,position[0]+4,position[1]+effectedLineCount)
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
        setCursor(this.entry,position[0]-firstOffset,position[1]-effectedLineCount)
    }

    /* 处理 加粗，斜体 */
    if(e.ctrlKey){
        if(e.keyCode == 66){
            rangeBold(range)
        }else if(e.keyCode == 73){
            rangeItalics(range)
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
            setCursor(this.entry,position[0]+1,position[1]+1)

            //处理无序有序列表换行样式
            if(range.collapsed){
                if(range.startContainer){
                    const parent = range.startContainer.parentElement.parentElement
                    if(this.entry.contains(parent) && parent.tagName == 'UL'){
                        const li = document.createElement('li')
                        li.innerHTML = '<span>- </span>'
                        range.insertNode(li)
                        setCursor(this.entry,position[0]+3,position[0]+3)
                    }else if(this.entry.contains(parent) && parent.tagName == 'OL'){
                        const li = document.createElement('li')
                        const lastNumber = Number(parent.lastChild.querySelector('span').innerText)+1
                        li.innerHTML = '<span>'+lastNumber+'. </span>'
                        range.insertNode(li)
                        setCursor(this.entry,position[0]+3+String(lastNumber).length,position[0]+3+String(lastNumber).length)
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