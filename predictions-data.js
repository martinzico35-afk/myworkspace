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
    },
    // ===== 5 ODDS (4.0 - 6.5) =====
    {
        id: "seed-8",
        match: "Tottenham vs Manchester United",
        prediction: "Both Teams to Score & Over 2.5",
        odds: "4.50",
        league: "Premier League",
        writeup: "Tottenham's high-press game against United's vulnerable backline guarantees goals. Both sides have been leaking chances, and with key attackers in form, this has all the makings of a goal-fest at the Tottenham Hotspur Stadium.",
        date: getRelativeDateStr(0), // Today
        status: "Pending"
    },
    {
        id: "seed-9",
        match: "AS Roma vs Lazio",
        prediction: "Roma Win & Over 1.5 Goals",
        odds: "5.00",
        league: "Serie A",
        writeup: "The Derby della Capitale at the Stadio Olimpico is always fiercely contested. Roma's home form has been exceptional this season, and with Dybala pulling the strings in midfield, they should edge past their city rivals in a match that produces goals.",
        date: getRelativeDateStr(0), // Today
        status: "Pending"
    },
    {
        id: "seed-10",
        match: "Benfica vs Porto",
        prediction: "Draw No Bet - Benfica",
        odds: "5.80",
        league: "Primeira Liga",
        writeup: "O Clássico in Portugal is often decided by fine margins. Benfica have been dominant at the Estádio da Luz, and with Porto struggling with injuries in defence, the Eagles have a strong chance to claim all three points.",
        date: getRelativeDateStr(0), // Today
        status: "Pending"
    },
    // ===== 10 ODDS (6.5 - 15.0) =====
    {
        id: "seed-11",
        match: "West Ham vs Liverpool",
        prediction: "West Ham Double Chance & BTTS",
        odds: "8.50",
        league: "Premier League",
        writeup: "West Ham at the London Stadium have proven to be giant killers this season. Liverpool's away form has been shaky, and with the Hammers' physical approach and set-piece threat, they can at least avoid defeat in a game where both sides score.",
        date: getRelativeDateStr(0), // Today
        status: "Pending"
    },
    {
        id: "seed-12",
        match: "Lyon vs Paris Saint-Germain",
        prediction: "Lyon to Win",
        odds: "10.00",
        league: "Ligue 1",
        writeup: "PSG's away record against top Ligue 1 sides has been unconvincing despite their star power. Lyon have built a formidable home record with their high-energy press, and catching PSG on an off day could yield a massive upset at the Groupama Stadium.",
        date: getRelativeDateStr(1), // Yesterday
        status: "Won"
    },
    {
        id: "seed-13",
        match: "Sevilla vs Barcelona",
        prediction: "Sevilla Win & Under 3.5 Goals",
        odds: "12.00",
        league: "La Liga",
        writeup: "The Ramón Sánchez Pizjuán is one of the toughest grounds in Spain. Sevilla's defensive organization under pressure has been elite, and Barcelona's recent struggles away from home against physical sides make this a prime candidate for a home upset.",
        date: getRelativeDateStr(0), // Today
        status: "Pending"
    },
    {
        id: "seed-14",
        match: "Ajax vs Feyenoord",
        prediction: "Correct Score 2-1",
        odds: "14.00",
        league: "Eredivisie",
        writeup: "De Klassieker always delivers drama. Ajax's attacking flair at the Johan Cruijff ArenA combined with Feyenoord's counter-attacking threat suggests a 2-1 scoreline is the most likely outcome in this historic rivalry.",
        date: getRelativeDateStr(2), // 2 days ago
        status: "Lost"
    },
    // ===== 50+ ODDS (15.0+) =====
    {
        id: "seed-15",
        match: "Sheriff Tiraspol vs Real Madrid",
        prediction: "Sheriff Tiraspol to Win",
        odds: "18.00",
        league: "Champions League",
        writeup: "History has shown that Champions League nights can produce miracles. Sheriff's artificial turf and compact defensive setup have troubled top sides before. With Real Madrid having one eye on the weekend El Clásico, a shock result isn't out of the question.",
        date: getRelativeDateStr(0), // Today
        status: "Pending"
    },
    {
        id: "seed-16",
        match: "Accra Lions vs Asante Kotoko",
        prediction: "Accra Lions to Win 3-0",
        odds: "25.00",
        league: "Ghana Premier League",
        writeup: "Accra Lions have been unbeaten at home for months, dominating possession and creating numerous chances. Kotoko's travel fatigue and defensive injuries could lead to a comprehensive home victory with a clean sheet.",
        date: getRelativeDateStr(0), // Today
        status: "Pending"
    },
    {
        id: "seed-17",
        match: "St. Pauli vs Bayern Munich",
        prediction: "St. Pauli Double Chance & BTTS",
        odds: "35.00",
        league: "Bundesliga",
        writeup: "The Millerntor Stadium is a fortress where bigger teams have struggled. St. Pauli's passionate home crowd and aggressive pressing style could trouble a Bayern side that often rotates ahead of Champions League fixtures.",
        date: getRelativeDateStr(3), // 3 days ago
        status: "Lost"
    },
    {
        id: "seed-18",
        match: "Cork City vs Shamrock Rovers",
        prediction: "Cork City to Win 2-0",
        odds: "50.00",
        league: "League of Ireland",
        writeup: "Cork City's recent form at Turner's Cross has been incredible, keeping four consecutive clean sheets. Shamrock Rovers are in a poor run of form, and the home advantage combined with Cork's defensive solidity could produce a surprise result.",
        date: getRelativeDateStr(0), // Today
        status: "Pending"
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
