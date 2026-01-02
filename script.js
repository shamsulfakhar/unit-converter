// --- Configuration ---
const unitOptions = {
    length: ['Meters', 'Kilometers', 'Feet', 'Miles', 'Inches'],
    mass: ['Kilograms', 'Grams', 'Pounds', 'Ounces'],
    temperature: ['Celsius', 'Fahrenheit', 'Kelvin']
};

// --- DOM Elements ---
const categoryBtns = document.querySelectorAll('.tab-btn');
const inputUnitSelect = document.getElementById('input-unit');
const outputUnitSelect = document.getElementById('output-unit');
const inputValue = document.getElementById('input-value');
const outputValue = document.getElementById('output-value');
const convertBtn = document.getElementById('convert-btn');
const saveBtn = document.getElementById('save-btn');
const favoritesList = document.getElementById('favorites-list');

let currentCategory = 'length';

// --- Functions ---

// Populate Dropdowns based on category
function populateUnits(category) {
    inputUnitSelect.innerHTML = '';
    outputUnitSelect.innerHTML = '';
    
    unitOptions[category].forEach(unit => {
        const option1 = document.createElement('option');
        option1.value = unit;
        option1.textContent = unit;
        inputUnitSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = unit;
        option2.textContent = unit;
        outputUnitSelect.appendChild(option2);
    });

    // Default selection to different units if possible
    if (unitOptions[category].length > 1) {
        outputUnitSelect.selectedIndex = 1;
    }
}

// Core Conversion Logic
function convert(val, fromUnit, toUnit, category) {
    let result;

    if (category === 'length' || category === 'mass') {
        // Normalize to base unit (Meters for length, Kilograms for mass)
        const factors = {
            'Meters': 1, 'Kilometers': 1000, 'Feet': 0.3048, 'Miles': 1609.34, 'Inches': 0.0254,
            'Kilograms': 1, 'Grams': 0.001, 'Pounds': 0.453592, 'Ounces': 0.0283495
        };
        const baseValue = val * factors[fromUnit];
        result = baseValue / factors[toUnit];
    } 
    else if (category === 'temperature') {
        if (fromUnit === toUnit) return val;
        
        let celsius;
        // To Celsius
        if (fromUnit === 'Fahrenheit') celsius = (val - 32) * 5/9;
        else if (fromUnit === 'Kelvin') celsius = val - 273.15;
        else celsius = val; // Already Celsius

        // From Celsius to Target
        if (toUnit === 'Fahrenheit') result = (celsius * 9/5) + 32;
        else if (toUnit === 'Kelvin') result = celsius + 273.15;
        else result = celsius;
    }

    return result;
}

// Handle Conversion Event
function handleConvert() {
    const val = parseFloat(inputValue.value);
    const from = inputUnitSelect.value;
    const to = outputUnitSelect.value;

    // Input Validation
    if (isNaN(val)) {
        outputValue.value = "Invalid Input";
        return;
    }

    const result = convert(val, from, to, currentCategory);
    
    // Format Result: Max 4 decimal places, remove trailing zeros
    outputValue.value = parseFloat(result.toFixed(4));
}

// Save to Favorites
function saveConversion() {
    const val = inputValue.value;
    const result = outputValue.value;
    const from = inputUnitSelect.value;
    const to = outputUnitSelect.value;

    if (!val || result === "Invalid Input") return;

    const text = `${val} ${from} → ${result} ${to}`;
    
    // Create List Item
    const li = document.createElement('li');
    li.className = 'fav-item';
    li.innerHTML = `<span>${text}</span> <small style="color:#64748b">${currentCategory}</small>`;

    // Remove "Empty" message if it exists
    const emptyMsg = document.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.remove();

    favoritesList.prepend(li);
}

// --- Event Listeners ---

// Tab Switching
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        categoryBtns.forEach(b => b.classList.remove('active'));
        // Add active to clicked
        btn.classList.add('active');
        
        currentCategory = btn.dataset.category;
        populateUnits(currentCategory);
        
        // Clear inputs
        inputValue.value = '';
        outputValue.value = '';
    });
});

convertBtn.addEventListener('click', handleConvert);
saveBtn.addEventListener('click', saveConversion);

// Initialize
populateUnits('length');