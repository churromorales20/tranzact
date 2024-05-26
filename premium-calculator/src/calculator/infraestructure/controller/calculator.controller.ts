import { Controller, Post, Res, HttpStatus, Body, BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import { CalculatorServiceApplication } from '../../application/service/calculator.service';
import { validate } from 'class-validator';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CalculatePremiumDto } from '../../application/requests/calculate-premium.dto';

@ApiTags('entries')
@Controller('calculate')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorServiceApplication) {}

  @Post('premium')
  @ApiOperation({ summary: 'Calculate premium based input data' })
  @ApiResponse({ status: 200, description: 'List of available premium options.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async calculatePremium(@Res() res: Response, @Body() calculatePremiumReq: CalculatePremiumDto) {
   
    const errors = await validate(calculatePremiumReq);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    try {
      const response = await this.calculatorService.calculatePremium(calculatePremiumReq);
      res.status(HttpStatus.OK).json({
        options: response
      });
    } catch (error) {
      console.log(error);
      
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
    }
  }
}
