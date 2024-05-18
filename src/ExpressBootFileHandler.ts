import { Request } from "express";
import ExpressBootContext from "./ExpressBootContext";
import FileHandler, { GetFileOptions, SaveFileOptions } from "./interfaces/FileHandler";
import fs from 'fs';
import { config } from "dotenv";

// .ENV Configurations
config();
const staticResourcesPath: string = process.env.STATIC_RESOURCES_PATH || "./assets";

/**
 * An implementation of FileHandler interface provided by ExpressBoot
 */
@ExpressBootContext.node("fileHandler")
export default class ExpressBootFileHandler implements FileHandler {
    // Static methods:
    public static readonly fileTypeFilters = {
        image: function (file: Express.Multer.File): boolean {
            return file.mimetype.startsWith("image/");
        },
        video: function (file: Express.Multer.File): boolean {
            return file.mimetype.startsWith("video/")
        },
        text: function (file: Express.Multer.File): boolean {
            return file.mimetype.startsWith("text/");
        },
        audio: function (file: Express.Multer.File): boolean {
            return file.mimetype.startsWith("audio/");
        },
        application: function (file: Express.Multer.File): boolean {
            return file.mimetype.startsWith("application/");
        },
        font: function (file: Express.Multer.File): boolean {
            return file.mimetype.startsWith("font/");
        },
        model: function (file: Express.Multer.File): boolean {
            return file.mimetype.startsWith("model/");
        },
        chemical: function (file: Express.Multer.File): boolean {
            return file.mimetype.startsWith("chemical/");
        },
    }

    // Constructors:
    public constructor() {

    }

    // Methods:
    public getFiles(request: Request, options?: GetFileOptions): Express.Multer.File[] {
        // Get files from request
        let files = request.files;

        // Convert to array if files is an object
        if (!(files instanceof Array)) {
            files = Object.keys(files)
                .map(
                    fieldName => files[fieldName]
                );
        }

        // Filtering
        if (options) {
            if (options.fieldName) {
                files = files.filter(file => file.fieldname === options.fieldName);
            }
    
            if (options.filter) {
                files = files.filter(options.filter);
            }
    
            if (options.extension) {
                files = files.filter(file => (
                    typeof options.extension === 'string'
                    ?
                    this.getFileExtension(file) === options.extension
                    :
                    options.extension.includes(
                        this.getFileExtension(file)
                    )
                ));
            }
        }

        // Return files
        return files;
    }

    public saveFile(file: Express.Multer.File, options?: SaveFileOptions): string {
        // Get file name
        let fileName: string = file.originalname;
        let path: string = staticResourcesPath;

        // Custom options application
        if (options) {
            if (options.path) {
                path = options.path;
            }

            if (options.customName) {
                if (!options.customName.keepExtension) {
                    fileName = options.customName.name;
                }
                else {
                    fileName = `${options.customName.name}.${this.getFileExtension(file)}`
                }
            }
        }

        // Get file save path
        const savePath: string = `${path}${!path.endsWith("/") ? "/" : ""}${fileName}`;

        // Make sure directory exists before saving
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }

        // Saving
        fs.writeFileSync(savePath, file.buffer);

        // Return save path
        return savePath;
    }

    public saveFiles(files: { file: Express.Multer.File; options: SaveFileOptions; }[]): string[] {
        // Saved paths definition
        const savedPaths: string[] = [];

        // Saving
        files.map(
            file => {
                const mapped: [ Express.Multer.File, SaveFileOptions ] = [ file.file, file.options ];
                return mapped;
            }
        )
        .forEach( args => savedPaths.push(this.saveFile(...args)) );

        // Return saved paths
        return savedPaths;
    }

    public getFileExtension(file: Express.Multer.File): string {
        return this.getExtension(file.originalname);
    }

    public getExtension(name: string): string {
        return name.slice(
            name.lastIndexOf('.')+1,
            name.length
        );
    }
}