// ===== Global State =====
let currentStep = 1;
const formData = {
    propertyType: '',
    area: '',
    rooms: '',
    year: '',
    zip: ''
};

// ===== Modal Functions =====
function openFunnel() {
    const modal = document.getElementById('funnelModal');
    modal.classList.add('active');
    goToStep(1);
}

function closeFunnel() {
    const modal = document.getElementById('funnelModal');
    modal.classList.remove('active');
    resetFunnel();
}

function resetFunnel() {
    currentStep = 1;
    formData.propertyType = '';
    formData.area = '';
    formData.rooms = '';
    formData.year = '';
    formData.zip = '';
    document.getElementById('leadForm').reset();
}

function goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.funnel-step').forEach(el => {
        el.classList.add('hidden');
    });

    // Show current step
    const stepEl = document.getElementById(`step${step}`);
    if (stepEl) {
        stepEl.classList.remove('hidden');
        currentStep = step;
    }
}

function selectProperty(type) {
    formData.propertyType = type;
    goToStep(2);
}

function validateStep2() {
    const area = document.getElementById('area').value;
    const rooms = document.getElementById('rooms').value;
    const year = document.getElementById('year').value;

    if (!area || !rooms || !year) {
        alert('Bitte füllen Sie alle Felder aus.');
        return;
    }

    if (area < 1) {
        alert('Bitte geben Sie eine gültige Wohnfläche ein.');
        return;
    }

    if (year < 1800 || year > 2026) {
        alert('Bitte geben Sie ein gültiges Baujahr ein.');
        return;
    }

    formData.area = area;
    formData.rooms = rooms;
    formData.year = year;
    goToStep(3);
}

function validateStep3() {
    const zip = document.getElementById('zip').value;

    if (!zip || !/^[0-9]{5}$/.test(zip)) {
        alert('Bitte geben Sie eine gültige 5-stellige Postleitzahl ein.');
        return;
    }

    formData.zip = zip;
    goToStep(4);
}

// ===== Form Submission =====
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('leadForm');

    if (form) {
        // Set FormSubmit.co endpoint
        form.action = 'https://formsubmit.co/mehmet.oezyildirim2@hotmail.com';
        form.method = 'POST';

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Populate hidden fields
            document.getElementById('hiddenPropertyType').value = formData.propertyType;
            document.getElementById('hiddenArea').value = formData.area;
            document.getElementById('hiddenRooms').value = formData.rooms;
            document.getElementById('hiddenYear').value = formData.year;
            document.getElementById('hiddenZip').value = formData.zip;

            // Show loading state
            const submitBtn = document.getElementById('submitBtn');
            const submitText = document.getElementById('submitText');
            const submitLoader = document.getElementById('submitLoader');

            submitBtn.disabled = true;
            submitText.classList.add('hidden');
            submitLoader.classList.remove('hidden');

            // Create FormData and submit
            const formDataObj = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formDataObj,
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => {
                    if (response.ok) {
                        alert('Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns in Kürze.');
                        closeFunnel();
                    } else {
                        throw new Error('Fehler beim Senden');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitText.classList.remove('hidden');
                    submitLoader.classList.add('hidden');
                });
        });
    }
});

// ===== Animated Counters =====
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, duration / steps);
}

// Intersection Observer for stats
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            animateCounter(entry.target);
        }
    });
}, observerOptions);

// Observe all stat numbers
document.addEventListener('DOMContentLoaded', function () {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => observer.observe(stat));
});

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Close modal on outside click =====
window.addEventListener('click', function (event) {
    const modal = document.getElementById('funnelModal');
    if (event.target === modal) {
        closeFunnel();
    }
});

// ===== Escape key to close modal =====
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeFunnel();
    }
});


// ===== Dedicated Funnel Page Logic (bewertung.html) =====

// State for the dedicated funnel
const funnelState = {
    step: 1,
    data: {}
};

function selectFunnelProperty(type) {
    document.getElementById('h-type').value = type;
    nextStep(2);
}

function nextStep(step) {
    // Hide current step
    document.querySelector(`#f-step${funnelState.step}`).classList.add('hidden');

    // Show new step
    document.querySelector(`#f-step${step}`).classList.remove('hidden');

    // Update state
    funnelState.step = step;

    // Update Progress Bar
    updateProgress(step);
}

