document.getElementById("back").onclick = () =>
  (window.location = "./roof.html");
document.getElementById("next").onclick = () =>
  (window.location = "./map.html");

let billLabel = document.getElementById("bill");
let billInput = document.getElementById("bill-input");

document.body.onload = () => {
  let bill = localStorage.getItem("bill");
  if (bill !== null) {
    billInput.value = bill;
    billLabel.innerHTML = "$" + bill;
  }
};

billInput.addEventListener("input", () => {
  billLabel.innerHTML = "$" + billInput.value;
  localStorage.setItem("bill", billInput.value);
});
