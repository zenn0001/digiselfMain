/**
 * Enhanced Digital Self & Mental Well-being Section
 * Modern ES6+ class-based architecture with comprehensive mental health features
 * Author: Digital Self Project Team
 * Date: 2024
 */

console.log('Digital Self & Mental Well-being JavaScript loading...');

// Utility Classes
class Utils {
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    static formatTime(hours) {
        if (hours < 1) {
            return `${Math.round(hours * 60)}min`;
        }
        return `${hours}h${hours % 1 > 0 ? ` ${Math.round((hours % 1) * 60)}min` : ''}`;
    }

    static getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        return 'evening';
    }

    static saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.warn('Local storage save failed:', error);
            return false;
        }
    }

    static loadFromLocalStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.warn('Local storage load failed:', error);
            return defaultValue;
        }
    }
}

// Animation Controller
class AnimationController {
    constructor() {
        this.observer = null;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        if (this.prefersReducedMotion) return;

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        this.setupAnimations();
    }

    setupAnimations() {
        // Animate elements as they come into view
        const animatedElements = document.querySelectorAll(`
            .hero-content, .hero-visual, .overview-content, .overview-visual,
            .pillar-card, .insight-card, .strategy-category, .principle-card,
            .check-in-card, .nav-card
        `);

        animatedElements.forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${index * 0.1}s`;
            this.observer?.observe(el);
        });
    }

    animateWellnessMeter() {
        const meter = document.querySelector('.wellness-meter');
        if (!meter) return;

        const factors = meter.querySelectorAll('.factor');
        factors.forEach((factor, index) => {
            factor.style.animation = `float ${2 + index * 0.5}s ease-in-out infinite alternate`;
        });
    }
}

// Navigation Controller
class NavigationController {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        this.setupHamburgerMenu();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
        this.setupKeyboardNavigation();
    }    setupHamburgerMenu() {
        if (!this.hamburger || !this.navMenu) return;

        this.hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            const isExpanded = this.hamburger.getAttribute('aria-expanded') === 'true';
            
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('active');
            this.hamburger.setAttribute('aria-expanded', !isExpanded);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
            
            // Focus management
            if (!isExpanded) {
                this.navMenu.querySelector('.nav-link')?.focus();
            }
        });

        // Close menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.hamburger.setAttribute('aria-expanded', 'false');
                this.hamburger.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navMenu.classList.contains('active') && 
                !this.navMenu.contains(e.target) && 
                !this.hamburger.contains(e.target)) {
                
                this.hamburger.classList.remove('active');
                this.navMenu.classList.remove('active');
                this.hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            }
        });
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    setupScrollEffects() {
        let lastScrollY = window.scrollY;

        const handleScroll = Utils.throttle(() => {
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class for navbar styling
            if (currentScrollY > 100) {
                this.navbar?.classList.add('scrolled');
            } else {
                this.navbar?.classList.remove('scrolled');
            }

            lastScrollY = currentScrollY;
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }

    setupKeyboardNavigation() {
        // Ensure keyboard navigation works for custom elements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu?.classList.contains('active')) {
                this.navMenu.classList.remove('active');
                this.hamburger?.setAttribute('aria-expanded', 'false');
                this.hamburger?.classList.remove('active');
                this.hamburger?.focus();
            }
        });
    }
}

// Digital Wellness Assessment
class WellnessAssessment {
    constructor() {
        this.container = document.querySelector('.assessment-container');
        this.questions = document.querySelectorAll('.question-item');
        this.scoreDisplay = document.querySelector('.score-number');
        this.scoreInterpretation = document.querySelector('.score-interpretation');
        this.scoreRecommendations = document.querySelector('.score-recommendations');
        this.currentScore = 0;
        this.init();
    }

    init() {
        if (!this.container) return;
        this.setupRadioHandlers();
        this.loadSavedAssessment();
    }

    setupRadioHandlers() {
        const radioInputs = this.container.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(radio => {
            radio.addEventListener('change', () => {
                this.calculateScore();
                this.saveAssessment();
            });
        });
    }

    calculateScore() {
        let totalScore = 0;
        let answeredQuestions = 0;

        for (let i = 1; i <= 5; i++) {
            const selectedRadio = this.container.querySelector(`input[name="q${i}"]:checked`);
            if (selectedRadio) {
                totalScore += parseInt(selectedRadio.value);
                answeredQuestions++;
            }
        }

        this.currentScore = totalScore;
        this.updateScoreDisplay();
        this.updateInterpretation(answeredQuestions);
    }

    updateScoreDisplay() {
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = this.currentScore;
            
            // Animate the score change
            this.scoreDisplay.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.scoreDisplay.style.transform = 'scale(1)';
            }, 200);
        }
    }

    updateInterpretation(answeredQuestions) {
        if (!this.scoreInterpretation || answeredQuestions === 0) return;

        let interpretation = '';
        let recommendations = [];

        if (this.currentScore >= 20) {
            interpretation = '🌟 Excellent digital wellness! You have strong, mindful technology habits.';
            recommendations = [
                'Keep up your excellent digital wellness practices',
                'Consider sharing your strategies with others',
                'Stay mindful of any changes in your habits'
            ];
        } else if (this.currentScore >= 15) {
            interpretation = '✅ Good digital wellness with room for improvement.';
            recommendations = [
                'Focus on areas where you scored lower',
                'Set specific goals for improvement',
                'Practice daily digital mindfulness check-ins'
            ];
        } else if (this.currentScore >= 10) {
            interpretation = '⚠️ Moderate digital wellness. Several areas need attention.';
            recommendations = [
                'Start with one specific area to improve',
                'Consider using screen time tracking tools',
                'Set boundaries around device-free times'
            ];
        } else {
            interpretation = '🔄 Your digital wellness needs significant attention.';
            recommendations = [
                'Begin with basic digital boundaries',
                'Consider seeking support or resources',
                'Start small with manageable changes'
            ];
        }

        this.scoreInterpretation.textContent = interpretation;
        
        if (this.scoreRecommendations) {
            this.scoreRecommendations.innerHTML = `
                <h5>Recommendations:</h5>
                <ul>
                    ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            `;
        }
    }

    saveAssessment() {
        const responses = {};
        for (let i = 1; i <= 5; i++) {
            const selectedRadio = this.container.querySelector(`input[name="q${i}"]:checked`);
            if (selectedRadio) {
                responses[`q${i}`] = selectedRadio.value;
            }
        }
        Utils.saveToLocalStorage('wellness_assessment', responses);
    }

    loadSavedAssessment() {
        const saved = Utils.loadFromLocalStorage('wellness_assessment', {});
        Object.entries(saved).forEach(([question, value]) => {
            const radio = this.container.querySelector(`input[name="${question}"][value="${value}"]`);
            if (radio) {
                radio.checked = true;
            }
        });
        this.calculateScore();
    }
}

// Screen Time Tracker
class ScreenTimeTracker {
    constructor() {
        this.container = document.querySelector('.tracker-container');
        this.inputs = {
            socialMedia: document.getElementById('social-media-time'),
            work: document.getElementById('work-time'),
            entertainment: document.getElementById('entertainment-time'),
            communication: document.getElementById('communication-time')
        };
        this.logButton = document.querySelector('.log-time-btn');
        this.totalDisplay = document.getElementById('total-screen-time');
        this.chart = document.getElementById('screen-time-chart');
        this.recommendationsList = document.querySelector('.recommendations-list');
        this.weeklyData = Utils.loadFromLocalStorage('screen_time_data', []);
        this.init();
    }

    init() {
        if (!this.container) return;
        this.setupEventListeners();
        this.updateVisualization();
        this.loadTodaysData();
    }

    setupEventListeners() {
        if (this.logButton) {
            this.logButton.addEventListener('click', () => this.logTodaysTime());
        }

        // Real-time total calculation
        Object.values(this.inputs).forEach(input => {
            if (input) {
                input.addEventListener('input', Utils.debounce(() => {
                    this.updateTotal();
                }, 300));
            }
        });
    }

    updateTotal() {
        const total = Object.values(this.inputs).reduce((sum, input) => {
            return sum + (parseFloat(input?.value || 0) || 0);
        }, 0);

        if (this.totalDisplay) {
            this.totalDisplay.textContent = Utils.formatTime(total);
        }

        this.generateRecommendations(total);
    }

    generateRecommendations(total) {
        if (!this.recommendationsList) return;

        const recommendations = [];
        
        if (total > 8) {
            recommendations.push('⚠️ Consider reducing overall screen time');
            recommendations.push('📱 Set app time limits');
            recommendations.push('🚶 Take regular breaks every hour');
        } else if (total > 6) {
            recommendations.push('⏰ Monitor usage patterns');
            recommendations.push('🌙 Avoid screens 1 hour before bed');
        } else if (total > 3) {
            recommendations.push('✅ Good balance maintained');
            recommendations.push('🧘 Practice mindful usage');
        } else {
            recommendations.push('💚 Excellent screen time management!');
        }

        // Check for social media heavy usage
        const socialMediaTime = parseFloat(this.inputs.socialMedia?.value || 0);
        if (socialMediaTime > 3) {
            recommendations.push('📲 High social media use detected - consider mindful consumption');
        }

        this.recommendationsList.innerHTML = recommendations
            .map(rec => `<div class="recommendation">${rec}</div>`)
            .join('');
    }

    logTodaysTime() {
        const today = new Date().toISOString().split('T')[0];
        const data = {
            date: today,
            socialMedia: parseFloat(this.inputs.socialMedia?.value || 0),
            work: parseFloat(this.inputs.work?.value || 0),
            entertainment: parseFloat(this.inputs.entertainment?.value || 0),
            communication: parseFloat(this.inputs.communication?.value || 0)
        };

        // Remove existing entry for today if it exists
        this.weeklyData = this.weeklyData.filter(entry => entry.date !== today);
        
        // Add new entry
        this.weeklyData.push(data);
        
        // Keep only last 7 days
        this.weeklyData = this.weeklyData.slice(-7);
        
        Utils.saveToLocalStorage('screen_time_data', this.weeklyData);
        this.updateVisualization();
        
        // Show success feedback
        this.showLogSuccess();
    }

    loadTodaysData() {
        const today = new Date().toISOString().split('T')[0];
        const todaysData = this.weeklyData.find(entry => entry.date === today);
        
        if (todaysData) {
            Object.entries(this.inputs).forEach(([key, input]) => {
                if (input && todaysData[key]) {
                    input.value = todaysData[key];
                }
            });
            this.updateTotal();
        }
    }

    updateVisualization() {
        if (!this.chart || this.weeklyData.length === 0) return;

        const ctx = this.chart.getContext('2d');
        const width = this.chart.width;
        const height = this.chart.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Calculate max value for scaling
        const maxValue = Math.max(...this.weeklyData.map(day => 
            day.socialMedia + day.work + day.entertainment + day.communication
        ));

        if (maxValue === 0) return;

        // Draw bars
        const barWidth = width / this.weeklyData.length * 0.8;
        const spacing = width / this.weeklyData.length * 0.2;

        this.weeklyData.forEach((day, index) => {
            const x = index * (barWidth + spacing) + spacing / 2;
            const total = day.socialMedia + day.work + day.entertainment + day.communication;
            const barHeight = (total / maxValue) * (height - 40);

            // Stack the bars
            let currentY = height - 20;
            const categories = [
                { value: day.work, color: '#6366f1' },
                { value: day.socialMedia, color: '#10b981' },
                { value: day.entertainment, color: '#f59e0b' },
                { value: day.communication, color: '#ef4444' }
            ];

            categories.forEach(category => {
                if (category.value > 0) {
                    const segmentHeight = (category.value / maxValue) * (height - 40);
                    ctx.fillStyle = category.color;
                    ctx.fillRect(x, currentY - segmentHeight, barWidth, segmentHeight);
                    currentY -= segmentHeight;
                }
            });

            // Draw date label
            ctx.fillStyle = '#6b7280';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            const date = new Date(day.date);
            const dayLabel = date.toLocaleDateString('en', { weekday: 'short' });
            ctx.fillText(dayLabel, x + barWidth / 2, height - 5);
        });
    }

    showLogSuccess() {
        if (!this.logButton) return;
        
        const originalText = this.logButton.textContent;
        this.logButton.textContent = '✓ Logged!';
        this.logButton.style.background = '#22c55e';
        
        setTimeout(() => {
            this.logButton.textContent = originalText;
            this.logButton.style.background = '';
        }, 2000);
    }
}

// Mindfulness Exercise Controller
class MindfulnessController {
    constructor() {
        this.exerciseContainer = document.querySelector('.exercises-container');
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.exercisePanels = document.querySelectorAll('.exercise-panel');
        this.exerciseButtons = document.querySelectorAll('.try-exercise-btn');
        this.activeExercise = null;
        this.init();
    }

    init() {
        if (!this.exerciseContainer) return;
        this.setupTabNavigation();
        this.setupExerciseButtons();
    }

    setupTabNavigation() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(targetTab) {
        // Update button states
        this.tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === targetTab);
        });

        // Update panel visibility
        this.exercisePanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === `${targetTab}-panel`);
        });
    }

    setupExerciseButtons() {
        this.exerciseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const exerciseType = button.getAttribute('data-exercise');
                this.startGuidedExercise(exerciseType);
            });
        });
    }

    startGuidedExercise(type) {
        // Stop any active exercise
        if (this.activeExercise) {
            this.stopExercise();
        }

        const exercises = {
            'transition': this.createTransitionExercise(),
            'body-scan': this.createBodyScanExercise(),
            'consumption': this.createConsumptionExercise(),
            'disconnect': this.createDisconnectExercise()
        };

        if (exercises[type]) {
            this.activeExercise = exercises[type];
            this.showExerciseModal(this.activeExercise);
        }
    }    createTransitionExercise() {
        return {
            title: 'Mindful Device Transition',
            description: 'Practice conscious intention-setting before using any digital device. This exercise helps create healthy boundaries and reduces mindless scrolling.',
            duration: '3-5 minutes',
            benefits: [
                'Reduces mindless device usage',
                'Increases digital awareness',
                'Helps set healthy boundaries',
                'Promotes intentional engagement'
            ],
            steps: [
                { 
                    text: 'Pause before picking up or opening your device',
                    guidance: 'Take a moment to simply breathe and center yourself',
                    duration: 20000 
                },
                { 
                    text: 'Take three conscious breaths',
                    guidance: 'Focus on the sensation of breathing. Let each breath bring you into the present moment',
                    duration: 30000 
                },
                { 
                    text: 'Set a clear intention for your device use',
                    guidance: 'Ask yourself: "What do I hope to accomplish?" Be specific about your purpose',
                    duration: 25000 
                },
                { 
                    text: 'Notice your emotional state and energy level',
                    guidance: 'Check in with how you\'re feeling. Are you stressed, bored, or genuinely purposeful?',
                    duration: 20000 
                },
                { 
                    text: 'Proceed with awareness or choose a different activity',
                    guidance: 'Based on your intention and current state, mindfully decide whether to continue or do something else',
                    duration: 15000 
                }
            ]
        };
    }    createBodyScanExercise() {
        return {
            title: 'Digital Body Scan',
            description: 'Check in with your physical well-being while using technology. This practice helps prevent digital strain and promotes body awareness.',
            duration: '4-6 minutes',
            benefits: [
                'Prevents digital strain and tension',
                'Increases body awareness',
                'Promotes better posture',
                'Reduces eye strain and fatigue'
            ],
            steps: [
                { 
                    text: 'Pause your current digital activity',
                    guidance: 'Gently stop what you\'re doing and turn your attention inward',
                    duration: 15000 
                },
                { 
                    text: 'Notice your posture and breathing',
                    guidance: 'Are you slouching? Is your breathing shallow? Simply observe without judgment',
                    duration: 25000 
                },
                { 
                    text: 'Scan for tension in your neck, shoulders, and face',
                    guidance: 'Feel for any tightness or strain. Notice if your jaw is clenched or shoulders raised',
                    duration: 30000 
                },
                { 
                    text: 'Check your eyes and vision',
                    guidance: 'Are your eyes dry or strained? Try blinking slowly or looking at something distant',
                    duration: 20000 
                },
                { 
                    text: 'Make gentle adjustments or take a movement break',
                    guidance: 'Stretch your neck, roll your shoulders, or step away from the screen if needed',
                    duration: 25000 
                }
            ]
        };
    }    createConsumptionExercise() {
        return {
            title: 'Mindful Content Consumption',
            description: 'Develop conscious awareness of how digital content affects your emotions and mental state. Practice intentional engagement with online media.',
            duration: '5-8 minutes',
            benefits: [
                'Reduces emotional reactivity to content',
                'Promotes mindful media consumption',
                'Helps break scrolling habits',
                'Improves digital content choices'
            ],
            steps: [
                { 
                    text: 'Set a clear intention before opening social media or news',
                    guidance: 'Ask yourself: "What am I looking for?" and "How much time will I spend?"',
                    duration: 20000 
                },
                { 
                    text: 'Notice your emotional response to each piece of content',
                    guidance: 'Pause briefly after reading or viewing. How does this make you feel?',
                    duration: 35000 
                },
                { 
                    text: 'Ask yourself: "Is this serving my well-being?"',
                    guidance: 'Consider whether this content adds value or contributes to stress/comparison',
                    duration: 25000 
                },
                { 
                    text: 'Choose to engage mindfully or scroll past',
                    guidance: 'Make conscious choices about what deserves your attention and energy',
                    duration: 30000 
                },
                { 
                    text: 'End when you\'ve achieved your original intention',
                    guidance: 'Resist the urge to continue scrolling. Close the app with intention',
                    duration: 20000 
                }
            ]
        };
    }    createDisconnectExercise() {
        return {
            title: 'Mindful Disconnection',
            description: 'Practice ending digital sessions with awareness and grace. This helps create healthy transitions and reduces digital dependency.',
            duration: '3-4 minutes',
            benefits: [
                'Creates conscious digital boundaries',
                'Reduces FOMO and anxiety',
                'Promotes healthy transitions',
                'Builds digital self-control'
            ],
            steps: [
                { 
                    text: 'Notice any urge to continue using the device',
                    guidance: 'Acknowledge any resistance or FOMO without acting on it immediately',
                    duration: 20000 
                },
                { 
                    text: 'Acknowledge resistance without judgment',
                    guidance: 'It\'s normal to want to keep scrolling. Notice this feeling with kindness',
                    duration: 25000 
                },
                { 
                    text: 'Take three deep, conscious breaths',
                    guidance: 'Let each breath create space between you and the urge to continue',
                    duration: 30000 
                },
                { 
                    text: 'Appreciate what you accomplished during this session',
                    guidance: 'Acknowledge any positive interactions, learning, or connection you experienced',
                    duration: 20000 
                },
                { 
                    text: 'Consciously transition to your next activity',
                    guidance: 'Set a clear intention for what you\'ll do next, moving mindfully forward',
                    duration: 15000 
                }
            ]
        };
    }    showExerciseModal(exercise) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'exercise-modal';
        modal.innerHTML = `
            <div class="exercise-modal-content enhanced">
                <div class="exercise-header">
                    <div class="exercise-icon">${this.getExerciseIcon(exercise.title)}</div>
                    <h2>${exercise.title}</h2>
                    <p class="exercise-description">${exercise.description}</p>
                    <button class="close-exercise" aria-label="Close exercise">×</button>
                </div>
                
                <div class="exercise-intro">
                    <div class="exercise-benefits">
                        <h4>Benefits of this exercise:</h4>
                        <ul>
                            ${exercise.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="exercise-duration">
                        <span class="duration-label">Estimated time:</span>
                        <span class="duration-time">${exercise.duration}</span>
                    </div>
                </div>
                
                <div class="exercise-progress hidden">
                    <div class="progress-header">
                        <h4>Progress</h4>
                        <div class="step-counter">Step <span class="current-step">1</span> of ${exercise.steps.length}</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                </div>
                
                <div class="exercise-content">
                    <div class="exercise-welcome">
                        <h3>Ready to begin?</h3>
                        <p>Find a comfortable position and prepare to engage mindfully with this exercise.</p>
                        <div class="intention-input">
                            <label for="exercise-intention">Set your intention (optional):</label>
                            <input type="text" id="exercise-intention" placeholder="e.g., To feel more present and calm...">
                        </div>
                    </div>
                    
                    <div class="exercise-instruction hidden"></div>
                    
                    <div class="exercise-timer hidden">
                        <div class="timer-circle">
                            <svg class="timer-ring" width="120" height="120">
                                <circle class="timer-ring-bg" cx="60" cy="60" r="54" fill="transparent" stroke="#e2e8f0" stroke-width="8"/>
                                <circle class="timer-ring-progress" cx="60" cy="60" r="54" fill="transparent" stroke="#10b981" stroke-width="8" stroke-linecap="round"/>
                            </svg>
                            <div class="timer-content">
                                <span class="timer-text">00:00</span>
                                <span class="timer-label">remaining</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="exercise-controls">
                    <button class="start-exercise-btn primary-btn">
                        <span class="btn-icon">▶</span>
                        Start Exercise
                    </button>
                    <button class="pause-btn secondary-btn hidden">⏸ Pause</button>
                    <button class="resume-btn secondary-btn hidden">▶ Resume</button>
                    <button class="skip-btn tertiary-btn hidden">⏭ Skip Step</button>
                    <button class="finish-btn success-btn hidden">✓ Complete</button>
                </div>
                
                <div class="exercise-footer">
                    <div class="mindfulness-tip">
                        <strong>Mindfulness Tip:</strong> <span class="tip-text">Remember, there's no perfect way to do this exercise. Simply notice when your mind wanders and gently return your attention.</span>
                    </div>
                </div>
            </div>
        `;

        // Add enhanced styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;

        document.body.appendChild(modal);
        this.setupModalInteractions(modal, exercise);
    }

    getExerciseIcon(title) {
        const iconMap = {
            'Mindful Device Transition': '📱➡️🧘',
            'Digital Body Scan': '🧘‍♀️',
            'Mindful Content Consumption': '👁️',
            'Mindful Disconnection': '🌱'
        };
        return iconMap[title] || '🧘';
    }

    setupModalInteractions(modal, exercise) {
        // Close functionality
        modal.querySelector('.close-exercise').addEventListener('click', () => {
            this.stopExercise();
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.stopExercise();
                document.body.removeChild(modal);
            }
        });

        // Exercise controls
        modal.querySelector('.start-exercise-btn').addEventListener('click', () => {
            this.startExercise(modal, exercise);
        });

        modal.querySelector('.pause-btn').addEventListener('click', () => {
            this.pauseExercise(modal);
        });

        modal.querySelector('.resume-btn').addEventListener('click', () => {
            this.resumeExercise(modal);
        });

        modal.querySelector('.skip-btn').addEventListener('click', () => {
            this.skipStep(modal, exercise);
        });

        modal.querySelector('.finish-btn').addEventListener('click', () => {
            this.completeExercise(modal);
        });
    }

    startExercise(modal, exercise) {
        // Hide welcome, show progress
        modal.querySelector('.exercise-welcome').classList.add('hidden');
        modal.querySelector('.exercise-progress').classList.remove('hidden');
        modal.querySelector('.exercise-instruction').classList.remove('hidden');
        modal.querySelector('.exercise-timer').classList.remove('hidden');
        
        // Update controls
        modal.querySelector('.start-exercise-btn').classList.add('hidden');
        modal.querySelector('.pause-btn').classList.remove('hidden');
        modal.querySelector('.skip-btn').classList.remove('hidden');
        modal.querySelector('.finish-btn').classList.remove('hidden');

        this.runExercise(modal, exercise);
    }    runExercise(modal, exercise) {
        let currentStep = 0;
        let isPaused = false;
        let timer;

        const progressFill = modal.querySelector('.progress-fill');
        const stepCounter = modal.querySelector('.current-step');
        const instruction = modal.querySelector('.exercise-instruction');
        const timerText = modal.querySelector('.timer-text');
        const timerRing = modal.querySelector('.timer-ring-progress');
        const pauseBtn = modal.querySelector('.pause-btn');
        const resumeBtn = modal.querySelector('.resume-btn');
        const skipBtn = modal.querySelector('.skip-btn');

        const runStep = () => {
            if (currentStep >= exercise.steps.length) {
                this.completeExercise(modal);
                return;
            }

            const step = exercise.steps[currentStep];
            
            // Update instruction with guidance
            instruction.innerHTML = `
                <div class="step-content">
                    <h4>Step ${currentStep + 1}</h4>
                    <p>${step.text}</p>
                    <div class="step-guidance">${step.guidance}</div>
                </div>
            `;
            
            stepCounter.textContent = currentStep + 1;

            let timeLeft = step.duration;
            const startTime = Date.now();

            // Setup timer ring
            const circumference = 2 * Math.PI * 54;
            timerRing.style.strokeDasharray = circumference;
            timerRing.style.strokeDashoffset = circumference;

            const updateTimer = () => {
                if (isPaused) return;

                const elapsed = Date.now() - startTime;
                timeLeft = Math.max(0, step.duration - elapsed);
                
                const seconds = Math.ceil(timeLeft / 1000);
                const minutes = Math.floor(seconds / 60);
                const displaySeconds = seconds % 60;
                timerText.textContent = `${minutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;

                // Update timer ring
                const progress = (step.duration - timeLeft) / step.duration;
                const offset = circumference - (progress * circumference);
                timerRing.style.strokeDashoffset = offset;

                // Update overall progress
                const overallProgress = ((currentStep + progress) / exercise.steps.length) * 100;
                progressFill.style.width = `${overallProgress}%`;

                if (timeLeft > 0) {
                    timer = setTimeout(updateTimer, 100);
                } else {
                    currentStep++;
                    setTimeout(runStep, 1000);
                }
            };

            updateTimer();
        };

        // Control buttons
        pauseBtn.addEventListener('click', () => {
            isPaused = true;
            pauseBtn.classList.add('hidden');
            resumeBtn.classList.remove('hidden');
        });

        resumeBtn.addEventListener('click', () => {
            isPaused = false;
            resumeBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
        });

        skipBtn.addEventListener('click', () => {
            clearTimeout(timer);
            currentStep++;
            runStep();
        });

        runStep();
    }

