/* =========================================================
   2000年代初頭 個人テキストサイト / kojikoji81の日記 JavaScript
   ========================================================= */

let postDatesList = [];              // 存在する記事の日付リスト (例: ["2026-07-25"])
let currentCalendarDate = new Date(); // カレンダー表示用
let selectedFilterDate = null;       // 選択された日付フィルター (YYYY-MM-DD)

document.addEventListener("DOMContentLoaded", function () {
    // posts/index.json から日付一覧を読み込んで描画 & カレンダー構築
    loadDiaryPosts();
});

/**
 * posts/index.json から日付一覧を取得し、記事を描画する
 */
function loadDiaryPosts() {
    fetch("posts/index.json?t=" + new Date().getTime()) // キャッシュ対策
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            return response.json();
        })
        .then(dates => {
            postDatesList = Array.isArray(dates) ? dates : [];
            
            // カレンダーを生成
            renderCalendar();

            // 日記一覧を描画
            renderDiaryPosts();
        })
        .catch(err => {
            console.error("記事一覧の読み込みに失敗しました:", err);
            const container = document.getElementById("diary-posts-container");
            if (container) {
                container.innerHTML = '<div style="color:#aaaaaa; padding:20px 10px; text-align:center;">記事データを読み込めませんでした。</div>';
            }
        });
}

/**
 * 日記エントリーの描画（日付個別JSON fetch）
 */
function renderDiaryPosts() {
    const container = document.getElementById("diary-posts-container");
    if (!container) return;

    // 表示対象の日付リスト（選択されていればその1日、未選択なら全件降順）
    let targetDates = selectedFilterDate 
        ? postDatesList.filter(d => d === selectedFilterDate)
        : [...postDatesList].reverse(); // 新しい日付順

    let filterBarHtml = "";
    if (selectedFilterDate) {
        filterBarHtml = `
            <div class="filter-info-bar">
                <span>📅 <strong>${selectedFilterDate}</strong> の日記</span>
                <button class="reset-filter-btn" onclick="resetDiaryFilter()">全記事を表示</button>
            </div>
        `;
    }

    if (targetDates.length === 0) {
        container.innerHTML = filterBarHtml + `
            <div style="color:#aaaaaa; padding:20px 10px; text-align:center; border:1px dashed #444;">
                ${selectedFilterDate ? `「${selectedFilterDate}」の日記はありません。` : '記事がまだありません。'}
            </div>
        `;
        return;
    }

    // 各日付の posts/{date}.json を並列 fetch
    const fetchPromises = targetDates.map(date => 
        fetch(`posts/${date}.json?t=` + new Date().getTime())
            .then(res => res.ok ? res.json() : null)
            .catch(() => null)
    );

    Promise.all(fetchPromises).then(posts => {
        const validPosts = posts.filter(p => p !== null);

        if (validPosts.length === 0) {
            container.innerHTML = filterBarHtml + `
                <div style="color:#aaaaaa; padding:20px 10px; text-align:center; border:1px dashed #444;">
                    記事ファイルの読み込みに失敗しました。
                </div>
            `;
            return;
        }

        let html = filterBarHtml;
        validPosts.forEach(post => {
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
    });
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
    const postDatesSet = new Set(postDatesList);

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
