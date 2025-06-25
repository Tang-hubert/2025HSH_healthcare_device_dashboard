document.addEventListener('DOMContentLoaded', () => {
    // === 元素獲取 ===
    const timeDisplay = document.getElementById('time-display');
    const dateDisplay = document.getElementById('date-display');
    const simulationTimeEl = document.getElementById('simulation-time');
    // Core Status
    const coreStatusCard = document.getElementById('core-status-card');
    const characterIcon = document.getElementById('character-icon');
    const statusText = document.getElementById('status-text');
    const statusDetail = document.getElementById('status-detail');
    // Vitals
    const vitalsCard = document.getElementById('vitals-card');
    const vitalsMainStatus = document.getElementById('vitals-main-status');
    const vitalsHr = document.getElementById('vitals-hr');
    const vitalsBr = document.getElementById('vitals-br');
    const vitalsSleep = document.getElementById('vitals-sleep');
    // Sleep
    const sleepCard = document.getElementById('sleep-card');
    const sleepPresence = document.getElementById('sleep-presence');
    const sleepScore = document.getElementById('sleep-score');
    const sleepDuration = document.getElementById('sleep-duration');
    const sleepToss = document.getElementById('sleep-toss');
    // Environment & Safety
    const envTemp = document.getElementById('env-temp');
    const envHumidity = document.getElementById('env-humidity');
    const doorStatus = document.getElementById('door-status');
    const smokeStatus = document.getElementById('smoke-status');
    const doorCard = document.getElementById('door-card');
    const smokeCard = document.getElementById('smoke-card');


    // === 模擬劇本與數據 ===
    const mockData = [
        { time: '02:30:00', sensor: 'BedSensor', on_bed: true, abnormal_vibration: false },
        { time: '02:30:00', sensor: 'VitalSigns', hr: 62, br: 14, sleep_stage: '深睡', motion: '靜止' },
        { time: '04:30:00', sensor: 'VitalSigns', hr: 65, br: 15, sleep_stage: '淺睡', motion: '靜止' },
        { time: '04:32:00', sensor: 'BedSensor', toss_and_turn: 15 },
        { time: '06:45:00', sensor: 'VitalSigns', hr: 70, br: 16, sleep_stage: '清醒', motion: '活動中' },
        { time: '06:50:00', sensor: 'BedSensor', on_bed: false, sleep_duration: '7h 20m', sleep_score: 88 },
        { time: '08:30:00', sensor: 'Environment', temp: 24, humidity: 60 },
        { time: '08:50:55', sensor: 'VitalSigns', hr: 85, br: 20, motion: '活動中' },
        { time: '08:51:02', sensor: 'VitalSigns', hr: 120, br: 25, motion: '跌倒' },
        { time: '08:51:05', sensor: 'VitalSigns', hr: 115, br: 24, motion: '靜止' },
        { time: '08:55:00', sensor: 'VitalSigns', hr: 110, br: 22, motion: '靜止' },
    ];

    let globalState = {
        main_status: '初始化中...',
        on_bed: false,
        motion: '未知',
    };

    // === 更新 UI 的函式 ===
    function updateClock() {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString('en-GB');
        dateDisplay.textContent = now.toISOString().split('T')[0];
    }

    function updateCoreStatus() {
        let icon, text, detail;
        const motion = globalState.motion;
        const on_bed = globalState.on_bed;

        coreStatusCard.classList.remove('status-alert');

        if (motion === '跌倒') {
            icon = '🚨';
            text = '緊急狀況';
            detail = '偵測到使用者跌倒！';
            coreStatusCard.classList.add('status-alert');
        } else if (on_bed) {
            icon = '😴';
            text = '睡眠中';
            detail = '使用者在床上休息';
        } else if (motion === '活動中') {
            icon = '🚶‍♂️';
            text = '活動中';
            detail = '在室內偵測到活動';
        } else if (motion === '靜止') {
            icon = '🛋️';
            text = '靜態休息';
            detail = '使用者處於靜止狀態';
        } else {
            icon = '❓';
            text = '未知';
            detail = '等待感測器數據';
        }
        characterIcon.textContent = icon;
        statusText.textContent = text;
        statusDetail.textContent = detail;
    }

    function processData(data) {
        simulationTimeEl.textContent = data.time;

        if (data.sensor === 'VitalSigns') {
            globalState.motion = data.motion;
            vitalsHr.textContent = `${data.hr} bpm`;
            vitalsBr.textContent = `${data.br} br/min`;
            vitalsSleep.textContent = data.sleep_stage || '--';
            
            vitalsMainStatus.classList.remove('status-danger');
            if (data.motion === '跌倒') {
                vitalsMainStatus.textContent = '偵測到跌倒';
                vitalsMainStatus.classList.add('status-danger');
            } else {
                vitalsMainStatus.textContent = data.motion;
            }
        }

        if (data.sensor === 'BedSensor') {
            globalState.on_bed = data.on_bed;
            sleepPresence.textContent = data.on_bed ? '在床' : '離床';
            if (data.sleep_score) sleepScore.textContent = `${data.sleep_score} / 100`;
            if (data.sleep_duration) sleepDuration.textContent = data.sleep_duration;
            if (data.toss_and_turn) sleepToss.textContent = `${data.toss_and_turn} 次`;
            
            sleepCard.classList.remove('status-warn');
            if(data.abnormal_vibration) {
                 sleepPresence.textContent = "異常震動";
                 sleepCard.classList.add('status-warn');
            }
        }

        if (data.sensor === 'Environment') {
            envTemp.textContent = `${data.temp} °C`;
            envHumidity.textContent = `${data.humidity} %`;
        }

        // 觸發核心狀態更新
        updateCoreStatus();
    }
    
    // === 模擬器啟動 ===
    async function runSimulation() {
        // 先顯示一個初始的空狀態
        processData({ time: '00:00:00' });
        
        for (const dataPoint of mockData) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // 每個事件間隔2秒
            processData(dataPoint);
        }
        statusDetail.textContent = '模擬結束。';
    }

    setInterval(updateClock, 1000);
    updateClock();
    runSimulation();
});