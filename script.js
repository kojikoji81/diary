/* =========================================================
   2000年代初頭 個人テキストサイト / kojikoji81の日記 JavaScript
   ========================================================= */

let allPosts = [];
let currentCalendarDate = new Date(); // カレンダー表示用
let selectedFilterDate = null;       // 選択された日付フィルター (YYYY-MM-DD)

document.addEventListener("DOMContentLoaded", function () {
    // 1. リアルタイム時計の更新
    updateClock();
    setInterval(updateClock, 1000);

    // 2. アクセスカウンターの初期化・更新
    initCounter();

    // 3. おみくじ機能の初期化
    initOmikuji();

    // 4. posts.json から日記データを読み込んで描画 & カレンダー構築
    loadDiaryPosts();
});

/**
 * posts.json から日記データを読み込んで描画する
 */
function loadDiaryPosts() {
    const container = document.getElementById("diary-posts-container");
    if (!container) return;

    fetch("posts.json?t=" + new Date().getTime()) // キャッシュ対策
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(posts => {
            allPosts = Array.isArray(posts) ? posts : [];
            
            // カレンダーを生成
            renderCalendar();

            // 日記一覧を描画
            renderDiaryPosts();
        })
        .catch(err => {
            console.error("日記の読み込みに失敗しました:", err);
        });
}

/**
 * 日記エントリーの描画（フィルター適用対応）
 */
