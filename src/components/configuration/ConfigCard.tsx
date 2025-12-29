import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ConfigCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}

export const ConfigCard = ({ icon, title, description, children }: ConfigCardProps) => {
  return (
    <Card className='shadow-xs'>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};