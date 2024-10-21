document.addEventListener("DOMContentLoaded", function() {
    // 获取所有选题按钮
    document.querySelectorAll('.topic-button').forEach((button, index) => {
        // 为每个按钮添加点击事件监听器
        button.addEventListener('click', () => {
            let tag = ''; // 根据按钮索引选择不同的 tag
            switch(index) {
                case 0:
                    tag = '一站到底1组';
                    break;
                case 1:
                    tag = '一站到底2组';
                    break;
                // 继续添加其他按钮的 tag 对应逻辑...
            }

            // 跳转到答题页面并传递 tag 参数
            window.location.href = `/page/一战到底-答题页.html?tag=${encodeURIComponent(tag)}`;
        });
    });
});