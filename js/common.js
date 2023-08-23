let student_type = "Strikers"
let raid = "Goz"
let terrain = "Indoor"


json_list = {
    tierlist: "./data/tierlist.json",
    students: "./data/students.json"
}
html_list = {
    raidtl: "./html/raidtl.html",
    raid_rankings: "./html/raid_rankings.html"
}
let data = {}
let loadPromise = loadJSON(Object.assign(json_list), result => {
    data = result
})

function loadJSON(list, success) {
    let results = {}

    let loadPromise = Object.entries(list).map(function (el) {
        return $.getJSON(el[1], function (result) {
            results[el[0]] = result
        })
    })

    return Promise.all(loadPromise).then(function () {
        success(results)
    })
}

function toggleStudentType() {
    if (student_type == "Strikers") {
        student_type = "Specials"
    }
    else {
        student_type = "Strikers"
    }
    buildTierList()
}

function toggleTerrainType() {
    if (raid == 'Goz') {
        terrain = "Indoor"
    }
    else if (raid == 'ShiroKuro') {
        if (terrain == "Indoor") {
            terrain = "Urban"
        }
        else {
            terrain = "Indoor"
        }
    }
    else if (raid == 'Hieronymus') {
        if (terrain == "Indoor") {
            terrain = "Urban"
        }
        else {
            terrain = "Indoor"
        }
    }
    else if (raid == 'Perorozilla') {
        if (terrain == "Outdoor") {
            terrain = "Indoor"
        }
        else {
            terrain = "Outdoor"
        }
    }
    else if (raid == 'Binah') {
        if (terrain == "Outdoor") {
            terrain = "Urban"
        }
        else {
            terrain = "Outdoor"
        }
    }
    else if (raid == 'Hod') {
        if (terrain == "Urban") {
            terrain = "Indoor"
        }
        else {
            terrain = "Urban"
        }
    }
    else if (raid == 'Chesed') {
        if (terrain == "Outdoor") {
            terrain = "Indoor"
        }
        else {
            terrain = "Outdoor"
        }
    }
    else if (raid == 'Kaiten') {
        if (terrain == "Outdoor") {
            terrain = "Urban"
        }
        else {
            terrain = "Outdoor"
        }
    }
    buildTierList()
}

function getAllStudentReportCards() {
    let rankings = {}
    let current_reportcard
    for (let i = 0; i < data.students.length; i++) {
        current_reportcard = getStudentReportCard(data.students[i]["PathName"])
        rankings[data.students[i]["Name"]] = {
            Score: calculateStudentReportCardScore(current_reportcard),
            Name: data.students[i]["PathName"],
            ReportCard: current_reportcard
        }
    }

    var keyValueArray = Object.entries(rankings).map(([key, value]) => ({ key, value }));

    // Sort the array by value in ascending order
    keyValueArray.sort(function (a, b) {
        return b.value["Score"] - a.value["Score"];
    });
    return keyValueArray
}

function getAllStrikerStudentReportCards() {
    let rankings = {}
    for (let i = 0; i < data.students.length; i++) {
        if (data.students[i]["SquadType"] == "Main") {
            rankings[data.students[i]["PathName"]] = calculateStudentReportCardScore(getStudentReportCard(data.students[i]["PathName"]))
        }
    }

    var keyValueArray = Object.entries(rankings).map(([key, value]) => ({ key, value }));

    // Sort the array by value in ascending order
    keyValueArray.sort(function (a, b) {
        return b.value - a.value;
    });
}

function getAllSpecialStudentReportCards() {
    let rankings = {}
    for (let i = 0; i < data.students.length; i++) {
        if (data.students[i]["SquadType"] == "Support") {
            rankings[data.students[i]["PathName"]] = calculateStudentReportCardScore(getStudentReportCard(data.students[i]["PathName"]))
        }
    }

    var keyValueArray = Object.entries(rankings).map(([key, value]) => ({ key, value }));

    // Sort the array by value in ascending order
    keyValueArray.sort(function (a, b) {
        return a.value - b.value;
    });
}

