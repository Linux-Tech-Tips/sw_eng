const form = document.getElementById('add-form');
const addLoadingOverlay = document.getElementById('add-loading-overlay');
const messageOverlay = document.getElementById('message-overlay');
const messageBox = document.getElementById('message-box');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    addLoadingOverlay.style.display = 'flex';

    // Note: This is a placeholder to randomly have successes and failures. This will be replaced with actual responce from server

    setTimeout(function() {
        addLoadingOverlay.style.display = 'none';

        const success = Math.random() < 0.5;

        if (success) {
            messageBox.textContent = 'Submission successful!';
            messageBox.classList.add('success');
        } else {
            messageBox.textContent = 'Submission failed.';
            messageBox.classList.add('failure');
        }

        messageOverlay.style.display = 'flex';

        setTimeout(() => {
            messageOverlay.style.display = 'none';
            messageBox.className = "message-box";
        }, 1500);
    }, 4000);
});
