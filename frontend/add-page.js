
var lastLink = 0;

function addLink() {
    let group = document.getElementById("add-form-group");
    ++lastLink;
    let nextLink = document.createElement("input");
    nextLink.type = "url";
    nextLink.id = "link" + lastLink;
    nextLink.name = "link" + lastLink;
    group.appendChild(nextLink);
}

function removeLink() {
    let group = document.getElementById("add-form-group");
    if(lastLink > 0) {
	group.removeChild(group.lastChild);
	--lastLink;
    }
}

async function addPage(loadingOverlay, messageBoxId, messageOverlayId) {
    const addLoadingOverlay = document.getElementById(loadingOverlay);
    const messageBox = document.getElementById(messageBoxId);
    const messageOverlay = document.getElementById(messageOverlayId);

    addLoadingOverlay.style.display = 'flex';

    let submission = "";
    for(let i = 0; i <= lastLink; ++i) {
	submission += document.getElementById("link" + i).value;
	if(i != lastLink) {
	    submission += ",";
	}
    }

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
