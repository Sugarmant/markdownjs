const handleView = (html)=>{
    if(!html) return ''
    const strs = html.replace(/\r\n/g,'\n').split('\n')

    for(let i=0;i<strs.length;i++){
        strs[i] = strs[i].replace(/</g,'&lt;').replace(/>/g,'&gt;')
        let v = strs[i]
        let language = ''
        if(v.slice(0,3) == '```'){
            let box = ''
            box+=''
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
        }else if(v.match(/^[0-9]+\.\s/)){
            /* 处理有序列表 */
            let box = '';
            for(let e=i;e<strs.length;e++){
                let vv = strs[e]
                if(vv.match(/^[0-9]+\.\s/)){
                    if(strs[e+1].match(/^[0-9]\.\s/)){
                        box+='<li>'+vv.replace(/^[0-9]+\.\s/,'')+'\n</li>'
                    }else{
                        box+='<li>'+vv.replace(/^[0-9]+\.\s/,'')+'</li>'
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
            const matched = v.match(/^#{1,6}\s/)
            if(matched){
                v = '<h'+(matched[0].length-1)+' id="_cata'+i+'_">'+v.slice(matched[0].length)+'</h'+(matched[0].length-1)+'>'
            }

            /* 引用内容处理 */
            if(v.slice(0,5) == '&gt; ') v = '<blockquote>'+v.slice(5)+'</blockquote>'

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
                let front = e.match(/^\[.*\]\(/)[0].slice(1,-2)
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
                        handled += pre+'<mark>'
                        handled += con.slice(0,second)+'</mark>'
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
            if(v.indexOf('<hr') != 0 && v.indexOf('<h6') != 0 && v.indexOf('<h5') != 0 && v.indexOf('<h4') != 0 && v.indexOf('<h3') != 0 && v.indexOf('<h2') != 0 && v.indexOf('<h1') != 0 && v.indexOf('<blockquote') != 0){
                strs[i] = '<p>'+v+'</p>'
            }
        }
    }
    let newArr = []
    strs.map(v=>newArr.push(v))
    return newArr.join('')
}

export default handleView