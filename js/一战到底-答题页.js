document.addEventListener("DOMContentLoaded", () => {
    let correctSound = new Audio('/assets/audio/correct-sound.mp3');
    let wrongSound = new Audio('/assets/audio/wrong-sound.mp3');
    let tickingSound = new Audio('/assets/audio/一战到底计时.mp3');
    let endSound = new Audio('/assets/audio/end-sound.mp3');

    let timerInterval;
    let timerRunning = false;
    let countdownSeconds = 60;  // 默认倒计时
    let timeLeft = countdownSeconds;  // 初始化时保存剩余时间
    let questions = [];
    let correctAnswer = '';

    // 从 URL 获取 tag 参数和 q 参数
    const urlParams = new URLSearchParams(window.location.search);
    const tag = urlParams.get('tag');
    let questionNumber = urlParams.get('q') ? parseInt(urlParams.get('q')) - 1 : 0;

    // 加载 CSV 文件并根据 tag 和 q 加载题目
    Papa.parse('/data/question.csv', {
        download: true,
        header: true,
        complete: function(results) {
            questions = results.data.filter(question => question.tag === tag);
            loadQuestion(questionNumber);
        }
    });

    function setupOptionListeners(type) {
        document.querySelectorAll('input[name="option"]').forEach(option => {
            option.addEventListener('change', function(event) {
                let selectedLabel = document.querySelector(`label[for="${event.target.id}"]`);
                if (event.target.checked) {
                    selectedLabel.style.color = '#007bff';  // 改变选中项的颜色
                } else {
                    selectedLabel.style.color = '';  // 恢复未选中项的颜色
                }

                // 单选题重置其他选项的颜色和状态
                if (type === '单选') {
                    document.querySelectorAll('input[name="option"]:not(:checked)').forEach(opt => {
                        let label = document.querySelector(`label[for="${opt.id}"]`);
                        label.style.color = '';  // 恢复未选中项的颜色
                    });
                }
            });
        });
    }

    // 加载题目
    function loadQuestion(index) {
        if (index >= questions.length) {
            document.getElementById("question-text").textContent = "本轮题目已全部答完";
            document.getElementById("options").innerHTML = '';
            document.getElementById("next-question").style.display = 'none';
            return;
        }

        // 清空答案显示区域
        document.getElementById("answer-text").innerHTML = '';  // 让答案区域为空

        let questionData = questions[index];
        correctAnswer = questionData.correct_answer;  // 确保 correctAnswer 正确设置
        let fontSize = questionData.font_size || 3;  // 获取字体大小

        // 设置题目的字体大小
        document.getElementById("question-text").textContent = questionData.question;
        document.getElementById("question-text").style.fontSize = fontSize + 'vw';

        let options = questionData.options.split('|');
        let optionsContainer = document.getElementById("options");
        optionsContainer.innerHTML = '';

        // 设置选项的字体大小
        options.forEach((option, i) => {
            let optionElement = document.createElement('div');
            optionElement.innerHTML = `
                <input type="${questionData.type === '多选' ? 'checkbox' : 'radio'}" id="option${i}" name="option" value="${String.fromCharCode(65 + i)}">
                <label for="option${i}" id="label${i}" style="font-size: ${fontSize}vw;">${option}</label>
            `;
            optionsContainer.appendChild(optionElement);
        });

        setupOptionListeners(questionData.type);

        // 不重置倒计时，如果已经在运行
        if (!timerRunning) {
            if (questionData.tag.includes('必答题')) {
                countdownSeconds = questionData.type === '多选' ? 10 : 5;
            } else if (questionData.tag.includes('分题')) {
                if (questionData.tag.includes('20分') || questionData.tag.includes('40分')) {
                    countdownSeconds = 10;
                } else if (questionData.tag.includes('60分')) {
                    countdownSeconds = 30;
                }
            }
            timeLeft = countdownSeconds;
            updateTimerDisplay(timeLeft);  // 仅在首次或计时器暂停时更新显示
        }
    }

    // 开始计时函数
    function startTimer() {
        if (timeLeft === undefined || timeLeft <= 0) {
            console.log("倒计时未正确初始化");
            return;
        }

        timerRunning = true;
        tickingSound.play();  // 播放音频
        updateTimerDisplay(timeLeft);

        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                tickingSound.pause();
                endSound.play();
                timerRunning = false;
            }
        }, 1000);
    }

    // 暂停计时函数
    function pauseTimer() {
        clearInterval(timerInterval);  // 暂停计时
        tickingSound.pause();  // 暂停音频
        timerRunning = false;  // 设置状态为暂停
    }

    // 按钮事件
    let startTimerButton = document.getElementById("start-timer");
    startTimerButton.addEventListener("click", () => {
        if (!timerRunning) {
            startTimer();  // 继续计时
        } else {
            pauseTimer();  // 暂停计时
        }
    });

    // 更新倒计时显示
    function updateTimerDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const sec = seconds % 60;
        document.getElementById("timer").textContent = `${minutes.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }

    // 监听 A-H 按键选择选项
    document.addEventListener('keydown', function(event) {
        const key = event.key.toUpperCase();
        const validKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const index = validKeys.indexOf(key);

        if (index !== -1 && document.getElementById(`option${index}`)) {
            const optionInput = document.getElementById(`option${index}`);
            const optionLabel = document.getElementById(`label${index}`);

            // 切换选项的选中状态
            optionInput.checked = !optionInput.checked;  // 切换选项状态

            if (optionInput.checked) {
                optionLabel.style.color = '#b8261e';  // 选中项颜色变为红色
            } else {
                optionLabel.style.color = '';  // 未选中项恢复默认颜色
            }

            // 单选题重置其他选项的颜色和状态
            if (document.querySelector(`input[name="option"][type="radio"]`)) {
                document.querySelectorAll('input[name="option"]:not(:checked)').forEach(opt => {
                    let label = document.querySelector(`label[for="${opt.id}"]`);
                    label.style.color = '';  // 恢复未选中项的颜色
                });
            }
        }

        // 按下回车键时提交答案
        if (event.key === 'Enter') {
            event.preventDefault();
            submitAnswer();
        }
    });

    // 提交答案的函数
    function submitAnswer() {
        const userAnswers = [];
        document.querySelectorAll('input[name="option"]:checked').forEach(input => {
            userAnswers.push(input.value);
        });
        const userAnswerString = userAnswers.sort().join('').trim();

        const answerText = document.getElementById("answer-text");

        // 判断答案是否正确
        if (userAnswerString === correctAnswer) {
            answerText.innerHTML = `回答正确<br>${correctAnswer}`;
            correctSound.play();
        } else {
            answerText.innerHTML = `回答错误<br> ${correctAnswer}`;
            wrongSound.play();
        }

        answerText.style.display = 'block';
    }

    // "下一题"按钮
    document.getElementById("next-question").addEventListener("click", () => {
        questionNumber += 1;
        if (questionNumber < questions.length) {
            loadQuestion(questionNumber);
            window.history.pushState({}, '', `?tag=${encodeURIComponent(tag)}&q=${questionNumber + 1}`);
        } else {
            document.getElementById("question-text").textContent = "本轮题目已全部答完";
            document.getElementById("options").innerHTML = '';
            document.getElementById("next-question").style.display = 'none';
        }
    });

    // 添加点击事件监听器到 "show-answer" 按钮
    document.getElementById("show-answer").addEventListener("click", () => {
        submitAnswer();
    });

    // 返回选题页面
    document.getElementById("return-selection").addEventListener("click", () => {
        window.location.href = '/page/一战到底-选题页.html';
    });
    
});