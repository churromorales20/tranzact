import { Injectable } from '@nestjs/common';
import { ICalculatedPremiumOption } from '../common/interfaces/calculated-premium.option';
import { PremiumCalculatorService } from '../../domain/service/premium-calculator.service';
import { PricingTableService } from '../../domain/service/pricing-table.service';
import { CalculatePremiumDto } from '../requests/calculate-premium.dto';

@Injectable()
export class CalculatorServiceApplication {

  constructor(
    private premiumCalculator: PremiumCalculatorService,
    private pricingTable: PricingTableService
  ) { }

  public async calculatePremium(calculatePremiumReq: CalculatePremiumDto): Promise<ICalculatedPremiumOption[]> {
    const pricesTable = await this.pricingTable.get();
    console.log('pricesTable');
    console.log('pricesTable');
    console.log('pricesTable');
    console.log(pricesTable);
    
    return this.premiumCalculator.calculatePremium(calculatePremiumReq, pricesTable);
  }
}
