document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const linkBtn = document.getElementById('link-btn');
    const quoteElement = document.getElementById('quote');
    const currentTimeElement = document.getElementById('current-time');
    const countdownElement = document.getElementById('countdown');

    let countdownInterval;
    let countdownValue = 15;

    // 页面加载时自动抽取一句话
    fetchQuotes();

    // 点击按钮时生成随机句子
    generateBtn.addEventListener('click', function() {
        fetchQuotes();
    });

    // 点击链接按钮时打开新标签页
    linkBtn.addEventListener('click', function() {
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
            const response = await fetch('quotes.json');
            const quotes = await response.json();
            const randomQuote = getRandomQuote(quotes);
            
            // 清除当前内容并开始打字动画
            quoteElement.textContent = '';
            typeWriter(randomQuote);

            // 重置倒计时
            resetCountdown();
        } catch (error) {
            console.error('TAT加载失败:', error);
            quoteElement.textContent = '糟了，加载失败了...等一会再试试吧~';
        }
    }

    // 从数组中随机选择一个句子
    function getRandomQuote(quotes) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }

    // 打字效果动画
    function typeWriter(text) {
        let i = 0;
        const speed = 50; // 打字速度（毫秒）
        const interval = setInterval(() => {
            if (i < text.length) {
                quoteElement.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
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
        clearInterval(countdownInterval);
        startCountdown();
    }

    // 启动倒计时
    startCountdown();
});