    pauseExercise(modal) {
        // Already handled in runExercise
    }

    resumeExercise(modal) {
        // Already handled in runExercise
    }

    skipStep(modal, exercise) {
        // Already handled in runExercise
    }    completeExercise(modal) {
        modal.querySelector('.exercise-content').innerHTML = `
            <div class="exercise-complete">
                <div class="complete-icon">✨</div>
                <h3>Exercise Complete!</h3>
                <p>Take a moment to notice how you feel after this mindful practice.</p>
                <div class="completion-reflection">
                    <label for="post-exercise-reflection">How do you feel? (optional)</label>
                    <textarea id="post-exercise-reflection" placeholder="Reflect on your experience..." rows="3"></textarea>
                </div>
            </div>
        `;

        modal.querySelector('.exercise-controls').style.display = 'none';
        modal.querySelector('.exercise-progress').style.display = 'none';
        
        // Auto-close after 10 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                this.stopExercise();
                document.body.removeChild(modal);
            }
        }, 10000);
    }

    stopExercise() {
        this.activeExercise = null;
    }
}

// Daily Check-in System
class DailyCheckIn {
    constructor() {
        this.morningCard = document.querySelector('.check-in-card.morning');
        this.middayCard = document.querySelector('.check-in-card.midday');
        this.eveningCard = document.querySelector('.check-in-card.evening');
        this.todayKey = new Date().toISOString().split('T')[0];
        this.checkInData = Utils.loadFromLocalStorage('daily_checkin', {});
        this.init();
    }

