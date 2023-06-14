import React, { useEffect, useState } from 'react';
import { Provider }                   from 'react-redux';
import { DefaultSeo }                 from 'next-seo';
import { useRouter }                  from 'next/router';
import GoogleTagManager               from '@components/tools/GoogleTagManager';
import FacebookPixel                  from '@components/tools/FacebookPixel';
import { useStore }                   from '@lib/redux/store';
import { getAqModules, moduleHook }   from '@lib/utils';

import '@styles/normalize.css';
import '@styles/webflow.css';
import '@styles/styles.webflow.css';
import '@styles/globals.css';
import '@styles/animations.css';
import '@styles/custom.css';

const AquilaTheme = ({ Component, pageProps }) => {
    const [stateModuleHook, setStateModuleHook] = useState(null);
    const store                                 = useStore(pageProps.initialReduxState);
    const router                                = useRouter();

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    useEffect(() => {
        const globalNsModules = getAqModules()?.filter((nsModule) => nsModule.type === 'global');
        if (globalNsModules) {
            const modules = {};    
            for (const nsModule of globalNsModules) {
                modules[nsModule.code] = false;
            }
            store.dispatch({
                type: 'SET_AQMODULES',
                data: modules
            });
            setStateModuleHook(moduleHook('global'));
        } else {
            store.dispatch({
                type: 'SET_AQMODULES',
                data: {}
            });
        }
    }, []);

    return (
        <Provider store={store}>
            <GoogleTagManager>
                <FacebookPixel>
                    <DefaultSeo
                        openGraph={{
                            type: 'website'
                        }}
                        twitter={{
                            handle  : '@handle',
                            site    : '@site',
                            cardType: 'summary_large_image',
                        }}
                    />
                    { stateModuleHook }
                    <Component {...pageProps} />
                </FacebookPixel>
            </GoogleTagManager>
        </Provider>
    );
};

export default AquilaTheme;