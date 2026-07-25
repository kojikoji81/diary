/* =========================================================
   2000年代初頭 個人テキストサイト / 個人日記風 JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    // 1. リアルタイム時計の更新
    updateClock();
    setInterval(updateClock, 1000);

    // 2. アクセスカウンターの初期化・更新
    initCounter();

    // 3. Web拍手ボタンイベントの登録
    initWebClap();

    // 4. おみくじ機能の初期化
    initOmikuji();
});

/**
 * リアルタイム時計（2000年代風フォーマット）
 */
function updateClock() {
    const clockElement = document.getElementById("digital-clock");
    if (!clockElement) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
    const day = dayNames[now.getDay()];

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    clockElement.textContent = `${year}/${month}/${date}(${day}) ${hours}:${minutes}:${seconds}`;
}

/**
 * アクセスカウンター（localStorage を利用した訪問カウント）
 */
function initCounter() {
    const counterElement = document.getElementById("counter-display");
    if (!counterElement) return;

    let count = parseInt(localStorage.getItem("retro_site_counter") || "1234");
    
    // セッションごとにカウントアップ（初回アクセス時）
    if (!sessionStorage.getItem("visited_session")) {
        count += 1;
        localStorage.setItem("retro_site_counter", count.toString());
        sessionStorage.setItem("visited_session", "true");
    }

    // 6桁0埋めで表示
    const formattedCount = String(count).padStart(6, "0");
    counterElement.textContent = formattedCount;

    // キリ番判定（100刻みなど）
    if (count % 100 === 0) {
        setTimeout(function() {
            alert(`【祝！】あなたは ${count} 人目のキリ番訪問者です！\nBBS（掲示板）でキリ番報告をお願いします（笑）`);
        }, 500);
    }
}

/**
 * Web拍手機能
 */
function initWebClap() {
    const clapBtn = document.getElementById("clap-btn");
    const clapCountEl = document.getElementById("clap-count-display");
    if (!clapBtn || !clapCountEl) return;

    let clapCount = parseInt(localStorage.getItem("web_clap_count") || "42");
    clapCountEl.textContent = clapCount;

    const clapMessages = [
        "拍手ありがとうございます！更新の励みになります(*^^*)",
        "パチパチありがとうございます！！これからも頑張ります（爆）",
        "拍手感謝です！相互リンクも随時募集中です〜！",
        "ポチッと拍手ありがとうございます！(マテ",
        "毎度おなじみ拍手感謝！また遊びに来てくださいね♪"
    ];

    clapBtn.addEventListener("click", function () {
        clapCount++;
        localStorage.setItem("web_clap_count", clapCount.toString());
        clapCountEl.textContent = clapCount;

        const randomMsg = clapMessages[Math.floor(Math.random() * clapMessages.length)];
        alert(`【Web拍手】\n${randomMsg}\n\n(累計拍手メッセージ数: ${clapCount})`);
    });
}

/**
 * レトロおみくじ機能
 */
function initOmikuji() {
    const omikujiBtn = document.getElementById("omikuji-btn");
    const resultEl = document.getElementById("omikuji-result");
    if (!omikujiBtn || !resultEl) return;

    const fortunes = [
        { rank: "超大吉 (大キリ番)", item: "10BASE-T LANケーブル", text: "今日はテレホタイムにISDNが最速で繋がります！" },
        { rank: "大吉", item: "3.5インチフロッピーディスク", text: "お気に入りのテキストサイトが更新されているかも！" },
        { rank: "中吉", item: "ボールマウス（裏の球体）", text: "掲示板で良いレスがもらえる予感（笑）" },
        { rank: "小吉", item: "CD-R 700MB", text: "Winampのスキン変更で気分転換がおすすめ！" },
        { rank: "吉", item: "テレホンカード (50度数)", text: "キリ番を踏めるかもしれない運勢です。" },
        { rank: "末吉", item: "ダイヤルアップ接続音", text: "夜更かししすぎて親に怒られないように注意！" },
        { rank: "凶", item: "ブラウザクラッシャー（未遂）", text: "リンクの踏み間違いに注意！Alt+F4の準備を（爆）" }
    ];

    omikujiBtn.addEventListener("click", function () {
        const picked = fortunes[Math.floor(Math.random() * fortunes.length)];
        resultEl.innerHTML = `<span style="color:#ffff00; font-weight:bold;">【${picked.rank}】</span><br>` +
                             `<span style="color:#00ffff;">ラッキーアイテム: ${picked.item}</span><br>` +
                             `<span style="color:#dddddd; font-size:11px;">${picked.text}</span>`;
    });
}

/**
 * キリ番報告ボタン
 */
function reportKiriban() {
    const currentCount = document.getElementById("counter-display") ? document.getElementById("counter-display").textContent : "001235";
    alert(`【キリ番報告】\n現在のカウント: ${currentCount}\nキリ番・前後賞をゲットされた方はBBSまたはWeb拍手よりご一報ください！`);
}