    init() {
        if (!this.morningCard) return;
        this.setupMorningCheckin();
        this.setupMiddayCheckin();
        this.setupEveningCheckin();
        this.loadTodaysData();
    }

    setupMorningCheckin() {
        const textarea = this.morningCard.querySelector('textarea');
        const saveBtn = this.morningCard.querySelector('.save-intention-btn');

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const intention = textarea?.value || '';
                this.saveCheckInData('morning', { intention });
                this.showSaveSuccess(saveBtn);
            });
        }
    }

    setupMiddayCheckin() {
        const moodButtons = this.middayCard.querySelectorAll('.mood-btn');
        const textarea = this.middayCard.querySelector('textarea');

        moodButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                moodButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const mood = btn.getAttribute('data-mood');
                const notes = textarea?.value || '';
                this.saveCheckInData('midday', { mood, notes });
            });
        });
    }

    setupEveningCheckin() {
        const inputs = this.eveningCard.querySelectorAll('input');
        const saveBtn = this.eveningCard.querySelector('.save-reflection-btn');

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const reflection = {};
                inputs.forEach((input, index) => {
                    reflection[index === 0 ? 'wentWell' : 'toAdjust'] = input.value;
                });
                this.saveCheckInData('evening', reflection);
                this.showSaveSuccess(saveBtn);
            });
        }
    }

    saveCheckInData(period, data) {
        if (!this.checkInData[this.todayKey]) {
            this.checkInData[this.todayKey] = {};
        }
        
        this.checkInData[this.todayKey][period] = {
            ...data,
            timestamp: new Date().toISOString()
        };

        Utils.saveToLocalStorage('daily_checkin', this.checkInData);
    }

    loadTodaysData() {
        const todaysData = this.checkInData[this.todayKey];
        if (!todaysData) return;

        // Load morning data
        if (todaysData.morning?.intention) {
            const textarea = this.morningCard.querySelector('textarea');
            if (textarea) textarea.value = todaysData.morning.intention;
        }

        // Load midday data
        if (todaysData.midday?.mood) {
            const moodBtn = this.middayCard.querySelector(`[data-mood="${todaysData.midday.mood}"]`);
            if (moodBtn) moodBtn.classList.add('active');
        }
        if (todaysData.midday?.notes) {
            const textarea = this.middayCard.querySelector('textarea');
            if (textarea) textarea.value = todaysData.midday.notes;
        }

        // Load evening data
        if (todaysData.evening) {
            const inputs = this.eveningCard.querySelectorAll('input');
            if (inputs[0] && todaysData.evening.wentWell) {
                inputs[0].value = todaysData.evening.wentWell;
            }
            if (inputs[1] && todaysData.evening.toAdjust) {
                inputs[1].value = todaysData.evening.toAdjust;
            }
        }
    }

    showSaveSuccess(button) {
        const originalText = button.textContent;
        button.textContent = '✓ Saved!';
        button.style.background = '#22c55e';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }
}

