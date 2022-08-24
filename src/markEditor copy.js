
import { handleCode } from './singleHandler'

const markEditor = (html,app)=>{
    const children = html.childNodes
    for(let i=0;i<children.length;i++){
        let dom = children[i].cloneNode(true)
        dom.className = 'section'
        if(dom.innerHTML.slice(0,3) == '```'){
            const box = document.createElement('div')
            box.className = 'code'
            children[i].parentNode.insertBefore(box,children[i])
            box.append(dom)
            children[i+1].remove()
            for(let e=i+1;e<children.length;e){
                let codeDom = children[e]
                if(codeDom.innerText.slice(0,3) == '```'){
                    box.append(children[e])
                    break;
                }else{
                    box.append(children[e])
                }
            }
            box.outerHTML = handleCode(box.cloneNode(true)).outerHTML
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
                children[i].parentNode.replaceChild(dom,children[i])
            }
        }
    }
    return html.innerHTML
}

export default markEditor