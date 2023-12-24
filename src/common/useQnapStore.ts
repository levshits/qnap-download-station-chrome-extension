import { useEffect, useState } from 'react';
import { storage, Storage } from 'webextension-polyfill';
import { QnapStoreState } from './QnapStore';

export function useQnapStore<TValue>(selector: (state: QnapStoreState) => TValue){
    const [isInitialized, setIsInitialized] = useState(false);
    const [state, setState] = useState<TValue>();
    
    useEffect(()=> {
        storage.sync.get().then((result) => {
            setState(selector(result as QnapStoreState));
            setIsInitialized(true);
        })
    }, []);

    useEffect(()=> {
        let innerState = state;
        const onChangeHandler  = async (changes: Storage.StorageAreaSyncOnChangedChangesType) => {
            let result = await storage.sync.get();
            const value = selector(result as QnapStoreState);
            if(JSON.stringify(innerState) != JSON.stringify(value)) {
                innerState = value;
                setState(value);
            }
        }
        storage.sync.onChanged.addListener(onChangeHandler);
        return () => storage.sync.onChanged.removeListener(onChangeHandler);
    }, [])

    return {state, isInitialized};
}