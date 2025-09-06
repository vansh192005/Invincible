function showContent(contentId) {
    // Hide all content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected content
    document.getElementById(contentId).style.display = 'block';
}


//Animate Count

// Counting Animation Function
function animateCount(elementId) {
    const countElement = document.getElementById(elementId);
    const finalCount = parseInt(countElement.getAttribute('data-count'), 10);

    let currentCount = 0;
    const increment = Math.ceil(finalCount / 100); // Smooth increment speed

    const interval = setInterval(() => {
        currentCount += increment;
        if (currentCount >= finalCount) {
            countElement.innerText = finalCount; // Final count display
            clearInterval(interval); // Stop counting
        } else {
            countElement.innerText = currentCount;
        }
    }, 60); // Speed of counting (lower value = faster)
}

// Run animation when page loads
window.onload = () => {
    animateCount('userCount');
    animateCount('eventCount');
    animateCount('bookingCount');
};


// Events card clickable
