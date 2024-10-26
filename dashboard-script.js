import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPItqOyLf6D3RqZbbppV8yvvVjb7XKRwk",
  authDomain: "proplecoin.firebaseapp.com",
  projectId: "proplecoin",
  storageBucket: "proplecoin.appspot.com",
  messagingSenderId: "975447426127",
  appId: "1:975447426127:web:1ecb3dd40c58f6c7aad63a",
  measurementId: "G-5TS5ED159S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');
    const referralLinkElement = document.getElementById('referralLink');
    const copyReferralLinkButton = document.getElementById('copyReferralLink');
    const referralCountElement = document.getElementById('referralCount');

    // Setup logout functionality
    logoutButton.addEventListener('click', () => {
        signOut(auth).then(() => {
            console.log('User signed out');
            window.location.href = 'index.html';
        }).catch((error) => {
            console.error('Sign out error:', error);
        });
    });

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("User is signed in:", user);
            await setupDashboard(user);
        } else {
            console.log("User is signed out");
            window.location.href = 'index.html';
        }
    });

    async function setupDashboard(user) {
        // Set user name
        const userNameElement = document.querySelector('.user-profile span');
        if (userNameElement) {
            userNameElement.textContent = user.email;
        }

        // Setup referral program
        const userId = user.uid;
        const referralLink = `https://yourwebsite.com/signup?ref=${userId}`;
        if (referralLinkElement) {
            referralLinkElement.textContent = referralLink;
        }

        if (copyReferralLinkButton) {
            copyReferralLinkButton.addEventListener('click', () => {
                navigator.clipboard.writeText(referralLink).then(() => {
                    alert('Referral link copied to clipboard!');
                });
            });
        }

        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                referralCount: 0
            });
        }

        const referralCount = userDoc.data()?.referralCount || 0;
        if (referralCountElement) {
            referralCountElement.textContent = referralCount;
        }

        // Here you can add more functions to populate other parts of the dashboard
        // For example:
        // await loadWalletData(userId);
        // await loadTransactionHistory(userId);
        // setupCharts();

        setupBinanceWallet();

        setupProupleChart();

        // ... rest of your existing code ...
    }

    // Example function to load wallet data
    // async function loadWalletData(userId) {
    //     // Fetch wallet data from Firestore and update the UI
    // }

    // Example function to load transaction history
    // async function loadTransactionHistory(userId) {
    //     // Fetch transaction history from Firestore and update the UI
    // }

    // Example function to setup charts
    // function setupCharts() {
    //     // Use a charting library like Chart.js to create charts
    // }
});

// Function to handle new user signup with referral
export async function signUpWithReferral(newUserId, referrerId) {
    if (referrerId) {
        const referrerDocRef = doc(db, 'users', referrerId);
        await updateDoc(referrerDocRef, {
            referralCount: increment(1)
        });
    }
}

function setupBinanceWallet() {
    const connectBinanceBtn = document.getElementById('connectBinance');
    const binanceBalance = document.getElementById('binanceBalance');
    const binanceWalletCard = document.getElementById('binanceWalletCard');

    if (!connectBinanceBtn) {
        console.error('Connect Binance button not found');
        return;
    }

    connectBinanceBtn.addEventListener('click', async () => {
        console.log('Connect Binance button clicked');

        if (typeof window.BinanceChain !== 'undefined') {
            console.log('Binance Chain Wallet detected');
            try {
                console.log('Requesting account access...');
                const accounts = await window.BinanceChain.request({ method: 'eth_requestAccounts' });
                console.log('Accounts received:', accounts);

                if (accounts.length > 0) {
                    const account = accounts[0];
                    console.log('Connected account:', account);

                    try {
                        console.log('Requesting balance...');
                        const balance = await window.BinanceChain.request({
                            method: 'eth_getBalance',
                            params: [account, 'latest']
                        });
                        console.log('Balance received:', balance);

                        const bnbBalance = parseInt(balance, 16) / 1e18;
                        console.log('BNB Balance:', bnbBalance);

                        binanceBalance.textContent = `${bnbBalance.toFixed(4)} BNB`;
                        connectBinanceBtn.textContent = 'Connected';
                        connectBinanceBtn.disabled = true;

                        const walletStatus = document.createElement('div');
                        walletStatus.className = 'wallet-status';
                        walletStatus.textContent = `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`;
                        binanceWalletCard.appendChild(walletStatus);
                        walletStatus.style.display = 'block';
                    } catch (balanceError) {
                        console.error('Error fetching balance:', balanceError);
                        binanceBalance.textContent = 'Error fetching balance';
                    }
                } else {
                    console.error('No accounts found');
                    binanceBalance.textContent = 'No accounts found';
                }
            } catch (error) {
                console.error('Error connecting to Binance Chain Wallet:', error);
                binanceBalance.textContent = 'Connection failed';
            }
        } else {
            console.log('Binance Chain Wallet not detected');
            binanceBalance.textContent = 'Wallet not installed';
            connectBinanceBtn.textContent = 'Install Wallet';
            connectBinanceBtn.addEventListener('click', () => {
                window.open('https://www.binance.org/en/binance-wallet', '_blank');
            }, { once: true });
        }
    });
}

