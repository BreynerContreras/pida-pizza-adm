
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { mes: 'Ene', gastos: 45000, presupuesto: 50000 },
  { mes: 'Feb', gastos: 42000, presupuesto: 50000 },
  { mes: 'Mar', gastos: 48000, presupuesto: 50000 },
  { mes: 'Abr', gastos: 51000, presupuesto: 55000 },
  { mes: 'May', gastos: 47000, presupuesto: 55000 },
  { mes: 'Jun', gastos: 52000, presupuesto: 55000 },
];

export const ExpenseChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos vs Presupuesto</CardTitle>
        <p className="text-sm text-gray-600">Comparación mensual de gastos ejecutados</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`B/. ${value.toLocaleString()}`, '']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="presupuesto" fill="#e5e7eb" name="Presupuesto" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gastos" fill="#3b82f6" name="Gastos Ejecutados" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
