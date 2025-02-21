// Game variables
let balance = 300;        // Starting balance in dollars
let bitcoinValue = 250;   // Starting Bitcoin value
let bitcoinAmount = 0;    // Amount of Bitcoin owned
let bitcoinHistory = [];  // Array to store Bitcoin value over time
let trend = 0;            // Tracks the current trend (positive or negative)
let multiplier = 1;       // Multiplier for Bitcoin gains (upgrades)
let autoBuyEnabled = false; // Auto-buy upgrade
let autoSellEnabled = false; // Auto-sell upgrade
let bitcoinMinerEnabled = false; // Bitcoin Miner upgrade
let priceStabilizerEnabled = false; // Price Stabilizer upgrade
let luckyDipEnabled = false; // Lucky Dip upgrade
let bitcoinLotteryEnabled = false; // Random Multiplier
let bitcoinCloudMiningEnabled = false; // Passive BTC
let bitcoinATMEnabled = false;     // Passive Income
let bitcoinHalvingEnabled = false; // 4x Multiplier

// Upgrade costs
const upgradeCosts = {
    
    "2x": 5000,
    "autoBuy": 6500,
    "autoSell": 8500,
    "bitcoinMiner": 10000,
    "priceStabilizer": 15000,
    "luckyDip": 20000,
    "bitcoinLottery": 50000,
    "bitcoinCloudMining": 80000,
    "bitcoinATM": 65000,
    "bitcoinHalving": 650000, // New
};

// Select HTML elements
const balanceDisplay = document.getElementById("balance");
const bitcoinValueDisplay = document.getElementById("bitcoinValue");
const bitcoinAmountDisplay = document.getElementById("bitcoinAmount");
const profitLossDisplay = document.getElementById("profitLoss");
const buy1Button = document.getElementById("buy1Button");
const buy5Button = document.getElementById("buy5Button");
const buy10Button = document.getElementById("buy10Button");
const buy50Button = document.getElementById("buy50Button");
const buy100Button = document.getElementById("buy100Button");
const buyButton = document.getElementById("buyButton");
const sellButton = document.getElementById("sellButton");
const upgrade2x = document.getElementById("upgrade2x");
const upgradeAutoBuy = document.getElementById("upgradeAutoBuy");
const upgradeAutoSell = document.getElementById("upgradeAutoSell");
const upgradeBitcoinMiner = document.getElementById("upgradeBitcoinMiner");
const upgradePriceStabilizer = document.getElementById("upgradePriceStabilizer");
const upgradeLuckyDip = document.getElementById("upgradeLuckyDip");
const chartCanvas = document.getElementById("chart");
const chartCtx = chartCanvas.getContext("2d");

// Set canvas resolution for better quality
chartCanvas.width = chartCanvas.offsetWidth;
chartCanvas.height = 300;

// Achievements
const achievements = {
    first1000: { earned: false, message: "Earned your first $1,000!" },
    firstBTC: { earned: false, message: "Bought your first Bitcoin!" },
    rich: { earned: false, message: "Became a Bitcoin millionaire!" },
};

function checkDailyReward() {
    const lastLogin = localStorage.getItem("lastLogin");
    const today = new Date().toDateString();

    if (lastLogin !== today) {
        const reward = 100; // Daily reward amount
        balance += reward;
        updateGame();
        showFeedback(`Daily Reward: $${reward} added to your balance!`);
        localStorage.setItem("lastLogin", today);
    }
}

function startGame() {
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    initGame();
}

function checkAchievements() {
    if (balance >= 1000 && !achievements.first1000.earned) {
        achievements.first1000.earned = true;
        showFeedback(achievements.first1000.message);
    }
    if (bitcoinAmount >= 1 && !achievements.firstBTC.earned) {
        achievements.firstBTC.earned = true;
        showFeedback(achievements.firstBTC.message);
    }
    if (balance >= 1000000 && !achievements.rich.earned) {
        achievements.rich.earned = true;
        showFeedback(achievements.rich.message);
    }
}

// Call this function whenever the game state updates
checkAchievements();

// Sound effects
const buySound = document.getElementById("buySound");
const sellSound = document.getElementById("sellSound");
const upgradeSound = document.getElementById("upgradeSound");
const profitSound = document.getElementById("profitSound");
const lossSound = document.getElementById("lossSound");

