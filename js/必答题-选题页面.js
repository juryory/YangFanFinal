document.addEventListener("DOMContentLoaded", function() {
    const localStorageKeyPrefix = '必答题';  // 为必答题页面添加唯一前缀

    document.querySelectorAll('.topic-button').forEach((button, index) => {
        if (localStorage.getItem(`${localStorageKeyPrefix}-questionHidden-${index}`) === 'true') {
            button.classList.add('hidden');
        }

        button.addEventListener('click', () => {
            let tag = ''; 
            switch(index) {
                // 针对普通按钮分配 tag，extra-button 不需要 tag
                case 0:
                    tag = '第一组必答题';
                    break;
                case 1:
                    tag = '第二组必答题';
                    break;
                case 2:
                    tag = '第三组必答题';
                    break;
                case 3:
                    tag = '第四组必答题';
                    break;
                case 4:
                    tag = '第五组必答题';
                    break;
                case 5:
                    tag = '第六组必答题';
                    break;
                case 6:
                    tag = '第七组必答题';
                    break;
                case 7:
                    tag = '第八组必答题';
                    break;
                case 8:
                    tag = '第九组必答题';
                    break;
                case 9:
                    tag = '第十组必答题';
                    break;
            }

            // 跳转到答题页面并传递 tag 参数和 q=1
            if (!button.classList.contains('extra-button')) {
                window.location.href = `/page/必答题-答题页.html?tag=${encodeURIComponent(tag)}&q=1`;
                button.classList.add('hidden');
                localStorage.setItem(`${localStorageKeyPrefix}-questionHidden-${index}`, 'true');
            }
        });
    });

    document.addEventListener('keydown', function(event) {
        if (event.key.toLowerCase() === 'p') {
            localStorage.clear();  
            document.querySelectorAll('.topic-button:not(.extra-button)').forEach(button => {
                button.classList.remove('hidden');
            });
        }
    });
});