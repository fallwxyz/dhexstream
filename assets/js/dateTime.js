
function updateSystemDate() {
    const now = new Date();

    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour12: false
    });

    const parts = formatter.formatToParts(now);

    const get = (type) => parts.find(p => p.type === type).value;

    const formatted = `${get('hour')}:${get('minute')}:${get('second')} <br> ${get('day')}/${get('month')}/${get('year')}`;

    document.getElementById('systemDate').textContent = formatted;
    document.getElementById('systemDate').innerHTML = formatted;
}

updateSystemDate();
setInterval(updateSystemDate, 1000); // realtime tiap detik