document.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById('dob-year');
    const monthSelect = document.getElementById('dob-month');
    const daySelect = document.getElementById('dob-day');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultArea = document.getElementById('result-area');
    const dogYearsDisplay = document.getElementById('dog-years-display');
    const humanYearsDisplay = document.getElementById('human-years-display');

    // 1. 初始化：填充年、月、日下拉選單
    populateDateSelectors();

    // 監聽年月變化，動態更新日期的天數
    yearSelect.addEventListener('change', updateDays);
    monthSelect.addEventListener('change', updateDays);
    
    // 監聽計算按鈕點擊
    calculateBtn.addEventListener('click', calculateAge);


    // --- 函數定義 ---

    function populateDateSelectors() {
        const currentYear = new Date().getFullYear();
        // 年份：從今年往前推 25 年
        for (let i = currentYear; i >= currentYear - 25; i--) {
            let option = new Option(i + "年", i);
            yearSelect.add(option);
        }

        // 月份：1 到 12 月
        for (let i = 1; i <= 12; i++) {
            let option = new Option(i + "月", i);
            monthSelect.add(option);
        }

        // 初始填充日期（預設31天，之後會被 updateDays 修正）
        updateDays();
    }

    // 根據選中的年和月，更新"日"的選項數量
    function updateDays() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        
        // 保存當前選中的日期 (如果有的話)，以免更新後重置
        const currentSelectedDay = daySelect.value;

        // 清空現有選項，只保留預設的"日"
        daySelect.innerHTML = '<option value="">日</option>';

        if (year && month) {
            // 計算該月有多少天。new Date(year, month, 0) 會取得上個月的最後一天
            const daysInMonth = new Date(year, month, 0).getDate();

            for (let i = 1; i <= daysInMonth; i++) {
                let option = new Option(i + "日", i);
                daySelect.add(option);
            }

            // 如果之前選的日期在新月份中依然有效，則重新選中它
            if (currentSelectedDay && currentSelectedDay <= daysInMonth) {
                daySelect.value = currentSelectedDay;
            }
        }
    }

    function calculateAge() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        const day = parseInt(daySelect.value);

        // 驗證輸入
        if (!year || !month || !day) {
            alert("請完整選擇出生年、月、日");
            resultArea.classList.add('hidden');
            return;
        }

        const dob = new Date(year, month - 1, day); // 月份從 0 開始
        const today = new Date();

        if (dob > today) {
            alert("出生日期不能是未來！");
            resultArea.classList.add('hidden');
            return;
        }

        // 計算狗狗的實際年齡（精確到浮點數年）
        const diffInMilliseconds = today - dob;
        const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25; // 考慮閏年平均值
        const dogAgeFloat = diffInMilliseconds / millisecondsPerYear;

        let humanAge;

        // --- AKC 計算邏輯 ---
        // 第 1 年約等於 15 人類年
        // 第 2 年約等於 9 人類年 (累計 24)
        // 之後每一年約等於 5 人類年
        
        if (dogAgeFloat <= 1) {
            humanAge = dogAgeFloat * 15;
        } else if (dogAgeFloat <= 2) {
            humanAge = 15 + (dogAgeFloat - 1) * 9;
        } else {
            humanAge = 24 + (dogAgeFloat - 2) * 5;
        }

        // 顯示結果
        // 狗狗實際年齡保留一位小數
        dogYearsDisplay.textContent = dogAgeFloat.toFixed(1);
        // 人類年齡四捨五入取整數，或保留一位小數看起來更精確
        humanYearsDisplay.textContent = Math.round(humanAge); 

        resultArea.classList.remove('hidden');
    }
});