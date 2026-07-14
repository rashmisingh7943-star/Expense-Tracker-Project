// =========================
// DOM Elements
// =========================

const form = document.getElementById("form");
const textInput = document.getElementById("text");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const amountInput = document.getElementById("amount");

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");

const transactionList = document.getElementById("transactions");

// =========================
// Local Storage
// =========================

let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

// =========================
// Save Data
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

    renderTransactions();

    form.reset();

}

// =========================
// Render Transactions
// =========================

function renderTransactions(){

    transactionList.innerHTML = "";

    transactions.forEach(transaction=>{

        const li =
        document.createElement("li");

        li.classList.add(
            transaction.amount > 0
            ?
            "income"
            :
            "expense"
        );

        li.innerHTML = `

        <div class="info">

            <strong>${transaction.text}</strong>

            <small>

            ${transaction.category}

            |

            ${transaction.date}

            </small>

        </div>

        <span class="amount">

        ${transaction.amount>0?"+":"-"}

        ₹${Math.abs(transaction.amount)}

        </span>

        `;

        transactionList.appendChild(li);

    });

    updateSummary();

}

// =========================
// Update Summary
// =========================

function updateSummary(){

    const amounts =
    transactions.map(
        transaction => transaction.amount
    );

    const balance =
    amounts
    .reduce(
        (total,value)=>total+value,
        0
    )
    .toFixed(2);

    const income =
    amounts
    .filter(value=>value>0)
    .reduce(
        (total,value)=>total+value,
        0
    )
    .toFixed(2);

    const expense =
    amounts
    .filter(value=>value<0)
    .reduce(
        (total,value)=>total+value,
        0
    )
    .toFixed(2);

    balanceEl.textContent = `₹${balance}`;
    incomeEl.textContent = `₹${income}`;
    expenseEl.textContent = `₹${Math.abs(expense)}`;

}

// =========================
// Event Listener
// =========================

form.addEventListener(
    "submit",
    addTransaction
);

// Initial Render

renderTransactions();