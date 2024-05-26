import { Test, TestingModule } from '@nestjs/testing';
import { CalculatorController } from '../controller/calculator.controller';
import { CalculatorServiceApplication } from '../../application/service/calculator.service';
import { PremiumCalculatorService } from '../../domain/service/premium-calculator.service';
import { PricingTableService } from '../../domain/service/pricing-table.service';
import { PremiumPricingTableRepository } from '../repository/premium-pricing-table.repository';
import { CalculatePremiumDto } from '../../application/requests/calculate-premium.dto';
import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { Response } from 'express';
import { promises as fsPromises } from 'fs';
import * as fs from 'fs';
import * as readline from 'readline';

jest.mock('class-validator', () => ({
  ...jest.requireActual('class-validator'),
  validate: jest.fn(),
}));

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn().mockReturnValue(true),
  promises: {
    readdir: jest.fn(),
    stat: jest.fn(),
  },
  createReadStream: jest.fn(),
}));

jest.mock('readline', () => ({
  ...jest.requireActual('readline'),
  createInterface: jest.fn(),
}));

describe('CalculatorController', () => {
  let appController: CalculatorController;
  let calculatorService: CalculatorServiceApplication;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
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
    }).compile();
    
    appController = app.get<CalculatorController>(CalculatorController);
    calculatorService = app.get<CalculatorServiceApplication>(CalculatorServiceApplication);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      const calculatePremiumReq: CalculatePremiumDto = {
        dateOfBirth: new Date('1990-07-01'),
        state: 'NY',
        age: 34,
        plan: 'A',
      };

      const response = [
        {
          premium: 9000,
          carrier: 'INSURANCE COMPANY'
        }
      ];
      process.env.FILES_PRICE_DIRECTORY = 'DIRECTORY';
      (validate as jest.Mock).mockResolvedValue([]); // No errors
      const mockFiles = [
        'file1.xls',
        'file2.csv',
        'recent-file.csv',
      ];

      const mockStats = [
        { mtime: new Date('2022-01-01') },
        { mtime: new Date('2022-01-02') }
      ];

      const mockReadStream = {
        on: jest.fn(),
      };
      (fs.createReadStream as jest.Mock).mockReturnValue(mockReadStream);

      (fsPromises.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fsPromises.stat as jest.Mock)
        .mockResolvedValueOnce(mockStats[0])
        .mockResolvedValueOnce(mockStats[1])
        
      const mockRl = {
        on: jest.fn(),
        close: jest.fn(),
      };
      (readline.createInterface as jest.Mock).mockReturnValue(mockRl);

      // Simular eventos de readline
      (mockRl.on as jest.Mock).mockImplementation((event, callback) => {
        if (event === 'line') {
          callback('INSURANCE COMPANY;A;NY;July;20;40;9000');
        } else if (event === 'close') {
          callback();
        }
        return mockRl;
      });

      await appController.calculatePremium(mockResponse, calculatePremiumReq);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(response);
    });
  });
});
