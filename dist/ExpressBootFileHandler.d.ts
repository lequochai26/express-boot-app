/// <reference types="cookie-parser" />
/// <reference types="multer" />
import { Request } from "express";
import FileHandler, { GetFileOptions, SaveFileOptions } from "./interfaces/FileHandler";
/**
 * An implementation of FileHandler interface provided by ExpressBoot
 */
export default class ExpressBootFileHandler implements FileHandler {
    static readonly fileTypeFilters: {
        image: (file: Express.Multer.File) => boolean;
        video: (file: Express.Multer.File) => boolean;
        text: (file: Express.Multer.File) => boolean;
        audio: (file: Express.Multer.File) => boolean;
        application: (file: Express.Multer.File) => boolean;
        font: (file: Express.Multer.File) => boolean;
        model: (file: Express.Multer.File) => boolean;
        chemical: (file: Express.Multer.File) => boolean;
    };
    constructor();
    getFiles(request: Request, options?: GetFileOptions): Express.Multer.File[];
    saveFile(file: Express.Multer.File, options?: SaveFileOptions): string;
    saveFiles(files: {
        file: Express.Multer.File;
        options: SaveFileOptions;
    }[]): string[];
    getFileExtension(file: Express.Multer.File): string;
    getExtension(name: string): string;
}