// Wellness Meter Controller
class WellnessMeterController {
    constructor() {
        this.meterElement = document.querySelector('.wellness-meter');
        this.meterValue = document.querySelector('.meter-value');
        this.factors = document.querySelectorAll('.factor');
        this.wellnessScore = 75; // Default score
        this.init();
    }

    init() {
        if (!this.meterElement) return;
        this.setupFactorInteractions();
        this.calculateWellnessScore();
        this.animateMeter();
    }

    setupFactorInteractions() {
        this.factors.forEach(factor => {
            factor.addEventListener('click', () => this.showFactorInfo(factor));
            factor.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.showFactorInfo(factor);
                }
            });
        });
    }

    showFactorInfo(factor) {
        const factorType = factor.classList[1]; // sleep, focus, mood, connection
        const info = this.getFactorInfo(factorType);
        
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'factor-tooltip';
        tooltip.innerHTML = `
            <h4>${info.title}</h4>
            <p>${info.description}</p>
            <div class="tips">
                <strong>Quick Tips:</strong>
                <ul>
                    ${info.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        `;

        // Position and show tooltip
        document.body.appendChild(tooltip);
        this.positionTooltip(tooltip, factor);

        // Remove tooltip after delay or on click
        setTimeout(() => {
            if (document.body.contains(tooltip)) {
                document.body.removeChild(tooltip);
            }
        }, 5000);

        document.addEventListener('click', function removeTooltip() {
            if (document.body.contains(tooltip)) {
                document.body.removeChild(tooltip);
            }
            document.removeEventListener('click', removeTooltip);
        });
    }

    getFactorInfo(type) {
        const factorData = {
            sleep: {
                title: 'Sleep Quality',
                description: 'Quality sleep is crucial for mental health, emotional regulation, and cognitive function.',
                tips: [
                    'Avoid screens 1-2 hours before bed',
                    'Keep devices out of the bedroom',
                    'Use blue light filters in evening'
                ]
            },
            focus: {
                title: 'Focus & Attention',
                description: 'Digital multitasking can fragment attention and reduce productivity.',
                tips: [
                    'Practice single-tasking',
                    'Use focus apps and timers',
                    'Take regular breaks from screens'
                ]
            },
            mood: {
                title: 'Mood & Emotions',
                description: 'Social media and digital interactions can significantly impact emotional well-being.',
                tips: [
                    'Curate positive content feeds',
                    'Limit comparison-inducing platforms',
                    'Practice digital gratitude'
                ]
            },
            connection: {
                title: 'Social Connection',
                description: 'Quality relationships are essential for mental health and life satisfaction.',
                tips: [
                    'Prioritize face-to-face interactions',
                    'Use technology to enhance real relationships',
                    'Join communities aligned with your values'
                ]
            }
        };
        return factorData[type];
    }

    positionTooltip(tooltip, factor) {
        const rect = factor.getBoundingClientRect();
        tooltip.style.cssText = `
            position: fixed;
            top: ${rect.bottom + 10}px;
            left: ${rect.left + rect.width / 2}px;
            transform: translateX(-50%);
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            max-width: 300px;
            font-size: 0.875rem;
        `;
    }

    calculateWellnessScore() {
        // This could be enhanced to calculate based on user data
        // For now, we'll use assessment data if available
        const assessmentData = Utils.loadFromLocalStorage('wellness_assessment', {});
        const checkInData = Utils.loadFromLocalStorage('daily_checkin', {});
        
        let score = 75; // Base score
        
        // Adjust based on assessment if available
        if (Object.keys(assessmentData).length > 0) {
            const assessmentScore = Object.values(assessmentData).reduce((sum, val) => sum + parseInt(val), 0);
            score = (assessmentScore / 25) * 100;
        }
        
        this.updateMeterValue(Math.round(score));
    }

    updateMeterValue(score) {
        this.wellnessScore = score;
        if (this.meterValue) {
            this.meterValue.textContent = `${score}%`;
        }
    }

    animateMeter() {
        if (!this.meterElement) return;
        
        // Subtle floating animation for factors
        this.factors.forEach((factor, index) => {
            factor.style.animation = `float ${2 + index * 0.3}s ease-in-out infinite alternate`;
        });
    }
}

