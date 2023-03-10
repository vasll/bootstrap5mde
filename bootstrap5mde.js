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
    $('#bootstrap5mde-btn-switch-markdown').on('click', ()=>{
        if(isEditMode == true){
            $markdownModeImg.attr('src', 'img/mdi-preview-on.svg')
            $markdownModeText.text('View mode')
            $textAreaRaw.hide()
            $markdownDiv.html(DOMPurify.sanitize(marked.parse($textAreaRaw.val())))
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

    // Add shadow on hover to toolbar buttons
    $('#bootstrap5mde-btn-toolbar').find('button[id^="bootstrap5mde-btn-"]').each((index, item)=>{
        console.log(index)
        $(item).hover(()=>{
            $(item).addClass('shadow')
            $(item).removeClass('svg-fill').addClass('svg-fill-primary')
        }, ()=>{
            $(item).removeClass('shadow')
            $(item).removeClass('svg-fill-primary').addClass('svg-fill')
        })
    })

    // Textarea keypress listener
    $textAreaRaw.on('keypress', (event)=>{
        const highlightedText = getHighlightedText($textAreaRaw)
        if(highlightedText != null){
            var charCode = (typeof event.which == "undefined") ? event.keyCode : event.which    // stackoverflow idk
            var key = String.fromCharCode(charCode) // current keypress value

            if (key == '*') {  // Shortcut for bolding text
                addTextSurroundingCursor($textAreaRaw, '**')
                return false;   // Returning false prevents the key from being inserted into the textarea
            } else if (key == '_'){  // Shortcut for italicizing text
                addTextSurroundingCursor($textAreaRaw, '_')
                return false;
            }
        }
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

    var textAreaText = $(textArea).val()
    var textBefore = textAreaText.substring(0,  cursorStart)
    var textAfter  = textAreaText.substring(cursorStart, textAreaText.length)

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
 * @param {*} textLeft Text String to be inserted at left of cursor
 * @param {*} textRight Text String to be inserted at right of cursor, if none is given, textRight is equal to textLeft
 */
function addTextSurroundingCursor(textArea, textLeft, textRight=null){
    if(textRight == null){
        textRight = textLeft
    }

    var cursorStart = $(textArea).prop('selectionStart')
    var cursorEnd = $(textArea).prop('selectionEnd')
    
    var text = $(textArea).val()
    var textBeforeStart = text.substring(0,  cursorStart)
    var highlightedText = text.substring(cursorStart, cursorEnd)
    var textAfterEnd = text.substring(cursorEnd, text.length)

    // If highlightedText contains text, trim whitespaces
    if(highlightedText.length>0){  
        if(highlightedText.endsWith(" ")){
            // Move the whitespace from highlightedText between textRight and textAfterEnd
            highlightedText = $.trim(highlightedText)
            if(!(textRight.endsWith(' ') || textAfterEnd.startsWith(' '))){
                textAfterEnd = " " + textAfterEnd
            }
        }
    }

    // Replace text from textarea
    $(textArea).val(`${textBeforeStart}${textLeft}${highlightedText}${textRight}${textAfterEnd}`)
    $(textArea).focus()

    // If 'highlightedText' is empty, set cursor position in the middle
    if(highlightedText.length==0 && (textLeft.length == textRight.length)){
        const cursorPosition = textBeforeStart.length + textLeft.length
        $(textArea).prop({
            'selectionStart': cursorPosition,
            'selectionEnd': cursorPosition
        });
    }else if(highlightedText.length>0){ // If 'highlightedText' contains text
        const cursorStartPosition = textBeforeStart.length
        const cursorEndPosition = cursorStartPosition + textLeft.length + highlightedText.length + textRight.length
        $(textArea).prop({
            'selectionStart': cursorStartPosition, 
            'selectionEnd': cursorEndPosition
        });
    }
}

/**
 * @param {*} textArea An HTML textarea
 * @returns String containing highlighted text if it is highlighted, null if it isn't
 */
function getHighlightedText(textArea){
    var cursorStart = $(textArea).prop('selectionStart')
    var cursorEnd = $(textArea).prop('selectionEnd')

    if(cursorStart != cursorEnd){   // If there is highlighted text
        var highlightedText = $(textArea).val().substring(cursorStart, cursorEnd)
        return highlightedText
    }

    return null
}
