import sketch1 from './sketch1.js'
import sketch2 from './sketch2.js'
import sketch3 from './sketch3.js'

/* sketch objects have to be in an array, which is accessed later when modal is opened */
let sketches = [sketch1, sketch2, sketch3];

window.onload = () => {

    const openSketch = document.querySelectorAll('.openSketch');

    popUpImages(openSketch);
    openModal(openSketch);

}

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

function openModal(images) {

    let modal = document.querySelector('.modal');

    let sketchContainer = document.querySelector('.sketchContainer');

    /* background left/right side */
    let leftSide = document.querySelector('.leftSide');
    let rightSide = document.querySelector('.rightSide');

    images.forEach((image, index) => {
        image.addEventListener('click', () => {

            /* start with empty sketch */
            let sketch = null;
            /* connect sketch DIV with ID from image */
            let sketchID = image.dataset.id;
            console.log(sketchID);

            /* modal open */
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