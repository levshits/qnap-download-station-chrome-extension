import { storage } from 'webextension-polyfill';
import { QnapConnectionString, QnapFolder } from './Models';
import { DownloadJobModel, DownloadJobsListResponseModel } from './QnapService';

export type QnapStoreState = {
    NasConnectionSettings: QnapConnectionString,
    ConnectionInfo:{
        sid?: string,
        lastLogin?: Date
    }
    Jobs: DownloadJobModel[]
}

class QnapStore {
    defaultState: QnapStoreState = {
        NasConnectionSettings: {
            url: 'http://qnap.local:8080/',
            username: 'media',
            password: '42?gV3RBXl]1',
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
        },
        Jobs: []
    }

    initialize(){
        return storage.local.set(this.defaultState);
    }

    saveSid(sid: string) {
        storage.local.set({ConnectionInfo: {
            sid: sid,
            lastLogin: new Date()
        }});
    }

    getState(){
        return storage.local.get().then((result) => {
            return result as QnapStoreState;
        })
    }

    getConnectionSettings(){
        return this.getState().then((result) => {
            var value = result?.NasConnectionSettings ?? {
                url: '',
                username: '',
                password: ''
            };
            return value;
        });
    }

    saveConnectionSettings(value: QnapConnectionString){
        return storage.local.set({NasConnectionSettings: value, ConnectionInfo: {}});
    }

    updateJobs(response: DownloadJobsListResponseModel) {
        return storage.local.set({Jobs: response.data});
    }
}

export const qnapStore = new QnapStore();