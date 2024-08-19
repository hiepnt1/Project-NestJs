const cluster = require('cluster');
import * as os from 'os';

// Running multiple instances of NestJS
export function runInCluster(
    bootstrap: () => Promise<void>
) {
    const numberOfCores = os.cpus().length;

    if (cluster.isMaster) {
        for (let i = 0; i < numberOfCores; ++i) {
            cluster.fork();
        }
    } else {
        bootstrap();
    }
}