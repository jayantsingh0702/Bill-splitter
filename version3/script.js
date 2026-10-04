function calculateBill() {
    const bill = Number(document.getElementById("bill").value);
    const tip = Number(document.getElementById("tip").value) || 0;
    const people = Number(document.getElementById("people").value);

    if (bill <= 0) {
        Swal.fire({
            icon: "warning",
            title: "Bill amount needed",
            text: "Please enter a valid bill amount.",
            confirmButtonColor: "#4f46e5"
        });
        return;
    }

    if (people <= 0) {
        Swal.fire({
            icon: "warning",
            title: "People required",
            text: "Please enter the number of people.",
            confirmButtonColor: "#4f46e5"
        });
        return;
    }

    if (tip < 0) {
        Swal.fire({
            icon: "error",
            title: "Invalid tip",
            text: "Tip amount cannot be negative.",
            confirmButtonColor: "#4f46e5"
        });
        return;
    }

    const totalBill = bill + tip;
    const perPerson = totalBill / people;

    document.getElementById("result").innerHTML = `
        <span>RESULT</span>
        <p>Total Bill: ₹${totalBill.toFixed(2)}</p>
        <p>Each Person: ₹${perPerson.toFixed(2)}</p>
    `;

    Swal.fire({
        icon: "success",
        title: "Bill calculated!",
        text: `Each person pays ₹${perPerson.toFixed(2)}`,
        confirmButtonColor: "#4f46e5",
        timer: 1800,
        showConfirmButton: false
    });
}

function resetBill() {
    document.getElementById("bill").value = "";
    document.getElementById("tip").value = "";
    document.getElementById("people").value = "";

    document.getElementById("result").innerHTML = `
        <span>RESULT</span>
        <p>Total Bill: ₹0.00</p>
        <p>Each Person: ₹0.00</p>
    `;

    Toastify({
        text: "Bill details cleared ✓",
        duration: 1800,
        gravity: "top",
        position: "right",
        style: {
            background: "#171717",
            borderRadius: "10px"
        }
    }).showToast();
}