import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { IConfigField } from '@/types/api';

interface ConfigFieldProps {
  id: string;
  field: IConfigField;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const ConfigField = ({ id, field, value, onChange, disabled, children }: ConfigFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange(undefined);
    } else {
      onChange(parseFloat(val));
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {field.label}
      </Label>
      <Input
        id={id}
        type="number"
        min={0}
        step={id === 'coinToInrRatio' ? 0.01 : 1}
        value={value ?? ''}
        placeholder="Enter value"
        onChange={handleChange}
        disabled={disabled}
        className="font-mono"
      />
      <p className="text-xs text-muted-foreground leading-relaxed">
        {field.description}
      </p>
      {children}
    </div>
  );
};