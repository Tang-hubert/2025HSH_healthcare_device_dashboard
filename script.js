document.addEventListener('DOMContentLoaded', () => {
    // === 元素獲取 (無變動) ===
    const simulationTimeEl = document.getElementById('simulation-time');
    const coreStatusCard = document.getElementById('core-status-card');
    const characterIcon = document.getElementById('character-icon');
    const statusText = document.getElementById('status-text');
    const statusDetail = document.getElementById('status-detail');
    const vitalsMainStatus = document.getElementById('vitals-main-status');
    const vitalsHr = document.getElementById('vitals-hr');
    const vitalsBr = document.getElementById('vitals-br');
    const vitalsSleep = document.getElementById('vitals-sleep');
    const sleepPresence = document.getElementById('sleep-presence');
    const sleepScore = document.getElementById('sleep-score');
    const sleepDuration = document.getElementById('sleep-duration');
    const sleepToss = document.getElementById('sleep-toss');
    const envTemp = document.getElementById('env-temp');
    const envHumidity = document.getElementById('env-humidity');
    const doorStatus = document.getElementById('door-status');
    const smokeStatus = document.getElementById('smoke-status');
    const doorCard = document.getElementById('door-card');

    // === 新的 6 秒循環劇本 ===
    const scenario = {
        '06:45:00': { core: '睡眠中', detail: '偵測到深層睡眠', icon: '😴', on_bed: true, hr: 62, br: 12, sleep_stage: '深睡', motion: '靜止', door: '關閉' },
        '06:46:00': { core: '活動中', detail: '開門拿取物品', icon: '🚪', on_bed: false, hr: 85, br: 19, sleep_stage: '非睡眠狀態', motion: '活動中', door: '開啟', sleep_score: 85, sleep_duration: '8h 2m' },
        '06:47:00': { core: '活動中', detail: '已關門並走回室內', icon: '🚶‍♂️', on_bed: false, hr: 83, br: 18, motion: '活動中', door: '關閉' },
        '06:48:00': { core: '緊急警報', detail: '偵測到使用者跌倒！', icon: '🚨', on_bed: false, hr: 125, br: 28, motion: '跌倒', alert: true },
        '06:49:00': { core: '緊急警報', detail: '警報已持續1分鐘', icon: '🚨', on_bed: false, hr: 115, br: 25, motion: '跌倒', alert: true },
        '06:50:00': { core: '急救處理中', detail: '已通知緊急聯絡人', icon: '🚑', on_bed: false, hr: 110, br: 22, motion: '跌倒', response: true }
    };

    // 將劇本的時間點轉換成陣列，方便索引
    const timeKeys = Object.keys(scenario);

    function updateDashboard(data) {
        // 更新核心狀態卡
        statusText.textContent = data.core;
        statusDetail.textContent = data.detail;
        characterIcon.textContent = data.icon;
        
        // 更新核心狀態的視覺樣式
        coreStatusCard.classList.remove('status-alert', 'status-response');
        if (data.alert) {
            coreStatusCard.classList.add('status-alert');
        } else if (data.response) {
            coreStatusCard.classList.add('status-response');
        }

        // 更新生命體徵卡
        vitalsMainStatus.textContent = data.motion;
        vitalsMainStatus.classList.toggle('status-danger', data.motion === '跌倒');
        vitalsHr.textContent = `${data.hr} bpm`;
        vitalsBr.textContent = `${data.br} br/min`;
        vitalsSleep.textContent = data.sleep_stage;

        // 更新睡眠卡
        sleepPresence.textContent = data.on_bed ? '在床' : '離床';
        sleepScore.textContent = data.sleep_score ? `${data.sleep_score} / 100` : '-- / 100';
        sleepDuration.textContent = data.sleep_duration || '--';
        
        // 更新環境與安全卡
        const isDoorClosed = data.door === '關閉';
        doorStatus.textContent = data.door;
        doorCard.querySelector('.main-value').className = isDoorClosed ? 'main-value status-ok' : 'main-value status-warn';
    }
    
    // === 無縫循環播放的模擬器 ===
    function runSimulation() {
        let stepIndex = 0;

        setInterval(() => {
            // 獲取當前步驟的時間和數據
            const timeStr = timeKeys[stepIndex];
            const data = scenario[timeStr];
            
            // 更新時間顯示和儀表板
            simulationTimeEl.textContent = timeStr;
            updateDashboard(data);

            // 移動到下一個步驟，如果到底了就從頭開始
            stepIndex = (stepIndex + 1) % timeKeys.length;
            
        }, 1000); // 每 1000ms (1秒) 播放一個步驟
    }

    // 初始化一些固定的顯示
    envTemp.textContent = `24 °C`;
    envHumidity.textContent = `62 %`;
    smokeStatus.className = 'main-value status-ok';
    smokeStatus.textContent = '正常';
    
    // 啟動模擬器
    runSimulation();
});