window.onload = function () {
    let selectedElement = null;
    let offsetX, offsetY;
    let isSticky = false;
    let initialPosition = new Map();
    let initialColor = new Map();
    let isFollowingFinger = false; // Режим "следующий за пальцем"

    function startDrag(event) {
        const isTouchEvent = event.type === 'touchstart';
        const clientX = isTouchEvent ? event.touches[0].clientX : event.clientX;
        const clientY = isTouchEvent ? event.touches[0].clientY : event.clientY;

        if (isFollowingFinger && !selectedElement) {
            selectedElement = document.querySelector('.target'); // Захват любого элемента
        }

        if (selectedElement) {
            offsetX = clientX - selectedElement.getBoundingClientRect().left;
            offsetY = clientY - selectedElement.getBoundingClientRect().top;
            event.preventDefault();
        }
    }

    function drag(event) {
        if (selectedElement) {
            const isTouchEvent = event.type === 'touchmove';
            const clientX = isTouchEvent ? event.touches[0].clientX : event.clientX;
            const clientY = isTouchEvent ? event.touches[0].clientY : event.clientY;

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
        const targetElement = event.target;

        if (!isSticky) {
            selectedElement = targetElement;
            isSticky = true;
            offsetX = event.touches[0].clientX - targetElement.getBoundingClientRect().left;
            offsetY = event.touches[0].clientY - targetElement.getBoundingClientRect().top;
            targetElement.style.backgroundColor = 'blue';
        } else {
            isSticky = false;
            isFollowingFinger = true; // Включаем режим "следующий за пальцем"
            selectedElement.style.backgroundColor = initialColor.get(selectedElement);
        }
    }

    function handleTouchClick(event) {
        const isTouchClick = event.type === 'touchend' && event.changedTouches.length === 1;
        if (isTouchClick) {
            const touch = event.changedTouches[0];
            const clickedElement = document.elementFromPoint(touch.clientX, touch.clientY);

            if (clickedElement === selectedElement) {
                isFollowingFinger = false; // Завершаем режим "следующий за пальцем"
                selectedElement = null;
            }
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
            isFollowingFinger = false;
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
        target.addEventListener('touchend', handleTouchClick, { passive: false });
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
            isFollowingFinger = false;
            selectedElement = null;
        }
    });
};
