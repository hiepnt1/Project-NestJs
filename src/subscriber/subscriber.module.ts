import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SubsController } from "./subscriber.controller";
import { ClientProxyFactory, Transport } from '@nestjs/microservices'

@Module({
    imports: [ConfigService],
    controllers: [SubsController],
    providers: [
        {
            provide: 'SUBSCRIBERS_SERVICE',
            useFactory: (configService: ConfigService) => (
                ClientProxyFactory.create({
                    transport: Transport.TCP,
                    options: {
                        host: configService.get('SUBSCRIBERS_SERVICE_HOST'),
                        port: configService.get('SUBSCRIBERS_SERVICE_PORT'),
                    }
                })
            ),
            inject: [ConfigService]
        }
    ],

})
export class SubscriberModule { }