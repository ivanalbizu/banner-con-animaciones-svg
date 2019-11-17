document.addEventListener('DOMContentLoaded', () => {
                
    let masks = document.querySelectorAll('.mask');
    masks.forEach(mask => {
        mask.addEventListener('mousemove', handleMove, false)
        mask.addEventListener('click', handleClick, false)
    });
    
    if (/Edge\/\d./i.test(navigator.userAgent)){
        let boxes = document.querySelectorAll('.box');
        boxes.forEach(box => {
            box.style = `
                background-image: url(${box.querySelector('image').getAttribute('xlink:href')});
                background-size: 100%;
                background-position: center;
                cursor: pointer;
            `;
        });
    }
});

const coord = el => {
    let viewportX = el.clientX;
    let viewportY = el.clientY;
    let boxRectangle = el.target.getBoundingClientRect();
    let localX = viewportX - boxRectangle.left;
    let localY = viewportY - boxRectangle.top;

    let x = (localX/boxRectangle.width)*100;
    let y = (localY/boxRectangle.height)*100;

    return {x,y}
}

const handleMove = event => {
    let {x,y} = coord(event);

    let root = document.documentElement;
    root.style.setProperty('--x', `${x}%`);
    root.style.setProperty('--y', `${y}%`);
}

const handleClick = event => {
    const target = event.target;
    const box = target.closest('.box');
    box.classList.toggle('box--active');

    if (box.classList.contains('box--active')) {
        closeBox(box);
    } else {
        openBox(box);
    }    
}

const closeBox = (box) => {
    const x = getComputedStyle(document.documentElement).getPropertyValue('--x');
    const y = getComputedStyle(document.documentElement).getPropertyValue('--y');

    const svgns = "http://www.w3.org/2000/svg";
    let newCircle = document.createElementNS(svgns, 'circle');
    newCircle.setAttributeNS(null, 'cx', x);
    newCircle.setAttributeNS(null, 'cy', y);
    newCircle.setAttributeNS(null, 'class', 'circle-click');

    box.querySelector('g').appendChild(newCircle);
}

const openBox = (box) => {
    let {x,y} = coord(event);
    
    let root = document.documentElement;
    root.style.setProperty('--x-close', `${x}%`);
    root.style.setProperty('--y-close', `${y}%`);

    const elClose = box.querySelector('.circle-click');

    //Elimina el siguiente circle, en caso que fueran muy rápidos
    //los clicks y no diera tiempo con setTimeout a eliminarlos
    //Se usa nextSibling. Si se modifica DOM, habría que cambiar selector
    if (elClose.nextSibling) elClose.nextSibling.remove();
    elClose.classList.add('circle-click-closing');
    elClose.style = `
        cx: ${x};
        cy: ${x};
        r: 0
    `;
    setTimeout(() => {
        elClose.remove();
    }, 500);
}