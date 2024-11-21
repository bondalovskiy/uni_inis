window.onload = function() {
    let selectedElement = null;
    let offsetX, offsetY;
    let isSticky = false;
    let initialPosition = new Map();
    let initialColor = new Map();

    function startDrag(event) {
        if (event.type === 'mousedown' || (event.type === 'touchstart' && event.touches.length === 1)) {
            const clientX = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX;
            const clientY = event.type === 'mousedown' ? event.clientY : event.touches[0].clientY;

            if (!isSticky) {
                selectedElement = event.target.classList.contains('target') ? event.target : null;
                if (selectedElement) {
                    offsetX = clientX - selectedElement.getBoundingClientRect().left;
                    offsetY = clientY - selectedElement.getBoundingClientRect().top;
                    event.preventDefault();
                }
            } else if (!selectedElement) {
                selectedElement = [...document.querySelectorAll('.target')].find((el) => isSticky);
            }
        }
    }

    function drag(event) {
        if (selectedElement) {
            const clientX = event.type === 'mousemove' ? event.clientX : event.touches[0].clientX;
            const clientY = event.type === 'mousemove' ? event.clientY : event.touches[0].clientY;

            selectedElement.style.left = clientX - offsetX + 'px';
            selectedElement.style.top = clientY - offsetY + 'px';
        }
    }

    function stopDrag(event) {
        if (selectedElement && !isSticky && event.type !== 'touchend') {
            selectedElement = null;
        }
    }

    function makeSticky(event) {
        let targetElement = event.target;

        if (!isSticky) {
            selectedElement = targetElement;
            isSticky = true;
            offsetX = event.touches[0].clientX - targetElement.getBoundingClientRect().left;
            offsetY = event.touches[0].clientY - targetElement.getBoundingClientRect().top;
            targetElement.style.backgroundColor = 'blue';
        } else {
            selectedElement.style.backgroundColor = initialColor.get(selectedElement);
            isSticky = false;
            selectedElement = null;
        }
    }

    // Обработка второго пальца (аналог ESC)
    function handleMultiTouch(event) {
        if (event.touches.length > 1 && selectedElement) {
            selectedElement.style.backgroundColor = initialColor.get(selectedElement);
            let { top, left } = initialPosition.get(selectedElement);
            selectedElement.style.left = left;
            selectedElement.style.top = top;
            isSticky = false;
            selectedElement = null;
        }
    }


    document.querySelectorAll('.target').forEach((target) => {
        initialPosition.set(target, {
            top: target.style.top,
            left: target.style.left
        });

        initialColor.set(target, target.style.backgroundColor);

        target.addEventListener('mousedown', startDrag);
        target.addEventListener('dblclick', makeSticky);
        target.addEventListener('touchstart', startDrag, { passive: false });
        target.addEventListener('touchend', stopDrag, { passive: false });
    });


    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', stopDrag, { passive: false });
    document.addEventListener('touchstart', handleMultiTouch, { passive: false });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape' && selectedElement) {
            selectedElement.style.backgroundColor = initialColor.get(selectedElement);
            let { top, left } = initialPosition.get(selectedElement);
            selectedElement.style.left = left;
            selectedElement.style.top = top;
            isSticky = false;
            selectedElement = null;
        }
    });
};
