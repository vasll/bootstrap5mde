$(document).ready(()=>{

    let isCurrentMarkdownRaw = true;    // true if showing raw textarea, false if showing parsed markdown

    $('#btn-switch-markdown').on('click', ()=>{
        console.log(isCurrentMarkdownRaw)
        if(isCurrentMarkdownRaw == true){
            $('#romanianmd-raw').hide()
            $('#romanianmd-parsed').html(marked.parse($('#romanianmd-raw').val()))
            $('#romanianmd-parsed').show()
        }else if(isCurrentMarkdownRaw == false){
            $('#romanianmd-parsed').hide()
            $('#romanianmd-raw').show()
        }

        isCurrentMarkdownRaw = !isCurrentMarkdownRaw    // toggle isCurrentMarkdownRaw
    })
})

