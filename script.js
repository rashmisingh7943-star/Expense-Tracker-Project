const sidebarItems = document.querySelectorAll(".sidebar ul li");

// Pages
const pages = document.querySelectorAll(".page");

// Form
const transactionForm = document.getElementById("transactionForm");

const description = document.getElementById("description");
const category = document.getElementById("category");
const transactionDate = document.getElementById("transactionDate");
const amount = document.getElementById("amount");
const type = document.getElementById("type");

// Dashboard Cards
const totalBalance = document.getElementById("totalBalance");
const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");

// Reports
const reportIncome = document.getElementById("reportIncome");
const reportExpense = document.getElementById("reportExpense");
const reportBalance = document.getElementById("reportBalance");

// Lists
const transactionList = document.getElementById("transactionList");
const allTransactions = document.getElementById("allTransactions");

// Search & Filter
const searchTransaction = document.getElementById("searchTransaction");
const filterCategory = document.getElementById("filterCategory");

// Buttons
const exportCSV = document.getElementById("exportCSV");
const clearData = document.getElementById("clearData");

// Dark Mode
const darkMode = document.getElementById("darkMode");
const themeToggle = document.getElementById("themeToggle");

/*=========================
    LOCAL STORAGE KEYS
=========================*/

const STORAGE_KEY = "transactions";
const THEME_KEY = "theme";

/*=========================
    APP STATE
=========================*/

let transactions = [];
let editId = null;

/*=========================
    LOAD DATA
=========================*/

function loadTransactions() {

    const data = localStorage.getItem(STORAGE_KEY);

    if (data) {

        transactions = JSON.parse(data);

    } else {

        transactions = [];

    }

}

/*=========================
    SAVE DATA
=========================*/

function saveTransactions() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(transactions)
    );

}

/*=========================
    GENERATE ID
=========================*/

function generateId() {

    return Date.now();

}

/*=========================
    FORMAT CURRENCY
=========================*/

function formatCurrency(value) {

    return `₹${Number(value).toLocaleString("en-IN")}`;

}

/*=========================
    FORMAT DATE
=========================*/

function formatDate(date) {

    return new Date(date).toLocaleDateString("en-IN", {

        day: "2-digit",

        month: "short",

        year: "numeric"

    });

}

/*=========================
    RESET FORM
=========================*/

function resetForm() {

    transactionForm.reset();

    transactionDate.valueAsDate = new Date();

    editId = null;

}

/*=========================
    VALIDATION
=========================*/

function validateForm() {

    if (description.value.trim() === "") {

        alert("Please enter description.");

        return false;

    }

    if (category.value === "") {

        alert("Please select category.");

        return false;

    }

    if (transactionDate.value === "") {

        alert("Please select date.");

        return false;

    }

    if (amount.value === "" || Number(amount.value) <= 0) {

        alert("Please enter valid amount.");

        return false;

    }

    if (type.value === "") {

        alert("Please select transaction type.");

        return false;

    }

    return true;

}

/*=========================
    CREATE OBJECT
=========================*/

function createTransactionObject() {

    return {

        id: generateId(),

        description: description.value.trim(),

        category: category.value,

        date: transactionDate.value,

        amount: Number(amount.value),

        type: type.value

    };

}

/*=========================
    ADD TRANSACTION
=========================*/

function addTransaction(e) {

    e.preventDefault();

    if (!validateForm()) return;

    const transaction = createTransactionObject();

    transactions.push(transaction);

    saveTransactions();

    renderTransactions();

    updateDashboard();

    resetForm();

}

/*=========================
    FORM SUBMIT
=========================*/

transactionForm.addEventListener("submit", addTransaction);

/*=========================
    INITIALIZE
=========================*/

function init() {

    loadTransactions();

    resetForm();

    renderTransactions();

    updateDashboard();

}

init();
/*=====================================================
    SCRIPT.JS - PART 2
    Render Transactions & Dashboard
======================================================*/

/*=========================
    EMPTY STATE
=========================*/

