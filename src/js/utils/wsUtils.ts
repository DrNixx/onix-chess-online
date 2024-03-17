import { ServerPublicationContext } from 'centrifuge';
import { INotifyPacket, NOTIFY } from '../models/Chat';

export function extractNotifyPkg(ctx: ServerPublicationContext, commands?: string[]) {
    return new Promise<INotifyPacket>((resolve) => {
        if (ctx?.data?.type == NOTIFY) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { type, nonce, ...payload } = ctx.data;
            if (commands) {
                if (payload?.ctx?.command && commands.includes(payload.ctx.command)) {
                    resolve({
                        type: type,
                        ctx: payload.ctx,
                    });
                }
            } else {
                resolve({
                    type: type,
                    ctx: payload.ctx,
                });
            }
        }
    });
}
