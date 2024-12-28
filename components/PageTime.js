export default function PageTime(value) {
    const today = new Date();
    const timeValue = new Date(value);

    // Handle invalid dates
    if (isNaN(timeValue.getTime())) {
        return 'Invalid date';
    }

    const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);

    // Just now
    if (betweenTime < 1) return 'just now';

    // Minutes
    if (betweenTime < 60) {
        return `${betweenTime} ${betweenTime === 1 ? 'minute' : 'minutes'} ago`;
    }

    // Hours
    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
        return `${betweenTimeHour} ${betweenTimeHour === 1 ? 'hour' : 'hours'} ago`;
    }

    // Days
    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 30) {
        return `${betweenTimeDay} ${betweenTimeDay === 1 ? 'day' : 'days'} ago`;
    }

    // Months
    const months = Math.floor(betweenTimeDay / 30);
    if (months < 12) {
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }

    // Years
    const years = Math.floor(betweenTimeDay / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}