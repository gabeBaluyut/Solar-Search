let addressInput = document.getElementById('address-input'); 
let autocomplete = new google.maps.places.Autocomplete(addressInput); 
let submitBtn = document.getElementById('submit'); 

submitBtn.onclick = (event) => {
    let location = autocomplete.getPlace().geometry.location; 
    localStorage.setItem('name', 'Zas'); 
    window.location = 'roof.html';
};

addressInput.addEventListener('input', () => {
    if (!addressInput.classList.contains('is-invalid')) {
        addressInput.classList.add('is-invalid');
    }
    submitBtn.disabled = true; 
});

autocomplete.addListener('place_changed', () => {
    submitBtn.disabled = false; 
    addressInput.classList.replace('is-invalid', 'is-valid'); 
});