// =========================
// DOM Elements
// =========================

const form = document.getElementById("form");
const textInput = document.getElementById("text");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const amountInput = document.getElementById("amount");

// =========================
// Local Storage
// =========================

let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];


// =========================
// Save Transactions
// =========================

function updateLocalStorage(){

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// =========================
// Add Transaction
// =========================

function addTransaction(e){

    e.preventDefault();

    const text = textInput.value.trim();

    const category = categoryInput.value;

    const date = dateInput.value;

    const amount = Number(amountInput.value);

    if(

        text === "" ||

        category === "" ||

        date === "" ||

        amount === 0

    ){

        alert("Please fill all fields.");

        return;

    }

    const transaction = {

        id: Date.now(),

        text,

        category,

        date,

        amount

    };

    transactions.push(transaction);

    updateLocalStorage();

    console.log(transactions);

    form.reset();

}


// =========================
// Event Listener
// =========================

form.addEventListener(
    "submit",
    addTransaction
);