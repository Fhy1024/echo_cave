//v1.2.2
document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.getElementById('generate-btn');
    const linkBtn = document.getElementById('link-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const quoteElement = document.getElementById('quote');
    const currentTimeElement = document.getElementById('current-time');
    const countdownElement = document.getElementById('countdown');
    const settingsModal = document.getElementById('settings-modal');
    const closeModal = document.querySelector('.close');
    const settingsKeyInput = document.getElementById('settings-key');
    const jumpBtn1 = document.getElementById('jump-btn1');
    const jumpBtn2 = document.getElementById('jump-btn2');
    const colorToggle = document.getElementById('color-toggle');
    const quoteCountElement = document.getElementById('quote-count');
    const confirmModal = document.getElementById('confirm-modal');
    const confirmClose = document.querySelector('.close-confirm');
    const confirmYesBtn = document.getElementById('confirm-yes');
    const confirmNoBtn = document.getElementById('confirm-no');

    let countdownInterval;
    let countdownValue = 15;
    let typingInterval; // 用于存储打字动画的 interval

    // 密钥
    let secretKey = 'fhy2025';

    // 检查 DOM 元素是否存在
    if (!generateBtn || !linkBtn || !settingsBtn || !quoteElement || !currentTimeElement || !countdownElement) {
        console.error('必要的DOM元素找不着啦，快看看HTML结构叭~');
        return;
    }

    // 页面加载时自动抽取一句话
    fetchQuotes();

    // 点击按钮时生成随机句子
    generateBtn.addEventListener('click', function () {
        fetchQuotes();
    });

    // 点击链接按钮时弹出确认对话框
    linkBtn.addEventListener('click', function () {
        confirmModal.style.display = 'block';
    });

    // 点击确认对话框的“是”按钮时打开新标签页
    confirmYesBtn.addEventListener('click', function () {
        window.open('https://www.wenjuan.com/s/UZBZJvJ0BR/', '_blank');
        confirmModal.style.display = 'none';
    });

    // 点击确认对话框的“否”按钮时关闭对话框
    confirmNoBtn.addEventListener('click', function () {
        confirmModal.style.display = 'none';
    });

    // 点击确认对话框的关闭按钮时关闭对话框
    confirmClose.addEventListener('click', function () {
        confirmModal.style.display = 'none';
    });

    // 点击设置按钮时显示设置窗口
    settingsBtn.addEventListener('click', function () {
        settingsModal.style.display = 'block';
    });

    // 点击关闭按钮时关闭设置窗口
    closeModal.addEventListener('click', function () {
        settingsModal.style.display = 'none';
    });

    // 点击窗口外部时关闭设置窗口
    window.addEventListener('click', function (event) {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
        if (event.target === confirmModal) {
            confirmModal.style.display = 'none';
        }
    });

    // 设置窗口中的密钥更新
    settingsKeyInput.addEventListener('input', function () {
        secretKey = this.value;
    });

    // 彩色闪动效果开关
    colorToggle.addEventListener('change', function () {
        if (this.checked) {
            linkBtn.classList.add('color-pulse');
        } else {
            linkBtn.classList.remove('color-pulse');
        }
    });

    // 跳转按钮1
    jumpBtn1.addEventListener('click', function () {
        window.open('https://github.com/Fhy1024/echo_cave', '_blank');
    });

    // 跳转按钮2
    jumpBtn2.addEventListener('click', function () {
        window.open('https://fhy1234.dpdns.org/', '_blank');
    });

    // 实时时间显示
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    // 每秒更新时间
    setInterval(updateTime, 1000);
    updateTime(); // 初始化时间显示

    // 从JSON文件中获取句子
    async function fetchQuotes() {
        try {
            const response = await fetch('./encrypted-quotes.json'); // 修正路径为相对路径
            if (!response.ok) {
                throw new Error(`HTTP 错误哦~状态码: ${response.status}`);
            }
            const encryptedQuotes = await response.json();

            // 更新句子数量显示
            quoteCountElement.textContent = `（已收集 ${encryptedQuotes.length} 声）`;

            // 随机选择一个加密的句子
            const randomEncryptedQuote = getRandomEncryptedQuote(encryptedQuotes);

            // 解密句子
            const decryptedQuote = decryptData(randomEncryptedQuote, secretKey);

            // 清除当前内容并停止之前的动画
            quoteElement.textContent = '';
            if (typingInterval) {
                clearInterval(typingInterval);
            }

            // 开始新的打字动画
            typeWriter(decryptedQuote);

            // 重置倒计时
            resetCountdown();
        } catch (error) {
            console.error('TAT加载失败:', error);
            quoteElement.textContent = '糟了，加载失败了...等一会再试试吧~';
        }
    }

    // 从数组中随机选择一个加密的句子
    function getRandomEncryptedQuote(encryptedQuotes) {
        const randomIndex = Math.floor(Math.random() * encryptedQuotes.length);
        return encryptedQuotes[randomIndex];
    }

    // 解密函数
    function decryptData(encryptedData, key) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, key);
            const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
            if (!decryptedText) {
                throw new Error('解密结果怎么是空的?一定是出现了bug！');
            }
            return decryptedText;
        } catch (error) {
            console.error('TwT解密失败:', error);
            return '一不小心加载失败了，快看看密钥对不对吧！';
        }
    }

    // 打字效果动画
    function typeWriter(text) {
        clearInterval(typingInterval); // 确保清除之前的动画
        let i = 0;
        const speed = 50; // 打字速度（毫秒）
        typingInterval = setInterval(() => {
            if (i < text.length) {
                quoteElement.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, speed);
    }

    // 倒计时功能
    function startCountdown() {
        countdownValue = 15;
        countdownElement.textContent = `${countdownValue}`;

        countdownInterval = setInterval(() => {
            countdownValue--;
            if (countdownValue <= 0) {
                clearInterval(countdownInterval);
                countdownElement.textContent = '...';
                fetchQuotes();
            } else {
                countdownElement.textContent = `${countdownValue}`;
            }
        }, 1000);
    }

    // 重置倒计时
    function resetCountdown() {
        clearInterval(countdownInterval); // 确保清除之前的倒计时
        startCountdown();
    }

    // 启动倒计时
    startCountdown();

    // 初始化彩色闪动效果
    if (colorToggle.checked) {
        linkBtn.classList.add('color-pulse');
    }
});