// Buy Bitcoin function
function buyBitcoin(amount) {
    const cost = amount * Math.floor(bitcoinValue); // Use integer value
    if (balance >= cost) {
        bitcoinAmount += amount;
        balance -= cost;
        updateGame();
        saveGame();
        showFeedback(`Bought ${amount} BTC for $${cost}!`); // No decimals
        buySound.play();
    } else {
        showFeedback("Not enough balance to buy BTC!");
    }
}

function sellBitcoin() {
    if (bitcoinAmount > 0) {
        const totalValue = bitcoinAmount * Math.floor(bitcoinValue) * multiplier; // Use integer value
        balance += totalValue;
        bitcoinAmount = 0;
        updateGame();
        saveGame();
        showFeedback(`Sold all BTC for $${totalValue}!`); // No decimals
        sellSound.play();
        if (totalValue > 1000) showConfetti();
    } else {
        showFeedback("No BTC to sell!");
    }
}



// Auto-Buy logic
setInterval(() => {
    if (autoBuyEnabled && balance >= bitcoinValue) {
        buyBitcoin(1);
    }
}, 5000);

// Auto-Sell logic
setInterval(() => {
    if (autoSellEnabled && bitcoinAmount > 0 && bitcoinValue >= 400) {
        sellBitcoin();
    }
}, 5000);

// Bitcoin Miner logic
setInterval(() => {
    if (bitcoinMinerEnabled) {
        balance += 100;
        updateGame();
    }
}, 10000);

// Lucky Dip logic
setInterval(() => {
    if (luckyDipEnabled && Math.random() < 0.1) { // 10% chance
        bitcoinValue *= 1.5; // Increase Bitcoin value by 50%
        showFeedback("Lucky Dip! Bitcoin value increased by 50%!");
    }
}, 30000);

// Upgrade functions
upgrade2x.addEventListener("click", () => {
    if (balance >= upgradeCosts["2x"]) {
        balance -= upgradeCosts["2x"];
        multiplier *= 2;
        upgrade2x.classList.add("disabled");
        updateGame();
        saveGame();
        showFeedback(`Upgraded to 2x multiplier!`);
        upgradeSound.play();
    } else {
        showFeedback("Not enough balance to buy upgrade!");
    }
});

upgradeAutoBuy.addEventListener("click", () => {
    if (balance >= upgradeCosts["autoBuy"]) {
        balance -= upgradeCosts["autoBuy"];
        autoBuyEnabled = true;
        upgradeAutoBuy.classList.add("disabled");
        updateGame();
        saveGame();
        showFeedback(`Auto-Buy enabled!`);
        upgradeSound.play();
    } else {
        showFeedback("Not enough balance to buy upgrade!");
    }
});

upgradeAutoSell.addEventListener("click", () => {
    if (balance >= upgradeCosts["autoSell"]) {
        balance -= upgradeCosts["autoSell"];
        autoSellEnabled = true;
        upgradeAutoSell.classList.add("disabled");
        updateGame();
        saveGame();
        showFeedback(`Auto-Sell enabled!`);
        upgradeSound.play();
    } else {
        showFeedback("Not enough balance to buy upgrade!");
    }
});

upgradeBitcoinMiner.addEventListener("click", () => {
    if (balance >= upgradeCosts["bitcoinMiner"]) {
        balance -= upgradeCosts["bitcoinMiner"];
        bitcoinMinerEnabled = true;
        upgradeBitcoinMiner.classList.add("disabled");
        updateGame();
        saveGame();
        showFeedback(`Bitcoin Miner enabled!`);
        upgradeSound.play();
    } else {
        showFeedback("Not enough balance to buy upgrade!");
    }
});

upgradePriceStabilizer.addEventListener("click", () => {
    if (balance >= upgradeCosts["priceStabilizer"]) {
        balance -= upgradeCosts["priceStabilizer"];
        priceStabilizerEnabled = true;
        upgradePriceStabilizer.classList.add("disabled");
        updateGame();
        saveGame();
        showFeedback(`Price Stabilizer enabled!`);
        upgradeSound.play();
    } else {
        showFeedback("Not enough balance to buy upgrade!");
    }
});

