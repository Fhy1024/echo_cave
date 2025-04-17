// 这是一个加密脚本，你需要安装nodejs并且使用命令npm install crypto-js安装crypto-js库
const CryptoJS = require('crypto-js');

// 要显示的句子
const data = [
    "这是一个句子。--昵称",
    "目前没有内容哦，快单击我要投稿进行投稿吧！",
    "偷偷告诉你，这个静态网页是AI写的~",
    "你在期待什么呢？"
];

// 密钥
const secretKey = 'fhy2025';

// 加密函数
function encryptData(data, key) {
    return data.map(item => {
        const ciphertext = CryptoJS.AES.encrypt(item, key).toString();
        return ciphertext;
    });
}

// 加密后的数据
const encryptedData = encryptData(data, secretKey);

// 将加密后的数据写入新的 JSON 文件
const fs = require('fs');
fs.writeFileSync('encrypted-quotes.json', JSON.stringify(encryptedData, null, 2));