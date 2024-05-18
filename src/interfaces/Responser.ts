import { Response } from "express";

export default interface Responser {
    use(response: Response): void;
}