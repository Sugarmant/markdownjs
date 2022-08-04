/* 处理分割线 */
export function handleSplitLine(dom){
    if(dom.innerHTML){
        const html = dom.innerHTML.replace(/&nbsp;/g,'').replace(/ /g,'').replace(/\r/,'')
        if(html == '***'){
            dom.innerHTML = ''
            dom.className = 'splitLine'
        }
    }
    return dom
}

/* 处理标题 */
export function handleTitle(dom){
    if(dom.innerHTML){
        if(dom.innerHTML.slice(0,7) == '###### '){
            const text = dom.innerHTML.slice(6)
            dom = document.createElement('h6')
            dom.innerHTML = text
        }
        if(dom.innerHTML.slice(0,6) == '##### '){
            const text = dom.innerHTML.slice(5)
            dom = document.createElement('h5')
            dom.innerHTML = text
        }
        if(dom.innerHTML.slice(0,5) == '#### '){
            const text = dom.innerHTML.slice(4)
            dom = document.createElement('h4')
            dom.innerHTML = text
        }
        if(dom.innerHTML.slice(0,4) == '### '){
            const text = dom.innerHTML.slice(3)
            dom = document.createElement('h3')
            dom.innerHTML = text
        }
        if(dom.innerHTML.slice(0,3) == '## '){
            const text = dom.innerHTML.slice(2)
            dom = document.createElement('h2')
            dom.innerHTML = text
        }
        if(dom.innerHTML.slice(0,2) == '# '){
            const text = dom.innerHTML.slice(1)
            dom = document.createElement('h1')
            dom.innerHTML = text
        }
    }
    return dom
}

/* 处理引用内容 */
export function handleReference(dom){
    if(dom.innerHTML){
        if(dom.innerHTML.slice(0,5) == '&gt; '){
            dom.className='reference'
            dom.innerHTML = dom.innerHTML.slice(4)
        }
    }
    return dom
}

/* 处理重点内容 */
export function handleSingleCode(dom){
    if(dom.innerText){
        if(dom.innerText.indexOf('`')>-1 && dom.innerText.match(/`/g).length>=2){
            var con = dom.innerText
            var conLen = con.match(/`/g).length
            for(let i=0;i<Math.floor(conLen/2);i++){
                con = con.replace(/`/,'<span class="ref">').replace(/`/,'</span>')
                dom.innerHTML = con
            }
        }
    }
    return dom
}

/* 处理加粗内容 */
export function handleBold(dom){
    if(dom.innerText){
        let con = dom.innerText
        if(con.indexOf('**')>-1 && con.match(/\*\*/g).length>=2){
            
            var conLen = con.match(/\*\*/g).length
            for(let i=0;i<Math.floor(conLen/2);i++){
                con = con.replace('**','<span class="b">').replace('**','</span>')
                dom.innerHTML = con
            }
        }
        Array.from(dom.childNodes).map(v=>{
            if(v.innerHTML == '' && v.className == 'b')v.outerHTML = "****"
        })
    }
    return dom
}

/* 处理超链接 */
export function handleLink(dom){
    if(dom.innerHTML){
        var content = dom.innerHTML.replace(/\[.*\]\(.*\)/g,function(e){
            let front = e.match(/\[.*\]/)[0].slice(1).slice(0,-1)
            let end = e.match(/\(.*\)/)[0].slice(1).slice(0,-1)
            return '<a href="'+end+'">'+front+'</a>'
        })
        dom.innerHTML = content
    }
    return dom
}

/* 处理斜体 */
export function handleItalic(dom){
    if(dom.innerText){
        let con = dom.innerText
        if(con.indexOf('*')>-1 && con.match(/\*/g).length>=2){
            
            var conLen = con.match(/\*/g).length
            for(let i=0;i<Math.floor(conLen/2);i++){
                con = con.replace('*','<span class="i">').replace('*','</span>')
                dom.innerHTML = con
            }
        }
        Array.from(dom.childNodes).map(v=>{
            if(v.innerHTML == '' && v.className=='i')v.outerHTML = "**"
        })
    }
    return dom
}