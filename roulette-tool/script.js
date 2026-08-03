/*
========================================
授業用ルーレット
script.js

役割：
・ルーレット処理
・名前管理
・データ保存
・画面更新

========================================
*/


// ======================================
// グローバル変数
// ======================================

// ======================================
// 名前管理
// ======================================


// 登録された全員の名前
let names = [];


// 現在抽選対象になっている名前
let activeNames = [];


// 抽選履歴
let history = [];


// 除外設定
let removeWinner = false;

// Canvas関連
let canvas;
let ctx;


// 現在の回転角度
let currentAngle = 0;


// アニメーション管理
let animationId = null;


// 回転中かどうか
let isRunning = false;





// ======================================
// 初期処理
// ページ読み込み時に実行
// ======================================

function initialize(){


    // Canvas取得

    canvas = document.getElementById(
        "rouletteCanvas"
    );


    ctx = canvas.getContext("2d");



    // 保存データ読み込み

    loadData();



    // 初期表示

    updateDisplay();



    drawRoulette();



}






// ======================================
// LocalStorageからデータ取得
//
// ブラウザに保存した名前や履歴を復元する
// ======================================

function loadData(){


    const savedNames =
        localStorage.getItem(
            "rouletteNames"
        );


    const savedActiveNames =
        localStorage.getItem(
            "rouletteActiveNames"
        );


    const savedHistory =
        localStorage.getItem(
            "rouletteHistory"
        );


    const savedSetting =
        localStorage.getItem(
            "removeWinner"
        );



    if(savedNames){

        names =
            JSON.parse(savedNames);

    }



    if(savedActiveNames){

        activeNames =
            JSON.parse(savedActiveNames);

    }
    else{

        activeNames =
            [...names];

    }



    if(savedHistory){

        history =
            JSON.parse(savedHistory);

    }



    if(savedSetting){

        removeWinner =
            JSON.parse(savedSetting);

    }


}







// ======================================
// データ保存
//
// ブラウザを閉じても残る
// ======================================

function saveData(){


    localStorage.setItem(

        "rouletteNames",

        JSON.stringify(names)

    );



    localStorage.setItem(

        "rouletteActiveNames",

        JSON.stringify(activeNames)

    );



    localStorage.setItem(

        "rouletteHistory",

        JSON.stringify(history)

    );



    localStorage.setItem(

        "removeWinner",

        JSON.stringify(removeWinner)

    );


}







// ======================================
// 名前登録
//
// textareaから名前を取得する
// ======================================

function registerNames(){


    const input =
        document.getElementById(
            "nameInput"
        );



    // 改行で分割

    const inputNames =
        input.value.split("\n");



    // 空白行を削除

    const cleanNames =
        inputNames
        .map(name => name.trim())
        .filter(name => name !== "");



    // 追加

    names =
        names.concat(
            cleanNames
        );


    activeNames =
        [...names];

    saveData();


    updateDisplay();


    drawRoulette();



    // 入力欄クリア

    input.value = "";

}







// ======================================
// ルーレット開始
//
// 回転処理を開始する
// ======================================

function startRoulette(){


    if(names.length === 0){

        alert(
            "名前を登録してください"
        );

        return;

    }



    if(isRunning){

        return;

    }



    isRunning = true;



    const duration =

        2000 +
        Math.random()*3000;



    const startTime =
        Date.now();



    const startAngle =
        currentAngle;



    // 最終回転量

    const rotateAmount =

        Math.PI * 2 *

        (5 + Math.random()*5);




    function animate(){


        const now =
            Date.now();



        const progress =

            (now-startTime)
            /
            duration;



        if(progress < 1){


            /*
            easeOut

            最初は速い
            最後はゆっくり

            */

            const ease =

                1-Math.pow(
                    1-progress,
                    3
                );



            currentAngle =

                startAngle +

                rotateAmount *

                ease;



            drawRoulette();



            animationId =
                requestAnimationFrame(
                    animate
                );



        }else{


            stopRoulette();


        }


    }


    animate();


}







// ======================================
// ルーレット描画
//
// Canvasに円盤を描く
// ======================================