// Main Application Controller
class DigitalWellbeingApp {
    constructor() {
        this.components = {};
        this.isInitialized = false;
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Initialize all components
            this.components.animation = new AnimationController();
            this.components.navigation = new NavigationController();
            this.components.assessment = new WellnessAssessment();
            this.components.screenTime = new ScreenTimeTracker();
            this.components.mindfulness = new MindfulnessController();
            this.components.checkIn = new DailyCheckIn();
            this.components.wellnessMeter = new WellnessMeterController();

            this.setupGlobalEventListeners();
            this.isInitialized = true;

            console.log('Digital Wellbeing App initialized successfully');
        } catch (error) {
            console.error('Error initializing Digital Wellbeing App:', error);
        }
    }

    setupGlobalEventListeners() {
        // Handle window resize
        window.addEventListener('resize', Utils.debounce(() => {
            if (this.components.screenTime) {
                this.components.screenTime.updateVisualization();
            }
        }, 300));

        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // User switched away from tab
                this.trackTabSwitch('away');
            } else {
                // User returned to tab
                this.trackTabSwitch('return');
            }
        });

        // Error handling
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            // Could send to analytics or show user-friendly message
        });
    }

    trackTabSwitch(direction) {
        // This could be used for mindfulness features
        const timestamp = new Date().toISOString();
        const tabSwitchData = Utils.loadFromLocalStorage('tab_switches', []);
        
        tabSwitchData.push({
            direction,
            timestamp,
            url: window.location.href
        });

        // Keep only last 50 switches
        Utils.saveToLocalStorage('tab_switches', tabSwitchData.slice(-50));
    }

    // Public API methods
    getWellnessScore() {
        return this.components.wellnessMeter?.wellnessScore || 0;
    }

    exportUserData() {
        return {
            assessment: Utils.loadFromLocalStorage('wellness_assessment', {}),
            screenTime: Utils.loadFromLocalStorage('screen_time_data', []),
            checkIns: Utils.loadFromLocalStorage('daily_checkin', {}),
            tabSwitches: Utils.loadFromLocalStorage('tab_switches', [])
        };
    }

    clearUserData() {
        const keys = ['wellness_assessment', 'screen_time_data', 'daily_checkin', 'tab_switches'];
        keys.forEach(key => localStorage.removeItem(key));
        
        // Reinitialize components
        this.initializeComponents();
    }
}

