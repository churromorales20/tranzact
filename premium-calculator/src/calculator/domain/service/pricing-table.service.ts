import { Inject, Injectable } from '@nestjs/common';
import { ICalculatedPremiumOption } from 'src/calculator/application/common/interfaces/calculated-premium.option';
import { PremiumPricingTable } from '../respository/premium-pricing-table.';
import { IPremiumPriceItem } from 'src/calculator/application/common/interfaces/premium-price.item';

@Injectable()
export class PricingTableService {
  private readonly pricingTableRepo: PremiumPricingTable;

  constructor(@Inject('PremiumPricingTable') pricingTableRepo: PremiumPricingTable) {
    this.pricingTableRepo = pricingTableRepo;
   }

  public async get(): Promise<IPremiumPriceItem[]> {
    const pricesTable = await this.pricingTableRepo.load();
    
    return pricesTable.map((priceRow) => priceRow as unknown as IPremiumPriceItem);
  }
}
