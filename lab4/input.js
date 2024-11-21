window.onload = function () {
    let selectedElement = null;
    let offsetX = 0, offsetY = 0;
    let isFollowingFinger = false; // Режим "следующий за пальцем"
    let initialPosition = new Map();

    // Начать перетаскивание
    function startDrag(event) {
        const isTouchEvent = event.type === 'touchstart';
        const clientX = isTouchEvent ? event.touches[0].clientX : event.clientX;
        const clientY = isTouchEvent ? event.touches[0].clientY : event.clientY;

        if (isFollowingFinger && !selectedElement) {
            selectedElement = document.querySelector('.target'); // Захватываем элемент
        }

        if (!selectedElement) {
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

    // Завершить перетаскивание
    function stopDrag(event) {
        if (selectedElement && !isFollowingFinger) {
            selectedElement = null;
        }
    }

    // Двойное касание: режим "следующий за пальцем"
    function toggleFollowMode(event) {
        if (event.type === 'touchstart' && event.touches.length === 1) {
            isFollowingFinger = !isFollowingFinger;
            if (isFollowingFinger) {
                selectedElement = document.querySelector('.target');
            } else {
                selectedElement = null;
            }
        }
    }

    // Сброс при втором касании
    function handleMultiTouch(event) {
        if (event.touches.length > 1 && selectedElement) {
            const { top, left } = initialPosition.get(selectedElement);
            selectedElement.style.left = left;
            selectedElement.style.top = top;
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

        // Добавление событий
        target.addEventListener('mousedown', startDrag);
        target.addEventListener('touchstart', startDrag, { passive: false });
        target.addEventListener('touchstart', toggleFollowMode, { passive: false });
    });

    // Слушатели для документа
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', stopDrag);
    document.addEventListener('touchstart', handleMultiTouch, { passive: false });
};
