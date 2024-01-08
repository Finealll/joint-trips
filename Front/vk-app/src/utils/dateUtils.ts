
var months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

function getFormattedSimpleDate(date: Date) : string{
    console.log(date.toDateString())
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
}

function getFormattedFullDate(date: Date) : string{
    console.log(date.toDateString())
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export default {getFormattedSimpleDate, getFormattedFullDate}