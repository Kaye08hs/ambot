// Initialize variables
let selectedItems = {};
let isItemAdded = false; // Track if an item has been added
let subtotal = 0; // Initialize subtotal

// Function to update selected items
function updateSelectedItems(item, quantity, price) {
    const totalPrice = quantity * price; // Calculate total price for this item

    if (selectedItems[item]) {
        // If the item is already selected, just update the quantity and total price
        selectedItems[item].quantity += quantity; // Increment quantity
        selectedItems[item].totalPrice = selectedItems[item].quantity * price; // Update total price
        alert(`${item} quantity updated to ${selectedItems[item].quantity}.`);
    } else {
        // Add new item to selected items
        selectedItems[item] = {
            quantity,
            price,
            totalPrice // Store total price
        };
        isItemAdded = true; // Mark that an item has been added
        alert(`${item} added to your order.`);
    }
    updateSelectedItemsDisplay();
    updateSubtotal(); // Update subtotal after adding items
    document.getElementById('quantity').disabled = true; // Disable quantity input after adding
    toggleProceedButton(); // Check if the proceed button should be enabled
}

// Function to update the display of selected items
function updateSelectedItemsDisplay() {
    const selectedItemsInput = document.getElementById('selected-items');
    selectedItemsInput.value = Object.entries(selectedItems)
        .map(([item, details]) => `${item} (x${details.quantity}, PHP ${details.totalPrice.toFixed(2)})`)
        .join(', ');
}

// Function to update subtotal
function updateSubtotal() {
    subtotal = Object.values(selectedItems).reduce((acc, item) => acc + item.totalPrice, 0); // Sum total prices
    document.getElementById('modal-total').textContent = `Total Amount: PHP ${subtotal.toFixed(2)}`; // Update subtotal in modal
}

// Event listener for dropdown selections
document.querySelectorAll('.dropdown-option').forEach(item => {
    item.addEventListener('click', function() {
        const selectedItem = this.textContent; // Get item name
        const price = parseFloat(this.dataset.price); // Get item price
        document.getElementById('quantity').disabled = false; // Enable quantity input
        document.getElementById('quantity').value = 1; // Reset quantity to 1
        // Store the selected item and price in the button for later use
        document.querySelector('.btn-add-to-order').dataset.selectedItem = selectedItem;
        document.querySelector('.btn-add-to-order').dataset.price = price; // Store price
    });
});

// Add to Order button functionality
document.querySelector('.btn-add-to-order').addEventListener('click', function() {
    const selectedItem = this.dataset.selectedItem; // Get selected item from button data
    const price = parseFloat(this.dataset.price); // Get selected item's price
    const quantity = parseInt(document.getElementById('quantity').value);

    if (selectedItem && quantity > 0) {
        updateSelectedItems(selectedItem, quantity, price); // Update the selected items
    } else {
        alert('Please select an item and enter a valid quantity.');
    }
});

// Proceed button functionality
document.getElementById('proceed-button').addEventListener('click', function() {
    if (!isItemAdded) {
        alert('Please add an item to your order before proceeding.');
    } else {
        // Populate modal with selected items
        renderModalItems(); // Update modal with current selected items

        // Show the modal with the total
        const modal = new bootstrap.Modal(document.getElementById('orderSummaryModal'));
        modal.show();
    }
});

// Function to render modal items with remove buttons
function renderModalItems() {
    const modalItems = document.getElementById('modal-items');
    modalItems.innerHTML = ""; // Clear previous items
    Object.entries(selectedItems).forEach(([item, details]) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'modal-item';
        itemDiv.innerHTML = `${item} (x${details.quantity}) - PHP ${details.totalPrice.toFixed(2)} 
            <button class="btn btn-danger btn-sm remove-item" data-item="${item}">Remove</button>`;
        modalItems.appendChild(itemDiv);
    });
}

// Confirm order button in modal
document.getElementById('confirm-order').addEventListener('click', function() {
    // Save selected items and subtotal in local storage before redirecting
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    localStorage.setItem('subtotal', subtotal.toFixed(2)); // Save subtotal
    window.location.href = "form.html"; // Redirect to form
});

// Initially disable the proceed button
document.getElementById('proceed-button').disabled = true; // Disable proceed button

// Toggle Proceed Button state
function toggleProceedButton() {
    document.getElementById('proceed-button').disabled = !isItemAdded; // Enable/disable button based on isItemAdded
}

// Watch for changes in selected items to enable the proceed button
const observeSelectedItems = () => {
    if (Object.keys(selectedItems).length > 0) {
        isItemAdded = true;
    } else {
        isItemAdded = false;
    }
    toggleProceedButton();
};

// Call this function when an item is added
observeSelectedItems();

// Dropdown options event listeners
document.querySelectorAll('.dropdown-option').forEach(option => {
    option.addEventListener('click', function() {
        const dropdownButton = document.getElementById('dropdownMenuButton');
        const dropdownMenu = document.querySelector('.dropdown-menu');
        const bootstrapDropdown = new bootstrap.Dropdown(dropdownMenu.parentElement); // Get the dropdown instance

        bootstrapDropdown.hide(); // Close the dropdown
    });
});

// Initial call to update selected items display
updateSelectedItemsDisplay();

// Load saved items from local storage on page load
window.onload = function() {
    const storedSelectedItems = JSON.parse(localStorage.getItem('selectedItems'));
    const storedSubtotal = localStorage.getItem('subtotal');

    // Clear selected items and subtotal when loading form.html
    selectedItems = {};
    subtotal = 0;

    // Clear local storage for selected items and subtotal
    localStorage.removeItem('selectedItems');
    localStorage.removeItem('subtotal');

    if (storedSelectedItems) {
        selectedItems = storedSelectedItems;
        observeSelectedItems(); // Check if items exist to enable proceed button
        updateSelectedItemsDisplay(); // Update display
    }

    if (storedSubtotal) {
        subtotal = parseFloat(storedSubtotal);
    }

    updateSubtotal(); // Update subtotal display
};

// Event listener for removing an item
document.getElementById('modal-items').addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-item')) {
        const itemToRemove = e.target.getAttribute('data-item');
        if (selectedItems[itemToRemove]) {
            delete selectedItems[itemToRemove]; // Remove item from selected items
            alert(`${itemToRemove} removed from your order.`); // Notify user
            renderModalItems(); // Refresh modal display
            updateSubtotal(); // Update subtotal after removing
            observeSelectedItems(); // Check if items still exist to update proceed button state
        }
    }
});
