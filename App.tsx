
import React, { useState, useMemo, useEffect } from 'react';
import { 
  IPHONE_MODELS, 
  DEVICE_SPECS, 
  TELECOM_PROVIDERS, 
  MONTHLY_FEES, 
  CONTRACT_TERMS 
} from './constants';
import { CalculationResult, UserPersona } from './types';
import { getPlanAnalysis } from './services/geminiService';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

const App: React.FC = () => {
  // State
  const [modelId, setModelId] = useState(IPHONE_MODELS[0].id);
  const [storage, setStorage] = useState(Object.keys(DEVICE_SPECS[IPHONE_MODELS[0].id])[0]);
  const [providerId, setProviderId] = useState(TELECOM_PROVIDERS[0].id);
  const [fee, setFee] = useState(1399);
  const [term, setTerm] = useState(36);
  const [persona, setPersona] = useState<UserPersona>({
    dataUsage: 'high',
    budget: 'medium',
    loyalty: false,
  });

  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Constants
  const retailPrice = DEVICE_SPECS[modelId][storage];

  // Logic
  const calculation = useMemo<CalculationResult>(() => {
    // Simulated subsidy logic based on common Taiwan telecom trends
    // Subsidy usually grows with monthly fee and term
    const subsidyFactor = (fee - 399) * (term / 10) * 3;
    const baseSubsidy = Math.floor(subsidyFactor);
    const bonusSubsidy = persona.loyalty ? 2000 : 0;
    const finalSubsidy = Math.min(retailPrice, baseSubsidy + bonusSubsidy);
    
    const projectPrice = Math.max(0, retailPrice - finalSubsidy);
    const prepaymentMonths = fee > 999 ? 8 : 5;
    const prepayment = fee * prepaymentMonths; 
    const initialOutlay = projectPrice + prepayment;
    const totalContractCost = fee * term;
    const totalCostOfOwnership = totalContractCost + projectPrice;
    const avgMonthlyCost = Math.floor(totalCostOfOwnership / term);

    return {
      retailPrice,
      subsidy: finalSubsidy,
      projectPrice,
      prepayment,
      initialOutlay,
      totalContractCost,
      totalCostOfOwnership,
      avgMonthlyCost
    };
  }, [modelId, storage, fee, term, persona.loyalty, retailPrice]);

  const chartData = useMemo(() => {
    const data = [];
    for (let i = 0; i <= term; i++) {
      data.push({
        month: i,
        Contract: calculation.projectPrice + (fee * i),
        RetailOnly: retailPrice + (fee * i * 0.8), // Assuming SIM-only plan is 20% cheaper
      });
    }
    return data;
  }, [calculation, fee, term, retailPrice]);

  const handleAiAnalysis = async () => {
    setIsAiLoading(true);
    const modelName = IPHONE_MODELS.find(m => m.id === modelId)?.name || '';
    const providerName = TELECOM_PROVIDERS.find(p => p.id === providerId)?.name || '';
    const info = `${modelName} ${storage}`;
    const plan = `${providerName} ${fee}/月 (${term}個月)`;
    
    const result = await getPlanAnalysis(info, plan, calculation, persona);
    setAiAnalysis(result);
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">電信購機智囊團</h1>
          </div>
          <button 
            onClick={handleAiAnalysis}
            disabled={isAiLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-md flex items-center gap-2"
          >
            {isAiLoading ? 'AI 分析中...' : '✨ AI 智能評估'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls - Left Column */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                1. 裝置選擇
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">機型</label>
                  <select 
                    value={modelId}
                    onChange={(e) => {
                      setModelId(e.target.value);
                      setStorage(Object.keys(DEVICE_SPECS[e.target.value])[0]);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {IPHONE_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">儲存空間</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(DEVICE_SPECS[modelId]).map(s => (
                      <button
                        key={s}
                        onClick={() => setStorage(s)}
                        className={`p-2.5 rounded-xl text-sm font-medium border transition-all ${
                          storage === s 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                2. 資費方案
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">電信商</label>
                  <div className="flex gap-2">
                    {TELECOM_PROVIDERS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setProviderId(p.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                          providerId === p.id 
                          ? 'ring-2 ring-offset-1 border-transparent' 
                          : 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100'
                        }`}
                        style={{ 
                          backgroundColor: providerId === p.id ? p.color : 'white',
                          color: providerId === p.id ? 'white' : 'inherit',
                          borderColor: p.color
                        }}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">月租費</label>
                    <select 
                      value={fee}
                      onChange={(e) => setFee(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                    >
                      {MONTHLY_FEES.map(f => <option key={f} value={f}>${f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">合約期間</label>
                    <select 
                      value={term}
                      onChange={(e) => setTerm(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                    >
                      {CONTRACT_TERMS.map(t => <option key={t} value={t}>{t} 個月</option>)}
                    </select>
                  </div>
                </div>
                <div className="pt-2">
                   <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={persona.loyalty} 
                        onChange={(e) => setPersona({...persona, loyalty: e.target.checked})}
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-blue-600 transition-colors">續約 / 老客戶優惠 (+$2,000 補貼)</span>
                   </label>
                </div>
              </div>
            </section>
          </div>

          {/* Analysis - Right Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border">
                <p className="text-xs font-bold text-slate-400 uppercase">總持有成本 (TCO)</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">NT$ {calculation.totalCostOfOwnership.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400 mt-1 italic">公式: 合約購機價 + 門號總月租費</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border">
                <p className="text-xs font-bold text-slate-400 uppercase">初期應付總額</p>
                <p className="text-2xl font-bold text-red-500 mt-1">NT$ {calculation.initialOutlay.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">含購機價 + 預繳金額</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border">
                <p className="text-xs font-bold text-slate-400 uppercase">平均月支出</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">NT$ {calculation.avgMonthlyCost.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">合約期內平均每月負擔</p>
              </div>
            </div>

            {/* AI Recommendation Content */}
            {aiAnalysis && (
              <section className="bg-blue-50 border border-blue-100 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                   <span className="text-xl">✨</span> AI 智能分析報告
                </h2>
                <div className="prose prose-blue prose-sm max-w-none text-blue-900 whitespace-pre-wrap leading-relaxed">
                  {aiAnalysis}
                </div>
              </section>
            )}

            {/* Detailed Table */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border overflow-hidden">
               <h2 className="text-lg font-bold mb-6">成本結構分析</h2>
               <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-slate-600">官方建議零售價</span>
                    <span className="font-mono text-slate-800">NT$ {calculation.retailPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-slate-600">專案補貼金額</span>
                    <span className="font-mono text-green-600 font-bold">- NT$ {calculation.subsidy.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-slate-800 font-medium">合約購機價</span>
                    <span className="font-mono text-slate-800 font-medium">NT$ {calculation.projectPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <div className="flex flex-col">
                      <span className="text-slate-600">門號預繳金額 (初期支付)</span>
                      <span className="text-[10px] text-slate-400">※ 此月租方案預計折抵 {fee > 999 ? 8 : 5} 個月月租費</span>
                    </div>
                    <span className="font-mono text-slate-800">NT$ {calculation.prepayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-slate-600">門號總月租費 (${fee} x {term}個月)</span>
                    <span className="font-mono text-slate-800">NT$ {calculation.totalContractCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-bold text-lg">總持有成本 (TCO)</span>
                      <span className="text-[10px] text-slate-400 italic">計算方式: 合約購機價 + 門號總月租費</span>
                    </div>
                    <span className="font-mono text-blue-600 font-bold text-xl">NT$ {calculation.totalCostOfOwnership.toLocaleString()}</span>
                  </div>
               </div>
            </section>

            {/* Chart */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border">
               <h2 className="text-lg font-bold mb-6">累積支出曲線 (TCO Trend)</h2>
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" label={{ value: '月分', position: 'insideBottom', offset: -5 }} />
                      <YAxis tickFormatter={(val) => `${val/1000}k`} />
                      <Tooltip formatter={(val: number) => `NT$ ${val.toLocaleString()}`} />
                      <Legend verticalAlign="top" height={36}/>
                      <Line type="monotone" dataKey="Contract" name="合約購機方案" stroke="#2563eb" strokeWidth={3} dot={false} />
                      <Line type="monotone" dataKey="RetailOnly" name="買空機 + 便宜資費" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
               </div>
               <p className="text-xs text-slate-400 mt-4 italic">* 買空機對比計算假設使用約定 8 折之 SIM-Only 資費進行估算。</p>
            </section>

          </div>
        </div>
      </main>

      <footer className="mt-12 text-center text-slate-400 text-sm">
        <p>© 2024 電信購機智囊團 - 數據僅供參考，實際價格以各電信門市為準。</p>
      </footer>
    </div>
  );
};

export default App;