upgradeLuckyDip.addEventListener("click", () => {
    if (balance >= upgradeCosts["luckyDip"]) {
        balance -= upgradeCosts["luckyDip"];
        luckyDipEnabled = true;
        upgradeLuckyDip.classList.add("disabled");
        updateGame();
        saveGame();
        showFeedback(`Lucky Dip enabled!`);
        upgradeSound.play();
    } else {
        showFeedback("Not enough balance to buy upgrade!");
    }
});

// Update the game UI
function updateGame() {
    // Round balance, Bitcoin value, and Bitcoin amount to integers
    balanceDisplay.textContent = Math.floor(balance); // Remove decimals
    bitcoinValueDisplay.textContent = Math.floor(bitcoinValue); // Remove decimals
    bitcoinAmountDisplay.textContent = Math.floor(bitcoinAmount); // Remove decimals

    // Calculate potential profit/loss and round it
    const profitLoss = (bitcoinAmount * bitcoinValue * multiplier) - (balance + bitcoinAmount * bitcoinValue - 300);
    profitLossDisplay.textContent = `${profitLoss >= 0 ? "+" : "-"}$${Math.floor(Math.abs(profitLoss))}`; // Remove decimals
    profitLossDisplay.style.color = profitLoss >= 0 ? "#26de76" : "#ce4b58"; // Green for profit, red for loss

    // Enable/disable upgrades
    upgrade2x.disabled = balance < upgradeCosts["2x"];
    upgradeAutoBuy.disabled = balance < upgradeCosts["autoBuy"];
    upgradeAutoSell.disabled = balance < upgradeCosts["autoSell"];
    upgradeBitcoinMiner.disabled = balance < upgradeCosts["bitcoinMiner"];
    upgradePriceStabilizer.disabled = balance < upgradeCosts["priceStabilizer"];
    upgradeLuckyDip.disabled = balance < upgradeCosts["luckyDip"];
}

// Generate new Bitcoin value
function updateBitcoinValue() {

    function updateBitcoinValue() {
        const change = (Math.random() - 0.5) * 10; // Reduced volatility (smaller range)
        bitcoinValue += change;
    
        // Add rare spikes and crashes
        const rareEvent = Math.random();
        if (rareEvent < 0.01) bitcoinValue = 600; // 1% chance for spike
        if (rareEvent > 0.99) bitcoinValue = 45; // 1% chance for crash
    
        // Ensure Bitcoin value stays within reasonable bounds
        if (bitcoinValue < 50) bitcoinValue = 50; // Minimum value
        if (bitcoinValue > 1000) bitcoinValue = 1000; // Maximum value
    
        // Update the game UI
        updateGame();
    }
    
    // Update Bitcoin value every 2 seconds (slower updates)
    setInterval(updateBitcoinValue, 2000);

    const resistanceFactor = Math.max(0, (bitcoinValue - 400) / 20);
    const resistance = resistanceFactor * 10;

    const supportFactor = Math.max(0, (80 - bitcoinValue) / 20);
    const support = supportFactor * 10;

    const change = (Math.random() * 50 - 25) + trend - resistance + support;
    bitcoinValue = Math.max(60, Math.min(420, bitcoinValue + change));

    trend += Math.random() * 4 - 2;
    trend = Math.max(-10, Math.min(10, trend));

    bitcoinHistory.push(bitcoinValue);
    if (bitcoinHistory.length > 20) bitcoinHistory.shift();

    updateGame();
    drawChart();
}

// Draw the Bitcoin value chart
function drawChart() {
    chartCtx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

    // Add a background color
    chartCtx.fillStyle = "#1e1e2f"; // Dark background
    chartCtx.fillRect(0, 0, chartCanvas.width, chartCanvas.height);

    // Draw subtle grid lines
    chartCtx.strokeStyle = "rgba(255, 255, 255, 0.1)"; // Light grid lines
    chartCtx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
        const y = (i / 10) * chartCanvas.height;
        chartCtx.beginPath();
        chartCtx.moveTo(0, y);
        chartCtx.lineTo(chartCanvas.width, y);
        chartCtx.stroke();
    }

    // Draw the Bitcoin value line
    chartCtx.beginPath();
    chartCtx.strokeStyle = "#26de76"; // Bright green line
    chartCtx.lineWidth = 3; // Thicker line
    chartCtx.lineJoin = "round";
    chartCtx.lineCap = "round";

    bitcoinHistory.forEach((value, index) => {
        const x = (index / 20) * chartCanvas.width;
        const y = chartCanvas.height - ((value - 60) / (420 - 60)) * chartCanvas.height;
        if (index === 0) {
            chartCtx.moveTo(x, y);
        } else {
            chartCtx.lineTo(x, y);
        }
    });

    chartCtx.stroke();
}

