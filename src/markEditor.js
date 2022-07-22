const markEditor = html=>{
    const children = html.childNodes
    for(let i=0;i<children.length;i++){
        let dom = children[i]
        dom.className = 'section'
        if(dom.innerText.slice(0,3) == '```'){
            dom.className = 'section code'
            for(let e=i+1;e<children.length;e++){
                let codeDom = children[e]
                codeDom.className = 'section code'
                if(codeDom.innerText.slice(0,3) == '```') break;
                i++
            }
            i++
        }else{
            if(dom.innerHTML.slice(0,7) == '###### ') dom.className = 'section h6'
            if(dom.innerHTML.slice(0,6) == '##### ') dom.className = 'section h5'
            if(dom.innerHTML.slice(0,5) == '#### ') dom.className = 'section h4'
            if(dom.innerHTML.slice(0,4) == '### ') dom.className = 'section h3'
            if(dom.innerHTML.slice(0,3) == '## ') dom.className = 'section h2'
            if(dom.innerHTML.slice(0,2) == '# ') dom.className = 'section h1'

            if(dom.innerText.indexOf('`')>-1 && dom.innerText.match(/`/g).length>=2){
                let text = dom.innerText
                let resultText = ''
                while(text != ''){
                    let dotIndex = text.indexOf('`');
                    console.log(text.match(/`/g))
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
                console.log(resultText)
            }
        }
    }
}

export default markEditor