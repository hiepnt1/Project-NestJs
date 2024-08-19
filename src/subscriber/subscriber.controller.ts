import { Body, ClassSerializerInterceptor, Controller, Get, Inject, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { ClientProxy } from '@nestjs/microservices';
import CreateSubscriberDto from "nestjs-email-subscriptions/src/subscribler/dto/createSubscriber.dto";
import { JwtAuthGuard } from "src/authentication/guard/jwtAuthenticationGuard.guard";


@Controller('subscriber')
@UseInterceptors(ClassSerializerInterceptor)
export class SubsController {
    constructor(
        @Inject('SUBSCRIBERS_SERVICE')
        private subService: ClientProxy
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getSubscriber() {
        return this.subService.send({
            cmd: 'get-all-subscribers'
        }, '')
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async addSubscriber(@Body() subscriber: CreateSubscriberDto) {
        return this.subService.send({
            cmd: "add-subscriber"
        }, subscriber)
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createPost(@Body() subscriber: CreateSubscriberDto) {
        return this.subService.emit({
            cmd: 'add-subscriber'
        }, subscriber)
    }
}