function getStudentReportCard(student_name) {
    report_card = []
    let tierlist = data.tierlist[0]
    let found = false
    for (var raid in tierlist) {
        raid = tierlist[raid]
        for (var terrain in raid) {
            terrain = raid[terrain]
            found = false
            for (var type in terrain) {
                type = terrain[type]
                for (var tier in type) {
                    current_tier = type[tier]
                    for (let i = 0; i < current_tier.length; i++) {
                        if (current_tier[i] == student_name) {
                            found = true
                            report_card.push(tier)
                        }
                    }
                }
            }
            if (!found) {
                report_card.push(null)
            }
        }
    }
    return report_card
}

function calculateStudentReportCardScore(report_card) {
    let score = 0
    for (let i = 0; i < report_card.length; i++) {
        if (report_card[i] == 'S+') {
            score += 10
        }
        else if (report_card[i] == 'S') {
            score += 8
        }
        else if (report_card[i] == 'A') {
            score += 6
        }
        else if (report_card[i] == 'B') {
            score += 4
        }
        else if (report_card[i] == 'C') {
            score += 2
        }
    }
    return score
}

function buildTierList() {
    let html = ``
    $("#bl-raidtl-title").html("Insane " + raid + " " + terrain + " " + student_type)
    tierlist = data.tierlist[0][raid][terrain][student_type]
    tier_SP = tierlist["S+"]
    tier_S = tierlist["S"]
    tier_A = tierlist["A"]
    tier_B = tierlist["B"]
    tier_C = tierlist["C"]
    for (let i = 0; i < tier_SP.length; i++) {
        html += `
            <img class="bl-raidtl-student" style="height:120px" src="images/student/Student_Portrait_${tier_SP[i].toLowerCase()}_Collection.png">`
    }
    $("#bl-tier-sp-list").html(html)
    html = ``
    for (let i = 0; i < tier_S.length; i++) {
        html += `
            <img class="bl-raidtl-student" style="height:120px" src="images/student/Student_Portrait_${tier_S[i].toLowerCase()}_Collection.png">`
    }
    $("#bl-tier-s-list").html(html)
    html = ``
    for (let i = 0; i < tier_A.length; i++) {
        html += `
            <img class="bl-raidtl-student" style="height:120px" src="images/student/Student_Portrait_${tier_A[i].toLowerCase()}_Collection.png">`
    }
    $("#bl-tier-a-list").html(html)
    html = ``
    for (let i = 0; i < tier_B.length; i++) {
        html += `
            <img class="bl-raidtl-student" style="height:120px" src="images/student/Student_Portrait_${tier_B[i].toLowerCase()}_Collection.png">`
    }
    $("#bl-tier-b-list").html(html)
    html = ``
    for (let i = 0; i < tier_C.length; i++) {
        html += `
            <img class="bl-raidtl-student" style="height:120px" src="images/student/Student_Portrait_${tier_C[i].toLowerCase()}_Collection.png">`
    }
    $("#bl-tier-c-list").html(html)
    html = ``
}

