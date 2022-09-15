const handleView = (html)=>{

    const strs = html.split('\n')

    for(let i=0;i<strs.length;i++){
        strs[i] = strs[i].replace(/</g,'&lt;').replace(/>/g,'&gt;')
        let v = strs[i]
        let language = ''
        if(v.slice(0,3) == '```'){
            let box = ''
            box+=''+'\n'
            language = v.replace('```','').replace(' ','').replace('\n','').replace('\r','')
            delete strs[i]
            for(let e=i+1;e<strs.length;e++){
                let vv = strs[e]
                if(vv.slice(0,3) == '```'){
                    box+=''+'\n'
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
            if(!Prism.languages[language]) language = 'jsx'
            const html = Prism.highlight(box, Prism.languages[language.replace('\r','')],language);
            strs[i] = '<pre><code>'+html+'</code></pre>'
        }else if(v.slice(0,2) == '- '){
            /* 处理无序列表 */
            let box = '';
            for(let e=i;e<strs.length;e++){
                let vv = strs[e]
                if(vv.slice(0,2) == '- '){
                    if(strs[e+1].slice(0,2) == '- '){
                        box+='<li>'+vv.slice(2,vv.length)+'\n</li>'
                    }else{
                        box+='<li>'+vv.slice(2,vv.length)+'</li>'
                    }
                }else{
                    break;
                }
                i=e
                delete strs[i]
            }
            strs[i] = '<ul>'+box+'</ul>'
        }else if(v.match(/^[0-9]\.\s/)){
            /* 处理有序列表 */
            let box = '';
            for(let e=i;e<strs.length;e++){
                let vv = strs[e]
                if(vv.match(/^[0-9]\.\s/)){
                    if(strs[e+1].match(/^[0-9]\.\s/)){
                        box+='<li>'+vv.replace(/^[0-9]\.\s/,'')+'\n</li>'
                    }else{
                        box+='<li>'+vv.replace(/^[0-9]\.\s/,'')+'</li>'
                    }
                }else{
                    break;
                }
                i=e
                delete strs[i]
            }
            strs[i] = '<ol>'+box+'</ol>'
        }else{

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
                        handled += pre+'<del>'
                        handled += con.slice(0,second)+'</del>'
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

            /* 处理标题 */
            if(v.slice(0,7) == '###### ') v = '<h6>'+v.slice(7,v.length)+'</h6>'
            if(v.slice(0,6) == '##### ') v = '<h5>'+v.slice(6,v.length)+'</h5>'
            if(v.slice(0,5) == '#### ') v = '<h4>'+v.slice(5,v.length)+'</h4>'
            if(v.slice(0,4) == '### ') v = '<h3>'+v.slice(4,v.length)+'</h3>'
            if(v.slice(0,3) == '## ') v = '<h2>'+v.slice(3,v.length)+'</h2>'
            if(v.slice(0,2) == '# ') v = '<h1>'+v.slice(2,v.length)+'</h1>'

            /* 引用内容处理 */
            if(v.slice(0,5) == '&gt; ') v = '<blockquote>'+v.slice(5,v.length)+'</blockquote>'

            /* 处理分割线 */
            if(v == '***') v = '<hr />'

            /* 处理图片 */
            v = v.replace(/\!\[.*\]\(.*\)/g,function(e){
                let front = e.match(/^\!\[.*\]\(/)[0].slice(2,-2)
                let end = e.match(/(?=\]\().*\)$/)[0].slice(2,-1)
                return '<img alt="'+front+'" src="'+end+'" />'
            })

            /* 处理超链接 */
            v = v.replace(/\[.*\]\(.*\)/g,function(e){
                let front = e.match(/^\[.*\]\(/)[0].slice(2,-2)
                let end = e.match(/(?=\]\().*\)$/)[0].slice(2,-1)
                return '<a href="'+end+'">'+front+'</a>'
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
                        handled += pre+'<cite>'
                        handled += con.slice(0,second)+'</cite>'
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
                        handled += pre+'<strong>'
                        handled += con.slice(0,second)+'</strong>'
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
                        handled += pre+'<i>'
                        handled += con.slice(0,second)+'</i>'
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
            if(v.slice(0,1) != '<' && v.slice(0,-1) != '>'){
                strs[i] = '<p>'+v+'</p>'
            }
        }
    }
    let newArr = []
    strs.map(v=>newArr.push(v))
    return newArr.join('\n')
}

export default handleView