$(document).ready(()=>{
    let isCurrentMarkdownRaw = true;    // true if showing raw textarea, false if showing parsed markdown

    $('#btn-switch-markdown').on('click', ()=>{
        console.log(isCurrentMarkdownRaw)
        if(isCurrentMarkdownRaw == true){
            $('#bootstrap5mde-raw').hide()
            $('#bootstrap5mde-parsed').html(marked.parse($('#bootstrap5mde-raw').val()))
            $('#bootstrap5mde-parsed').show()
        }else if(isCurrentMarkdownRaw == false){
            $('#bootstrap5mde-parsed').hide()
            $('#bootstrap5mde-raw').show()
        }

        isCurrentMarkdownRaw = !isCurrentMarkdownRaw    // toggle isCurrentMarkdownRaw
    })
})