buy1Button.addEventListener("click", () => buyBitcoin(1));
buy5Button.addEventListener("click", () => buyBitcoin(5));
buy10Button.addEventListener("click", () => buyBitcoin(10));
buy50Button.addEventListener("click", () => buyBitcoin(50));
buy100Button.addEventListener("click", () => buyBitcoin(100));
buyButton.addEventListener("click", () => buyBitcoin(1));
sellButton.addEventListener("click", sellBitcoin);

// Show feedback messages
function showFeedback(message) {
    const feedback = document.createElement("div");
    feedback.textContent = message;
    feedback.style.position = "fixed";
    feedback.style.bottom = "20px";
    feedback.style.left = "50%";
    feedback.style.transform = "translateX(-50%)";
    feedback.style.backgroundColor = "#333";
    feedback.style.color = "#fff";
    feedback.style.padding = "10px 20px";
    feedback.style.borderRadius = "5px";
    feedback.style.zIndex = "1000";
    feedback.style.animation = "fadeInOut 2s";
    document.body.appendChild(feedback);

    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

// Show confetti effect
function showConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
    });
}

// Initialize game
function initGame() {
    setInterval(updateBitcoinValue, 100); // Update Bitcoin value every 100ms
    setInterval(updateGame, 1000); // Update profit/loss every second
    updateGame(); // Initial UI update
}

function saveGame() {
    const gameState = {
        balance: Math.floor(balance),
        bitcoinValue: Math.floor(bitcoinValue),
        bitcoinAmount: Math.floor(bitcoinAmount),
        bitcoinHistory: bitcoinHistory.map(value => Math.floor(value)),
        trend,
        multiplier,
        autoBuyEnabled,
        autoSellEnabled,
        bitcoinMinerEnabled,
        priceStabilizerEnabled,
        luckyDipEnabled,
        achievements,
        // Save upgrade states
        upgrades: {
            upgrade2x: upgrade2x.classList.contains("disabled"),
            upgradeAutoBuy: upgradeAutoBuy.classList.contains("disabled"),
            upgradeAutoSell: upgradeAutoSell.classList.contains("disabled"),
            upgradeBitcoinMiner: upgradeBitcoinMiner.classList.contains("disabled"),
            upgradePriceStabilizer: upgradePriceStabilizer.classList.contains("disabled"),
            upgradeLuckyDip: upgradeLuckyDip.classList.contains("disabled"),
        },
    };
    localStorage.setItem("bitcoinBlitzSave", JSON.stringify(gameState));
    console.log("Game saved automatically!");
}

function loadGame() {
    const savedGame = localStorage.getItem("bitcoinBlitzSave");
    if (savedGame) {
        const gameState = JSON.parse(savedGame);

        // Restore game variables
        balance = gameState.balance;
        bitcoinValue = gameState.bitcoinValue;
        bitcoinAmount = gameState.bitcoinAmount;
        bitcoinHistory = gameState.bitcoinHistory;
        trend = gameState.trend;
        multiplier = gameState.multiplier;
        autoBuyEnabled = gameState.autoBuyEnabled;
        autoSellEnabled = gameState.autoSellEnabled;
        bitcoinMinerEnabled = gameState.bitcoinMinerEnabled;
        priceStabilizerEnabled = gameState.priceStabilizerEnabled;
        luckyDipEnabled = gameState.luckyDipEnabled;
        achievements = gameState.achievements;

        // Restore upgrade states
        if (gameState.upgrades) {
            if (gameState.upgrades.upgrade2x) upgrade2x.classList.add("disabled");
            if (gameState.upgrades.upgradeAutoBuy) upgradeAutoBuy.classList.add("disabled");
            if (gameState.upgrades.upgradeAutoSell) upgradeAutoSell.classList.add("disabled");
            if (gameState.upgrades.upgradeBitcoinMiner) upgradeBitcoinMiner.classList.add("disabled");
            if (gameState.upgrades.upgradePriceStabilizer) upgradePriceStabilizer.classList.add("disabled");
            if (gameState.upgrades.upgradeLuckyDip) upgradeLuckyDip.classList.add("disabled");
        }

        // Update UI
        updateGame();
        drawChart();
        console.log("Game loaded automatically!");
    } else {
        console.log("No save data found. Starting a new game.");
    }
}

