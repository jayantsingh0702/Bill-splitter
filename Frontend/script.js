// ========================================
// SMART BILL SPLITTER
// ========================================


// ========================================
// DOM ELEMENTS
// ========================================

const amountInput =
    document.getElementById("amount");

const peopleInput =
    document.getElementById("people");

const namesCheck =
    document.getElementById("namesCheck");

const namesContainer =
    document.getElementById("namesContainer");

const tipCheck =
    document.getElementById("tipCheck");

const tipContainer =
    document.getElementById("tipContainer");

const tipInput =
    document.getElementById("tip");

const calculateButton =
    document.getElementById("calculateButton");

const resetButton =
    document.getElementById("resetButton");

const generalError =
    document.getElementById("generalError");


// Result elements

const subtotal =
    document.getElementById("subtotal");

const tipResultRow =
    document.getElementById("tipResultRow");

const tipAmount =
    document.getElementById("tipAmount");

const totalBill =
    document.getElementById("totalBill");

const peopleText =
    document.getElementById("peopleText");

const perPerson =
    document.getElementById("perPerson");

const individualResults =
    document.getElementById("individualResults");

const individualList =
    document.getElementById("individualList");

const emptyResult =
    document.getElementById("emptyResult");

const billActions =
    document.getElementById("billActions");

const printButton =
    document.getElementById("printButton");

const shareButton =
    document.getElementById("shareButton");

const shareMessage =
    document.getElementById("shareMessage");


// ========================================
// JAVA BACKEND
// ========================================

const JAVA_BACKEND_URL =
    "http://localhost:8080/calculate";


// ========================================
// CREATE NAME INPUTS
// ========================================

function createNameInputs() {

    namesContainer.innerHTML = "";

    const people =
        parseInt(peopleInput.value);


    if (
        isNaN(people) ||
        people < 2 ||
        people > 20
    ) {
        return;
    }


    for (
        let i = 1;
        i <= people;
        i++
    ) {

        const input =
            document.createElement("input");


        input.type =
            "text";


        input.className =
            "name-input";


        input.placeholder =
            "Person " + i;


        namesContainer.appendChild(
            input
        );
    }
}


// ========================================
// NAMES TOGGLE
// ========================================

namesCheck.addEventListener(
    "change",
    function () {

        generalError.textContent = "";


        if (namesCheck.checked) {

            namesContainer.classList.remove(
                "hidden"
            );

            createNameInputs();

        } else {

            namesContainer.classList.add(
                "hidden"
            );

            namesContainer.innerHTML = "";
        }

    }
);


// ========================================
// PEOPLE CHANGE
// ========================================

peopleInput.addEventListener(
    "input",
    function () {

        generalError.textContent = "";


        if (namesCheck.checked) {

            createNameInputs();
        }

    }
);


// ========================================
// TIP TOGGLE
// ========================================

tipCheck.addEventListener(
    "change",
    function () {

        generalError.textContent = "";


        if (tipCheck.checked) {

            tipContainer.classList.remove(
                "hidden"
            );

        } else {

            tipContainer.classList.add(
                "hidden"
            );

            tipInput.value = "";
        }

    }
);


// ========================================
// VALIDATION
// ========================================

function validateBill() {

    const amount =
        parseFloat(amountInput.value);


    if (
        isNaN(amount) ||
        amount <= 0
    ) {

        generalError.textContent =
            "Please enter a valid bill amount.";

        return false;
    }


    return true;
}


function validatePeople() {

    const people =
        parseInt(peopleInput.value);


    if (
        isNaN(people) ||
        people < 2 ||
        people > 20
    ) {

        generalError.textContent =
            "Please enter between 2 and 20 people.";

        return false;
    }


    return true;
}


function validateTip() {

    if (!tipCheck.checked) {
        return true;
    }


    const tip =
        parseFloat(tipInput.value);


    if (
        isNaN(tip) ||
        tip < 0
    ) {

        generalError.textContent =
            "Please enter a valid tip amount.";

        return false;
    }


    return true;
}


function validateNames() {

    if (!namesCheck.checked) {
        return true;
    }


    const inputs =
        document.querySelectorAll(
            ".name-input"
        );


    for (
        let i = 0;
        i < inputs.length;
        i++
    ) {

        if (
            inputs[i].value.trim() === ""
        ) {

            generalError.textContent =
                "Please enter all names.";

            return false;
        }
    }


    return true;
}


// ========================================
// GET NAMES
// ========================================

function getNames() {

    const names = [];


    if (!namesCheck.checked) {
        return names;
    }


    const inputs =
        document.querySelectorAll(
            ".name-input"
        );


    inputs.forEach(
        function (input) {

            names.push(
                input.value.trim()
            );

        }
    );


    return names;
}


// ========================================
// CALCULATE USING JAVA
// ========================================

