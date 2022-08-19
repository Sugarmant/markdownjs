import {getCursor,setCursor} from './util'

const markEditor = (html,app)=>{
    const position = getCursor(app.entry)
    const children = html.childNodes
    let changed = false
    for(let i=0;i<children.length;i++){
        let dom = children[i].cloneNode(true)
        dom.innerHTML = dom.innerText
        dom.className = 'section'

        if(dom.innerText == '') dom.innerHTML = `<br/>`

        if(dom.innerHTML.slice(0,3) == '```'){
            dom.className = 'section code start'
            if(children[i].outerHTML!=dom.outerHTML){
                children[i].outerHTML = dom.outerHTML
                changed = true
            }
            for(let e=i+1;e<children.length;e++){
                let codeDom = children[e].cloneNode(true)
                if(codeDom.innerText.slice(0,3) == '```'){
                    codeDom.className = 'section code end'
                    if(children[e].outerHTML!=codeDom.outerHTML){
                        children[e].outerHTML = codeDom.outerHTML
                        changed = true
                    }
                    break;
                }else{
                    codeDom.className = 'section code'
                    if(children[e].outerHTML!=codeDom.outerHTML){
                        children[e].outerHTML = codeDom.outerHTML
                        changed = true
                    }
                }
                i++
            }
            i++
            
        }else{
            /* 标题处理 */
            if(dom.innerHTML.slice(0,7) == '###### ') dom.className = 'section h6'
            if(dom.innerHTML.slice(0,6) == '##### ') dom.className = 'section h5'
            if(dom.innerHTML.slice(0,5) == '#### ') dom.className = 'section h4'
            if(dom.innerHTML.slice(0,4) == '### ') dom.className = 'section h3'
            if(dom.innerHTML.slice(0,3) == '## ') dom.className = 'section h2'
            if(dom.innerHTML.slice(0,2) == '# ') dom.className = 'section h1'

            /* 引用内容处理 */
            if(dom.innerText.slice(0,2) == '> ') dom.className = 'section reference'

            /* 重点内容处理 */
            if(dom.innerHTML && dom.innerText.indexOf('`')>-1){
                let con = dom.innerHTML
                let handled = ''
                while(con.indexOf('`')>-1){
                    let first = con.indexOf('`')
                    const pre = con.slice(0,first)
                    con = con.slice(first+1)
                    
                    let second = con.indexOf('`')
                    if(second>-1 && pre[pre.length-1]!='>'){
                        handled += pre+'<span class="ref">`'
                        handled += con.slice(0,second)+'`</span>'
                        con = con.slice(second+1)
                    }else{
                        
                        handled += pre+(first>-1?'`':'')
                    }
                }
                handled+=con
                if(handled != dom.innerHTML){
                    dom.innerHTML = handled;
                }
            }

            /* 加粗内容处理 */
            if(dom.innerHTML && dom.innerText.indexOf('**')>-1){
                let con = dom.innerHTML
                let handled = ''
                while(con.indexOf('**')>-1){
                    let first = con.indexOf('**')
                    const pre = con.slice(0,first)
                    con = con.slice(first+2)
                    
                    let second = con.indexOf('**')
                    if(second>-1 && pre[pre.length-1]!='>'){
                        handled += pre+'<span class="b">**'
                        handled += con.slice(0,second)+'**</span>'
                        con = con.slice(second+2)
                    }else{
                        handled += pre+(first>-2?'**':'')
                    }
                }
                handled+=con
                if(handled != dom.innerHTML){
                    dom.innerHTML = handled;
                }
            }

            // /* 斜体内容处理 */
            if(dom.innerHTML && dom.innerText.indexOf('*')>-1){
                let con = dom.innerHTML
                let handled = ''
                while(con.indexOf('*')>-1 && con[con.indexOf('*')+1]!='*' && con[con.indexOf('*')-1] !='>'){
                    let first = con.indexOf('*')
                    const pre = con.slice(0,first)
                    con = con.slice(first+1)
                    
                    let second = con.indexOf('*')
                    if(second>-1 && pre[pre.length-1]!='>'){
                        handled += pre+'<span class="i">*'
                        handled += con.slice(0,second)+'*</span>'
                        con = con.slice(second+1)
                    }else{
                        handled += pre+(first>-1?'*':'')
                    }
                }
                handled+=con
                if(handled != dom.innerHTML){
                    dom.innerHTML = handled;
                }
            }
            if(children[i].outerHTML!=dom.outerHTML){
                children[i].outerHTML = dom.outerHTML
                changed = true
            }
        }
    }
    if(changed) setCursor(app.entry,...position)
}

export default markEditor