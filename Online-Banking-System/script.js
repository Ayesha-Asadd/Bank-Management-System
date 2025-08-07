
        // --- Data Simulation (Client-Side Only) ---
        // In a real system, this data would come from a secure backend database.
        let currentUser = null; // Stores the currently logged-in user's data

        // Initialize users data from localStorage or use default if not available
        const initialUsers = {
            "user1": {
                password: "pass1",
                username: "user1",
                accountNumber: "9876543210",
                balance: 5000.00,
                email: "user1@example.com",
                phone: "+1 (555) 123-4567",
                transactions: [
                    { id: Date.now() + 1, date: "2025-07-20", type: "Credit", description: "Initial Deposit", amount: 5000.00 },
                    { id: Date.now() + 2, date: "2025-07-22", type: "Debit", description: "Online Shopping", amount: -150.00 },
                    { id: Date.now() + 3, date: "2025-07-24", type: "Debit", description: "Utility Bill", amount: -75.50 }
                ]
            },
           
        };

        let users = JSON.parse(localStorage.getItem('users')) || initialUsers;

        // --- DOM Elements ---
        const loginSection = document.getElementById('login-section');
        const dashboardSection = document.getElementById('dashboard-section');
        const transferSection = document.getElementById('transfer-section');
        const billPaymentSection = document.getElementById('bill-payment-section');
        const miniStatementSection = document.getElementById('mini-statement-section');
        const loanSection = document.getElementById('loan-section');
        const profileSection = document.getElementById('profile-section');

        const loginForm = document.getElementById('login-form');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        const accountBalanceSpan = document.getElementById('account-balance');
        const accountNumberSpan = document.getElementById('account-number');
        const recentTransactionsList = document.getElementById('recent-transactions-list');
        const transactionsTableBody = document.getElementById('transactions-table-body');

        const transferForm = document.getElementById('transfer-form');
        const recipientAccountInput = document.getElementById('recipient-account');
        const transferAmountInput = document.getElementById('transfer-amount');
        const transferDescriptionInput = document.getElementById('transfer-description');

        const billPaymentForm = document.getElementById('bill-payment-form');
        const billTypeSelect = document.getElementById('bill-type');
        const billAccountNumberInput = document.getElementById('bill-account-number');
        const billAmountInput = document.getElementById('bill-amount');

        const loanForm = document.getElementById('loan-form');
        const loanTypeSelect = document.getElementById('loan-type');
        const loanAmountInput = document.getElementById('loan-amount');
        const loanDurationInput = document.getElementById('loan-duration');

        const profileUsername = document.getElementById('profile-username');
        const profileAccountNumber = document.getElementById('profile-account-number');
        const profileEmail = document.getElementById('profile-email');
        const profilePhone = document.getElementById('profile-phone');

        const mainNav = document.getElementById('main-nav');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        const closeMobileMenuButton = document.getElementById('close-mobile-menu-button');
        const mobileNav = document.getElementById('mobile-nav');

        // Custom Modal elements
        const customModalOverlay = document.getElementById('custom-modal-overlay');
        const customModalHeader = document.getElementById('custom-modal-header');
        const customModalBody = document.getElementById('custom-modal-body');
        const customModalCloseButton = document.getElementById('custom-modal-close-button');

        // --- Utility Functions ---

        /**
         * Shows a custom modal with a given title and message.
         * @param {string} title - The title of the modal.
         * @param {string} message - The message content of the modal.
         */
        function showCustomModal(title, message) {
            if (customModalHeader) customModalHeader.textContent = title;
            if (customModalBody) customModalBody.textContent = message;
            if (customModalOverlay) customModalOverlay.classList.add('show');
        }

        /**
         * Hides the custom modal.
         */
        function hideCustomModal() {
            if (customModalOverlay) customModalOverlay.classList.remove('show');
        }

        /**
         * Hides all content sections and shows the specified section.
         * @param {string} sectionIdToShow - The ID of the section to show.
         */
        function showSection(sectionIdToShow) {
            console.log('Attempting to show section:', sectionIdToShow);
            // List all main sections that can be shown/hidden
            const allSections = [
                loginSection,
                dashboardSection,
                transferSection,
                billPaymentSection,
                miniStatementSection,
                loanSection,
                profileSection
            ];

            allSections.forEach(section => {
                if (section) {
                    section.classList.add('hidden');
                    console.log('Hiding section:', section.id);
                }
            });

            const targetSection = document.getElementById(sectionIdToShow);
            if (targetSection) {
                targetSection.classList.remove('hidden');
                console.log('Showing target section:', targetSection.id);
            } else {
                console.error('Target section not found:', sectionIdToShow);
            }

            // Update navigation active state
            updateNavActiveState(sectionIdToShow);

            // Close mobile menu if open
            if (mobileMenuOverlay) mobileMenuOverlay.classList.add('hidden');

            // Perform specific updates for sections
            if (sectionIdToShow === 'dashboard-section' && currentUser) {
                updateDashboard();
            } else if (sectionIdToShow === 'mini-statement-section' && currentUser) {
                updateMiniStatement();
            } else if (sectionIdToShow === 'profile-section' && currentUser) {
                updateProfile();
            }
        }

        /**
         * Updates the navigation bar based on login status.
         */
        function updateNavigationBar() {
            if (!mainNav || !mobileNav) return;

            mainNav.innerHTML = ''; // Clear existing links
            mobileNav.innerHTML = ''; // Clear existing mobile links

            const navLinks = [
                { id: 'dashboard-section', text: 'Dashboard', icon: 'fas fa-home' },
                { id: 'transfer-section', text: 'Transfer', icon: 'fas fa-exchange-alt' },
                { id: 'bill-payment-section', text: 'Pay Bills', icon: 'fas fa-file-invoice-dollar' },
                { id: 'mini-statement-section', text: 'Statement', icon: 'fas fa-clipboard-list' },
                { id: 'loan-section', text: 'Loan', icon: 'fas fa-hand-holding-usd' },
                { id: 'profile-section', text: 'Profile', icon: 'fas fa-user-circle' }
            ];

            if (currentUser) {
                // Logged in state: Show dashboard navigation
                navLinks.forEach(link => {
                    const desktopLink = document.createElement('a');
                    desktopLink.href = '#';
                    desktopLink.classList.add('nav-link');
                    desktopLink.textContent = link.text;
                    desktopLink.onclick = (e) => { e.preventDefault(); showSection(link.id); };
                    mainNav.appendChild(desktopLink);

                    const mobileLink = document.createElement('a');
                    mobileLink.href = '#';
                    mobileLink.classList.add('nav-link');
                    mobileLink.innerHTML = `<i class="${link.icon}"></i>${link.text}`;
                    mobileLink.onclick = (e) => { e.preventDefault(); showSection(link.id); };
                    mobileNav.appendChild(mobileLink);
                });

                // Add Logout button
                const desktopLogoutBtn = document.createElement('button');
                desktopLogoutBtn.classList.add('btn-secondary', 'logout-btn-desktop');
                desktopLogoutBtn.textContent = 'Logout';
                desktopLogoutBtn.onclick = logout;
                mainNav.appendChild(desktopLogoutBtn);

                const mobileLogoutBtn = document.createElement('button');
                mobileLogoutBtn.classList.add('btn-secondary', 'logout-btn-mobile');
                mobileLogoutBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i>Logout`;
                mobileLogoutBtn.onclick = logout;
                mobileNav.appendChild(mobileLogoutBtn);

                mainNav.classList.remove('hidden');
                mobileMenuButton.classList.remove('hidden'); // Show mobile menu button
            } else {
                // Logged out state: Hide dashboard navigation
                mainNav.classList.add('hidden');
                mobileMenuButton.classList.add('hidden'); // Hide mobile menu button
            }
        }

        /**
         * Updates the active state of navigation links.
         * @param {string} activeSectionId - The ID of the currently active section.
         */
        function updateNavActiveState(activeSectionId) {
            document.querySelectorAll('.nav-link').forEach(link => {
                if (link.onclick && link.onclick.toString().includes(`showSection('${activeSectionId}')`)) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }

        // --- Authentication ---

        /**
         * Handles user login.
         * @param {Event} e - The form submission event.
         */
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = usernameInput.value.trim();
                const password = passwordInput.value.trim();

                if (users[username] && users[username].password === password) {
                    currentUser = users[username];
                    localStorage.setItem('loggedInUser', username); // Simulate session
                    localStorage.setItem('users', JSON.stringify(users)); // Save updated users object
                    showCustomModal('Login Successful', `Welcome, ${currentUser.username}!`);
                    // Show dashboard and hide login form
                    setTimeout(() => {
                        hideCustomModal();
                        showSection('dashboard-section');
                        updateNavigationBar(); // Update navigation for logged-in state
                    }, 1000); // Small delay for modal to be seen
                } else {
                    showCustomModal('Login Failed', 'Invalid username or password.');
                }
                usernameInput.value = '';
                passwordInput.value = '';
            });
        }

        /**
         * Handles user logout.
         */
        function logout() {
            currentUser = null;
            localStorage.removeItem('loggedInUser'); // Clear simulated session
            // No need to clear 'users' data unless you want to reset all accounts on logout
            showCustomModal('Logged Out', 'You have been successfully logged out.');
            // Show login section and hide all other sections
            setTimeout(() => {
                hideCustomModal();
                showSection('login-section');
                updateNavigationBar(); // Update navigation for logged-out state
            }, 1000); // Small delay for modal to be seen
        }

        // --- Dashboard Functions ---

        /**
         * Updates the dashboard with current user's data.
         */
        function updateDashboard() {
            if (!currentUser || !accountBalanceSpan || !accountNumberSpan) return;

            // Retrieve the latest user data from localStorage
            const latestUsers = JSON.parse(localStorage.getItem('users')) || initialUsers;
            currentUser = latestUsers[currentUser.username]; // Update currentUser with latest data

            accountBalanceSpan.textContent = currentUser.balance.toFixed(2);
            accountNumberSpan.textContent = currentUser.accountNumber;

            // Sort transactions by date descending for recent transactions
            const sortedTransactions = [...currentUser.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
            const recentTransactions = sortedTransactions.slice(0, 3); // Show last 3 transactions

            if (recentTransactionsList) {
                recentTransactionsList.innerHTML = ''; // Clear previous list

                if (recentTransactions.length === 0) {
                    recentTransactionsList.innerHTML = '<p class="text-gray-500 text-center py-4">No recent transactions.</p>';
                } else {
                    recentTransactions.forEach(transaction => {
                        const transactionItem = document.createElement('div');
                        transactionItem.classList.add('transaction-item');
                        const amountColor = transaction.type === 'Credit' ? 'text-green-600' : 'text-red-600';
                        const sign = transaction.type === 'Credit' ? '+' : '';
                        transactionItem.innerHTML = `
                            <div>
                                <p class="font-semibold text-gray-800">${transaction.description}</p>
                                <p class="text-sm text-gray-500">${transaction.date}</p>
                            </div>
                            <p class="font-bold text-lg ${amountColor}">${sign}$${Math.abs(transaction.amount).toFixed(2)}</p>
                        `;
                        recentTransactionsList.appendChild(transactionItem);
                    });
                }
            }
        }

        // --- Fund Transfer Functions ---

        /**
         * Handles fund transfer submission.
         * @param {Event} e - The form submission event.
         */
        if (transferForm) {
            transferForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!currentUser) {
                    showCustomModal('Error', 'Please log in to perform this action.');
                    return;
                }

                const recipientAccount = recipientAccountInput.value.trim();
                const amount = parseFloat(transferAmountInput.value);
                const description = transferDescriptionInput.value.trim() || 'Fund Transfer';

                if (isNaN(amount) || amount <= 0) {
                    showCustomModal('Invalid Amount', 'Please enter a valid amount greater than zero.');
                    return;
                }

                if (currentUser.balance < amount) {
                    showCustomModal('Insufficient Funds', 'You do not have enough balance for this transfer.');
                    return;
                }

                // Update currentUser balance
                currentUser.balance -= amount;
                const transactionDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

                // Add debit transaction for current user
                currentUser.transactions.push({
                    id: Date.now(),
                    date: transactionDate,
                    type: "Debit",
                    description: `Transfer to ${recipientAccount} (${description})`,
                    amount: -amount
                });

                // Find recipient and add credit transaction
                const recipientUser = Object.values(users).find(user => user.accountNumber === recipientAccount);
                if (recipientUser) {
                    recipientUser.balance += amount;
                    recipientUser.transactions.push({
                        id: Date.now() + 1, // Ensure unique ID
                        date: transactionDate,
                        type: "Credit",
                        description: `Transfer from ${currentUser.accountNumber} (${description})`,
                        amount: amount
                    });
                    showCustomModal('Transfer Successful', `$${amount.toFixed(2)} transferred to ${recipientAccount}.`);
                } else {
                    // If recipient not found in simulated data, still deduct from sender
                    showCustomModal('Transfer Processed', `$${amount.toFixed(2)} transferred. Recipient account not found in simulated system.`);
                }

                // Update the global users object and then persist to localStorage
                users[currentUser.username] = currentUser; // Ensure global users object reflects current user's state
                if (recipientUser) {
                    // Also update the recipient in the global users object if found
                    const recipientUsername = Object.keys(users).find(key => users[key] === recipientUser);
                    if (recipientUsername) {
                        users[recipientUsername] = recipientUser;
                    }
                }
                localStorage.setItem('users', JSON.stringify(users));

                // Reset form
                transferForm.reset();
                updateDashboard(); // Update dashboard after transfer
            });
        }

        // --- Bill Payment Functions ---

        /**
         * Handles bill payment submission.
         * @param {Event} e - The form submission event.
         */
        if (billPaymentForm) {
            billPaymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!currentUser) {
                    showCustomModal('Error', 'Please log in to perform this action.');
                    return;
                }

                const billType = billTypeSelect.value;
                const billAccountNumber = billAccountNumberInput.value.trim();
                const amount = parseFloat(billAmountInput.value);

                if (isNaN(amount) || amount <= 0) {
                    showCustomModal('Invalid Amount', 'Please enter a valid amount greater than zero.');
                    return;
                }

                if (currentUser.balance < amount) {
                    showCustomModal('Insufficient Funds', 'You do not have enough balance to pay this bill.');
                    return;
                }

                currentUser.balance -= amount;
                const transactionDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

                currentUser.transactions.push({
                    id: Date.now(),
                    date: transactionDate,
                    type: "Debit",
                    description: `${billType.charAt(0).toUpperCase() + billType.slice(1)} Bill Payment (Acc: ${billAccountNumber})`,
                    amount: -amount
                });

                // Update the global users object and then persist to localStorage
                users[currentUser.username] = currentUser;
                localStorage.setItem('users', JSON.stringify(users));

                showCustomModal('Bill Paid', `$${amount.toFixed(2)} paid for ${billType} bill.`);
                billPaymentForm.reset();
                updateDashboard(); // Update dashboard after payment
            });
        }

        // --- Mini Statement Functions ---

        /**
         * Updates the mini statement table with all user transactions.
         */
        function updateMiniStatement() {
            if (!currentUser || !transactionsTableBody) return;

            transactionsTableBody.innerHTML = ''; // Clear previous entries

            if (currentUser.transactions.length === 0) {
                transactionsTableBody.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-gray-500">No transactions to display.</td></tr>';
                return;
            }

            // Sort transactions by date descending
            const sortedTransactions = [...currentUser.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

            sortedTransactions.forEach(transaction => {
                const row = document.createElement('tr');
                const amountColor = transaction.type === 'Credit' ? 'text-green-600' : 'text-red-600';
                const sign = transaction.type === 'Credit' ? '+' : '';
                row.innerHTML = `
                    <td class="py-3 px-4 whitespace-nowrap text-sm text-gray-800">${transaction.date}</td>
                    <td class="py-3 px-4 whitespace-nowrap text-sm text-gray-800">${transaction.type}</td>
                    <td class="py-3 px-4 whitespace-nowrap text-sm text-gray-800">${transaction.description}</td>
                    <td class="py-3 px-4 whitespace-nowrap text-sm text-right font-semibold ${amountColor}">${sign}$${Math.abs(transaction.amount).toFixed(2)}</td>
                `;
                transactionsTableBody.appendChild(row);
            });
        }

        // --- Loan Application Functions ---

        /**
         * Handles loan application submission.
         * @param {Event} e - The form submission event.
         */
        if (loanForm) {
            loanForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!currentUser) {
                    showCustomModal('Error', 'Please log in to perform this action.');
                    return;
                }

                const loanType = loanTypeSelect.value;
                const loanAmount = parseFloat(loanAmountInput.value);
                const loanDuration = parseInt(loanDurationInput.value);

                if (isNaN(loanAmount) || loanAmount <= 0 || isNaN(loanDuration) || loanDuration <= 0) {
                    showCustomModal('Invalid Input', 'Please enter valid loan amount and duration.');
                    return;
                }

                // Simulate loan application success
                showCustomModal('Loan Application Submitted', `Your application for a $${loanAmount.toFixed(2)} ${loanType} loan over ${loanDuration} months has been submitted successfully. We will review it shortly.`);
                loanForm.reset();
            });
        }

        // --- Profile Functions ---

        /**
         * Updates the user profile section.
         */
        function updateProfile() {
            if (!currentUser || !profileUsername || !profileAccountNumber || !profileEmail || !profilePhone) return;
            profileUsername.textContent = currentUser.username;
            profileAccountNumber.textContent = currentUser.accountNumber;
            profileEmail.textContent = currentUser.email;
            profilePhone.textContent = currentUser.phone;
        }

        // --- Event Listeners and Initial Load ---

        // Mobile menu toggle
        if (mobileMenuButton) {
            mobileMenuButton.addEventListener('click', () => {
                if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('hidden');
            });
        }

        if (closeMobileMenuButton) {
            closeMobileMenuButton.addEventListener('click', () => {
                if (mobileMenuOverlay) mobileMenuOverlay.classList.add('hidden');
            });
        }

        // Close modal when OK button is clicked
        if (customModalCloseButton) {
            customModalCloseButton.addEventListener('click', hideCustomModal);
        }
        // Close modal when clicking outside (on overlay)
        if (customModalOverlay) {
            customModalOverlay.addEventListener('click', (e) => {
                if (e.target === customModalOverlay) {
                    hideCustomModal();
                }
            });
        }


        /**
         * Initializes the application state on page load.
         */
        window.onload = function() {
            // Load users data from localStorage if available
            const storedUsers = localStorage.getItem('users');
            if (storedUsers) {
                Object.assign(users, JSON.parse(storedUsers));
            } else {
                localStorage.setItem('users', JSON.stringify(initialUsers));
            }

            // Attempt to retrieve logged-in user from localStorage
            const storedUser = localStorage.getItem('loggedInUser');

            console.log('Window loaded. Stored User:', storedUser);

            if (storedUser && users[storedUser]) {
                currentUser = users[storedUser];
                console.log('User logged in:', currentUser.username);
                updateNavigationBar();
                showSection('dashboard-section'); // Show dashboard if logged in
            } else {
                currentUser = null; // Ensure currentUser is null if not logged in
                console.log('No user logged in. Showing login section.');
                updateNavigationBar(); // Update navigation for logged-out state (hides nav)
                showSection('login-section'); // Show login if not logged in
            }
        };

        // Ensure responsiveness on window resize (CSS handles most, but good to have)
        window.addEventListener('resize', () => {
            // No specific JS resize logic needed for this layout, CSS handles it.
        });
