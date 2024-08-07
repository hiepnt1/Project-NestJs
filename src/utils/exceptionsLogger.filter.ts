import { ArgumentsHost, Catch } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch() // decorator means that we want our filter to catch all exceptions.
export class ExceptionsLoggerFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        console.log('Exception thrown', exception);
        super.catch(exception, host);
    }
}