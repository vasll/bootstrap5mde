$(document).ready(()=>{
    let isCurrentMarkdownRaw = true;    // true if showing raw textarea, false if showing parsed markdown

    $('#btn-switch-markdown').on('click', ()=>{
        if(isCurrentMarkdownRaw == true){
            $('#img-switch-markdown').attr('src', 'img/mdi-preview-on.svg')
            $('#bootstrap5mde-raw').hide()
            $('#bootstrap5mde-parsed').html(marked.parse($('#bootstrap5mde-raw').val()))    // TODO sanitize parsing
            $('#bootstrap5mde-parsed').show()
        }else if(isCurrentMarkdownRaw == false){
            $('#img-switch-markdown').attr('src', 'img/mdi-preview-off.svg')
            $('#bootstrap5mde-parsed').hide()
            $('#bootstrap5mde-raw').show()
        }

        isCurrentMarkdownRaw = !isCurrentMarkdownRaw    // toggle isCurrentMarkdownRaw
    })
})

