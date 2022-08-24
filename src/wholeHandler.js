/* 处理code */
export function handleCodes(children){
    let list = []

    /* 处理code */
    for(let i=0;i<children.length;i++){
        let dom = children[i]
        if(dom instanceof HTMLDivElement && dom.innerText.slice(0,3) == '```'){
            let language = dom.innerText.slice(3).replace(' ','').replace('\n','').replace('\r','')
            let preHTML = ''
            for(let e=i+1;e<children.length;e++){
                let codeDom = children[e]
                if(codeDom.innerText.slice(0,3) == '```'){
                    break;
                }else{
                    i++
                    preHTML+=codeDom.innerText.replace(/\n/,'')+'\n';
                }
            }
            i++
            let codeBox = document.createElement('code')
            if(!Prism.languages[language]) language = 'jsx'
            const html = Prism.highlight(preHTML, Prism.languages[language.replace('\r','')],language);
            codeBox.innerHTML = html
            const pre = document.createElement('pre')
            pre.append(codeBox)
            list.push(pre)
        }else{
            list.push(dom)
        }
    }
    return list
}