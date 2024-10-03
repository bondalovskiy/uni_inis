window.onload = function() {
    let selectedElement = null;
    let offsetX, offsetY;
    let isSticky = false;
    let initialPosition = new Map();
    let initialColor = new Map();

    function startDrag(event) {
        if (!isSticky) {
            selectedElement = event.target;
            offsetX = event.clientX - selectedElement.getBoundingClientRect().left;
            offsetY = event.clientY - selectedElement.getBoundingClientRect().top;
            event.preventDefault();
        }
    }

    function drag(event) {
        if (selectedElement) {
            selectedElement.style.left = event.clientX - offsetX + 'px';
            selectedElement.style.top = event.clientY - offsetY + 'px';
        }
    }

    function stopDrag() {
        if (selectedElement && !isSticky) {
            selectedElement = null;
        }
    }

    function makeSticky(event) {
        let targetElement = event.target;

        if (!isSticky) {
            selectedElement = targetElement;
            isSticky = true;
            offsetX = event.clientX - targetElement.getBoundingClientRect().left;
            offsetY = event.clientY - targetElement.getBoundingClientRect().top;
            targetElement.style.backgroundColor = 'blue';
        }
    }

    function unstick(event) {
        if (isSticky && selectedElement === event.target) {
            selectedElement.style.backgroundColor = initialColor.get(selectedElement);
            isSticky = false;
            selectedElement = null;
        }
    }

    function handleKeyUp(event) {
        if (event.key === 'Escape' && selectedElement) {
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
        target.addEventListener('click', unstick); // по одиночному клику
    });

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('keyup', handleKeyUp);
};
