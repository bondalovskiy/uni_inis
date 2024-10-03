document.addEventListener("DOMContentLoaded", function() {
    const shirt = JSON.parse(localStorage.getItem('selectedShirt'));
    if (!shirt) return;

    document.getElementById('shirt-name').innerText = shirt.name;
    document.getElementById('shirt-price').innerText = shirt.price;
    document.getElementById('shirt-description').innerText = shirt.description;

    // Load the default image
    let currentSide = 'front';
    let currentColor = Object.keys(shirt.colors)[0];
    document.getElementById('shirt-image').src = shirt.colors[currentColor][currentSide];

    // Create color buttons
    const colorButtons = document.getElementById('color-buttons');
    Object.keys(shirt.colors).forEach(color => {
        const button = document.createElement('button');
        button.innerText = color;
        button.style.backgroundColor = color;
        button.onclick = function() {
            currentColor = color;
            updateImage();
        };
        colorButtons.appendChild(button);
    });

    // Add side switching functionality
    document.getElementById('front-side').onclick = function() {
        currentSide = 'front';
        updateImage();
    };
    document.getElementById('back-side').onclick = function() {
        currentSide = 'back';
        updateImage();
    };

    function updateImage() {
        document.getElementById('shirt-image').src = shirt.colors[currentColor][currentSide];
    }
});
