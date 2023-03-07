// TODO implement drag and drop

$(document).ready(()=>{
    let isCurrentMarkdownRaw = true;    // true if showing raw textarea, false if showing parsed markdown

    // Toolbar button listeners
    $('#btn-switch-markdown').on('click', ()=>{
        if(isCurrentMarkdownRaw == true){
            $('#img-switch-markdown').attr('src', 'img/mdi-preview-on.svg')
            $('#p-markdown-status').text('View mode')
            $('#bootstrap5mde-raw').hide()
            $('#bootstrap5mde-parsed').html(marked.parse($('#bootstrap5mde-raw').val()))    // TODO sanitize parsing
            $('#bootstrap5mde-parsed').show()
        }else if(isCurrentMarkdownRaw == false){
            $('#p-markdown-status').text('Edit mode')
            $('#img-switch-markdown').attr('src', 'img/mdi-preview-off.svg')
            $('#bootstrap5mde-parsed').hide()
            $('#bootstrap5mde-raw').show()
        }
        isCurrentMarkdownRaw = !isCurrentMarkdownRaw    // toggle isCurrentMarkdownRaw
    })

    // Bold selected text
    $('#bootstrap5mde-btn-bold').on('click', ()=>{
        surroundHighlightedText($('#bootstrap5mde-raw'), '**')
        /*
        var cursorStart = $('#bootstrap5mde-raw').prop('selectionStart')
        var cursorEnd = $('#bootstrap5mde-raw').prop('selectionEnd')
        
        var text = $('#bootstrap5mde-raw').val()
        var textBeforeStart = text.substring(0,  cursorStart)
        var highlitedText = text.substring(cursorStart, cursorEnd)
        var textAfterEnd = text.substring(cursorEnd, text.length)
        $('#bootstrap5mde-raw').val(`${textBeforeStart}**${highlitedText}**${textAfterEnd}`)*/
    })
})


/* Surrounds higlighted text on the left and right at the cursor of a textarea with given surroundText.
** Places cursor in the middle if highlighted text is none, or at the end if there is text  */
function surroundHighlightedText(element, surroundText){
    var cursorStart = $(element).prop('selectionStart')
    var cursorEnd = $(element).prop('selectionEnd')
    
    var text = $(element).val()
    var textBeforeStart = text.substring(0,  cursorStart)
    var highlightedText = text.substring(cursorStart, cursorEnd)
    var textAfterEnd = text.substring(cursorEnd, text.length)

     // If highlightedText contains text, trim whitespaces
    if(highlightedText.length>0){  
        if(highlightedText.endsWith(" ")){
            highlightedText = $.trim(highlightedText)
            console.log(surroundText)
        }
    }

    // Replace text from textarea
    $(element).val(`${textBeforeStart}${surroundText}${highlightedText}${surroundText} ${textAfterEnd}`)
    $(element).focus()

    // If 'highlightedText' is empty, set cursor position in the middle of the two 'surroundText'
    if(highlightedText.length==0){
        const cursorPosition = textBeforeStart.length + surroundText.length
        $(element).prop({
            'selectionStart': cursorPosition,
            'selectionEnd': cursorPosition
        });
    }else if(highlightedText.length>0){ // If 'highlightedText' contains text, set cursor position at the end of the surrounded text
        const cursorPosition = textBeforeStart.length + (surroundText.length*2) + highlightedText.length
        $(element).prop({'selectionStart': cursorPosition, 'selectionEnd': cursorPosition});
    }
}
