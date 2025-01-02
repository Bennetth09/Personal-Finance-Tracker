let totalIncome = 0;
let totalExpenses = 0;
let expenseCategories = {};
let expenseListArray = [];

const incomeInput = document.getElementById('income');
const categoryInput = document.getElementById('category');
const expenseInput = document.getElementById('expense');
const addExpenseButton = document.getElementById('addExpense');
const resetButton = document.getElementById('reset');
const balanceDisplay = document.getElementById('balance');
const expenseList = document.getElementById('expenseList');
const categoryList = document.getElementById('categoryList');

addExpenseButton.addEventListener('click', function () {
    const incomeValue = parseFloat(incomeInput.value);
    const expenseValue = parseFloat(expenseInput.value);
    const categoryValue = categoryInput.value.trim();

    if (!isNaN(incomeValue) && incomeValue > 0) {
        totalIncome = incomeValue;
        incomeInput.value = '';
    } else {
        alert('Please enter a valid income in rupees');
        return;
    }

    if (!isNaN(expenseValue) && expenseValue > 0 && categoryValue) {
        totalExpenses += expenseValue;

        // Update expenseCategories for the added expense
        if (expenseCategories[categoryValue]) {
            expenseCategories[categoryValue] += expenseValue;
        } else {
            expenseCategories[categoryValue] = expenseValue;
        }

        const expenseItem = {
            id: Date.now(),
            value: expenseValue,
            category: categoryValue,
        };
        expenseListArray.push(expenseItem);

        // Update the UI
        updateExpenseList();
        updateCategoryList();
        updateBalance();
        expenseInput.value = '';
        categoryInput.value = '';
    } else {
        alert('Please enter a valid expense and category');
    }
});

function updateBalance() {
    const balance = totalIncome - totalExpenses;
    balanceDisplay.textContent = balance >= 0 
        ? `₹${balance}` 
        : `-₹${Math.abs(balance)}`;
}

function updateExpenseList() {
    expenseList.innerHTML = '';
    expenseListArray.forEach(expense => {
        const listItem = document.createElement('li');
        listItem.textContent = `Expense: ₹${expense.value} | Category: ${expense.category}`;
        listItem.setAttribute('data-id', expense.id);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', function() {
            editExpense(expense.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function() {
            deleteExpense(expense.id);
        });

        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        expenseList.appendChild(listItem);
    });
}

function updateCategoryList() {
    categoryList.innerHTML = '';
    for (const [category, amount] of Object.entries(expenseCategories)) {
        const categoryItem = document.createElement('li');
        categoryItem.textContent = `${category}: ₹${amount}`;
        categoryList.appendChild(categoryItem);
    }
}

function editExpense(id) {
    const expense = expenseListArray.find(exp => exp.id === id);
    if (expense) {
        expenseInput.value = expense.value;
        categoryInput.value = expense.category;

        totalExpenses -= expense.value;
        expenseCategories[expense.category] -= expense.value;

        if (expenseCategories[expense.category] <= 0) {
            delete expenseCategories[expense.category];
        }

        expenseListArray = expenseListArray.filter(exp => exp.id !== id);
        updateExpenseList();
        updateCategoryList();
        updateBalance();
    }
}

function deleteExpense(id) {
    const expense = expenseListArray.find(exp => exp.id === id);
    if (expense) {
        totalExpenses -= expense.value; 
        expenseCategories[expense.category] -= expense.value; 

        if (expenseCategories[expense.category] <= 0) {
            delete expenseCategories[expense.category]; 
        }

        expenseListArray = expenseListArray.filter(exp => exp.id !== id); 
        updateExpenseList();
        updateCategoryList();
        updateBalance();
    }
}

resetButton.addEventListener('click', function () {
    totalIncome = 0;
    totalExpenses = 0;
    expenseCategories = {};
    expenseListArray = []; 
    balanceDisplay.textContent = '₹0';
    expenseList.innerHTML = '';
    categoryList.innerHTML = '';
    incomeInput.value = '';
    expenseInput.value = '';
    categoryInput.value = '';
});

