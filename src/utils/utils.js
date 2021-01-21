export const dropAreaJSCode = () => {
    // ************************ Drag and drop ***************** //
    let dropArea = document.getElementById("drop-area")

    // Prevent default drag behaviors
    ;['dragenter', 'dragover', 'dragleave'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)   
    document.body.addEventListener(eventName, preventDefaults, false)
    })

    // Highlight drop area when item is dragged over it
    ;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
    })

    ;['dragleave'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
    })

    /*
    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false)
    */

    function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
    }

    function highlight(e) {
    dropArea.classList.add('highlight')
    }

    function unhighlight(e) {
    dropArea.classList.remove('highlight')
    }
}