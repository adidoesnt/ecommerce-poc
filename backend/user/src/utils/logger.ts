import chalk, { type ChalkInstance } from "chalk";
import { join } from "path";
import { writeFileSync, mkdirSync } from "fs";

enum Level {
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
    DEBUG = "DEBUG",
}

const LevelMap: Record<Level, ChalkInstance> = {
    INFO: chalk.green,
    WARN: chalk.yellow,
    ERROR: chalk.red,
    DEBUG: chalk.blue,
};

type FileNames = Record<Level, string | undefined>;

type Config = {
    fileNames?: FileNames | string;
    useSingleLogFile?: boolean;
    onlyConsole?: boolean;
    module?: string;
};

export class Logger {
    config: Config;

    constructor(
        config: Config = {
            onlyConsole: true,
        },
    ) {
        if (config.useSingleLogFile && !config.onlyConsole) {
            const fileName = config.fileNames as string;
            if (typeof fileName !== "string") {
                throw new Error(
                    "fileName should be a string when useSingleLogFile is true",
                );
            }
            config.fileNames = {
                [Level.INFO]: fileName,
                [Level.WARN]: fileName,
                [Level.ERROR]: fileName,
                [Level.DEBUG]: fileName,
            } as FileNames;
        }
        this.config = config;
    }

    getMessage(level: Level, message: string, additional?: object): string {
        const now = new Date().toLocaleString();
        const { module = "default" } = this.config;
        const preamble = `[${now}] [${module}] [${level}]`;
        !this.config.onlyConsole && this.writeMessage(level, preamble);
        const formattedPreamble = LevelMap[level](preamble);
        const formattedMessage = `${formattedPreamble} ${message} ${additional ? JSON.stringify(additional) : ""}`;
        return formattedMessage;
    }

    writeMessage(level: Level, formattedMessage: string): void {
        const fileName = (this.config.fileNames as FileNames)?.[level];
        if (fileName) {
            const dirPath = join(__dirname, "..", "..", "logs");
            mkdirSync(dirPath, { recursive: true });
            const filePath = join(dirPath, fileName);
            writeFileSync(filePath, `${formattedMessage}\n`, { flag: "a" });
        }
    }

    info(message: string, additional?: object): void {
        console.log(this.getMessage(Level.INFO, message, additional));
    }

    warn(message: string, additional?: object): void {
        console.warn(this.getMessage(Level.WARN, message, additional));
    }

    error(message: string, additional?: object): void {
        console.error(this.getMessage(Level.ERROR, message, additional));
    }

    debug(message: string, additional?: object): void {
        console.debug(this.getMessage(Level.DEBUG, message, additional));
    }
}
