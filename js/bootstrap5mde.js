// TODO implement drag and drop
// TODO if current line starts with '* ' and enter is pressed, add another '* ' at the start of the new line
// TODO add shortcuts

$(document).ready(()=>{
    /** HTML elements **/
    const $textAreaRaw = $('#bootstrap5mde-raw')    // textArea containing raw text
    const $markdownDiv = $('#bootstrap5mde-parsed') // div containing the parsed markdown content
    const $markdownModeText = $('#p-markdown-status')   // <p> that displays current markdown mode (edit mode/view mode)
    const $markdownModeImg = $('#img-switch-markdown')  // img that displays current markdown mode (edit mode/view mode)

    /** Variables **/
    let isEditMode = true;    // true if showing raw textarea, false if showing parsed markdown

    /** Toolbar button listeners **/
    // Switch between edit (textAreaRaw) and view (markdownDiv) mode
    $('#btn-switch-markdown').on('click', ()=>{
        if(isEditMode == true){
            $markdownModeImg.attr('src', 'img/mdi-preview-on.svg')
            $markdownModeText.text('View mode')
            $textAreaRaw.hide()
            $markdownDiv.html(marked.parse($textAreaRaw.val()))    // TODO sanitize parsing
            $markdownDiv.show()
        }else if(isEditMode == false){
            $markdownModeImg.attr('src', 'img/mdi-preview-off.svg')
            $markdownModeText.text('Edit mode')
            $markdownDiv.hide()
            $textAreaRaw.show()
        }
        isEditMode = !isEditMode    // toggle isEditMode
    })

    // Bold btn listener
    $('#bootstrap5mde-btn-bold').on('click', ()=>{
        addTextSurroundingCursor($textAreaRaw, '**')  // Surround highlighted text like this: **<text>**
    })

    // Italic btn listener
    $('#bootstrap5mde-btn-italic').on('click', ()=>{
        addTextSurroundingCursor($textAreaRaw, '_')  // Surround highlighted text like this: _<text>_
    })

    // H1 btn listener
    $('#bootstrap5mde-btn-header-1').on('click', ()=>{
        addTextAtCursor($textAreaRaw, '# ')
    })

    // H2 btn listener
    $('#bootstrap5mde-btn-header-2').on('click', ()=>{
        addTextAtCursor($textAreaRaw, '## ')
    })

    // Bullet-list button listener
    $('#bootstrap5mde-btn-bullet-list').on('click', ()=>{
        addTextAtCursor($textAreaRaw, '\n* ')
    })

    // Number-list button listener
    $('#bootstrap5mde-btn-numbered-list').on('click', ()=>{
        addTextAtCursor($textAreaRaw, '\n1. ') 
    })

    // Link button listener
    $('#bootstrap5mde-btn-link').on('click', ()=>{
        addTextAtCursor($textAreaRaw, '[title](http://)', offset=-1)
    })

    // Image-link button listener
    $('#bootstrap5mde-btn-image-link').on('click', ()=>{
        addTextAtCursor($textAreaRaw, '![](http://)', offset=-1)
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

    // Textarea keydown listener
    $textAreaRaw.on('keydown', (event)=>{
        const key = event['originalEvent']['key']
        
        if(isTextHighlighted($textAreaRaw)){ // If text is highlighted
            // TODO IMPLEMENT THIS
            if(key == '*'){ 
                
            }else if(key == '_'){

            }
        }
    });
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
    }else if(highlightedText.length>0){ // If 'highlightedText' contains text
        const cursorStartPosition = textBeforeStart.length
        const cursorEndPosition = cursorStartPosition + surroundText.length*2 + highlightedText.length
        $(textArea).prop({
            'selectionStart': cursorStartPosition, 
            'selectionEnd': cursorEndPosition
        });
    }
}

/**
 * @param {*} textArea An HTML textarea
 * @returns true if text is highlighted, false if it isn't
 */
function isTextHighlighted(textArea){
    var cursorStart = $(textArea).prop('selectionStart')
    var cursorEnd = $(textArea).prop('selectionEnd')

    if(cursorStart != cursorEnd){
        return true
    }
    return false
}
