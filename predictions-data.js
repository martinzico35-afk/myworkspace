// Shared Client-Side Data Helper for Zeepredict

// Generates dynamic dates relative to today
var getRelativeDateStr = function(daysAgo) {
    var d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
};

// Migrate old localStorage data to new format (runs once)
(function migrateOldData() {
    var oldData = localStorage.getItem('zeepredict_tips');
    if (oldData) {
        try {
            var oldTips = JSON.parse(oldData);
            if (Array.isArray(oldTips) && oldTips.length > 0) {
                var userTips = JSON.parse(localStorage.getItem('zeepredict_user_tips') || '[]');
                oldTips.forEach(function(tip) {
                    if (!tip.id) tip.id = 'user-' + Date.now() + Math.random().toString(36).substr(2, 5);
                    userTips.push(tip);
                });
                localStorage.setItem('zeepredict_user_tips', JSON.stringify(userTips));
            }
            // Remove old key after migration
            localStorage.removeItem('zeepredict_tips');
        } catch(e) { /* ignore parse errors */ }
    }
})();

var SEED_TIPS = [
    {
        id: "seed-1",
        match: "Liverpool vs Aston Villa",
        prediction: "Over 2.5 Goals",
        odds: "1.65",
        league: "Premier League",
        writeup: "Both teams boast incredible attacking output while showing vulnerability in transition. Villa's high defensive line will be tested by Salah's pace, leading to a high-scoring game at Anfield.",
        date: getRelativeDateStr(0), // Today
        status: "Pending"
    },
    {
        id: "seed-2",
        match: "AC Milan vs Inter Milan",
        prediction: "Inter Milan Win",
        odds: "1.95",
        league: "Serie A",
        writeup: "Inter has dominated the recent Derby della Madonnina matchups. Their midfield superiority and tactical cohesion give them a major advantage over Milan, who are struggling with defensive consistency.",
        date: getRelativeDateStr(0), // Today
        status: "Pending"
    },
    {
        id: "seed-3",
        match: "Bayern Munich vs Borussia Dortmund",
        prediction: "Bayern Win & BTTS",
        odds: "2.40",
        league: "Bundesliga",
        writeup: "Der Klassiker at the Allianz Arena historically promises goals. Bayern's attacking fluidity at home is unmatched, but Dortmund's recent scoring streak ensures they will get on the scoresheet.",
        date: getRelativeDateStr(0), // Today
        status: "Pending"
    },
    {
        id: "seed-4",
        match: "Real Madrid vs Barcelona",
        prediction: "Real Madrid Win",
        odds: "2.10",
        league: "La Liga",
        writeup: "Real Madrid's form at the Bernabéu has been spectacular. With Barcelona suffering from key defensive suspensions, Madrid's counter-attacking speed led by Vinícius and Bellingham should prove decisive.",
        date: getRelativeDateStr(1), // Yesterday
        status: "Won"
    },
    {
        id: "seed-5",
        match: "Manchester City vs Paris Saint-Germain",
        prediction: "Man City Win",
        odds: "1.80",
        league: "Champions League",
        writeup: "City has been formidable at home, maintaining an long unbeaten home run in Europe. With their controlled possession game, they are expected to choke out PSG's midfield and secure the victory.",
        date: getRelativeDateStr(2), // 2 days ago
        status: "Won"
    },
    {
        id: "seed-6",
        match: "Arsenal vs Chelsea",
        prediction: "Draw",
        odds: "3.40",
        league: "Premier League",
        writeup: "London derbies are notoriously tight. Chelsea's defensive organization in big away games has improved, and Arsenal might find it hard to break them down, leading to a hard-fought draw.",
        date: getRelativeDateStr(3), // 3 days ago
        status: "Won"
    },
    {
        id: "seed-7",
        match: "Juventus vs Napoli",
        prediction: "Under 1.5 Goals",
        odds: "2.85",
        league: "Serie A",
        writeup: "Both teams have played extremely defensive football in recent matches. Expect a highly tactical, cagey affair with minimal risks taken in front of goal.",
        date: getRelativeDateStr(4), // 4 days ago
        status: "Lost"
    }
];