function drawRoulette(){


    if(!ctx){

        return;

    }



    ctx.clearRect(

        0,
        0,
        canvas.width,
        canvas.height

    );



    const centerX =
        canvas.width / 2;


    const centerY =
        canvas.height / 2;



    const radius =
        canvas.width / 2 - 10;




    ctx.save();



    // 回転

    ctx.translate(
        centerX,
        centerY
    );


    ctx.rotate(
        currentAngle
    );


    ctx.translate(
        -centerX,
        -centerY
    );



    const count =
        activeNames.length || 1;



    const angle =
        Math.PI*2/count;



    for(let i=0;i<count;i++){



        const start =
            i*angle;



        const end =
            start+angle;



        // 扇形

        ctx.beginPath();

        ctx.moveTo(
            centerX,
            centerY
        );

        ctx.arc(

            centerX,
            centerY,
            radius,
            start,
            end

        );


        ctx.closePath();



        // ======================================
        // ルーレット色設定
        //
        // 人数ごとに違う色を割り当てる
        // ======================================

        const colors = [

            "#42A5F5",
            "#66BB6A",
            "#FFA726",
            "#EF5350",
            "#AB47BC",
            "#26C6DA",
            "#FFCA28",
            "#8D6E63",
            "#EC407A",
            "#78909C"

        ];


        // 色を順番に設定

        ctx.fillStyle =

            colors[i % colors.length];


        ctx.fill();
        // ======================================
        // 扇形の境界線
        // ======================================

        ctx.strokeStyle = "#ffffff";

        ctx.lineWidth = 3;

        ctx.stroke();


        // 名前

        ctx.save();



        ctx.translate(

            centerX,
            centerY

        );


        ctx.rotate(

            start+angle/2

        );


        ctx.textAlign =
            "right";


        ctx.fillStyle =
            "#333";


        ctx.font =
            "24px sans-serif";


        ctx.fillText(

            activeNames[i] || "",

            radius-20,

            8

        );



        ctx.restore();


    }



    ctx.restore();

}






// ======================================
// 停止処理
//
// 実際のルーレット位置から
// 当選者を計算する
// ======================================

function stopRoulette(){


    isRunning = false;


    cancelAnimationFrame(
        animationId
    );



    /*
    1人あたりの角度

    円360度を人数で割る
    */

    const anglePerPerson =

        (Math.PI * 2)
        /
        names.length;




    /*
    矢印は上を指しているため

    現在の回転角度から
    逆算する

    */

    let normalizedAngle =

        currentAngle %
        (Math.PI * 2);



    if(normalizedAngle < 0){

        normalizedAngle +=
            Math.PI * 2;

    }




    /*
    上方向の補正

    Canvasは0度が右方向なので
    90度分ずらす

    */

    const pointerAngle =

        (
            Math.PI * 1.5
            -
            normalizedAngle
        )
        %
        (Math.PI * 2);




    let index =

        Math.floor(

            pointerAngle /
            anglePerPerson

        );



    /*
    計算結果調整

    */

    index =

        index % names.length;



    const winner =

        activeNames[index];




    // 結果表示

    document.getElementById(
        "winner"
    )
    .textContent = winner;




    // 履歴追加

    history.push({

        number:
            history.length + 1,

        name:
            winner

    });

    // ======================================
    // 当選者除外処理
    // ======================================

    if(removeWinner){


        activeNames =
            activeNames.filter(

                name =>
                name !== winner

            );


    }

    saveData();


    updateHistory();


}







// ======================================
// 履歴更新
// ======================================

function updateHistory(){


    const list =
        document.getElementById(
            "historyList"
        );



    list.innerHTML = "";



    history.forEach(item=>{


        const li =
            document.createElement(
                "li"
            );


        li.textContent =

            item.number +
            "回目　" +
            item.name;



        list.appendChild(li);


    });


}







// ======================================
// 表示更新
// ======================================

function updateDisplay(){


    document.getElementById(

        "memberCount"

    ).textContent =

        names.length;



    updateHistory();

}


function updateDisplay(){

    document.getElementById(
        "memberCount"
    ).textContent =
        names.length;

    updateHistory();

}

// ======================================
// 除外状態リセット
//
// 除外された人を全員戻す
// ======================================

function resetRoulette(){


    activeNames =
        [...names];


    saveData();


    drawRoulette();


    updateDisplay();


}


// ======================================
// 初期起動
// ======================================

window.onload =
    initialize;



// ======================================
// ボタンイベント
// ======================================


document
.getElementById(
    "registerButton"
)
.addEventListener(

    "click",

    registerNames

);



document
.getElementById(
    "startButton"
)
.addEventListener(

    "click",

    startRoulette

);



document
.getElementById(
    "deleteButton"
)
.addEventListener(

    "click",

    function(){

        names=[];

        history=[];

        saveData();

        updateDisplay();

        drawRoulette();

    }

);

// ======================================
// 当選者除外チェックボックス
// ON/OFFを保存する
// ======================================

document
.getElementById(
    "removeWinnerCheckbox"
)
.addEventListener(

    "change",

    function(){

        removeWinner = this.checked;

        saveData();

    }

);

// ======================================
// リセットボタン
// ======================================

document
.getElementById(
    "resetButton"
)
.addEventListener(

    "click",

    resetRoulette

);