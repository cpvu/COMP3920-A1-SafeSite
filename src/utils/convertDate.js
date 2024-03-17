function convertDate(date) {
    const givenDate = new Date(date);
    const currentDate = new Date();

    const differenceInMilliseconds = currentDate - givenDate;

    givenDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const differenceInDays = Math.round(
        differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    if (differenceInDays === 0) {
        return "Today";
    } else if (differenceInDays === 1) {
        return "Yesterday";
    }
    return `${differenceInDays} Days Ago`;
}

module.exports = { convertDate };
