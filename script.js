document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
            
            // Update active link
            document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Get Started button scrolls to prediction section
    document.getElementById('get-started-btn').addEventListener('click', function() {
        document.querySelector('#predict').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Form submission handler
    const predictionForm = document.getElementById('prediction-form');
    predictionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateRisk();
    });
    
    // Update active navigation based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Initialize feature importance chart
    initFeatureChart();
});

// Mock coefficients - would be replaced with actual model coefficients
const featureCoefficients = [
    { feature: 'Age', coefficient: 0.67 },
    { feature: 'Sex (Male)', coefficient: 0.52 },
    { feature: 'Cigarettes Per Day', coefficient: 0.48 },
    { feature: 'Total Cholesterol', coefficient: 0.37 },
    { feature: 'Systolic BP', coefficient: 0.44 },
    { feature: 'Glucose', coefficient: 0.31 }
];

// Initialize feature importance chart
function initFeatureChart() {
    const ctx = document.getElementById('featureChart').getContext('2d');
    
    // Sort features by coefficient value
    const sortedFeatures = [...featureCoefficients].sort((a, b) => b.coefficient - a.coefficient);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedFeatures.map(item => item.feature),
            datasets: [{
                label: 'Feature Importance',
                data: sortedFeatures.map(item => Math.abs(item.coefficient)),
                backgroundColor: [
                    'rgba(74, 123, 163, 0.8)',
                    'rgba(74, 123, 163, 0.7)',
                    'rgba(74, 123, 163, 0.6)',
                    'rgba(74, 123, 163, 0.5)',
                    'rgba(74, 123, 163, 0.4)',
                    'rgba(74, 123, 163, 0.3)'
                ],
                borderColor: 'rgba(74, 123, 163, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Coefficient Magnitude'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Importance: ${context.raw.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

// Function to calculate risk based on form inputs
function calculateRisk() {
    // Get form values
    const age = parseFloat(document.getElementById('age').value);
    const sex = parseInt(document.getElementById('sex').value);
    const cigsPerDay = parseFloat(document.getElementById('cigsPerDay').value);
    const totChol = parseFloat(document.getElementById('totChol').value);
    const sysBP = parseFloat(document.getElementById('sysBP').value);
    const glucose = parseFloat(document.getElementById('glucose').value);
    
    // Simplified risk calculation - this would be replaced with actual model prediction
    // This is just a mock calculation for demonstration purposes
    let riskScore = 0;
    
    // Age risk (increases with age)
    riskScore += (age - 40) / 40 * featureCoefficients[0].coefficient;
    
    // Sex risk (males have higher risk)
    riskScore += sex * featureCoefficients[1].coefficient;
    
    // Smoking risk
    riskScore += (cigsPerDay / 20) * featureCoefficients[2].coefficient;
    
    // Cholesterol risk (normal range: 125-200)
    riskScore += ((totChol - 125) / 75) * featureCoefficients[3].coefficient;
    
    // Blood pressure risk (normal: 120)
    riskScore += ((sysBP - 120) / 30) * featureCoefficients[4].coefficient;
    
    // Glucose risk (normal: 70-100)
    riskScore += ((glucose - 85) / 15) * featureCoefficients[5].coefficient;
    
    // Convert to percentage (0-100)
    let riskPercentage = Math.min(Math.max(riskScore * 25 + 10, 0), 100);
    riskPercentage = riskPercentage.toFixed(1);
    
    // Display result
    document.getElementById('risk-percentage').textContent = `${riskPercentage}%`;
    
    // Rotate needle based on risk
    const rotationDegree = (riskPercentage / 100) * 180;
    document.getElementById('risk-needle').style.transform = `rotate(${rotationDegree}deg)`;
    
    // Set risk category and message
    let riskCategory, riskColor;
    
    if (riskPercentage < 10) {
        riskCategory = "Very Low Risk";
        riskColor = "#2ecc71";
    } else if (riskPercentage < 20) {
        riskCategory = "Low Risk";
        riskColor = "#27ae60";
    } else if (riskPercentage < 40) {
        riskCategory = "Moderate Risk";
        riskColor = "#f39c12";
    } else if (riskPercentage < 60) {
        riskCategory = "High Risk";
        riskColor = "#e67e22";
    } else {
        riskCategory = "Very High Risk";
        riskColor = "#e74c3c";
    }
    
    // Update risk message since there's a risk-message element in HTML
    document.getElementById('risk-message').textContent = riskCategory;
    document.getElementById('risk-message').style.color = riskColor;
    
    // Show recommendations based on risk factors
    const recommendationsList = document.getElementById('recommendations-list');
    
    // Clear previous recommendations
    recommendationsList.innerHTML = "";
    
    // Add recommendations based on risk factors
    if (age > 60) {
        addRecommendation(recommendationsList, "Consider more frequent cardiovascular checkups due to age risk factor");
    }
    
    if (sex === 1) {
        addRecommendation(recommendationsList, "Men have higher baseline risk - maintain regular cardiovascular health monitoring");
    }
    
    if (cigsPerDay > 0) {
        addRecommendation(recommendationsList, "Consider smoking cessation program - smoking significantly increases heart disease risk");
    }
    
    if (totChol > 200) {
        addRecommendation(recommendationsList, "Monitor cholesterol levels and consider dietary changes or medication");
    }
    
    if (sysBP > 130) {
        addRecommendation(recommendationsList, "Monitor blood pressure regularly and consider lifestyle changes or medication");
    }
    
    if (glucose > 100) {
        addRecommendation(recommendationsList, "Monitor blood glucose levels and consider diet modifications");
    }
    
    // Add general recommendation if risk is high
    if (riskPercentage > 30) {
        addRecommendation(recommendationsList, "Consider scheduling a comprehensive cardiovascular assessment with your healthcare provider");
    }
    
    // Show the result by removing the hidden class
    document.getElementById('result').classList.remove('hidden');
    
    // Scroll to result
    document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
}

// Helper function to add recommendations
function addRecommendation(parent, text) {
    const item = document.createElement('li');
    item.textContent = text;
    parent.appendChild(item);
}