function setupProupleChart() {
    console.log("Setting up Prouple Chart");
    const ctx = document.getElementById('proupleChart');
    if (!ctx) {
        console.error("Could not find proupleChart canvas element");
        return;
    }
    console.log("Canvas element found");

    const initialData = Array(100).fill(0).map(() => Math.random() * 100);

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(100).fill(''),
            datasets: [{
                label: 'Prouple Price',
                data: initialData,
                borderColor: function(context) {
                    const index = context.dataIndex;
                    const value = context.dataset.data[index];
                    const previousValue = context.dataset.data[index - 1];
                    return index === 0 || value >= previousValue ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)';
                },
                segment: {
                    borderColor: function(context) {
                        return context.p0.parsed.y <= context.p1.parsed.y ? 
                            'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)';
                    }
                },
                tension: 0.1,
                pointRadius: 0,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: false
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'white'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            },
            animation: {
                duration: 0
            }
        }
    });

    console.log("Chart created");

    function addData() {
        const lastValue = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1];
        const newValue = lastValue + (Math.random() - 0.5) * 10;
        chart.data.datasets[0].data.push(newValue);
        chart.data.datasets[0].data.shift();
        chart.update();
    }

    // Update the chart every 100ms
    setInterval(addData, 100);
}

// Make sure this function is called after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    setupBinanceWallet();
    setupProupleChart();
});

// If you're using Firebase authentication, make sure to call setupProupleChart in your auth state change listener
// For example:
// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         console.log("User is signed in, setting up dashboard");
//         setupDashboard(user);
//         setupProupleChart();
//     } else {
//         // ... handle signed out state
//     }
// });

// Add this after your existing code
document.addEventListener('DOMContentLoaded', function() {
    const coin = document.getElementById('clickableCoin');
    const tokenBalanceElement = document.getElementById('tokenBalance');
    let tokenBalance = 0;

    if (coin && tokenBalanceElement) {
        coin.addEventListener('click', function(e) {
            // Update token balance
            tokenBalance++;
            tokenBalanceElement.textContent = `${tokenBalance} PRPL`;

            // Create and position the +1 element
            const newPlusOne = document.createElement('span');
            newPlusOne.className = 'plus-one';
            newPlusOne.textContent = '+1';
            
            // Get click position relative to coin container
            const rect = coin.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            newPlusOne.style.position = 'absolute';
            newPlusOne.style.left = `${x}px`;
            newPlusOne.style.top = `${y}px`;
            newPlusOne.style.animation = 'floatUp 1s ease-out forwards';

            // Add to container
            coin.parentElement.appendChild(newPlusOne);

            // Remove after animation
            setTimeout(() => {
                newPlusOne.remove();
            }, 1000);

            // Coin click animation
            coin.style.transform = 'scale(0.95)';
            setTimeout(() => {
                coin.style.transform = 'scale(1)';
            }, 100);

            // Save to Firebase if needed
            if (auth.currentUser) {
                updateTokenBalance(auth.currentUser.uid, tokenBalance);
            }
        });
    } else {
        console.error('Required elements not found:', {
            coin: !!coin,
            tokenBalance: !!tokenBalanceElement
        });
    }

    // Add console logs to debug
    console.log('Coin element:', document.getElementById('clickableCoin'));
    console.log('Token balance element:', document.getElementById('tokenBalance'));
});

// Add this function to save the token balance to Firebase
async function updateTokenBalance(userId, newBalance) {
    try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
            tokenBalance: newBalance
        });
    } catch (error) {
        console.error('Error updating token balance:', error);
    }
}
