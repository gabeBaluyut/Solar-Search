document.getElementById('back').onclick = () => window.location = './index.html';
document.getElementById('next').onclick = () => window.location = './bill.html'





let roofs = document.getElementsByClassName('roof'); 

let selected = []; 
for (let i = 0; i < roofs.length; i++) selected.push(false); 

for (let i = 0; i < roofs.length; i++) {
    roofs[i].addEventListener('click', () => {
        for (let j = 0; j < roofs.length; j++) {
            roofs[j].style = ""; 
            selected[j] = false; 
        }
        selected[i] = true; 
        roofs[i].style = "border: 2px solid green; cursor: pointer;"
    });

    roofs[i].addEventListener('mouseenter', () => {
        if (!selected[i]) 
            roofs[i].style = "border: 1px solid green; cursor: pointer;"
    });

    roofs[i].addEventListener('mouseleave', () => {
        if (!selected[i])
            roofs[i].style = "cursor: default;";
    });
}