async function calculateUsingJava() {

    const amount =
        parseFloat(amountInput.value);

    const people =
        parseInt(peopleInput.value);

    const tip =
        tipCheck.checked
            ? parseFloat(tipInput.value)
            : 0;

    const names =
        getNames();


    const data = {

        amount: amount,

        people: people,

        tip: tip,

        names: names
    };


    try {

        calculateButton.disabled =
            true;

        calculateButton.textContent =
            "Calculating...";


        const response =
            await fetch(
                JAVA_BACKEND_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)
                }
            );


        if (!response.ok) {

            throw new Error(
                "Java server returned an error."
            );
        }


        const result =
            await response.json();


        displayJavaResult(
            result
        );


    } catch (error) {

        console.warn(
            "Java backend unreachable; falling back to client-side calculation:",
            error
        );


        // ====================================
        // FALLBACK CALCULATION
        // ====================================

        const tipAmountValue =
            tip;


        const total =
            amount +
            tipAmountValue;


        const perPerson =
            total /
            people;


        const peopleList =
            names.map(
                function (n) {

                    return {

                        name: n,

                        share:
                            perPerson
                    };

                }
            );


        const fallbackResult = {

            amount:
                amount,

            people:
                people,

            tipAmount:
                tipAmountValue,

            total:
                total,

            perPerson:
                perPerson,

            peopleList:
                peopleList
        };


        displayJavaResult(
            fallbackResult
        );

    } finally {

        calculateButton.disabled =
            false;

        calculateButton.textContent =
            "Calculate Bill";
    }
}


// ========================================
// DISPLAY RESULT
// ========================================

function displayJavaResult(result) {

    emptyResult.classList.add(
        "hidden"
    );

    billActions.classList.remove(
        "hidden"
    );


    subtotal.textContent =
        "₹" +
        result.amount.toFixed(2);


    totalBill.textContent =
        "₹" +
        result.total.toFixed(2);


    perPerson.textContent =
        "₹" +
        result.perPerson.toFixed(2);


    peopleText.textContent =
        result.people +
        " people";


    // ====================================
    // TIP
    // ====================================

    if (
        result.tipAmount > 0
    ) {

        tipResultRow.classList.remove(
            "hidden"
        );

        tipAmount.textContent =
            "₹" +
            result.tipAmount.toFixed(2);

    } else {

        tipResultRow.classList.add(
            "hidden"
        );
    }


    // ====================================
    // INDIVIDUAL SHARES
    // ====================================

    if (
        result.peopleList &&
        result.peopleList.length > 0 &&
        namesCheck.checked
    ) {

        individualResults.classList.remove(
            "hidden"
        );


        individualList.innerHTML = "";


        result.peopleList.forEach(
            function (person) {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "individual-row";


                row.innerHTML = `
                    <span>
                        ${escapeHTML(
                            person.name
                        )}
                    </span>

                    <strong>
                        ₹${person.share.toFixed(2)}
                    </strong>
                `;


                individualList.appendChild(
                    row
                );

            }
        );

    } else {

        individualResults.classList.add(
            "hidden"
        );
    }
}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;
}


// ========================================
// CALCULATE BUTTON
// ========================================

calculateButton.addEventListener(
    "click",
    function () {

        generalError.textContent = "";

        shareMessage.textContent = "";


        if (!validateBill()) {
            return;
        }


        if (!validatePeople()) {
            return;
        }


        if (!validateTip()) {
            return;
        }


        if (!validateNames()) {
            return;
        }


        calculateUsingJava();

    }
);


// ========================================
// PRINT BILL
// ========================================

