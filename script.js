
document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById('download');
    const urlInput = document.getElementById('url');
    const messageDiv = document.createElement('div');
    document.body.appendChild(messageDiv);

    downloadButton.addEventListener('click', async () => {
        const url = urlInput.value;
        if (!url) {
            messageDiv.textContent = 'Please enter a URL.';
            messageDiv.style.color = 'red';
            return;
        }

        messageDiv.textContent = 'Starting download...';
        messageDiv.style.color = 'black';

        try {
            const response = await fetch('/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            const result = await response.json();

            if (response.ok) {
                messageDiv.textContent = `Download finished! Output: ${result.output}`;
                messageDiv.style.color = 'green';
            } else {
                messageDiv.textContent = `Error: ${result.message}`;
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Fetch error:', error);
            messageDiv.textContent = 'Failed to connect to the server.';
            messageDiv.style.color = 'red';
        }
    });
});
