const handleEditor = (html)=>{

    const strs = html.split('\n')

    for(let i=0;i<strs.length;i++){
        strs[i] = strs[i].replace(/</g,'&lt;').replace(/>/g,'&gt;')
        let v = strs[i]
        
        if(v.slice(0,3) == '```'){
            let box = ''
            box+=v+'\n'
            delete strs[i]
            for(let e=i+1;e<strs.length;e++){
                let vv = strs[e]
                if(vv.slice(0,3) == '```'){
                    box+=vv+'\n'
                    break;
                }else{
                    box+=vv+'\n'
                }
                i=e
                delete strs[i]
            }
            box = box.replace(/\n(?![\s\S]*\n)/,'')
            i++
            delete strs[i]
            let language = box.split('\n')[0].slice(3).replace(' ','').replace('\n','').replace('\r','')
            let codeBox = document.createElement('span')
            codeBox.className = 'code'
            if(!Prism.languages[language]) language = 'jsx'
            const html = Prism.highlight(box, Prism.languages[language.replace('\r','')],language);
            codeBox.innerHTML = html
            strs[i] = codeBox.outerHTML
        }else{

            if(v.slice(0,7) == '###### ') v = '<h6><span class="plain">###### </span>'+v.slice(7,v.length)+'</h6>'
            if(v.slice(0,6) == '##### ') v = '<h5><span class="plain">##### </span>'+v.slice(6,v.length)+'</h5>'
            if(v.slice(0,5) == '#### ') v = '<h4><span class="plain">#### </span>'+v.slice(5,v.length)+'</h4>'
            if(v.slice(0,4) == '### ') v = '<h3><span class="plain">### </span>'+v.slice(4,v.length)+'</h3>'
            if(v.slice(0,3) == '## ') v = '<h2><span class="plain">## </span>'+v.slice(3,v.length)+'</h2>'
            if(v.slice(0,2) == '# ') v = '<h1><span class="plain"># </span>'+v.slice(2,v.length)+'</h1>'

            /* 处理无序列表 */
            if(v.slice(0,2) == '- ') v = '<span class="section li">'+v+'</span>'
            
            /* 处理分割线 */
            if(v == '***') v = '<span class="splitLine">***</span>'

            /* 引用内容处理 */
            if(v.slice(0,5) == '&gt; ') v = '<blockquote>'+v+'</blockquote>'

            /* 处理图片 */
            v = v.replace(/\!\[.*\]\(.*\)/g,function(e){
                let front = e.match(/\[.*\]/)[0].slice(1).slice(0,-1)
                let end = e.match(/\(.*\)/)[0].slice(1).slice(0,-1)
                return `<span class="img"><img src="${end}" /><span class="text">![${front}]<span class="plain">(${end})</span></span></span>`
            })

            /* 处理超链接 */
            v = v.replace(/\[.*\]\(.*\)/g,function(e){
                let front = e.match(/\[.*\]/)[0].slice(1).slice(0,-1)
                let end = e.match(/\(.*\)/)[0].slice(1).slice(0,-1)
                return '<span class="plain">[</span>'+front+'<span class="plain">]</span><span class="plain">('+end+')</span>'
            })

            /* 重点内容处理 */
            if(v && v.indexOf('`')>-1){
                let con = v
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
                if(handled != v){
                    v = handled;
                }
            }

            /* 加粗内容处理 */
            if(v && v.indexOf('**')>-1){
                let con = v
                let handled = ''
                while(con.indexOf('**')>-1){
                    let first = con.indexOf('**')
                    const pre = con.slice(0,first)
                    con = con.slice(first+2)
                    
                    let second = con.indexOf('**')
                    if(second>-1 && pre[pre.length-1]!='>'){
                        handled += pre+'<strong>**'
                        handled += con.slice(0,second)+'**</strong>'
                        con = con.slice(second+2)
                    }else{
                        handled += pre+(first>-2?'**':'')
                    }
                }
                handled+=con
                if(handled != v){
                    v = handled;
                }
            }

            /* 斜体内容处理 */
            if(v && v.indexOf('*')>-1){
                let con = v
                let handled = ''
                while(con.indexOf('*')>-1 && con[con.indexOf('*')+1]!='*' && con[con.indexOf('*')-1] !='>'){
                    let first = con.indexOf('*')
                    const pre = con.slice(0,first)
                    con = con.slice(first+1)

                    let second = con.indexOf('*')
                    if(second>-1 && pre[pre.length-1]!='>'){
                        handled += pre+'<i>*'
                        handled += con.slice(0,second)+'*</i>'
                        con = con.slice(second+1)
                    }else{
                        handled += pre+(first>-1?'*':'')
                    }
                }
                handled+=con
                if(handled != v){
                    v = handled;
                }
            }
            strs[i] = v
        }
    }
    let newArr = []
    strs.map(v=>{
        newArr.push(v)
    })
    return newArr.join('\n')
}

export default handleEditor