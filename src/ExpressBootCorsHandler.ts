import { CorsOptions } from "cors";

type ExpressBootCorsHandler = () => CorsOptions;
export default ExpressBootCorsHandler;