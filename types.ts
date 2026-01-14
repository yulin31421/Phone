
export interface DeviceSpec {
  model: string;
  storage: string;
  price: number;
}

export interface TelecomPlan {
  id: string;
  provider: string;
  monthlyFee: number;
  term: number; // in months
  data: string;
  calls: string;
}

export interface CalculationResult {
  retailPrice: number;
  subsidy: number;
  projectPrice: number;
  prepayment: number;
  initialOutlay: number;
  totalContractCost: number;
  totalCostOfOwnership: number;
  avgMonthlyCost: number;
}

export interface UserPersona {
  dataUsage: 'low' | 'medium' | 'high';
  budget: 'low' | 'medium' | 'high';
  loyalty: boolean;
}
