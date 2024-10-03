window.onload = function() {
    let selectedElement = null;
    let offsetX, offsetY;
    let isSticky = false;
    let initialPosition = new Map();


    function startDrag(event) {
        if (!isSticky) {
            selectedElement = event.target;
            offsetX = event.clientX - selectedElement.getBoundingClientRect().left;
            offsetY = event.clientY - selectedElement.getBoundingClientRect().top;
        }
    }

    function drag(event) {
        if (selectedElement && !isSticky) {
            selectedElement.style.left = event.clientX - offsetX + 'px';
            selectedElement.style.top = event.clientY - offsetY + 'px';
        }
        if (isSticky && selectedElement) {
            selectedElement.style.left = event.clientX - offsetX + 'px';
            selectedElement.style.top = event.clientY - offsetY + 'px';
        }
    }

    function stopDrag() {
        selectedElement = null;
    }

    //double click
    function makeSticky(event) {
        if (!isSticky) {
            selectedElement = event.target;
            isSticky = true;
            offsetX = event.clientX - selectedElement.getBoundingClientRect().left;
            offsetY = event.clientY - selectedElement.getBoundingClientRect().top;
            selectedElement.style.backgroundColor = 'blue'; // изменение цвета
        } else {
            isSticky = false;
            selectedElement.style.backgroundColor = 'red'; // возврат цвета
            selectedElement = null;
        }
    }

    //esc
    function handleKeyUp(event) {
        if (event.key === 'Escape' && selectedElement) {
            isSticky = false;
            selectedElement.style.backgroundColor = 'red'; // возврат цвета
            let { top, left } = initialPosition.get(selectedElement); // возврат на исходную позицию
            selectedElement.style.left = left;
            selectedElement.style.top = top;
            selectedElement = null;
        }
    }

    document.querySelectorAll('.target').forEach((target) => {
        initialPosition.set(target, {
            top: target.style.top,
            left: target.style.left
        });

        target.addEventListener('mousedown', startDrag);
        target.addEventListener('dblclick', makeSticky);
    });

    //event
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('keyup', handleKeyUp);
};