function printBill() {

    const amount =
        subtotal.textContent;

    const total =
        totalBill.textContent;

    const eachPerson =
        perPerson.textContent;

    const people =
        peopleInput.value;


    let tipHTML = "";


    if (tipCheck.checked) {

        tipHTML = `
            <div class="row">
                <span>Tip</span>

                <strong>
                    ${tipAmount.textContent}
                </strong>
            </div>
        `;
    }


    let peopleHTML = "";


    if (namesCheck.checked) {

        const inputs =
            document.querySelectorAll(
                ".name-input"
            );


        inputs.forEach(
            function (input) {

                peopleHTML += `
                    <div class="person-row">

                        <span>
                            ${escapeHTML(
                                input.value.trim()
                            )}
                        </span>

                        <strong>
                            ${eachPerson}
                        </strong>

                    </div>
                `;

            }
        );
    }


    const printWindow =
        window.open(
            "",
            "_blank",
            "width=700,height=800"
        );


    if (!printWindow) {

        generalError.textContent =
            "Please allow pop-ups in your browser to print the bill.";

        return;
    }


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                Smart Bill Splitter
            </title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    color: #222;
                    background: white;
                }

                .receipt {
                    max-width: 600px;
                    margin: auto;
                }

                h1 {
                    text-align: center;
                    margin-bottom: 5px;
                }

                .subtitle {
                    text-align: center;
                    color: #777;
                    margin-bottom: 30px;
                }

                .row,
                .person-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 0;
                    border-bottom: 1px solid #ddd;
                }

                .total {
                    font-size: 20px;
                    font-weight: bold;
                }

                .people {
                    margin-top: 25px;
                }

                .each {
                    background: #eaf5ed;
                    padding: 20px;
                    border-radius: 12px;
                    margin-top: 25px;
                    text-align: center;
                }

                .each strong {
                    display: block;
                    font-size: 28px;
                    margin-top: 8px;
                }

                .footer {
                    text-align: center;
                    margin-top: 40px;
                    color: #888;
                    font-size: 13px;
                }

            </style>

        </head>


        <body>

            <div class="receipt">

                <h1>
                    Smart Bill Splitter
                </h1>

                <div class="subtitle">
                    Bill Receipt
                </div>


                <div class="row">

                    <span>
                        Bill Amount
                    </span>

                    <strong>
                        ${amount}
                    </strong>

                </div>


                ${tipHTML}


                <div class="row total">

                    <span>
                        Total Bill
                    </span>

                    <strong>
                        ${total}
                    </strong>

                </div>


                <div class="people">

                    <div class="row">

                        <span>
                            Number of People
                        </span>

                        <strong>
                            ${people}
                        </strong>

                    </div>


                    ${peopleHTML}

                </div>


                <div class="each">

                    Each Person Pays

                    <strong>
                        ${eachPerson}
                    </strong>

                </div>


                <div class="footer">

                    Generated using
                    Smart Bill Splitter

                </div>

            </div>


            <script>

                window.onload = function () {
                    window.print();
                };

            <\/script>

        </body>

        </html>

    `);


    printWindow.document.close();
}


// ========================================
// CREATE SHARE MESSAGE
// ========================================

function createShareMessage() {

    const total =
        totalBill.textContent;

    const eachPerson =
        perPerson.textContent;

    const people =
        peopleInput.value;


    let message =
        "🧾 SMART BILL SPLITTER\n\n";


    message +=
        "💰 Bill Amount: " +
        subtotal.textContent +
        "\n";


    if (tipCheck.checked) {

        message +=
            "💡 Tip: " +
            tipAmount.textContent +
            "\n";
    }


    message +=
        "💳 Total Bill: " +
        total +
        "\n";


    message +=
        "👥 People: " +
        people +
        "\n\n";


    if (namesCheck.checked) {

        const inputs =
            document.querySelectorAll(
                ".name-input"
            );


        inputs.forEach(
            function (input) {

                message +=
                    "👤 " +
                    input.value.trim() +
                    " — " +
                    eachPerson +
                    "\n";

            }
        );


        message += "\n";
    }


    message +=
        "💵 Each Person Pays: " +
        eachPerson +
        "\n\n";


    message +=
        "Generated using Smart Bill Splitter.";


    return message;
}


// ========================================
// COPY TEXT FALLBACK
// ========================================

async function copyShareMessage(
    message
) {

    try {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(
                message
            );

            return true;
        }


        const textArea =
            document.createElement(
                "textarea"
            );


        textArea.value =
            message;


        textArea.style.position =
            "fixed";

        textArea.style.left =
            "-9999px";


        document.body.appendChild(
            textArea
        );


        textArea.focus();

        textArea.select();


        const copied =
            document.execCommand(
                "copy"
            );


        document.body.removeChild(
            textArea
        );


        return copied;

    } catch (error) {

        console.error(error);

        return false;
    }
}


// ========================================
// SHARE BILL
// ========================================

async function shareBill() {

    shareMessage.textContent =
        "Preparing your bill...";


    const message =
        createShareMessage();


    // Native share

    if (
        navigator.share
    ) {

        try {

            await navigator.share({

                title:
                    "Smart Bill Splitter",

                text:
                    message
            });


            shareMessage.textContent =
                "Bill shared successfully.";

            return;

        } catch (error) {

            // User closed the share window.

            if (
                error.name ===
                "AbortError"
            ) {

                shareMessage.textContent =
                    "";

                return;
            }

        }
    }


    // Clipboard fallback

    const copied =
        await copyShareMessage(
            message
        );


    if (copied) {

        shareMessage.textContent =
            "✓ Bill copied to clipboard. You can now send it to your friends.";

    } else {

        shareMessage.textContent =
            "Sharing is not supported in this browser.";

    }
}


// ========================================
// BUTTON EVENTS
// ========================================

printButton.addEventListener(
    "click",
    function () {

        printBill();

    }
);


shareButton.addEventListener(
    "click",
    function () {

        shareBill();

    }
);


// ========================================
// RESET
// ========================================

resetButton.addEventListener(
    "click",
    function () {

        amountInput.value =
            "";

        peopleInput.value =
            "2";

        tipInput.value =
            "";


        namesCheck.checked =
            false;

        tipCheck.checked =
            false;


        namesContainer.classList.add(
            "hidden"
        );

        tipContainer.classList.add(
            "hidden"
        );


        namesContainer.innerHTML =
            "";


        generalError.textContent =
            "";

        shareMessage.textContent =
            "";


        subtotal.textContent =
            "₹0.00";

        tipAmount.textContent =
            "₹0.00";

        totalBill.textContent =
            "₹0.00";

        perPerson.textContent =
            "₹0.00";

        peopleText.textContent =
            "0 people";


        tipResultRow.classList.add(
            "hidden"
        );

        individualResults.classList.add(
            "hidden"
        );


        billActions.classList.add(
            "hidden"
        );

        emptyResult.classList.remove(
            "hidden"
        );

    }
);