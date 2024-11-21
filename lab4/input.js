window.onload = function () {
    let selectedElement = null;
    let offsetX = 0, offsetY = 0;
    let isFollowingFinger = false; // Режим "следующий за пальцем"
    let initialPosition = new Map();

    // Начало перетаскивания
    function startDrag(event) {
        const isTouchEvent = event.type === 'touchstart';
        const clientX = isTouchEvent ? event.touches[0].clientX : event.clientX;
        const clientY = isTouchEvent ? event.touches[0].clientY : event.clientY;

        if (!selectedElement || !isFollowingFinger) {
            selectedElement = event.target.classList.contains('target') ? event.target : null;
        }

        if (selectedElement) {
            const rect = selectedElement.getBoundingClientRect();
            offsetX = clientX - rect.left;
            offsetY = clientY - rect.top;

            event.preventDefault(); // Предотвращаем стандартное поведение
        }
    }

    // Перетаскивание
    function drag(event) {
        if (!selectedElement) return;

        const isTouchEvent = event.type === 'touchmove';
        const clientX = isTouchEvent ? event.touches[0].clientX : event.clientX;
        const clientY = isTouchEvent ? event.touches[0].clientY : event.clientY;

        selectedElement.style.left = clientX - offsetX + 'px';
        selectedElement.style.top = clientY - offsetY + 'px';

        event.preventDefault(); // Предотвращаем прокрутку
    }

    // Завершение перетаскивания
    function stopDrag() {
        if (!isFollowingFinger) {
            selectedElement = null;
        }
    }

    // Двойное касание: активация режима "следующий за пальцем"
    function toggleFollowMode(event) {
        if (event.type === 'touchstart' && event.touches.length === 1) {
            const targetElement = event.target;

            if (targetElement.classList.contains('target')) {
                if (!isFollowingFinger || selectedElement !== targetElement) {
                    selectedElement = targetElement;
                    isFollowingFinger = true;
                    targetElement.style.backgroundColor = 'blue'; // Для визуального эффекта
                } else {
                    isFollowingFinger = false;
                    targetElement.style.backgroundColor = ''; // Сбрасываем цвет
                    selectedElement = null;
                }
            }
        }
    }

    // Обработка второго касания
    function handleMultiTouch(event) {
        if (event.touches.length > 1 && selectedElement) {
            const { top, left } = initialPosition.get(selectedElement);
            selectedElement.style.left = left;
            selectedElement.style.top = top;
            selectedElement.style.backgroundColor = ''; // Сброс цвета
            selectedElement = null;
            isFollowingFinger = false;
        }
    }

    document.querySelectorAll('.target').forEach((target) => {
        const rect = target.getBoundingClientRect();
        initialPosition.set(target, {
            top: `${rect.top}px`,
            left: `${rect.left}px`
        });

        // События для каждого элемента
        target.addEventListener('mousedown', startDrag);
        target.addEventListener('touchstart', startDrag, { passive: false });
        target.addEventListener('touchstart', toggleFollowMode, { passive: false });
    });

    // События для документа
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', stopDrag);
    document.addEventListener('touchstart', handleMultiTouch, { passive: false });
};