function renderDiaryPosts() {
    const container = document.getElementById("diary-posts-container");
    if (!container) return;

    let displayPosts = allPosts;

    if (selectedFilterDate) {
        displayPosts = allPosts.filter(p => p.date === selectedFilterDate);
    }

    let filterBarHtml = "";
    if (selectedFilterDate) {
        filterBarHtml = `
            <div class="filter-info-bar">
                <span>📅 <strong>${selectedFilterDate}</strong> の日記 (${displayPosts.length}件)</span>
                <button class="reset-filter-btn" onclick="resetDiaryFilter()">全記事を表示</button>
            </div>
        `;
    }

    if (displayPosts.length === 0) {
        container.innerHTML = filterBarHtml + `
            <div style="color:#aaaaaa; padding:20px 10px; text-align:center; border:1px dashed #444;">
                ${selectedFilterDate ? `「${selectedFilterDate}」の日記はありません。` : '記事がまだありません。'}
            </div>
        `;
        return;
    }

    let html = filterBarHtml;
    displayPosts.forEach(post => {
        const paragraphs = Array.isArray(post.content) 
            ? post.content.map(p => `<p>${p}</p>`).join("")
            : `<p>${post.content}</p>`;

        const tagHtml = post.tag ? `<span class="entry-tag">${post.tag}</span>` : '';
        const displayDateStr = post.displayDate || post.date;

        html += `
        <div class="diary-entry">
            <div class="entry-header">
                <span class="entry-date-title">${escapeHtml(displayDateStr)} 「${escapeHtml(post.title)}」</span>
                ${tagHtml}
            </div>
            <div class="entry-body">
                ${paragraphs}
            </div>
        </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * 日付選択によるフィルター
 */
function filterDiaryByDate(dateStr) {
    selectedFilterDate = dateStr;
    renderCalendar();
    renderDiaryPosts();
}

/**
 * フィルター解除（全件表示）
 */
function resetDiaryFilter() {
    selectedFilterDate = null;
    renderCalendar();
    renderDiaryPosts();
}

/**
 * アメブロ風カレンダーの描画
 */
function renderCalendar() {
    const widgetContainer = document.getElementById("calendar-widget");
    if (!widgetContainer) return;

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth(); // 0-11

    // 今日の日付を取得
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // 記事が存在する日付のSetを作成 (YYYY-MM-DD)
    const postDatesSet = new Set(allPosts.map(p => p.date));

    // 月の最初の日と最後の日を取得
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDay.getDay(); // 0:日, 1:月...
    const totalDays = lastDay.getDate();

    let html = `
        <div class="calendar-header">
            <button class="calendar-nav-btn" onclick="changeCalendarMonth(-1)">&lt; 前月</button>
            <span>${year}年 ${month + 1}月</span>
            <button class="calendar-nav-btn" onclick="changeCalendarMonth(1)">翌月 &gt;</button>
        </div>
        <table class="calendar-table">
            <thead>
                <tr>
                    <th class="sun">日</th>
                    <th>月</th>
                    <th>火</th>
                    <th>水</th>
                    <th>木</th>
                    <th>金</th>
                    <th class="sat">土</th>
                </tr>
            </thead>
            <tbody>
    `;

    let dayCounter = 1;
    const totalRows = Math.ceil((firstDayOfWeek + totalDays) / 7);

    for (let r = 0; r < totalRows; r++) {
        html += "<tr>";
        for (let c = 0; c < 7; c++) {
            if ((r === 0 && c < firstDayOfWeek) || dayCounter > totalDays) {
                html += "<td></td>";
            } else {
                const dateNumStr = String(dayCounter).padStart(2, "0");
                const monthNumStr = String(month + 1).padStart(2, "0");
                const formattedDate = `${year}-${monthNumStr}-${dateNumStr}`;

                const hasPost = postDatesSet.has(formattedDate);
                const isSelected = selectedFilterDate === formattedDate;
                const isToday = todayStr === formattedDate;

                let classes = [];
                if (c === 0) classes.push("sun");
                if (c === 6) classes.push("sat");
                if (hasPost) classes.push("has-post");
                if (isSelected) classes.push("selected-day");
                if (isToday) classes.push("today-cell");

                const classAttr = classes.length > 0 ? `class="${classes.join(" ")}"` : "";
                const clickAttr = hasPost ? `onclick="filterDiaryByDate('${formattedDate}')"` : "";

                html += `<td ${classAttr} ${clickAttr}>${dayCounter}</td>`;
                dayCounter++;
            }
        }
        html += "</tr>";
    }

    html += `
            </tbody>
        </table>
    `;

    widgetContainer.innerHTML = html;
}

/**
 * 月の変更 (< 前月 / 翌月 >)
 */
function changeCalendarMonth(offset) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + offset);
    renderCalendar();
}

/**
 * エスケープ処理
 */
function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * リアルタイム時計
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
 * アクセスカウンター（純粋な訪問カウント表示のみ）
 */
function initCounter() {
    const counterElement = document.getElementById("counter-display");
    if (!counterElement) return;

    let count = parseInt(localStorage.getItem("kojikoji81_diary_counter") || "1234");
    
    if (!sessionStorage.getItem("visited_session")) {
        count += 1;
        localStorage.setItem("kojikoji81_diary_counter", count.toString());
        sessionStorage.setItem("visited_session", "true");
    }

    const formattedCount = String(count).padStart(6, "0");
    counterElement.textContent = formattedCount;
}

/**
 * レトロおみくじ
 */
function initOmikuji() {
    const omikujiBtn = document.getElementById("omikuji-btn");
    const resultEl = document.getElementById("omikuji-result");
    if (!omikujiBtn || !resultEl) return;

    const fortunes = [
        { rank: "超大吉", item: "10BASE-T LANケーブル", text: "今日は最速の回線速度でネットサーフィンできます！" },
        { rank: "大吉", item: "3.5インチフロッピーディスク", text: "今日のお買い物や作業が順調に進む予感！" },
        { rank: "中吉", item: "ボールマウス（裏の球体）", text: "良いことがある予感（笑）" },
        { rank: "小吉", item: "CD-R 700MB", text: "好きな音楽を聴いてリフレッシュがおすすめ！" },
        { rank: "吉", item: "テレホンカード (50度数)", text: "穏やかな一日を過ごせそうです。" },
        { rank: "末吉", item: "ダイヤルアップ接続音", text: "夜更かししすぎに注意！" },
        { rank: "凶", item: "ブラウザクラッシャー（未遂）", text: "タイポやミスに気をつけて（爆）" }
    ];

    omikujiBtn.addEventListener("click", function () {
        const picked = fortunes[Math.floor(Math.random() * fortunes.length)];
        resultEl.innerHTML = `<span style="color:#ffff00; font-weight:bold;">【${picked.rank}】</span><br>` +
                             `<span style="color:#00ffff;">ラッキーアイテム: ${picked.item}</span><br>` +
                             `<span style="color:#dddddd; font-size:11px;">${picked.text}</span>`;
    });
}
