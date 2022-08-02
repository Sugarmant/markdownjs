const markEditor = html=>{
    const children = html.childNodes
    for(let i=0;i<children.length;i++){
        let dom = children[i]
        dom.className = 'section'
        if(dom.innerText.slice(0,3) == '```'){
            dom.className = 'section code start'
            if(dom.innerHTML != dom.innerText) dom.innerHTML = dom.innerText 
            for(let e=i+1;e<children.length;e++){
                let codeDom = children[e]
                codeDom.className = 'section code'
                if(codeDom.innerText.slice(0,3) == '```'){
                    codeDom.className = 'section code end'
                    break;
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

            /* 标记点处理 */
            if(dom.innerText.indexOf('`')>-1 && dom.innerText.match(/`/g).length>=2){
                let text = dom.innerText
                let resultText = ''
                while(text != ''){
                    let dotIndex = text.indexOf('`');
                    if(dotIndex>-1 && text.match(/`/g).length>=2){
                        resultText+=text.slice(0,dotIndex)+'<span>`'
                        text = text.slice(dotIndex+1)

                        dotIndex = text.indexOf('`');
                        resultText+=text.slice(0,dotIndex)+'`</span>'
                        text = text.slice(dotIndex+1)
                    }else{
                        resultText+=text
                        text = ''
                    }
                }
            }

            /* 引用内容处理 */
            if(dom.innerText.slice(0,2) == '> ') dom.className = 'section reference'
        }
    }
}

export default markEditor