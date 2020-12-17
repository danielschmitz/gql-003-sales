

export const dateToInput = date => new Date(date).toISOString().split('T')[0]

export const inputToDate = input => {
    const dt = new Date(input)
    return Date.UTC(dt.getFullYear(),dt.getMonth(),dt.getDay())
}

export const dateToDateView = date => new Date(date).toLocaleDateString().split(' ')[0]
export const dateToDateTimeView = date => new Date(date).toLocaleDateString()
