document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.getElementById('generate-btn');
    const linkBtn = document.getElementById('link-btn');
    const quoteElement = document.getElementById('quote');
    const currentTimeElement = document.getElementById('current-time');
    const countdownElement = document.getElementById('countdown');

    let countdownInterval;
    let countdownValue = 15;
    let typingInterval; // 用于存储打字动画的 interval

    // 密钥
    const secretKey = 'fhy2025';

    // 检查 DOM 元素是否存在
    if (!generateBtn || !linkBtn || !quoteElement || !currentTimeElement || !countdownElement) {
        console.error('必要的DOM元素找不着啦，快看看HTML结构叭~');
        return;
    }

    // 页面加载时自动抽取一句话
    fetchQuotes();

    // 点击按钮时生成随机句子
    generateBtn.addEventListener('click', function () {
        fetchQuotes();
    });

    // 点击链接按钮时打开新标签页
    linkBtn.addEventListener('click', function () {
        // 替换为你的目标网页URL
        window.open('https://www.wenjuan.com/s/UZBZJvJ0BR/', '_blank');
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
});