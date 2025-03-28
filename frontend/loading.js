const form = document.getElementById('add-form');
const loadingOverlay = document.getElementById('loading-overlay');
const messageOverlay = document.getElementById('message-overlay');
const messageBox = document.getElementById('message-box');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    loadingOverlay.style.display = 'flex';

    setTimeout(function() {
        loadingOverlay.style.display = 'none';

        // For Martin: This is a placeholder to randomly have successes and failures. This will be replaced with actual responce from server
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
            messageBox.className = "message-box"
        }, 3000);
    }, 2000);
});
