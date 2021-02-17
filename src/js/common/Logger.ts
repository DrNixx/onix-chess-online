declare global {
    interface Window {
        console: Console;
    }
}

const wnd: Window = window;
const FALSE = false;

// some convenient shortcuts.
const aps = Array.prototype.slice;
const con: Console = wnd.console;

let callback_func: any = null;
let callback_force = FALSE;

// Set default level
let log_level = 9;

// logging methods, in "priority order". Not all console implementations
// will utilize these, but they will be used in the callback passed to
// setCallback.
const log_methods = ["error", "warn", "info", "debug", "log"];

// pass these methods through to the console if they exist, otherwise just
// fail gracefully. These methods are provided for convenience.
const pass_methods: string[] =
    "assert clear count dir dirxml exception group groupCollapsed groupEnd profile profileEnd table time timeEnd trace".split(" ");

// logs are stored here so that they can be recalled as necessary.
let logs: any[] = [];

// determine if the level is visible given the current log_level.
function is_level(level: number) {
    return log_level > 0
        ? log_level > level
        : log_methods.length + log_level <= level;
}

// execute the callback function if set.
function exec_callback(args: any) {
    if (callback_func && (callback_force || !con || !con.log)) {
        callback_func.apply(wnd, args);
    }
}

export class LoggerClass {
    constructor() {
        let idx = pass_methods.length;
        while (--idx >= 0) {
            this.callPassThroughMethod(pass_methods[idx]);
        }

        idx = log_methods.length;
        while (--idx >= 0) {
            this.setLevelFunctions(idx, log_methods[idx]);
        }
    }

    public error = (message?: any, ...args: any[]) => {
    }

    public warn = (message?: any, ...args: any[]) => {
    }

    public info = (message?: any, ...args: any[]) => {
    }

    public debug = (message?: any, ...args: any[]) => {
    }

    public log = (message?: any, ...args: any[]) => {
    }

    private callPassThroughMethod(method: string) {
        // generate pass-through methods. These methods will be called, if they
        // exist, as long as the logging level is non-zero.
        (this as { [key: string]: any })[method] = function () {
            if (log_level !== 0 && con && (con as { [key: string]: any })[method]) {
                (con as { [key: string]: any })[method].apply(con, arguments);
            }
        };
    }

    private setLevelFunctions(idx: number, level: string) {
        (this as { [key: string]: any })[level] = function () {
            const args = aps.call(arguments);
            const log_arr = [level].concat(args);

            logs.push(log_arr);
            exec_callback(log_arr);

            if (!con || !is_level(idx)) { return; }

            const arg_norm = (args.length === 1) ? args[0] : args;

            (<any>con).firebug ? (con as { [key: string]: any })[level].apply(wnd, arg_norm)
                : (con as { [key: string]: any })[level] ? (con as { [key: string]: any })[level](arg_norm)
                    : con.log(arg_norm);
        };
    }

    public setCallback() {
        var args = aps.call(arguments),
            max = logs.length,
            i = max;

        callback_func = args.shift() || null;
        callback_force = typeof args[0] === "boolean" ? args.shift() : FALSE;

        i -= typeof args[0] === "number" ? args.shift() : max;

        while (i < max) {
            exec_callback(logs[i++]);
        }
    };

    // priority levels:
    // log (1) < debug (2) < info (3) < warn (4) < error (5)
    public setLevel(level: number) {
        log_level = level;
    }
}

export var Logger: LoggerClass = new LoggerClass();
if (process.env.NODE_ENV === 'production') {
    Logger.setLevel(1);
}