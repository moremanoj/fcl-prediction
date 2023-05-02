const teams = require('./teams.json')

function getCombinations(arr) {
    var combi = [];
    var temp = [];
    var slent = Math.pow(2, arr.length);
    for (let i = 0; i < slent; i++) {
        temp = [];
        for (let j = 0; j < arr.length; j++) {
            if (i & Math.pow(2, j)) {
                temp.push(arr[j]);
            }
        }
        if (temp.length == 7) {
            combi.push(temp);
        }
    }
    combi.sort((a, b) => a.length - b.length)
    return combi;
}

function getCVC(x, y) {

    if (playerPos(x,y)) {
        return false
    } else if (x.C > 7 && (y.VC < 7 && y.VC >= 1)) {
        return true
    } else if ((x.C < 7 && x.C >= 1) && y.VC > 7) {
        return true
    } else {
        return false
    }
}

function validCriteria(arr) {
    const abv80 = arr.filter((a) => a.selected > 80).length == 3;
    const rng60to80 = arr.filter((a) => a.selected < 80 && a.selected > 60).length == 3;
    const rng30to60 = arr.filter((a) => a.selected < 60 && a.selected > 30).length <= 4;
    const belw30 = arr.filter((a) => a.selected < 30).length >= 1;
    if (abv80 && rng60to80 && rng30to60 && belw30) {
        return true
    } else {
        return false
    }
}

function mustpickCriteria(arr) {
    const mustpicks = arr.filter((ply) => ply.mustpick == true)
    if (mustpicks.length < 7) {
        return false
    } else {
        return true
    }
}

function CVCMustpick(x, y) {
    if (x.mustpick == true && y.mustpick !== true) {
        return true
    } else if (x.mustpick !== true && y.mustpick == true) {
        return true
    } else {
        return false
    }
}

function getTeams(a, b) {
    return { team1: teams[a], team2: teams[b] };
}
function playerPos(x, y) {
    if (
        (x.pos === 'opening bowl' && y.pos === 'opening bat') ||
        (x.pos === 'opening bat' && y.pos === 'opening bowl')
    ) {
        return true
    } else {
        return false
    }
}
module.exports = function (A, B) {

    console.log("Predicting for Team: ", A, B);
    const { team1, team2 } = getTeams(A, B);
    // const wkts = getCombinations(team1.wkt.concat(team2.wkt));
    // const bats = getCombinations(team1.wkt.concat(team2.wkt));
    // const alls = getCombinations(team1.wkt.concat(team2.wkt));
    // const bowls = getCombinations(team1.wkt.concat(team2.wkt));

    const C = [...team1.wkt, ...team1.bat, ...team1.all, ...team1.bowl, ...team2.wkt, ...team2.bat, ...team2.all, ...team2.bowl];


    const abv50 = C.filter(x => x.selected > 49);
    const avgabv50 = getCombinations(abv50);
    // console.log(avgabv50.length);

    // players with high selection value and less selection of c & vc

    const lessCVC = abv50.filter(x => x.C < 7 || x.VC < 7);
    console.log("players with selection greater and less CVC : ", lessCVC.length);
    // select regular CVC only
    let cvc = [];
    for (let i = 0; i < C.length; i++) {
        for (let j = 0; j < C.length; j++) {
            if (i !== j) {
                if (getCVC(C[i], C[j])) {
                    cvc.push([C[i], C[j]])
                }
            }
        }
    }

    // select special CVC considering 50% abv with less cvc value

    let smallcvc = [];
    for (let i = 0; i < abv50.length; i++) {
        for (let j = 0; j < abv50.length; j++) {
            if (i !== j && getCVC(abv50[i], abv50[j])) {
                smallcvc.push([abv50[i], abv50[j]])
            }
        }
    }


    console.log("Total abv 50% players: ", abv50.length);
    console.log("Total combination Of abv 50% : ", avgabv50.length);

    console.log("Total abv 50% players with Less CVC combi is : ", smallcvc.length);
    // console.log(cvc);
    console.log("Total combination CVC for 1 team: ", cvc.length);
    return { total: smallcvc.length, result: smallcvc }
}("LKN","CHE")
// ("DC", "SRH");
// main("CHE", "RR");