function prevStep(step) {
    // Hide current step
    document.querySelector(`#f-step${funnelState.step}`).classList.add('hidden');

    // Show previous step
    document.querySelector(`#f-step${step}`).classList.remove('hidden');

    // Update state
    funnelState.step = step;

    // Update Progress Bar
    updateProgress(step);
}

function updateProgress(step) {
    const totalSteps = 6;
    const progress = (step / totalSteps) * 100;

    const fill = document.getElementById('progressFill');
    const text = document.getElementById('stepText');
    const label = document.getElementById('stepLabel');

    if (fill) fill.style.width = `${progress}%`;
    if (text) text.textContent = `Schritt ${step} von ${totalSteps}`;

    // Optional: Update label based on step
    const labels = [
        "Immobilienart",
        "Eckdaten",
        "Motivation",
        "Zeitplan",
        "Lage",
        "Kontakt"
    ];
    if (label) label.textContent = labels[step - 1];
}

function validateFunnelStep2() {
    const area = document.getElementById('f-area').value;
    const rooms = document.getElementById('f-rooms').value;
    const year = document.getElementById('f-year').value;
    const condition = document.getElementById('f-condition').value;

    if (!area || !rooms || !year || !condition) {
        alert('Bitte füllen Sie alle Felder aus.');
        return;
    }

    // Save data
    document.getElementById('h-area').value = area;
    document.getElementById('h-rooms').value = rooms;
    document.getElementById('h-year').value = year;
    document.getElementById('h-condition').value = condition;

    nextStep(3);
}

function validateFunnelStep5() {
    const zip = document.getElementById('f-zip').value;

    if (!zip || !/^[0-9]{5}$/.test(zip)) {
        alert('Bitte geben Sie eine gültige PLZ ein.');
        return;
    }

    document.getElementById('h-zip').value = zip;
    document.getElementById('h-city').value = document.getElementById('f-city').value;
    document.getElementById('h-street').value = document.getElementById('f-street').value;

    nextStep(6);
}

// Full Funnel Submission
document.addEventListener('DOMContentLoaded', function () {
    const fullFunnelForm = document.getElementById('fullFunnelForm');

    if (fullFunnelForm) {
        fullFunnelForm.action = 'https://formsubmit.co/mehmet.oezyildirim2@hotmail.com';
        fullFunnelForm.method = 'POST';

        fullFunnelForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get values from radio buttons
            const motivationQuery = document.querySelector('input[name="motivation"]:checked');
            if (motivationQuery) document.getElementById('h-motivation').value = motivationQuery.value;

            const timelineQuery = document.querySelector('input[name="timeline"]:checked');
            if (timelineQuery) document.getElementById('h-timeline').value = timelineQuery.value;

            // Submit logic
            const btn = document.getElementById('finalSubmitBtn');
            const originalText = btn.innerText;
            btn.disabled = true;
            btn.innerText = "Wird gesendet...";

            const formDataObj = new FormData(fullFunnelForm);

            fetch(fullFunnelForm.action, {
                method: 'POST',
                body: formDataObj,
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => {
                    if (response.ok) {
                        // Success State
                        document.querySelector('.funnel-card').innerHTML = `
                        <div style="text-align: center; padding: 3rem 1rem;">
                            <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
                            <h2 style="font-size: 2rem; color: #1e293b; margin-bottom: 1rem; font-weight: bold;">Vielen Dank!</h2>
                            <p style="color: #64748b; font-size: 1.1rem; margin-bottom: 2rem;">
                                Wir haben Ihre Daten erhalten und erstellen Ihre individuelle Bewertung.<br>
                                Sie hören in Kürze von uns.
                            </p>
                            <a href="index.html" class="btn-primary" style="text-decoration:none;">Zurück zur Startseite</a>
                        </div>
                    `;
                    } else {
                        throw new Error('Fehler beim Senden');
                    }
                })
                .catch(error => {
                    console.error(error);
                    alert('Es gab ein Problem. Bitte versuchen Sie es erneut.');
                    btn.disabled = false;
                    btn.innerText = originalText;
                });
        });
    }
});
