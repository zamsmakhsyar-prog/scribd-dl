const downloadButton = document.getElementById('download');
downloadButton.addEventListener('click', () => {
    const url = document.getElementById('url').value;
    // यहां आप URL के साथ कुछ कर सकते हैं, जैसे कि इसे सर्वर पर भेजना
    console.log('Downloading:', url);
});
