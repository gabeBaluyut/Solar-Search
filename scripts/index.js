
let addressInput = document.getElementById('address-input'); 
let autocomplete = new google.maps.places.Autocomplete(addressInput); 
let submitBtn = document.getElementById('submit'); 

document.body.onload = () => {
    let addr = localStorage.getItem('address'); 
    if (addr !== null) {
        submitBtn.disabled = false; 
        addressInput.value = addr; 
    }
};

submitBtn.onclick = () => {
    let location = autocomplete.getPlace().geometry.location; 
    localStorage.setItem('address', addressInput.value); 
    localStorage.setItem('lat', location.lat()); 
    localStorage.setItem('lng', location.lng()); 
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