/// <reference types="cookie-parser" />
/// <reference types="multer" />
import { Request } from 'express';
/**
 * File handler provides a set of methods to working with request's attached files.
 */
export default interface FileHandler {
    /**
     * Get files from a request
     * @param request Request
     * @param options Filter options (undefined -> all)
     * @returns Files
     */
    getFiles(request: Request, options?: GetFileOptions): Express.Multer.File[];
    /**
     * Saving a file
     * @param file Target file to save
     * @param options Save options
     * @returns Saved file path
     */
    saveFile(file: Express.Multer.File, options?: SaveFileOptions): string;
    /**
     * Saving a list of files
     * @param files Files save info
     * @returns Saved file paths
     */
    saveFiles(files: {
        file: Express.Multer.File;
        options?: SaveFileOptions;
    }[]): string[];
    /**
     * Get file extension (e.g: ts, png, jpg, ...)
     * @param file Target file
     * @returns File extension
     */
    getFileExtension(file: Express.Multer.File): string;
    /**
     * Get file name extension (e.b: ts, png, jpg, ...)
     * @param name File name
     * @returns File extension
     */
    getExtension(name: string): string;
}
/**
 * Filter options for files getting operation
 */
export interface GetFileOptions {
    /**
     * Field name filter
     */
    fieldName?: string;
    /**
     * Filter function
     * @param file Input file
     * @returns true: include | false: exclude
     */
    filter?: (file: Express.Multer.File) => boolean;
    /**
     * File extension filter
     */
    extension?: string | string[];
}
/**
 * Save file options for files saving operation
 */
export interface SaveFileOptions {
    /**
     * File save path
     */
    path?: string;
    /**
     * Custom file name
     */
    customName?: {
        name: string;
        keepExtension?: boolean;
    };
}
