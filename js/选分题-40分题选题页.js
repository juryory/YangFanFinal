document.addEventListener("DOMContentLoaded", function() {
    // 定义一个唯一的前缀，例如 '40分题'，以区分不同的题型
    const localStorageKeyPrefix = '40分题';

    // 获取所有选题按钮并为它们添加点击事件
    document.querySelectorAll('.topic-button').forEach((button, index) => {
        // 检查 localStorage 中是否记录了隐藏状态
        if (localStorage.getItem(`${localStorageKeyPrefix}-questionHidden-${index}`) === 'true') {
            button.classList.add('hidden');
        }

        // 为每个按钮添加点击事件监听器
        button.addEventListener('click', () => {
            const tag = '40分题';  // 固定为 40分题
            const questionNumber = index + 1;  // 按钮1对应第1题，按钮2对应第2题...

            // 跳转到答题页面并传递 tag 参数和题号
            window.location.href = `/page/选分题-答题页.html?tag=${encodeURIComponent(tag)}&q=${questionNumber}`;
            
            // 隐藏按钮并保存隐藏状态到 localStorage
            button.classList.add('hidden');
            localStorage.setItem(`${localStorageKeyPrefix}-questionHidden-${index}`, 'true');
        });
    });

    // 监听键盘事件，按下 "P" 键时重置所有按钮状态
    document.addEventListener('keydown', function(event) {
        if (event.key.toLowerCase() === 'p') {
            localStorage.clear();  // 清除所有 localStorage 数据
            document.querySelectorAll('.topic-button').forEach(button => {
                button.classList.remove('hidden');  // 重新显示所有按钮
            });
        }
    });
});