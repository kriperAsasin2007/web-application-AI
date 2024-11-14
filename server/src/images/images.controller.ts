import { Controller, Post, Body } from '@nestjs/common';
import { ImagesService } from './images.service';

import { CancelDto, GenerateImageDto } from './dto';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('/cancel')
  async cancel(@Body() cancelDto: CancelDto) {
    return this.imagesService.cancel(cancelDto);
  }

  @Post('/generate')
  async generateImage(
    @GetCurrentUserId() userId: string,
    @Body() generateImageDto: GenerateImageDto,
  ) {
    return await this.imagesService.generateImage(userId, generateImageDto);
  }
}
