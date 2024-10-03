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
        }
    }

    function drag(event) {
        if (selectedElement) {
            selectedElement.style.left = event.clientX - offsetX + 'px';
            selectedElement.style.top = event.clientY - offsetY + 'px';
        }
    }

    function stopDrag() {
        if (isSticky) {
            selectedElement.style.backgroundColor = initialColor.get(selectedElement);
            selectedElement = null;
        }
    }

    function makeSticky(event) {
        if (!isSticky) {
            selectedElement = event.target;
            isSticky = true;
            offsetX = event.clientX - selectedElement.getBoundingClientRect().left;
            offsetY = event.clientY - selectedElement.getBoundingClientRect().top;
            selectedElement.style.backgroundColor = 'blue'; // изменение цвета
        } else {
            isSticky = false;
            selectedElement.style.backgroundColor = initialColor.get(selectedElement);
            selectedElement = null;
        }
    }

    function handleKeyUp(event) {
        if (event.key === 'Escape' && selectedElement) {
            isSticky = false;
            selectedElement.style.backgroundColor = initialColor.get(selectedElement);
            let { top, left } = initialPosition.get(selectedElement);
            selectedElement.style.left = left;
            selectedElement.style.top = top;
            selectedElement = null;
        }
    }

    //на все таргеты
    document.querySelectorAll('.target').forEach((target) => {
        initialPosition.set(target, {
            top: target.style.top,
            left: target.style.left
        });

        initialColor.set(target, target.style.backgroundColor);

        target.addEventListener('mousedown', startDrag);
        target.addEventListener('dblclick', makeSticky);
    });

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('keyup', handleKeyUp);
};
