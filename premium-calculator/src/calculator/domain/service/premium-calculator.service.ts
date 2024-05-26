import { Injectable } from '@nestjs/common';
import { ICalculatedPremiumOption } from 'src/calculator/application/common/interfaces/calculated-premium.option';
import { IPremiumPriceItem } from 'src/calculator/application/common/interfaces/premium-price.item';
import { CalculatePremiumDto } from 'src/calculator/application/requests/calculate-premium.dto';

@Injectable()
export class PremiumCalculatorService {

  calculatePremium (calculatePremiumReq: CalculatePremiumDto, pricesTable: IPremiumPriceItem[]): ICalculatedPremiumOption[] {
    
    const customerMonthOfBirth = this.getMonthOfBirth(calculatePremiumReq.dateOfBirth);
    
    return pricesTable.filter((priceItem) => {
      return (priceItem.age_range.min <= calculatePremiumReq.age && calculatePremiumReq.age <= priceItem.age_range.max) &&
        (priceItem.plan.includes(calculatePremiumReq.plan)) &&
        (customerMonthOfBirth.toLocaleLowerCase() === priceItem.month_of_birth.toLocaleLowerCase() || priceItem.month_of_birth === '*');
    }).map((priceOption) => {
      return {
        carrier: priceOption.carrier,
        premium: priceOption.premium
      }
    });
  }

  private getMonthOfBirth(date: Date): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    date.setUTCHours(23, 0, 0, 0);
    
    return monthNames[date.getMonth()];
  }
}
