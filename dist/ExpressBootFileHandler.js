"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ExpressBootContext_1 = __importDefault(require("./ExpressBootContext"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = require("dotenv");
// .ENV Configurations
(0, dotenv_1.config)();
const staticResourcesPath = process.env.STATIC_RESOURCES_PATH || "./assets";
/**
 * An implementation of FileHandler interface provided by ExpressBoot
 */
let ExpressBootFileHandler = class ExpressBootFileHandler {
    // Static methods:
    static fileTypeFilters = {
        image: function (file) {
            return file.mimetype.startsWith("image/");
        },
        video: function (file) {
            return file.mimetype.startsWith("video/");
        },
        text: function (file) {
            return file.mimetype.startsWith("text/");
        },
        audio: function (file) {
            return file.mimetype.startsWith("audio/");
        },
        application: function (file) {
            return file.mimetype.startsWith("application/");
        },
        font: function (file) {
            return file.mimetype.startsWith("font/");
        },
        model: function (file) {
            return file.mimetype.startsWith("model/");
        },
        chemical: function (file) {
            return file.mimetype.startsWith("chemical/");
        },
    };
    // Constructors:
    constructor() {
    }
    // Methods:
    getFiles(request, options) {
        // Get files from request
        let files = request.files;
        // Convert to array if files is an object
        if (!(files instanceof Array)) {
            files = Object.keys(files)
                .map(fieldName => files[fieldName]);
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
                files = files.filter(file => (typeof options.extension === 'string'
                    ?
                        this.getFileExtension(file) === options.extension
                    :
                        options.extension.includes(this.getFileExtension(file))));
            }
        }
        // Return files
        return files;
    }
    saveFile(file, options) {
        // Get file name
        let fileName = file.originalname;
        let path = staticResourcesPath;
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
                    fileName = `${options.customName.name}.${this.getFileExtension(file)}`;
                }
            }
        }
        // Get file save path
        const savePath = `${path}${!path.endsWith("/") ? "/" : ""}${fileName}`;
        // Make sure directory exists before saving
        if (!fs_1.default.existsSync(path)) {
            fs_1.default.mkdirSync(path);
        }
        // Saving
        fs_1.default.writeFileSync(savePath, file.buffer);
        // Return save path
        return savePath;
    }
    saveFiles(files) {
        // Saved paths definition
        const savedPaths = [];
        // Saving
        files.map(file => {
            const mapped = [file.file, file.options];
            return mapped;
        })
            .forEach(args => savedPaths.push(this.saveFile(...args)));
        // Return saved paths
        return savedPaths;
    }
    getFileExtension(file) {
        return this.getExtension(file.originalname);
    }
    getExtension(name) {
        return name.slice(name.lastIndexOf('.') + 1, name.length);
    }
};
ExpressBootFileHandler = __decorate([
    ExpressBootContext_1.default.node("fileHandler"),
    __metadata("design:paramtypes", [])
], ExpressBootFileHandler);
exports.default = ExpressBootFileHandler;
//# sourceMappingURL=ExpressBootFileHandler.js.map