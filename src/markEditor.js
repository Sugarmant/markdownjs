
// import { handleCode } from './singleHandler'

const markEditor = (html,app)=>{

    const strs = html.split('\n')

    for(let i=0;i<strs.length;i++){
        strs[i] = strs[i].replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
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

            if(v.slice(0,7) == '###### ') v = '<span class="section h6">'+v+'</span>'
            if(v.slice(0,6) == '##### ') v = '<span class="section h5">'+v+'</span>'
            if(v.slice(0,5) == '#### ') v = '<span class="section h4">'+v+'</span>'
            if(v.slice(0,4) == '### ') v = '<span class="section h3">'+v+'</span>'
            if(v.slice(0,3) == '## ') v = '<span class="section h2">'+v+'</span>'
            if(v.slice(0,2) == '# ') v = '<span class="section h1">'+v+'</span>'

            /* 引用内容处理 */
            if(v.slice(0,5) == '&gt; ') v = '<span class="section reference">'+v+'</span>'

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
                        handled += pre+'<span class="b">**'
                        handled += con.slice(0,second)+'**</span>'
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

            // /* 斜体内容处理 */
            if(v && v.indexOf('*')>-1){
                let con = v
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

export default markEditor