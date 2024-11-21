window.onload = function () {
    let selectedElement = null;
    let offsetX = 0, offsetY = 0;
    let isSticky = false;
    let isFollowingFinger = false;
    let initialPosition = new Map();
    let initialColor = new Map();

    function startDrag(event) {
        const isTouchEvent = event.type === 'touchstart';
        const clientX = isTouchEvent ? event.touches[0].clientX : event.clientX;
        const clientY = isTouchEvent ? event.touches[0].clientY : event.clientY;

        if (isFollowingFinger && !selectedElement) {
            selectedElement = document.querySelector('.target'); // Выбираем любой элемент для следования за пальцем
        }

        if (!selectedElement) {
            selectedElement = event.target.classList.contains('target') ? event.target : null;
        }

        if (selectedElement) {
            offsetX = clientX - selectedElement.getBoundingClientRect().left;
            offsetY = clientY - selectedElement.getBoundingClientRect().top;
            event.preventDefault(); // Предотвращаем скроллинг
        }
    }

    function drag(event) {
        if (!selectedElement) return;

        const isTouchEvent = event.type === 'touchmove';
        const clientX = isTouchEvent ? event.touches[0].clientX : event.clientX;
        const clientY = isTouchEvent ? event.touches[0].clientY : event.clientY;

        selectedElement.style.left = clientX - offsetX + 'px';
        selectedElement.style.top = clientY - offsetY + 'px';
    }

    function stopDrag(event) {
        if (!isSticky && selectedElement) {
            selectedElement = null;
        }
    }

    function makeSticky(event) {
        if (event.type === 'touchstart' && event.touches.length === 1) {
            const targetElement = event.target;

            if (!isSticky) {
                selectedElement = targetElement;
                isSticky = true;
                isFollowingFinger = true; // Включаем режим "следующий за пальцем"
                targetElement.style.backgroundColor = 'blue';
            } else {
                isSticky = false;
                isFollowingFinger = false; // Выключаем режим
                targetElement.style.backgroundColor = initialColor.get(targetElement);
                selectedElement = null;
            }
        }
    }

    function handleMultiTouch(event) {
        if (event.touches.length > 1 && selectedElement) {
            selectedElement.style.backgroundColor = initialColor.get(selectedElement);
            const { top, left } = initialPosition.get(selectedElement);
            selectedElement.style.left = left;
            selectedElement.style.top = top;
            isSticky = false;
            isFollowingFinger = false;
            selectedElement = null;
        }
    }

    document.querySelectorAll('.target').forEach((target) => {
        initialPosition.set(target, {
            top: target.style.top || '0px',
            left: target.style.left || '0px'
        });

        initialColor.set(target, target.style.backgroundColor || 'white');

        target.addEventListener('mousedown', startDrag);
        target.addEventListener('touchstart', startDrag, { passive: false });
        target.addEventListener('touchstart', makeSticky, { passive: false });
        target.addEventListener('touchend', stopDrag, { passive: false });
    });

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', stopDrag, { passive: false });
    document.addEventListener('touchstart', handleMultiTouch, { passive: false });
};
