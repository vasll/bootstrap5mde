// TODO implement drag and drop
// TODO if current line starts with '* ' and enter is pressed, add another '* ' at the start of the new line

$(document).ready(()=>{
    let isEditMode = true;    // true if showing raw textarea, false if showing parsed markdown

    /*** TOOLBAR BUTTON LISTENERS ***/
    // Switch between edit and view mode
    $('#btn-switch-markdown').on('click', ()=>{
        if(isEditMode == true){
            $('#img-switch-markdown').attr('src', 'img/mdi-preview-on.svg')
            $('#p-markdown-status').text('View mode')
            $('#bootstrap5mde-raw').hide()
            $('#bootstrap5mde-parsed').html(marked.parse($('#bootstrap5mde-raw').val()))    // TODO sanitize parsing
            $('#bootstrap5mde-parsed').show()
        }else if(isEditMode == false){
            $('#p-markdown-status').text('Edit mode')
            $('#img-switch-markdown').attr('src', 'img/mdi-preview-off.svg')
            $('#bootstrap5mde-parsed').hide()
            $('#bootstrap5mde-raw').show()
        }
        isEditMode = !isEditMode    // toggle isEditMode
    })

    // Bold btn listener
    $('#bootstrap5mde-btn-bold').on('click', ()=>{
        addTextSurroundingCursor($('#bootstrap5mde-raw'), '**')  // Surround highlighted text like this: **<text>**
    })

    // Italic btn listener
    $('#bootstrap5mde-btn-italic').on('click', ()=>{
        addTextSurroundingCursor($('#bootstrap5mde-raw'), '_')  // Surround highlighted text like this: _<text>_
    })

    // H1 btn listener
    $('#bootstrap5mde-btn-header-1').on('click', ()=>{
        addTextAtCursor($('#bootstrap5mde-raw'), '# ')
    })

    // H2 btn listener
    $('#bootstrap5mde-btn-header-2').on('click', ()=>{
        addTextAtCursor($('#bootstrap5mde-raw'), '## ')
    })

    // Bullet-list button listener
    $('#bootstrap5mde-btn-bullet-list').on('click', ()=>{
        addTextAtCursor($('#bootstrap5mde-raw'), '\n* ')
    })

    // Number-list button listener
    $('#bootstrap5mde-btn-numbered-list').on('click', ()=>{
        addTextAtCursor($('#bootstrap5mde-raw'), '\n1. ') 
    })

    // Link button listener
    $('#bootstrap5mde-btn-link').on('click', ()=>{
        addTextAtCursor($('#bootstrap5mde-raw'), '[title](http://)', offset=-1)
    })

    // Image-link button listener
    $('#bootstrap5mde-btn-image-link').on('click', ()=>{
        addTextAtCursor($('#bootstrap5mde-raw'), '![](http://)', offset=-1)
    })

    // Image-upload button listener
    $('#bootstrap5mde-btn-image-upload').on('click', ()=>{
        console.log('TODO: Image upload not implemented!')
        // TODO implement image upload
    })

    // Add link redirect to help button
    $('#bootstrap5mde-btn-help').on('click', ()=>{
        window.location.href = 'https://www.markdownguide.org/basic-syntax/'
    })
})






/*** UTILITY FUNCTIONS ***/

/**
 * Adds text at the cursor position of a textarea
 * @param {*} textArea An HTML textarea
 * @param {*} text Text String to be inserted
 * @param {*} offset Cursor is by default at the end of the added text. This will move the cursor ahead or behind by a number of chars
 */
function addTextAtCursor(textArea, text, offset = 0){
    // TODO when a heading is added but the current row has already some text, add the heading to a newline
    var cursorStart = $(textArea).prop('selectionStart')

    var v = $(textArea).val()
    var textBefore = v.substring(0,  cursorStart)
    var textAfter  = v.substring(cursorStart, v.length)

    // Replace text from textarea
    $(textArea).val(textBefore + text + textAfter)
    $(textArea).focus()

    if(offset != 0){
        const cursorPosition = textBefore.length + text.length + offset
        $(textArea).prop({
            'selectionStart': cursorPosition,
            'selectionEnd': cursorPosition
        });
    }
}

/**
 * Places a given text on the left and right of a cursor in a textarea
 * @param {*} textArea An HTML textarea
 * @param {*} surroundText Text String to be inserted at left and right of cursor
 */
function addTextSurroundingCursor(textArea, surroundText){
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
        const cursorStartPosition = textBeforeStart.length + surroundText.length
        const cursorEndPosition = cursorStartPosition + highlightedText.length
        $(textArea).prop({
            'selectionStart': cursorStartPosition, 
            'selectionEnd': cursorEndPosition
        });
    }
}
