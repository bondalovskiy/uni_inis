// save choice in localStorage -> details.html
function saveShirtAndRedirect(shirt) {
    localStorage.setItem('selectedShirt', JSON.stringify(shirt));
    window.location.href = 'details.html';  // Перенаправление на страницу деталей
}

function openModal(shirt) {
    const modal = document.getElementById("quickViewModal");

    const defaultColor = shirt.colors && Object.keys(shirt.colors).length > 0;

    document.getElementById("modalImageFront").src = defaultColor
        ? shirt.colors[Object.keys(shirt.colors)[0]].front
        : shirt.default.front;

    document.getElementById("modalImageBack").src = defaultColor
        ? shirt.colors[Object.keys(shirt.colors)[0]].back
        : shirt.default.back;

    document.getElementById("modalName").innerText = shirt.name;
    document.getElementById("modalDescription").innerText = shirt.description;
    document.getElementById("modalPrice").innerText = shirt.price;

    modal.style.display = "block";  // Открытие модального окна
}

function closeModal() {
    const modal = document.getElementById("quickViewModal");
    modal.style.display = "none";
}

function renderShirts() {
    const container = document.getElementById('products');

    if (!Array.isArray(shirts) || shirts.length === 0) {
        container.innerHTML = '<p>No shirts available</p>';
        return;
    }

    shirts.forEach(shirt => {
        const product = document.createElement('div');
        product.className = 'product';

        const defaultColor = shirt.colors && Object.keys(shirt.colors)[0];
        const defaultImage = (shirt.colors && shirt.colors[defaultColor])
            ? shirt.colors[defaultColor].front
            : shirt.default.front;

        const htmlContent = `
            <img src="${defaultImage}" alt="${shirt.name}">
            <h2>${shirt.name}</h2>
            <p>${shirt.price}</p>
            <button onclick="openModal(${JSON.stringify(shirt).replace(/"/g, '&quot;')})">Quick View</button>
            <button onclick="saveShirtAndRedirect(${JSON.stringify(shirt).replace(/"/g, '&quot;')})">See Page</button>
        `;
        product.innerHTML = htmlContent;
        container.appendChild(product);
    });
}

function renderShirtDetails() {
    const shirt = JSON.parse(localStorage.getItem('selectedShirt'));  // Получаем сохраненные данные

    if (!shirt) {
        document.body.innerHTML = '<p>No shirt details available.</p>';
        return;
    }

    const container = document.createElement('div');
    container.className = 'shirt-details';

    // Рендеринг изображения и информации о футболке
    const defaultColor = shirt.colors && Object.keys(shirt.colors)[0];
    const defaultImage = (shirt.colors && shirt.colors[defaultColor])
        ? shirt.colors[defaultColor].front
        : shirt.default.front;

    const colorButtons = Object.keys(shirt.colors).map(color => `
        <button onclick="changeShirtColor('${color}')">${color}</button>
    `).join('');

    const htmlContent = `
        <img id="shirtImage" src="${defaultImage}" alt="${shirt.name}">
        <h2>${shirt.name}</h2>
        <p>${shirt.price}</p>
        <p>${shirt.description}</p>
        <div>
            <label>Side: </label>
            <button onclick="changeShirtSide('front')">Front</button>
            <button onclick="changeShirtSide('back')">Back</button>
        </div>
        <div>
            <label>Color: </label>
            ${colorButtons}
        </div>
    `;
    container.innerHTML = htmlContent;
    document.body.appendChild(container);
}

function changeShirtSide(side) {
    const shirt = JSON.parse(localStorage.getItem('selectedShirt'));
    const currentColor = document.querySelector('button.active-color')?.innerText.toLowerCase() || Object.keys(shirt.colors)[0];
    document.getElementById('shirtImage').src = shirt.colors[currentColor][side];
}

function changeShirtColor(color) {
    const shirt = JSON.parse(localStorage.getItem('selectedShirt'));
    const side = document.getElementById('shirtImage').src.includes('front') ? 'front' : 'back';
    document.getElementById('shirtImage').src = shirt.colors[color][side];

    // Добавляем активный класс к выбранной кнопке цвета
    document.querySelectorAll('button').forEach(button => button.classList.remove('active-color'));
    document.querySelector(`button:contains(${color})`).classList.add('active-color');
}

window.onload = function() {
    if (window.location.pathname.includes('details.html')) {
        renderShirtDetails();
    } else {
        renderShirts();
    }
};
