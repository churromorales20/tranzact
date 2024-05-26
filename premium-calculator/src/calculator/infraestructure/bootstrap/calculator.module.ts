import { Module } from '@nestjs/common';
import { CalculatorController } from '../controller/calculator.controller';
import { CalculatorServiceApplication } from '../../application/service/calculator.service';
import { PremiumPricingTableRepository } from '../repository/premium-pricing-table.repository';
import { PremiumCalculatorService } from '../../domain/service/premium-calculator.service';
import { PricingTableService } from 'src/calculator/domain/service/pricing-table.service';

@Module({
  imports: [],
  controllers: [CalculatorController],
  providers: [
    CalculatorServiceApplication,
    PremiumCalculatorService,
    PricingTableService,
    {
      provide: 'PremiumPricingTable',
      useClass: PremiumPricingTableRepository
    }
  ],
})
export class CalculatorModule { }
