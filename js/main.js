// Add the "show" class to the div after a delay (e.g., 1 second)
setTimeout(function () {
    document.querySelectorAll('.fade-in').forEach(function(element) {
        element.classList.add('show');
    });
}, 200); // 1000 milliseconds = 1 second