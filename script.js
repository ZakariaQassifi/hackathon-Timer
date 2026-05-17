 let timerInterval;
        let totalSeconds = 0;
        let isPaused = false;

        const hoursDisplay = document.getElementById('hoursDisplay');
        const minutesDisplay = document.getElementById('minutesDisplay');
        const secondsDisplay = document.getElementById('secondsDisplay');
        
        const setupGroup = document.getElementById('setup-group');
        const activeGroup = document.getElementById('active-group');
        const pauseBtn = document.getElementById('pauseBtn');
        const timesUpText = document.getElementById('times-up-text');

        // Format number to 2 digits
        function pad(num) {
            return num.toString().padStart(2, '0');
        }

        // Calculate total seconds from inputs
        function getSecondsFromInputs() {
            const h = parseInt(document.getElementById('inputHours').value) || 0;
            const m = parseInt(document.getElementById('inputMinutes').value) || 0;
            const s = parseInt(document.getElementById('inputSeconds').value) || 0;
            return (h * 3600) + (m * 60) + s;
        }

        // Update the visual clock
        function updateDisplay(seconds) {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;

            hoursDisplay.textContent = pad(h);
            minutesDisplay.textContent = pad(m);
            secondsDisplay.textContent = pad(s);
        }

        // Preview time when user changes inputs
        function previewTime() {
            if (!timerInterval && !isPaused) {
                updateDisplay(getSecondsFromInputs());
            }
        }

        function startTimer() {
            if (!isPaused && totalSeconds === 0) {
                totalSeconds = getSecondsFromInputs();
            }

            if (totalSeconds <= 0) {
                alert("Please set a time greater than 0!");
                return;
            }

            // UI Transitions
            setupGroup.classList.add('hidden');
            activeGroup.classList.remove('hidden');
            document.body.classList.remove('times-up-state');
            timesUpText.classList.remove('active');

            // Reset pause button state
            pauseBtn.textContent = 'Pause';
            pauseBtn.className = 'btn-yellow';
            pauseBtn.style.display = 'block';
            isPaused = false;

            updateDisplay(totalSeconds);
            clearInterval(timerInterval);

            // Start countdown
            timerInterval = setInterval(() => {
                totalSeconds--;
                updateDisplay(totalSeconds);

                if (totalSeconds <= 0) {
                    triggerTimeIsUp();
                }
            }, 1000);
        }

        function togglePause() {
            if (isPaused) {
                startTimer(); // RESUME
            } else {
                clearInterval(timerInterval); // PAUSE
                isPaused = true;
                pauseBtn.textContent = 'Resume';
                pauseBtn.className = 'btn-cyan';
            }
        }

        function resetTimer() {
            clearInterval(timerInterval);
            totalSeconds = 0;
            isPaused = false;

            document.body.classList.remove('times-up-state');
            timesUpText.classList.remove('active');

            activeGroup.classList.add('hidden');
            setupGroup.classList.remove('hidden');

            previewTime();
        }

        function triggerTimeIsUp() {
            clearInterval(timerInterval);
            totalSeconds = 0;
            isPaused = false;
            updateDisplay(0);

            // Active les effets visuels de fin
            document.body.classList.add('times-up-state');
            timesUpText.classList.add('active');

            // Cache le bouton Pause
            pauseBtn.style.display = 'none';
        }
        
        // Initialisation de l'affichage
        previewTime();

        // --- Space Background Animation ---
        (function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '-1';
            canvas.style.background = '#030812';
            
            document.body.appendChild(canvas);

            let width, height, stars = [];
            const starCount = 400;

            function resize() {
                width = window.innerWidth;
                height = window.innerHeight;
                canvas.width = width;
                canvas.height = height;
            }

            window.addEventListener('resize', resize);
            resize();

            class Star {
                constructor() {
                    this.init();
                }

                init() {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.z = Math.random() * width; // Depth
                    this.velocity = 1 + Math.random() * 3;
                }

                update() {
                    this.z -= this.velocity;
                    if (this.z <= 0) {
                        this.init();
                        this.z = width;
                    }
                }

                draw() {
                    // Project 3D to 2D
                    let sx = (this.x - width / 2) * (width / this.z) + width / 2;
                    let sy = (this.y - height / 2) * (width / this.z) + height / 2;
                    let size = (1 - this.z / width) * 3;
                    
                    if (sx < 0 || sx > width || sy < 0 || sy > height) return;

                    ctx.beginPath();
                    ctx.fillStyle = "rgba(255, 255, 255, " + (1 - this.z / width) + ")";
                    ctx.arc(sx, sy, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            for (let i = 0; i < starCount; i++) {
                stars.push(new Star());
            }

            function animate() {
                ctx.fillStyle = '#030812';
                ctx.fillRect(0, 0, width, height);
                
                stars.forEach(star => {
                    star.update();
                    star.draw();
                });
                
                requestAnimationFrame(animate);
            }

            animate();
        })();