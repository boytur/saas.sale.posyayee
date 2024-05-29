function formatTime(dateTimeString) {
    try {
        const date = new Date(dateTimeString);
        const options = {
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
export default formatTime;