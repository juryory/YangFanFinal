document.addEventListener("DOMContentLoaded", () => {
    let correctSound = new Audio('/assets/audio/correct-sound.mp3');
    let wrongSound = new Audio('/assets/audio/wrong-sound.mp3');
    let countdownSound = new Audio('/assets/audio/countdown-sound.mp3');
    let endSound = new Audio('/assets/audio/end-sound.mp3');
    
    let timerInterval;
    let timerRunning = false;
    let countdownSeconds = 60; // 设置倒计时时间
    let currentQuestionIndex = 0;
    let questions = [];

    // 从 URL 获取 tag 参数
    const urlParams = new URLSearchParams(window.location.search);
    const tag = urlParams.get('tag');

    // 使用获取的 tag 加载对应的题目
    loadQuestionsByTag(tag);

    function loadQuestionsByTag(tag) {
        // 根据 tag 加载题目集逻辑
        Papa.parse('/data/question.csv', {
            download: true,
            header: true,
            complete: function(results) {
                const questions = results.data.filter(q => q.tag === tag);
                loadQuestion(0, questions); // 加载第一道题目
            }
        });
    }

    // 加载 CSV 文件并过滤出 tag 为 '一站到底 1 组' 的题目
    Papa.parse('/data/question.csv', {
        download: true,
        header: true,
        complete: function(results) {
            questions = results.data.filter(question => question.tag === '一站到底1组');
            loadQuestion(currentQuestionIndex);  // 加载第一道题目
        }
    });

    // 加载题目
    function loadQuestion(index) {
        if (index >= questions.length) {
            alert("已经是最后一道题了！");
            return;
        }

        let questionData = questions[index];
        document.getElementById("question-text").textContent = questionData.question;
        
        // 加载选项
        let options = questionData.options.split('|');
        let optionsContainer = document.getElementById("options");
        optionsContainer.innerHTML = '';
        options.forEach((option, i) => {
            let optionElement = document.createElement('div');
            optionElement.innerHTML = `
                <input type="radio" id="option${i}" name="option" value="${String.fromCharCode(65 + i)}">
                <label for="option${i}" id="label${i}">${option}</label>
            `;
            optionsContainer.appendChild(optionElement);
        });
    }

    // 开始或暂停计时
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
        document.getElementById("timer").textContent = formatTime(timeLeft);
        
        countdownSound.play();
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                document.getElementById("timer").textContent = formatTime(timeLeft);
                countdownSound.play();
            } else {
                clearInterval(timerInterval);
                endSound.play();
                timerRunning = false;
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        timerRunning = false;
        countdownSound.pause();
    }

    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let sec = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }

    // 选项选择和按键事件
    document.addEventListener('keydown', function(event) {
        const key = event.key.toUpperCase();
        const validKeys = ['A', 'B', 'C', 'D'];
        const index = validKeys.indexOf(key);

        if (index !== -1) {
            let optionInput = document.getElementById(`option${index}`);
            let optionLabel = document.getElementById(`label${index}`);
            optionInput.checked = true;
            resetOptionColors();
            optionLabel.style.backgroundColor = 'lightblue';
        }
    });

    function resetOptionColors() {
        document.querySelectorAll('label').forEach(label => {
            label.style.backgroundColor = '';
        });
    }

    // 显示答案
    document.getElementById("show-answer").addEventListener("click", () => {
        let correctAnswer = questions[currentQuestionIndex].correct_answer;
        let selectedAnswer = document.querySelector('input[name="option"]:checked');
        
        if (selectedAnswer) {
            if (selectedAnswer.value === correctAnswer) {
                document.getElementById(`label${selectedAnswer.value.charCodeAt(0) - 65}`).style.backgroundColor = 'green';
                correctSound.play();
            } else {
                document.getElementById(`label${selectedAnswer.value.charCodeAt(0) - 65}`).style.backgroundColor = 'red';
                wrongSound.play();
            }
        }
    });

    // 下一题功能
    document.getElementById("next-question").addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion(currentQuestionIndex);
        } else {
            alert("已经是最后一道题！");
        }
    });
});