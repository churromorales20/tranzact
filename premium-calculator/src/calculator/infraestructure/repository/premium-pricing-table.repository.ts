import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline'; 
import { PremiumPricingTable } from '../../domain/respository/premium-pricing-table.';

@Injectable()
export class PremiumPricingTableRepository implements PremiumPricingTable {
  
  private pricesDirectory = `./${process.env.FILES_PRICE_DIRECTORY}`;

  public async load(): Promise<object[]> {
    const results = [];
    const pricesFIle = await this.getMostRecentPriceFile();
    
    const filePath = path.join(__dirname, '..', `../../.${this.pricesDirectory}`, pricesFIle);

    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          throw new Error('CSV file does not exist');
        }

        const readStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
          input: readStream,
          crlfDelay: Infinity,
        });

        rl.on('line', (line) => {
          const columns = line.split(';');
          const record = {
            carrier: columns[0],
            plan: columns[1].split(','),
            state: columns[2],
            month_of_birth: columns[3],
            age_range: {
              min: parseInt(columns[4], 10),
              max: parseInt(columns[5], 10),
            },
            premium: parseFloat(columns[6]),
          };
          results.push(record);
        });

        rl.on('close', () => resolve(results));
        rl.on('error', (error) => reject(new Error(`Failed to read CSV file: ${error.message}`)));
      } catch (error) {
        reject(new Error(`Failed to load CSV file: ${error.message}`));
      }
    });
  }

  private async getMostRecentPriceFile(): Promise<string | null> {
    try {
      const files = await fs.promises.readdir(this.pricesDirectory);
      
      const csvFiles = files.filter(file => path.extname(file).toLowerCase() === '.csv');

      if (csvFiles.length === 0) {
        return null;
      }

      const fileStats = await Promise.all(
        csvFiles.map(async (file) => {
          const filePath = path.join(this.pricesDirectory, file);
          const stats = await fs.promises.stat(filePath);
          return { file, mtime: stats.mtime };
        })
      );

      const mostRecentFile = fileStats.reduce((latest, current) => {
        return current.mtime > latest.mtime ? current : latest;
      });

      return mostRecentFile.file;
    } catch (error) {
      console.error('Error al obtener el archivo CSV más reciente:', error);
      return null;
    }
  }
}
