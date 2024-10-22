document.addEventListener("DOMContentLoaded", function() {
    let timerInterval;
    let timerRunning = false;
    let countdownSeconds = 120;  // 设置倒计时时间（以秒为单位）

    // 获取URL中的tag参数
    const urlParams = new URLSearchParams(window.location.search);
    const tag = urlParams.get('tag');  // 获取传递的tag

    // 题目显示逻辑
    const questionTextElement = document.getElementById("question-text");
    Papa.parse('/data/question.csv', {
        download: true,
        header: true,
        complete: function(results) {
            // 查找tag等于传递的tag的题目
            const questionData = results.data.find(question => question.tag === tag);
            if (questionData) {
                questionTextElement.textContent = questionData.question;  // 显示对应题目的内容
            } else {
                questionTextElement.textContent = "找不到题目";  // 如果没有找到题目，显示提示
            }
        }
    });

    // 计时器逻辑
    const timerElement = document.getElementById("timer");
    document.getElementById("start-timer").addEventListener("click", () => {
        if (!timerRunning) {
            startTimer();
        } else {
            pauseTimer();
        }
    });

    function startTimer() {
        timerRunning = true;
        let timeLeft = countdownSeconds;
        updateTimerDisplay(timeLeft);

        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerRunning = false;
            }
        }, 1000);  // 每秒更新一次计时
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        timerRunning = false;
    }

    function updateTimerDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const sec = seconds % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }

    // 返回到选题页逻辑
    document.getElementById("return-selection").addEventListener("click", () => {
        window.location.href = '/page/情景题-首页.html';
    });
});