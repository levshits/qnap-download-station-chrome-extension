import * as yup from "yup";

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

export type AddSelectedLinkMessage = {
    linkUrl: string;
}

export type QnapJob = {
    id: string,
    progress: number,
    name: number
} 

export {}