// Load overrides and user tips from localStorage
function getSeedOverrides() {
    return JSON.parse(localStorage.getItem('zeepredict_seed_overrides') || '{}');
}

function saveSeedOverrides(overrides) {
    localStorage.setItem('zeepredict_seed_overrides', JSON.stringify(overrides));
}

function getDeletedSeeds() {
    return JSON.parse(localStorage.getItem('zeepredict_deleted_seeds') || '[]');
}

function saveDeletedSeeds(deleted) {
    localStorage.setItem('zeepredict_deleted_seeds', JSON.stringify(deleted));
}

function getUserTips() {
    return JSON.parse(localStorage.getItem('zeepredict_user_tips') || '[]');
}

function saveUserTips(tips) {
    localStorage.setItem('zeepredict_user_tips', JSON.stringify(tips));
}

// Expose public API functions
window.PredictionDB = {
    // Retrieves merged list of tips, sorted by date (newest first)
    getTips: function() {
        const userTips = getUserTips();
        const seedOverrides = getSeedOverrides();
        const deletedSeeds = getDeletedSeeds();

        // Process seed tips: apply overrides, filter out deleted ones
        const processedSeeds = SEED_TIPS
            .filter(seed => !deletedSeeds.includes(seed.id))
            .map(seed => {
                const override = seedOverrides[seed.id] || {};
                return { ...seed, ...override };
            });

        // Merge and sort by date descending
        return [...userTips, ...processedSeeds].sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    // Add a new tip (always user tip)
    addTip: function(tipData) {
        var userTips = getUserTips();
        var newTip = {
            id: 'user-' + Date.now(),
            match: tipData.match,
            prediction: tipData.prediction,
            odds: tipData.odds || '1.00',
            league: tipData.league || 'Other',
            writeup: tipData.writeup || '',
            matchDate: tipData.matchDate || null,
            date: new Date().toISOString(),
            status: tipData.status || 'Pending'
        };
        userTips.unshift(newTip);
        saveUserTips(userTips);
        return newTip;
    },

    // Delete a tip
    deleteTip: function(id) {
        if (id.startsWith('seed-')) {
            // Add to deleted seeds list
            const deleted = getDeletedSeeds();
            if (!deleted.includes(id)) {
                deleted.push(id);
                saveDeletedSeeds(deleted);
            }
        } else {
            // Delete from user tips
            let userTips = getUserTips();
            userTips = userTips.filter(t => t.id !== id);
            saveUserTips(userTips);
        }
    },

    // Update status (Won, Lost, Pending)
    updateTipStatus: function(id, status) {
        if (id.startsWith('seed-')) {
            const overrides = getSeedOverrides();
            if (!overrides[id]) overrides[id] = {};
            overrides[id].status = status;
            saveSeedOverrides(overrides);
        } else {
            const userTips = getUserTips();
            const tip = userTips.find(t => t.id === id);
            if (tip) {
                tip.status = status;
                saveUserTips(userTips);
            }
        }
    },

    // Get win rate statistics
    getWinRateStats: function() {
        const allTips = this.getTips();
        const resolvedTips = allTips.filter(t => t.status === 'Won' || t.status === 'Lost');
        const wonTips = resolvedTips.filter(t => t.status === 'Won');

        const totalTips = allTips.length;
        const resolvedCount = resolvedTips.length;
        const wonCount = wonTips.length;
        const winRate = resolvedCount > 0 ? Math.round((wonCount / resolvedCount) * 100) : 0;

        // Calculate average odds of all tips
        const totalOdds = allTips.reduce((sum, t) => sum + parseFloat(t.odds || 1), 0);
        const avgOdds = totalTips > 0 ? (totalOdds / totalTips).toFixed(2) : '0.00';

        return {
            totalTips,
            winRate,
            resolvedCount,
            wonCount,
            avgOdds
        };
    }
};
