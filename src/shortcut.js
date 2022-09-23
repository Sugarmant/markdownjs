/* 处理加粗内容 */
export function rangeBold(r){
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
export function rangeItalics(r){
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
export function rangeDel(r){
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
export function rangeCite(r){
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
export function rangeH1(r){
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
export function rangeH2(r){
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
export function rangeHr(r){
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
export function rangeLink(r){
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
export function rangeUl(r){
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
export function rangeOl(r){
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
export function rangeImg(r){
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
export function rangeCode(r){
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