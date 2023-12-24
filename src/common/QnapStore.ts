import { storage } from 'webextension-polyfill';
import { QnapConnectionString } from './Models';

export type QnapStoreState = {
    NasConnectionSettings: QnapConnectionString,
    ConnectionInfo:{
        sid?: string,
        lastLogin?: Date
    }
}

class QnapStore {
    defaultState: QnapStoreState = {
        NasConnectionSettings: {
            url: '',
            username: '',
            password: '',
            // url: 'http://qnap.local:8080/',
            // username: 'media',
            // password: '42?gV3RBXl]1',
            folders: [{
                name: 'Movies',
                tempFolder: 'Content/@DownloadStationTempFiles',
                moveFolder: 'Content/Movies'
            },{
                name: 'TV Series',
                tempFolder: 'Content/@DownloadStationTempFiles',
                moveFolder: 'Content/TV Series'
            }]
        },
        ConnectionInfo: {
        }
    }

    initialize(){
        return storage.sync.set(this.defaultState);
    }

    saveSid(sid: string) {
        return storage.sync.set({ConnectionInfo: {
            sid: sid,
            lastLogin: new Date()
        }});
    }

    getState(){
        return storage.sync.get().then((result) => {
            return result as QnapStoreState;
        })
    }

    saveConnectionSettings(value: QnapConnectionString){
        return storage.sync.set({NasConnectionSettings: value, ConnectionInfo: {}});
    }
}

export const qnapStore = new QnapStore();