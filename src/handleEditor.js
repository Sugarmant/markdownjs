const handleEditor = (html)=>{
    const strs = html.replace(/\r\n/g,'\n').split('\n')
    
    for(let i=0;i<strs.length;i++){
        /* 处理code */
        strs[i] = strs[i].replace(/</g,'&lt;').replace(/>/g,'&gt;')
        let v = strs[i]
        let start,end = ''
        if(v.slice(0,3) == '```'){
            let box = ''
            box+='\n'
            start = '```'
            delete strs[i]
            for(let e=i+1;e<strs.length;e++){
                let vv = strs[e]
                if(vv.slice(0,3) == '```'){
                    box+='\n'
                    end = '```'
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
            const originLang = v.split('\n')[0].slice(3).replace(' ','').replace('\n','').replace('\r','')
            let language = v.split('\n')[0].slice(3).replace(' ','').replace('\n','').replace('\r','')
            if(!Prism.languages[language]) language = 'jsx'
            const html = Prism.highlight(box, Prism.languages[language.replace('\r','')],language);
            strs[i] = '<pre><code><span>'+start+originLang+'</span>'+html+'<span>'+end+'</span></code></pre>'
        }else if(v.slice(0,2) == '- '){
            /* 处理无序列表 */
            let box = '';
            for(let e=i;e<strs.length;e++){
                let vv = strs[e]
                if(vv.slice(0,2) == '- '){
                    if(strs[e+1].slice(0,2) == '- '){
                        box+='<li><span>- </span>'+vv.slice(2)+'\n</li>'
                    }else{
                        box+='<li><span>- </span>'+vv.slice(2)+'</li>'
                    }
                }else{
                    break;
                }
                i=e
                delete strs[i]
            }
            strs[i] = '<ul>'+box+'</ul>'
        }else if(v.match(/^[0-9]+\.\s+/)){
            /* 处理有序列表 */
            let box = '';
            let lab = 1
            for(let e=i;e<strs.length;e++){
                let vv = strs[e]
                if(vv.match(/^[0-9]+\.\s/)){
                    try{
                        if(strs[e+1].match(/^[0-9]+\.\s/)){
                            box+='<li><span>'+lab+'. </span>'+vv.replace(/^[0-9]+\.\s/,'')+'\n</li>'
                        }else{
                            box+='<li><span>'+lab+'. </span>'+vv.replace(/^[0-9]+\.\s/,'')+'</li>'
                        }
                        lab++
                    }catch(err){
                        break
                    }
                }else{
                    break;
                }
                i=e
                delete strs[i]
            }
            strs[i] = '<ol>'+box+'</ol>'
        }else{

            if(v.slice(0,7) == '###### ') v = '<h6><span class="plain">###### </span>'+v.slice(7)+'</h6>'
            if(v.slice(0,6) == '##### ') v = '<h5><span class="plain">##### </span>'+v.slice(6)+'</h5>'
            if(v.slice(0,5) == '#### ') v = '<h4><span class="plain">#### </span>'+v.slice(5)+'</h4>'
            if(v.slice(0,4) == '### ') v = '<h3><span class="plain">### </span>'+v.slice(4)+'</h3>'
            if(v.slice(0,3) == '## ') v = '<h2><span class="plain">## </span>'+v.slice(3)+'</h2>'
            if(v.slice(0,2) == '# ') v = '<h1><span class="plain"># </span>'+v.slice(2)+'</h1>'

            /* 处理分割线 */
            if(v == '***') v = '<span class="splitLine">***</span>'

            /* 引用内容处理 */
            if(v.slice(0,5) == '&gt; ') v = '<blockquote><span class="plain">'+v.slice(0,5)+'</span>'+v.slice(5)+'</blockquote>'

            /* 处理图片 */
            v = v.replace(/\!\[.*\]\(.*\)/g,function(e){
                let front = e.match(/^\!\[.*\]\(/)[0].slice(2,-2)
                let end = e.match(/(?=\]\().*\)$/)[0].slice(2,-1)
                return `<span class="img"><img src="${end}" /><span class="text">![${front}]<span class="plain">(${end})</span></span></span>`
            })

            /* 处理超链接 */
            v = v.replace(/\[.*\]\(.*\)/g,function(e){
                let front = e.match(/^\[.*\]\(/)[0].slice(1,-2)
                let end = e.match(/(?=\]\().*\)$/)[0].slice(2,-1)
                end = e.replace(front,'').slice(3).slice(0,-1)
                return '<span class="plain">[</span>'+front+'<span class="plain">]</span><span class="plain">(<a href="'+end+'">'+end+'</a>)</span>'
                
            })

            /* 删除线处理 */
            if(v && v.indexOf('~~')>-1){
                let con = v
                let handled = ''
                while(con.indexOf('~~')>-1){
                    let first = con.indexOf('~~')
                    const pre = con.slice(0,first)
                    con = con.slice(first+2)
                    
                    let second = con.indexOf('~~')
                    if(second>-1 && pre[pre.length-1]!='>'){
                        handled += pre+'<span class="del">~~</span><del>'
                        handled += con.slice(0,second)+'</del><span class="del">~~</span>'
                        con = con.slice(second+2)
                    }else{
                        handled += pre+(first>-2?'~~':'')
                    }
                }
                handled+=con
                if(handled != v){
                    v = handled;
                }
            }

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
                        handled += pre+'<cite>`'
                        handled += con.slice(0,second)+'`</cite>'
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
                        handled += pre+'<strong><span>**</span>'
                        handled += con.slice(0,second)+'<span>**</span></strong>'
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
                        handled += pre+'<i><span>*</span>'
                        handled += con.slice(0,second)+'<span>*</span></i>'
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