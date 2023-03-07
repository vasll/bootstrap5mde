// TODO implement drag and drop

$(document).ready(()=>{
    let isCurrentMarkdownRaw = true;    // true if showing raw textarea, false if showing parsed markdown

    // TOOLBAR BUTTON LISTENERS
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
        surroundHighlightedText($('#bootstrap5mde-raw'), '**')  // Surround highlighted text like this: **<text>**
    })

    // Italicize selected text
    $('#bootstrap5mde-btn-italic').on('click', ()=>{
        surroundHighlightedText($('#bootstrap5mde-raw'), '_')  // Surround highlighted text like this: _<text>_
    })

    // Add H1 to cursor
    $('#bootstrap5mde-btn-header-1').on('click', ()=>{
        addTextAtCursor($('#bootstrap5mde-raw'), '# ')  // Surround highlighted text like this: _<text>_
    })

    // Add H2 to cursor
    $('#bootstrap5mde-btn-header-2').on('click', ()=>{
        addTextAtCursor($('#bootstrap5mde-raw'), '## ')  // Surround highlighted text like this: _<text>_
    })

    // TODO remove this, it's just for debug
    $('#bootstrap5mde-raw').bind('input propertychange', ()=>{
        getLineNumber($('#bootstrap5mde-raw'))
    })
})







// UTILITY FUNCTIONS

function getLineNumber(textArea){
    console.log(textArea.val().split('\n'))
    // TODO
}


/**
 * 
 * @param {*} textArea 
 * @param {*} text 
 */
function addTextAtCursor(textArea, text){
    // TODO when a heading is added but the current row has already some text, add the heading to a newline
    var cursorStart = $(textArea).prop('selectionStart')

    var v = $(textArea).val()
    var textBefore = v.substring(0,  cursorStart)
    var textAfter  = v.substring(cursorStart, v.length)

    // Replace text from textarea
    $(textArea).val(textBefore + text + textAfter)
    $(textArea).focus()

}


/* Surrounds higlighted text on the left and right at the cursor of a textarea with given surroundText.
** Places cursor in the middle if highlighted text is none, or at the end if there is text  */
// TODO JSDOC
function surroundHighlightedText(textArea, surroundText){
    var cursorStart = $(textArea).prop('selectionStart')
    var cursorEnd = $(textArea).prop('selectionEnd')
    
    var text = $(textArea).val()
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
    $(textArea).val(`${textBeforeStart}${surroundText}${highlightedText}${surroundText} ${textAfterEnd}`)
    $(textArea).focus()

    // If 'highlightedText' is empty, set cursor position in the middle of the two 'surroundText'
    if(highlightedText.length==0){
        const cursorPosition = textBeforeStart.length + surroundText.length
        $(textArea).prop({
            'selectionStart': cursorPosition,
            'selectionEnd': cursorPosition
        });
    }else if(highlightedText.length>0){ // If 'highlightedText' contains text, set cursor position at the end of the surrounded text
        const cursorPosition = textBeforeStart.length + (surroundText.length*2) + highlightedText.length
        $(textArea).prop({'selectionStart': cursorPosition, 'selectionEnd': cursorPosition});
    }
}