// CSS Animations (to be added dynamically)
const additionalStyles = `
@keyframes float {
    0% { transform: translateY(0px); }
    100% { transform: translateY(-10px); }
}

.factor-tooltip {
    animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px) translateX(-50%);
    }
    to {
        opacity: 1;
        transform: translateY(0) translateX(-50%);
    }
}

.exercise-modal-content {
    background: var(--bg-white);
    color: var(--text-primary);
    border-radius: 1rem;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    animation: modalSlideIn 0.3s ease;
    border: 1px solid var(--border-light);
}

.exercise-modal-content.enhanced {
    background: var(--bg-white);
    color: var(--text-primary);
    border-radius: 1.5rem;
    padding: 2.5rem;
    max-width: 700px;
    width: 95%;
    max-height: 90vh;
    overflow-y: auto;
    animation: modalSlideIn 0.3s ease;
    border: 1px solid var(--border-light);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.exercise-header {
    text-align: center;
    border-bottom: 1px solid var(--border-light);
    padding-bottom: 1.5rem;
    margin-bottom: 2rem;
    position: relative;
}

.exercise-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
}

.exercise-header h2 {
    color: var(--text-primary);
    margin: 0.5rem 0;
    font-size: 2.2rem;
}

.exercise-header h3 {
    color: var(--text-primary);
    margin: 0;
}

.exercise-description {
    color: var(--text-secondary);
    font-size: 1.1rem;
    margin: 0;
    line-height: 1.6;
}

.close-exercise {
    position: absolute;
    top: -10px;
    right: -10px;
    background: var(--bg-secondary);
    border: 2px solid var(--border-light);
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.close-exercise:hover {
    background: var(--error);
    color: white;
    border-color: var(--error);
    transform: scale(1.1);
}

.exercise-intro {
    margin-bottom: 2rem;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    align-items: start;
}

.exercise-benefits h4 {
    color: var(--primary);
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

.exercise-benefits ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.exercise-benefits li {
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;
}

.exercise-benefits li::before {
    content: '✓';
    color: var(--primary);
    font-weight: bold;
    position: absolute;
    left: 0;
}

.exercise-duration {
    background: var(--bg-secondary);
    padding: 1.5rem;
    border-radius: 1rem;
    text-align: center;
    border: 1px solid var(--border-light);
}

.duration-label {
    display: block;
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.duration-time {
    display: block;
    color: var(--primary);
    font-size: 1.8rem;
    font-weight: 600;
}

.exercise-welcome {
    text-align: center;
    margin: 2rem 0;
}

.intention-input {
    margin: 1.5rem 0;
    text-align: left;
}

.intention-input label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
}

.intention-input input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-light);
    border-radius: 0.5rem;
    background: var(--bg-white);
    color: var(--text-primary);
}

.exercise-content {
    color: var(--text-primary);
}

.exercise-instruction {
    color: var(--text-primary);
    margin-bottom: 2rem;
    text-align: center;
}

.step-content h4 {
    color: var(--primary);
    margin-bottom: 1rem;
    font-size: 1.3rem;
}

.step-content p {
    font-size: 1.1rem;
    margin-bottom: 1rem;
}

.step-guidance {
    background: var(--bg-secondary);
    padding: 1rem;
    border-radius: 0.5rem;
    border-left: 4px solid var(--primary);
    margin-top: 1rem;
    font-style: italic;
    color: var(--text-secondary);
}

.exercise-timer {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
}

.timer-circle {
    position: relative;
}

.timer-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.timer-text {
    color: var(--text-primary);
    font-size: 1.5rem;
    font-weight: 600;
    display: block;
}

.timer-label {
    color: var(--text-secondary);
    font-size: 0.8rem;
}

.exercise-controls {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin: 2rem 0;
    flex-wrap: wrap;
}

.exercise-controls button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 120px;
    justify-content: center;
}

.primary-btn {
    background: var(--primary);
    color: white;
}

.primary-btn:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
}

.secondary-btn {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-light);
}

.tertiary-btn {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border-medium);
}

.success-btn {
    background: var(--success);
    color: white;
}

.hidden {
    display: none !important;
}

.exercise-footer {
    border-top: 1px solid var(--border-light);
    padding-top: 1.5rem;
    margin-top: 2rem;
}

.mindfulness-tip {
    background: var(--bg-card);
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border-light);
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.5;
}

.exercise-complete {
    text-align: center;
    padding: 2rem;
}

.complete-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: bounce 0.6s ease;
}

.completion-reflection {
    margin: 1.5rem 0;
    text-align: left;
}

.completion-reflection label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
}

.completion-reflection textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-light);
    border-radius: 0.5rem;
    background: var(--bg-white);
    color: var(--text-primary);
    resize: vertical;
}

@media (max-width: 768px) {
    .exercise-modal-content.enhanced {
        max-width: 95%;
        padding: 1.5rem;
        margin: 1rem;
    }
    
    .exercise-intro {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .exercise-controls {
        flex-direction: column;
        align-items: center;
    }
    
    .exercise-controls button {
        width: 100%;
        max-width: 250px;
    }
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: scale(0.9) translateY(-20px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

@keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0, 0, 0);
    }
    40%, 43% {
        transform: translate3d(0, -30px, 0);
    }
    70% {
        transform: translate3d(0, -15px, 0);
    }
    90% {
        transform: translate3d(0, -4px, 0);
    }
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the application
const app = new DigitalWellbeingApp();

// Export for potential external use
window.DigitalWellbeingApp = app;

console.log('Digital Self & Mental Well-being JavaScript fully loaded and initialized!');
