import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Patch,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

@Controller('records')
export class RecordsController {
  private readonly logger = new Logger(RecordsController.name);

  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  async create(@Body(ValidationPipe) createRecordDto: CreateRecordDto) {
    this.logger.log(
      `Creating a new record with prompt: ${createRecordDto.promptText}`,
      RecordsController.name,
    );

    const newRecord = await this.recordsService.create(createRecordDto);

    this.logger.log(
      `Record created successfully with ID: ${newRecord.id}`,
      RecordsController.name,
    );

    return newRecord;
  }

  @Get()
  async findAll() {
    this.logger.log(`Fetching all records`, RecordsController.name);
    return this.recordsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Fetching record with ID: ${id}`, RecordsController.name);
    return this.recordsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRecordDto: UpdateRecordDto,
  ) {
    this.logger.log(`Updating record with ID: ${id}`, RecordsController.name);

    const updatedRecord = await this.recordsService.update(id, updateRecordDto);

    this.logger.log(
      `Record updated successfully with ID: ${updatedRecord.id}`,
      RecordsController.name,
    );

    return updatedRecord;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Deleting record with ID: ${id}`, RecordsController.name);

    const removedRecord = await this.recordsService.remove(id);

    this.logger.log(
      `Deleted record with ID: ${removedRecord.id}`,
      RecordsController.name,
    );

    return removedRecord;
  }
}
