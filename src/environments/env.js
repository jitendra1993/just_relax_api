import {ProdEnvironment} from './prod.env.js';
import {DevEnvironment} from './dev.env.js';

// export  interface Environment {
    // db_url: string,
    // jwt_secret: string
// }

export function getEnvironmentVariables() {
    if (process.env.NODE_ENV === 'production') {
        return ProdEnvironment;
    } else {
        return DevEnvironment;
    }
}
