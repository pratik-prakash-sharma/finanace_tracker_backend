// Handle Registration
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });

    const message = await res.text();
    alert(message);
    if (message === 'User registered successfully') {
        window.location.href = 'index.html';
    }
});

// Handle Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const message = await res.text();
    alert(message);
    if (message === 'Login successful') {
        window.location.href = 'index.html';
    }
});


// Handle Logout
document.getElementById('logoutButton')?.addEventListener('click', async () => {
    const res = await fetch('/logout', { method: 'POST' });
    const message = await res.text();
    alert(message);
    if (message === 'Logout successful') {
        window.location.href = 'login.html';
    }
});

// add transaction 

// Add transaction
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('transactionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        // Your existing form submission logic
        document.getElementById('transactionForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const type = document.getElementById('type').value;
            const amount = document.getElementById('amount').value;
            const category = document.getElementById('category').value;
            const date = document.getElementById('date').value;
            const notes = document.getElementById('notes').value;

            try {
                const res = await fetch('/transaction', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, amount, category, date, notes })
                });

                if (res.status === 401) {
                    alert('You need to log in first.');
                    // Optionally, redirect to login page
                    window.location.href = '/login.html';
                } else {
                    const message = await res.text();
                    alert(message);
                }
            } catch (error) {
                console.error('Error adding transaction:', error);
                alert('Failed to add transaction');
            }
        });

    });
});


// document.getElementById('transactionForm').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const type = document.getElementById('type').value;
//     const amount = document.getElementById('amount').value;
//     const category = document.getElementById('category').value;
//     const date = document.getElementById('date').value;
//     const notes = document.getElementById('notes').value || '';  // Optional field

//     try {
//         const res = await fetch('/transaction', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ type, amount, category, date, notes })
//         });

//         const message = await res.text();
//         alert(message);

//         // Reload transactions after adding
//         document.getElementById('loadTransactions').click();

//     } catch (error) {
//         console.error('Error adding transaction:', error);
//         alert('Failed to add transaction');
//     }
// });



// Load Transactions
// document.getElementById('loadTransactions')?.addEventListener('click', async () => {
//     const res = await fetch('/transactions');
//     const transactions = await res.json();

//     const tableBody = document.querySelector('#transactionTable tbody');
//     tableBody.innerHTML = ''; // Clear previous rows

//     transactions.forEach(transaction => {
//         const row = `<tr>
//             <td>${transaction.type}</td>
//             <td>${transaction.amount}</td>
//             <td>${transaction.category}</td>
//             <td>${transaction.date}</td>
//             <td>${transaction.notes}</td>
//         </tr>`;
//         tableBody.insertAdjacentHTML('beforeend', row);
//     });
// });

// updated load transaction function 

// load transaction

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loadTransactions').addEventListener('click', async () => {
        const res = await fetch('/transactions');
        const transactions = await res.json();

        // Separate tables for income and expenses
        const incomeTableBody = document.querySelector('#incomeTable tbody');
        const expenseTableBody = document.querySelector('#expenseTable tbody');

        // Clear previous rows
        incomeTableBody.innerHTML = '';
        expenseTableBody.innerHTML = '';

        let totalIncome = 0;
        let totalExpenses = 0;

        // Loop through transactions and populate respective tables
        transactions.forEach(transaction => {
            const row = `<tr>
                <td>${transaction.amount}</td>
                <td>${transaction.category}</td>
                <td>${transaction.date}</td>
                <td>${transaction.notes}</td>
            </tr>`;

            if (transaction.type === 'income') {
                totalIncome += parseFloat(transaction.amount);
                incomeTableBody.insertAdjacentHTML('beforeend', row);
            } else if (transaction.type === 'expense') {
                totalExpenses += parseFloat(transaction.amount);
                expenseTableBody.insertAdjacentHTML('beforeend', row);
            }
        });

        // Display totals
        document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
        document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);

        // Calculate and display savings
        const savings = totalIncome - totalExpenses;
        document.getElementById('savings').textContent = savings.toFixed(2);
    });

})
// document.getElementById('loadTransactions').addEventListener('click', async () => {
//     const res = await fetch('/transactions');
//     const transactions = await res.json();

//     // Separate tables for income and expenses
//     const incomeTableBody = document.querySelector('#incomeTable tbody');
//     const expenseTableBody = document.querySelector('#expenseTable tbody');

//     // Clear previous rows
//     incomeTableBody.innerHTML = '';
//     expenseTableBody.innerHTML = '';

//     let totalIncome = 0;
//     let totalExpenses = 0;

//     // Loop through transactions and populate respective tables
//     transactions.forEach(transaction => {
//         const row = `<tr>
//             <td>${transaction.amount}</td>
//             <td>${transaction.category}</td>
//             <td>${transaction.date}</td>
//             <td>${transaction.notes}</td>
//         </tr>`;

//         if (transaction.type === 'income') {
//             totalIncome += parseFloat(transaction.amount);
//             incomeTableBody.insertAdjacentHTML('beforeend', row);
//         } else if (transaction.type === 'expense') {
//             totalExpenses += parseFloat(transaction.amount);
//             expenseTableBody.insertAdjacentHTML('beforeend', row);
//         }
//     });

//     // Display totals
//     document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
//     document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);

//     // Calculate and display savings
//     const savings = totalIncome - totalExpenses;
//     document.getElementById('savings').textContent = savings.toFixed(2);
// });


// Check User Session and Update UI
document.addEventListener('DOMContentLoaded', () => {

    window.onload = async () => {
        const res = await fetch('/getUser');
        const user = await res.json();

        if (user) {
            document.getElementById('userDetails').style.display = 'block';
            document.getElementById('login-nav').style.visibility = 'visible';
            document.getElementById('userName').innerText = user.name;
            document.getElementById('hero-nav').style.display = 'none';
        }
    };  
})

