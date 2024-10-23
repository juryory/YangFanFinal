document.addEventListener("DOMContentLoaded", function() {
    const localStorageKeyPrefix = '一站到底';
    // 获取所有选题按钮并为它们添加点击事件
    document.querySelectorAll('.topic-button').forEach((button, index) => {
        // 检查 localStorage 中是否记录了隐藏状态，extra-button 不受影响
        if (localStorage.getItem(`questionHidden-${index}`) === 'true' && !button.classList.contains('extra-button')) {
            button.classList.add('hidden');
        }

        // 为每个按钮添加点击事件监听器
        button.addEventListener('click', () => {
            let tag = ''; // 根据按钮索引选择不同的 tag

            switch(index) {
                // 针对普通按钮分配 tag，extra-button 不需要 tag
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
            if (!button.classList.contains('extra-button')) {
                window.location.href = `/page/一站到底-答题页.html?tag=${encodeURIComponent(tag)}&q=1`;
                button.classList.add('hidden');
                localStorage.setItem(`questionHidden-${index}`, 'true');
            }
        });
    });

    // extra-button 的单独点击事件，不涉及 localStorage
    document.querySelector('.extra-button').addEventListener('click', function() {
        window.location.href = '/page/情景题-首页.html';  // 为新按钮设置跳转逻辑
    });

    // 监听 "P" 键重置所有布局，extra-button 不受影响
    document.addEventListener('keydown', function(event) {
        if (event.key.toLowerCase() === 'p') {
            localStorage.clear();  // 清除所有 localStorage 数据
            document.querySelectorAll('.topic-button:not(.extra-button)').forEach(button => {
                button.classList.remove('hidden');  // 重新显示所有普通按钮，extra-button 不受影响
            });
        }
    });
});