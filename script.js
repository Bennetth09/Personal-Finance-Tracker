let totalIncome = 0;
let totalExpenses = 0;
let expenseCategories = {};
let expenseListArray = []; // To keep track of added expenses

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

    // Handle income input
    if (!isNaN(incomeValue) && incomeValue > 0) {
        totalIncome = incomeValue;
        incomeInput.value = '';
    } else {
        alert('Please enter a valid income');
        return;
    }

    // Handle expense input
    if (!isNaN(expenseValue) && expenseValue > 0 && categoryValue) {
        totalExpenses += expenseValue;

        // Create expense object and add to the array
        const expenseItem = {
            id: Date.now(), // Unique identifier for each expense
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

// Function to update balance
function updateBalance() {
    const balance = totalIncome - totalExpenses;
    balanceDisplay.textContent = balance >= 0 ? `$${balance}` : `-$${Math.abs(balance)}`;
}

// Function to update expense list UI
function updateExpenseList() {
    expenseList.innerHTML = '';
    expenseListArray.forEach(expense => {
        const listItem = document.createElement('li');
        listItem.textContent = `Expense: $${expense.value} | Category: ${expense.category}`;
        listItem.setAttribute('data-id', expense.id); // Set data-id for identifying expense
        
        // Create edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', function() {
            editExpense(expense.id);
        });

        // Create delete button
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

// Function to update category list
function updateCategoryList() {
    categoryList.innerHTML = '';
    for (const [category, amount] of Object.entries(expenseCategories)) {
        const categoryItem = document.createElement('li');
        categoryItem.textContent = `${category}: $${amount}`;
        categoryList.appendChild(categoryItem);
    }
}

// Function to edit an expense
function editExpense(id) {
    const expense = expenseListArray.find(exp => exp.id === id);
    if (expense) {
        expenseInput.value = expense.value;
        categoryInput.value = expense.category;
        
        // Remove the expense from the list for re-adding
        totalExpenses -= expense.value;
        expenseListArray = expenseListArray.filter(exp => exp.id !== id);
        updateExpenseList();
        updateBalance();
    }
}

// Function to delete an expense
function deleteExpense(id) {
    const expense = expenseListArray.find(exp => exp.id === id);
    if (expense) {
        totalExpenses -= expense.value; // Decrease total expenses
        expenseCategories[expense.category] -= expense.value; // Decrease category total
        if (expenseCategories[expense.category] <= 0) {
            delete expenseCategories[expense.category]; // Remove category if total is 0
        }
        expenseListArray = expenseListArray.filter(exp => exp.id !== id); // Remove from the array
        updateExpenseList();
        updateCategoryList();
        updateBalance();
    }
}

// Reset button functionality
resetButton.addEventListener('click', function () {
    totalIncome = 0;
    totalExpenses = 0;
    expenseCategories = {};
    expenseListArray = []; // Reset the expense list array
    balanceDisplay.textContent = '0';
    expenseList.innerHTML = '';
    categoryList.innerHTML = '';
    incomeInput.value = '';
    expenseInput.value = '';
    categoryInput.value = '';
});
