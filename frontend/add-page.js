

async function addPage(urlBoxId, loadingOverlay, messageBoxId, messageOverlayId) {
    const addLoadingOverlay = document.getElementById(loadingOverlay);
    const messageBox = document.getElementById(messageBoxId);
    const messageOverlay = document.getElementById(messageOverlayId);

    addLoadingOverlay.style.display = 'flex';

    const urlBox = document.getElementById(urlBoxId);
    const submission = urlBox.value;

    let success = "Error";

    try {

	console.log(submission);
        let response = await fetch('https://addpage-pl4q2xpkfq-uc.a.run.app/', {
            method: "POST",
            body: new URLSearchParams({
                urls: submission
            })
        });
	console.log(response);

        if(response.ok) {
            success = true;
        } else {
            success = response.statusText;
        }

    } catch(error) {
        success = error.toString();
    }

    addLoadingOverlay.style.display = 'none';

    // Use a catch
    if (success === true) {
        messageBox.textContent = 'Submission successful!';
        messageBox.classList.add("success");
    } else {
        messageBox.textContent = 'Submission failed. Error: ' + success;
        messageBox.classList.add("failure");
    }
    messageOverlay.style.display = 'flex';
}
