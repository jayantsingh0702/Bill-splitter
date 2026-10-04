function calculateBill() {

    let bill = Number(document.getElementById("bill").value);
    let tip = Number(document.getElementById("tip").value) || 0;
    let people = Number(document.getElementById("people").value);

    if (bill <= 0 || people < 2) {
        Swal.fire({
            icon: "warning",
            title: "Check your details",
            text: "Enter a valid bill amount and at least 2 people."
        });
        return;
    }

    if (tip < 0) {
        Swal.fire({
            icon: "warning",
            title: "Invalid tip",
            text: "Tip amount cannot be negative."
        });
        return;
    }

    let total = bill + tip;
    let each = total / people;

    document.getElementById("result").innerHTML = `
        <span>YOUR RESULT</span>
        <p>Total Bill: ₹${total.toFixed(2)}</p>
        <p>Each Person: ₹${each.toFixed(2)}</p>
    `;

    Toastify({
        text: "Bill split calculated successfully!",
        duration: 2500,
        gravity: "top",
        position: "right"
    }).showToast();
}


function resetBill() {

    document.getElementById("bill").value = "";
    document.getElementById("tip").value = "";
    document.getElementById("people").value = "";

    document.getElementById("result").innerHTML = `
        <span>YOUR RESULT</span>
        <p>Total Bill: ₹0.00</p>
        <p>Each Person: ₹0.00</p>
    `;

    Toastify({
        text: "Bill reset successfully",
        duration: 2000,
        gravity: "top",
        position: "right"
    }).showToast();
}