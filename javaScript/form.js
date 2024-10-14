// Function to handle phone input validation
document.getElementById('phone').addEventListener('input', function (e) {
    this.value = this.value.replace(/[a-zA-Z\s]/g, ''); // Remove letters
});

// Function to handle input validation for name and address fields
document.getElementById('name').addEventListener('input', function (e) {
    if (this.value.length === 1 && this.value === ' ') {
        this.value = ''; // Disallow space as the first character
    }
});

document.getElementById('address').addEventListener('input', function (e) {
    if (this.value.length === 1 && this.value === ' ') {
        this.value = ''; // Remove the space if it's the first character
    }
});

// Function to handle loading of data from local storage on page load
window.onload = function() {
    // Retrieve selected items, subtotal, and customer details from local storage
    const selectedItems = JSON.parse(localStorage.getItem('selectedItems')) || {};
    const subtotal = localStorage.getItem('subtotal');
    const customerDetails = JSON.parse(localStorage.getItem('customerDetails')) || {};

    // Populate the selected items input (if needed)
    document.getElementById('mealChosen').value = Object.entries(selectedItems)
        .map(([item, details]) => `${item} (x${details.quantity}, PHP ${details.totalPrice.toFixed(2)})`)
        .join(', ');

    // Set the subtotal in the corresponding input
    if (subtotal) {
        document.getElementById('subtotal').value = `PHP ${parseFloat(subtotal).toFixed(2)}`; // Format subtotal
    }

    // Populate customer details
    document.getElementById('name').value = customerDetails.name || '';
    document.getElementById('phone').value = customerDetails.phone || '';
    document.getElementById('address').value = customerDetails.address || '';

    // Update order details
    const deliveryFee = 52.00;
    const total = parseFloat(subtotal) + deliveryFee;

    document.getElementById('deliveryFee').value = `PHP ${deliveryFee.toFixed(2)}`;
    document.getElementById('total').value = `PHP ${total.toFixed(2)}`;
};

// Function to handle additional meal option
document.querySelectorAll('input[name="additionalMeal"]').forEach((input) => {
    input.addEventListener('change', function() {
        if (this.value === 'yes') {
            // Save current form data to local storage
            const customerDetails = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value
            };
            localStorage.setItem('customerDetails', JSON.stringify(customerDetails));

            // Redirect to index.html to add more items
            window.location.href = "index.html";
        }
    });
});

// Add the selected meal to local storage when the button is clicked
document.getElementById('changeMeal').addEventListener('click', function() {
    const mealChosen = document.getElementById('mealChosen').value;
    const selectedItems = JSON.parse(localStorage.getItem('selectedItems')) || {};

    // Save the meal to the selectedItems object
    if (mealChosen) {
        if (!selectedItems[mealChosen]) {
            selectedItems[mealChosen] = { quantity: 1, totalPrice: parseFloat(document.getElementById('subtotal').value.replace('PHP ', '')) || 0 };
        } else {
            selectedItems[mealChosen].quantity += 1; // Increment the quantity if the meal is already selected
            selectedItems[mealChosen].totalPrice += parseFloat(document.getElementById('subtotal').value.replace('PHP ', '')); // Update total price
        }
        localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    }

    // Redirect to index.html
    window.location.href = "index.html";
});

// Update subtotal and total in local storage after an additional meal is added
function updateTotals() {
    const selectedItems = JSON.parse(localStorage.getItem('selectedItems')) || {};
    let newSubtotal = 0;

    // Calculate new subtotal
    for (const item in selectedItems) {
        newSubtotal += selectedItems[item].totalPrice;
    }

    localStorage.setItem('subtotal', newSubtotal.toFixed(2)); // Save subtotal
}

// Call updateTotals whenever meals are added or changed
window.addEventListener('beforeunload', updateTotals);

// Validate form before submission
document.getElementById('orderForm').addEventListener('submit', function (e) {
    // Get input values
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    // Validate that none of the fields are blank
    if (name === '') {
        alert('Please enter your name.');
        e.preventDefault(); // Stop form submission
        return;
    }

    if (phone === '') {
        alert('Please enter your phone number.');
        e.preventDefault(); // Stop form submission
        return;
    }

    if (address === '') {
        alert('Please enter your address.');
        e.preventDefault(); // Stop form submission
        return;
    }

    // Optionally, you can add more validation here (e.g., phone format, address format)
});

document.getElementById("orderForm").addEventListener("submit", function(event){
    event.preventDefault(); // Prevent the form from submitting
    window.location.href = "lastPage.html"; // Redirect to another page
});
