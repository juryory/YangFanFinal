document.addEventListener("DOMContentLoaded", () => {
    let correctSound = new Audio('/assets/audio/correct-sound.mp3');
    let wrongSound = new Audio('/assets/audio/wrong-sound.mp3');
    let countdownSound = new Audio('/assets/audio/countdown-sound.mp3');
    let endSound = new Audio('/assets/audio/end-sound.mp3');
    let tickingSound = new Audio('/assets/audio/一站到底计时.mp3'); // 加载计时音效

    let timerInterval;
    let timerRunning = false;
    let countdownSeconds = 60; // 设置倒计时时间
    let currentQuestionIndex = 0;
    let questions = [];

    // 从 URL 获取 tag 参数和 q 参数
    const urlParams = new URLSearchParams(window.location.search);
    const tag = urlParams.get('tag');
    const questionNumber = urlParams.get('q') ? parseInt(urlParams.get('q')) - 1 : 0; // 如果 q 存在，则从指定题目开始，否则从第一题开始

    // 加载 CSV 文件并过滤出传递的 tag 对应的题目
    Papa.parse('/data/question.csv', {
        download: true,
        header: true,
        complete: function(results) {
            questions = results.data.filter(question => question.tag === tag);
            currentQuestionIndex = questionNumber;  // 设置当前题目索引
            loadQuestion(currentQuestionIndex);  // 加载指定的题目
        }
    });

    // 加载题目
    function loadQuestion(index) {
        if (index >= questions.length) {
            document.getElementById("question-text").textContent = "本轮题目已全部答完";
            document.getElementById("options").innerHTML = '';  // 清空选项
            return;
        }

        let questionData = questions[index];
        let fontSize = questionData.font_size || 3;  // 如果没有指定 font_size，默认 3vw

        // 设置题目字体大小和行间距
        document.getElementById("question-text").textContent = questionData.question;
        document.getElementById("question-text").style.fontSize = fontSize + 'vw'; // 使用 vw 设置字体大小
        document.getElementById("question-text").style.lineHeight = 1.5;  // 设置 1.5 行间距

        // 加载选项
        let options = questionData.options.split('|');
        let optionsContainer = document.getElementById("options");
        optionsContainer.innerHTML = ''; // 清空旧的选项
        options.forEach((option, i) => {
            let optionElement = document.createElement('div');
            optionElement.innerHTML = `
                <input type="${questionData.type === '多选' ? 'checkbox' : 'radio'}" id="option${i}" name="option" value="${String.fromCharCode(65 + i)}">
                <label for="option${i}" id="label${i}">${option}</label>
            `;
            // 设置选项字体大小和行间距
            optionElement.style.fontSize = fontSize + 'vw';  // 使用 vw 设置选项字体大小
            optionElement.style.lineHeight = 1.5;  // 设置选项行间距
            optionsContainer.appendChild(optionElement);
        });

        // 设置选项的监听事件
        setupOptionListeners(questionData.type);

        // 禁用查看答案按钮直到有选项被选择
        document.getElementById("show-answer").disabled = true;
    }

    // 监听选项选择，处理单选题和多选题
    function setupOptionListeners(type) {
        document.querySelectorAll('input[name="option"]').forEach(option => {
            option.addEventListener('change', function(event) {
                let label = document.querySelector(`label[for="${event.target.id}"]`);
                
                // 检查是否选中，选中则变色，取消则恢复颜色
                if (event.target.checked) {
                    label.style.color = '#347bdd';  // 设置为选中颜色
                    if (type === "单选") {
                        // 如果是单选题，取消其他选项的颜色
                        document.querySelectorAll('input[name="option"]:not(:checked)').forEach(otherOption => {
                            let otherLabel = document.querySelector(`label[for="${otherOption.id}"]`);
                            otherLabel.style.color = '';  // 恢复默认颜色
                        });
                    }
                } else {
                    label.style.color = '';  // 恢复默认颜色
                }

                // 启用查看答案按钮，因为有选项被选择了
                document.getElementById("show-answer").disabled = false;
            });
        });
    }

    // 下一题功能
    document.getElementById("next-question").addEventListener("click", () => {
        currentQuestionIndex++;

        // 更新地址栏中的 q 参数
        const newQ = currentQuestionIndex + 1;
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('q', newQ);
        window.history.replaceState({}, '', newUrl);  // 替换地址栏中的 URL 而不重新加载页面

        document.getElementById("answer-text").textContent = '';  // 隐藏答案区域
        document.getElementById("show-answer").disabled = true;  // 禁用查看答案按钮

        if (currentQuestionIndex < questions.length) {
            loadQuestion(currentQuestionIndex);
        } else {
            document.getElementById("question-text").textContent = "本轮题目已全部答完";
            document.getElementById("options").innerHTML = '';  // 清空选项
        }
    });

    // 绑定查看答案按钮的回车快捷键
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('show-answer').click(); // 触发查看答案按钮的点击事件
        }
    });

    // 返回选题页面
    document.getElementById("return-selection").addEventListener("click", () => {
        window.location.href = '/page/必答题-选题页面.html';
    });
});