document.addEventListener("DOMContentLoaded", function() {
    // 获取所有选题按钮
    document.querySelectorAll('.topic-button').forEach((button, index) => {
        const tag = ''; // 根据按钮索引选择不同的 tag

        // 检查 localStorage 中是否记录了隐藏状态
        if (localStorage.getItem(`questionHidden-${index}`) === 'true') {
            button.classList.add('hidden');
        }

        // 为每个按钮添加点击事件监听器
        button.addEventListener('click', () => {
            let tag = ''; // 根据按钮索引选择不同的 tag

            // 根据按钮的 index 或者特定标识符来分配不同的 tag 值
            switch(index) {
                case 0:
                    tag = '第一组一站到底';
                    break;
                case 1:
                    tag = '第二组一站到底';
                    break;
                case 2:
                    tag = '第三组一站到底';
                    break;
                case 3:
                    tag = '第四组一站到底';
                    break;
                case 4:
                    tag = '第五组一站到底';
                    break;
                case 5:
                    tag = '第六组一站到底';
                    break;
                case 6:
                    tag = '第七组一站到底';
                    break;
                case 7:
                    tag = '第八组一站到底';
                    break;
                case 8:
                    tag = '第九组一站到底';
                    break;
                case 9:
                    tag = '第十组一站到底';
                    break;
            }

            // 跳转到答题页面并传递 tag 参数和 q=1
            window.location.href = `/page/一战到底-答题页.html?tag=${encodeURIComponent(tag)}&q=1`;

            // 隐藏按钮并保存隐藏状态到 localStorage
            button.classList.add('hidden');
            localStorage.setItem(`questionHidden-${index}`, 'true');
        });
    });

    // 监听键盘事件，按下 "P" 键时重置所有按钮状态
    document.addEventListener('keydown', function(event) {
        if (event.key.toLowerCase() === 'p') {
            localStorage.clear();  // 清除所有 localStorage 数据
            document.querySelectorAll('.topic-button').forEach(button => {
                button.classList.remove('hidden');  // 显示所有按钮
            });
        }
    });
});