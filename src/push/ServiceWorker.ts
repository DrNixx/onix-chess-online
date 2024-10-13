import { Logger } from "../common/Logger";
import { storage } from "../storage/Builder";

export default function() {
    if ('serviceWorker' in navigator && 'Notification' in window && 'PushManager' in window) {
        const updateViaCache = document.body.getAttribute('data-dev') ? 'none' : 'all';
        navigator.serviceWorker.register('/serviceWorker.js', {
            scope: '/',
            updateViaCache: updateViaCache
        }).then(reg => {
            const store = storage.make('push-subscribed');
            const vapid = document.body.getAttribute('data-vapid');
            if (vapid && Notification.permission == 'granted') {
                reg.pushManager.getSubscription().then(sub => {
                    const resub = parseInt(store.get('0'), 10) + 43200000 < Date.now(); // 12 hours
                    const applicationServerKey = Uint8Array.from(atob(vapid), c => c.charCodeAt(0));
                    if (!sub || resub) {
                        reg.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: applicationServerKey
                        }).then(sub => fetch('/api/push/subscribe', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(sub)
                        }).then(res => {
                            if (res.ok) {
                                store.set('' + Date.now());
                            } else {
                                Logger.error('submitting push subscription failed', res.statusText);
                            }
                        }), err => {
                            Logger.error('push subscribe failed', err.message);
                            if (sub) {
                                sub.unsubscribe();
                            }
                        });
                    }
                });
            } else {
                store.remove();
            }
        });
    }
}