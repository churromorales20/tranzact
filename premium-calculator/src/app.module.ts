import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CalculatorModule } from './calculator/infraestructure/bootstrap/calculator.module';

@Module({
  imports: [
    CalculatorModule,
    ConfigModule.forRoot()
  ]
})
export class AppModule {}
