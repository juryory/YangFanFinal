document.addEventListener("DOMContentLoaded", function() {
    // 获取所有情景题按钮
    document.querySelectorAll('.scenario-button').forEach((button, index) => {
        // 检查 localStorage 中是否记录了隐藏状态
        if (localStorage.getItem(`scenarioHidden-${index}`) === 'true') {
            button.classList.add('hidden');
        }

        // 为每个按钮添加点击事件监听器
        button.addEventListener('click', () => {
            const tag = `情景题${index + 1}`;  // 根据按钮的索引生成相应的tag，例如"情景题1"
            window.location.href = `/page/情景题-答题页.html?tag=${encodeURIComponent(tag)}`;  // 使用tag参数跳转

            // 隐藏按钮并保存隐藏状态到 localStorage
            button.classList.add('hidden');
            localStorage.setItem(`scenarioHidden-${index}`, 'true');
        });
    });

    // 监听键盘事件，按下 "P" 键时重置所有按钮状态
    document.addEventListener('keydown', function(event) {
        if (event.key.toLowerCase() === 'p') {
            localStorage.clear();  // 清除所有 localStorage 数据
            document.querySelectorAll('.scenario-button').forEach(button => {
                button.classList.remove('hidden');  // 重新显示所有按钮
            });
        }
    });
});