function showEmptyState() {

    const emptyHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-wallet"></i>
            <h3>No Transactions Yet</h3>
            <p>Add your first transaction to start tracking.</p>
        </div>
    `;

    transactionList.innerHTML = emptyHTML;
    allTransactions.innerHTML = emptyHTML;
}

/*=========================
    CREATE TRANSACTION CARD
=========================*/

function createTransactionCard(transaction) {

    return `
    <div class="transaction-item">

        <div class="transaction-left">

            <div class="transaction-icon">

                <i class="fa-solid ${
                    transaction.type === "Income"
                        ? "fa-arrow-trend-up"
                        : "fa-arrow-trend-down"
                }"></i>

            </div>

            <div class="transaction-info">

                <h4>${transaction.description}</h4>

                <p>
                    ${transaction.category} •
                    ${formatDate(transaction.date)}
                </p>

            </div>

        </div>

        <div class="transaction-right">

            <h3 class="${
                transaction.type === "Income"
                    ? "amount-income"
                    : "amount-expense"
            }">

                ${
                    transaction.type === "Income"
                        ? "+"
                        : "-"
                }

                ${formatCurrency(transaction.amount)}

            </h3>

            <button
                class="action-btn edit-btn"
                data-id="${transaction.id}"
            >
                <i class="fa-solid fa-pen"></i>
            </button>

            <button
                class="action-btn delete-btn"
                data-id="${transaction.id}"
            >
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>

    </div>
    `;
}

/*=========================
    RENDER TRANSACTIONS
=========================*/

function renderTransactions() {

    if (transactions.length === 0) {

        showEmptyState();
        return;

    }

    const latest = [...transactions].reverse();

    transactionList.innerHTML = "";

    allTransactions.innerHTML = "";

    latest.forEach(transaction => {

        const card = createTransactionCard(transaction);

        transactionList.innerHTML += card;

        allTransactions.innerHTML += card;

    });

}

/*=========================
    UPDATE DASHBOARD
=========================*/

function updateDashboard() {

    let income = 0;

    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "Income") {

            income += transaction.amount;

        } else {

            expense += transaction.amount;

        }

    });

    const balance = income - expense;

    totalBalance.textContent = formatCurrency(balance);

    totalIncome.textContent = formatCurrency(income);

    totalExpense.textContent = formatCurrency(expense);

    reportIncome.textContent = formatCurrency(income);

    reportExpense.textContent = formatCurrency(expense);

    reportBalance.textContent = formatCurrency(balance);

}

/*=========================
    SIDEBAR NAVIGATION
=========================*/

sidebarItems.forEach(item => {

    item.addEventListener("click", () => {

        sidebarItems.forEach(nav => {

            nav.classList.remove("active");

        });

        item.classList.add("active");

        const pageName = item.dataset.page;

        pages.forEach(page => {

            page.classList.remove("active-page");

            if (page.id === pageName) {

                page.classList.add("active-page");

            }

        });

    });

});

/*=========================
    SET TODAY DATE
=========================*/

window.addEventListener("DOMContentLoaded", () => {

    transactionDate.valueAsDate = new Date();

});
/*=====================================================
    SCRIPT.JS - PART 3
    Edit, Delete, Search & Filter
======================================================*/

/*=========================
    DELETE TRANSACTION
=========================*/

function deleteTransaction(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) return;

    transactions = transactions.filter(transaction => transaction.id !== id);

    saveTransactions();

    renderTransactions();

    updateDashboard();

}

/*=========================
    EDIT TRANSACTION
=========================*/

function editTransaction(id) {

    const transaction = transactions.find(item => item.id === id);

    if (!transaction) return;

    description.value = transaction.description;
    category.value = transaction.category;
    transactionDate.value = transaction.date;
    amount.value = transaction.amount;
    type.value = transaction.type;

    editId = id;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

/*=========================
    UPDATE TRANSACTION
=========================*/

function updateTransaction(e) {

    e.preventDefault();

    if (!validateForm()) return;

    const index = transactions.findIndex(item => item.id === editId);

    if (index === -1) return;

    transactions[index] = {

        id: editId,

        description: description.value.trim(),

        category: category.value,

        date: transactionDate.value,

        amount: Number(amount.value),

        type: type.value

    };

    saveTransactions();

    renderTransactions();

    updateDashboard();

    resetForm();

}

/*=========================
    FORM SUBMIT
=========================*/

transactionForm.removeEventListener("submit", addTransaction);

transactionForm.addEventListener("submit", function (e) {

    if (editId === null) {

        addTransaction(e);

    } else {

        updateTransaction(e);

    }

});

/*=========================
    BUTTON EVENTS
=========================*/

document.addEventListener("click", function (e) {

    const editBtn = e.target.closest(".edit-btn");

    const deleteBtn = e.target.closest(".delete-btn");

    if (editBtn) {

        const id = Number(editBtn.dataset.id);

        editTransaction(id);

    }

    if (deleteBtn) {

        const id = Number(deleteBtn.dataset.id);

        deleteTransaction(id);

    }

});

/*=========================
    SEARCH TRANSACTIONS
=========================*/

searchTransaction.addEventListener("input", function () {

    const keyword = this.value.toLowerCase();

    const filtered = transactions.filter(transaction => {

        return (

            transaction.description.toLowerCase().includes(keyword) ||

            transaction.category.toLowerCase().includes(keyword)

        );

    });

    displayFilteredTransactions(filtered);

});

/*=========================
    CATEGORY FILTER
=========================*/

filterCategory.addEventListener("change", function () {

    if (this.value === "All") {

        displayFilteredTransactions(transactions);

        return;

    }

    const filtered = transactions.filter(transaction => {

        return transaction.category === this.value;

    });

    displayFilteredTransactions(filtered);

});

/*=========================
    DISPLAY FILTERED DATA
=========================*/

function displayFilteredTransactions(data) {

    allTransactions.innerHTML = "";

    if (data.length === 0) {

        allTransactions.innerHTML = `

        <div class="empty-state">

            <i class="fa-solid fa-circle-info"></i>

            <h3>No Matching Transactions</h3>

        </div>

        `;

        return;

    }

    const latest = [...data].reverse();

    latest.forEach(transaction => {

        allTransactions.innerHTML += createTransactionCard(transaction);

    });

}
/*=====================================================
    SCRIPT.JS - PART 4
    Dark Mode, Export CSV & Settings
======================================================*/

/*=========================
    DARK MODE
=========================*/

function enableDarkMode() {

    document.body.classList.add("dark");

    darkMode.checked = true;

    localStorage.setItem(THEME_KEY, "dark");

}

function disableDarkMode() {

    document.body.classList.remove("dark");

    darkMode.checked = false;

    localStorage.setItem(THEME_KEY, "light");

}

function toggleTheme() {

    if (document.body.classList.contains("dark")) {

        disableDarkMode();

    } else {

        enableDarkMode();

    }

}

themeToggle.addEventListener("click", toggleTheme);

darkMode.addEventListener("change", function () {

    if (this.checked) {

        enableDarkMode();

    } else {

        disableDarkMode();

    }

});

/*=========================
    LOAD SAVED THEME
=========================*/

const savedTheme = localStorage.getItem(THEME_KEY);

if (savedTheme === "dark") {

    enableDarkMode();

} else {

    disableDarkMode();

}

/*=========================
    EXPORT CSV
=========================*/

function exportTransactionsCSV() {

    if (transactions.length === 0) {

        alert("No transactions available.");

        return;

    }

    let csv =
        "Description,Category,Date,Amount,Type\n";

    transactions.forEach(transaction => {

        csv += `"${transaction.description}","${transaction.category}","${transaction.date}","${transaction.amount}","${transaction.type}"\n`;

    });

    const blob = new Blob(
        [csv],
        {
            type: "text/csv"
        }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "Expense_Tracker.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}

exportCSV.addEventListener(
    "click",
    exportTransactionsCSV
);

/*=========================
    CLEAR ALL DATA
=========================*/

clearData.addEventListener("click", function () {

    const confirmClear = confirm(

        "Delete all transactions?"

    );

    if (!confirmClear) return;

    transactions = [];

    saveTransactions();

    renderTransactions();

    updateDashboard();

    resetForm();

    alert("All transactions deleted.");

});

/*=========================
    AUTO LOAD
=========================*/

window.addEventListener("load", () => {

    loadTransactions();

    renderTransactions();

    updateDashboard();

});