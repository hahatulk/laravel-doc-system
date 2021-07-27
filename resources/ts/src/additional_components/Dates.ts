export function getUTCDateTime(date: any): string {
    let convertedDate = new Date(date)
    return convertedDate.getUTCFullYear() + '-' +
        ('00' + (convertedDate.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + convertedDate.getUTCDate()).slice(-2) + ' ' +
        ('00' + convertedDate.getUTCHours()).slice(-2) + ':' +
        ('00' + convertedDate.getUTCMinutes()).slice(-2) + ':' +
        ('00' + convertedDate.getUTCSeconds()).slice(-2)
}

//2000-01-19
export function getUTCDate(date: any): string {
    let convertedDate = new Date(date)
    return convertedDate.getUTCFullYear() + '-' +
        ('00' + (convertedDate.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + convertedDate.getUTCDate()).slice(-2)
}

//12.01.2001
export function getUTCPlainDate(date: any): string {
    let convertedDate = new Date(date)
    return ('00' + convertedDate.getUTCDate()).slice(-2) + '.' +
        ('00' + (convertedDate.getUTCMonth() + 1)).slice(-2) + '.' +
        convertedDate.getUTCFullYear()
}

export function getLocalDate(date: any): string {
    let convertedDate = new Date(date)
    return convertedDate.getFullYear() + '-' +
        ('00' + (convertedDate.getMonth() + 1)).slice(-2) + '-' +
        ('00' + convertedDate.getDate()).slice(-2)
}

export function getLocalDateTime(date: any): string {
    let convertedDate = new Date(date)
    return convertedDate.getFullYear() + '-' +
        ('00' + (convertedDate.getMonth() + 1)).slice(-2) + '-' +
        ('00' + convertedDate.getDate()).slice(-2) + ' ' +
        ('00' + convertedDate.getHours()).slice(-2) + ':' +
        ('00' + convertedDate.getMinutes()).slice(-2) + ':' +
        ('00' + convertedDate.getSeconds()).slice(-2)
}


//todo сделать мск время а не эту херню
export function getLocalPlainDate(date: any): string {
    let convertedDate = new Date(date)
    return ('00' + convertedDate.getDate()).slice(-2) + '.' +
        ('00' + (convertedDate.getMonth() + 1)).slice(-2) + '.' +
        convertedDate.getFullYear()
}

export function getLocalPlainYear(date: any): string {
    let convertedDate = new Date(date)
    return convertedDate.getFullYear().toString()
}

//todo сделать мск время а не эту херню
export function getLocalPlainDateTime(date: any): string {
    let convertedDate = new Date(date)
    return ('00' + convertedDate.getDate()).slice(-2) + '.' +
        ('00' + (convertedDate.getMonth() + 1)).slice(-2) + '.' +
        convertedDate.getFullYear() + ' ' +
        ('00' + convertedDate.getHours()).slice(-2) + ':' +
        ('00' + convertedDate.getMinutes()).slice(-2) + ':' +
        ('00' + convertedDate.getSeconds()).slice(-2)
}

