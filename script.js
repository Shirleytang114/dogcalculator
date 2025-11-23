document.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById('dob-year');
    const monthSelect = document.getElementById('dob-month');
    const daySelect = document.getElementById('dob-day');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultArea = document.getElementById('result-area');
    const resultTitle = document.getElementById('result-title'); // 獲取標題元素
    const dogYearsDisplay = document.getElementById('dog-years-display');
    const humanYearsDisplay = document.getElementById('human-years-display');

    // 1. 初始化：填充年、月、日下拉選單
    populateDateSelectors();

    // 2. 新增：檢查並載入 LocalStorage 的資料
    loadStoredResult();

    // 監聽年月變化，動態更新日期的天數
    yearSelect.addEventListener('change', updateDays);
    monthSelect.addEventListener('change', updateDays);
    
    // 監聽計算按鈕點擊
    calculateBtn.addEventListener('click', calculateAge);


    // --- 函數定義 ---

    // 新增函數：載入儲存的結果
    function loadStoredResult() {
        const storedDogAge = localStorage.getItem('dogAgeStored');
        const storedHumanAge = localStorage.getItem('humanAgeStored');

        // 如果兩個值都存在，則顯示它們
        if (storedDogAge && storedHumanAge) {
            dogYearsDisplay.textContent = storedDogAge;
            humanYearsDisplay.textContent = storedHumanAge;
            
            // 將標題改為提示這是舊資料
            resultTitle.textContent = "上次計算結果";
            
            // 顯示結果區域
            resultArea.classList.remove('hidden');
        }
    }


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

        // 初始填充日期
        updateDays();
    }

    function updateDays() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        const currentSelectedDay = daySelect.value;

        daySelect.innerHTML = '<option value="">日</option>';

        if (year && month) {
            const daysInMonth = new Date(year, month, 0).getDate();
            for (let i = 1; i <= daysInMonth; i++) {
                let option = new Option(i + "日", i);
                daySelect.add(option);
            }
            if (currentSelectedDay && currentSelectedDay <= daysInMonth) {
                daySelect.value = currentSelectedDay;
            }
        }
    }

    function calculateAge() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        const day = parseInt(daySelect.value);

        if (!year || !month || !day) {
            alert("請完整選擇出生年、月、日");
            return;
        }

        const dob = new Date(year, month - 1, day);
        const today = new Date();

        if (dob > today) {
            alert("出生日期不能是未來！");
            return;
        }

        // 計算狗狗的實際年齡
        const diffInMilliseconds = today - dob;
        const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25;
        const dogAgeFloat = diffInMilliseconds / millisecondsPerYear;

        let humanAge;

        // --- AKC 計算邏輯 ---
        if (dogAgeFloat <= 1) {
            humanAge = dogAgeFloat * 15;
        } else if (dogAgeFloat <= 2) {
            humanAge = 15 + (dogAgeFloat - 1) * 9;
        } else {
            humanAge = 24 + (dogAgeFloat - 2) * 5;
        }

        // 準備顯示的數值
        const finalDogAgeStr = dogAgeFloat.toFixed(1);
        const finalHumanAgeStr = Math.round(humanAge).toString();

        // 顯示結果
        dogYearsDisplay.textContent = finalDogAgeStr;
        humanYearsDisplay.textContent = finalHumanAgeStr;

        // 確保標題是 "計算結果"（因為這是新的計算）
        resultTitle.textContent = "計算結果";
        resultArea.classList.remove('hidden');

        // --- 新增：儲存結果到 localStorage ---
        // 我們只需要儲存最後計算出來的兩個數字字串
        localStorage.setItem('dogAgeStored', finalDogAgeStr);
        localStorage.setItem('humanAgeStored', finalHumanAgeStr);
    }
});