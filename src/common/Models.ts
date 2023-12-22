export type QnapFolder = {
    name: string,
    tempFolder: string,
    moveFolder: string
}

export type QnapConnectionString = {
    url: string,
    username: string,
    password: string,
    folders: QnapFolder[]
}

export {}