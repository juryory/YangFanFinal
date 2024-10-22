document.addEventListener("DOMContentLoaded", () => {
    let correctSound = new Audio('/assets/audio/correct-sound.mp3');
    let wrongSound = new Audio('/assets/audio/wrong-sound.mp3');
    let tickingSound = new Audio('/assets/audio/一站到底计时.mp3');  // 计时音效

    let timerInterval;
    let timerRunning = false;
    let countdownSeconds = 120;  // 设置倒计时时间
    let questions = [];

    // 从 URL 获取 tag 参数和 q 参数
    const urlParams = new URLSearchParams(window.location.search);
    const tag = urlParams.get('tag');
    const questionNumber = urlParams.get('q') ? parseInt(urlParams.get('q')) - 1 : 0;

    // 加载 CSV 文件并根据 tag 和 q 加载题目
    Papa.parse('/data/question.csv', {
        download: true,
        header: true,
        complete: function(results) {
            questions = results.data.filter(question => question.tag === tag);
            loadQuestion(questionNumber);
        }
    });

    // 加载题目
    function loadQuestion(index) {
        if (index >= questions.length) {
            document.getElementById("question-text").textContent = "本轮题目已全部答完";
            document.getElementById("options").innerHTML = '';
            return;
        }

        let questionData = questions[index];
        let fontSize = questionData.font_size || 3;
        document.getElementById("question-text").textContent = questionData.question;
        document.getElementById("question-text").style.fontSize = fontSize + 'vw';

        let options = questionData.options.split('|');
        let optionsContainer = document.getElementById("options");
        optionsContainer.innerHTML = '';
        options.forEach((option, i) => {
            let optionElement = document.createElement('div');
            optionElement.innerHTML = `
                <input type="${questionData.type === '多选' ? 'checkbox' : 'radio'}" id="option${i}" name="option" value="${String.fromCharCode(65 + i)}">
                <label for="option${i}" id="label${i}">${option}</label>
            `;
            optionsContainer.appendChild(optionElement);
        });

        setupOptionListeners(questionData.type);
    }

    // 监听选项的选择
    function setupOptionListeners(type) {
        document.querySelectorAll('input[name="option"]').forEach(option => {
            option.addEventListener('change', function(event) {
                let label = document.querySelector(`label[for="${event.target.id}"]`);

                if (event.target.checked) {
                    label.style.color = '#aa221b';
                    if (type === '单选') {
                        document.querySelectorAll('input[name="option"]:not(:checked)').forEach(otherOption => {
                            document.querySelector(`label[for="${otherOption.id}"]`).style.color = '';
                        });
                    }
                } else {
                    label.style.color = '';
                }
            });
        });
    }

    // 监听 A-H 按键选择选项
    document.addEventListener('keydown', function(event) {
        const key = event.key.toUpperCase();
        if (key >= 'A' && key <= 'H') {
            const optionIndex = key.charCodeAt(0) - 65;
            const option = document.getElementById(`option${optionIndex}`);
            if (option) {
                option.checked = !option.checked;
                option.dispatchEvent(new Event('change'));
            }
        }
    });

    // 计时器和查看答案功能
    const timerElement = document.getElementById("timer");
    const startTimerButton = document.getElementById("start-timer");

    startTimerButton.addEventListener("click", () => {
        if (!timerRunning) {
            startTimer();
        } else {
            pauseTimer();
        }
    });

    function startTimer() {
        timerRunning = true;
        tickingSound.play();
        let timeLeft = countdownSeconds;
        updateTimerDisplay(timeLeft);

        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                tickingSound.pause();
                timerRunning = false;
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        tickingSound.pause();
        timerRunning = false;
    }

    function updateTimerDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const sec = seconds % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }

    // 显示答案并判断是否正确
    document.getElementById("show-answer").addEventListener("click", () => {
        let correctAnswer = questions[questionNumber].correct_answer;  // 获取正确答案，例如 "ABCDE"
        let correctAnswers = correctAnswer.split('');  // 将正确答案拆分为数组 ["A", "B", "C", "D", "E"]

        // 获取用户选择的所有选项
        let selectedAnswers = Array.from(document.querySelectorAll('input[name="option"]:checked'))
                                    .map(option => option.value);  // 用户选择的答案数组

        // 比较用户选择的选项和正确答案
        let isCorrect = selectedAnswers.length === correctAnswers.length && 
                        selectedAnswers.every(answer => correctAnswers.includes(answer));  // 判断是否正确

        // 显示判断结果
        if (isCorrect) {
            document.getElementById("answer-text").innerHTML = "回答正确<br>" + correctAnswer;
            correctSound.play();  // 播放正确的声音
        } else {
            document.getElementById("answer-text").innerHTML = "回答错误<br>正确答案: " + correctAnswer;
            wrongSound.play();  // 播放错误的声音
        }
    });

    // 返回选题页面
    document.getElementById("return-selection").addEventListener("click", () => {
        window.location.href = '/page/选分题-选分页.html';
    });
});a