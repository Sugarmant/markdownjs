/* 获取当前光标所在位置*/
export function getCursor(dom){
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
export function setCursor(dom,start,end){
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