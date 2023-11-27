import { useEffect, useState } from 'react';
import { storage, Storage } from 'webextension-polyfill';
import { QnapStoreState } from './QnapStore';

export function useQnapStore<TValue>(selector: (state: QnapStoreState) => TValue){
    const [isInitialized, setIsInitialized] = useState(false);
    const [state, setState] = useState<TValue>();
    
    useEffect(()=> {
        storage.local.get().then((result) => {
            setState(selector(result as QnapStoreState));
            setIsInitialized(true);
        })
    });

    useEffect(()=> {
        const onChangeHandler  = (changes: Storage.StorageAreaSyncOnChangedChangesType) => {
            return  storage.local.get().then((result) => {
                setState(selector(result as QnapStoreState));
            });
        }
        storage.local.onChanged.addListener(onChangeHandler);
        return storage.local.onChanged.removeListener(onChangeHandler);
    })

    return {state, isInitialized};
}