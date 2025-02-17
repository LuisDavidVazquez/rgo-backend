import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SimClientIccidsService } from './sim_client_iccids.service';
import { CreateSimClientIccidDto } from './dto/create-sim_client_iccid.dto';
import { UpdateSimClientIccidDto } from './dto/update-sim_client_iccid.dto';

@Controller('sim-client-iccids')
export class SimClientIccidsController {
  constructor(private readonly simClientIccidsService: SimClientIccidsService) {}

  @Post()
  create(@Body() createSimClientIccidDto: CreateSimClientIccidDto) {
    // console.log(createSimClientIccidDto,' este es createSimClientIccidDto');
    return this.simClientIccidsService.create(createSimClientIccidDto);
  }

  @Get()
  findAll() {
    return this.simClientIccidsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.simClientIccidsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSimClientIccidDto: UpdateSimClientIccidDto) {
    return this.simClientIccidsService.update(+id, updateSimClientIccidDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.simClientIccidsService.remove(+id);
  }
}
