document.addEventListener('DOMContentLoaded', () => {

    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        

        const themeIcon = themeToggle.querySelector('.theme-icon');
        themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });

    const canvas = document.getElementById('traffic-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        renderTraffic();
    }
    
    function renderTraffic() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--text-secondary');
        ctx.lineWidth = 12;
        
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.5);
        ctx.lineTo(canvas.width, canvas.height * 0.5);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.5, 0);
        ctx.lineTo(canvas.width * 0.5, canvas.height);
        ctx.stroke();
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * Math.min(canvas.width, canvas.height) * 0.4;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            const intensity = Math.random();
            
            const hue = 120 - (intensity * 120);
            ctx.fillStyle = `hsla(${hue}, 80%, 50%, 0.8)`;

            ctx.beginPath();
            ctx.arc(x, y, 4 + intensity * 8, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    const locateBtn = document.getElementById('locate-btn');
    const positionData = document.getElementById('position-data');
    
    locateBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            locateBtn.disabled = true;
            positionData.textContent = "Locating...";
            
            navigator.geolocation.getCurrentPosition(
                position => {
                    const lat = position.coords.latitude.toFixed(4);
                    const lng = position.coords.longitude.toFixed(4);
                    const accuracy = position.coords.accuracy.toFixed(1);
                    positionData.textContent = `Position: ${lat}, ${lng} ±${accuracy}m`;
                    locateBtn.disabled = false;
                    
                    // Update accuracy bar
                    const accuracyPercent = Math.min(100, 100 - (position.coords.accuracy / 50 * 100));
                    document.querySelector('.accuracy-fill').style.width = `${accuracyPercent}%`;
                },
                error => {
                    positionData.textContent = "Location access denied";
                    locateBtn.disabled = false;
                }
            );
        } else {
            positionData.textContent = "Geolocation not supported";
        }
    });

    setInterval(() => {
        const statuses = ['excellent', 'good', 'poor'];
        const currentStatus = document.querySelector('.network-dot').classList[1];
        let newStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];
        
        document.querySelector('.network-dot').className = `network-dot ${newStatus}`;
        document.querySelector('.network-status span:last-child').textContent = 
            `Network: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`;
    }, 5000);
});