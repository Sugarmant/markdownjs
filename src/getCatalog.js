/* 处理目录 */
export default function getCatalog(text){
    const arr = []
    text.split('\n').map((v,key)=>{
        const matched = v.match(/^#{1,6}\s/)
        if(matched){
            // debugger
            const con = v.slice(matched[0].length)
            let level = matched[0].length-1
            const preLevel = arr[arr.length-1] && arr[arr.length-1][3]
            if(preLevel == undefined || preLevel>level){
                level = 1
            }else if(preLevel<level){
                level = arr[arr.length-1][2]+1
            }else{
                level = arr[arr.length-1][2]
            }
            arr.push(['_cate'+key+'_',con,level,matched[0].length-1])
        }
    })
    let str = ''
    arr.map(v=> str+='<li class="_level'+v[2]+'_" mapid="'+v[0]+'">'+v[1]+'</li>')

    return '<ul class="__catalog__">'+str+'</ul>'
}