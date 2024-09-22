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

    modal.style.display = "block";
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
        `;
        product.innerHTML = htmlContent;
        container.appendChild(product);
    });
}

window.onload = renderShirts;