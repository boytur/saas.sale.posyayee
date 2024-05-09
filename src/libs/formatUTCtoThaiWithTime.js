function formatUTCtoThaiWithTime(dateTimeString) {
    try {
        const date = new Date(dateTimeString);
        const options = {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        const formattedDate = date.toLocaleString('th-TH', options);
        return formattedDate;
    }
    catch (e) {
        console.error("Couldn't format dateTimeString", e)
    }
}
export default formatUTCtoThaiWithTime;