
/* Die Sketche werden jeweils als Module exportiert, damit sie hier im Script als globale Variablen abrufbar sind */

import sketch1 from './NYTimes/sketch1.js'
import sketch2 from './sketch2.js'
import sketch3 from './sketch3.js'
import sketch4 from './sketch4.js'

/* Die Sketche werden dann für die einfachere Verarbeitung in ein Array gepackt */
let sketches = [sketch1, sketch2, sketch3, sketch4];

window.onload = () => {
    const sketchPreview = document.querySelectorAll('.previewSketchImage');
    popUpImages(sketchPreview);
    openModal(sketchPreview);
}



/*
Aufgaben von openModal()
 - Beim Click auf die Vorschaubilder wird das Modal geöffnet
 - ein DIV im Modal wird mit dem p5-Canvas gefüllt
 - beim Schließen mit dem X wird das Modal geschlossen und der Sketch wird destroyed
*/
function openModal(images) {

    let modal = document.querySelector('.modal');

    // In dieses div wird der p5-Sketch injected
    let sketchContainer = document.querySelector('.sketchContainer');

    /* Die linke und rechte Seite der Homepage, damit der Blur-Effekt hinzugefügt werden kann */
    /* Wahrscheinlich musst du hier noch deine Klassen anpassen, die die linke und rechte Seite haben */
    let leftSide = document.querySelector('.leftSide');
    let rightSide = document.querySelector('.rightSide');

    /* loop über alle Vorschaubilder */
    images.forEach((image, index) => {
        image.addEventListener('click', () => {

            /* start with empty sketch */
            let sketch = null;
            /* connect sketch div with ID from preview image */
            let sketchID = image.dataset.id;
            console.log(sketchID);

            /* modal open + add blur to left/right side */
            modal.classList.add('modal__open');
            leftSide.classList.add('blur');
            rightSide.classList.add('blur');

            /* connect sketch with DIV and invoke p5 sketch */
            sketchContainer.id = sketchID;
            sketch = new p5(sketches[index], sketchID); // invoke p5

            /* close modal */
            modal.addEventListener('click', () => {
                modal.classList.remove('modal__open');
                leftSide.classList.remove('blur');
                rightSide.classList.remove('blur');

                /* destroy sketch in p5 */
                sketch.destroySketch = true;
            })
        })
    })
}




/* Nicht notwendig, aber ein intersection observer, damit die Vorschau-Sketche einfaden, sobald sie in den Viewport kommen */
function popUpImages(images) {
    let options = {
        root: null,
        margin: `0px 0px -100px 0px`,
        threshold: 0.1
    }

    const observer = new IntersectionObserver(callback, options)

    function callback(entries, observer) {
        entries.forEach(entry => {

            if (!entry.isIntersecting) {
                entry.target.style.opacity = "0";
            }
            else {
                entry.target.style.opacity = "1";
                observer.unobserve(entry.target);
            }
        });
    }
    images.forEach(sketch => observer.observe(sketch));
}