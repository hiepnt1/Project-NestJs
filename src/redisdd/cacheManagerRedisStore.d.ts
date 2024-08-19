// this library is not prepared to work with TypeScript. To deal with that, we can create our own declaration file.
declare module 'cache-manager-redis-store' {
    import { CacheStoreFactory } from '@nestjs/common/cache/interfaces/cache-manager.interface'
    const cacheStore: CacheStoreFactory
    export = cacheStore;
}