function buildRankings() {
    rankings = getAllStudentReportCards()
    let html = ``
    for (let i = 0; i < rankings.length; i++) {
        temp_reportcard = getRankingsReportCardArray(rankings[i]["value"]["ReportCard"])
        console.log(temp_reportcard)
        html += `<div id="bl-raid-rankings-card" class="d-flex justify-content-center" style="margin-bottom:15px;">
        <span class="d-flex justify-content-center ranking-card-font"
            style="font-size:72px;width:180px;color:white; align-items:center;text-align:center">${i + 1}</span>
        <div class="card justify-content-center d-flex"
            style="border-radius: 20px;flex-direction:row;background-color:var(--col-ranking-card);padding:10px;width:470px;height:220px;">
            <div class="d-flex"style="align-items:center;">
            <img class="bl-raidtl-student ranking-card-font" style="border-radius:15px;height:165px;margin-left:10px;"
                src="images/student/Student_Portrait_${rankings[i]['value']["Name"]}_Collection.png">
            </div>
            <div class="d-flex flex-column justify-content-center" style="flex-basis:80%;">
                <div class="d-flex justify-content-center" style="height:50px;">
                    <span class="ranking-card-font" style="font-size:40px;color:white;${rankings[i]['key'].length > 11 ? 'font-size:24px;' : ''}" text-align:center">${rankings[i]['key']}</span>
                </div>
                <div style="padding-right:20px;padding-left:20px;"
                    class="d-flex flex-column justify-content-center">
                    <div class="d-flex" style="flex-direction: row;">
                        <span class="ranking-card-font"style="font-size: 24px; color: white; text-align: left;">Score:</span>
                        <span class="ranking-card-font" style="font-size: 24px; color: white; text-align: right; margin-left: auto;">${rankings[i]['value']["Score"] * 10}</span>
                    </div>
                    <div class="d-flex justify-content-center" style="margin-top:5px;" style="flex-direction: row;">
                    <img class="rankings-card-badge" style="margin-left:0px" src="images/icons/${temp_reportcard[0]}_Badge.png">
                    <img class="rankings-card-badge"src="images/icons/${temp_reportcard[1]}_Badge.png">
                    <img class="rankings-card-badge"src="images/icons/${temp_reportcard[2]}_Badge.png">
                    <img class="rankings-card-badge" style="margin-right:0px" src="images/icons/${temp_reportcard[3]}_Badge.png">
                </div>
                <div class="d-flex justify-content-center" style="flex-direction: row;">
                    <img class="rankings-card-badge" style="margin-left:0px" src="images/icons/${temp_reportcard[4]}_Badge.png">
                    <img class="rankings-card-badge"src="images/icons/${temp_reportcard[5]}_Badge.png">
                    <img class="rankings-card-badge"src="images/icons/${temp_reportcard[6]}_Badge.png">
                    <img class="rankings-card-badge" style="margin-right:0px" src="images/icons/${temp_reportcard[7]}_Badge.png">
                </div>
                </div>
            </div>
        </div>
    </div>`
    }
    $("#bl-raid-rankings-card-container").html(html)
}

function getRankingsReportCardArray(report_card) {
    let new_reportcard = []
    let result1
    let result2
    new_reportcard.push(report_card[0])
    for (let j = 1; j < report_card.length - 1; j = j + 2) {
        result1 = 0
        result2 = 0
        if (report_card[j] != null) {
            for (let i = 0; i < report_card[j].length; i++) {
                let charCode = report_card[j].charCodeAt(i)
                result1 = result1 * 10 + charCode
            }
        }
        if (report_card[j + 1] != null) {
            for (let i = 0; i < report_card[j + 1].length; i++) {
                let charCode = report_card[j + 1].charCodeAt(i)
                result2 = result2 * 10 + charCode
            }
        }
        if (result1 > result2) {
            new_reportcard.push(report_card[j])
        }
        else {
            new_reportcard.push(report_card[j + 1])
        }
    }
    return new_reportcard
}


function loadModule(moduleName, entry = null) {
    if (moduleName == 'raidtl') {
        $("#bl-loaded-module").load(html_list['raidtl'], function () {
            const student_type_toggle = document.getElementById('bl-raid-studenttype-toggle')
            const terrain_toggle = document.getElementById('bl-raid-terrain-toggle')

            student_type_toggle.addEventListener('change', function () {
                if (this.checked) {
                    toggleStudentType()
                }
                else {
                    toggleStudentType()
                }
            })

            terrain_toggle.addEventListener('change', function () {
                if (this.checked) {
                    toggleTerrainType()
                }
                else {
                    toggleTerrainType()
                }
            })
            setTimeout(() => buildTierList(), 500)
            setTimeout(() => getAllSpecialStudentReportCards(), 2000)
            setTimeout(() => getAllStrikerStudentReportCards(), 2000)
        })

    }
    if (moduleName == 'raid_rankings') {
        $("#bl-loaded-module").load(html_list['raid_rankings'], function () {
            // buildRankings()
        })
    }
}

var bgimg = new Image()
bgimg.src = `background.jpg`
bgimg.onload = function () {
    $("#bl-background").css('background-image', `url('${bgimg.src}')`)
}
loadModule("raidtl")