function startGame() {
    // Hide the welcome screen and show the game container
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";

    // Initialize the game first
    initGame();

    // Load the saved game state after initialization
    loadGame();
}
function toggleNightMode() {
    document.body.classList.toggle("night-mode");
}

document.addEventListener('dblclick', function (event) {
    event.preventDefault(); // Prevent default double-tap behavior
}, { passive: false });


// Bitcoin Halving (4x Multiplier)
upgradeBitcoinHalving.addEventListener("click", () => {
    if (balance >= upgradeCosts["bitcoinHalving"]) {
        balance -= upgradeCosts["bitcoinHalving"];
        multiplier *= 2; // Double the multiplier again (2x -> 4x)
        upgradeBitcoinHalving.classList.add("disabled");
        updateGame();
        saveGame();
        showFeedback("Bitcoin Halving enabled! Profits are now 4x!");
        upgradeSound.play();
    } else {
        showFeedback("Not enough balance to buy this upgrade!");
    }
});

upgradeBitcoinATM.addEventListener("click", () => {
    if (balance >= upgradeCosts["bitcoinATM"]) {
        balance -= upgradeCosts["bitcoinATM"];
        bitcoinATMEnabled = true;
        upgradeBitcoinATM.classList.add("disabled");
        updateGame();
        saveGame();
        showFeedback("Bitcoin ATM enabled! Generate $500 every 30 seconds.");
        upgradeSound.play();
    } else {
        showFeedback("Not enough balance to buy this upgrade!");
    }
});

upgradeBitcoinLottery.addEventListener("click", () => {
    if (balance >= upgradeCosts["bitcoinLottery"]) {
        balance -= upgradeCosts["bitcoinLottery"];
        bitcoinLotteryEnabled = true;
        upgradeBitcoinLottery.classList.add("disabled");
        updateGame();
        saveGame();
        showFeedback("Bitcoin Lottery enabled! Randomly multiply BTC value by 1x to 10x every 5 minutes.");
        upgradeSound.play();
    } else {
        showFeedback("Not enough balance to buy this upgrade!");
    }
});

upgradeBitcoinCloudMining.addEventListener("click", () => {
    if (balance >= upgradeCosts["bitcoinCloudMining"]) {
        balance -= upgradeCosts["bitcoinCloudMining"];
        bitcoinCloudMiningEnabled = true;
        upgradeBitcoinCloudMining.classList.add("disabled");
        updateGame();
        saveGame();
        showFeedback("Bitcoin Cloud Mining enabled! Generate 0.01 BTC every minute.");
        upgradeSound.play();
    } else {
        showFeedback("Not enough balance to buy this upgrade!");
    }
});

// Bitcoin ATM (Passive Income)
setInterval(() => {
    if (bitcoinATMEnabled) {
        balance += 500; // Generate $500 every 30 seconds
        updateGame();
    }
}, 30000);

// Bitcoin Lottery (Random Multiplier)
setInterval(() => {
    if (bitcoinLotteryEnabled && Math.random() < 0.2) { // 20% chance every 5 minutes
        const randomMultiplier = 1 + Math.random() * 9; // 1x to 10x
        bitcoinValue *= randomMultiplier;
        showFeedback(`Bitcoin Lottery! BTC value multiplied by ${randomMultiplier.toFixed(2)}x!`);
    }
}, 300000); // Every 5 minutes

// Bitcoin Cloud Mining (Passive BTC)
setInterval(() => {
    if (bitcoinCloudMiningEnabled) {
        bitcoinAmount += 0.01; // Generate 0.01 BTC every minute
        updateGame();
    }
}, 60000);

